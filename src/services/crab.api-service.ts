import axios from 'axios';
import type { Gemeente, Huisnummer, Land, Postcode, Straat } from './models/locatie';

export class CrabService {
  private landen: Land[] = [];
  private gemeenten: Gemeente[] = [];

  getLanden(): Promise<Land[]> {
    if (!!this.landen?.length) {
      return Promise.resolve(this.landen);
    } else {
      return this.crabGet<Land[]>('crab/landen').then((landen) => {
        this.landen = landen;
        this.landen.sort(this.compareByNaam);
        return this.landen;
      });
    }
  }

  getGemeenten(): Promise<Gemeente[]> {
    if (!!this.gemeenten?.length) {
      return Promise.resolve(this.gemeenten);
    } else {
      return Promise.all([this.crabGet<Gemeente[]>('crab/gewesten/1/gemeenten'), this.crabGet<Gemeente[]>('crab/gewesten/2/gemeenten'), this.crabGet<Gemeente[]>('crab/gewesten/3/gemeenten')]).then(
        (gemeenten) => {
          if (gemeenten[0] && gemeenten[1] && gemeenten[2]) {
            this.gemeenten = this.gemeenten.concat(gemeenten[0], gemeenten[1], gemeenten[2]);
            this.gemeenten.sort(this.compareByNaam);
            return this.gemeenten;
          }
          return [];
        }
      );
    }
  }

  getPostcodes(gemeente: number): Promise<Postcode[]> {
    return this.crabGet<Postcode[]>(`crab/gemeenten/${gemeente}/postkantons`);
  }

  getStraten(gemeente: number): Promise<Straat[]> {
    return this.crabGet<Straat[]>(`crab/gemeenten/${gemeente}/straten`);
  }

  getHuisnummers(straat: number) {
    return this.crabGet<Huisnummer[]>(`crab/straten/${straat}/huisnummers`).then((response) => {
      const huisnummers: Huisnummer[] = response.map((huisnummer: Huisnummer) => ({ ...huisnummer, naam: huisnummer.label }));
      return huisnummers.sort((a, b) => parseInt(a.naam, 0) - parseInt(b.naam, 0));
    });
  }

  private compareByNaam(a: { naam: string }, b: { naam: string }): number {
    if (a.naam < b.naam) {
      return -1;
    } else if (a.naam > b.naam) {
      return 1;
    }
    return 0;
  }

  private async crabGet<T>(endpoint: string): Promise<T> {
    return (await axios.get(`https://dev-geo.onroerenderfgoed.be/${endpoint}`)).data;
  }
}
