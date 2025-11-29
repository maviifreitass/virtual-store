import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Input, Badge } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import ThemeSwitcher from './ThemeSwitcher';
import CartModal from '../pages/Products/components/CartModal';
import { useAppSelector } from '../redux/hooks';
import { selectCartItemsCount } from '../redux/slices/cartSlice';
import './Header.css';

const { Search } = Input;

interface HeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  searchValue = '',
  onSearchChange,
}) => {
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const handleSearch = (value: string) => {
    onSearchChange?.(value);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <ShoppingOutlined className="logo-icon" />
            <span className="logo-text">Online Shop</span>
          </div>

          <nav className="nav-menu">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Products
            </NavLink>
            <NavLink
              to="/clients"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Clients
            </NavLink>
          </nav>

          {showSearch && (
            <div className="search-section">
              <Search
                placeholder="Find Product"
                allowClear
                value={searchValue}
                onChange={(event) => handleSearch(event.target.value)}
                onSearch={handleSearch}
              />
            </div>
          )}

          <div className="actions-section">
            <ThemeSwitcher />
            <Badge count={cartItemsCount} showZero offset={[-5, 5]}>
              <Button 
                icon={<ShoppingCartOutlined />}
                onClick={() => setCartModalOpen(true)}
              >
                Cart
              </Button>
            </Badge>
          </div>
        </div>
      </header>

      <CartModal open={cartModalOpen} onClose={() => setCartModalOpen(false)} />
    </>
  );
};

export default Header;