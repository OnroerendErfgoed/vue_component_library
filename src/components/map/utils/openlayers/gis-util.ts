import { Bescherming, Perceel } from '../../models/openlayers';
import { MapUtil } from './map-util';
import * as jsts from 'jsts';
import { Feature } from 'ol';
import WKT from 'ol/format/WKT';
import {
  GeometryCollection,
  LineString,
  LinearRing,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'ol/geom';

export class GisUtil {
  /**
   * Get the polygon for selected beschermingen.
   */
  public static getBeschermingenPolygon(beschermingen: Bescherming[]): Promise<Feature | null | undefined> {
    return GisUtil.calculatePolygonAsync(beschermingen, (item) => !!item.geselecteerd);
  }

  /**
   * Get the polygon for selected percelen.
   */
  public static getPercelenPolygon(
    percelen: Perceel[],
    onProgress?: (progress: number) => void
  ): Promise<Feature | null | undefined> {
    return GisUtil.calculatePolygonAsync(percelen, (item) => !!item.geselecteerd, 100, onProgress);
  }

  /**
   * Get the polygon for non-selected percelen.
   */
  public static getNonPercelenPolygon(percelen: Perceel[]): Promise<Feature | null | undefined> {
    return GisUtil.calculatePolygonAsync(percelen, (item) => !item.geselecteerd);
  }

  /**
   * Get the polygon for zones.
   */
  public static getZonePolygon(zones: Feature[]): Promise<Feature | null | undefined> {
    return GisUtil.calculatePolygonAsync(zones, () => true); // No filtering, include all zones
  }

  /**
   * Generic method to calculate a polygon based on a filter condition asynchronously.
   * @param items - The array of items (Aanduidingsobject or Perceel).
   * @param filterFn - A filter function to determine which items to include.
   * @param batchSize - The number of items to process in each batch.
   * @param onProgress - Optional callback to report progress.
   * @returns A merged polygon feature or null.
   */
  private static async calculatePolygonAsync<T>(
    items: T[],
    filterFn: (item: T) => boolean,
    batchSize = 100,
    onProgress?: (progress: number) => void
  ): Promise<Feature | null | undefined> {
    const filteredFeatures: Feature[] = [];
    const total = items.length;

    for (let i = 0; i < total; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      for (const item of batch) {
        if (filterFn(item)) {
          filteredFeatures.push(item instanceof Feature ? item : ((item as Bescherming | Perceel).feature as Feature));
        }
      }
      // Yield control to the browser
      await new Promise((resolve) => setTimeout(resolve));
    }
    return await MapUtil.mergePolygonsInBatches(filteredFeatures, 20, onProgress);
  }

  /**
   * Check if a WKT (Multi)Polygon string represents a valid geometry.
   *
   * Validates:
   * - The WKT can be parsed and represents a Polygon or MultiPolygon.
   * - The geometry passes the OGC validity rules (no self-intersecting rings,
   *   correct ring orientation, no duplicate points causing degeneracies, etc.).
   *
   * @param input - A WKT string or an OpenLayers Polygon / MultiPolygon geometry.
   * @returns `true` if the geometry is valid, `false` otherwise.
   */
  public static isMultiPolygonValid(input: string): boolean;
  public static isMultiPolygonValid(input: MultiPolygon | Polygon): boolean;
  public static isMultiPolygonValid(input: string | MultiPolygon | Polygon): boolean {
    try {
      const geometry = typeof input === 'string' ? GisUtil.readWktPolygonGeometry(input) : input;
      return GisUtil.getJstsParser().read(geometry).isValid();
    } catch {
      return false;
    }
  }

  /**
   * Parse a WKT string and return the geometry, throwing if it is not a (Multi)Polygon.
   */
  private static readWktPolygonGeometry(wkt: string): MultiPolygon | Polygon {
    const geometry = new WKT().readGeometry(wkt);

    if (!(geometry instanceof MultiPolygon) && !(geometry instanceof Polygon)) {
      throw new Error('WKT string does not represent a (Multi)Polygon geometry.');
    }

    return geometry;
  }

  /**
   * Create a JSTS OL3Parser with all geometry types injected.
   */
  private static getJstsParser(): jsts.io.OL3Parser {
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
}
