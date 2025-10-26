<script lang="ts">
    import LastTask from "$lib/components/task/lastTask.svelte";
    import TaskList from "$lib/components/task/taskList.svelte";
    import NewTask from "$lib/components/task/newTask.svelte";

    let taskPage = "lastTask";

    function navigateToTask(page: string) {
        taskPage = page;
    }
</script>

<main>
    <section>
        <nav>
            <button
                class="theme-button"
                class:active={taskPage === "lastTask"}
                on:click={() => navigateToTask("lastTask")}>Last Task</button
            >

            <button
                class="theme-button"
                class:active={taskPage === "listTask"}
                on:click={() => navigateToTask("listTask")}>Task List</button
            >

            <button
                class="theme-button"
                class:active={taskPage === "newTask"}
                on:click={() => navigateToTask("newTask")}>New Task</button
            >
        </nav>
    </section>

    {#if taskPage === "lastTask"}
        <LastTask />
    {:else if taskPage === "listTask"}
        <TaskList />
    {:else if taskPage === "newTask"}
        <NewTask />
    {/if}
</main>

<style>
    section {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: var(--bg);
        border-bottom: 1px solid var(--border-muted);
    }

    section nav {
        display: flex;
        margin: 10px 5px;
    }

    .theme-button {
        /* Reiniciar estilos y hacerlo visible */
        background-color: transparent;
        color: var(--text);
        border: 1px solid var(--border-muted);
        padding: 10px 25px;
        cursor: pointer;
        border-radius: 4px;
        margin: 0 5px;

        flex-grow: 1;
        box-sizing: border-box;
    }
    nav button:hover {
        background-color: var(--bg-light);
    }

    /* ✅ 2. Estilo para la página activa */
    .active {
        background-color: var(
            --bg-light
        ); /* Un color distinto para resaltarlo */
        color: var(--text-muted) !important;
    }
</style>
