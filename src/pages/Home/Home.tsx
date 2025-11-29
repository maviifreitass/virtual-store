import React, { useState, useEffect, useMemo } from 'react';
import { Card, Spin, Image, notification } from 'antd';
import { EyeFilled } from '@ant-design/icons';
import { Product } from '../../types';
import './Home.css';

const { Meta } = Card;

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products?limit=5');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const topProducts = useMemo(() => {
    return products.slice(0, 5);
  }, [products]);

  const handleEyeClick = (product: Product) => {
    notification.error({
      title: 'Error Notification',
      message: product.title,
      description: `Failed to view details for "${product.title}". Please try again later.`,
      placement: 'topRight',
      duration: 4,
    });
  };

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to the Shop</h1>
      </div>

      <div className="products-section">
        <h2 className="section-title">Top 5 Products</h2>
        
        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="Loading products..." fullscreen />
          </div>
        ) : (
          <div className="products-grid">
            {topProducts.map((product) => (
              <Card
                key={product.id}
                hoverable
                className="product-card"
                cover={
                  <div className="product-image-container">
                    <Image
                      alt={product.title}
                      src={product.image}
                      preview={{
                        mask: 'Preview',
                      }}
                      className="product-image"
                    />
                  </div>
                }
                actions={[
                  <EyeFilled
                    key="view"
                    onClick={() => handleEyeClick(product)}
                    style={{ fontSize: '20px' }}
                  />,
                ]}
              >
                <Meta
                  title={
                    <div className="product-title">
                      {product.title}
                    </div>
                  }
                  description={
                    <div className="product-description">
                      {product.description}
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

