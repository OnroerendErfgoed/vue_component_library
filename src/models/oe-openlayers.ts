import type { Coordinate } from 'ol/coordinate';
import type { UrlString } from '@models/_common';

export interface LegendImageProperty {
  url: UrlString;
  title: string;
}

export type IDrawGeomType = 'Polygon' | 'Circle';

interface IContour<T extends string, C> {
  type: T;
  coordinates: C;
  crs: {
    type: 'name';
    properties: { name: string };
  };
}

type Polygon = IContour<'Polygon', Coordinate[][]>;
type MultiPolygon = IContour<'MultiPolygon', Coordinate[][][]>;

export type Contour = Polygon | MultiPolygon;
