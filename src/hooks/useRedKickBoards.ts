import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectKickBoards } from 'slices/kickBoard/selectors';
import { createKickBoardMarkerData } from 'utils/createKickBoardMarkerData';

export default function useRedKickBoards(
  mapRef: MutableRefObject<naver.maps.Map | null>,
  isVisible: boolean,
) {
  const kickBoards = useSelector(selectKickBoards);

  const markersRef = useRef<null | naver.maps.Marker[]>(null);
  const listenersRef = useRef<null | naver.maps.MapEventListener[]>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (kickBoards) {
      markersRef.current = kickBoards
        .filter(kickBoard => kickBoard.parkingZone === 0)
        .map(kickBoard => {
          const { marker, listener } = createKickBoardMarkerData(
            kickBoard,
            () => {
              console.log(kickBoard.kickboardId);
            },
          );

          marker.setMap(mapRef.current);
          marker.setVisible(isVisible);

          if (listener) {
            if (!listenersRef.current) {
              listenersRef.current = [];
            }
            listenersRef.current.push(listener);
          }

          return marker;
        });
    }

    return () => {
      markersRef.current?.forEach(marker => {
        marker.setMap(null);
      });
      listenersRef.current?.forEach(listener => {
        naver.maps.Event.removeListener(listener);
      });
    };
  }, [isVisible, kickBoards, mapRef]);

  // useEffect(() => {
  //   const listeners: naver.maps.MapEventListener[] = [];
  //   if (isOnlyTowableKickBoardVisible) {
  //     setIsKickBoardVisible(false);
  //     towableKickBoardMarkersRef.current =
  //       kickBoards
  //         ?.filter(kickBoard => kickBoard.parkingZone === 0)
  //         .map(kickBoard => {
  //           const marker = new naver.maps.Marker({
  //             position: {
  //               lat: kickBoard.lat,
  //               lng: kickBoard.lng,
  //             },
  //             map: mapRef.current ?? undefined,
  //             icon: {
  //               content: `<div style="display: flex;justify-content: center;width: 56px;height: 56px;"><svg style="width: 100%;" viewBox="0 0 128 151" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="64" fill="#ff0000"/><path d="M64 151L91.7128 103H36.2872L64 151Z" fill="#ff0000"/><path d="M38.9167 85.5C37.9014 85.5 37.0504 85.1566 36.3635 84.4698C35.6767 83.783 35.3333 82.9319 35.3333 81.9167C35.3333 80.9014 35.6767 80.0503 36.3635 79.3635C37.0504 78.6767 37.9014 78.3333 38.9167 78.3333C39.9319 78.3333 40.783 78.6767 41.4698 79.3635C42.1566 80.0503 42.5 80.9014 42.5 81.9167C42.5 82.9319 42.1566 83.783 41.4698 84.4698C40.783 85.1566 39.9319 85.5 38.9167 85.5ZM38.9167 92.6667C41.9028 92.6667 44.441 91.6215 46.5313 89.5313C48.6215 87.441 49.6667 84.9028 49.6667 81.9167C49.6667 78.9306 48.6215 76.3924 46.5313 74.3021C44.441 72.2118 41.9028 71.1667 38.9167 71.1667C35.9306 71.1667 33.3924 72.2118 31.3021 74.3021C29.2118 76.3924 28.1667 78.9306 28.1667 81.9167C28.1667 84.9028 29.2118 87.441 31.3021 89.5313C33.3924 91.6215 35.9306 92.6667 38.9167 92.6667ZM89.0833 85.5C88.0681 85.5 87.217 85.1566 86.5302 84.4698C85.8434 83.783 85.5 82.9319 85.5 81.9167C85.5 80.9014 85.8434 80.0503 86.5302 79.3635C87.217 78.6767 88.0681 78.3333 89.0833 78.3333C90.0986 78.3333 90.9497 78.6767 91.6365 79.3635C92.3233 80.0503 92.6667 80.9014 92.6667 81.9167C92.6667 82.9319 92.3233 83.783 91.6365 84.4698C90.9497 85.1566 90.0986 85.5 89.0833 85.5ZM89.0833 92.6667C92.0694 92.6667 94.6076 91.6215 96.6979 89.5313C98.7882 87.441 99.8333 84.9028 99.8333 81.9167C99.8333 78.9306 98.7882 76.3924 96.6979 74.3021C94.6076 72.2118 92.0694 71.1667 89.0833 71.1667C86.8139 71.1667 84.7535 71.8236 82.9021 73.1375C81.0507 74.4514 79.7368 76.1833 78.9604 78.3333H60.0583C59.4014 74.2125 57.7142 70.6441 54.9969 67.6281C52.2795 64.6122 48.95 62.5069 45.0083 61.3125L50.025 38.9167H64V31.75H50.025C48.3528 31.75 46.8597 32.2576 45.5458 33.2729C44.2319 34.2882 43.3958 35.6319 43.0375 37.3042L36.2292 67.5833H38.9167C42.8583 67.5833 46.2326 68.9868 49.0396 71.7938C51.8465 74.6007 53.25 77.975 53.25 81.9167V85.5H78.9604C79.7368 87.65 81.0507 89.3819 82.9021 90.6958C84.7535 92.0097 86.8139 92.6667 89.0833 92.6667Z" fill="white"/></svg></div>`,
  //               size: new naver.maps.Size(56, 56),
  //               anchor: new naver.maps.Point(28, 56),
  //             },
  //           });
  //           listeners.push(
  //             naver.maps.Event.addListener(marker, 'click', () => {
  //               setSelectedKickBoardData({ kickBoard, marker });
  //               // console.log({ kickBoard, marker });
  //               // mapRef.current?.setCenter(kickBoard);
  //               // mapRef.current?.setZoom(16, true);
  //             }),
  //           );
  //           return {
  //             kickBoard,
  //             marker,
  //           };
  //         }) ?? [];
  //   } else {
  //     setIsKickBoardVisible(true);
  //     towableKickBoardMarkersRef.current?.forEach(({ marker }) => {
  //       marker.setMap(null);
  //     });
  //   }
  //   return () => {
  //     listeners.forEach(listener => {
  //       naver.maps.Event.removeListener(listener);
  //     });
  //   };
  // }, [isOnlyTowableKickBoardVisible, kickBoards, mapRef]);
}
