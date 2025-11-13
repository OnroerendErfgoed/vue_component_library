import * as jsts from 'jsts';
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
import type { Contour } from '@components/map/models/openlayers';

interface VectorLayerOptions {
  color: ColorLike;
  fill: ColorLike;
  title: string;
  id?: string;
  maxLabelResolution?: number;
}

export class MapUtil {
  public static getLayerById(map: Map, id: string): VectorLayer<VectorSource<Geometry>> {
    return map.getAllLayers().find((lyr) => lyr.get('id') === id) as VectorLayer<VectorSource<Geometry>>;
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
    let mergedJstsGeom: jsts.geom.Geometry | undefined;
    features.forEach((f) => {
      const jstsGeom = parser.read(f.getGeometry());
      mergedJstsGeom = mergedJstsGeom ? mergedJstsGeom.union(jstsGeom) : jstsGeom;
    });

    if (!mergedJstsGeom) return null;

    const polygon = parser.write(mergedJstsGeom);
    const coords = polygon.getType() === 'Polygon' ? [polygon.getCoordinates()] : polygon.getCoordinates();
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
    const writer = new jsts.io.GeoJSONWriter();

    const jstsGeom1 = parser.read(polygon1.getGeometry());
    const jstsGeom2 = parser.read(polygon2.getGeometry());
    const intersects = jstsGeom1.intersects(jstsGeom2);

    if (!intersects) return null;

    const jstsGeom = polygon2 ? jstsGeom1.intersection(jstsGeom2) : jstsGeom1;
    const buffered = jstsGeom.buffer(0);
    const polygon = writer.write(buffered) as Contour;
    const coords = polygon.type === 'Polygon' ? [polygon.coordinates] : polygon.coordinates;
    if (coords[0].length > 0) {
      return new Feature({
        geometry: new MultiPolygon(coords),
      });
    } else {
      return null;
    }
  }

  public static subtractPolygons(polygon1: Feature, polygon2: Feature): Feature | null {
    const parser = this.getParser();
    let jstsGeom;
    if (!polygon2) {
      jstsGeom = parser.read(polygon1.getGeometry());
    } else {
      jstsGeom = parser.read(polygon1.getGeometry()).difference(parser.read(polygon2.getGeometry()));
    }

    const polygon = parser.write(jstsGeom);
    const coords = polygon.getType() === 'Polygon' ? [polygon.getCoordinates()] : polygon.getCoordinates();
    if (coords[0].length > 0) {
      return new Feature({
        geometry: new MultiPolygon(coords),
      });
    } else {
      return null;
    }
  }

  private static getParser(): jsts.io.OL3Parser {
    const parser = new jsts.io.OL3Parser();
    parser.inject(
      Point,
      LineString,
      LinearRing,
      Polygon,
      MultiPoint,
      MultiLineString,
      MultiPolygon,
      GeometryCollection
    );
    return parser;
  }

  public static bufferZone(zone: Feature, buffer: number): Feature {
    const parser = new jsts.io.OL3Parser();
    try {
      // convert the OpenLayers geometry to a JSTS geometry
      const jstsGeom = parser.read(zone.getGeometry());
      // create a buffer
      const buffered = jstsGeom.buffer(buffer);
      // convert back from JSTS and replace the geometry on the feature
      zone.setGeometry(parser.write(buffered));
    } catch (e) {
      console.debug(e);
      return zone;
    }

    return zone;
  }
}
