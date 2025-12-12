/* eslint-disable @typescript-eslint/no-explicit-any */
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import { Geometry, MultiPolygon, Point, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { describe, expect, it, vi } from 'vitest';
import { MapUtil } from '@/components/map/utils/openlayers/map-util';

const makeFeature = (geom: Geometry, props: Record<string, unknown> = {}) => new Feature({ ...props, geometry: geom });

describe('MapUtil', () => {
  describe('getLayerById', () => {
    it('returns the layer with matching id', () => {
      const map = new Map({});
      const layer = new VectorLayer({ source: new VectorSource() });
      layer.set('id', 'layer1');
      map.addLayer(layer);
      expect(MapUtil.getLayerById(map, 'layer1')).toBe(layer);
    });

    it('returns undefined if no layer matches', () => {
      const map = new Map({});
      expect(MapUtil.getLayerById(map, 'notfound')).toBeUndefined();
    });
  });

  describe('createVectorLayer', () => {
    it('creates a vector layer with correct properties', () => {
      const layer = MapUtil.createVectorLayer({
        color: '#ff0000',
        fill: '#00ff00',
        title: 'TestLayer',
        id: 'test-id',
        maxLabelResolution: 100,
      });
      expect(layer.get('title')).toBe('TestLayer');
      expect(layer.get('id')).toBe('test-id');
      expect(layer.get('type')).toBe('overlay');
      expect(layer.getVisible()).toBe(true);
      expect(layer.getSource()).toBeInstanceOf(VectorSource);
    });

    it('applies style with label below maxLabelResolution', () => {
      const layer = MapUtil.createVectorLayer({
        color: '#ff0000',
        fill: '#00ff00',
        title: 'TestLayer',
        maxLabelResolution: 100,
      });
      const feature = makeFeature(new Point([0, 0]), { name: 'Label', show: true });
      const styleFn = layer.getStyle() as (f: Feature, r: number) => any;
      const style = styleFn(feature, 50);
      expect(style.getText().getText()).toBe('Label');
    });

    it('hides label above maxLabelResolution', () => {
      const layer = MapUtil.createVectorLayer({
        color: '#ff0000',
        fill: '#00ff00',
        title: 'TestLayer',
        maxLabelResolution: 100,
      });
      const feature = makeFeature(new Point([0, 0]), { name: 'Label', show: true });
      const styleFn = layer.getStyle() as (f: Feature, r: number) => any;
      const style = styleFn(feature, 150);
      expect(style.getText().getText()).toBe('');
    });

    it('hides feature style if show is false', () => {
      const layer = MapUtil.createVectorLayer({
        color: '#ff0000',
        fill: '#00ff00',
        title: 'TestLayer',
      });
      const feature = makeFeature(new Point([0, 0]), { name: 'Label', show: false });
      const styleFn = layer.getStyle() as (f: Feature, r: number) => any;
      const style = styleFn(feature, 50);
      expect(style.getStroke().getColor()).toBe('rgba(0,0,0,0)');
      expect(style.getFill().getColor()).toBe('rgba(0,0,0,0)');
    });
  });

  describe('mergePolygons', () => {
    it('merges multiple polygons into a MultiPolygon feature', () => {
      const f1 = makeFeature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ])
      );
      const f2 = makeFeature(
        new Polygon([
          [
            [1, 0],
            [2, 0],
            [2, 1],
            [1, 1],
            [1, 0],
          ],
        ])
      );
      const merged = MapUtil.mergePolygons([f1, f2]);
      expect(merged).toBeInstanceOf(Feature);
      expect(merged?.getGeometry()).toBeInstanceOf(MultiPolygon);
    });

    it('returns null for empty input', () => {
      expect(MapUtil.mergePolygons([])).toBeNull();
    });
  });

  describe('intersectPolygons', () => {
    it('returns intersection feature if polygons overlap', () => {
      const f1 = makeFeature(
        new Polygon([
          [
            [0, 0],
            [2, 0],
            [2, 2],
            [0, 2],
            [0, 0],
          ],
        ])
      );
      const f2 = makeFeature(
        new Polygon([
          [
            [1, 1],
            [3, 1],
            [3, 3],
            [1, 3],
            [1, 1],
          ],
        ])
      );
      const intersection = MapUtil.intersectPolygons(f1, f2);
      expect(intersection).toBeInstanceOf(Feature);
      expect(intersection?.getGeometry()).toBeInstanceOf(MultiPolygon);
    });

    it('returns null if polygons do not overlap', () => {
      const f1 = makeFeature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ])
      );
      const f2 = makeFeature(
        new Polygon([
          [
            [2, 2],
            [3, 2],
            [3, 3],
            [2, 3],
            [2, 2],
          ],
        ])
      );
      expect(MapUtil.intersectPolygons(f1, f2)).toBeNull();
    });
  });

  describe('subtractPolygons', () => {
    it('subtracts second polygon from first', () => {
      const f1 = makeFeature(
        new Polygon([
          [
            [0, 0],
            [2, 0],
            [2, 2],
            [0, 2],
            [0, 0],
          ],
        ])
      );
      const f2 = makeFeature(
        new Polygon([
          [
            [1, 1],
            [2, 1],
            [2, 2],
            [1, 2],
            [1, 1],
          ],
        ])
      );
      const result = MapUtil.subtractPolygons(f1, f2);
      expect(result).toBeInstanceOf(Feature);
      expect(result?.getGeometry()).toBeInstanceOf(MultiPolygon);
    });

    it('returns original polygon if second is undefined', () => {
      const f1 = makeFeature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ])
      );
      const result = MapUtil.subtractPolygons(f1, undefined);
      expect(result).toBeInstanceOf(Feature);
      expect(result?.getGeometry()).toBeInstanceOf(MultiPolygon);
    });
  });

  describe('bufferZone', () => {
    it('returns feature with buffered geometry', () => {
      const f = makeFeature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ])
      );
      const result = MapUtil.bufferZone(f, 5);
      expect(result).toBeInstanceOf(Feature);
      expect(result.getGeometry()).toBeDefined();
    });

    it('returns original feature if buffer fails', () => {
      const f = new Feature({});
      const result = MapUtil.bufferZone(f, 5);
      expect(result).toBe(f);
    });
  });

  describe('mergePolygonsInBatches', () => {
    it('merges polygons in batches and calls onProgress', async () => {
      const f1 = makeFeature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ])
      );
      const f2 = makeFeature(
        new Polygon([
          [
            [1, 0],
            [2, 0],
            [2, 1],
            [1, 1],
            [1, 0],
          ],
        ])
      );
      const progressCb = vi.fn();
      const merged = await MapUtil.mergePolygonsInBatches([f1, f2], 1, progressCb);
      expect(merged).toBeInstanceOf(Feature);
      expect(progressCb).toHaveBeenCalled();
    });

    it('returns null for empty input', async () => {
      const merged = await MapUtil.mergePolygonsInBatches([], 1);
      expect(merged).toBeNull();
    });

    it('returns first feature if only one', async () => {
      const f1 = makeFeature(
        new Polygon([
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ])
      );
      const merged = await MapUtil.mergePolygonsInBatches([f1], 1);
      expect(merged).toBeInstanceOf(Feature);
      expect(merged?.getGeometry()).toBeDefined();
    });
  });
});
