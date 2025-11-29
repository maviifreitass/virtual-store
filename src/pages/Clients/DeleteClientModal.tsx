import { Modal } from 'antd';

type DeleteClientModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteClientModal = ({ open, onConfirm, onCancel }: DeleteClientModalProps) => {
  return (
    <Modal
      open={open}
      title="Confirmar Exclusão"
      onOk={onConfirm}
      okType="danger"
      okText="Excluir"
      cancelText="Cancelar"
      onCancel={onCancel}
    >
      <p>Tem certeza que deseja excluir este cliente?</p>
    </Modal>
  );
};