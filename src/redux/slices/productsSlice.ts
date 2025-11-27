import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import type { RootState } from '../store';

type ProductsState = {
  customProducts: Product[];
};

const initialState: ProductsState = {
  customProducts: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCustomProducts: (state, action: PayloadAction<Product[]>) => {
      state.customProducts = action.payload;
    },
    addCustomProduct: (state, action: PayloadAction<Product>) => {
      state.customProducts = [action.payload, ...state.customProducts];
    },
    updateCustomProduct: (state, action: PayloadAction<Product>) => {
      state.customProducts = state.customProducts.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    },
    deleteCustomProduct: (state, action: PayloadAction<number>) => {
      state.customProducts = state.customProducts.filter(
        (product) => product.id !== action.payload,
      );
    },
  },
});

export const {
  setCustomProducts,
  addCustomProduct,
  updateCustomProduct,
  deleteCustomProduct,
} = productsSlice.actions;

export const selectCustomProducts = (state: RootState) => state.products.customProducts;

export default productsSlice.reducer;


