import { call, put, takeEvery } from "redux-saga/effects";
import { AuthAction } from "./actionTypes";
import { authSuccess, authError } from "./actions";
import { getCurrentUserInfo, pushCurrentUserInfo, login, loginByOAuth2, logout } from "../../helpers/api_helper";

function* loginUser({ payload }: any) {
  try {
    const { credentials, history } = payload
    yield call(login, credentials);
    yield call(fetchUserInfo);
    history.push("/");
  } catch (error) {
    yield put(authError(error));
  }
}

function* loginOAuth2User({ payload }: any) {
  try {
    const { provider, credentials, history } = payload
    yield call(loginByOAuth2, provider, credentials);
    yield call(fetchUserInfo);
    history.push("/");
  } catch (error) {
    yield put(authError(error));
  }
}

function* logoutUser({ payload }: any) {
  try {
    const { history } = payload
    yield call(logout);
    history.push("/login");
    yield put(authSuccess());
  } catch (error) {
    yield put(authError(error));
  }
}

function* fetchUserInfo() {
  try {
    const user: Promise<any> = yield call(getCurrentUserInfo)
    yield put(authSuccess({ user }))
  } catch (error) {
    yield put(authError(error));
  }
}

function* pushUserInfo({ payload }: any) {
  try {
    yield call(pushCurrentUserInfo, payload.user);
    yield put(authSuccess());
  } catch (error) {
    yield put(authError(error));
  }
}

function* authSaga() {
  yield takeEvery(AuthAction.LOGIN_USER, loginUser);
  yield takeEvery(AuthAction.LOGIN_OAUTH2_USER, loginOAuth2User);
  yield takeEvery(AuthAction.LOGOUT_USER, logoutUser);
  yield takeEvery(AuthAction.FETCH_USER_INFO, fetchUserInfo);
  yield takeEvery(AuthAction.PUSH_USER_INFO, pushUserInfo);
}

export default authSaga;
