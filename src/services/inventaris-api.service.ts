import type { IAanduidingsobject } from '@models/inventaris';
import { axiosInstance } from './http.service';

export class InventarisApiService {
  private API_URL: string;

  constructor(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  setApiUrl(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  async getAanduidingsobjecten(): Promise<IAanduidingsobject[]> {
    const data: IAanduidingsobject[] = await this.get<IAanduidingsobject[]>('aanduidingsobjecten');
    const response = data.map((aanduidingsobject: IAanduidingsobject) => {
      return {
        ...aanduidingsobject,
        aanduidingsobjectLabel: aanduidingsobject.naam + ' (id: ' + aanduidingsobject.id + ')',
      };
    });

    return Promise.resolve(response);
  }

  private async get<T>(endpoint: string): Promise<T> {
    return (await axiosInstance.get(`${this.API_URL.replace(/\/?$/, '/')}${endpoint.replace(/^\/?/, '')}`)).data;
  }
}
