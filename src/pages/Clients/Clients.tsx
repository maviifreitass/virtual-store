import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
  Divider,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './Clients.css';

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  phone: string;
  street: string;
  number: string;
  zipCode: string;
  city: string;
  status: 'activated' | 'deactivated';
};

const STORAGE_KEY = 'online-shop.clients';

const capitalizeFirst = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

const randomPastDate = () => {
  const now = Date.now();
  const fiveYears = 5 * 365 * 24 * 60 * 60 * 1000;
  const randomTimestamp = now - Math.floor(Math.random() * fiveYears);
  return new Date(randomTimestamp).toISOString();
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const loadStored = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Client[];
    } catch {
      return [];
    }
  };

  const save = (data: Client[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setClients(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const stored = loadStored();
        if (stored.length) {
          setClients(stored);
          setLoading(false);
          return;
        }

        const res = await fetch('https://fakestoreapi.com/users');
        const data = await res.json();

        const adapted: Client[] = data.map((u: any) => ({
          id: u.id,
          firstName: u.name.firstname,
          lastName: u.name.lastname,
          email: u.email,
          phone: u.phone,
          street: u.address.street,
          number: u.address.number,
          zipCode: '12345-6789',
          city: u.address.city,
          status: Math.random() > 0.5 ? 'activated' : 'deactivated',
          createdAt: randomPastDate(),
        }));

        save(adapted);
      } catch {
        message.error('Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        children: [
          {
            title: 'First Name',
            dataIndex: 'firstName',
            sorter: (a: Client, b: Client) => a.firstName.localeCompare(b.firstName),
            render: (v: string) => capitalizeFirst(v),
          },
          {
            title: 'Last Name',
            dataIndex: 'lastName',
            sorter: (a: Client, b: Client) => a.lastName.localeCompare(b.lastName),
            render: (v: string) => capitalizeFirst(v),
          },
        ],
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Address',
        key: 'address',
        render: (_: any, record: Client) =>
            `${record.street || ''}, ${record.number || ''} - ${record.city || ''}`,
    },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        sorter: (a: Client, b: Client) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        render: (v: string) => formatDate(v),
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        filters: [
          { text: 'Activated', value: 'activated' },
          { text: 'Deactivated', value: 'deactivated' },
        ],
        onFilter: (value: any, record: Client) => record.status === value,
        sorter: (a: Client, b: Client) =>
          a.status.localeCompare(b.status),
        render: (v: string) => (
          <Tag color={v === 'activated' ? 'green' : 'red'}>{v}</Tag>
        ),
      },
      {
        title: 'Action',
        render: (_: any, record: Client) => (
          <Space split={<Divider type="vertical" />}>
            <Tooltip title="Editar">
              <EditOutlined
                className="action-icon"
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Excluir">
              <DeleteOutlined
                className="action-icon delete"
                onClick={() => setDeleteId(record.id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [clients],
  );

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    editForm.setFieldsValue(client);
    setDrawerOpen(true);
  };

  const handleUpdate = () => {
    editForm.validateFields().then((values) => {
      if (!editingClient) return;

      const updated = clients.map((c) =>
        c.id === editingClient.id ? { ...editingClient, ...values } : c,
      );

      save(updated);
      setDrawerOpen(false);
      message.success('Cliente atualizado!');
    });
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const newClient: Client = {
        id: Date.now(),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        street: values.street,
        number: values.number,
        zipCode: values.zipCode,
        city: values.city,
        phone: values.phone,
        status: 'activated',
        createdAt: randomPastDate(),
      };

      save([newClient, ...clients]);
      message.success('Cliente cadastrado!');
      setModalOpen(false);
      form.resetFields();
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    save(clients.filter((c) => c.id !== deleteId));
    message.success('Cliente removido.');
    setDeleteId(null);
  };

  return (
    <div className="clients-page">
      <Flex justify="space-between" align="center">
        <Typography.Title level={3} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          List of Clients
        </Typography.Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          New Client
        </Button>
      </Flex>

      <Table
        loading={loading}
        columns={columns}
        dataSource={clients}
        rowKey="id"
        className="clients-table"
        pagination={{ 
            pageSize: 10,       
            showSizeChanger: true,  
            pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        bordered
      />

      {/* Novo Cliente */}
      <Modal
        title="Novo Cliente"
        open={modalOpen}
        okText="Save"
        cancelText="Cancel"
        onOk={handleCreate}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="john" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="doe" />
          </Form.Item>
          <Form.Item name="email" label="E-mail" rules={[{ required: true, type: 'email', message: 'E-mail inválido' }]}>
            <Input placeholder="john@gmail.com" />
          </Form.Item>
          <Form.Item name="street" label="Street" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="new road" />
          </Form.Item>
          <Form.Item name="number" label="Number" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="7682" />
          </Form.Item>
          <Form.Item name="zipCode" label="ZipCode" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="12926-3874" />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="kilcoole" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="1-570-236-7033" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Editar */}
      <Drawer
        title="Editar Cliente"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={400}
        extra={
          <Button type="primary" onClick={handleUpdate}>
            Salvar
          </Button>
        }
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="john" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="doe" />
          </Form.Item>
          <Form.Item name="email" label="E-mail" rules={[{ required: true, type: 'email', message: 'E-mail inválido' }]}>
            <Input placeholder="john@gmail.com" />
          </Form.Item>
          <Form.Item name="street" label="Street" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="new road" />
          </Form.Item>
          <Form.Item name="number" label="Number" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="7682" />
          </Form.Item>
          <Form.Item name="zipCode" label="ZipCode" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="12926-3874" />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="kilcoole" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="1-570-236-7033" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Delete */}
      <Modal
        open={deleteId !== null}
        title="Confirmar Exclusão"
        onOk={confirmDelete}
        okType="danger"
        onCancel={() => setDeleteId(null)}
      >
        Tem certeza que deseja excluir este cliente?
      </Modal>
    </div>
  );
};

export default Clients;