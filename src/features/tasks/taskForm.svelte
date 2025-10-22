<script lang="ts">
  import { createTask } from './task.store';

  let title = '';
  let description = '';
  let isSubmitting = false;

  const handleSubmit = async () => {
    if (!title.trim()) return; // Evita tareas vacías

    isSubmitting = true;

    try {
      // Llama a la función del store con los datos del formulario
      await createTask(title.trim(), description.trim());
      
      // Limpiar formulario al éxito
      title = '';
      description = '';
      
    } catch (error) {
      console.error("Error al crear tarea:", error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      bind:value={title}
      type="text"
      placeholder="Título de la nueva tarea..."
      required
      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
      disabled={isSubmitting}
    />
    
    <input
      bind:value={description}
      type="text"
      placeholder="Descripción (opcional)"
      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
      disabled={isSubmitting}
    />
  </div>
  
  <div class="flex justify-end">
    <button
      type="submit"
      disabled={!title.trim() || isSubmitting}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
    >
      {#if isSubmitting}
        Creando...
      {:else}
        Añadir Tarea
      {/if}
    </button>
  </div>
</form>