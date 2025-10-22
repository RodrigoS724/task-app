// src/features/tasks/tasks.store.ts

import { writable } from 'svelte/store';
import { invoke } from '@tauri-apps/api/core'; // La API de Tauri para Rust

// --- 1. INTERFAZ DE DATOS ---
// Definición de la estructura de Task (idealmente esto estaría en src/api/types.ts)
export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
}

// --- 2. STORE REACTIVO ---
// Creamos un store writable de Svelte para la lista de tareas
export const tasks = writable<Task[]>([]);

// --- 3. FUNCIONES DE COMUNICACIÓN (Wrapper para 'invoke') ---

// Comando Rust: Obtener todas las tareas
export async function fetchTasks() {
    try {
        // Llama al comando Rust. Asumimos que el comando se llama 'get_all_tasks'
        const result = await invoke<Task[]>('get_all_tasks'); 
        tasks.set(result); // Actualiza el store con los datos de Rust
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Comando Rust: Crear una nueva tarea
export async function createTask(title: string, description: string) {
    try {
        // Llama al comando Rust. Asumimos que el comando se llama 'create_task'
        const newTask = await invoke<Task>('create_task', { title, description });
        
        // Actualiza el store localmente al recibir la nueva tarea de Rust
        tasks.update(currentTasks => {
            return [newTask, ...currentTasks]; // Agrega la nueva tarea al inicio
        });
    } catch (error) {
        console.error("Error creating task:", error);
        throw error; // Propagar el error al formulario
    }
}

// Comando Rust: Actualizar una tarea (ej. toggle completed)
export async function updateTask(id: number, updates: Partial<Task>) {
    try {
        // Llama al comando Rust. Asumimos que el comando se llama 'update_task'
        const updatedTask = await invoke<Task>('update_task', { id, ...updates });
        
        // Actualiza el store localmente
        tasks.update(currentTasks => {
            const index = currentTasks.findIndex(t => t.id === id);
            if (index !== -1) {
                currentTasks[index] = updatedTask; // Reemplaza la tarea antigua con la actualizada
            }
            return currentTasks;
        });
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// Comando Rust: Eliminar una tarea
export async function deleteTask(id: number) {
    try {
        // Llama al comando Rust. Asumimos que el comando se llama 'delete_task'
        await invoke('delete_task', { id }); 
        
        // Actualiza el store localmente
        tasks.update(currentTasks => currentTasks.filter(t => t.id !== id));
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}
