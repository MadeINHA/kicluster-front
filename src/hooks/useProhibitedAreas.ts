import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectProhibitedAreas } from 'slices/area/selectors';

export default function useProhibitedAreas(
  mapRef: MutableRefObject<naver.maps.Map | null>,
  isVisible: boolean,
) {
  const prohibitedAreas = useSelector(selectProhibitedAreas);

  const polygonsRef = useRef<null | naver.maps.Polygon[]>(null);

  useEffect(() => {
    if (prohibitedAreas) {
      polygonsRef.current = prohibitedAreas.map(
        ({ path }) =>
          new naver.maps.Polygon({
            paths: [path],
            map: mapRef.current ?? undefined,
            fillColor: '#c00000',
            fillOpacity: 0.2,
            strokeColor: '#c00000',
            strokeWeight: 3,
            strokeLineJoin: 'round',
            strokeOpacity: 0.5,
          }),
      );
    }
    return () => {
      polygonsRef.current?.forEach(polygon => {
        polygon.setMap(null);
      });
    };
  }, [mapRef, prohibitedAreas]);

  useEffect(() => {
    polygonsRef.current?.forEach(polygon => {
      polygon.setVisible(isVisible);
    });
  }, [isVisible]);
}
