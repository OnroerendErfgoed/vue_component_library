export interface ILinks {
  relaties: ILinkRelatie;
}

export interface ILinkRelatie {
  gebeurtenissen: ILinkRelatieHref;
  waarnemingen: ILinkRelatieHref;
}

export interface ILinkRelatieHref {
  href: string;
}

export interface IInventarisLinkWaarneming {
  naam: string;
  uri: string;
  id: number;
}

export interface IInventarisLinkGebeurtenis {
  titel: string;
  uri: string;
  id: number;
}
