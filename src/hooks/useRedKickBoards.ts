import { checkKickBoardMove } from 'api/kickBoard';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { kickBoardActions } from 'slices/kickBoard';
import { selectKickBoards } from 'slices/kickBoard/selectors';
import { KickBoard } from 'slices/kickBoard/types';
import { createKickBoardMarkerData } from 'utils/createKickBoardMarkerData';

export default function useRedKickBoards(
  mapRef: MutableRefObject<naver.maps.Map | null>,
  isVisible: boolean,
  setTemp: Dispatch<
    SetStateAction<{
      id: number;
      lat: number;
      lng: number;
    } | null>
  >,
) {
  const dispatch = useDispatch();

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
          const { marker, listeners } = createKickBoardMarkerData(
            kickBoard,
            (lat, lng) => {
              if (selectedRedKickBoard?.kickboardId === kickBoard.kickboardId) {
                setTemp({ id: kickBoard.kickboardId, lat, lng });
              } else {
                checkKickBoardMove(kickBoard.kickboardId, lat, lng).then(
                  res => {
                    if (
                      res.data.data ||
                      window.confirm(
                        '해당 구역은 금지 구역입니다. 그래도 반납하시겠습니까?',
                      )
                    ) {
                      dispatch(
                        kickBoardActions.returnKickBoardMove({
                          id: kickBoard.kickboardId,
                          lat,
                          lng,
                        }),
                      );
                    } else {
                      marker.setPosition({
                        lat: kickBoard.lat,
                        lng: kickBoard.lng,
                      });
                    }
                  },
                );
              }
            },
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

          if (!listenersRef.current) {
            listenersRef.current = [];
          }
          listenersRef.current.push(...listeners);

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
  }, [dispatch, isVisible, kickBoards, mapRef, selectedRedKickBoard]);

  return { selectedRedKickBoard, resetSelectedRedKickBoard };
}
