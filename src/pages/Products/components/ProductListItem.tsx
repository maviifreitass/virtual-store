import {
  Button,
  Flex,
  Grid,
  Image,
  Popconfirm,
  Rate,
  Space,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { Product } from '../../../types';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ProductListItemProps = {
  product: Product;
  fallbackImage: string;
  onBuy: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  canManage?: boolean;
};

const { useBreakpoint } = Grid;

const ProductListItem = ({
  product,
  fallbackImage,
  onBuy,
  onEdit,
  onDelete,
  canManage = false,
}: ProductListItemProps) => {
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const isStackedLayout = !screens.md;
  const manageButtonsDisabled = !canManage;
  const editTooltip = manageButtonsDisabled
    ? 'Apenas produtos cadastrados localmente podem ser editados.'
    : 'Editar produto';
  const deleteTooltip = manageButtonsDisabled
    ? 'Apenas produtos cadastrados localmente podem ser excluídos.'
    : 'Excluir produto';

  return (
    <Flex
      gap={token.marginLG}
      align="stretch"
      wrap={isStackedLayout}
      style={{
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorder}`,
        padding: token.paddingLG,
        background: token.colorBgContainer,
        minHeight: isStackedLayout ? 'auto' : 360,
        minWidth: isStackedLayout ? 'auto' : 280,
        height: '100%',
        boxShadow: token.boxShadowSecondary,
        flexDirection: isStackedLayout ? 'column' : 'row',
      }}
    >
      <Flex
        align="center"
        justify="center"
        style={{
          background: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          padding: token.padding,
          flex: isStackedLayout ? '0 0 auto' : '0 0 160px',
          maxWidth: isStackedLayout ? '100%' : 180,
        }}
      >
        <Image
          src={product.image}
          alt={product.title}
          fallback={fallbackImage}
          width={140}
          height={140}
          style={{
            objectFit: 'contain',
          }}
          preview={false}
        />
      </Flex>

      <Flex
        vertical
        justify="space-between"
        style={{ flex: 1, minWidth: isStackedLayout ? '100%' : 200 }}
      >
        <Flex vertical gap={token.marginXS}>
          <Flex justify="space-between" align="flex-start" gap={token.marginSM}>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {product.title}
            </Typography.Title>
            <Space size={8}>
              <Tooltip title={editTooltip}>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit?.(product)}
                  aria-label="Editar produto"
                  disabled={manageButtonsDisabled}
                />
              </Tooltip>
              <Popconfirm
                title="Remover produto"
                description="Tem certeza que deseja remover este produto?"
                okText="Sim"
                cancelText="Cancelar"
                onConfirm={() => onDelete?.(product)}
                disabled={manageButtonsDisabled}
              >
                <Tooltip title={deleteTooltip}>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    aria-label="Excluir produto"
                    disabled={manageButtonsDisabled}
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          </Flex>
          <Flex gap={token.marginXS} align="center" wrap>
            <Rate disabled allowHalf value={product.rating?.rate ?? 0} />
            <Typography.Text type="secondary">
              ({product.rating?.count ?? 0})
            </Typography.Text>
          </Flex>
          <Typography.Paragraph
            type="secondary"
            ellipsis={{ rows: 3, tooltip: product.description }}
            style={{ marginBottom: 0 }}
          >
            {product.description}
          </Typography.Paragraph>
        </Flex>

        <Flex vertical gap={token.marginSM}>
          <Typography.Text strong style={{ fontSize: 16 }}>
            Price: {priceFormatter.format(product.price).replace('$', 'US$ ')}
          </Typography.Text>

          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            block
            onClick={() => onBuy(product)}
            size="large"
          >
            Buy
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProductListItem;


