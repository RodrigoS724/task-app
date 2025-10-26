<script lang="ts">
  import TaskDashboard from "$lib/Layouts/taskDashboard.svelte";
  import HomeDashboard from "$lib/Layouts/homeDashboard.svelte";
  import InventoryDashboard from "$lib/Layouts/inventoryDashboard.svelte";
  import ScheduleDashboard from "$lib/Layouts/scheduleDashboard.svelte";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  import Header from "$lib/components/header/header.svelte";

  import { onMount, tick } from "svelte";
  import { browser } from "$app/environment"; // Importa para saber si estás en el navegador

  let page = "home";

  let isDarkMode = browser
    ? localStorage.getItem("themePreference") === "dark"
    : false;

  function handleNavigation(event: CustomEvent) {
    page = event.detail.page;
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
  }

  // 2. BLOQUE REACTIVO: Se ejecuta inmediatamente y cada vez que isDarkMode cambia.
  // Esto garantiza que la clase se aplique y se guarde la preferencia de inmediato.
  $: {
    if (browser) {
      const theme = isDarkMode ? "dark" : "light";
      document.body.classList.toggle("light-theme", !isDarkMode);
      // Guardar la preferencia
      localStorage.setItem("themePreference", theme);
    }
  }

</script>

<main>
  <Header />
  <section class="container">

  {#if page === "home"}
    <HomeDashboard />
  {:else if page === "tasks"}
    <TaskDashboard />
  {:else if page === "schedule"}
    <ScheduleDashboard />
  {:else if page === "inventory"}
    <InventoryDashboard />
  {/if}
  </section>

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
  section.container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>