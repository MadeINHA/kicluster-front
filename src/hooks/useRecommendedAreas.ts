import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectRecommendedAreas } from 'slices/area/selectors';

const COLOR = '#04D9C4';

export default function useRecommendedAreas(
  mapRef: MutableRefObject<naver.maps.Map | null>,
  isVisible: boolean,
) {
  const recommendedAreas = useSelector(selectRecommendedAreas);

  const polygonsRef = useRef<null | naver.maps.Polygon[]>(null);

  useEffect(() => {
    if (recommendedAreas) {
      polygonsRef.current = recommendedAreas.map(
        ({ kickboard_list }) =>
          new naver.maps.Polygon({
            paths: [kickboard_list],
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
  }, [isVisible, mapRef, recommendedAreas]);

  useEffect(() => {
    polygonsRef.current?.forEach(polygon => {
      polygon.setVisible(isVisible);
    });
  }, [isVisible]);
}
