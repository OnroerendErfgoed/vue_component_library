import type { IErkenning } from './erkenning';

export class User {
  public actor: IUserActor;
  public groups: string[];
  public organisatie: IOrganisatie;
  public personid: string;
  public persoonsgegevens: IPersoonsgegevens;
  public ssoToken: string;
  public userid: string;

  constructor(user: IUser) {
    this.actor = user.actor;
    this.groups = user.groups;
    this.organisatie = user.organisatie;
    this.personid = user.personid;
    this.persoonsgegevens = user.persoonsgegevens;
    this.ssoToken = user.sso_token;
    this.userid = user.userid;
  }

  public hasRole(role: string): boolean {
    return !!this.groups?.find((group) => group === role);
  }
}

/* User object */
export interface IUser {
  actor: IUserActor;
  groups: string[];
  organisatie: IOrganisatie;
  personid: string;
  persoonsgegevens: IPersoonsgegevens;
  sso_token: string;
  userid: string;
}

export interface IUserActor {
  erkenningen: IErkenning[];
  id: number;
  instantie_actor_omschrijving: string;
  instantie_actor_uri: string;
  omschrijving: string;
  uid: string;
  uri: string;
}

interface IOrganisatie {
  id: string;
  naam: string;
  type: string;
  nace_codes?: NaceCode[];
}

interface NaceCode {
  code: string;
  omschrijving: string;
}

interface IPersoonsgegevens {
  email: string;
  naam: string;
  omschrijving: string;
  rijksregisternummer: string;
  voornaam: string;
}
