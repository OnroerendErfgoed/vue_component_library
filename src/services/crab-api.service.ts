import type { IAdres, IGemeente, IGewest, ILand, IPostinfo, IProvincie, IStraat } from '@models/locatie';
import { Niscode } from '@models/niscode.enum';
import { sortBy } from 'lodash';
import { HttpService } from './http.service';

export class CrabApiService extends HttpService {
  private landen: ILand[] = [];
  private provincies: IProvincie[] = [];
  private gemeenten: IGemeente[] = [];

  private gemeentenVlaamsGewest: IGemeente[] = [];
  private gemeentenWaalsGewest: IGemeente[] = [];
  private gemeentenBHGewest: IGemeente[] = [];

  constructor(apiUrl: string) {
    super(apiUrl);
  }

  getLanden(): Promise<ILand[]> {
    if (this.landen?.length) {
      return Promise.resolve(this.landen);
    } else {
      return this.get<ILand[]>('adressenregister/landen').then((landen) => {
        this.landen = sortBy(landen, 'naam');
        return this.landen;
      });
    }
  }

  async getProvincies(): Promise<IProvincie[]> {
    if (this.provincies?.length > 0) {
      return Promise.resolve(this.provincies);
    } else {
      const provinciesVlaamsGewest = await this.getProvinciesPerGewest(Niscode.VlaamsGewest);
      const provinciesWaalsGewest = await this.getProvinciesPerGewest(Niscode.WaalsGewest);

      this.provincies = this.provincies.concat(provinciesVlaamsGewest, provinciesWaalsGewest);

      return sortBy(this.provincies, 'naam');
    }
  }

  async getProvinciesPerGewest(niscode: Niscode): Promise<IProvincie[]> {
    return (await this.get<IProvincie[]>(`adressenregister/gewesten/${niscode}/provincies`)).data;
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
      return this.get<IGewest[]>('adressenregister/gewesten').then((r) => {
        const gewesten = r.data;
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

  async getGemeentenPerGewest(niscode: Niscode): Promise<IGemeente[]> {
    return (await this.get<IGemeente[]>(`adressenregister/gewesten/${niscode}/gemeenten`)).data;
  }

  async getPostinfo(gemeente: string): Promise<IPostinfo[]> {
    return (await this.get<IPostinfo[]>(`adressenregister/gemeenten/${gemeente}/postinfo`)).data;
  }

  async getStraten(gemeente: string): Promise<IStraat[]> {
    return (await this.get<IStraat[]>(`adressenregister/gemeenten/${gemeente}/straten`)).data;
  }

  async getAdressen(straat: string, huisnummer?: string): Promise<IAdres[]> {
    if (huisnummer) {
      return (await this.get<IAdres[]>(`adressenregister/straten/${straat}/huisnummers/${huisnummer}`)).data;
    }
    return (await this.get<IAdres[]>(`adressenregister/straten/${straat}/adressen`)).data;
  }
}
