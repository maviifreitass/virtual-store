import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Button, Drawer, Input } from 'antd';
import { MenuOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import ThemeSwitcher from './ThemeSwitcher';
import CartModal from '../pages/Products/components/CartModal';
import { useAppSelector } from '../redux/hooks';
import { selectCartItemsCount } from '../redux/slices/cartSlice';
import './Header.css';

const { Search } = Input;

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/clients', label: 'Clients' },
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (value: string) => {
    onSearchChange?.(value);
  };

  const renderNavLinks = (onNavigate?: () => void) =>
    NAV_LINKS.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        onClick={onNavigate}
      >
        {link.label}
      </NavLink>
    ));

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <ShoppingOutlined className="logo-icon" />
            <span className="logo-text">Online Shop</span>
          </div>

          <nav className="nav-menu desktop-nav">{renderNavLinks()}</nav>

          <Button
            className="mobile-menu-button"
            type="text"
            icon={<MenuOutlined />}
            aria-label="Abrir menu de navegação"
            onClick={() => setMobileMenuOpen(true)}
            shape="circle"
            size="large"
          />

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
              <Button icon={<ShoppingCartOutlined />} onClick={() => setCartModalOpen(true)}>
                Cart
              </Button>
            </Badge>
          </div>
        </div>
      </header>

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
        className="mobile-nav-drawer"
      >
        <nav className="mobile-nav-menu">{renderNavLinks(closeMobileMenu)}</nav>
      </Drawer>

      <CartModal open={cartModalOpen} onClose={() => setCartModalOpen(false)} />
    </>
  );
};

export default Header;