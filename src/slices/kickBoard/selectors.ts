import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.kickBoard || initialState;

// Here type of `someState` will be inferred ✅
export const selectKickBoards = createSelector(
  selectSlice,
  state => state.kickBoards,
);
