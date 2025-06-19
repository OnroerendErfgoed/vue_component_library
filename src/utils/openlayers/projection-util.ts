import proj4 from 'proj4';

export class ProjectionUtil {
  public static defineLambert72(proj4Object: typeof proj4) {
    proj4Object.defs(
      'EPSG:31370',
      '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 ' +
        '+lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl ' +
        '+towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs'
    ); // epsg.io

    // Define aliases
    proj4Object.defs('urn:ogc:def:crs:EPSG::31370', proj4Object.defs('EPSG:31370'));
    proj4Object.defs('urn:ogc:def:crs:EPSG:6.9:31370', proj4Object.defs('EPSG:31370'));
    proj4Object.defs('urn:x-ogc:def:crs:EPSG:31370', proj4Object.defs('EPSG:31370'));
    proj4Object.defs('http://www.opengis.net/gml/srs/epsg.xml#31370', proj4Object.defs('EPSG:31370'));
  }
}
