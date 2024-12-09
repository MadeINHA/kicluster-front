import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { areaActions } from 'slices/area';
import {
  selectExistingAreas,
  selectProhibitedAreas,
  selectRecommendedAreas,
} from 'slices/area/selectors';
import { kickBoardActions } from 'slices/kickBoard';
import { selectKickBoards } from 'slices/kickBoard/selectors';
import styled from 'styled-components/macro';
import { motion } from 'motion/react';
import useMap from 'hooks/useMap';
import useData from 'hooks/useData';
import useRecommendedAreas from 'hooks/useRecommendedAreas';
import useProhibitedAreas from 'hooks/useProhibitedAreas';
import useExistingAreas from 'hooks/useExistingAreas';

const UPDATE_TIME_INTERVAL = 30000;
const KICK_BOARD_MARKER_BG_COLOR = '#6a26ff';

export function MainPage() {
  const { getDynamicData } = useData();

  const kickBoards = useSelector(selectKickBoards);

  const kickBoardMarkersRef = useRef<null | naver.maps.Marker[]>(null);

  const [isKickBoardVisible] = useState(true);

  const { mapRef, goToMyLocation } = useMap();
  useRecommendedAreas(mapRef);
  useProhibitedAreas(mapRef);
  useExistingAreas(mapRef);

  useEffect(() => {
    const clearEffect = () => {
      kickBoardMarkersRef.current?.forEach(marker => {
        marker.setMap(null);
      });
    };

    if (!kickBoards) return clearEffect;

    kickBoardMarkersRef.current = kickBoards.map(kickBoard => {
      const marker = new naver.maps.Marker({
        position: {
          lat: kickBoard.lat,
          lng: kickBoard.lng,
        },
        map: mapRef.current ?? undefined,
        icon: {
          content: `<div style="display: flex;justify-content: center;width: 56px;height: 56px;"><svg style="width: 100%;" viewBox="0 0 128 151" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="64" fill="${
            kickBoard.parkingZone === 1
              ? '#ff0000'
              : kickBoard.clusterId === -1
              ? KICK_BOARD_MARKER_BG_COLOR
              : '#00c000'
          }"/><path d="M64 151L91.7128 103H36.2872L64 151Z" fill="${
            kickBoard.parkingZone === 1
              ? '#ff0000'
              : kickBoard.clusterId === -1
              ? KICK_BOARD_MARKER_BG_COLOR
              : '#00c000'
          }"/><path d="M38.9167 85.5C37.9014 85.5 37.0504 85.1566 36.3635 84.4698C35.6767 83.783 35.3333 82.9319 35.3333 81.9167C35.3333 80.9014 35.6767 80.0503 36.3635 79.3635C37.0504 78.6767 37.9014 78.3333 38.9167 78.3333C39.9319 78.3333 40.783 78.6767 41.4698 79.3635C42.1566 80.0503 42.5 80.9014 42.5 81.9167C42.5 82.9319 42.1566 83.783 41.4698 84.4698C40.783 85.1566 39.9319 85.5 38.9167 85.5ZM38.9167 92.6667C41.9028 92.6667 44.441 91.6215 46.5313 89.5313C48.6215 87.441 49.6667 84.9028 49.6667 81.9167C49.6667 78.9306 48.6215 76.3924 46.5313 74.3021C44.441 72.2118 41.9028 71.1667 38.9167 71.1667C35.9306 71.1667 33.3924 72.2118 31.3021 74.3021C29.2118 76.3924 28.1667 78.9306 28.1667 81.9167C28.1667 84.9028 29.2118 87.441 31.3021 89.5313C33.3924 91.6215 35.9306 92.6667 38.9167 92.6667ZM89.0833 85.5C88.0681 85.5 87.217 85.1566 86.5302 84.4698C85.8434 83.783 85.5 82.9319 85.5 81.9167C85.5 80.9014 85.8434 80.0503 86.5302 79.3635C87.217 78.6767 88.0681 78.3333 89.0833 78.3333C90.0986 78.3333 90.9497 78.6767 91.6365 79.3635C92.3233 80.0503 92.6667 80.9014 92.6667 81.9167C92.6667 82.9319 92.3233 83.783 91.6365 84.4698C90.9497 85.1566 90.0986 85.5 89.0833 85.5ZM89.0833 92.6667C92.0694 92.6667 94.6076 91.6215 96.6979 89.5313C98.7882 87.441 99.8333 84.9028 99.8333 81.9167C99.8333 78.9306 98.7882 76.3924 96.6979 74.3021C94.6076 72.2118 92.0694 71.1667 89.0833 71.1667C86.8139 71.1667 84.7535 71.8236 82.9021 73.1375C81.0507 74.4514 79.7368 76.1833 78.9604 78.3333H60.0583C59.4014 74.2125 57.7142 70.6441 54.9969 67.6281C52.2795 64.6122 48.95 62.5069 45.0083 61.3125L50.025 38.9167H64V31.75H50.025C48.3528 31.75 46.8597 32.2576 45.5458 33.2729C44.2319 34.2882 43.3958 35.6319 43.0375 37.3042L36.2292 67.5833H38.9167C42.8583 67.5833 46.2326 68.9868 49.0396 71.7938C51.8465 74.6007 53.25 77.975 53.25 81.9167V85.5H78.9604C79.7368 87.65 81.0507 89.3819 82.9021 90.6958C84.7535 92.0097 86.8139 92.6667 89.0833 92.6667Z" fill="white"/></svg></div>`,
          size: new naver.maps.Size(56, 56),
          anchor: new naver.maps.Point(28, 56),
        },
        visible: isKickBoardVisible,
      });
      return marker;
    });

    var markers = kickBoardMarkersRef.current; // Array

    var htmlMarker1 = {
      content: `<div style="display: flex;justify-content: center;position: relative;width: 56px;height: 56px;"><div style="position: absolute;color: #ffffff;top: 10px;"></div><svg style="width: 100%;" viewBox="0 0 128 151" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="64" fill="#a277ff"/><path d="M64 151L91.7128 103H36.2872L64 151Z" fill="#a277ff"/></svg></div>`,
      size: new naver.maps.Size(56, 56),
      anchor: new naver.maps.Point(28, 56),
    };

    new MarkerClustering({
      minClusterSize: 2,
      maxZoom: 19,
      map: mapRef.current,
      markers: markers,
      disableClickZoom: false,
      icons: [htmlMarker1],
      indexGenerator: [10, 20, 50, 100, 1000],
      stylingFunction: function (clusterMarker, count) {
        clusterMarker
          .getElement()
          .querySelector('div:first-child > div').innerText = count;
      },
    });

    return clearEffect;
  }, [kickBoards, isKickBoardVisible, mapRef]);

  return (
    <>
      <Helmet>
        <title>MainPage</title>
        <meta name="description" content="A Boilerplate application mainpage" />
      </Helmet>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: '100%',
        }}
      >
        <Map id="map" />
        {/* <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 'env(safe-area-inset-top)',
            left: 'env(safe-area-inset-left)',
            padding: '24px',
          }}
        >
          <TopButton
            onClick={() => {
              setIsKickBoardVisible(isKickBoardVisible => !isKickBoardVisible);
            }}
            style={{
              backgroundColor: isKickBoardVisible ? '#6a26ff' : undefined,
              color: isKickBoardVisible ? '#ffffff' : undefined,
            }}
          >
            킥보드
          </TopButton>
        </div> */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '12px',
            position: 'absolute',
            bottom: 'calc(99px + env(safe-area-inset-bottom))',
            right: 'env(safe-area-inset-right)',
            padding: '24px',
          }}
        >
          <IconButton
            whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => {
              getDynamicData();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </IconButton>
          <IconButton
            whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => {
              goToMyLocation();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Z" />
            </svg>
          </IconButton>
        </div>
        <div
          style={{
            display: 'flex',
            columnGap: '12px',
            position: 'absolute',
            bottom: 'env(safe-area-inset-bottom)',
            width: '100%',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
          }}
        >
          <BottomButton
            whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            주행 모드
          </BottomButton>
          <BottomButton
            whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            견인 모드
          </BottomButton>
        </div>
      </div>
    </>
  );
}

const Map = styled.div`
  width: 100%;
  height: 100%;

  & > div:last-child {
    display: none;
  }
`;

const Button = styled(motion.div)`
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16);
  color: #12052e;
  font-size: 18px;
  text-align: center;

  & > svg {
    fill: #12052e;
  }
`;

const BottomButton = styled(Button)`
  flex-grow: 1;
  padding: 12px 12px;
  background-color: #ebe8f1;
  border-radius: 12px;
`;

const IconButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #ffffff;
  border-radius: 50%;
`;

const TopButton = styled(Button)`
  height: 36px;
  padding: 0 16px;
  background-color: #ffffff;
  border-radius: 18px;
  color: #9c91b5;
  font-size: 12px;
  line-height: 36px;
`;
