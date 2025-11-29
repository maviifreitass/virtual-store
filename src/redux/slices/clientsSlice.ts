import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type Client = {
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

type ClientsState = {
  clients: Client[];
  loading: boolean;
};

const initialState: ClientsState = {
  clients: [],
  loading: false,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients = [action.payload, ...state.clients];
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      state.clients = state.clients.map((client) =>
        client.id === action.payload.id ? action.payload : client,
      );
    },
    deleteClient: (state, action: PayloadAction<number>) => {
      state.clients = state.clients.filter(
        (client) => client.id !== action.payload,
      );
    },
  },
});

export const {
  setClients,
  setLoading,
  addClient,
  updateClient,
  deleteClient,
} = clientsSlice.actions;

export const selectClients = (state: RootState) => state.clients.clients;
export const selectClientsLoading = (state: RootState) => state.clients.loading;

export default clientsSlice.reducer;