import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GisUtil } from '@/components/map/utils/openlayers/gis-util';
import { MapUtil } from '@/components/map/utils/openlayers/map-util';
import { Bescherming, Perceel } from '@components/map';

// Mock MapUtil.mergePolygonsInBatches
vi.mock('@/components/map/utils/openlayers/map-util', () => {
  return {
    MapUtil: {
      mergePolygonsInBatches: vi.fn(async (_features, _batch, onProgress) => {
        // simulate progress callback invocation
        onProgress?.(100);
        return new Feature();
      }),
    },
  };
});

const makeFeature = (id: string) =>
  new Feature({
    id,
    geometry: new Polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ]),
  });

describe('GisUtil', () => {
  const mergeSpy = MapUtil.mergePolygonsInBatches as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getBeschermingenPolygon filters by geselecteerd', async () => {
    const f1 = makeFeature('sel');
    const f2 = makeFeature('unsel');
    const beschermingen: Bescherming[] = [
      { feature: f1, geselecteerd: true, uri: '', id: 1, naam: 'Feature 1', type: { uri: 'type1', id: 1 } },
      { feature: f2, geselecteerd: false, uri: '', id: 2, naam: 'Feature 2', type: { uri: 'type2', id: 2 } },
    ];

    await GisUtil.getBeschermingenPolygon(beschermingen);

    expect(mergeSpy).toHaveBeenCalledTimes(1);
    const [featuresArg, batchArg] = mergeSpy.mock.calls[0];
    expect(featuresArg).toEqual([f1]);
    expect(batchArg).toBe(20);
  });

  it('getPercelenPolygon respects geselecteerd and forwards onProgress', async () => {
    const f1 = makeFeature('a');
    const f2 = makeFeature('b');
    const percelen: Perceel[] = [
      { feature: f1, geselecteerd: true },
      { feature: f2, geselecteerd: false },
    ];

    const progressCb = vi.fn();
    await GisUtil.getPercelenPolygon(percelen, progressCb);

    expect(mergeSpy).toHaveBeenCalledTimes(1);
    const [featuresArg, , onProgressArg] = mergeSpy.mock.calls[0];
    expect(featuresArg).toEqual([f1]);

    expect(progressCb).toHaveBeenCalledWith(100);
    expect(onProgressArg).toBeTypeOf('function');
  });

  it('getNonPercelenPolygon selects only non-selected', async () => {
    const f1 = makeFeature('sel');
    const f2 = makeFeature('unsel');
    const percelen: Perceel[] = [
      { feature: f1, geselecteerd: true },
      { feature: f2, geselecteerd: false },
    ];

    await GisUtil.getNonPercelenPolygon(percelen);

    expect(mergeSpy).toHaveBeenCalledTimes(1);
    const [featuresArg] = mergeSpy.mock.calls[0];
    expect(featuresArg).toEqual([f2]);
  });

  it('getZonePolygon includes all features without filtering', async () => {
    const z1 = makeFeature('z1');
    const z2 = makeFeature('z2');
    const zones = [z1, z2];

    await GisUtil.getZonePolygon(zones);

    expect(mergeSpy).toHaveBeenCalledTimes(1);
    const [featuresArg] = mergeSpy.mock.calls[0];
    expect(featuresArg).toEqual(zones);
  });

  it('handles empty input by calling merge with empty array', async () => {
    await GisUtil.getBeschermingenPolygon([]);

    expect(mergeSpy).toHaveBeenCalledTimes(1);
    const [featuresArg] = mergeSpy.mock.calls[0];
    expect(featuresArg).toEqual([]);
  });
});
