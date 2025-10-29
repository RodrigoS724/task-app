// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

use std::sync::Mutex;
use db::{init_db, get_db_path, load_tasks, add_task, update_task, remove_task, replace_all_tasks, Task};
use anyhow::Result;
use tauri::State;


// We'll keep a Mutex<Connection> in app state
type DbConn = Mutex<rusqlite::Connection>;

#[tauri::command]
fn get_tasks(state: State<'_, DbConn>) -> Result<Vec<Task>, String> {
    let conn = state.lock().map_err(|e| format!("lock error: {}", e))?;
    load_tasks(&*conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_task_cmd(state: State<'_, DbConn>, task: Task) -> Result<(), String> {
    let conn = state.lock().map_err(|e| format!("lock error: {}", e))?;
    add_task(&*conn, &task).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_task_cmd(state: State<'_, DbConn>, id: String, data: serde_json::Value) -> Result<(), String> {
    let conn = state.lock().map_err(|e| format!("lock error: {}", e))?;
    // parse fields from Value
    let title = data.get("title").and_then(|v| v.as_str());
    let category = data.get("category").and_then(|v| v.as_str());
    let content = data.get("content").and_then(|v| v.as_str());
    let done = data.get("done").and_then(|v| v.as_bool());
    update_task(&*conn, &id, title, category, content, done).map_err(|e| e.to_string())
}

#[tauri::command]
fn remove_task_cmd(state: State<'_, DbConn>, id: String) -> Result<(), String> {
    let conn = state.lock().map_err(|e| format!("lock error: {}", e))?;
    remove_task(&*conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
fn replace_all_tasks_cmd(state: State<'_, DbConn>, tasks: Vec<Task>) -> Result<(), String> {
    let mut conn = state.lock().map_err(|e| format!("lock error: {}", e))?;
    replace_all_tasks(&mut *conn, &tasks).map_err(|e| e.to_string())
}


fn main() {
    // application-specific folder under user's local data dir
    let db_path = get_db_path("organize_me");

    let connection = init_db(&db_path).expect("failed to init db");
    let db_state = Mutex::new(connection);

    tauri::Builder::default()
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![
            get_tasks,
            add_task_cmd,
            update_task_cmd,
            remove_task_cmd,
            replace_all_tasks_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
