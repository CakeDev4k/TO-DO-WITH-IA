import { type TodoList } from '../db'
import { useState } from 'react'

// Componente para todo com ícone de excluir ao hover (apenas visual)
type TodoCompType = {
  todo: TodoList;
  onToggle: (id: number) => void;
  onDeleteTodo: (id: number) => void;
};

export function TodoItem({ todo, onToggle, onDeleteTodo }: TodoCompType) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="flex items-center mb-4 group justify-between"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className='flex'>
        <input
          type="checkbox"
          checked={todo.state === 'complete'}
          onChange={() => onToggle(todo.id)}
          className="w-4 h-4 text-blue-600 bg-gray-400 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="default-checkbox"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center cursor-pointer relative"
          style={{ position: 'relative' }}
        >
          {todo.title} <span className="ml-2 text-xs text-gray-500">[{todo.category}]</span>
        </label>
      </div>
      {hover && (
        <button
          className="ml-2 cursor-pointer"
          title="Excluir"
          style={{ fontSize: '0.8em' }}
          onClick={() => onDeleteTodo(todo.id)}
        >
          🗑️
        </button>
      )}
    </div>
  );
}