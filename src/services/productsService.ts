import type { Product } from '../types';
import { fakeStoreApiClient } from './fakeStoreApi';

class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  getAll(): Promise<Product[]> {
    return fakeStoreApiClient.get<Product[]>('/products');
  }
}

export const productsService = ProductsService.getInstance();

