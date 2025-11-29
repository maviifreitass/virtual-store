import { Drawer, Button, theme } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ClientForm } from './ClientForm';

type ClientDrawerProps = {
  open: boolean;
  form: FormInstance;
  onClose: () => void;
  onSave: () => void;
};

export const ClientDrawer = ({ open, form, onClose, onSave }: ClientDrawerProps) => {
  const { token } = theme.useToken();

  const handleSave = async () => {
    try {
      await form.validateFields();
      onSave();
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title="Editar Cliente"
      open={open}
      onClose={onClose}
      size="default" // ✅ Mudou de width={400}. Opções: 'default' (378px) | 'large' (736px)
      maskClosable={false}
      keyboard={false}
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}` }
      }}
      extra={
        <Button type="primary" onClick={handleSave}>
          Salvar
        </Button>
      }
    >
      <ClientForm form={form} />
    </Drawer>
  );
};