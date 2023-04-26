export interface IGeolocationResponse {
  id: string;
  locatie: string;
  type: string;
  boundingbox: IBoundingbox;
}

export interface IBoundingbox {
  lowerleft: ICoordinates;
  upperright: ICoordinates;
}

export interface ICoordinates {
  lat: number;
  lon: number;
}
