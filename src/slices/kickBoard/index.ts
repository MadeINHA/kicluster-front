import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅
import { KickBoard, KickBoardState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import kickBoardSaga from './saga';

export const initialState: KickBoardState = {
  kickBoards: null,
};

const slice = createSlice({
  name: 'kickBoard',
  initialState,
  reducers: {
    getKickBoards() {},
    setKickBoards(state, action: PayloadAction<KickBoard[]>) {
      state.kickBoards = action.payload;
    },
    lentKickBoard(
      _,
      action: PayloadAction<{
        kickBoardId: number;
        path: { lat: number; lng: number }[];
      }>,
    ) {},
    returnKickBoard() {},
  },
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: kickBoardActions } = slice;

export const useKickBoardSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: kickBoardSaga });
  return { actions: slice.actions };
};
