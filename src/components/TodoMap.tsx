import React from 'react';
import { TodoItem } from './TodoItem';
import type { TodoList } from '../db';

interface TodoListProps {
  todos: TodoList[];
  onToggle: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const TodoMap: React.FC<TodoListProps> = ({ todos, onToggle, onDeleteTodo }) => {
  return (
    <div className='flex flex-col p-4 overflow-auto h-[90vh]'>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </div>
  );
};

export default TodoMap;
