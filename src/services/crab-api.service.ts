import type { IAdres, IGemeente, IGewest, ILand, IPostinfo, IProvincie, IStraat } from '@models/locatie';
import { Niscode } from '@models/niscode.enum';
import axios from 'axios';
import { sortBy } from 'lodash';

export class CrabService {
  private API_URL: string;

  private landen: ILand[] = [];
  private provincies: IProvincie[] = [];
  private gemeenten: IGemeente[] = [];

  private gemeentenVlaamsGewest: IGemeente[] = [];
  private gemeentenWaalsGewest: IGemeente[] = [];
  private gemeentenBHGewest: IGemeente[] = [];

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

  getProvincies(): Promise<IProvincie[]> {
    if (this.provincies?.length > 0) {
      return Promise.resolve(this.provincies);
    } else {
      return Promise.all([
        this.getProvinciesPerGewest(Niscode.VlaamsGewest),
        this.getProvinciesPerGewest(Niscode.WaalsGewest),
      ]).then((provincies) => {
        if (provincies[0] && provincies[1]) {
          this.provincies = this.provincies.concat(provincies[0], provincies[1]);
          return sortBy(this.provincies, 'naam');
        }
        return [];
      });
    }
  }

  getProvinciesPerGewest(niscode: Niscode): Promise<IProvincie[]> {
    return this.crabGet<IProvincie[]>(`adressenregister/gewesten/${niscode}/provincies`);
  }

  get vlaamseGemeenten(): IGemeente[] {
    return this.gemeentenVlaamsGewest;
  }

  get waalseGemeenten(): IGemeente[] {
    return this.gemeentenWaalsGewest;
  }

  get brusselseGemeenten(): IGemeente[] {
    return this.gemeentenBHGewest;
  }

  getGemeenten(): Promise<IGemeente[]> {
    if (this.gemeenten?.length) {
      return Promise.resolve(this.gemeenten);
    } else {
      return this.crabGet<IGewest[]>('adressenregister/gewesten').then((gewesten) => {
        let gemeentenVlaamsGewestGet;
        let gemeentenWaalsGewestGet;
        let gemeentenBHGewestGet;

        gewesten.forEach((gewest) => {
          if (gewest.niscode === Niscode.VlaamsGewest) {
            gemeentenVlaamsGewestGet = this.getGemeentenPerGewest(Niscode.VlaamsGewest);
          }
          if (gewest.niscode === Niscode.WaalsGewest) {
            gemeentenWaalsGewestGet = this.getGemeentenPerGewest(Niscode.WaalsGewest);
          }
          if (gewest.niscode === Niscode.BrusselsHoofdstedelijkGewest) {
            gemeentenBHGewestGet = this.getGemeentenPerGewest(Niscode.BrusselsHoofdstedelijkGewest);
          }
        });

        return Promise.all([gemeentenVlaamsGewestGet, gemeentenWaalsGewestGet, gemeentenBHGewestGet]).then(
          (gemeenten) => {
            if (gemeenten[0] && gemeenten[1] && gemeenten[2]) {
              this.gemeentenVlaamsGewest = gemeenten[0];
              this.gemeentenWaalsGewest = gemeenten[1];
              this.gemeentenBHGewest = gemeenten[2];
              this.gemeenten = this.gemeenten.concat(
                this.gemeentenVlaamsGewest,
                this.gemeentenWaalsGewest,
                this.gemeentenBHGewest
              );
              return sortBy(this.gemeenten, 'naam');
            }
            return [];
          }
        );
      });
    }
  }

  getGemeentenPerGewest(niscode: Niscode): Promise<IGemeente[]> {
    return this.crabGet<IGemeente[]>(`adressenregister/gewesten/${niscode}/gemeenten`);
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
