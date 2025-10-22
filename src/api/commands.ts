// src/api/commands.ts

import { invoke } from '@tauri-apps/api/core';
import type { Task, TaskUpdate } from './types';

// --- MOCK DE DATOS (PARA TESTING DE FRONTEND) ---
let mockTasks: Task[] = [
    { id: 1, title: 'Configurar Tailwind CSS', description: 'Revisar los 5 pasos de instalación de PostCSS.', completed: true, created_at: new Date().toISOString() },
    { id: 2, title: 'Definir Struct Task en Rust', description: 'Crear la estructura y los comandos CRUD iniciales.', completed: false, created_at: new Date().toISOString() },
    { id: 3, title: 'Diseñar la TaskCard', description: 'Usar Flexbox y las clases de estado (completed/pending).', completed: false, created_at: new Date().toISOString() },
];
let nextId = mockTasks.length + 1;

// --- FUNCIONES WRAPPER (SIMULANDO LA LLAMADA A RUST) ---

/**
 * Simula la llamada a Rust para obtener todas las tareas.
 * (En producción, contendría: return invoke<Task[]>('get_all_tasks');)
 */
export async function fetchTasksAPI(): Promise<Task[]> {
    // Simulación de latencia de red para desarrollo
    await new Promise(resolve => setTimeout(resolve, 300)); 
    return Promise.resolve(mockTasks);
}

/**
 * Simula la creación de una nueva tarea en Rust.
 */
export async function createTaskAPI(title: string, description: string): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Aquí se reemplazaría por: return invoke<Task>('create_task', { title, description });
    const newTask: Task = {
        id: nextId++,
        title: title,
        description: description,
        completed: false,
        created_at: new Date().toISOString(),
    };
    mockTasks = [newTask, ...mockTasks];
    return Promise.resolve(newTask);
}

/**
 * Simula la actualización de una tarea en Rust.
 */
export async function updateTaskAPI(id: number, updates: TaskUpdate): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return Promise.reject(new Error("Task not found"));

    // Aquí se reemplazaría por: return invoke<Task>('update_task', { id, updates });
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    return Promise.resolve(mockTasks[taskIndex]);
}

/**
 * Simula la eliminación de una tarea en Rust.
 */
export async function deleteTaskAPI(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Aquí se reemplazaría por: return invoke('delete_task', { id });
    mockTasks = mockTasks.filter(t => t.id !== id);
    return Promise.resolve();
}