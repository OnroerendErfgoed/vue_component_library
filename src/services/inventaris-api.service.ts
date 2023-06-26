import { ESAanduidingsobject, type IESAanduidingsobject } from '@models/aanduidingsobject';
import { axiosInstance } from './http.service';

export class InventarisApiService {
  private API_URL: string;

  constructor(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  setApiUrl(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  async getAanduidingsobjecten(searchTerm: string): Promise<IESAanduidingsobject[]> {
    const data: IESAanduidingsobject[] = await this.get<IESAanduidingsobject[]>(
      `aanduidingsobjecten?tekst=${searchTerm}`
    );
    return data.map((aanduidingsobject: IESAanduidingsobject) => new ESAanduidingsobject(aanduidingsobject).toJSON());
  }

  private async get<T>(endpoint: string): Promise<T> {
    return (await axiosInstance.get(`${this.API_URL.replace(/\/?$/, '/')}${endpoint.replace(/^\/?/, '')}`)).data;
  }
}
