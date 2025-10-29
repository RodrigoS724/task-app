<script lang="ts">
  import TaskCard from './taskCard.svelte';
  import { tasks } from '$lib/stores/storeTask';

  // $tasks es la auto-suscripción de Svelte al store
  // Si quieres filtrar u ordenar, lo haces aquí (derived) o en el store
</script>

<section class="task-list-container">
  {#if $tasks?.length === 0}
    <div class="empty card">No hay tareas aún. Crea la primera.</div>
  {:else}
    <div class="grid">
      {#each $tasks as t (t.id)}
        <TaskCard task={t} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .task-list-container {
    width:100%;
    box-sizing:border-box;
  }

  .grid {
    display: grid;
    gap: 16px;
    /* responsive grid: 1 column on mobile, 2-3 on larger screens */
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    align-items: start;
  }

  .empty {
    padding: 18px;
    border-radius: 10px;
    text-align: center;
    color: var(--text-muted);
  }
</style>
