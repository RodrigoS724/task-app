<script lang="ts">
  import type { Task } from '../../api/types'; // Asumimos la interfaz Task
  import { updateTask, deleteTask } from './task.store';

  export let task: Task; // Recibe el objeto Task como una prop

  // Manejador para el cambio de estado (completado/pendiente)
  const toggleCompleted = () => {
    // Llama a la función del store, que a su vez llama a Rust
    updateTask(task.id, { completed: !task.completed }); 
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(task.id);
    }
  };

  // Clases dinámicas de Tailwind
  $: cardClass = task.completed 
    ? "bg-green-50 border-green-200 opacity-70" 
    : "bg-white border-gray-200 hover:shadow-md";

  $: titleClass = task.completed 
    ? "text-gray-500 line-through" 
    : "text-gray-900";
</script>

<div class={`border-2 rounded-lg p-5 shadow-sm transition-all duration-200 ${cardClass}`}>
  <div class="flex items-start justify-between">
    
    <div class="flex-1 min-w-0 pr-4">
      <h3 class={`text-lg font-bold truncate ${titleClass}`}>
        {task.title}
      </h3>
      {#if task.description}
        <p class="text-sm text-gray-500 mt-1 truncate">{task.description}</p>
      {/if}
    </div>

    <input 
      type="checkbox" 
      checked={task.completed} 
      on:change={toggleCompleted}
      class="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer mt-0.5"
    />
  </div>

  <div class="mt-4 flex justify-end space-x-2">
    <button 
      on:click={handleDelete}
      class="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
      title="Eliminar tarea"
    >
      Eliminar
    </button>
  </div>
</div>