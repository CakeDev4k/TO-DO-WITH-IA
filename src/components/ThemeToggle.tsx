// src/components/ThemeToggle.tsx
import React from 'react';
import { useTheme } from '../context/ThemeProvider';

import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
};

export default ThemeToggle;