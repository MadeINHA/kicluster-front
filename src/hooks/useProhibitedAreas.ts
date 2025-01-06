import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectProhibitedAreas } from 'slices/area/selectors';

const COLOR = '#F16D83';

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
  }, [isVisible, mapRef, prohibitedAreas]);

  useEffect(() => {
    polygonsRef.current?.forEach(polygon => {
      polygon.setVisible(isVisible);
    });
  }, [isVisible]);
}
