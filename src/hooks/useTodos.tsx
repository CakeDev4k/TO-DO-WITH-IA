import { useState, useEffect, useCallback } from 'react';
import { db, type TodoList } from '../db';

export function useTodos({ selectedCategories }: { selectedCategories?: string[] }) {
  const [todos, setTodos] = useState<TodoList[]>([]);

  let filteredTodos: TodoList[] = [];

  // Filtragem
  if (selectedCategories && selectedCategories.length) {
    filteredTodos = todos.filter((todo) => selectedCategories.includes(todo.category));
  } else {
    filteredTodos = todos;
  }

  // Carrega todos do banco ao iniciar
  useEffect(() => {
    const fetchTodos = async () => {
      const todosFromDb = await db.TodoLists.toArray();
      setTodos(todosFromDb);
    };
    fetchTodos();
  }, []);

  // Adiciona um novo todo
  const addTodo = useCallback(async (title: string, category: string) => {
    if (!title || !category) return;
    const todo: Omit<TodoList, 'id'> = { title, category, state: 'incomplete' };
    const id = await db.TodoLists.add(todo);
    setTodos(prev => [...prev, { ...todo, id }]);
  }, []);

  // Remove um todo
  const deleteTodo = useCallback(async (id?: number) => {
    if (!id) return;
    await db.TodoLists.delete(id);
    setTodos(prev => prev.filter((todo) => todo.id !== id));
  }, []);

  // Alterna o estado de um todo
  const toggleTodoState = useCallback(async (id: number) => {
    setTodos(prev => {
      const updated = prev.map(todo => {
        if (todo.id === id) {
          const newState: 'incomplete' | 'complete' = todo.state === 'complete' ? 'incomplete' : 'complete';
          db.TodoLists.update(id, { state: newState });
          return { ...todo, state: newState };
        }
        return todo;
      });
      return updated;
    });
  }, []);

  // Remove todos por categoria
  const removeTodosByCategory = useCallback(async (categoryName: string) => {
    const todosToDelete = await db.TodoLists.where('category').equals(categoryName).toArray();
    for (const todo of todosToDelete) {
      await db.TodoLists.delete(todo.id);
    }
    setTodos(prev => prev.filter((todo) => todo.category !== categoryName));
  }, []);

  return {
    todos,
    filteredTodos,
    addTodo,
    deleteTodo,
    toggleTodoState,
    removeTodosByCategory,
    setTodos // caso precise manipular diretamente
  };
}
