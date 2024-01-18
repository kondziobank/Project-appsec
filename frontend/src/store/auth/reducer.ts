import { AuthAction } from "./actionTypes";

const initialState = {
  error: null,
  loading: false,
  user: null,
};

const login = (state = initialState, action: any) => {
  switch (action.type) {
    case AuthAction.LOGIN_USER:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case AuthAction.LOGIN_OAUTH2_USER:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case AuthAction.LOGOUT_USER:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case AuthAction.FETCH_USER_INFO:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case AuthAction.PUSH_USER_INFO:
      return {
        ...state,
        error: null,
        loading: true,
        ...action.payload
      };

    case AuthAction.SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        ...action.payload
      };

    case AuthAction.ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    default:
      return { ...state };
  }
};

export default login;
