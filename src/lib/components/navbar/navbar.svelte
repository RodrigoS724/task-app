<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // Props para navegación
  export let currentPage: string;
  // ✅ Props para el tema
  export let isDarkMode: boolean;

  function navigateTo(pageName: string) {
    dispatch("navigate", { page: pageName });
  }

  // ✅ Función que despacha el evento de cambio de tema
  function handleToggle() {
    dispatch("toggle");
  }
</script>

<ul>
  <div class="main-links-container">
    <li>
      <button
        class="theme-button"
        class:active={currentPage === "home"}
        on:click={() => navigateTo("home")}>Home</button
      >
    </li>
    <li>
      <button
        class="theme-button"
        class:active={currentPage === "tasks"}
        on:click={() => navigateTo("tasks")}>Tasks</button
      >
    </li>
    <li>
      <button
        class="theme-button"
        class:active={currentPage === "schedule"}
        on:click={() => navigateTo("schedule")}>Schedule</button
      >
    </li>
    <li>
      <button
        class="theme-button"
        class:active={currentPage === "inventory"}
        on:click={() => navigateTo("inventory")}>Inventory</button
      >
    </li>
  </div>
  
  <li class="dark-mode-toggle">
    <button class="theme-button" on:click={handleToggle}>
      {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  </li>
</ul>

<style>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: var(--bg);
    display: flex;
    width: 100%;
  }

  .main-links-container {
    width: 80%;
   display: flex;
    flex-grow: 1;
    align-items: center;
  }

  .main-links-container li {
      float: none; 
      flex-grow: 1; 
      display: flex; 
  }

.dark-mode-toggle {
    width: 20%;
    float: none; 
    
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0; 
  }

.theme-button {
    background-color: transparent;
    color: var(--text);
    border: 1px solid var(--border-muted);
    padding: 15px 15px;
    cursor: pointer;
    border-radius: 4px;
    
    margin: 0 5px; 
    width: 100%;
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