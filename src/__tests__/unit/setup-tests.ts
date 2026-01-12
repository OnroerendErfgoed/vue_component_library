/* eslint-disable @typescript-eslint/no-explicit-any */
import { intersects as intersectsExtent } from 'ol/extent';
import { vi } from 'vitest';

(globalThis as any).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
HTMLCanvasElement.prototype.getContext = vi.fn();

// Enhanced jsts mock with intersects based on extents
vi.mock('jsts', () => {
  const makeGeom = (olGeom?: any) => {
    const extent = olGeom?.getExtent ? olGeom.getExtent() : [0, 0, 0, 0];
    return {
      __extent: extent,
      buffer: () => makeGeom(olGeom),
      union: () => makeGeom(olGeom),
      intersection: () => makeGeom(olGeom),
      difference: () => makeGeom(olGeom),
      isValid: () => true,
      intersects: (other: any) => intersectsExtent(extent, other?.__extent ?? extent),
      getCoordinates: () => (olGeom?.getCoordinates ? olGeom.getCoordinates() : [[[0, 0]]]),
      getType: () => (olGeom?.getType ? olGeom.getType() : 'Polygon'),
      addEventListener: () => {},
      removeEventListener: () => {},
      on: () => {},
      un: () => {},
    };
  };
  class OL3Parser {
    inject() {}
    read(g: any) {
      return makeGeom(g);
    }
    write(g: any) {
      return g ?? makeGeom();
    }
  }
  class GeoJSONWriter {
    write(g: any) {
      return { type: g?.getType ? g.getType() : 'Polygon', coordinates: g?.getCoordinates?.() ?? [] };
    }
  }
  return { io: { OL3Parser, GeoJSONWriter } };
});
