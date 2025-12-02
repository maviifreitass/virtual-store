import { useState } from 'react';
import { Button, Flex, Form, Typography, Spin, Skeleton } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useClients } from './useClients';
import { ClientsTable } from './ClientsTable';
import { ClientModal } from './ClientsModal';
import { ClientDrawer } from './ClientDrawer';
import { DeleteClientModal } from './DeleteClientModal';
import type { Client } from '../../redux/slices/clientsSlice';
import './Clients.css';

const Clients = () => {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    editForm.setFieldsValue(client);
    setDrawerOpen(true);
  };

  const handleUpdate = () => {
    editForm.validateFields().then((values) => {
      if (!editingClient) return;
      updateClient({ ...editingClient, ...values });
      setDrawerOpen(false);
    });
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      addClient(values);
      setModalOpen(false);
      form.resetFields();
    });
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    deleteClient(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="clients-page">
      <Flex justify="space-between" align="center" className="clients-header" wrap="wrap">
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

      {loading ? (
        <Spin tip="Loading Clients..." size="large" fullscreen>
          <Skeleton active style={{ marginTop: 24 }} />
        </Spin>
      ) : (
        <div className="clients-table-wrapper">
          <ClientsTable
            clients={clients}
            loading={loading}
            onEdit={handleEdit}
            onDelete={setDeleteId}
          />
        </div>
      )}

      <ClientModal
        open={modalOpen}
        form={form}
        onOk={handleCreate}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
      />

      <ClientDrawer
        open={drawerOpen}
        form={editForm}
        onClose={() => setDrawerOpen(false)}
        onSave={handleUpdate}
      />

      <DeleteClientModal
        open={deleteId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Clients;