import { HttpService } from './http.service';
import type { ActorType, IActor } from '@models/actor';
import type { IResponse } from '@models/grid';

export interface IActorenQuery {
  omschrijving?: string;
  sort?: string;
  type?: ActorType;
}

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
        params: { omschrijving: `${searchTerm}` },
      })
    ).data;
  }

  async getActoren(rangeStart: number, rangeEnd: number, query: IActorenQuery): Promise<IResponse<IActor>> {
    const contentRange = `items=${rangeStart}-${rangeEnd}`;
    const { data, headers } = await this.get<IActor[]>(`${this.API_URL}/actoren`, {
      headers: {
        Range: contentRange,
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await this.getSsoToken()),
      },
      params: query,
    });

    const resCR = headers['content-range'];
    let lastRow = 0;
    if (resCR) {
      lastRow = resCR.substring(resCR.indexOf('/') + 1);
    }
    return { content: data, lastRow };
  }

  async getActorById(id: number): Promise<IActor> {
    return (
      await this.get<IActor>(`${this.API_URL}/actoren/${id.toString()}?adressenregister`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await this.getSsoToken()),
        },
      })
    ).data;
  }
}
