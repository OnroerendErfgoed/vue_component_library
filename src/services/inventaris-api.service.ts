import type { IAanduidingsobject } from '@models/aanduidingsobject';
import { axiosInstance } from './http.service';

export class InventarisApiService {
  private API_URL: string;

  constructor(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  setApiUrl(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  async getAanduidingsobjecten(): Promise<Partial<IAanduidingsobject>[]> {
    const data: IAanduidingsobject[] = await this.get<IAanduidingsobject[]>('aanduidingsobjecten');
    return data.map((aanduidingsobject: IAanduidingsobject) => {
      return {
        uri: aanduidingsobject.uri,
        aanduidingsobjectLabel: aanduidingsobject.naam + ' (id: ' + aanduidingsobject.id + ')',
      };
    });
  }

  private async get<T>(endpoint: string): Promise<T> {
    return (await axiosInstance.get(`${this.API_URL.replace(/\/?$/, '/')}${endpoint.replace(/^\/?/, '')}`)).data;
  }
}
