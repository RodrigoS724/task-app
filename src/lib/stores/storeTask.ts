// src/lib/stores/tasks.ts
import { writable } from 'svelte/store';

export type Task = {
  id: string;
  title: string;
  description?: string;
  content?: string;
  done: boolean;
  createdAt: string;
};

const id = () => Math.random().toString(36).slice(2,9);

const initial: Task[] = [
  { id: id(), title: 'Comprar leche', description: 'Entera o descremada', content: '<p>Comprar 1 litro de leche</p>', done: false, createdAt: new Date().toISOString() },
  { id: id(), title: 'Enviar informe', description: 'Adjuntar CSV', content: '<ul><li>Item 1</li><li>Item 2</li></<ul/>', done: true, createdAt: new Date().toISOString() }
];

function createTasksStore() {
  const { subscribe, update, set } = writable<Task[]>(initial);

  // persistir en localStorage
  const LS_KEY = 'taskapp:tasks';
  const load = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) set(JSON.parse(raw));
    } catch (e) {/* ignore */}
  };
  subscribe(v => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(v)); } catch (e) {}
  });

  // cargar una vez (solo en browser)
  if (typeof window !== 'undefined') load();

  return {
    subscribe,
    add: (t: { title: string; description?: string; content?: string }) =>
      update(items => [{ id: id(), title: t.title, description: t.description, content: t.content, done: false, createdAt: new Date().toISOString() }, ...items]),
    toggle: (taskId: string) =>
      update(items => items.map(i => (i.id === taskId ? { ...i, done: !i.done } : i))),
    remove: (taskId: string) => update(items => items.filter(i => i.id !== taskId)),
    updateTask: (taskId: string, data: Partial<Task>) =>
      update(items => items.map(i => (i.id === taskId ? { ...i, ...data } : i))),
    reset: () => set(initial)
  };
}

export const tasks = createTasksStore();
