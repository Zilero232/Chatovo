//! Resolves a running process to a Steam game by matching its executable path
//! against the `installdir` of every installed app. Steam exe names are often
//! generic (`launcher.exe`, `game.exe`), so the install folder is the reliable
//! key, and the manifest `name` is the authoritative display name.

use std::{
    collections::HashMap,
    path::Path,
    sync::{LazyLock, Mutex},
    time::{Duration, Instant},
};

const CACHE_TTL: Duration = Duration::from_secs(300);

/// `installdir` lowercased → display name.
pub type InstallDirs = HashMap<String, String>;

static CACHE: LazyLock<Mutex<Option<(Instant, InstallDirs)>>> = LazyLock::new(|| Mutex::new(None));

/// Rebuilt at most once every [`CACHE_TTL`] so games installed mid-session are
/// eventually picked up without re-reading every manifest on each poll.
pub fn install_dirs() -> InstallDirs {
    let Ok(mut cache) = CACHE.lock() else {
        return InstallDirs::new();
    };

    if let Some((built_at, dirs)) = cache.as_ref() {
        if built_at.elapsed() < CACHE_TTL {
            return dirs.clone();
        }
    }

    let dirs = scan_install_dirs();
    *cache = Some((Instant::now(), dirs.clone()));

    dirs
}

pub fn match_path(path: &Path, dirs: &InstallDirs) -> Option<String> {
    if dirs.is_empty() {
        return None;
    }

    let haystack = normalise(&path.to_string_lossy());

    dirs.iter()
        .filter(|(install_dir, _)| haystack.contains(&format!("/steamapps/common/{install_dir}/")))
        .max_by_key(|(install_dir, _)| install_dir.len())
        .map(|(_, name)| name.clone())
}

fn scan_install_dirs() -> InstallDirs {
    let mut dirs = InstallDirs::new();

    let Ok(steam_dir) = steamlocate::SteamDir::locate() else {
        return dirs;
    };

    let Ok(libraries) = steam_dir.libraries() else {
        return dirs;
    };

    for library in libraries.flatten() {
        for app in library.apps().flatten() {
            let install_dir = app.install_dir.to_lowercase();
            let Some(name) = app.name else {
                continue;
            };

            if install_dir.is_empty() || name.is_empty() {
                continue;
            }

            dirs.insert(install_dir, name);
        }
    }

    dirs
}

fn normalise(path: &str) -> String {
    path.replace('\\', "/").to_lowercase()
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::{match_path, InstallDirs};

    fn dirs() -> InstallDirs {
        InstallDirs::from([(
            "counter-strike global offensive".to_owned(),
            "Counter-Strike 2".to_owned(),
        )])
    }

    #[test]
    fn match_path_should_match_a_windows_path_regardless_of_case_and_separators() {
        let path = Path::new(
            r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive\game\bin\cs2.exe",
        );

        assert_eq!(
            match_path(path, &dirs()),
            Some("Counter-Strike 2".to_owned())
        );
    }

    #[test]
    fn match_path_should_match_a_unix_path() {
        let path = Path::new(
            "/home/user/.steam/steam/steamapps/common/counter-strike global offensive/game/cs2",
        );

        assert_eq!(
            match_path(path, &dirs()),
            Some("Counter-Strike 2".to_owned())
        );
    }

    #[test]
    fn match_path_should_not_match_an_install_dir_outside_steamapps_common() {
        let path = Path::new(r"D:\Games\Counter-Strike Global Offensive\cs2.exe");

        assert_eq!(match_path(path, &dirs()), None);
    }

    #[test]
    fn match_path_should_not_match_a_prefix_of_another_install_dir() {
        let path = Path::new(r"D:\SteamLibrary\steamapps\common\Counter-Strike\cs.exe");

        assert_eq!(match_path(path, &dirs()), None);
    }

    #[test]
    fn match_path_should_prefer_the_longest_matching_install_dir() {
        let dirs = InstallDirs::from([
            ("half-life".to_owned(), "Half-Life".to_owned()),
            ("half-life 2".to_owned(), "Half-Life 2".to_owned()),
        ]);
        let path = Path::new(r"D:\SteamLibrary\steamapps\common\Half-Life 2\hl2.exe");

        assert_eq!(match_path(path, &dirs), Some("Half-Life 2".to_owned()));
    }

    #[test]
    fn match_path_should_return_none_when_no_games_are_installed() {
        let path = Path::new(r"D:\SteamLibrary\steamapps\common\Factorio\factorio.exe");

        assert_eq!(match_path(path, &InstallDirs::new()), None);
    }
}
