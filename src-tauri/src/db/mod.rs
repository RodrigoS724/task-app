// src-tauri/src/db.rs
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use dirs::data_local_dir;
use anyhow::Result;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub category: Option<String>,
    pub content: Option<String>,
    pub done: bool,
    pub created_at: String,
}

pub fn get_db_path(app_name: &str) -> PathBuf {
    let mut base = data_local_dir().unwrap_or_else(|| PathBuf::from("."));
    base.push(app_name);
    std::fs::create_dir_all(&base).ok();
    base.push("tasks.db");
    base
}

pub fn init_db(path: &PathBuf) -> Result<Connection> {
    let conn = Connection::open(path)?;
    conn.execute_batch(
        r#"
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT,
            content TEXT,
            done INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        );
        "#,
    )?;
    Ok(conn)
}

pub fn load_tasks(conn: &Connection) -> Result<Vec<Task>> {
    let mut stmt = conn.prepare("SELECT id, title, category, content, done, created_at FROM tasks ORDER BY created_at DESC")?;
    let iter = stmt.query_map([], |row| {
        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            category: row.get(2).ok(),
            content: row.get(3).ok(),
            done: row.get::<_, i64>(4)? != 0,
            created_at: row.get(5)?,
        })
    })?;

    let mut tasks = Vec::new();
    for t in iter {
        tasks.push(t?);
    }
    Ok(tasks)
}

pub fn add_task(conn: &Connection, task: &Task) -> Result<()> {
    conn.execute(
        "INSERT INTO tasks (id, title, category, content, done, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![task.id, task.title, task.category, task.content, task.done as i32, task.created_at],
    )?;
    Ok(())
}

pub fn update_task(conn: &Connection, id: &str, title: Option<&str>, category: Option<&str>, content: Option<&str>, done: Option<bool>) -> Result<()> {
    // build update dynamically
    let mut sets = Vec::new();
    let mut params_vec: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

    if let Some(t) = title { sets.push("title = ?"); params_vec.push(Box::new(t)); }
    if let Some(c) = category { sets.push("category = ?"); params_vec.push(Box::new(c)); }
    if let Some(ct) = content { sets.push("content = ?"); params_vec.push(Box::new(ct)); }
    if let Some(d) = done { sets.push("done = ?"); params_vec.push(Box::new(d as i32)); }

    if sets.is_empty() { return Ok(()); }

    let sql = format!("UPDATE tasks SET {} WHERE id = ?", sets.join(", "));
    // push id param
    params_vec.push(Box::new(id));

    let mut stmt = conn.prepare(&sql)?;
    let params_refs: Vec<&dyn rusqlite::ToSql> = params_vec.iter().map(|b| &**b).collect();
    stmt.execute(params_refs.as_slice())?;
    Ok(())
}

pub fn remove_task(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM tasks WHERE id = ?", params![id])?;
    Ok(())
}

pub fn replace_all_tasks(conn: &mut Connection, tasks: &[Task]) -> Result<()> {
    let tx = conn.transaction()?;
    {
        tx.execute("DELETE FROM tasks", [])?;
        let mut stmt = tx.prepare(
            "INSERT INTO tasks (id, title, category, content, done, created_at) VALUES (?1,?2,?3,?4,?5,?6)"
        )?;
        for t in tasks {
            stmt.execute(params![
                t.id,
                t.title,
                t.category,
                t.content,
                t.done as i32,
                t.created_at
            ])?;
        }
        // El bloque termina aquí → `stmt` se libera (Drop) antes del commit.
    }
    tx.commit()?;
    Ok(())
}

