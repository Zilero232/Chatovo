#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(desktop)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            use tauri::Manager;
            use tauri_plugin_deep_link::DeepLinkExt;

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
            app.deep_link().handle_cli_arguments(args.into_iter());
        }));

    #[cfg(not(desktop))]
    let builder = tauri::Builder::default();

    builder
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|_app| {
            #[cfg(desktop)]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                if let Err(err) = _app.deep_link().register_all() {
                    eprintln!("deep-link register_all failed: {err}");
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
