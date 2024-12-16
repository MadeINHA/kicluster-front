import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { motion } from 'motion/react';
import useMap from 'hooks/useMap';
import useData from 'hooks/useData';
import useRecommendedAreas from 'hooks/useRecommendedAreas';
import useProhibitedAreas from 'hooks/useProhibitedAreas';
import useExistingAreas from 'hooks/useExistingAreas';
import { areaActions } from 'slices/area';
import { selectNearestArea } from 'slices/area/selectors';
import useNearestArea from 'hooks/useNearestArea';
import Notification from 'app/components/Notification';
import useKickBoards from 'hooks/useKickBoards';
import useRedKickBoards from 'hooks/useRedKickBoards';
import LoadingScreen from 'app/components/LoadingScreen';
import TowSuccessScreen from 'app/components/TowSuccessScreen';
import TopButton from 'app/components/TopButton';
import { config } from 'config';
import getDistance from 'utils/getDistance';

// const UPDATE_TIME_INTERVAL = 30000;

export function MainPage() {
  const dispatch = useDispatch();

  const { getDynamicData } = useData();

  const nearestArea = useSelector(selectNearestArea);

  const polylineRef = useRef<null | naver.maps.Polyline>(null);

  const [isTowing, setIsTowing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);
  const [isTowSuccessStackVisible, setIsTowSuccessStackVisible] =
    useState(false);
  const [isAreasVisible, setIsAreasVisible] = useState(true);
  const [distance, setDistance] = useState(21);
  const [kickBoardVisibility, setKickBoardVisibility] = useState({
    kickBoard: true,
    redKickBoard: true,
  });
  const [isRawSelection, setIsRawSelection] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  // const [isTowFailureStackVisible, setIsTowFailureStackVisible] =
  //   useState(false);

  const { mapRef, goToMyLocation } = useMap();
  useRecommendedAreas(mapRef, isAreasVisible);
  useProhibitedAreas(mapRef, isAreasVisible);
  useExistingAreas(mapRef, isAreasVisible);
  useNearestArea(mapRef);
  useKickBoards(mapRef, kickBoardVisibility.kickBoard);
  const { selectedRedKickBoard, resetSelectedRedKickBoard } = useRedKickBoards(
    mapRef,
    kickBoardVisibility.redKickBoard,
  );

  const readyForTow = () => {
    setKickBoardVisibility({ kickBoard: false, redKickBoard: true });
    setNotificationMessage('');
  };

  // 견인이 필요한 킥보드들 중 하나를 선택했을 때
  useEffect(() => {
    if (selectedRedKickBoard) {
      dispatch(
        areaActions.getNearestArea({
          lat: selectedRedKickBoard.lat,
          lng: selectedRedKickBoard.lng,
        }),
      );
      if (kickBoardVisibility.kickBoard) {
        setIsRawSelection(true);
      }
      setIsAreasVisible(false);
      setKickBoardVisibility({ kickBoard: false, redKickBoard: false });
    }
  }, [dispatch, kickBoardVisibility.kickBoard, selectedRedKickBoard]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (nearestArea && selectedRedKickBoard) {
      mapRef.current.setCenter({
        lat: (nearestArea.center.lat + selectedRedKickBoard.lat) / 2,
        lng: (nearestArea.center.lng + selectedRedKickBoard.lng) / 2,
      });
      mapRef.current.setZoom(18, true);

      if (!polylineRef.current) {
        polylineRef.current = new naver.maps.Polyline({
          path: [],
          strokeColor: '#04D9C4',
          strokeWeight: 5,
          strokeLineJoin: 'round',
          strokeLineCap: 'round',
          zIndex: 1,
        });
      }
      polylineRef.current.setPath([
        {
          lat: selectedRedKickBoard.lat,
          lng: selectedRedKickBoard.lng,
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
  }, [mapRef, nearestArea, selectedRedKickBoard]);

  const startTow = () => {
    if (!selectedRedKickBoard) return;
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
      // mapRef.current?.setZoom(18, true);
      mapRef.current?.setOptions('draggable', false);
      mapRef.current?.setOptions('maxZoom', 18);
      mapRef.current?.setOptions('minZoom', 18);
      mapRef.current?.setCenter({
        lat: selectedRedKickBoard.lat ?? 0,
        lng: selectedRedKickBoard.lng ?? 0,
      });
      setIsLoadingScreenVisible(false);
      // const a = {
      //   lat: (
      //     selectedKickBoardData.marker.getPosition() as naver.maps.LatLng
      //   ).lat(),
      //   lng: (
      //     selectedKickBoardData.marker.getPosition() as naver.maps.LatLng
      //   ).lng(),
      // };
      // const b = [37.450535283273815, 126.65425341704302];
      // let c = 1;
      setDistance(21);
      // setInterval(() => {
      //   if (c === 6) return;
      //   selectedKickBoardData.marker.setPosition({
      //     lat: a.lat + ((b[0] - a.lat) / 5) * c,
      //     lng: a.lng - ((a.lng - b[1]) / 5) * c,
      //   });
      //   mapRef.current?.setCenter({
      //     lat: a.lat + ((b[0] - a.lat) / 5) * c,
      //     lng: a.lng - ((a.lng - b[1]) / 5) * c,
      //   });
      //   polylineRef.current?.setPath([
      //     {
      //       lat: a.lat + ((b[0] - a.lat) / 5) * c,
      //       lng: a.lng - ((a.lng - b[1]) / 5) * c,
      //     },
      //     { lat: b[0], lng: b[1] },
      //   ]);
      //   c++;
      // }, 700);
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
    const deviceId =
      localStorage.getItem('kiclusterDeviceId') ?? new Date().getTime();
    localStorage.setItem('kiclusterDeviceId', `${deviceId}`);

    const eventSource = new EventSource(
      `${config.apiUrl}/sse/subscribe/${deviceId}`,
    );

    eventSource.addEventListener('message', ({ data }) => {
      setNotificationMessage(data);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotificationMessage('');
    }, 7000);

    return () => {
      clearTimeout(timeout);
    };
  }, [notificationMessage]);

  return (
    <>
      <Helmet>
        <title>MainPage</title>
        <meta name="description" content="A Boilerplate application mainpage" />
      </Helmet>
      <Container>
        <Map id="map" />
        <LoadingScreen isVisible={isLoadingScreenVisible} />
        <TowSuccessScreen
          isVisible={isTowSuccessStackVisible}
          onButtonClick={() => {
            mapRef.current?.setOptions('draggable', true);
            mapRef.current?.setOptions('maxZoom', undefined);
            mapRef.current?.setOptions('minZoom', undefined);
            setIsTowSuccessStackVisible(false);
            resetSelectedRedKickBoard();
            setKickBoardVisibility({ kickBoard: true, redKickBoard: true });
            dispatch(areaActions.setNearestArea(null));
          }}
        />
        <Notification
          onClick={readyForTow}
          isVisible={!!notificationMessage}
          message={notificationMessage}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: notificationMessage
              ? 'calc(env(safe-area-inset-top) + 16px + 48px + 32px)'
              : '16px',
            left: 'env(safe-area-inset-left)',
            padding: '0 16px',
            transition: 'top 0.2s',
          }}
        >
          {selectedRedKickBoard ? (
            <TopButton
              onClick={() => {
                dispatch(areaActions.setNearestArea(null));
                resetSelectedRedKickBoard();
                setKickBoardVisibility({
                  kickBoard: isRawSelection,
                  redKickBoard: true,
                });
                setIsRawSelection(false);
                setIsAreasVisible(true);
              }}
            >
              돌아가기
            </TopButton>
          ) : !kickBoardVisibility.kickBoard &&
            kickBoardVisibility.redKickBoard ? (
            <TopButton
              onClick={() => {
                setKickBoardVisibility({ kickBoard: true, redKickBoard: true });
              }}
            >
              돌아가기
            </TopButton>
          ) : (
            <TopButton
              onClick={() => {
                setKickBoardVisibility(({ kickBoard }) => ({
                  kickBoard: !kickBoard,
                  redKickBoard: !kickBoard,
                }));
              }}
              style={{
                backgroundColor: kickBoardVisibility.kickBoard
                  ? '#04D9C4'
                  : undefined,
                boxShadow: kickBoardVisibility.kickBoard
                  ? '0px 5px 7.5px 0px rgba(4, 217, 196, 0.2)'
                  : undefined,
                color: kickBoardVisibility.kickBoard ? '#ffffff' : undefined,
              }}
            >
              킥보드
            </TopButton>
          )}
        </div>
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
        {nearestArea ? (
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
                    <div>임시 주차 구역</div>
                    <div
                      style={{
                        display: 'flex',
                        columnGap: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        견인 거리{' '}
                        {Math.floor(
                          getDistance(
                            selectedRedKickBoard?.lat ?? 0,
                            selectedRedKickBoard?.lng ?? 0,
                            nearestArea.center.lat,
                            nearestArea.center.lng,
                          ) * 1000,
                        )}
                        m
                      </div>
                      <div>
                        견인 시간{' '}
                        {Math.floor(
                          getDistance(
                            selectedRedKickBoard?.lat ?? 0,
                            selectedRedKickBoard?.lng ?? 0,
                            nearestArea.center.lat,
                            nearestArea.center.lng,
                          ) * 24,
                        ) + 1}
                        분
                      </div>
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
        ) : (
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
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;
`;

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
