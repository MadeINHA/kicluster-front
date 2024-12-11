import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { selectKickBoards } from 'slices/kickBoard/selectors';
import styled from 'styled-components/macro';
import { motion } from 'motion/react';
import { KickBoard } from 'slices/kickBoard/types';
import useMap from 'hooks/useMap';
import useData from 'hooks/useData';
import useRecommendedAreas from 'hooks/useRecommendedAreas';
import useProhibitedAreas from 'hooks/useProhibitedAreas';
import useExistingAreas from 'hooks/useExistingAreas';
import { areaActions } from 'slices/area';
import { selectNearestArea } from 'slices/area/selectors';
import useNearestArea from 'hooks/useNearestArea';
import useMarkerClusteringManager from 'hooks/useMarkerClusteringManager';
import Notification from 'app/components/Notification';

// const UPDATE_TIME_INTERVAL = 30000;
const KICK_BOARD_MARKER_BG_COLOR = '#6a26ff';

export function MainPage() {
  const { MarkerClustering } = useMarkerClusteringManager();
  const dispatch = useDispatch();

  const { getDynamicData } = useData();

  const kickBoards = useSelector(selectKickBoards);
  const nearestArea = useSelector(selectNearestArea);

  const kickBoardMarkersRef = useRef<
    null | { kickBoard: KickBoard; marker: naver.maps.Marker }[]
  >(null);
  const polylineRef = useRef<null | naver.maps.Polyline>(null);
  const markerClusteringRef = useRef<any>(null);
  const towableKickBoardMarkersRef = useRef<
    null | { kickBoard: KickBoard; marker: naver.maps.Marker }[]
  >(null);

  const [isKickBoardVisible, setIsKickBoardVisible] = useState(true);
  const [selectedKickBoardData, setSelectedKickBoardData] = useState<null | {
    kickBoard: KickBoard;
    marker: naver.maps.Marker;
  }>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isTowing, setIsTowing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);
  const [isTowSuccessStackVisible, setIsTowSuccessStackVisible] =
    useState(false);
  const [isOnlyTowableKickBoardVisible, setIsOnlyTowableKickBoardVisible] =
    useState(false);
  const [isAreasVisible, setIsAreasVisible] = useState(true);
  const [distance, setDistance] = useState(21);
  // const [isTowFailureStackVisible, setIsTowFailureStackVisible] =
  //   useState(false);

  const { mapRef, goToMyLocation } = useMap();
  useRecommendedAreas(mapRef, isAreasVisible);
  useProhibitedAreas(mapRef, isAreasVisible);
  useExistingAreas(mapRef, isAreasVisible);
  useNearestArea(mapRef);

  useEffect(() => {
    const listeners: naver.maps.MapEventListener[] = [];
    if (isOnlyTowableKickBoardVisible) {
      setIsKickBoardVisible(false);
      towableKickBoardMarkersRef.current =
        kickBoards
          ?.filter(kickBoard => kickBoard.parkingZone === 0)
          .map(kickBoard => {
            const marker = new naver.maps.Marker({
              position: {
                lat: kickBoard.lat,
                lng: kickBoard.lng,
              },
              map: mapRef.current ?? undefined,
              icon: {
                content: `<div style="display: flex;justify-content: center;width: 56px;height: 56px;"><svg style="width: 100%;" viewBox="0 0 128 151" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="64" fill="#ff0000"/><path d="M64 151L91.7128 103H36.2872L64 151Z" fill="#ff0000"/><path d="M38.9167 85.5C37.9014 85.5 37.0504 85.1566 36.3635 84.4698C35.6767 83.783 35.3333 82.9319 35.3333 81.9167C35.3333 80.9014 35.6767 80.0503 36.3635 79.3635C37.0504 78.6767 37.9014 78.3333 38.9167 78.3333C39.9319 78.3333 40.783 78.6767 41.4698 79.3635C42.1566 80.0503 42.5 80.9014 42.5 81.9167C42.5 82.9319 42.1566 83.783 41.4698 84.4698C40.783 85.1566 39.9319 85.5 38.9167 85.5ZM38.9167 92.6667C41.9028 92.6667 44.441 91.6215 46.5313 89.5313C48.6215 87.441 49.6667 84.9028 49.6667 81.9167C49.6667 78.9306 48.6215 76.3924 46.5313 74.3021C44.441 72.2118 41.9028 71.1667 38.9167 71.1667C35.9306 71.1667 33.3924 72.2118 31.3021 74.3021C29.2118 76.3924 28.1667 78.9306 28.1667 81.9167C28.1667 84.9028 29.2118 87.441 31.3021 89.5313C33.3924 91.6215 35.9306 92.6667 38.9167 92.6667ZM89.0833 85.5C88.0681 85.5 87.217 85.1566 86.5302 84.4698C85.8434 83.783 85.5 82.9319 85.5 81.9167C85.5 80.9014 85.8434 80.0503 86.5302 79.3635C87.217 78.6767 88.0681 78.3333 89.0833 78.3333C90.0986 78.3333 90.9497 78.6767 91.6365 79.3635C92.3233 80.0503 92.6667 80.9014 92.6667 81.9167C92.6667 82.9319 92.3233 83.783 91.6365 84.4698C90.9497 85.1566 90.0986 85.5 89.0833 85.5ZM89.0833 92.6667C92.0694 92.6667 94.6076 91.6215 96.6979 89.5313C98.7882 87.441 99.8333 84.9028 99.8333 81.9167C99.8333 78.9306 98.7882 76.3924 96.6979 74.3021C94.6076 72.2118 92.0694 71.1667 89.0833 71.1667C86.8139 71.1667 84.7535 71.8236 82.9021 73.1375C81.0507 74.4514 79.7368 76.1833 78.9604 78.3333H60.0583C59.4014 74.2125 57.7142 70.6441 54.9969 67.6281C52.2795 64.6122 48.95 62.5069 45.0083 61.3125L50.025 38.9167H64V31.75H50.025C48.3528 31.75 46.8597 32.2576 45.5458 33.2729C44.2319 34.2882 43.3958 35.6319 43.0375 37.3042L36.2292 67.5833H38.9167C42.8583 67.5833 46.2326 68.9868 49.0396 71.7938C51.8465 74.6007 53.25 77.975 53.25 81.9167V85.5H78.9604C79.7368 87.65 81.0507 89.3819 82.9021 90.6958C84.7535 92.0097 86.8139 92.6667 89.0833 92.6667Z" fill="white"/></svg></div>`,
                size: new naver.maps.Size(56, 56),
                anchor: new naver.maps.Point(28, 56),
              },
            });
            listeners.push(
              naver.maps.Event.addListener(marker, 'click', () => {
                setSelectedKickBoardData({ kickBoard, marker });
                // console.log({ kickBoard, marker });
                // mapRef.current?.setCenter(kickBoard);
                // mapRef.current?.setZoom(16, true);
              }),
            );
            return {
              kickBoard,
              marker,
            };
          }) ?? [];
    } else {
      setIsKickBoardVisible(true);
      towableKickBoardMarkersRef.current?.forEach(({ marker }) => {
        marker.setMap(null);
      });
    }
    return () => {
      listeners.forEach(listener => {
        naver.maps.Event.removeListener(listener);
      });
    };
  }, [isOnlyTowableKickBoardVisible, kickBoards, mapRef]);

  const readyForTow = () => {
    setIsOnlyTowableKickBoardVisible(true);
    setIsNotificationVisible(false);
  };

  useEffect(() => {
    if (selectedKickBoardData) {
      console.log(selectedKickBoardData.kickBoard.kickboardId);
      dispatch(
        areaActions.getNearestArea({
          lat: selectedKickBoardData.kickBoard.lat,
          lng: selectedKickBoardData.kickBoard.lng,
        }),
      );
      setIsKickBoardVisible(false);
      setIsAreasVisible(false);
    }
  }, [dispatch, selectedKickBoardData]);

  const startTow = () => {
    if (!selectedKickBoardData || !nearestArea) return;
    setIsLoadingScreenVisible(true);
    // dispatch(
    //   kickBoardActions.lentKickBoard({
    //     kickBoardId: selectedKickBoardData.kickBoard.kickboardId,
    //     path: [...nearestArea.path, nearestArea.path[0]],
    //   }),
    // );

    setTimeout(() => {
      setIsAreasVisible(true);
      setIsTowing(true);
      setTimer(120);
      mapRef.current?.setOptions('draggable', false);
      mapRef.current?.setCenter({
        lat: selectedKickBoardData.kickBoard.lat ?? 0,
        lng: selectedKickBoardData.kickBoard.lng ?? 0,
      });
      setIsLoadingScreenVisible(false);
      const a = {
        lat: (
          selectedKickBoardData.marker.getPosition() as naver.maps.LatLng
        ).lat(),
        lng: (
          selectedKickBoardData.marker.getPosition() as naver.maps.LatLng
        ).lng(),
      };
      console.log(a);
      const b = [37.450535283273815, 126.65425341704302];
      let c = 1;
      setDistance(21);
      setInterval(() => {
        if (c === 6) return;
        selectedKickBoardData.marker.setPosition({
          lat: a.lat + ((b[0] - a.lat) / 5) * c,
          lng: a.lng - ((a.lng - b[1]) / 5) * c,
        });
        mapRef.current?.setCenter({
          lat: a.lat + ((b[0] - a.lat) / 5) * c,
          lng: a.lng - ((a.lng - b[1]) / 5) * c,
        });
        polylineRef.current?.setPath([
          {
            lat: a.lat + ((b[0] - a.lat) / 5) * c,
            lng: a.lng - ((a.lng - b[1]) / 5) * c,
          },
          { lat: b[0], lng: b[1] },
        ]);
        c++;
      }, 700);
    }, 2134);
  };
  const endTow = () => {
    setIsLoadingScreenVisible(true);
    // axiosInstance.get();
    setTimeout(() => {
      setIsTowSuccessStackVisible(true);
      setIsLoadingScreenVisible(false);
    }, 1432);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (distance < 4) {
        return;
      }
      setDistance(timer => timer - 4);
    }, 700);

    return () => {
      clearInterval(interval);
    };
  }, [distance]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsNotificationVisible(true);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const listeners: naver.maps.MapEventListener[] = [];
    const clearEffect = () => {
      kickBoardMarkersRef.current?.forEach(({ marker }) => {
        marker.setMap(null);
      });
      listeners.forEach(listener => {
        naver.maps.Event.removeListener(listener);
      });
    };

    if (!kickBoards) return clearEffect;

    kickBoardMarkersRef.current = kickBoards.map(kickBoard => {
      const marker = new naver.maps.Marker({
        position: {
          lat: kickBoard.lat,
          lng: kickBoard.lng,
        },
        // map: mapRef.current ?? undefined,
        icon: {
          content: `<div style="display: flex;justify-content: center;width: 56px;height: 56px;"><svg style="width: 100%;" viewBox="0 0 128 151" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="64" fill="${
            kickBoard.parkingZone === 0
              ? '#ff0000'
              : kickBoard.clusterId === -1
              ? KICK_BOARD_MARKER_BG_COLOR
              : '#00c000'
          }"/><path d="M64 151L91.7128 103H36.2872L64 151Z" fill="${
            kickBoard.parkingZone === 0
              ? '#ff0000'
              : kickBoard.clusterId === -1
              ? KICK_BOARD_MARKER_BG_COLOR
              : '#00c000'
          }"/><path d="M38.9167 85.5C37.9014 85.5 37.0504 85.1566 36.3635 84.4698C35.6767 83.783 35.3333 82.9319 35.3333 81.9167C35.3333 80.9014 35.6767 80.0503 36.3635 79.3635C37.0504 78.6767 37.9014 78.3333 38.9167 78.3333C39.9319 78.3333 40.783 78.6767 41.4698 79.3635C42.1566 80.0503 42.5 80.9014 42.5 81.9167C42.5 82.9319 42.1566 83.783 41.4698 84.4698C40.783 85.1566 39.9319 85.5 38.9167 85.5ZM38.9167 92.6667C41.9028 92.6667 44.441 91.6215 46.5313 89.5313C48.6215 87.441 49.6667 84.9028 49.6667 81.9167C49.6667 78.9306 48.6215 76.3924 46.5313 74.3021C44.441 72.2118 41.9028 71.1667 38.9167 71.1667C35.9306 71.1667 33.3924 72.2118 31.3021 74.3021C29.2118 76.3924 28.1667 78.9306 28.1667 81.9167C28.1667 84.9028 29.2118 87.441 31.3021 89.5313C33.3924 91.6215 35.9306 92.6667 38.9167 92.6667ZM89.0833 85.5C88.0681 85.5 87.217 85.1566 86.5302 84.4698C85.8434 83.783 85.5 82.9319 85.5 81.9167C85.5 80.9014 85.8434 80.0503 86.5302 79.3635C87.217 78.6767 88.0681 78.3333 89.0833 78.3333C90.0986 78.3333 90.9497 78.6767 91.6365 79.3635C92.3233 80.0503 92.6667 80.9014 92.6667 81.9167C92.6667 82.9319 92.3233 83.783 91.6365 84.4698C90.9497 85.1566 90.0986 85.5 89.0833 85.5ZM89.0833 92.6667C92.0694 92.6667 94.6076 91.6215 96.6979 89.5313C98.7882 87.441 99.8333 84.9028 99.8333 81.9167C99.8333 78.9306 98.7882 76.3924 96.6979 74.3021C94.6076 72.2118 92.0694 71.1667 89.0833 71.1667C86.8139 71.1667 84.7535 71.8236 82.9021 73.1375C81.0507 74.4514 79.7368 76.1833 78.9604 78.3333H60.0583C59.4014 74.2125 57.7142 70.6441 54.9969 67.6281C52.2795 64.6122 48.95 62.5069 45.0083 61.3125L50.025 38.9167H64V31.75H50.025C48.3528 31.75 46.8597 32.2576 45.5458 33.2729C44.2319 34.2882 43.3958 35.6319 43.0375 37.3042L36.2292 67.5833H38.9167C42.8583 67.5833 46.2326 68.9868 49.0396 71.7938C51.8465 74.6007 53.25 77.975 53.25 81.9167V85.5H78.9604C79.7368 87.65 81.0507 89.3819 82.9021 90.6958C84.7535 92.0097 86.8139 92.6667 89.0833 92.6667Z" fill="white"/></svg></div>`,
          size: new naver.maps.Size(56, 56),
          anchor: new naver.maps.Point(28, 56),
        },
      });
      listeners.push(
        naver.maps.Event.addListener(marker, 'click', () => {
          // setSelectedKickBoardData({ kickBoard, marker });
          // console.log({ kickBoard, marker });
          // mapRef.current?.setCenter(kickBoard);
          // mapRef.current?.setZoom(16, true);
        }),
      );
      return { kickBoard, marker };
    });

    var markers = kickBoardMarkersRef.current.map(({ marker }) => marker); // Array

    var marker = {
      content: `<div class="abc-marker" style="display: flex;justify-content: center;position: relative;width: 56px;height: 56px;"><div style="position: absolute;color: #ffffff;top: 10px;"></div><svg style="width: 100%;" viewBox="0 0 128 151" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" r="64" fill="#a277ff"/><path d="M64 151L91.7128 103H36.2872L64 151Z" fill="#a277ff"/></svg></div>`,
      size: new naver.maps.Size(56, 56),
      anchor: new naver.maps.Point(28, 56),
    };

    if (!markerClusteringRef.current) {
      markerClusteringRef.current = new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 19,
        map: mapRef.current,
        markers: markers,
        disableClickZoom: false,
        icons: [marker],
        indexGenerator: [10, 20, 50, 100, 1000],
        averageCenter: true,
        stylingFunction: function (clusterMarker, count) {
          clusterMarker.getElement().children[0].children[0].innerText = count;
        },
      });
    }
    markerClusteringRef.current.setMarkers(markers);
    markerClusteringRef.current.setMap(
      isKickBoardVisible ? mapRef.current : null,
    );

    return clearEffect;
  }, [kickBoards, isKickBoardVisible, mapRef, MarkerClustering]);

  useEffect(() => {
    if (selectedKickBoardData === null) {
      towableKickBoardMarkersRef.current?.forEach(({ marker }) => {
        marker.setVisible(true);
      });
    } else {
      towableKickBoardMarkersRef.current?.forEach(({ marker }) => {
        marker.setVisible(false);
      });
      selectedKickBoardData.marker.setVisible(true);
    }
  }, [selectedKickBoardData]);

  useEffect(() => {
    if (nearestArea && selectedKickBoardData) {
      mapRef.current?.setCenter({
        lat: (nearestArea.center.lat + selectedKickBoardData.kickBoard.lat) / 2,
        lng: (nearestArea.center.lng + selectedKickBoardData.kickBoard.lng) / 2,
      });
      mapRef.current?.setZoom(18, true);

      if (!polylineRef.current) {
        polylineRef.current = new naver.maps.Polyline({
          path: [
            {
              lat: selectedKickBoardData.kickBoard.lat,
              lng: selectedKickBoardData.kickBoard.lng,
            },
            { lat: nearestArea.center.lat, lng: nearestArea.center.lng },
          ],
          strokeColor: '#ae00ff',
          strokeWeight: 5,
          strokeLineJoin: 'round',
          strokeLineCap: 'round',
        });
      }
      polylineRef.current.setPath([
        {
          lat: selectedKickBoardData.kickBoard.lat,
          lng: selectedKickBoardData.kickBoard.lng,
        },
        { lat: nearestArea.center.lat, lng: nearestArea.center.lng },
      ]);
      polylineRef.current.setMap(mapRef.current);
    } else {
      if (polylineRef.current) polylineRef.current.setMap(null);
    }

    // axiosInstance
    //   .get('/map-direction/v1/driving', {
    //     baseURL: 'https://naveropenapi.apigw.ntruss.com',
    //     headers: {
    //       'x-ncp-apigw-api-key-id': config.naverMapsApi.id,
    //       'x-ncp-apigw-api-key': config.naverMapsApi.secret,
    //     },
    //     params: {
    //       start: `${selectedKickBoardData.kickBoard.lat},${selectedKickBoardData.kickBoard.lng}`,
    //       goal: `${nearestArea.center.lat},${nearestArea.center.lng}`,
    //     },
    //   })
    //   .then(r => console.log(r));
  }, [mapRef, nearestArea, selectedKickBoardData]);

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
          overflow: 'hidden',
        }}
      >
        <Map id="map" />
        <div
          style={{
            display: isLoadingScreenVisible ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#00000080',
            zIndex: 1,
          }}
        >
          <motion.svg
            animate={{
              scale: [1, 1.5, 1.5, 1, 1],
              rotate: [0, 0, 180, 180, 0],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 -960 960 960"
            width="48px"
            fill="#ffffff"
          >
            <path d="M760-240q17 0 28.5-11.5T800-280q0-17-11.5-28.5T760-320q-17 0-28.5 11.5T720-280q0 17 11.5 28.5T760-240Zm0 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm-560-80q17 0 28.5-11.5T240-280q0-17-11.5-28.5T200-320q-17 0-28.5 11.5T160-280q0 17 11.5 28.5T200-240Zm0 80q-50 0-85-35t-35-85q0-50 35-85t85-35q38 0 69 22t44 58h211q11-69 56.5-119.5T692-510l-56-250H480v-80h156q28 0 50 17t28 45l76 338h-30q-66 0-113 47t-47 113v40H313q-13 36-44 58t-69 22Z" />
          </motion.svg>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            position: 'absolute',
            top: 0,
            right: isTowSuccessStackVisible ? 0 : '-100%',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            transition: 'right 0.2s',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              rowGap: '48px',
            }}
          >
            <div style={{ fontSize: '24px' }}>견인이 완료되었습니다.</div>
            {isTowSuccessStackVisible ? (
              <motion.div
                animate={{
                  rotate: [-30, 0, -30, 0],
                }}
                transition={{
                  delay: 0.2,
                }}
                style={{
                  width: '72px',
                  height: '72px',
                  backgroundImage: `url(${require('./pp.png')})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                }}
              />
            ) : null}
          </div>

          <TempButton
            whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => {
              mapRef.current?.setOptions('draggable', true);
              setIsTowSuccessStackVisible(false);
              setSelectedKickBoardData(null);
              setIsKickBoardVisible(true);
              dispatch(areaActions.setNearestArea(null));
              setIsOnlyTowableKickBoardVisible(false);
              setIsNotificationVisible(true);
            }}
          >
            돌아가기
          </TempButton>
        </div>
        <Notification
          onClick={readyForTow}
          isVisible={isNotificationVisible}
          message="불량 주차된 킥보드가 감지되었습니다"
        />
        {(selectedKickBoardData !== null && !isTowing) ||
        isOnlyTowableKickBoardVisible ? (
          <div
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
                if (selectedKickBoardData !== null && !isTowing) {
                  setSelectedKickBoardData(null);
                  setIsKickBoardVisible(true);
                  dispatch(areaActions.setNearestArea(null));
                }
                setIsOnlyTowableKickBoardVisible(false);
                setIsNotificationVisible(true);
              }}
            >
              돌아가기
            </TopButton>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: isNotificationVisible
                ? 'calc(env(safe-area-inset-top) + 16px + 56px)'
                : 0,
              left: 'env(safe-area-inset-left)',
              padding: '24px',
              transition: 'top 0.2s',
            }}
          >
            <TopButton
              onClick={() => {
                setIsKickBoardVisible(
                  isKickBoardVisible => !isKickBoardVisible,
                );
              }}
              style={{
                backgroundColor: isKickBoardVisible ? '#6a26ff' : undefined,
                color: isKickBoardVisible ? '#ffffff' : undefined,
              }}
            >
              킥보드
            </TopButton>
          </div>
        )}
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
        {selectedKickBoardData === null || nearestArea === null ? (
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
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '12px',
              position: 'absolute',
              bottom: 'env(safe-area-inset-bottom)',
              width: '100%',
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '12px 12px 0 0',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
            }}
          >
            {isTowing ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '16px',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f4f8',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5f6368"
                  >
                    <path d="M240-120v-720h280q100 0 170 70t70 170q0 100-70 170t-170 70H400v240H240Zm160-400h128q33 0 56.5-23.5T608-600q0-33-23.5-56.5T528-680H400v160Z" />
                  </svg>
                  <div>{nearestArea.name}</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    padding: '16px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div>남은 시간</div>
                    <div>
                      {Math.floor(timer / 60) === 0
                        ? timer
                        : `${Math.floor(timer / 60)}:${`0${timer % 60}`.slice(
                            -2,
                          )}`}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div>남은 거리</div>
                    <div>{distance}m</div>
                  </div>
                </div>
                <BottomButton
                  whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  onClick={() => {
                    endTow();
                  }}
                >
                  견인 종료하기
                </BottomButton>
              </>
            ) : (
              <>
                <div style={{ fontSize: '12px', textAlign: 'center' }}>
                  목표 주차 권장 구역
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '16px',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f4f8',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5f6368"
                  >
                    <path d="M240-120v-720h280q100 0 170 70t70 170q0 100-70 170t-170 70H400v240H240Zm160-400h128q33 0 56.5-23.5T608-600q0-33-23.5-56.5T528-680H400v160Z" />
                  </svg>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: '8px',
                    }}
                  >
                    <div>60주년기념관 주변</div>
                    <div
                      style={{
                        display: 'flex',
                        columnGap: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <div>견인 거리 21m</div>
                      <div>견인 시간 2분</div>
                    </div>
                  </div>
                </div>
                <BottomButton
                  whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  onClick={() => {
                    startTow();
                  }}
                >
                  견인 시작하기
                </BottomButton>
              </>
            )}
          </div>
        )}
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

const TempButton = styled(Button)`
  width: calc(100% - 2 * 24px);
  padding: 12px 12px;
  background-color: #ebe8f1;
  border-radius: 12px;
`;
