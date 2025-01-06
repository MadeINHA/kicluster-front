import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.global || initialState;

export const selectIsNaverMapsLoaded = createSelector(
  selectSlice,
  state => state.isNaverMapsLoaded,
);
