import { HttpService } from './http.service';
import type { IRedirectReference, IReference } from '@components/core/models/reference';

export class IdService extends HttpService {
  readonly API_URL: string;

  private getSsoToken: () => Promise<string | void>;

  constructor(apiUrl: string, getSsoToken?: () => Promise<string>) {
    super();
    this.API_URL = apiUrl;
    this.getSsoToken = (getSsoToken as () => Promise<string>) || (() => Promise.resolve());
  }

  async getReferences(uri: string): Promise<IReference> {
    return (
      await this.get<IReference>(`${this.API_URL}/registry/references`, {
        params: { uri },
      })
    ).data;
  }

  async getByUri<T>(uri: string): Promise<T> {
    try {
      const reference = (
        await this.get<IRedirectReference>(`${this.API_URL}/uris`, {
          params: {
            uri,
          },
          headers: {
            Accept: 'application/json',
            ...((await this.getSsoToken()) && { Authorization: 'Bearer ' + (await this.getSsoToken()) }),
          },
        })
      ).data;
      return (
        await this.get<T>(reference.location, {
          headers: {
            Accept: 'application/json',
            ...((await this.getSsoToken()) && { Authorization: 'Bearer ' + (await this.getSsoToken()) }),
          },
        })
      ).data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
