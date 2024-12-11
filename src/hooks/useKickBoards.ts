import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectKickBoards } from 'slices/kickBoard/selectors';
import { KickBoard } from 'slices/kickBoard/types';

export default function useKickBoards(
  mapRef: MutableRefObject<naver.maps.Map | null>,
) {
  const kickBoards = useSelector(selectKickBoards);

  const kickBoardMarkersRef = useRef<
    null | (KickBoard & { overlay: naver.maps.Marker })[]
  >(null);

  useEffect(() => {
    if (kickBoardMarkersRef.current) {
    } else {
    }
    console.log(': ', kickBoards);
  }, [kickBoards]);
}
