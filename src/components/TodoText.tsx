import React, { useState } from 'react';

interface TodoTextProps {
  text: string;
  onDelete: () => void;
}

const TodoText: React.FC<TodoTextProps> = ({ text, onDelete }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="flex items-center gap-2 group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="flex-1">{text}</span>
      {hover && (
        <button
          className="text-red-500 hover:text-red-700 transition-colors"
          onClick={onDelete}
          aria-label="Deletar todo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TodoText;
