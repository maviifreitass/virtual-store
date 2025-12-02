import type { User } from '../types';
import { fakeStoreApiClient } from './fakeStoreApi';

class UsersService {
  private static instance: UsersService;

  private constructor() {}

  static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  getAll(): Promise<User[]> {
    return fakeStoreApiClient.get<User[]>('/users');
  }
}

export const usersService = UsersService.getInstance();

