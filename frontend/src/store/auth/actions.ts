import { OAuth2Provider } from "src/helpers/api_helper";
import { AuthAction } from "./actionTypes";

export const loginUser = (credentials: any, history: any) => ({
  type: AuthAction.LOGIN_USER,
  payload: { credentials, history },
})

export const loginOAuth2User = (provider: OAuth2Provider, credentials: any, history: any) => ({
  type: AuthAction.LOGIN_OAUTH2_USER,
  payload: { provider, credentials, history },
})

export const logoutUser = (history: any) => ({
  type: AuthAction.LOGOUT_USER,
  payload: { history },
})

export const fetchUserInfo = () => ({
  type: AuthAction.FETCH_USER_INFO,
  payload: {}
})

export const pushUserInfo = (user: any) => ({
  type: AuthAction.PUSH_USER_INFO,
  payload: { user }
})

export const authSuccess = (payload: any = {}) => {
  return {
    type: AuthAction.SUCCESS,
    payload,
  }
}

export const authError = (error: any) => {
  return {
    type: AuthAction.ERROR,
    payload: { error },
  }
}
