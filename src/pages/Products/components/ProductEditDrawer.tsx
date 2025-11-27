import { Button, Drawer, Form, Input, InputNumber, Select, Space } from 'antd';
import { useEffect } from 'react';
import type { Product } from '../../../types';
import type { ProductFormValues } from './ProductFormModal';

type ProductEditDrawerProps = {
  open: boolean;
  product: Product | null;
  saving: boolean;
  categories: string[];
  categoriesLoading: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  onClose: () => void;
};

const ProductEditDrawer = ({
  open,
  product,
  saving,
  categories,
  categoriesLoading,
  onSubmit,
  onClose,
}: ProductEditDrawerProps) => {
  const [form] = Form.useForm<ProductFormValues>();

  useEffect(() => {
    if (product && open) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        image: product.image,
      });
    } else {
      form.resetFields();
    }
  }, [product, open, form]);

  const handleFinish = async (values: ProductFormValues) => {
    await onSubmit(values);
  };

  return (
    <Drawer
      title="Editar Produto"
      placement="right"
      destroyOnClose
      maskClosable={false}
      onClose={onClose}
      open={open}
      width={520}
      footer={
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" loading={saving} onClick={() => form.submit()}>
            Salvar alterações
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleFinish} requiredMark={false}>
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
          <InputNumber<number>
            style={{ width: '100%' }}
            formatter={(value) => {
              const currentValue =
                value === undefined || value === null ? '0' : value.toString();
              return `$ ${currentValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
            parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ''))}
            min={1}
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
    </Drawer>
  );
};

export default ProductEditDrawer;


