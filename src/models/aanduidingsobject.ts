import type { IDataverantwoordelijke } from './dataverantwoordelijke';
import type { IStatus } from './status';
import type { ISystemFields } from './system-fields';

export interface IAanduidingsobject {
  id: number;
  uri: string;
  titel: string;
  type: IAanduidingsobjectType;
  naam: string;
  geldigheid_start: string;
  geldigheid_einde: string;
  dataverantwoordelijke: IDataverantwoordelijke;
  locatie_samenvatting: string;
  korte_beschrijving: string;
  gemeente_samenvatting: string;
  status: IStatus;
  self: string;
  systemfields: ISystemFields;
  aanduidingsobjectLabel?: string;
}

export interface IAanduidingsobjectType {
  id: number;
  naam: string;
}
