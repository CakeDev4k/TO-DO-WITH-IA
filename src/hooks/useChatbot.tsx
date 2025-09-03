// hooks/useChatbot.ts

import { useState, useCallback } from 'react';
import { db, type TodoList, type Category } from '../db'; // Ajuste o caminho conforme necessário
import type { GeminiResponse, Message } from '../types/geminiTypes';
import { generateResponse } from '../chatbot';

interface ChatbotHookProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setTodos: React.Dispatch<React.SetStateAction<TodoList[]>>;
  newCategoryName: string;
  selectTodoCategory: string;
}

export const useChatbot = ({ categories, setCategories, setTodos, newCategoryName, selectTodoCategory }: ChatbotHookProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!userInput.trim()) return;
    setMessages((prev) => [...prev, { type: 'user', message: userInput }]);
    setIsLoading(true);

    try {
      const rawResponse = await generateResponse(userInput, selectTodoCategory);
      let response: GeminiResponse;
      try {
        response = JSON.parse(rawResponse);
      } catch {
        response = { action: 'respond', text: rawResponse };
      }

      let botMessage: string = '';

      // Lógica de adição e atualização de estado, agora dentro do hook
      if (response.action === 'add_todo' && response.text) {
        let { text, category } = response;
        if (!category) category = newCategoryName;
        const newCategory: Omit<Category, 'id'> = { name: category };
        if (!categories.some(c => c.name === category)) {
          const id = await db.Categories.add(newCategory);
          setCategories((prev) => [...prev, { name: category, id }]);
        }
        const newTodo: Omit<TodoList, 'id'> = { title: text, category: category, state: 'incomplete' };
        const id = await db.TodoLists.add(newTodo);
        setTodos((prev) => [...prev, { ...newTodo, id }]);
        botMessage = `To-do "${text}" adicionado à categoria: "${category}".`;
      } else if (response.action === 'add_category' && response.name) {
        const { name } = response;
        if (!categories.some(c => c.name === name)) {
          const newCategory: Omit<Category, 'id'> = { name };
          const id = await db.Categories.add(newCategory);
          setCategories((prev) => [...prev, { name, id }]);
          botMessage = `Categoria "${name}" adicionada.`;
        } else {
          botMessage = `Categoria "${name}" já existe.`;
        }
      } else if (response.action === 'generate_todo_list' && response.category && response.todos) {
        const { category, todos: todoList } = response;
        const newCategory: Omit<Category, 'id'> = { name: category };
        if (!categories.some(c => c.name === category)) {
          const id = await db.Categories.add(newCategory);
          setCategories((prev) => [...prev, { name: category, id }]);
        }
        const newTodos: TodoList[] = await Promise.all(
          todoList.map(async (text) => {
            const id = await db.TodoLists.add({ title: text, category: category, state: 'incomplete' });
            return { id, title: text, category: category, state: 'incomplete' };
          })
        );
        setTodos((prev) => [...prev, ...newTodos]);
        botMessage = `Lista de to-dos gerada para a categoria "${category}": ${todoList.join(', ')}.`;
      } else {
        botMessage = response.text || 'Desculpe, não entendi.';
      }

      setMessages((prev) => [...prev, { type: 'bot', message: botMessage }]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      setMessages((prev) => [...prev, { type: 'bot', message: 'Erro ao processar. Tente novamente.' }]);
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  }, [userInput, selectTodoCategory, newCategoryName, categories, setCategories, setTodos]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  return { messages, userInput, isLoading, handleKeyPress, handleSubmit, setUserInput };
};