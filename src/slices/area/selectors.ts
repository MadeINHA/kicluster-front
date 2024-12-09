import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.area || initialState;

export const selectRecommendedAreas = createSelector(
  [selectSlice],
  state => state.recommendedAreas,
);

export const selectProhibitedAreas = createSelector(
  [selectSlice],
  state => state.prohibitedAreas,
);

export const selectExistingAreas = createSelector(
  [selectSlice],
  state => state.existingAreas,
);
