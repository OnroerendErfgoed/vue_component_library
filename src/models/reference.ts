export interface IApplicationItem {
  uri: string;
  title: string;
}

export interface IApplication {
  title: string;
  uri: string;
  service_url: string;
  success: boolean;
  hasReferences: boolean;
  count: number;
  items: IApplicationItem[];
}

export interface IReference {
  query_uri: string;
  success: boolean;
  has_references: boolean;
  count: number;
  applications: IApplication[];
}
