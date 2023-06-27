import type { IDataverantwoordelijke } from './dataverantwoordelijke';
import { Serializable } from './serializable';
import type { IStatus } from './status';
import type { ISystemFields } from './system-fields';

export interface IESAanduidingsobject {
  id: number;
  uri: string;
  titel: string;
  type: IAanduidingsobjectType;
  naam: string;
  geldigheid_start?: string;
  geldigheid_einde?: string;
  dataverantwoordelijke?: IDataverantwoordelijke;
  locatie_samenvatting?: string;
  korte_beschrijving?: string;
  gemeente_samenvatting?: string;
  status?: IStatus;
  self?: string;
  systemfields?: ISystemFields;
}

export class ESAanduidingsobject extends Serializable<IESAanduidingsobject> {
  public id: number;
  public titel: string;
  public type: IAanduidingsobjectType;
  public naam: string;
  public uri: string;
  public geldigheidStart?: string;
  public geldigheidEinde?: string;
  public dataverantwoordelijke?: IDataverantwoordelijke;
  public locatieSamenvatting?: string;
  public status?: IStatus;

  constructor(a: IESAanduidingsobject) {
    super();
    this.id = a.id;
    this.titel = a.naam + ' (id: ' + a.id + ')';
    this.type = a.type;
    this.uri = a.uri;
    this.naam = a.naam;
    this.geldigheidStart = a.geldigheid_start;
    this.geldigheidEinde = a.geldigheid_einde;
    this.dataverantwoordelijke = a.dataverantwoordelijke;
    this.locatieSamenvatting = a.locatie_samenvatting;
    this.status = a.status;
  }

  public serialize(): IESAanduidingsobject {
    return {
      id: this.id,
      titel: this.titel,
      type: this.type,
      uri: this.uri,
      naam: this.naam,
    };
  }
}

export interface IAanduidingsobjectType {
  id: number;
  naam: string;
}
