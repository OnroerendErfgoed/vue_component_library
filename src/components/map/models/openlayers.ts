import Feature from 'ol/Feature';
import type { Coordinate } from 'ol/coordinate';

export interface LegendImageProperty {
  url: string;
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

export interface Aanduidingsobject {
  uri: string;
  id: number;
  naam: string;
  type: Type;
  geselecteerd?: boolean;
  adres?: string;
  locatieSamenvatting?: string;
  feature?: Feature;
}

export interface Perceel {
  afdeling?: string;
  sectie?: string;
  perceel?: string;
  capakey?: string;
  feature?: Feature;
  geselecteerd?: boolean;
}

export interface Type {
  uri: string;
  id: number;
  naam?: string;
}
