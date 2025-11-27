import { Form, Input, InputNumber, Modal, Select, theme } from 'antd';
import type { Product } from '../../../types';

type ProductFormValues = Pick<Product, 'title' | 'description' | 'category' | 'price' | 'image'>;

type ProductFormModalProps = {
  open: boolean;
  saving: boolean;
  categories: string[];
  categoriesLoading: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const MIN_PRICE: number = 1;

const ProductFormModal = ({
  open,
  saving,
  categories,
  categoriesLoading,
  onSubmit,
  onCancel,
}: ProductFormModalProps) => {
  const [form] = Form.useForm<ProductFormValues>();
  const { token } = theme.useToken();

  const handleFinish = async (values: ProductFormValues) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="New Product"
      open={open}
      okText="Save"
      cancelText="Cancel"
      confirmLoading={saving}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      maskClosable={false}
      keyboard={false}
      destroyOnClose
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}` },
        footer: { borderTop: `1px solid ${token.colorBorderSecondary}` },
      }}
    >
      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={handleFinish}
        initialValues={{ price: MIN_PRICE }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: 'Please inform the product title.' },
            { min: 3, message: 'Title should have at least 3 characters.' },
          ]}
        >
          <Input placeholder="Ex: Mens Casual Premium Slim Fit T-Shirts" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Please add a description.' },
            { min: 10, message: 'Description should have at least 10 characters.' },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Tell shortly about the product" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category.' }]}
        >
          <Select
            placeholder="Select a category"
            showSearch
            optionFilterProp="label"
            loading={categoriesLoading}
            options={categories.map((category) => ({
              label: category,
              value: category,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: 'Please inform the price.' },
            { type: 'number', min: 1, message: 'Price must be greater than zero.' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => {
              const currentValue =
                value === undefined || value === null ? '0' : value.toString();
              return `$ ${currentValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
            parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ''))}
            min={MIN_PRICE}
          />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[
            { required: true, message: 'Please add an image URL.' },
            {
              type: 'url',
              message: 'Please enter a valid URL.',
            },
          ]}
        >
          <Input placeholder="https://example.com/product.png" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export type { ProductFormValues };
export default ProductFormModal;


