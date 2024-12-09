import { config } from 'config';
import { useEffect, useLayoutEffect, useRef } from 'react';

const defaultCenter = { lat: 37.4507292, lng: 126.6538126 };

const naverMapsOptions: naver.maps.MapOptions = {
  center: defaultCenter,
  scaleControl: false,
  logoControl: false,
  mapDataControl: false,
};

export default function useMap() {
  const mapRef = useRef<null | naver.maps.Map>(null);
  const myLocationMarkerRef = useRef<null | naver.maps.Marker>(null);

  const goToMyLocation = () => {
    navigator.geolocation.getCurrentPosition(geolocationPosition => {
      const position = {
        lat: geolocationPosition.coords.latitude,
        lng: geolocationPosition.coords.longitude,
      };
      mapRef.current?.setCenter(position);
    });
  };

  // Load Naver Maps & Create a Map & The Map Settings
  useLayoutEffect(() => {
    if (!document.getElementById('naverMapsScript')) {
      const naverMapsScript = document.createElement('script');
      naverMapsScript.id = 'naverMapsScript';
      naverMapsScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${config.naverMapsApiKey}`;
      naverMapsScript.onload = () => {
        const markerClusteringScript = document.createElement('script');
        markerClusteringScript.id = 'markerClusteringScript';
        markerClusteringScript.src = '/markerClustering.js';
        document.head.appendChild(markerClusteringScript);
        markerClusteringScript.onload = () => {
          const map = new naver.maps.Map('map', naverMapsOptions);
          mapRef.current = map;
          if (!myLocationMarkerRef) return;
          myLocationMarkerRef.current = new naver.maps.Marker({
            position: defaultCenter,
            map,
            icon: {
              content:
                '<div style="display: flex;align-items: center;justify-content: center;width: 36px;height: 36px;background-color: #6a26ff40;border-radius: 50%;"><div style="width: 16px;height: 16px;background-color: #6a26ff;border: 2px solid #ffffff;border-radius: 50%;box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16)"></div></div>',
              size: new naver.maps.Size(36, 36),
              anchor: new naver.maps.Point(18, 18),
            },
          });
        };
      };
      document.head.appendChild(naverMapsScript);
    }
  }, [mapRef, myLocationMarkerRef]);

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
