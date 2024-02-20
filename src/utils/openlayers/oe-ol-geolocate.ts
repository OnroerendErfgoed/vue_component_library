import Feature from 'ol/Feature';
import { Control } from 'ol/control';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import type Map from 'ol/Map';
import type View from 'ol/View';
import type { Options as ControlOptions } from 'ol/control/Control';
import type { Geometry } from 'ol/geom';

export interface GeolocateOptions extends ControlOptions {
  tipLabel?: string;
  zoomLevel?: number;
  geolocateTracking?: PositionOptions;
}

export class Geolocate extends Control {
  public options: GeolocateOptions;
  public element: HTMLElement;
  public layer?: VectorLayer<VectorSource>;
  private watchId?: number;
  private className = 'oe-ol-geolocate oe-ol-control ol-control ol-unselectable';
  private buttonElement: HTMLElement;

  constructor(options: GeolocateOptions) {
    const { target } = options;
    const tipLabel = options.tipLabel || 'Zoom naar je eigen locatie';
    const element = document.createElement('div');
    const button = document.createElement('button');

    button.setAttribute('title', tipLabel);
    element.appendChild(button);

    super({ element, target });

    this.element = element;
    this.options = options;
    this.buttonElement = element;
    button.addEventListener('click', this._zoomToLocation.bind(this), false);
    element.className = this.className;
  }

  private _zoomToLocation() {
    const map = this.getMap();
    if (!map) {
      throw 'No map defined!';
    }
    const view = map.getView();

    if (!this.layer) {
      this.layer = this._createLayer(map);
    }
    const source = this.layer.getSource();
    if (!source) {
      throw 'No source defined!';
    }
    const positionFeature = this._createFeature();

    if (!this.options.geolocateTracking) {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          this._addPositionFeature(pos, view, source, positionFeature);
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: Infinity }
      );
      return;
    }

    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      source?.clear(true);
      this.watchId = undefined;
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos: GeolocationPosition) => {
        this._addPositionFeature(pos, view, source, positionFeature);
      },
      (error) => {
        console.error(error);
      },
      this.options.geolocateTracking
    );
  }

  private _createLayer(map: Map): VectorLayer<VectorSource> {
    const source = new VectorSource();
    const layer = new VectorLayer({ source });
    map.addLayer(layer);
    return layer;
  }

  private _createFeature(): Feature {
    const feature = new Feature();
    feature.setStyle(
      new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({
            color: '#3399CC',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      })
    );
    return feature;
  }

  private _addPositionFeature(
    pos: GeolocationPosition,
    view: View,
    source: VectorSource,
    positionFeature: Feature<Geometry>
  ) {
    const zoomLevel = this.options.zoomLevel || 12;
    const coordinates = transform([pos.coords.longitude, pos.coords.latitude], 'EPSG:4326', view.getProjection());
    view.setCenter(coordinates);
    view.setZoom(zoomLevel);
    positionFeature.setGeometry(coordinates ? new Point(coordinates) : undefined);
    source.clear(true);
    source.addFeatures([positionFeature]);
  }
}
