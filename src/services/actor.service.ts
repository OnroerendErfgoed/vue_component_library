import { HttpService } from './http.service';
import type { AxiosError } from 'axios';
import type { ActorType, IActor } from '@models/actor';
import type { IResponse } from '@models/grid';

export interface IActorenQuery {
  omschrijving?: string;
  sort?: string;
  type?: ActorType;
  geldige_actor?: boolean;
}

export class ActorService extends HttpService {
  readonly API_URL: string;

  private actoren: IActor[] = [];
  private getSsoToken: () => Promise<string | void>;

  constructor(apiUrl: string, getSsoToken?: () => Promise<string>) {
    super();
    this.API_URL = apiUrl;
    this.getSsoToken = (getSsoToken as () => Promise<string>) || (() => Promise.resolve());
  }

  async getAOEActoren(searchTerm: string): Promise<IActor[]> {
    if (this.actoren?.length) {
      return this.actoren;
    }

    return (
      await this.get<IActor[]>(`${this.API_URL}/actoren/wij`, {
        headers: {
          ...((await this.getSsoToken()) && { Authorization: 'Bearer ' + (await this.getSsoToken()) }),
        },
        params: { omschrijving: `${searchTerm}` },
      })
    ).data;
  }

  async getActoren(rangeStart: number, rangeEnd: number, query: IActorenQuery): Promise<IResponse<IActor>> {
    const contentRange = `items=${rangeStart}-${rangeEnd}`;
    if (query.geldige_actor === undefined) {
      query.geldige_actor = true;
    }
    const { data, headers } = await this.get<IActor[]>(`${this.API_URL}/actoren`, {
      headers: {
        Range: contentRange,
        Accept: 'application/json',
        ...((await this.getSsoToken()) && { Authorization: 'Bearer ' + (await this.getSsoToken()) }),
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
    try {
      return (
        await this.get<IActor>(`${this.API_URL}/actoren/${id.toString()}?adressenregister`, {
          headers: {
            Accept: 'application/json',
            ...((await this.getSsoToken()) && { Authorization: 'Bearer ' + (await this.getSsoToken()) }),
          },
        })
      ).data;
    } catch (error) {
      const e = error as AxiosError;
      if (e.response?.status) {
        console.error('Gelieve een gelding token te voorzien via de [getSsoToken] callback');
      } else {
        console.error(e);
      }
      return Promise.reject();
    }
  }
}
