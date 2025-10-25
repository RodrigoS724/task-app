<script lang="ts">
  import { onMount } from "svelte";

  import TaskDashboard from "$lib/Layouts/taskDashboard.svelte";
  import HomeDashboard from "$lib/Layouts/homeDashboard.svelte";
  import InventoryDashboard from "$lib/Layouts/inventoryDashboard.svelte";
  import ScheduleDashboard from "$lib/Layouts/scheduleDashboard.svelte";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  import Header from "$lib/components/header/header.svelte";
  let page = "home";
  let isDarkMode = true;

  function handleNavigation(event: CustomEvent) {
    // El valor de la página viene en event.detail.page
    page = event.detail.page;
    console.log("Navegando a:", page); // Opcional: para ver en consola
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
  }

  onMount(() => {
    const savedTheme = localStorage.getItem("themePreference");

    if (savedTheme !== null) {
      isDarkMode = savedTheme === "dark";
    } else {
      // Opcional: Si no hay preferencia guardada, podrías intentar leer la preferencia del sistema operativo
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  $: {
    if (typeof window !== "undefined") {
     localStorage.setItem("themePreference", isDarkMode ? "dark" : "light");

      document.body.classList.toggle("light-theme", isDarkMode);
    }
  }
</script>

<main>
  <Header />
  <div class="main-dash">
    {#if page === "home"}
      <HomeDashboard />
    {:else if page === "tasks"}
      <TaskDashboard />
    {:else if page === "schedule"}
      <ScheduleDashboard />
    {:else if page === "inventory"}
      <InventoryDashboard />
    {/if}
  </div>
  <Navbar
    currentPage={page}
    {isDarkMode}
    on:navigate={handleNavigation}
    on:toggle={toggleTheme}
  />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .main-dash {
    flex: 1;
  }
</style>
