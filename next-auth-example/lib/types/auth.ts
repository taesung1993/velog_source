export interface IAuth {
  ready: boolean;
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}
