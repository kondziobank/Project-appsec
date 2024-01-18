export enum AuthAction {
    LOGIN_USER = '@@auth/LOGIN_USER',
    LOGIN_OAUTH2_USER = '@@auth/LOGIN_OAUTH2_USER',
    LOGOUT_USER = '@@auth/LOGOUT_USER',
    FETCH_USER_INFO = '@@auth/FETCH_USER_INFO',
    PUSH_USER_INFO = '@@auth/PUSH_USER_INFO',

    SUCCESS = '@@auth/SUCCESS',
    ERROR = '@@auth/ERROR',
}
