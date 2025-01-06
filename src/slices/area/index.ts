import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  AreaState,
  ExistingArea,
  NearestArea,
  ProhibitedArea,
  RecommendedArea,
} from './types';
import areaSaga from './saga';

export const initialState: AreaState = {
  recommendedAreas: null,
  prohibitedAreas: null,
  existingAreas: null,
  nearestArea: null,
};

const slice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    getRecommendedAreas() {},
    setRecommendedAreas(state, action: PayloadAction<RecommendedArea[]>) {
      state.recommendedAreas = action.payload;
    },
    getProhibitedAreas() {},
    setProhibitedAreas(state, action: PayloadAction<ProhibitedArea[]>) {
      state.prohibitedAreas = action.payload;
    },
    getExistingAreas() {},
    setExistingAreas(state, action: PayloadAction<ExistingArea[]>) {
      state.existingAreas = action.payload;
    },
    getNearestArea(_, action: PayloadAction<{ lat: number; lng: number }>) {},
    setNearestArea(state, action: PayloadAction<NearestArea | null>) {
      state.nearestArea = action.payload;
    },
  },
});

export const { actions: areaActions } = slice;

export const useAreaSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: areaSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useRecommendedAreaSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
