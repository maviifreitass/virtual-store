import React from 'react';
import { Switch } from 'antd';
import { MoonFilled, SunFilled } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        checkedChildren={<MoonFilled />}
        unCheckedChildren={<SunFilled />}
        aria-label="Alternar tema"
      />
    </div>
  );
};

export default ThemeSwitcher;
