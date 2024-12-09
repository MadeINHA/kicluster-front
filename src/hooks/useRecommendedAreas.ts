import { MutableRefObject, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectRecommendedAreas } from 'slices/area/selectors';

export default function useRecommendedAreas(
  mapRef: MutableRefObject<naver.maps.Map | null>,
) {
  const recommendedAreas = useSelector(selectRecommendedAreas);

  useEffect(() => {
    let recommendedAreasPolygons: undefined | naver.maps.Polygon[];
    if (recommendedAreas) {
      recommendedAreasPolygons = recommendedAreas.map(
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
      recommendedAreasPolygons?.forEach(polygon => {
        polygon.setMap(null);
      });
    };
  }, [mapRef, recommendedAreas]);
}
