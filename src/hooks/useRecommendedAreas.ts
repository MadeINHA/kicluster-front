import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectRecommendedAreas } from 'slices/area/selectors';

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
            fillColor: '#00c000',
            fillOpacity: 0.2,
            strokeColor: '#00c000',
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
  }, [mapRef, recommendedAreas]);

  useEffect(() => {
    polygonsRef.current?.forEach(polygon => {
      polygon.setVisible(isVisible);
    });
  }, [isVisible]);
}
