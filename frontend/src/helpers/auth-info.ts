export interface AuthInfo {
  accessToken: string;
  refreshToken: string;
}

const makeAuthInfoManager = (localStorageKey: string) => ({
  get(): AuthInfo|undefined {
    const rawData = localStorage.getItem(localStorageKey);
    return rawData ? JSON.parse(rawData) : undefined;
  },
  set(authInfo: AuthInfo) {
    const rawData = JSON.stringify(authInfo);
    localStorage.setItem(localStorageKey, rawData);
  },
  clear() {
    localStorage.removeItem(localStorageKey);
  }
})

export default makeAuthInfoManager('authUser');
