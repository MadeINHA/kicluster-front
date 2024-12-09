import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { areaActions } from 'slices/area';
import { kickBoardActions } from 'slices/kickBoard';

export default function useData() {
  const dispatch = useDispatch();

  const getDynamicData = useCallback(() => {
    dispatch(kickBoardActions.getKickBoards());
    dispatch(areaActions.getRecommendedAreas());
  }, [dispatch]);

  useEffect(() => {
    const getStaticData = () => {
      dispatch(areaActions.getProhibitedAreas());
      dispatch(areaActions.getExistingAreas());
    };

    getStaticData();
    getDynamicData();

    // const interval = setInterval(() => {
    //   getDynamicData();
    // }, UPDATE_TIME_INTERVAL);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [dispatch, getDynamicData]);

  return { getDynamicData };
}
