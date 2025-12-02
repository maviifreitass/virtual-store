import { fakeStoreApiClient } from './fakeStoreApi';

class CategoriesService {
  private static instance: CategoriesService;

  private constructor() {}

  static getInstance(): CategoriesService {
    if (!CategoriesService.instance) {
      CategoriesService.instance = new CategoriesService();
    }
    return CategoriesService.instance;
  }

  getAll(): Promise<string[]> {
    return fakeStoreApiClient.get<string[]>('/products/categories');
  }
}

export const categoriesService = CategoriesService.getInstance();

