import { KickBoard } from 'slices/kickBoard/types';

const HOLD_TIME = 1000;

const createColoredIcon = (color: string) => ({
  content: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 41.8805C23.6103 41.8805 23.2207 41.8133 22.831 41.679C22.441 41.5443 22.0883 41.336 21.773 41.054C19.9783 39.4 18.2988 37.6967 16.7345 35.944C15.1705 34.1917 13.811 32.4398 12.656 30.6885C11.5007 28.9372 10.5865 27.2013 9.91351 25.481C9.24051 23.7603 8.90401 22.0987 8.90401 20.496C8.90401 15.8807 10.3968 12.1442 13.3825 9.2865C16.3685 6.42883 19.9077 5 24 5C28.0923 5 31.6315 6.42883 34.6175 9.2865C37.6032 12.1442 39.096 15.8807 39.096 20.496C39.096 22.0987 38.7595 23.757 38.0865 25.471C37.4135 27.1853 36.5027 28.9213 35.354 30.679C34.205 32.4367 32.8485 34.1885 31.2845 35.9345C29.7205 37.6808 28.041 39.3808 26.246 41.0345C25.9353 41.3165 25.5822 41.528 25.1865 41.669C24.7912 41.81 24.3957 41.8805 24 41.8805ZM24.0035 23.7305C24.9985 23.7305 25.8492 23.3762 26.5555 22.6675C27.2622 21.9588 27.6155 21.107 27.6155 20.112C27.6155 19.117 27.2612 18.2662 26.5525 17.5595C25.8438 16.8532 24.9918 16.5 23.9965 16.5C23.0015 16.5 22.1508 16.8543 21.4445 17.563C20.7378 18.2717 20.3845 19.1237 20.3845 20.119C20.3845 21.114 20.7388 21.9647 21.4475 22.671C22.1562 23.3773 23.0082 23.7305 24.0035 23.7305Z"
        fill="${color}" />
      <path
        d="M24 41.8805C23.6103 41.8805 23.2207 41.8133 22.831 41.679C22.441 41.5443 22.0883 41.336 21.773 41.054C19.9783 39.4 18.2988 37.6967 16.7345 35.944C15.1705 34.1917 13.811 32.4398 12.656 30.6885C11.5007 28.9372 10.5865 27.2013 9.91349 25.481C9.24049 23.7603 8.90399 22.0987 8.90399 20.496C8.90399 15.8807 10.3968 12.1442 13.3825 9.2865C16.3685 6.42883 19.9077 5 24 5C28.0923 5 31.6315 6.42883 34.6175 9.2865C37.6032 12.1442 39.096 15.8807 39.096 20.496C39.096 22.0987 38.7595 23.757 38.0865 25.471C37.4135 27.1853 36.5027 28.9213 35.354 30.679C34.205 32.4367 32.8485 34.1885 31.2845 35.9345C29.7205 37.6808 28.041 39.3808 26.246 41.0345C25.9353 41.3165 25.5822 41.528 25.1865 41.669C24.7912 41.81 24.3957 41.8805 24 41.8805ZM24.0035 23.7305C24.9985 23.7305 25.8492 23.3762 26.5555 22.6675C27.2622 21.9588 27.6155 21.107 27.6155 20.112C27.6155 19.117 27.2612 18.2662 26.5525 17.5595C25.8438 16.8532 24.9918 16.5 23.9965 16.5C23.0015 16.5 22.1508 16.8543 21.4445 17.563C20.7378 18.2717 20.3845 19.1237 20.3845 20.119C20.3845 21.114 20.7388 21.9647 21.4475 22.671C22.1562 23.3773 23.0082 23.7305 24.0035 23.7305Z"
        fill="${color}" />
      <circle cx="24" cy="20" r="4" fill="white" />
    </svg>
  `,
  size: new naver.maps.Size(48, 48),
  anchor: new naver.maps.Point(24, 42.44),
});

export type KickBoardMarkerData = ReturnType<typeof createKickBoardMarkerData>;

export function createKickBoardMarkerData(
  kickBoard: KickBoard,
  onMove: (lat: number, lng: number) => void,
  onClick?: () => void,
) {
  const color = kickBoard.parkingZone === 0 ? '#EF5B73' : '#00BBA9';

  const marker = new naver.maps.Marker({
    position: {
      lat: kickBoard.lat,
      lng: kickBoard.lng,
    },
    icon: createColoredIcon(color),
    zIndex: kickBoard.parkingZone === 0 ? 2 : undefined,
  });

  let timeout;
  const mousedownListener = naver.maps.Event.addListener(
    marker,
    'mousedown',
    () => {
      timeout = setTimeout(() => {
        marker.setOptions('draggable', true);
        marker.setIcon(createColoredIcon('#BBB500'));
      }, HOLD_TIME);
    },
  );
  const mouseupListener = naver.maps.Event.addListener(
    marker,
    'mouseup',
    () => {
      clearTimeout(timeout);
    },
  );
  const dragendListener = naver.maps.Event.addListener(
    marker,
    'dragend',
    () => {
      marker.setOptions('draggable', false);
      marker.setIcon(createColoredIcon(color));
      onMove(
        (marker.getPosition() as naver.maps.LatLng).lat(),
        (marker.getPosition() as naver.maps.LatLng).lng(),
      );
    },
  );

  const listeners = [mousedownListener, mouseupListener, dragendListener];

  if (onClick) {
    listeners.push(naver.maps.Event.addListener(marker, 'click', onClick));
  }

  return {
    marker,
    listeners,
  };
}
