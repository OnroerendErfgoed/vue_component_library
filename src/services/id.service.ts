import { HttpService } from './http.service';
import type { IReference } from '@components/core/models/reference';

export class IdService extends HttpService {
  readonly API_URL: string;

  constructor(apiUrl: string) {
    super();
    this.API_URL = apiUrl;
  }

  async getReferences(uri: string): Promise<IReference> {
    return (
      await this.get<IReference>(`${this.API_URL}/registry/references`, {
        params: { uri },
      })
    ).data;
  }
}
