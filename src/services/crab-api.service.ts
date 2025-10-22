import { HttpService } from './http.service';
import { sortBy } from 'lodash';
import WFS from 'ol/format/WFS';
import Intersects from 'ol/format/filter/Intersects';
import { Geometry } from 'ol/geom';
import { Niscode } from '@models/niscode.enum';
import type {
  IAdres,
  IGemeente,
  IGeoLocation,
  IGewest,
  ILand,
  ILocatie,
  IPostinfo,
  IProvincie,
  IStraat,
} from '@models/locatie';

export class CrabApiService extends HttpService {
  readonly API_URL: string;

  private landen: ILand[] = [];
  private provincies: IProvincie[] = [];
  private gemeenten: IGemeente[] = [];
  private gewesten: IGewest[] = [];

  private provinciesVlaamsGewest: IProvincie[] = [];
  private provinciesWaalsGewest: IProvincie[] = [];

  private gemeentenVlaamsGewest: IGemeente[] = [];
  private gemeentenWaalsGewest: IGemeente[] = [];
  private gemeentenBHGewest: IGemeente[] = [];

  private adresCache: Map<string, IAdres[]> = new Map();

  constructor(apiUrl: string) {
    super();
    this.API_URL = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
  }

  async getLocaties(value: string): Promise<ILocatie[]> {
    const url = `geolocation/?locatie=${value.toLowerCase()}`;
    const response = await this.get<ILocatie[]>(url, { baseURL: this.API_URL });
    return response.data;
  }

  async geoLocate(locationId: string): Promise<IGeoLocation> {
    const url = `geolocation/${locationId}`;
    const response = await this.get<IGeoLocation>(url, { baseURL: this.API_URL });
    return response.data;
  }

  async getLanden(): Promise<ILand[]> {
    if (this.landen?.length) {
      return this.landen;
    }
    const response = await this.get<ILand[]>('adressenregister/landen', { baseURL: this.API_URL });
    const { data } = response;
    this.landen = sortBy(data, 'naam');
    return this.landen;
  }

  async getGewesten(): Promise<IGewest[]> {
    if (this.gewesten?.length) {
      return this.gewesten;
    }
    const response = await this.get<IProvincie[]>(`adressenregister/gewesten`, { baseURL: this.API_URL });
    const { data } = response;
    this.gewesten = sortBy(data, 'naam');
    return this.gewesten;
  }

  async getProvincies(): Promise<IProvincie[]> {
    if (this.provincies?.length > 0) {
      return this.provincies;
    }
    this.provinciesVlaamsGewest = await this.getProvinciesPerGewest(Niscode.VlaamsGewest);
    this.provinciesWaalsGewest = await this.getProvinciesPerGewest(Niscode.WaalsGewest);

    this.provincies = sortBy(this.provincies.concat(this.provinciesVlaamsGewest, this.provinciesWaalsGewest), 'naam');
    return this.provincies;
  }

  async getProvinciesPerGewest(niscode: Niscode): Promise<IProvincie[]> {
    return (await this.get<IProvincie[]>(`adressenregister/gewesten/${niscode}/provincies`, { baseURL: this.API_URL }))
      .data;
  }

  get vlaamseProvincies(): IProvincie[] {
    return sortBy(this.provinciesVlaamsGewest, 'naam');
  }

  get waalseProvincies(): IProvincie[] {
    return sortBy(this.provinciesWaalsGewest, 'naam');
  }

  get vlaamseGemeenten(): IGemeente[] {
    return sortBy(this.gemeentenVlaamsGewest, 'naam');
  }

  get waalseGemeenten(): IGemeente[] {
    return sortBy(this.gemeentenWaalsGewest, 'naam');
  }

  get brusselseGemeenten(): IGemeente[] {
    return sortBy(this.gemeentenBHGewest, 'naam');
  }

  async getGemeenten(): Promise<IGemeente[]> {
    if (this.gemeenten?.length) {
      return this.gemeenten;
    }
    const r = await this.get<IGewest[]>('adressenregister/gewesten', { baseURL: this.API_URL });
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
    const gemeenten = await Promise.all([gemeentenVlaamsGewestGet, gemeentenWaalsGewestGet, gemeentenBHGewestGet]);
    if (gemeenten[0] && gemeenten[1] && gemeenten[2]) {
      this.gemeentenVlaamsGewest = gemeenten[0];
      this.gemeentenWaalsGewest = gemeenten[1];
      this.gemeentenBHGewest = gemeenten[2];
      this.gemeenten = sortBy(
        this.gemeenten.concat(this.gemeentenVlaamsGewest, this.gemeentenWaalsGewest, this.gemeentenBHGewest),
        'naam'
      );
      return this.gemeenten;
    }
    return [];
  }

  async getGemeentenPerGewest(niscode: Niscode): Promise<IGemeente[]> {
    return (
      await this.get<IGemeente[]>(`adressenregister/gewesten/${niscode}/gemeenten`, {
        baseURL: this.API_URL,
        params: {
          status: 'inGebruik',
        },
      })
    ).data;
  }

  async getPostinfo(gemeente: string): Promise<IPostinfo[]> {
    return (
      await this.get<IPostinfo[]>(`adressenregister/gemeenten/${gemeente}/postinfo`, {
        baseURL: this.API_URL,
        params: {
          status: 'inGebruik',
        },
      })
    ).data;
  }

  async getStraten(gemeente: string): Promise<IStraat[]> {
    return (
      await this.get<IStraat[]>(`adressenregister/gemeenten/${gemeente}/straten`, {
        baseURL: this.API_URL,
        params: {
          status: 'inGebruik',
        },
      })
    ).data;
  }

  async getAdressen(straat: string, huisnummer?: string): Promise<IAdres[]> {
    const cacheKey = huisnummer ? `${straat}-${huisnummer}` : straat;

    // Check if the result is already cached
    if (this.adresCache.has(cacheKey)) {
      return this.adresCache.get(cacheKey) as IAdres[];
    }

    let response;
    if (huisnummer) {
      response = await this.get<IAdres[]>(`adressenregister/straten/${straat}/huisnummers/${huisnummer}`, {
        baseURL: this.API_URL,
        params: {
          status: 'inGebruik',
        },
      });
    } else {
      response = await this.get<IAdres[]>(`adressenregister/straten/${straat}/adressen`, {
        baseURL: this.API_URL,
        params: {
          status: 'inGebruik',
        },
      });
    }

    // Cache the result
    this.adresCache.set(cacheKey, response.data);
    return response.data;
  }

  public async searchGRBWfs(geom: Geometry, srsName: string, featureTypes: string[]) {
    const agivGrbUrl = `https://geo.api.vlaanderen.be/GRB`;
    const agivGrbWfsUrl = `${agivGrbUrl}/wfs`;

    const filter = new Intersects('SHAPE', geom, 'urn:x-ogc:def:crs:EPSG:31370');

    const featureRequest = new WFS().writeGetFeature({
      srsName,
      filter,
      featureNS: agivGrbUrl,
      featurePrefix: 'GRB',
      featureTypes,
      outputFormat: 'application/json',
    });

    const data = new XMLSerializer().serializeToString(featureRequest);
    const headers = { 'Content-Type': 'application/xml', Accept: 'application/json' };
    const response = await this.post<ArrayBuffer, string>(agivGrbWfsUrl, data, { headers });
    return response.data;
  }
}
