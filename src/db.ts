import Dexie, { type EntityTable } from "dexie";

interface TodoList {
    id: number;
    title: string;
    state: 'incomplete' | 'focus' | 'complete'
    category: string;
}


interface Category {
  id: number;
  name: string;
}

interface AppConfig {
  id?: number;
  selectedCategories: string[];
}

const db = new Dexie('TodoListDatabase') as Dexie & {
  TodoLists: EntityTable<
    TodoList,
    'id'
  >;
  Categories: EntityTable<
    Category,
    'id'
  >;
  AppConfig: EntityTable<
    AppConfig,
    'id'
  >;
};

// Schema declaration:
db.version(1).stores({
  TodoLists: '++id, title, state, category',
  Categories: '++id, name',
  AppConfig: '++id'
});

export type { TodoList, Category, AppConfig };
export { db };