<script lang="ts">
  // 1. Importación Correcta: El nombre del archivo debe terminar en .svelte
  //    Asumo que tu componente se llama TaskListPage.svelte, no taskListFeature.
  import TaskListPage from "../features/tasks/taskListFeature.svelte"; 
  
  // 2. La API de Tauri se importa, pero no se usa en este componente raíz
  //    (Generalmente, solo se usa en la capa API/Store).
  import { invoke } from "@tauri-apps/api/core";

</script>

<main>
  <TaskListPage />
</main>