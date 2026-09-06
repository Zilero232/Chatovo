//! Discovers what the user is running from their own machine instead of a
//! hardcoded title table: a Steam library match first, then the executable's
//! own file metadata. Only the executable path and name are ever inspected —
//! never window titles or command lines, which can carry paths and tokens.

mod filter;
mod metadata;
mod steam;

use sysinfo::{
    get_current_pid, Pid, Process, ProcessRefreshKind, ProcessesToUpdate, RefreshKind, System,
    UpdateKind,
};

/// Returns the display name of the game or app the user most recently started,
/// or `None` when nothing matches. A Steam library match always wins over a
/// metadata one, and within each tier the newest process wins — a game launched
/// a minute ago is what the user is doing, not the wallpaper tool that has run
/// since boot. Ties break on pid so the answer stays stable between polls.
#[tauri::command]
pub fn detect_running_game() -> Option<String> {
    let mut system = System::new_with_specifics(RefreshKind::nothing());

    system.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::nothing()
            .with_exe(UpdateKind::Always)
            .with_user(UpdateKind::Always),
    );

    let own_pid = get_current_pid().ok();
    let own_user = own_pid
        .and_then(|pid| system.process(pid))
        .and_then(|process| process.user_id())
        .cloned();

    let mut candidates: Vec<(&Pid, &Process)> = system
        .processes()
        .iter()
        .filter(|(pid, _)| Some(**pid) != own_pid)
        .filter(|(_, process)| is_candidate(process, own_user.as_ref()))
        .collect();

    candidates.sort_by_key(|(pid, process)| (process.run_time(), **pid));

    let install_dirs = steam::install_dirs();

    candidates
        .iter()
        .find_map(|(_, process)| {
            process
                .exe()
                .and_then(|exe| steam::match_path(exe, &install_dirs))
        })
        .or_else(|| {
            candidates
                .iter()
                .find_map(|(_, process)| metadata::display_name(process.exe()?))
        })
}

fn is_candidate(process: &Process, own_user: Option<&sysinfo::Uid>) -> bool {
    let Some(exe) = process.exe() else {
        return false;
    };

    if filter::is_excluded_path(exe) {
        return false;
    }

    if !filter::is_long_running(process.run_time()) {
        return false;
    }

    if let (Some(own_user), Some(user)) = (own_user, process.user_id()) {
        if user != own_user {
            return false;
        }
    }

    !filter::is_excluded_name(&process.name().to_string_lossy())
}
