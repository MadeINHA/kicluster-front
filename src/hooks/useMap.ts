import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectIsNaverMapsLoaded } from 'slices/global/selectors';

const defaultCenter = { lat: 37.4507292, lng: 126.6538126 };

const naverMapsOptions: naver.maps.MapOptions = {
  center: defaultCenter,
  scaleControl: false,
  logoControl: false,
  mapDataControl: false,
};

export default function useMap() {
  const isNaverMapsLoaded = useSelector(selectIsNaverMapsLoaded);

  const mapRef = useRef<null | naver.maps.Map>(null);
  const myLocationMarkerRef = useRef<null | naver.maps.Marker>(null);

  const goToMyLocation = () => {
    console.log('finding my location...');
    navigator.geolocation.getCurrentPosition(geolocationPosition => {
      const position = {
        lat: geolocationPosition.coords.latitude,
        lng: geolocationPosition.coords.longitude,
      };
      console.log('location found');
      mapRef.current?.setCenter(position);
    });
  };

  useEffect(() => {
    if (!isNaverMapsLoaded) return;
    const map = new naver.maps.Map('map', naverMapsOptions);
    mapRef.current = map;
    myLocationMarkerRef.current = new naver.maps.Marker({
      position: defaultCenter,
      // map,
      icon: {
        content:
          '<div style="display: flex;align-items: center;justify-content: center;width: 36px;height: 36px;background-color: #6a26ff40;border-radius: 50%;"><div style="width: 16px;height: 16px;background-color: #6a26ff;border: 2px solid #ffffff;border-radius: 50%;box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16)"></div></div>',
        size: new naver.maps.Size(36, 36),
        anchor: new naver.maps.Point(18, 18),
      },
    });
  }, [isNaverMapsLoaded]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(geolocationPosition => {
      const position = {
        lat: geolocationPosition.coords.latitude,
        lng: geolocationPosition.coords.longitude,
      };
      myLocationMarkerRef.current?.setPosition(position);
    });
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { mapRef, goToMyLocation };
}
