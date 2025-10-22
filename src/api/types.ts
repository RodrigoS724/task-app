// src/api/types.ts

/**
 * Define la estructura de una Tarea.
 * Corresponde directamente a la 'struct' que usarás en Rust.
 */
export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string; // Marca de tiempo de creación
}

// Interfaz para cuando solo se envían partes de la tarea (ej. en una actualización)
export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at'>>; 

// NOTA: Omit excluye 'id' y 'created_at' del tipo de actualización, 
// ya que no se modifican en el frontend.