class FakeStoreApiClient {
  private static instance: FakeStoreApiClient;

  private readonly baseUrl = 'https://fakestoreapi.com';

  private constructor() {}

  static getInstance(): FakeStoreApiClient {
    if (!FakeStoreApiClient.instance) {
      FakeStoreApiClient.instance = new FakeStoreApiClient();
    }
    return FakeStoreApiClient.instance;
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, init);
    if (!response.ok) {
      throw new Error(`FakeStore API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  }
}

export const fakeStoreApiClient = FakeStoreApiClient.getInstance();