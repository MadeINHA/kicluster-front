import { MutableRefObject, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectExistingAreas } from 'slices/area/selectors';

export default function useExistingAreas(
  mapRef: MutableRefObject<naver.maps.Map | null>,
) {
  const existingAreas = useSelector(selectExistingAreas);

  useEffect(() => {
    let existingAreasPolygons: undefined | naver.maps.Polygon[];
    if (existingAreas) {
      existingAreasPolygons = existingAreas.map(
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
      existingAreasPolygons?.forEach(polygon => {
        polygon.setMap(null);
      });
    };
  }, [existingAreas, mapRef]);
}
