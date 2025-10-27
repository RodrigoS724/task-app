<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  // import { tasks } from '$lib/stores/tasks'; // opcional: descomenta si quieres usar el store directamente

  const dispatch = createEventDispatcher();

  // Form data
  let title = '';
  let date: string = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  let description = '';
  let category = '';
  let notesHTML = '';

  const MAX_TITLE = 30;

  // Categories defaults
  let categories = ['Personal', 'Trabajo', 'Estudio', 'Otros'];

  // Editor ref
  let editor: HTMLDivElement | null = null;

  const DRAFT_KEY = 'taskapp:newtask:draft';

  // Load draft
  onMount(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        title = d.title || title;
        date = d.date || date;
        description = d.description || description;
        category = d.category || category;
        notesHTML = d.notesHTML || '';
        if (editor && notesHTML) editor.innerHTML = notesHTML;
      }
    } catch (e) {
      console.warn('No draft or parse error', e);
    }
  });

  function saveDraft() {
    const payload = { title, date, description, category, notesHTML: editor?.innerHTML || '' };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(payload)); } catch (e) {}
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  }

  // execCommand wrapper (kept for quick actions)
  function exec(cmd: string, value?: string) {
    // Using execCommand for quick/simple editor controls
    document.execCommand(cmd, false, value);
    notesHTML = editor?.innerHTML || '';
    saveDraft();
    editor?.focus();
  }

  function applyFontSize(px: number) {
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const container = document.createElement('div');
    container.appendChild(range.cloneContents());
    const selectedHTML = container.innerHTML || range.toString();

    const span = document.createElement('span');
    span.style.fontSize = px + 'px';
    span.innerHTML = selectedHTML || '&nbsp;';

    range.deleteContents();
    range.insertNode(span);

    sel.removeAllRanges();
    notesHTML = editor?.innerHTML || '';
    saveDraft();
    editor?.focus();
  }

  function insertCheckbox() {
    if (!editor) return;
    const sel = document.getSelection();
    const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
    const wrapper = document.createElement('div');
    wrapper.className = 'note-checkbox';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '8px';
    wrapper.innerHTML = `<input type="checkbox" /><span contenteditable="true"> Elemento</span>`;

    if (range) {
      range.deleteContents();
      range.insertNode(wrapper);
    } else {
      editor.appendChild(wrapper);
    }
    notesHTML = editor.innerHTML;
    saveDraft();
    editor.focus();
  }

  function clearEditor() {
    if (!editor) return;
    editor.innerHTML = '';
    notesHTML = '';
    saveDraft();
    editor.focus();
  }

  function handleInputNotes() {
    notesHTML = editor?.innerHTML || '';
    saveDraft();
  }

  function submit(e?: Event) {
    e?.preventDefault();
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const payload = {
      title: title.trim(),
      date,
      description: description.trim() || undefined,
      category: category || undefined,
      notesHTML: editor?.innerHTML || ''
    };

    // Opcional: usar store directamente
    // tasks.add({ title: payload.title, description: payload.description, notesHTML: payload.notesHTML });

    dispatch('created', payload);

    // reset
    title = '';
    description = '';
    category = '';
    clearEditor();
    clearDraft();
  }

  // keyboard shortcuts: ctrl/cmd + b/i/u
  function onKeyDown(e: KeyboardEvent) {
    const meta = e.ctrlKey || e.metaKey;
    if (!meta) return;
    const k = e.key.toLowerCase();
    if (k === 'b') { e.preventDefault(); exec('bold'); }
    if (k === 'i') { e.preventDefault(); exec('italic'); }
    if (k === 'u') { e.preventDefault(); exec('underline'); }
  }
</script>

