import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js';
import OL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser.js';
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp.js';
import OverlayOp from 'jsts/org/locationtech/jts/operation/overlay/OverlayOp.js';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp.js';
import UnionOp from 'jsts/org/locationtech/jts/operation/union/UnionOp.js';
import IsValidOp from 'jsts/org/locationtech/jts/operation/valid/IsValidOp.js';
import Feature from 'ol/Feature';
import { FeatureLike } from 'ol/Feature';
import Map from 'ol/Map';
import { ColorLike } from 'ol/colorlike';
import {
  Geometry,
  GeometryCollection,
  LineString,
  LinearRing,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Text as OlText, Stroke, Style } from 'ol/style';
import type JstsGeometry from 'jsts/org/locationtech/jts/geom/Geometry.js';
import type { Contour } from '@components/map/models/openlayers';

interface VectorLayerOptions {
  color: ColorLike;
  fill: ColorLike;
  title: string;
  id?: string;
  maxLabelResolution?: number;
}

// The typings shipped with jsts describe OL3Parser against the legacy `@types/openlayers`
// global namespace, which is structurally incompatible with the modern `ol` package types.
// This interface retypes the parser against the real `ol` types.
export interface JstsOl3Parser {
  inject(...geometryClasses: unknown[]): void;
  read(geometry: Geometry | undefined): JstsGeometry;
  write(geometry: JstsGeometry): Geometry;
}

export const createJstsOl3Parser = (): JstsOl3Parser => {
  // Both constructor args are optional at runtime (defaults are created internally),
  // but the shipped jsts typings mark them as required.
  const parser = new OL3Parser(undefined as never, undefined as never);
  parser.inject(Point, LineString, LinearRing, Polygon, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection);
  return parser as unknown as JstsOl3Parser;
};

export class MapUtil {
  public static getLayerById(map: Map, id: string): VectorLayer<VectorSource<Feature<Geometry>>> {
    return map.getAllLayers().find((lyr) => lyr.get('id') === id) as VectorLayer<VectorSource<Feature<Geometry>>>;
  }

  public static createVectorLayer(options: VectorLayerOptions) {
    const getText = (feature: FeatureLike, resolution: number) => {
      let text = feature.get('name') || '';
      if (options.maxLabelResolution && resolution > options.maxLabelResolution) {
        text = '';
      }

      return new OlText({
        font: '10px Verdana',
        text: feature.get('show') ? text : '',
        fill: new Fill({ color: options.color }),
        stroke: new Stroke({ color: '#fff', width: 3 }),
      });
    };

    const getStyle = (feature: FeatureLike, resolution: number) => {
      const styleText: OlText = getText(feature, resolution);
      const showFeature = feature.get('show');

      if (showFeature) {
        return new Style({
          stroke: new Stroke({ color: options.color, width: 3 }),
          fill: new Fill({ color: options.fill }),
          text: styleText,
        });
      } else {
        return new Style({
          stroke: new Stroke({ color: 'rgba(0,0,0,0)', width: 1 }),
          fill: new Fill({ color: 'rgba(0,0,0,0)' }),
          text: styleText,
        });
      }
    };
    const vLayer = new VectorLayer({
      source: new VectorSource(),
      style: getStyle,
      visible: true,
    });
    vLayer.set('title', options.title);
    vLayer.set('type', 'overlay');
    vLayer.set('id', options.id);

    return vLayer;
  }

  public static mergePolygons(features: Feature[]): Feature | null {
    const parser = this.getParser();
    let mergedJstsGeom: JstsGeometry | undefined;

    features.forEach((f) => {
      const jstsGeom = parser.read(f.getGeometry());
      const fixedGeom = BufferOp.bufferOp(jstsGeom, 0); // Fix self-intersections

      // Ensure the geometry is valid before merging
      if (IsValidOp.isValid(fixedGeom)) {
        mergedJstsGeom = mergedJstsGeom ? UnionOp.union(mergedJstsGeom, fixedGeom) : fixedGeom;
      } else {
        console.warn('Invalid geometry found after buffering in mergePolygons:', f, fixedGeom);
      }
    });

    if (!mergedJstsGeom) return null;

    const polygon = parser.write(mergedJstsGeom) as Polygon | MultiPolygon;
    const coords = polygon instanceof Polygon ? [polygon.getCoordinates()] : polygon.getCoordinates();
    if (coords[0].length > 0) {
      return new Feature({
        geometry: new MultiPolygon(coords),
      });
    } else {
      return null;
    }
  }

