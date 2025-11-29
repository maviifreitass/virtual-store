import { useMemo } from 'react';
import { Table, Tag, Space, Tooltip, Divider } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Client } from '../../redux/slices/clientsSlice';

type ClientsTableProps = {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
};

const capitalizeFirst = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

export const ClientsTable = ({ clients, loading, onEdit, onDelete }: ClientsTableProps) => {
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
        sorter: (a: Client, b: Client) => a.status.localeCompare(b.status),
        render: (v: string) => (
          <Tag color={v === 'activated' ? 'green' : 'red'}>
            {capitalizeFirst(v)}
          </Tag>
        ),
      },
      {
        title: 'Action',
        render: (_: any, record: Client) => (
          <Space separator={<Divider orientation="vertical" />}> {/* ✅ Mudou de split para separator e type para orientation */}
            <Tooltip title="Editar">
              <EditOutlined
                className="action-icon"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Excluir">
              <DeleteOutlined
                className="action-icon delete"
                onClick={() => onDelete(record.id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
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
  );
};