
import { call, takeEvery, put, select } from "redux-saga/effects";
import { getTableOfContents, pushTableOfContentsToApi } from "src/helpers/api_helper";
import { syncError, updateTableOfContents } from "./actions";
import { ArticlesAction } from "./actionTypes";

function* fetchTableOfContents() {
  try {
    const tableOfContents: Promise<any> = yield call(getTableOfContents);
    yield put(updateTableOfContents(tableOfContents));
  } catch (error) {
    yield put(syncError(error));
  }
}

function* pushTableOfContents(action: any) {
  try {
    const tableOfContents = action.payload;
    yield put(updateTableOfContents(tableOfContents))
    yield call(pushTableOfContentsToApi, tableOfContents)
  } catch (error) {
    yield put(syncError(error));
  }
}

function* articlesSaga() {
  yield takeEvery(ArticlesAction.FETCH_TABLE_OF_CONTENTS, fetchTableOfContents);
  yield takeEvery(ArticlesAction.PUSH_TABLE_OF_CONTENTS, pushTableOfContents);
}

export default articlesSaga;
