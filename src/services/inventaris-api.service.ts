import axios, { type AxiosInstance } from 'axios';
import type { IAanduidingsobject } from '@models/inventaris';

export class InventarisApiService {
  private axionsInstance: AxiosInstance;
  private API_URL: string;

  constructor(apiUrl: string) {
    this.API_URL = apiUrl;

    this.axionsInstance = axios.create({
      headers: { Accept: 'application/json' },
    });
  }

  setApiUrl(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  async getAanduidingsobjecten(): Promise<IAanduidingsobject[]> {
    const data: IAanduidingsobject[] = await this.get('aanduidingsobjecten');
    const response = data.map((aanduidingsobject: IAanduidingsobject) => {
      return {
        ...aanduidingsobject,
        aanduidingsobjectLabel: aanduidingsobject.naam + ' (id: ' + aanduidingsobject.id + ')',
      };
    });

    return Promise.resolve(response);
  }

  private async get<T>(endpoint: string): Promise<T> {
    return (await this.axionsInstance.get(`${this.API_URL.replace(/\/?$/, '/')}${endpoint.replace(/^\/?/, '')}`)).data;
  }
}
