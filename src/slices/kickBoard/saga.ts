import { takeLatest, put, all, call } from 'redux-saga/effects';
import { kickBoardActions } from '.';
import { getKickBoards, lentKickBoard, returnKickBoard } from 'api/kickBoard';

function* getKickBoardsSaga() {
  try {
    const response = yield call(getKickBoards);
    yield put(
      kickBoardActions.setKickBoards(response.data.data.kickboard_list),
    );
  } catch (error) {}
}

function* lentKickBoardSaga({ payload }) {
  try {
    const response = yield call(
      lentKickBoard,
      payload.kickBoardId,
      payload.path,
    );
    yield put(
      kickBoardActions.setKickBoards(response.data.data.kickboard_list),
    );
  } catch (error) {}
}

function* returnKickBoardSaga() {
  // try {
  //   const response = yield call(returnKickBoard);
  //   yield put(
  //     kickBoardActions.setKickBoards(response.data.data.kickboard_list),
  //   );
  // } catch (error) {}
}

// Root saga
export default function* kickBoardSaga() {
  // if necessary, start multiple sagas at once with `all`
  yield all([takeLatest(kickBoardActions.getKickBoards, getKickBoardsSaga)]);
  yield all([takeLatest(kickBoardActions.lentKickBoard, lentKickBoardSaga)]);
  yield all([
    takeLatest(kickBoardActions.returnKickBoard, returnKickBoardSaga),
  ]);
}
