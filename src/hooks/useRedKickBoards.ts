import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { selectKickBoards } from 'slices/kickBoard/selectors';
import { KickBoard } from 'slices/kickBoard/types';
import { createKickBoardMarkerData } from 'utils/createKickBoardMarkerData';

export default function useRedKickBoards(
  mapRef: MutableRefObject<naver.maps.Map | null>,
  isVisible: boolean,
) {
  const kickBoards = useSelector(selectKickBoards);

  const markersRef = useRef<null | naver.maps.Marker[]>(null);
  const listenersRef = useRef<null | naver.maps.MapEventListener[]>(null);

  const [selectedRedKickBoard, setSelectedRedKickBoard] =
    useState<null | KickBoard>(null);

  const resetSelectedRedKickBoard = () => {
    setSelectedRedKickBoard(null);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (kickBoards) {
      markersRef.current = kickBoards
        .filter(kickBoard => kickBoard.parkingZone === 0)
        .map(kickBoard => {
          const { marker, listener } = createKickBoardMarkerData(
            kickBoard,
            () => {
              setSelectedRedKickBoard(kickBoard);
            },
          );

          marker.setMap(mapRef.current);
          marker.setVisible(
            selectedRedKickBoard?.kickboardId === kickBoard.kickboardId
              ? true
              : isVisible,
          );

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
  }, [isVisible, kickBoards, mapRef, selectedRedKickBoard]);

  return { selectedRedKickBoard, resetSelectedRedKickBoard };
}
