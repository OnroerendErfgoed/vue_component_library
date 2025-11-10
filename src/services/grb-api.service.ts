import { HttpService } from './http.service';
import WFS from 'ol/format/WFS';
import Intersects from 'ol/format/filter/Intersects';
import { Geometry } from 'ol/geom';

export class GrbApiService extends HttpService {
  private readonly GRB_URL = 'https://geo.api.vlaanderen.be/GRB';
  private readonly GRB_WFS_URL = `${this.GRB_URL}/wfs`;

  /**
   * Search GRB (Grootschalig Referentie Bestand) using WFS
   * @param geom - The geometry to search within
   * @param srsName - Spatial Reference System name
   * @param featureTypes - Array of feature types to query
   * @returns WFS response data
   */
  public async searchWfs(geom: Geometry, srsName: string, featureTypes: string[]): Promise<ArrayBuffer> {
    const filter = new Intersects('SHAPE', geom, 'urn:x-ogc:def:crs:EPSG:31370');

    const featureRequest = new WFS().writeGetFeature({
      srsName,
      filter,
      featureNS: this.GRB_URL,
      featurePrefix: 'GRB',
      featureTypes,
      outputFormat: 'application/json',
    });

    const data = new XMLSerializer().serializeToString(featureRequest);
    const headers = { 'Content-Type': 'application/xml', Accept: 'application/json' };

    const response = await this.post<ArrayBuffer, string>(this.GRB_WFS_URL, data, { headers });
    return response.data;
  }
}
