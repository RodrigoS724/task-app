<script lang="ts">
  import type { Task } from '$lib/stores/storeTask';
  import { tasks } from '$lib/stores/storeTask';
  import { createEventDispatcher } from 'svelte';

  export let task: Task;
  const dispatch = createEventDispatcher();
  let expanded = false;

  function toggleDone() {
    tasks.toggle?.(task.id);
  }

  function removeTask() {
    if (confirm('¿Eliminar tarea?')) {
      tasks.remove?.(task.id);
    }
  }

  function editTask() {
    // Emitimos evento para que el padre abra un edit modal si quiere
    dispatch('edit', { task });
  }

  function formatDate(d: string) {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  }
</script>

<article class="task-card card">
  <div class="card-grid">
    <!-- Columna 1: título 70% + fecha -->
    <div class="col col-left">
      <div class="title-row">
        <h3 class="title" title={task.title}>{task.title}</h3>
        <div class="date">{formatDate(task.createdAt ?? task.date ?? '')}</div>
      </div>
    </div>

    <!-- Columna 2: descripción, categoría y ver todo -->
    <div class="col col-right">
      <p class="desc">{task.description ?? '—'}</p>
      <div class="meta-row">
        <span class="category">{task.category ?? 'Sin categoría'}</span>
        <button class="link-btn" on:click={() => expanded = !expanded}>
          {expanded ? 'Ocultar' : 'Ver todo'}
        </button>
      </div>
    </div>
  </div>

  {#if expanded}
    <div class="notes">
      {@html task.notesHTML ?? '<em>Sin notas</em>'}
    </div>
  {/if}

  <div class="card-actions">
    <label class="check">
      <input type="checkbox" checked={task.done} on:change={toggleDone} />
      <span>{task.done ? 'Completada' : 'Marcar'}</span>
    </label>

    <div class="actions-right">
      <button class="btn-ghost" on:click={editTask}>Editar</button>
      <button class="btn-danger" on:click={removeTask}>Eliminar</button>
    </div>
  </div>
</article>

<style>

  .task-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border-radius: 10px;
    background: linear-gradient(180deg, var(--bg-light), rgba(0,0,0,0.02));
    border: 1px solid var(--border);
    color: var(--text);
    box-sizing: border-box;
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr 320px; /* left column flexible, right column fixed/min */
    gap: 12px;
    align-items: start;
  }

  /* Column left contains title and date; title should take ~70% of the row inside its column */
  .col-left .title-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    flex-basis: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-left: auto;
    flex-shrink: 0;
    padding-left: 8px;
  }

  .col-right .desc {
    margin: 0 0 8px 0;
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .meta-row {
    display:flex;
    gap:12px;
    align-items:center;
  }

  .category {
    font-size: 0.9rem;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border-muted);
    color: var(--text);
  }

  .link-btn {
    background: transparent;
    border: none;
    color: var(--primary);
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.9rem;
  }

  .notes {
    padding: 10px;
    border-radius: 8px;
    border: 1px dashed rgba(255,255,255,0.03);
    background: rgba(0,0,0,0.02);
    color: var(--text);
    max-height: 280px;
    overflow: auto;
  }

  .card-actions {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 12px;
  }

  .check {
    display:flex;
    gap:8px;
    align-items:center;
    color: var(--text-muted);
  }

  .btn-ghost {
    padding: 6px 10px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border-muted);
    color: var(--text);
    cursor: pointer;
  }

  .btn-danger {
    padding: 6px 10px;
    border-radius: 8px;
    background: linear-gradient(180deg, var(--danger), color-mix(in srgb,var(--danger) 70%, black 10%));
    color: var(--bg-dark);
    border: none;
    cursor: pointer;
  }

  @media (max-width: 900px) {
    .card-grid {
      grid-template-columns: 1fr;
    }
    .col-right { order: 2; }
  }
</style>
