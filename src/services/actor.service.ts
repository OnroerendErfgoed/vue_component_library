import { HttpService } from './http.service';
import type { IActor } from '@models/actor';

export class ActorService extends HttpService {
  readonly API_URL: string;

  private actoren: IActor[] = [];
  private getSsoToken: () => Promise<string>;
  constructor(apiUrl: string, getSsoToken: () => Promise<string>) {
    super();
    this.API_URL = apiUrl;
    this.getSsoToken = getSsoToken;
  }

  async getAOEActoren(searchTerm: string): Promise<IActor[]> {
    if (this.actoren?.length) {
      return this.actoren;
    }
    const ssoToken = await this.getSsoToken();
    return (
      await this.get<IActor[]>(`${this.API_URL}/actoren/wij`, {
        headers: { Authorization: 'Bearer ' + ssoToken },
        params: { omschrijving: `${searchTerm}*` },
      })
    ).data;
  }
}
