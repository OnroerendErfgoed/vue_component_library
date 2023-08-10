import type { UrlString } from '@models/_common';

export interface LegendImageProperty {
  url: UrlString;
  title: string;
}

export type IDrawGeomType = 'Polygon' | 'Circle';

export class Contour {
  coordinates: number[];
  crs: object;
  type: string;

  constructor(c: Contour) {
    this.coordinates = c.coordinates;
    this.crs = c.crs;
    this.type = c.type;
  }
}
