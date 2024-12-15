import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectNearestArea } from 'slices/area/selectors';

const POLYGON_COLOR = '#04D9C4';
const MARKER_COLOR = '#00BBA9';

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
          fillColor: POLYGON_COLOR,
          fillOpacity: 0.25,
          strokeColor: POLYGON_COLOR,
          strokeWeight: 3,
          strokeLineJoin: 'round',
        });
      }
      if (!marker.current) {
        marker.current = new naver.maps.Marker({
          position: nearestArea.center,
          icon: {
            content: `
              <div style="display: flex;justify-content: center;position: relative;width: 48px;height: 48px;">
                <svg style="position: absolute;top: 10px;width: 22px;height: 22px;z-index: 1;"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#ffffff">
                  <path
                    d="M380-380v180q0 24.54-17.54 42.27Q344.92-140 320-140q-24.54 0-42.27-17.73Q260-175.46 260-200v-560q0-24.54 17.73-42.27Q295.46-820 320-820h200q91.15 0 155.58 64.42Q740-691.15 740-600t-64.42 155.58Q611.15-380 520-380H380Zm0-120h144.92q41.08 0 70.54-29.46 29.46-29.46 29.46-70.54 0-41.08-29.46-70.54Q566-700 524.92-700H380v200Z" />
                </svg>
                <svg style="position: absolute;width: 48px;height: 48px;" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 41.8805C23.6103 41.8805 23.2207 41.8133 22.831 41.679C22.441 41.5443 22.0883 41.336 21.773 41.054C19.9783 39.4 18.2988 37.6967 16.7345 35.944C15.1705 34.1917 13.811 32.4398 12.656 30.6885C11.5007 28.9372 10.5865 27.2013 9.91351 25.481C9.24051 23.7603 8.90401 22.0987 8.90401 20.496C8.90401 15.8807 10.3968 12.1442 13.3825 9.2865C16.3685 6.42883 19.9077 5 24 5C28.0923 5 31.6315 6.42883 34.6175 9.2865C37.6032 12.1442 39.096 15.8807 39.096 20.496C39.096 22.0987 38.7595 23.757 38.0865 25.471C37.4135 27.1853 36.5027 28.9213 35.354 30.679C34.205 32.4367 32.8485 34.1885 31.2845 35.9345C29.7205 37.6808 28.041 39.3808 26.246 41.0345C25.9353 41.3165 25.5822 41.528 25.1865 41.669C24.7912 41.81 24.3957 41.8805 24 41.8805ZM24.0035 23.7305C24.9985 23.7305 25.8492 23.3762 26.5555 22.6675C27.2622 21.9588 27.6155 21.107 27.6155 20.112C27.6155 19.117 27.2612 18.2662 26.5525 17.5595C25.8438 16.8532 24.9918 16.5 23.9965 16.5C23.0015 16.5 22.1508 16.8543 21.4445 17.563C20.7378 18.2717 20.3845 19.1237 20.3845 20.119C20.3845 21.114 20.7388 21.9647 21.4475 22.671C22.1562 23.3773 23.0082 23.7305 24.0035 23.7305Z"
                    fill="${MARKER_COLOR}" />
                  <path
                    d="M24 41.8805C23.6103 41.8805 23.2207 41.8133 22.831 41.679C22.441 41.5443 22.0883 41.336 21.773 41.054C19.9783 39.4 18.2988 37.6967 16.7345 35.944C15.1705 34.1917 13.811 32.4398 12.656 30.6885C11.5007 28.9372 10.5865 27.2013 9.91349 25.481C9.24049 23.7603 8.90399 22.0987 8.90399 20.496C8.90399 15.8807 10.3968 12.1442 13.3825 9.2865C16.3685 6.42883 19.9077 5 24 5C28.0923 5 31.6315 6.42883 34.6175 9.2865C37.6032 12.1442 39.096 15.8807 39.096 20.496C39.096 22.0987 38.7595 23.757 38.0865 25.471C37.4135 27.1853 36.5027 28.9213 35.354 30.679C34.205 32.4367 32.8485 34.1885 31.2845 35.9345C29.7205 37.6808 28.041 39.3808 26.246 41.0345C25.9353 41.3165 25.5822 41.528 25.1865 41.669C24.7912 41.81 24.3957 41.8805 24 41.8805ZM24.0035 23.7305C24.9985 23.7305 25.8492 23.3762 26.5555 22.6675C27.2622 21.9588 27.6155 21.107 27.6155 20.112C27.6155 19.117 27.2612 18.2662 26.5525 17.5595C25.8438 16.8532 24.9918 16.5 23.9965 16.5C23.0015 16.5 22.1508 16.8543 21.4445 17.563C20.7378 18.2717 20.3845 19.1237 20.3845 20.119C20.3845 21.114 20.7388 21.9647 21.4475 22.671C22.1562 23.3773 23.0082 23.7305 24.0035 23.7305Z"
                    fill="${MARKER_COLOR}" />
                  <circle cx="24" cy="20" r="4" fill="${MARKER_COLOR}" />
                </svg>
              </div>
            `,
            size: new naver.maps.Size(48, 48),
            anchor: new naver.maps.Point(24, 42.44),
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
