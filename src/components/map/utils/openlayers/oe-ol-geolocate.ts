import Overlay from 'ol/Overlay';
import { Control } from 'ol/control';
import { transform } from 'ol/proj';
import type Map from 'ol/Map';
import type View from 'ol/View';
import type { Options as ControlOptions } from 'ol/control/Control';

export interface GeolocateOptions extends ControlOptions {
  tipLabel?: string;
  zoomLevel?: number;
  geolocateTracking?: PositionOptions;
  onError?: (error: GeolocationPositionError) => void;
}

export class Geolocate extends Control {
  public options: GeolocateOptions;
  public element: HTMLElement;
  private watchId?: number;
  private positionOverlay?: Overlay;
  private className = 'oe-ol-geolocate oe-ol-control ol-control ol-unselectable';

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
    button.addEventListener('click', this._zoomToLocation.bind(this), false);
    element.className = this.className;
  }

  public zoomToCurrentLocation() {
    const map = this.getMap();
    if (!map) {
      throw 'No map defined!';
    }

    const view = map.getView();
    const positionOverlay = this._getOrCreatePositionOverlay(map);

    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        this._updatePosition(pos, view, positionOverlay);
      },
      (error) => {
        this.options.onError?.(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: Infinity }
    );
  }

  public cleanup() {
    if (this.watchId !== undefined) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = undefined;
    }

    this.element.classList.remove('tracking-on');

    const map = this.getMap();
    if (map && this.positionOverlay) {
      map.removeOverlay(this.positionOverlay);
    }

    this.positionOverlay = undefined;
  }

  private _zoomToLocation() {
    if (!this.options.geolocateTracking) {
      this.zoomToCurrentLocation();
      return;
    }

    if (this.watchId !== undefined) {
      this.cleanup();
      return;
    }

    const map = this.getMap();
    if (!map) {
      throw 'No map defined!';
    }

    const view = map.getView();
    const positionOverlay = this._getOrCreatePositionOverlay(map);
    const markerElement = positionOverlay.getElement();

    markerElement?.classList.add('tracking-on');

    this.watchId = navigator.geolocation.watchPosition(
      (pos: GeolocationPosition) => {
        this._updatePosition(pos, view, positionOverlay);
      },
      (error) => {
        this.cleanup();
        this.options.onError?.(error);
      },
      this.options.geolocateTracking
    );

    this.element.classList.add('tracking-on');
  }

  private _getOrCreatePositionOverlay(map: Map): Overlay {
    if (this.positionOverlay) {
      return this.positionOverlay;
    }

    const element = document.createElement('div');
    element.className = 'oe-ol-geolocate-marker';

    const halo = document.createElement('span');
    halo.className = 'halo';

    const dot = document.createElement('span');
    dot.className = 'dot';

    element.append(halo, dot);

    this.positionOverlay = new Overlay({
      element,
      positioning: 'center-center',
      stopEvent: false,
    });

    map.addOverlay(this.positionOverlay);

    return this.positionOverlay;
  }

  private _updatePosition(pos: GeolocationPosition, view: View, positionOverlay: Overlay) {
    const zoomLevel = this.options.zoomLevel || 12;
    const coordinates = transform([pos.coords.longitude, pos.coords.latitude], 'EPSG:4326', view.getProjection());

    view.setCenter(coordinates);
    view.setZoom(zoomLevel);
    positionOverlay.setPosition(coordinates);
  }
}
