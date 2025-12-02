import { useEffect } from 'react';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setClients,
  setLoading,
  addClient as addClientAction,
  updateClient as updateClientAction,
  deleteClient as deleteClientAction,
  selectClients,
  selectClientsLoading,
  type Client,
} from '../../redux/slices/clientsSlice';
import { usersService } from '../../services/usersService';

const STORAGE_KEY = 'online-shop.clients';

const randomPastDate = () => {
  const now = Date.now();
  const fiveYears = 5 * 365 * 24 * 60 * 60 * 1000;
  const randomTimestamp = now - Math.floor(Math.random() * fiveYears);
  return new Date(randomTimestamp).toISOString();
};

export const useClients = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectClients);
  const loading = useAppSelector(selectClientsLoading);

  const loadStored = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Client[];
    } catch {
      return [];
    }
  };

  const saveToStorage = (data: Client[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    const init = async () => {
      try {
        dispatch(setLoading(true));
        const stored = loadStored();
        
        if (stored.length) {
          dispatch(setClients(stored));
          return;
        }

        const data = await usersService.getAll();

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

        dispatch(setClients(adapted));
        saveToStorage(adapted);
      } catch {
        message.error('Erro ao carregar clientes');
      } finally {
        dispatch(setLoading(false));
      }
    };

    init();
  }, [dispatch]);

  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'status'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now(),
      status: 'activated',
      createdAt: randomPastDate(),
    };

    dispatch(addClientAction(newClient));
    const updated = [newClient, ...clients];
    saveToStorage(updated);
    message.success('Cliente cadastrado!');
  };

  const updateClient = (client: Client) => {
    dispatch(updateClientAction(client));
    const updated = clients.map((c) => (c.id === client.id ? client : c));
    saveToStorage(updated);
    message.success('Cliente atualizado!');
  };

  const deleteClient = (id: number) => {
    dispatch(deleteClientAction(id));
    const updated = clients.filter((c) => c.id !== id);
    saveToStorage(updated);
    message.success('Cliente removido.');
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
  };
};