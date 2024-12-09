import { MutableRefObject, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProhibitedAreas } from 'slices/area/selectors';

export default function useProhibitedAreas(
  mapRef: MutableRefObject<naver.maps.Map | null>,
) {
  const prohibitedAreas = useSelector(selectProhibitedAreas);

  useEffect(() => {
    let prohibitedAreasPolygons: undefined | naver.maps.Polygon[];
    if (prohibitedAreas) {
      prohibitedAreasPolygons = prohibitedAreas.map(
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
      prohibitedAreasPolygons?.forEach(polygon => {
        polygon.setMap(null);
      });
    };
  }, [mapRef, prohibitedAreas]);
}
