import { all, call, put, takeLatest } from 'redux-saga/effects';
import { areaActions } from '.';
import {
  getClusterNearest,
  getExistingAreas,
  getFixedAreaNearest,
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

function* getNearestAreaSaga({ payload }) {
  try {
    const response1 = yield call(getFixedAreaNearest, payload.lat, payload.lng);
    const response2 = yield call(getClusterNearest, payload.lat, payload.lng);

    let sum = [0, 0];
    response1.data.data.path.forEach(point => {
      sum[0] += point.lat;
      sum[1] += point.lng;
    });
    sum[0] /= response1.data.data.path.length;
    sum[1] /= response1.data.data.path.length;

    const getDistance = (x: number, y: number) => {
      return Math.sqrt(
        Math.pow(payload.lng - x, 2) + Math.pow(payload.lat - y, 2),
      );
    };

    console.log(response1.data.data.name, response1.data.data.path);

    if (
      getDistance(sum[1], sum[0]) <
      getDistance(response2.data.data.cent_lng, response2.data.data.cent_lat)
    ) {
      yield put(
        areaActions.setNearestArea({
          name: response1.data.data.name,
          path: response1.data.data.path,
          center: { lat: sum[0], lng: sum[1] },
        }),
      );
    } else {
      yield put(
        areaActions.setNearestArea({
          name: '새로운 주차 구역',
          path: response2.data.data.kickboard_list.map(({ lat, lng }) => ({
            lat,
            lng,
          })),
          center: {
            lat: response2.data.data.cent_lat,
            lng: response2.data.data.cent_lng,
          },
        }),
      );
    }
  } catch (error) {}
}

// Root saga
export default function* areaSaga() {
  // if necessary, start multiple sagas at once with `all`
  yield all([
    takeLatest(areaActions.getRecommendedAreas, getRecommendedAreasSaga),
    takeLatest(areaActions.getProhibitedAreas, getProhibitedAreasSaga),
    takeLatest(areaActions.getExistingAreas, getExistingAreasSaga),
    takeLatest(areaActions.getNearestArea, getNearestAreaSaga),
  ]);
}
