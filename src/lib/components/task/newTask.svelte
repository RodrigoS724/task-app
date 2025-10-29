<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import TaskList from "@tiptap/extension-task-list";
  import TaskItem from "@tiptap/extension-task-item";
  import Placeholder from "@tiptap/extension-placeholder";
  import Heading from "@tiptap/extension-heading";
  import Bold from "@tiptap/extension-bold";
  import Italic from "@tiptap/extension-italic";
  import Underline from "@tiptap/extension-underline";
  import Link from "@tiptap/extension-link";
  import BulletList from "@tiptap/extension-bullet-list";
  import OrderedList from "@tiptap/extension-ordered-list";

  let editor: Editor | null = null;
  let title = "";
  // <- CORRECCIÓN: usar let para poder bindear
  let date: string = new Date().toISOString().split("T")[0];
  let description = "";
  let category = "";

  // Inicializamos TipTap
  onMount(() => {
    editor = new Editor({
      element: document.querySelector("#editor") as HTMLElement,
      extensions: [
        StarterKit.configure({ heading: false }),
        Heading.configure({ levels: [1, 2, 3] }),
        Bold,
        Italic,
        Underline,
        Link,
        TaskList,
        TaskItem,
        BulletList,
        OrderedList,
        Placeholder.configure({ placeholder: "Escribe tu nota aquí..." })
      ],
      content: "",
      editorProps: {
        attributes: {
          class: "prosemirror-root"
        }
      }
    });
  });

  onDestroy(() => {
    editor?.destroy();
    editor = null;
  });

  function saveTask() {
    const html = editor?.getHTML() ?? "";
    // aquí iría tu lógica para persistir en sqlite / store
    console.log({ title, date, description, category, html });
    alert("Nota guardada (ver consola)");
  }

  // toggle acepta comando (string) y opcional argumento (obj)
  function toggle(cmd: string, arg?: any) {
    if (!editor) return;
    const chain = editor.chain().focus();
    // si el comando acepta argumentos (p. ej. toggleHeading)
    try {
      if (arg !== undefined) {
        // @ts-ignore: método dinámico por nombre
        (chain as any)[cmd](arg).run();
      } else {
        // @ts-ignore
        (chain as any)[cmd]().run();
      }
    } catch (err) {
      // Fallback: algunos comandos en tiptap tienen nombres diferentes.
      console.warn("toggle error:", cmd, err);
    }
  }
</script>

<!-- Layout -->
<div class="newtask">
  <!-- Header row: título (70%) + fecha (30%) -->
  <div class="header-row">
    <input
      class="title-input"
      bind:value={title}
      type="text"
      placeholder="Título de la tarea"
      maxlength="30"
      aria-label="Título"
    />
    <input class="date-input" type="date" bind:value={date} aria-label="Fecha" />
  </div>

  <input
    class="desc-input"
    bind:value={description}
    type="text"
    placeholder="Descripción breve"
    aria-label="Descripción breve"
  />

  <!-- toolbar -->
  <div class="toolbar">
    <button type="button" on:click={() => toggle("toggleBold")} class="tool-btn"><b>B</b></button>
    <button type="button" on:click={() => toggle("toggleItalic")} class="tool-btn"><i>I</i></button>
    <button type="button" on:click={() => toggle("toggleUnderline")} class="tool-btn"><u>U</u></button>

    <button type="button" on:click={() => toggle("toggleBulletList")} class="tool-btn">• Lista</button>
    <button type="button" on:click={() => toggle("toggleOrderedList")} class="tool-btn">1. Lista</button>
    <button type="button" on:click={() => toggle("toggleTaskList")} class="tool-btn">☑ Tareas</button>

    <button type="button" on:click={() => toggle("setParagraph")} class="tool-btn">P</button>
    <button type="button" on:click={() => toggle("toggleHeading", { level: 2 })} class="tool-btn">H2</button>
    <button type="button" on:click={() => toggle("toggleHeading", { level: 3 })} class="tool-btn">H3</button>
  </div>

  <!-- editor -->
  <div id="editor" class="editor" role="textbox" aria-multiline="true"></div>

  <!-- acciones -->
  <div class="actions">
    <button type="button" on:click={saveTask} class="btn-save">Guardar</button>
  </div>
</div>

<style>

  .newtask {
    display:flex;
    flex-direction:column;
    gap:12px;
    padding:18px;
    background: linear-gradient(180deg, var(--bg-light), var(--bg));
    color: var(--text);
    box-sizing:border-box;
  }

  .header-row {
    display:flex;
    gap:12px;
    align-items:center;
  }

  .title-input {
    flex-basis: 70%;
    padding:10px 12px;
    border-radius:8px;
    border:1px solid var(--border);
    background: rgba(255,255,255,0.02);
    color: var(--text);
  }

  .date-input {
    flex-basis: 30%;
    max-width:220px;
    padding:8px 10px;
    border-radius:8px;
    border:1px solid var(--border);
    background: rgba(255,255,255,0.02);
    color: var(--text);
  }

  .desc-input {
    padding:8px 10px;
    border-radius:8px;
    border:1px solid var(--border);
    background: rgba(255,255,255,0.02);
    color: var(--text);
  }

  .toolbar {
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    padding:8px;
    border-radius:8px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
  }

  .tool-btn {
    padding:6px 8px;
    border-radius:6px;
    background:transparent;
    color:var(--text);
    border:1px solid transparent;
    cursor:pointer;
  }
  .tool-btn:hover {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.04);
  }

  /* Reglas globales para ProseMirror (evita warnings y aplica estilos) */
  :global(.ProseMirror ul),
  :global(.ProseMirror ol) {
    margin-left: 1.5rem;
  }

  :global(.ProseMirror) {
    min-height: 400px;
    padding: 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.01);
    color: var(--text);
    overflow:auto;
    flex:1;
  }

  :global(.taskList) {
    list-style: none;
    padding-left: 1rem;
  }

  .actions {
    display:flex;
    justify-content:flex-end;
  }

  .btn-save {
    padding:8px 14px;
    border-radius:8px;
    background: linear-gradient(180deg, var(--primary), color-mix(in srgb, var(--primary) 70%, black 10%));
    color: var(--bg-dark);
    border:none;
    cursor:pointer;
  }

  @media (max-width:760px) {
    .header-row { flex-direction:column; align-items:stretch; }
    .date-input { max-width:100%; }
  }
</style>
