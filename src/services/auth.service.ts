import { HttpService } from './http.service';
import { IErkenning } from '@/utils';
import { ErkendAlsType } from '@models/erkend-als-type.enum';
import type { IUser, IUserActor, User } from '@models/user';

const getErkenningen = (actor?: IUserActor): IErkenning[] => (actor?.erkenningen as unknown as IErkenning[]) ?? [];

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

  isErfgoedgemeente() {
    return this.user.hasRole(this.ROLE_PREFIX + 'oegemeente-lezer');
  }

  isErkendArcheoloogType0() {
    return this.isErkendAls(ErkendAlsType.ARCHEOLOOG_TYPE_0);
  }

  isErkendArcheoloogType1() {
    return this.isErkendAls(ErkendAlsType.ARCHEOLOOG_TYPE_1);
  }

  isErkendArcheoloogType2() {
    return this.isErkendAls(ErkendAlsType.ARCHEOLOOG_TYPE_2);
  }

  isErkendArcheoloog() {
    return this.isErkendArcheoloogType0() || this.isErkendArcheoloogType1() || this.isErkendArcheoloogType2();
  }

  private isErkendAls(typeId: number): boolean {
    const now = new Date();

    return getErkenningen(this.user.actor).some((erkenning) => {
      const startdatum = erkenning.startdatum ? new Date(erkenning.startdatum) : null;
      const einddatum = erkenning.einddatum ? new Date(erkenning.einddatum) : null;

      return (
        erkenning.erkend_als.id === typeId && !!startdatum && startdatum <= now && (!einddatum || now <= einddatum)
      );
    });
  }

  isAOEUser() {
    return this.isBeheerder() || this.isToevoeger() || this.isLezer();
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
    if (this.isErfgoedgemeente()) {
      return this.user.organisatie.naam;
    }
    if (this.isErkendArcheoloog()) {
      return 'Erkend archeoloog';
    }
    if (this.isLezer()) {
      return 'Lezer';
    }
    return 'Gebruiker';
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
