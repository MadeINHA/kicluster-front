import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectExistingAreas } from 'slices/area/selectors';

const COLOR = '#6DC5F1';

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
            fillColor: COLOR,
            fillOpacity: 0.25,
            strokeColor: COLOR,
            strokeWeight: 3,
            strokeLineJoin: 'round',
            visible: isVisible,
          }),
      );
    }
    return () => {
      polygonsRef.current?.forEach(polygon => {
        polygon.setMap(null);
      });
    };
  }, [existingAreas, isVisible, mapRef]);

  useEffect(() => {
    polygonsRef.current?.forEach(polygon => {
      polygon.setVisible(isVisible);
    });
  }, [isVisible]);
}
