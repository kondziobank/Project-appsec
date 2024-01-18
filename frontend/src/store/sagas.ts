import { all, fork } from "redux-saga/effects"
import LayoutSaga from "./layout/saga";
import authSaga from "./auth/saga";
import articlesSaga from "./articles/saga";

export default function* rootSaga() {
  yield all([
    fork(LayoutSaga),
    fork(authSaga),
    fork(articlesSaga)
  ])
}
