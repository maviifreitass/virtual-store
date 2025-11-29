import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import clientsReducer from './slices/clientsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    clients: clientsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


