import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectExistingAreas } from 'slices/area/selectors';

export default function useExistingAreas(
  mapRef: MutableRefObject<naver.maps.Map | null>,
  isVisible: boolean,
) {
  const existingAreas = useSelector(selectExistingAreas);

  const polygonsRef = useRef<null | naver.maps.Polygon[]>(null);

  useEffect(() => {
    if (existingAreas) {
      polygonsRef.current = existingAreas.map(
        ({ path }) =>
          new naver.maps.Polygon({
            paths: [path],
            map: mapRef.current ?? undefined,
            fillColor: '#0000c0',
            fillOpacity: 0.2,
            strokeColor: '#0000c0',
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
  }, [existingAreas, mapRef]);

  useEffect(() => {
    polygonsRef.current?.forEach(polygon => {
      polygon.setVisible(isVisible);
    });
  }, [isVisible]);
}
