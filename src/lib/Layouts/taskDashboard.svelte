<script lang="ts">
      import LastTask from '$lib/components/task/lastTask.svelte';
      import TaskList from '$lib/components/task/taskList.svelte';
      import NewTask from '$lib/components/task/newTask.svelte';

let taskPage = "lastTask";

function navigateToTask(page: string) {
    taskPage = page;
}
</script>

<main>
    <nav>
    <ul>
        <li>
            <button
                class="theme-button"
                class:active={taskPage === "lastTask"}
                on:click={() => navigateToTask("lastTask")}>Last Task</button
            >
        </li>
        <li>
            <button
                class="theme-button"
                class:active={taskPage === "listTask"}
                on:click={() => navigateToTask("listTask")}>Task List</button
            >
        </li>
        <li>
            <button
                class="theme-button"
                class:active={taskPage === "newTask"}
                on:click={() => navigateToTask("newTask")}>New Task</button
            >
        </li>
    </ul>
    </nav>

    {#if taskPage === "lastTask"}
        <LastTask />
    {:else if taskPage === "listTask"}
        <TaskList />
    {:else if taskPage === "newTask"}
        <NewTask />
    {/if}

    Hola!!
</main>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .theme-button {
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

    .active {
        background-color: var(
            --bg-light
        ); /* Un color distinto para resaltarlo */
        color: var(--text-muted) !important;
    }
</style>
