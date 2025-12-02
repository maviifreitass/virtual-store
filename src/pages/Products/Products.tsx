import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Empty,
  Flex,
  List,
  Skeleton,
  Space,
  Spin,
  Typography,
  message,
  theme,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProductFormModal, { ProductFormValues } from './components/ProductFormModal';
import ProductListItem from './components/ProductListItem';
import type { Product } from '../../types';
import ProductEditDrawer from './components/ProductEditDrawer';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  addCustomProduct,
  deleteCustomProduct,
  selectCustomProducts,
  setCustomProducts,
  updateCustomProduct,
} from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { productsService } from '../../services/productsService';
import { categoriesService } from '../../services/categoriesService';
const CUSTOM_PRODUCTS_KEY = 'online-shop.custom-products';
const REMOTE_PRODUCTS_KEY = 'online-shop.remote-products';
const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" font-size="20" fill="%23999999" text-anchor="middle" dominant-baseline="middle">No%20image</text></svg>';

type ProductsProps = {
  searchTerm: string;
};

const Products = ({ searchTerm }: ProductsProps) => {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const customProducts = useAppSelector(selectCustomProducts);

  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const loadCachedRemoteProducts = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      const stored = localStorage.getItem(REMOTE_PRODUCTS_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored) as Product[];
      if (Array.isArray(parsed)) {
        setRemoteProducts(parsed);
        setProductsError(null);
        setLoadingProducts(false);
      }
    } catch {
      // ignore corrupted cache
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const data = await productsService.getAll();
      setRemoteProducts(data);
      setProductsError(null);
      if (typeof window !== 'undefined') {
        localStorage.setItem(REMOTE_PRODUCTS_KEY, JSON.stringify(data));
      }
    } catch (error) {
      const description =
        error instanceof Error ? error.message : 'Erro inesperado ao carregar os produtos.';
      setProductsError(description);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const loadStoredProducts = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      const stored = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored) as Product[];
      if (Array.isArray(parsed)) {
        const sanitized = parsed.map((product) => ({
          ...product,
          rating: product.rating ?? { rate: 0, count: 0 },
        }));
        dispatch(setCustomProducts(sanitized));
      }
    } catch {
      // ignore corrupted storage
    }
  }, [dispatch]);

  const combinedProducts = useMemo(
    () => [...customProducts, ...remoteProducts],
    [customProducts, remoteProducts],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return combinedProducts;
    }

    return combinedProducts.filter((product) =>
      product.title.toLowerCase().includes(normalizedSearch),
    );
  }, [combinedProducts, searchTerm]);

  const handleBuy = (product: Product) => {
    dispatch(addToCart(product));
    messageApi.success(`${product.title} adicionado ao carrinho!`);
  };

  const handleEditClick = (product: Product) => {
    const customProduct = customProducts.find((item) => item.id === product.id);
    if (!customProduct) {
      messageApi.warning('Somente produtos cadastrados podem ser editados.');
      return;
    }
    setEditingProduct(customProduct);
    setEditDrawerOpen(true);
  };

  const handleUpdateProduct = async (values: ProductFormValues) => {
    if (!editingProduct) {
      return;
    }
    try {
      setUpdatingProduct(true);
      const updatedProduct: Product = {
        ...editingProduct,
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        price: Number(values.price),
        image: values.image.trim(),
      };
      dispatch(updateCustomProduct(updatedProduct));
      messageApi.success('Produto atualizado com sucesso!');
      setEditDrawerOpen(false);
      setEditingProduct(null);
    } catch {
      messageApi.error('Não foi possível atualizar o produto. Tente novamente.');
    } finally {
      setUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    const exists = customProducts.some((item) => item.id === product.id);
    if (!exists) {
      messageApi.warning('Somente produtos cadastrados podem ser excluídos.');
      return;
    }
    dispatch(deleteCustomProduct(product.id));
    messageApi.success('Produto removido com sucesso.');
  };

  const handleCloseDrawer = () => {
    setEditDrawerOpen(false);
    setEditingProduct(null);
  };

  useEffect(() => {
    loadCachedRemoteProducts();
    loadProducts();
    loadCategories();
    loadStoredProducts();
  }, [loadCachedRemoteProducts, loadProducts, loadCategories, loadStoredProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!customProducts.length) {
      localStorage.removeItem(CUSTOM_PRODUCTS_KEY);
      return;
    }
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts));
  }, [customProducts]);

  const handleSaveProduct = async (values: ProductFormValues) => {
    try {
      setSavingProduct(true);
      const newProduct: Product = {
        id: Date.now(),
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        price: Number(values.price),
        image: values.image.trim(),
        rating: {
          rate: 0,
          count: 0,
        },
      };

      dispatch(addCustomProduct(newProduct));
      messageApi.success('Produto cadastrado com sucesso!');
      setModalOpen(false);
    } catch {
      messageApi.error('Não foi possível salvar o produto. Tente novamente.');
    } finally {
      setSavingProduct(false);
    }
  };

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CUSTOM_PRODUCTS_KEY) {
        loadStoredProducts();
      }
    };
    if (typeof window === 'undefined') {
      return undefined;
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadStoredProducts]);

  const pageStyles = useMemo(
    () => ({
      background: token.colorBgLayout,
      minHeight: '100vh',
      padding: `${token.paddingXL * 1.5}px ${token.paddingXL}px`,
    }),
    [token],
  );

  return (
    <div id="products-page" style={pageStyles}>
      {contextHolder}

      <Flex justify="space-between" align="center" wrap="wrap" gap={token.marginMD}>
        <Space orientation="vertical" size={0}>
          <Typography.Text type="secondary">Online Shop</Typography.Text>
          <Typography.Title level={3} style={{ margin: 0 }}>
            List of Products
          </Typography.Title>
        </Space>

        <Space size="large" wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            disabled={categoriesLoading}
          >
            New Product
          </Button>
        </Space>
      </Flex>

      <div style={{ marginTop: token.marginXL }}>
        {productsError && (
          <Alert
            type="error"
            message="Erro ao carregar produtos"
            description={productsError}
            showIcon
            style={{ marginBottom: token.marginLG }}
          />
        )}

        {loadingProducts ? (
          <Spin tip="Loading Products..." size="large" fullscreen>
            <Skeleton active style={{ marginTop: token.marginXL }} />
          </Spin>
        ) : (
          <List
            grid={{
              gutter: token.marginXL,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={filteredProducts}
            locale={{
              emptyText: <Empty description="Nenhum produto encontrado" />,
            }}
            renderItem={(product) => {
              const isCustomProduct = customProducts.some(
                (customProduct) => customProduct.id === product.id,
              );
              const canManage = isCustomProduct;
              return (
                <List.Item key={product.id} style={{ height: '100%' }}>
                  <ProductListItem
                    product={product}
                    fallbackImage={FALLBACK_IMAGE}
                    onBuy={handleBuy}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                    canManage={canManage}
                  />
                </List.Item>
              );
            }}
          />
        )}
      </div>

      <ProductFormModal
        open={modalOpen}
        saving={savingProduct}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onSubmit={handleSaveProduct}
        onCancel={() => setModalOpen(false)}
      />
      <ProductEditDrawer
        open={editDrawerOpen}
        product={editingProduct}
        saving={updatingProduct}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onSubmit={handleUpdateProduct}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};

export default Products;