  public static intersectPolygons(polygon1: Feature, polygon2: Feature): Feature | null {
    const parser = this.getParser();
    const writer = new GeoJSONWriter();

    const jstsGeom1 = parser.read(polygon1.getGeometry());
    const jstsGeom2 = parser.read(polygon2.getGeometry());
    const intersects = RelateOp.intersects(jstsGeom1, jstsGeom2);

    if (!intersects) return null;

    const jstsGeom = OverlayOp.intersection(jstsGeom1, jstsGeom2);
    const fixedGeom = BufferOp.bufferOp(jstsGeom, 0); // Fix self-intersections

    // Ensure the geometry is valid before returning
    if (!IsValidOp.isValid(fixedGeom)) {
      console.warn('Invalid geometry found after intersection:', polygon1, polygon2, fixedGeom);
      return null;
    }

    const polygon = writer.write(fixedGeom) as Contour;
    const coords = polygon.type === 'Polygon' ? [polygon.coordinates] : polygon.coordinates;
    if (coords[0].length > 0) {
      return new Feature({
        geometry: new MultiPolygon(coords),
      });
    } else {
      return null;
    }
  }

  public static subtractPolygons(polygon1: Feature, polygon2?: Feature): Feature | null {
    const parser = this.getParser();
    const jstsGeom1 = parser.read(polygon1.getGeometry());

    let jstsGeom: JstsGeometry;
    if (!polygon2) {
      jstsGeom = jstsGeom1;
    } else {
      const jstsGeom2 = parser.read(polygon2.getGeometry());
      jstsGeom = OverlayOp.difference(jstsGeom1, jstsGeom2);
    }

    const fixedGeom = BufferOp.bufferOp(jstsGeom, 0); // Fix self-intersections

    // Ensure the geometry is valid before returning
    if (!IsValidOp.isValid(fixedGeom)) {
      console.warn('Invalid geometry found after subtraction:', polygon1, polygon2, fixedGeom);
      return null;
    }

    const polygon = parser.write(fixedGeom) as Polygon | MultiPolygon;
    const coords = polygon instanceof Polygon ? [polygon.getCoordinates()] : polygon.getCoordinates();
    if (coords[0].length > 0) {
      return new Feature({
        geometry: new MultiPolygon(coords),
      });
    } else {
      return null;
    }
  }

  private static getParser(): JstsOl3Parser {
    return createJstsOl3Parser();
  }

  public static bufferZone(zone: Feature, buffer: number): Feature {
    const parser = this.getParser();
    try {
      // convert the OpenLayers geometry to a JSTS geometry
      const jstsGeom = parser.read(zone.getGeometry());
      // create a buffer
      const buffered = BufferOp.bufferOp(jstsGeom, buffer);

      // Ensure the geometry is valid before applying
      if (!IsValidOp.isValid(buffered)) {
        console.warn('Invalid geometry found after buffering:', zone, buffered);
        return zone;
      }

      // convert back from JSTS and replace the geometry on the feature
      zone.setGeometry(parser.write(buffered));
    } catch (e) {
      console.warn('Error during bufferZone operation:', e, zone);
      return zone;
    }

    return zone;
  }

  public static async mergePolygonsInBatches(
    features: Feature[],
    batchSize = 20,
    onProgress?: (progress: number) => void
  ): Promise<Feature | null | undefined> {
    if (features.length === 0) return null;

    let merged: Feature | null | undefined = features[0];
    let processed = 1;

    for (let i = 0; i < features.length; i += batchSize) {
      const batch = features.slice(i, i + batchSize);
      for (const feature of batch) {
        if (merged) {
          merged = MapUtil.mergePolygons([merged, feature]);
        } else {
          merged = feature;
        }
        processed++;
      }
      if (onProgress) onProgress(processed / features.length);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return merged;
  }
}
