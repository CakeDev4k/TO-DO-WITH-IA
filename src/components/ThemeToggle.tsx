// src/components/ThemeToggle.tsx
import React from 'react';
import { useTheme } from '../context/ThemeProvider';

import { Sun, Moon} from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md transition-colors duration-300
                 bg-gray-200 text-black
                 dark:bg-gray-700 dark:text-white"
    >
      {theme === 'dark' ? <Sun/> : <Moon/> }
    </button>
  );
};

export default ThemeToggle;