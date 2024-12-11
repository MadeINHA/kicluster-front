import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectNearestArea } from 'slices/area/selectors';

export default function useNearestArea(
  mapRef: MutableRefObject<naver.maps.Map | null>,
) {
  const nearestArea = useSelector(selectNearestArea);

  const polygon = useRef<null | naver.maps.Polygon>(null);
  const marker = useRef<null | naver.maps.Marker>(null);

  useEffect(() => {
    if (nearestArea) {
      if (!polygon.current) {
        polygon.current = new naver.maps.Polygon({
          paths: [nearestArea?.path ?? []],
          fillColor: '#6a26ff',
          fillOpacity: 0.2,
          strokeColor: '#6a26ff',
          strokeWeight: 3,
          strokeLineJoin: 'round',
          strokeOpacity: 0.5,
        });
      }
      if (!marker.current) {
        marker.current = new naver.maps.Marker({
          position: nearestArea.center,
          icon: {
            content: `<div style="position: relative;display: flex;align-items: center;justify-content: center;width: 47.5px;height: 47.5px;"><svg xmlns="http://www.w3.org/2000/svg" style="position: absolute;top: 6px;" height="28px" viewBox="0 -960 960 960" width="28px" fill="#fff"><path d="M240-120v-720h280q100 0 170 70t70 170q0 100-70 170t-170 70H400v240H240Zm160-400h128q33 0 56.5-23.5T608-600q0-33-23.5-56.5T528-680H400v160Z"/></svg><svg style="width: 100%;" viewBox="0 0 128 151" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute;top: 0;"><circle cx="64" cy="64" r="64" fill="#6a26ff"/><path d="M64 151L91.7128 103H36.2872L64 151Z" fill="#6a26ff"/></svg></div>`,
            size: new naver.maps.Size(47.5, 47.5),
            anchor: new naver.maps.Point(23.75, 47.5),
          },
        });
      }
      polygon.current.setPaths([nearestArea?.path ?? []]);
      polygon.current.setMap(mapRef.current);
      marker.current.setPosition(nearestArea.center);
      marker.current.setMap(mapRef.current);
    } else {
      if (polygon.current) {
        polygon.current.setMap(null);
      }
      if (marker.current) {
        marker.current.setMap(null);
      }
    }
  }, [mapRef, nearestArea]);
}
