import { all, call, put, takeLatest } from 'redux-saga/effects';
import { areaActions } from '.';
import {
  getExistingAreas,
  getProhibitedAreas,
  getRecommendedAreas,
} from 'api/area';

function* getRecommendedAreasSaga() {
  try {
    const response = yield call(getRecommendedAreas);
    yield put(areaActions.setRecommendedAreas(response.data.data.cluster_list));
  } catch (error) {}
}

function* getProhibitedAreasSaga() {
  try {
    const response = yield call(getProhibitedAreas);
    yield put(areaActions.setProhibitedAreas(response.data.data.areaInfoList));
  } catch (error) {}
}

function* getExistingAreasSaga() {
  try {
    const response = yield call(getExistingAreas);
    yield put(areaActions.setExistingAreas(response.data.data.areaInfoList));
  } catch (error) {}
}

// Root saga
export default function* areaSaga() {
  // if necessary, start multiple sagas at once with `all`
  yield all([
    takeLatest(areaActions.getRecommendedAreas, getRecommendedAreasSaga),
    takeLatest(areaActions.getProhibitedAreas, getProhibitedAreasSaga),
    takeLatest(areaActions.getExistingAreas, getExistingAreasSaga),
  ]);
}
