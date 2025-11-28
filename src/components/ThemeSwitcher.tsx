import React from 'react';
import { Switch } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
        aria-label="Toggle theme"
      />
    </div>
  );
};

export default ThemeSwitcher;
