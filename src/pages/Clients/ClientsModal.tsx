import { Modal, theme } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ClientForm } from './ClientForm';

type ClientFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  number: string;
  zipCode: string;
  city: string;
  phone: string;
};

type ClientModalProps = {
  open: boolean;
  form: FormInstance<ClientFormValues>;
  onOk: () => void;
  onCancel: () => void;
};

export const ClientModal = ({ open, form, onOk, onCancel }: ClientModalProps) => {
  const { token } = theme.useToken();

  const handleOk = async () => {
    try {
      await form.validateFields();
      onOk();
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Novo Cliente"
      open={open}
      okText="Save"
      cancelText="Cancel"
      onOk={handleOk}
      onCancel={onCancel}
      maskClosable={false}
      keyboard={false}
      destroyOnHidden // ✅ Mudou de destroyOnClose
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}` },
        footer: { borderTop: `1px solid ${token.colorBorderSecondary}` },
      }}
    >
      <ClientForm form={form} />
    </Modal>
  );
};

export type { ClientFormValues };