export interface IHeaderProps {
  user: IUser;
  appName: string;
  appUrl: string;
  profileUrl?: string;
  changeUrl?: string;
  logoutUrl?: string;
  loginUrl?: string;
  logoUrl?: string;
  showLogoutShortcut?: boolean;
}

export interface IUser {
  name?: string;
  role?: string;
}
