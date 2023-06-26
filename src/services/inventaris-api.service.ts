import { ESAanduidingsobject, type IESAanduidingsobject } from '@models/aanduidingsobject';
import { HttpService } from './http.service';

export class InventarisApiService extends HttpService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  async getAanduidingsobjecten(searchTerm: string): Promise<IESAanduidingsobject[]> {
    const data: IESAanduidingsobject[] = (
      await this.get<IESAanduidingsobject[]>('aanduidingsobjecten', {
        params: {
          tekst: searchTerm,
        },
      })
    ).data;
    return data.map((aanduidingsobject: IESAanduidingsobject) => new ESAanduidingsobject(aanduidingsobject).toJSON());
  }
}
