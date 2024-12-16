import { takeLatest, put, all, call } from 'redux-saga/effects';
import { kickBoardActions } from '.';
import {
  getKickBoards,
  returnKickBoardMove,
} from 'api/kickBoard';
import { areaActions } from 'slices/area';

function* returnKickBoardMoveSaga({ payload }) {
  try {
    yield call(returnKickBoardMove, payload.id, payload.lat, payload.lng);
  } catch (error) {}

  yield put(kickBoardActions.getKickBoards());
  yield put(areaActions.getRecommendedAreas());
}

function* getKickBoardsSaga() {
  try {
    const response = yield call(getKickBoards);
    yield put(
      kickBoardActions.setKickBoards(response.data.data.kickboard_list),
    );
  } catch (error) {}
}

// Root saga
export default function* kickBoardSaga() {
  // if necessary, start multiple sagas at once with `all`
  yield all([
    takeLatest(kickBoardActions.returnKickBoardMove, returnKickBoardMoveSaga),
    takeLatest(kickBoardActions.getKickBoards, getKickBoardsSaga),
  ]);
}
