export interface IHeaderProps {
  user: IHeaderUser;
  appName: string;
  appUrl: string;
  profileUrl?: string;
  changeUrl?: string;
  logoutUrl?: string;
  loginUrl?: string;
  logoUrl?: string;
  showLogoutShortcut?: boolean;
}

export interface IHeaderUser {
  name?: string;
  role?: string;
}
