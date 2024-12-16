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
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);
  // const [isTowFailureStackVisible, setIsTowFailureStackVisible] =
  //   useState(false);

  const { mapRef } = useMap();
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
    if (!notificationMessage) return;
    const timeout = setTimeout(() => {
      setNotificationMessage('');
    }, 7000);

    return () => {
      clearTimeout(timeout);
    };
  }, [notificationMessage]);

  useEffect(() => {
    if (!isRefreshDisabled) return;
    const timeout = setTimeout(() => {
      setIsRefreshDisabled(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isRefreshDisabled]);

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
              : 'calc(env(safe-area-inset-top) + 16px)',
            left: 'env(safe-area-inset-left)',
            padding: '0 16px',
            transition: 'top 0.2s',
          }}
        >
          {selectedRedKickBoard ? (
            <TopButton
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => {
                setKickBoardVisibility({ kickBoard: true, redKickBoard: true });
              }}
            >
              돌아가기
            </TopButton>
          ) : (
            <TopButton
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
            bottom: 'calc(64px + env(safe-area-inset-bottom))',
            right: 'env(safe-area-inset-right)',
            padding: '0 16px',
          }}
        >
          <IconButton
            whileTap={{ scale: 0.95, backgroundColor: '#04D9C4' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => {
              if (isRefreshDisabled) return;
              setIsRefreshDisabled(true);
              getDynamicData();
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0449 22.75C11.6021 22.75 9.53313 21.9025 7.83796 20.2075C6.1426 18.5126 5.29492 16.444 5.29492 14.0017C5.29492 11.5595 6.1426 9.49035 7.83796 7.79421C9.53313 6.09807 11.6021 5.25 14.0449 5.25C15.4089 5.25 16.6998 5.55324 17.9174 6.15971C19.1348 6.76638 20.1474 7.62232 20.9551 8.72754V6.125C20.9551 5.87708 21.039 5.66932 21.2068 5.50171C21.3746 5.3339 21.5825 5.25 21.8304 5.25C22.0785 5.25 22.2863 5.3339 22.4537 5.50171C22.6213 5.66932 22.7051 5.87708 22.7051 6.125V11.3301C22.7051 11.6289 22.6041 11.8794 22.402 12.0814C22.1998 12.2834 21.9494 12.3845 21.6507 12.3845H16.4456C16.1977 12.3845 15.9899 12.3007 15.822 12.133C15.6544 11.9652 15.5706 11.7573 15.5706 11.5092C15.5706 11.2612 15.6544 11.0535 15.822 10.8859C15.9899 10.7185 16.1977 10.6347 16.4456 10.6347H20.179C19.5641 9.50833 18.7115 8.62099 17.621 7.97271C16.5308 7.32424 15.3388 7 14.0449 7C12.1005 7 10.4477 7.68056 9.08659 9.04167C7.72548 10.4028 7.04492 12.0556 7.04492 14C7.04492 15.9444 7.72548 17.5972 9.08659 18.9583C10.4477 20.3194 12.1005 21 14.0449 21C15.4008 21 16.642 20.644 17.7686 19.9319C18.8952 19.2201 19.7488 18.2703 20.3292 17.0826C20.4398 16.8703 20.6025 16.7218 20.8171 16.6373C21.0318 16.5529 21.2505 16.548 21.4734 16.6227C21.7112 16.6975 21.8776 16.8531 21.9727 17.0893C22.0676 17.3258 22.0597 17.5502 21.9491 17.7625C21.2265 19.2731 20.16 20.482 18.7495 21.3891C17.339 22.2964 15.7708 22.75 14.0449 22.75Z"
                fill="#515151"
              />
            </svg>
          </IconButton>
        </div>
        {
          nearestArea ? (
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
          ) : null
          // <div
          //   style={{
          //     display: 'flex',
          //     columnGap: '12px',
          //     position: 'absolute',
          //     bottom: 'env(safe-area-inset-bottom)',
          //     width: '100%',
          //     padding: '24px',
          //     backgroundColor: '#ffffff',
          //     borderRadius: '12px 12px 0 0',
          //     boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
          //   }}
          // >
          //   <BottomButton
          //     whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
          //     transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          //   >
          //     주행 모드
          //   </BottomButton>
          //   <BottomButton
          //     whileTap={{ scale: 0.95, backgroundColor: '#6a26ff' }}
          //     transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          //   >
          //     견인 모드
          //   </BottomButton>
          // </div>
        }
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
  box-shadow: 0px 5px 7.5px 0px rgba(0, 0, 0, 0.2);
  color: #515151;
  font-size: 18px;
  text-align: center;

  & > svg {
    fill: #515151;
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
