import type { Adres, Gemeente, Gewest, Land, Postinfo, Straat } from '@models/locatie';
import axios from 'axios';
import { sortBy } from 'lodash';

export class CrabService {
  private API_URL: string;
  private landen: Land[] = [];
  private gemeenten: Gemeente[] = [];

  constructor(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  setApiUrl(apiUrl: string) {
    this.API_URL = apiUrl;
  }

  getLanden(): Promise<Land[]> {
    if (this.landen?.length) {
      return Promise.resolve(this.landen);
    } else {
      return this.crabGet<Land[]>('adressenregister/landen').then((landen) => {
        this.landen = sortBy(landen, 'naam');
        return this.landen;
      });
    }
  }

  getGemeenten(): Promise<Gemeente[]> {
    if (this.gemeenten?.length) {
      return Promise.resolve(this.gemeenten);
    } else {
      return this.crabGet<Gewest[]>('adressenregister/gewesten').then((gewesten) => {
        const getGemeenten = gewesten.map((gewest) =>
          this.crabGet<Gemeente[]>(`adressenregister/gewesten/${gewest.niscode}/gemeenten`)
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

  getPostinfo(gemeente: string): Promise<Postinfo[]> {
    return this.crabGet<Postinfo[]>(`adressenregister/gemeenten/${gemeente}/postinfo`);
  }

  getStraten(gemeente: string): Promise<Straat[]> {
    return this.crabGet<Straat[]>(`adressenregister/gemeenten/${gemeente}/straten`);
  }

  getAdressen(straat: string, huisnummer?: string): Promise<Adres[]> {
    if (huisnummer) {
      return this.crabGet<Adres[]>(`adressenregister/straten/${straat}/huisnummers/${huisnummer}`);
    }
    return this.crabGet<Adres[]>(`adressenregister/straten/${straat}/adressen`);
  }

  private async crabGet<T>(endpoint: string): Promise<T> {
    return (await axios.get(`${this.API_URL.replace(/\/?$/, '/')}${endpoint.replace(/^\/?/, '')}`)).data;
  }
}
