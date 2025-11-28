import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Products from './pages/Products';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './styles/global.css';

const AppContent = () => {
  const location = useLocation();
  const [productSearch, setProductSearch] = useState('');

  const isProductsPage = location.pathname.startsWith('/products');

  useEffect(() => {
    if (!isProductsPage && productSearch) {
      setProductSearch('');
    }
  }, [isProductsPage, productSearch]);

  return (
    <div className="App">
      <Header
        showSearch={isProductsPage}
        searchValue={productSearch}
        onSearchChange={setProductSearch}
      />
      <main className="App-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products searchTerm={productSearch} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const ThemeConfigWrapper: React.FC<{ children?: React.ReactNode }> = () => {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 12,
        },
        algorithm:
          theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <AppContent />
    </ConfigProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ThemeConfigWrapper />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
