<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Props para navegación
  export let currentPage: string;
  // ✅ Props para el tema
  export let isDarkMode: boolean; 

  function navigateTo(pageName: string) {
    dispatch('navigate', { page: pageName });
  }

  // ✅ Función que despacha el evento de cambio de tema
  function handleToggle() {
    dispatch('toggle'); 
  }
</script>
<style>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: var(--bg);
  }

  li {
    float: left;
  }

.dark-mode-toggle {
    float: right; /* ✅ Mueve el botón al final */
    margin-right: 10px;
  }

  .theme-button {
    /* Reiniciar estilos y hacerlo visible */
    background-color: transparent; 
    color: var(--text);
    border: 1px solid var(--border-muted);
    padding: 10px 25px;
    cursor: pointer;
    border-radius: 4px;
  }
  li button:hover {
    background-color: var(--bg-light);
  }

  /* ✅ 2. Estilo para la página activa */
  .active {
    background-color: var(--bg-light); /* Un color distinto para resaltarlo */
    color: var(--text-muted) !important;
  }
</style>

<ul>
  <li>
    <button class="theme-button" class:active="{currentPage === 'home'}" on:click={() => navigateTo('home')}>Home</button>
  </li>
  <li>
    <button class="theme-button" class:active="{currentPage === 'tasks'}" on:click={() => navigateTo('tasks')}>Tasks</button>
  </li>
  <li>
    <button class="theme-button" class:active="{currentPage === 'schedule'}" on:click={() => navigateTo('schedule')}>Schedule</button>
  </li>
  <li>
    <button class="theme-button" class:active="{currentPage === 'inventory'}" on:click={() => navigateTo('inventory')}>Inventory</button>
  </li>
  <li class="dark-mode-toggle">
    <button class="theme-button" on:click={handleToggle}>
      {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  </li>
</ul>