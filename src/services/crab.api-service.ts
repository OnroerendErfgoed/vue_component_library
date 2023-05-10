import type { IAdres, IGemeente, IGewest, ILand, IPostinfo, IStraat } from '@models/locatie';
import axios from 'axios';
import { sortBy } from 'lodash';

export class CrabService {
  private API_URL: string;
  private landen: ILand[] = [];
  private gemeenten: IGemeente[] = [];

  constructor(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  setApiUrl(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  getLanden(): Promise<ILand[]> {
    if (this.landen?.length) {
      return Promise.resolve(this.landen);
    } else {
      return this.crabGet<ILand[]>('adressenregister/landen').then((landen) => {
        this.landen = sortBy(landen, 'naam');
        return this.landen;
      });
    }
  }

  getGemeenten(): Promise<IGemeente[]> {
    if (this.gemeenten?.length) {
      return Promise.resolve(this.gemeenten);
    } else {
      return this.crabGet<IGewest[]>('adressenregister/gewesten').then((gewesten) => {
        const getGemeenten = gewesten.map((gewest) =>
          this.crabGet<IGemeente[]>(`adressenregister/gewesten/${gewest.niscode}/gemeenten`)
        );

        return Promise.all(getGemeenten).then((gemeenten) => {
          if (gemeenten[0] && gemeenten[1] && gemeenten[2]) {
            this.gemeenten = this.gemeenten.concat(gemeenten[0], gemeenten[1], gemeenten[2]);
            return sortBy(this.gemeenten, 'naam');
          }
          return [];
        });
      });
    }
  }

  getPostinfo(gemeente: string): Promise<IPostinfo[]> {
    return this.crabGet<IPostinfo[]>(`adressenregister/gemeenten/${gemeente}/postinfo`);
  }

  getStraten(gemeente: string): Promise<IStraat[]> {
    return this.crabGet<IStraat[]>(`adressenregister/gemeenten/${gemeente}/straten`);
  }

  getAdressen(straat: string, huisnummer?: string): Promise<IAdres[]> {
    if (huisnummer) {
      return this.crabGet<IAdres[]>(`adressenregister/straten/${straat}/huisnummers/${huisnummer}`);
    }
    return this.crabGet<IAdres[]>(`adressenregister/straten/${straat}/adressen`);
  }

  private async crabGet<T>(endpoint: string): Promise<T> {
    return (await axios.get(`${this.API_URL.replace(/\/?$/, '/')}${endpoint.replace(/^\/?/, '')}`)).data;
  }
}