<form class="newtask card fill" on:submit|preventDefault={submit} aria-label="Formulario crear tarea">
  <!-- Title + Date row -->
  <div class="row">
    <label class="title-group">
      <div class="label">Título *</div>
      <div class="title-row">
        <input
          class="input title-input"
          bind:value={title}
          placeholder="Ej. Comprar regalo de cumpleaños"
          maxlength={MAX_TITLE}
          required
          aria-describedby="title-count"
        />
        <input class="input date-input" type="date" bind:value={date} />
      </div>
      <div id="title-count" class="muted">{title.length}/{MAX_TITLE}</div>
    </label>

    <label class="small">
      <div class="label">Categoría</div>
      <div class="cat-row">
        <select class="input" bind:value={category}>
          <option value="">-- Seleccionar --</option>
          {#each categories as c}
            <option value={c}>{c}</option>
          {/each}
        </select>
        <button type="button" class="btn-ghost" on:click={() => {
          const newCat = prompt('Nueva categoría');
          if (newCat && newCat.trim()) categories = [newCat.trim(), ...categories];
        }}>+</button>
      </div>
    </label>
  </div>

  <!-- Description row -->
  <div class="row">
    <label style="flex:1">
      <div class="label">Descripción breve</div>
      <input class="input" bind:value={description} placeholder="Una frase corta que resuma la tarea" />
    </label>
  </div>

  <div class="label">Notas (bloc de notas)</div>

  <!-- Toolbar -->
  <div class="toolbar" role="toolbar" aria-label="Barra de herramientas editor">
    <button type="button" title="Negrita (Ctrl/Cmd+B)" on:click={() => exec('bold')}><b>B</b></button>
    <button type="button" title="Itálica (Ctrl/Cmd+I)" on:click={() => exec('italic')}><i>I</i></button>
    <button type="button" title="Subrayado (Ctrl/Cmd+U)" on:click={() => exec('underline')}><u>U</u></button>

    <button type="button" title="H1" on:click={() => exec('formatBlock', 'H1')}>H1</button>
    <button type="button" title="H2" on:click={() => exec('formatBlock', 'H2')}>H2</button>

    <button type="button" title="Lista no ordenada" on:click={() => exec('insertUnorderedList')}>&bull; Lista</button>
    <button type="button" title="Lista ordenada" on:click={() => exec('insertOrderedList')}>1. Lista</button>

    <button type="button" title="Insertar checkbox" on:click={insertCheckbox}>☑ Insertar checkbox</button>

    <div class="divider" />

    <label class="fontsize">
      Tamaño
      <select on:change={(ev) => applyFontSize(parseInt((ev.target as HTMLSelectElement).value))}>
        <option value="14">14px</option>
        <option value="16" selected>16px</option>
        <option value="18">18px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
      </select>
    </label>

    <div class="divider" />
    <button type="button" title="Deshacer" on:click={() => exec('undo')}>↶</button>
    <button type="button" title="Rehacer" on:click={() => exec('redo')}>↷</button>
    <button type="button" title="Limpiar formato" on:click={() => exec('removeFormat')}>Limpiar formato</button>
    <button type="button" title="Limpiar todo" on:click={clearEditor}>Limpiar todo</button>
  </div>

  <!-- Editor -->
  <div
    class="editor"
    contenteditable="true"
    bind:this={editor}
    on:input={handleInputNotes}
    on:keydown={onKeyDown}
    aria-multiline="true"
    role="textbox"
    data-placeholder="Escribe tus notas aquí... (listas, tamaños, checkboxes)"
  >{@html notesHTML}</div>

  <div class="actions">
    <button type="button" class="btn-ghost" on:click={() => {
      title = ''; description = ''; category = ''; clearEditor(); clearDraft();
    }}>Cancelar</button>

    <button type="submit" class="btn-primary">Crear tarea</button>
  </div>
</form>

<style>
  .fill { width: 100%; box-sizing: border-box; }

  .newtask {
    height: 100%;
    display:flex;
    flex-direction:column;
    gap:14px;
    padding:16px;
    border-radius:10px;
    background: linear-gradient(180deg, var(--bg-light), var(--bg));
    border: 1px solid var(--border);
    color: var(--text);
  }

  .row { display:flex; gap:12px; align-items:flex-start; width:100%; }
  .row label { display:flex; flex-direction:column; gap:6px; flex:1; width: 100%;}

  .small { width:320px; min-width:200px; }

  .label { font-size:13px; font-weight:600; color:var(--text); margin-bottom:4px; }

  .title-row { display:flex; gap:8px; align-items:center; width:100%; }
  .title-group .title-input { flex:1;}
  .date-input { width:160px; }

  .input {
    width:100%;
    padding:8px 10px;
    border-radius:8px;
    border:1px solid var(--border-muted);
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    color: var(--text);
  }

  .input:focus {
    outline: 2px solid rgba(255,255,255,0.06);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    border-color: var(--primary);
  }

  .muted { font-size:12px; color: var(--text-muted); margin-top:4px; }

  .cat-row { display:flex; gap:8px; align-items:center; }

  .toolbar {
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    align-items:center;
    padding:8px;
    border-radius:8px;
    background: rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.02);
  }

  .toolbar button {
    padding:6px 8px;
    border-radius:6px;
    border:1px solid transparent;
    background:transparent;
    color: var(--text);
    cursor:pointer;
  }

  .toolbar button:hover {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.04);
  }

  .divider { width:1px; height:28px; background: rgba(255,255,255,0.04); margin:0 6px; }

  .fontsize select { padding:6px; border-radius:6px; border:1px solid var(--border-muted); background:transparent; color:var(--text); }

  .editor {
    min-height:200px;
    padding:12px;
    border-radius:8px;
    border:1px solid var(--border-muted);
    background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
    color: var(--text);
    overflow:auto;
    height: 100%;
  }

  /* placeholder for contenteditable */
  .editor:empty:before {
    content: attr(data-placeholder);
    color: var(--text-muted);
    pointer-events: none;
    display:block;
  }

  .editor:focus { outline: 2px solid rgba(255,255,255,0.06); box-shadow: 0 8px 30px rgba(0,0,0,0.45); }

  .note-checkbox input[type="checkbox"] { width:18px; height:18px; accent-color: var(--primary); }
  .note-checkbox span { outline:none; color:var(--text); }

  .actions { display:flex; justify-content:flex-end; gap:8px; margin-top:6px; }
  .btn-primary {
    padding:8px 14px;
    border-radius:8px;
    border:none;
    background: linear-gradient(180deg, var(--primary), color-mix(in srgb, var(--primary) 70%, black 10%));
    color: var(--bg-dark);
    cursor:pointer;
    font-weight:600;
  }

  .btn-ghost {
    padding:6px 8px;
    border-radius:8px;
    border:1px solid var(--border-muted);
    background: transparent;
    color: var(--text);
    cursor:pointer;
  }

  .card { box-shadow: 0 1px 0 rgba(0,0,0,0.25); }

  @media (max-width: 760px) {
    .row { flex-direction:column; }
    .small { width:100%; }
    .date-input { width:100%; }
  }
</style>
