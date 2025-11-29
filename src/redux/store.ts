import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import clientsReducer from './slices/clientsSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    clients: clientsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;