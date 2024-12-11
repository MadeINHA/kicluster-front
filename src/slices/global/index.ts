import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { GlobalState } from './types';
import { useInjectReducer } from 'utils/redux-injectors';

export const initialState: GlobalState = {
  isNaverMapsLoaded: false,
};

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsNaverMapsLoaded(state, action: PayloadAction<boolean>) {
      state.isNaverMapsLoaded = action.payload;
    },
  },
});

export const { actions: globalActions } = slice;

export const useGlobalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
