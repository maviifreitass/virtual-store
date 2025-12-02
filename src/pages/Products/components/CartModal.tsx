import { useState } from 'react';
import {
  Modal,
  List,
  Typography,
  Button,
  Space,
  InputNumber,
  Image,
  Empty,
  Flex,
  Divider,
  message,
  Popconfirm,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ClearOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../../../redux/slices/cartSlice';
import './CartModal.css';

const { Text, Title } = Typography;

type CartModalProps = {
  open: boolean;
  onClose: () => void;
};

const CartModal = ({ open, onClose }: CartModalProps) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const [messageApi, contextHolder] = message.useMessage();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    messageApi.success('Item removido do carrinho');
  };

  const handleQuantityChange = (productId: number, quantity: number | null) => {
    if (quantity && quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    messageApi.success('Carrinho limpo com sucesso');
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    
    // Simula um processo de checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    dispatch(clearCart());
    setCheckoutLoading(false);
    
    Modal.success({
      title: 'Compra Finalizada!',
      content: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>Sua compra foi realizada com sucesso!</Text>
          <Text type="secondary">
            Total: <Text strong>R$ {cartTotal.toFixed(2)}</Text>
          </Text>
          <Text type="secondary">
            Você receberá um e-mail de confirmação em breve.
          </Text>
        </Space>
      ),
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      onOk: onClose,
    });
  };

  const isEmpty = cartItems.length === 0;

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <Space>
            <ShoppingCartOutlined />
            <span>Carrinho de Compras</span>
          </Space>
        }
        open={open}
        onCancel={onClose}
        width={700}
        footer={null}
        className="cart-modal"
      >
        {isEmpty ? (
          <Empty
            description="Seu carrinho está vazio"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '40px 0' }}
          />
        ) : (
          <>
            <List
              className="cart-modal__list"
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item
                  key={item.product.id}
                  className="cart-modal__item"
                  style={{ padding: '16px 0' }}
                  actions={[
                    <Popconfirm
                      title="Remover item"
                      description="Deseja remover este item do carrinho?"
                      onConfirm={() => handleRemoveItem(item.product.id)}
                      okText="Sim"
                      cancelText="Não"
                      key="delete"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        Remover
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <div className="cart-modal__item-info">
                    <List.Item.Meta
                      avatar={
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          width={60}
                          height={60}
                          style={{ objectFit: 'contain' }}
                          preview={false}
                        />
                      }
                      title={
                        <Text strong ellipsis style={{ maxWidth: 300 }}>
                          {item.product.title}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text type="secondary">
                            R$ {item.product.price.toFixed(2)} / unidade
                          </Text>
                          <Space
                            className="cart-modal__quantity"
                            align="center"
                            size="small"
                            wrap
                          >
                            <Text type="secondary">Quantidade:</Text>
                            <InputNumber
                              min={1}
                              max={99}
                              value={item.quantity}
                              onChange={(value) =>
                                handleQuantityChange(item.product.id, value)
                              }
                              size="middle"
                              style={{ width: 88 }}
                            />
                          </Space>
                        </Space>
                      }
                    />
                  </div>
                  <div className="cart-modal__item-total">
                    <Title level={5} style={{ margin: 0 }}>
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </Title>
                  </div>
                </List.Item>
              )}
            />

            <Divider />

            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                Total:
              </Title>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                R$ {cartTotal.toFixed(2)}
              </Title>
            </Flex>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<CheckCircleOutlined />}
                onClick={handleCheckout}
                loading={checkoutLoading}
              >
                Finalizar Compra
              </Button>

              <Popconfirm
                title="Limpar carrinho"
                description="Deseja remover todos os itens do carrinho?"
                onConfirm={handleClearCart}
                okText="Sim"
                cancelText="Não"
              >
                <Button
                  size="large"
                  block
                  icon={<ClearOutlined />}
                  danger
                >
                  Limpar Carrinho
                </Button>
              </Popconfirm>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
};

export default CartModal;