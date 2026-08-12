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
const { makeGeom } = vi.hoisted(() => {
  const makeGeom = (olGeom?: any): any => {
    const extent = olGeom?.getExtent ? olGeom.getExtent() : [0, 0, 0, 0];
    return {
      __extent: extent,
      __olGeom: olGeom,
      getCoordinates: () => (olGeom?.getCoordinates ? olGeom.getCoordinates() : [[[0, 0]]]),
      getType: () => (olGeom?.getType ? olGeom.getType() : 'Polygon'),
      addEventListener: () => {},
      removeEventListener: () => {},
      on: () => {},
      un: () => {},
    };
  };
  return { makeGeom };
});

vi.mock('jsts/org/locationtech/jts/io/OL3Parser.js', () => ({
  default: class OL3Parser {
    inject() {}
    read(g: any) {
      return makeGeom(g);
    }
    write(g: any) {
      // return the original ol geometry so `instanceof` checks on the result keep working
      return g?.__olGeom ?? g ?? makeGeom();
    }
  },
}));

vi.mock('jsts/org/locationtech/jts/io/GeoJSONWriter.js', () => ({
  default: class GeoJSONWriter {
    write(g: any) {
      return { type: g?.getType ? g.getType() : 'Polygon', coordinates: g?.getCoordinates?.() ?? [] };
    }
  },
}));

vi.mock('jsts/org/locationtech/jts/operation/buffer/BufferOp.js', () => ({
  default: { bufferOp: (g: any) => g },
}));

vi.mock('jsts/org/locationtech/jts/operation/union/UnionOp.js', () => ({
  default: { union: (g: any) => g },
}));

vi.mock('jsts/org/locationtech/jts/operation/overlay/OverlayOp.js', () => ({
  default: { intersection: (g: any) => g, difference: (g: any) => g },
}));

vi.mock('jsts/org/locationtech/jts/operation/relate/RelateOp.js', () => ({
  default: { intersects: (g1: any, g2: any) => intersectsExtent(g1?.__extent, g2?.__extent ?? g1?.__extent) },
}));

vi.mock('jsts/org/locationtech/jts/operation/valid/IsValidOp.js', () => ({
  default: { isValid: () => true },
}));
