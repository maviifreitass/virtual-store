import React from 'react';
import { Input } from 'antd';
import { LoginOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import './Header.css';

const { Search } = Input;

interface HeaderProps {
  onSearch?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <ShoppingOutlined className="logo-icon" />
          <span className="logo-text">Online Shop</span>
        </div>
        
        <nav className="nav-menu">
          <a href="/" className="nav-link">Home</a>
        </nav>
        
        <div className="search-section">
          <Search
            placeholder="Camiseta Jeans"
            allowClear
            onSearch={onSearch}
            style={{ width: 600 }}
          />
        </div>
        
        <div className="actions-section">
          <button className="action-button">
            <LoginOutlined />
            <span>Login</span>
          </button>
          <button className="action-button">
            <ShoppingCartOutlined />
            <span>Carrinho</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

