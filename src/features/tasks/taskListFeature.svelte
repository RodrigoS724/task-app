<script lang="ts">
  import { onMount } from 'svelte';
  import { tasks, fetchTasks } from './task.store'; // Importamos el store y la función
  import TaskCard from './taskCard.svelte';
  import TaskForm from './taskForm.svelte';

  let isLoading = false;

  onMount(async () => {
    isLoading = true;
    await fetchTasks(); // Llama a la API de Rust
    isLoading = false;
  });
</script>

<div class="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
  
  <header class="mb-8">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-2">Mis Tareas 📝</h1>
    <p class="text-lg text-gray-600">Organiza tu día con la potencia de Rust y Svelte.</p>
    
    <div class="mt-6 bg-white shadow-lg rounded-xl p-4">
        <TaskForm />
    </div>
  </header>

  <section class="mt-10">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Pendientes ({$tasks.filter(t => !t.completed).length})</h2>

    {#if isLoading}
      <div class="text-center py-10 text-gray-500">Cargando tareas...</div>
    {:else if $tasks.length === 0}
      <div class="text-center py-10 text-gray-500 border rounded-lg bg-white">
          ¡No tienes tareas aún! Agrega una arriba.
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $tasks as task (task.id)}
          <TaskCard {task} /> 
        {/each}
      </div>
    {/if}
  </section>
</div>