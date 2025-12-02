import type { Product, User } from '../types';

class FakeStoreApi {
  private static instance: FakeStoreApi;

  private readonly baseUrl = 'https://fakestoreapi.com';

  private constructor() {}

  static getInstance(): FakeStoreApi {
    if (!FakeStoreApi.instance) {
      FakeStoreApi.instance = new FakeStoreApi();
    }
    return FakeStoreApi.instance;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, init);
    if (!response.ok) {
      throw new Error(`FakeStore API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  }

  getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  getCategories(): Promise<string[]> {
    return this.request<string[]>('/products/categories');
  }

  getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }
}

export const fakeStoreApi = FakeStoreApi.getInstance();

