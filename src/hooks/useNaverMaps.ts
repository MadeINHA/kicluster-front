import { config } from 'config';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from 'slices/global';
import { selectIsNaverMapsLoaded } from 'slices/global/selectors';

export default function useNaverMaps() {
  const dispatch = useDispatch();

  const isNaverMapsLoaded = useSelector(selectIsNaverMapsLoaded);

  useEffect(() => {
    if (isNaverMapsLoaded) return;
    if (document.getElementById('naverMapsScript')) return;
    const naverMapsScript = document.createElement('script');
    naverMapsScript.id = 'naverMapsScript';
    naverMapsScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${config.naverMapsApiId}`;
    naverMapsScript.onload = () => {
      dispatch(globalActions.setIsNaverMapsLoaded(true));
    };
    document.head.appendChild(naverMapsScript);
  }, [dispatch, isNaverMapsLoaded]);
}
