import { writable, derived } from 'svelte/store';

export type Task = {
  id: string;
  title: string;
  category?: string;
  content?: string;
  done: boolean;
  createdAt: string;
};

const LS_KEY = 'taskapp:tasks:v1';
const id = () => Math.random().toString(36).slice(2, 9);

/* ---------- helpers localStorage ---------- */
function readLocal(): Task[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : null;
  } catch {
    return null;
  }
}
function writeLocal(tasks: Task[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('local write failed', e);
  }
}

/* ---------- helper backend ---------- */
async function tauriInvoke(name: string, payload?: any) {
  try {
    if (typeof window === 'undefined') return null;
    const { invoke } = await import('@tauri-apps/api/core'); // actualizado
    return await invoke(name, payload);
  } catch (e) {
    // si no está en tauri, no rompe
    return null;
  }
}

/* ---------- Store principal ---------- */
function createTasksStore() {
  const initial: Task[] =
    readLocal() ?? [
      {
        id: id(),
        title: 'Comprar leche',
        category: 'Compras',
        content: '<p>Comprar 1 litro de leche</p>',
        done: false,
        createdAt: new Date().toISOString()
      },
      {
        id: id(),
        title: 'Enviar informe',
        category: 'Trabajo',
        content: '<ul><li>Item 1</li><li>Item 2</li></ul>',
        done: true,
        createdAt: new Date().toISOString()
      }
    ];

  const { subscribe, update, set } = writable<Task[]>(initial);

  // guarda en localStorage
  let timer: ReturnType<typeof setTimeout> | null = null;
  subscribe((v) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => writeLocal(v), 200);
  });

  return {
    subscribe,

    /* ---- Backend ---- */
    loadFromBackend: async () => {
      const remote = await tauriInvoke('get_tasks');
      if (Array.isArray(remote)) {
        set(remote as Task[]);
        writeLocal(remote as Task[]);
        return { ok: true };
      }
      return { ok: false };
    },

    add: async (t: Omit<Task, 'id' | 'done' | 'createdAt'>) => {
      const newTask: Task = {
        id: id(),
        title: t.title,
        category: t.category,
        content: t.content,
        done: false,
        createdAt: new Date().toISOString()
      };

      update((items) => [newTask, ...items]);

      const res = await tauriInvoke('add_task', { task: newTask });
      if (!res) console.warn('fallback local add');
      return newTask;
    },

    toggle: async (taskId: string) => {
      update((items) =>
        items.map((i) => (i.id === taskId ? { ...i, done: !i.done } : i))
      );
      await tauriInvoke('toggle_task', { id: taskId });
    },

    remove: async (taskId: string) => {
      update((items) => items.filter((i) => i.id !== taskId));
      await tauriInvoke('remove_task', { id: taskId });
    },

    updateTask: async (taskId: string, data: Partial<Task>) => {
      update((items) =>
        items.map((i) => (i.id === taskId ? { ...i, ...data } : i))
      );
      await tauriInvoke('update_task', { id: taskId, data });
    },

    reset: () => {
      set(initial);
      writeLocal(initial);
    },

    importJSON: (json: string) => {
      try {
        const parsed = JSON.parse(json) as Task[];
        set(parsed);
        writeLocal(parsed);
      } catch (e) {
        console.error('Import failed', e);
      }
    },

    exportJSON: async () => {
      let data: Task[] = [];
      const unsub = subscribe((v) => (data = v));
      unsub();
      return JSON.stringify(data, null, 2);
    }
  };
}

export const tasks = createTasksStore();

/* ---------- Derived stores ---------- */
export const taskCounts = derived(tasks, ($t) => ({
  total: $t.length,
  completed: $t.filter((x) => x.done).length,
  pending: $t.filter((x) => !x.done).length
}));

export const pendingTasks = derived(tasks, ($t) => $t.filter((x) => !x.done));
