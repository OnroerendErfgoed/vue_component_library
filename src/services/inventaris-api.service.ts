import { ESAanduidingsobject, type IESAanduidingsobject } from '@models/aanduidingsobject';
import { HttpService } from './http.service';

export class InventarisApiService extends HttpService {
  private readonly API_URL: string;

  constructor(apiUrl: string) {
    super();
    this.API_URL = apiUrl;
  }

  async getAanduidingsobjecten(searchTerm: string): Promise<IESAanduidingsobject[]> {
    const data: IESAanduidingsobject[] = (
      await this.get<IESAanduidingsobject[]>('aanduidingsobjecten', {
        baseURL: this.API_URL,
        params: {
          tekst: searchTerm,
        },
      })
    ).data;
    return data.map((aanduidingsobject: IESAanduidingsobject) => new ESAanduidingsobject(aanduidingsobject).toJSON());
  }
}
