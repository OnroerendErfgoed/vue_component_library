import { HttpService } from './http.service';
import type { IUser, User } from '@models/user';

export class AuthService extends HttpService {
  protected readonly API_URL: string;
  protected readonly ROLE_PREFIX: string;
  protected _user!: User;
  protected refreshToken = true;

  constructor(apiUrl: string, user: User, rolePrefix: string) {
    super();
    this.API_URL = apiUrl;
    this.ROLE_PREFIX = rolePrefix;
    this.user = user;
    this.watchTokenTimeout();
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  isBeheerder() {
    if (this.user) {
      return this.user.hasRole(this.ROLE_PREFIX + 'beheerder');
    }
    return false;
  }

  isInvoerder() {
    if (this.user) {
      return this.user.hasRole(this.ROLE_PREFIX + 'invoerder');
    }
    return false;
  }

  isToevoeger() {
    if (this.user) {
      return this.user.hasRole(this.ROLE_PREFIX + 'toevoeger');
    }
    return false;
  }

  isLezer() {
    if (this.user) {
      return this.user.hasRole(this.ROLE_PREFIX + 'lezer');
    }
    return false;
  }

  getHighestRole(): string {
    if (this.isBeheerder()) {
      return 'Beheerder';
    }
    if (this.isInvoerder()) {
      return 'Invoerder';
    }
    if (this.isToevoeger()) {
      return 'Toevoeger';
    }
    if (this.isLezer()) {
      return 'Lezer';
    }
    return 'Gebruiker';
  }

  canEdit() {
    if (this.isBeheerder()) return true;
    return false;
  }

  async getSsoToken(hardRefresh = false) {
    if (this.refreshToken || hardRefresh) {
      await this.refreshSession();
    }
    if (this.user) {
      return this.user.ssoToken;
    }
    return null;
  }

  async refreshSession() {
    const sessionUser = (await this.get<IUser>(`${this.API_URL}user`, { headers: { Accept: 'application/json' } }))
      .data;

    if (this.user) {
      this.user.ssoToken = sessionUser.sso_token;
      this.refreshToken = false;
    }
  }

  watchTokenTimeout() {
    const minutes = 2;
    window.setInterval(() => {
      this.refreshToken = true;
    }, minutes * 60000);
  }
}
