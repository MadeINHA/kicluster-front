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
import { kickBoardActions } from 'slices/kickBoard';
import { checkKickBoardsTow } from 'api/kickBoard';
import TowFailureScreen from 'app/components/TowFailureScreen';

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
  const [isTowFailureStackVisible, setIsTowFailureStackVisible] =
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
  const [temp, setTemp] = useState<null | {
    id: number;
    lat: number;
    lng: number;
  }>(null);

  const { mapRef } = useMap();
  useRecommendedAreas(mapRef, isAreasVisible);
  useProhibitedAreas(mapRef, isAreasVisible);
  useExistingAreas(mapRef, isAreasVisible);
  useNearestArea(mapRef);
  useKickBoards(mapRef, kickBoardVisibility.kickBoard);
  const { selectedRedKickBoard, resetSelectedRedKickBoard } = useRedKickBoards(
    mapRef,
    kickBoardVisibility.redKickBoard,
    setTemp,
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
    if (!selectedRedKickBoard || !nearestArea) return;
    setIsLoadingScreenVisible(true);
    dispatch(
      kickBoardActions.lentKickBoardsTow({
        kickBoardId: selectedRedKickBoard.kickboardId,
        path: [...nearestArea.path, nearestArea.path[0]],
        callback() {
          setIsLoadingScreenVisible(false);
          setIsAreasVisible(true);
          setIsTowing(true);
          setTimer(
            (Math.floor(
              getDistance(
                selectedRedKickBoard?.lat ?? 0,
                selectedRedKickBoard?.lng ?? 0,
                nearestArea.center.lat,
                nearestArea.center.lng,
              ) * 24,
            ) +
              1) *
              60,
          );
          // mapRef.current?.setZoom(18, true);
          // mapRef.current?.setOptions('draggable', false);
          // mapRef.current?.setOptions('maxZoom', 18);
          // mapRef.current?.setOptions('minZoom', 18);
          mapRef.current?.setCenter({
            lat: selectedRedKickBoard.lat ?? 0,
            lng: selectedRedKickBoard.lng ?? 0,
          });
          // const a = {
          //   lat: selectedRedKickBoard.lat,
          //   lng: selectedRedKickBoard.lng,
          // };
          // const b = {
          //   lat: nearestArea.center.lat,
          //   lng: nearestArea.center.lng,
          // };
          // let c = 1;
          setDistance(
            Math.floor(
              getDistance(
                selectedRedKickBoard?.lat ?? 0,
                selectedRedKickBoard?.lng ?? 0,
                nearestArea.center.lat,
                nearestArea.center.lng,
              ) * 1000,
            ),
          );
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
        },
      }),
    );
  };

  const endTow = () => {
    if (!selectedRedKickBoard) return;
    setIsLoadingScreenVisible(true);
    checkKickBoardsTow(
      selectedRedKickBoard.kickboardId,
      temp?.lat ?? selectedRedKickBoard.lat,
      temp?.lng ?? selectedRedKickBoard.lng,
    ).then(res => {
      if (res.data.data) {
        dispatch(
          kickBoardActions.returnKickBoardsTow({
            id: selectedRedKickBoard.kickboardId,
            lat: temp?.lat ?? selectedRedKickBoard.lat,
            lng: temp?.lng ?? selectedRedKickBoard.lng,
            callback() {
              setIsTowSuccessStackVisible(true);
              setIsLoadingScreenVisible(false);
            },
          }),
        );
      } else if (
        window.confirm(
          '해당 구역은 목표 구역이 아닙니다. 그래도 반납하시겠습니까?',
        )
      ) {
        dispatch(
          kickBoardActions.returnKickBoardsTow({
            id: selectedRedKickBoard.kickboardId,
            lat: temp?.lat ?? selectedRedKickBoard.lat,
            lng: temp?.lng ?? selectedRedKickBoard.lng,
            callback() {
              setIsTowFailureStackVisible(true);
              setIsLoadingScreenVisible(false);
            },
          }),
        );
      } else {
        setIsLoadingScreenVisible(false);
      }
    });
  };

  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

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
            window.location.reload();
            // mapRef.current?.setOptions('draggable', true);
            // mapRef.current?.setOptions('maxZoom', undefined);
            // mapRef.current?.setOptions('minZoom', undefined);
            // setIsTowSuccessStackVisible(false);
            // resetSelectedRedKickBoard();
            // setKickBoardVisibility({ kickBoard: true, redKickBoard: true });
            // dispatch(areaActions.setNearestArea(null));
          }}
        />
        <TowFailureScreen
          isVisible={isTowFailureStackVisible}
          onButtonClick={() => {
            window.location.reload();
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
          {isTowing ? null : selectedRedKickBoard ? (
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
            bottom: 'calc(64px + 32px + env(safe-area-inset-bottom))',
            right: 'env(safe-area-inset-right)',
            padding: '0 16px',
            zIndex: nearestArea ? 0 : 1,
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
        {nearestArea ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '16px',
              position: 'absolute',
              bottom: 'calc(0px - env(safe-area-inset-bottom))',
              width: '100%',
              padding:
                '16px 16px calc(env(safe-area-inset-bottom) + 32px) 16px',
              backgroundColor: '#ffffff',
              borderRadius: '12px 12px 0 0',
              boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.2)',
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
                    backgroundColor: '#eeeeee',
                    borderRadius: '12px',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#515151"
                  >
                    <path d="M380-380v180q0 24.54-17.54 42.27Q344.92-140 320-140q-24.54 0-42.27-17.73Q260-175.46 260-200v-560q0-24.54 17.73-42.27Q295.46-820 320-820h200q91.15 0 155.58 64.42Q740-691.15 740-600t-64.42 155.58Q611.15-380 520-380H380Zm0-120h144.92q41.08 0 70.54-29.46 29.46-29.46 29.46-70.54 0-41.08-29.46-70.54Q566-700 524.92-700H380v200Z" />
                  </svg>
                  <div>
                    {nearestArea.name === '새로운 주차 구역'
                      ? '임시 주차 구역'
                      : nearestArea.name}
                  </div>
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
                  whileTap={{ scale: 0.95, backgroundColor: '#00BBA9' }}
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
                <div style={{ textAlign: 'center', fontWeight: 500 }}>
                  목표 주차 권장 구역
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '16px',
                    padding: '16px 32px',
                    backgroundColor: '#eeeeee',
                    borderRadius: '12px',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#515151"
                  >
                    <path d="M380-380v180q0 24.54-17.54 42.27Q344.92-140 320-140q-24.54 0-42.27-17.73Q260-175.46 260-200v-560q0-24.54 17.73-42.27Q295.46-820 320-820h200q91.15 0 155.58 64.42Q740-691.15 740-600t-64.42 155.58Q611.15-380 520-380H380Zm0-120h144.92q41.08 0 70.54-29.46 29.46-29.46 29.46-70.54 0-41.08-29.46-70.54Q566-700 524.92-700H380v200Z" />
                  </svg>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: '8px',
                    }}
                  >
                    <div>
                      {nearestArea.name === '새로운 주차 구역'
                        ? '임시 주차 구역'
                        : nearestArea.name}
                    </div>
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
                  whileTap={{ scale: 0.95, backgroundColor: '#00BBA9' }}
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
              justifyContent: 'space-evenly',
              position: 'absolute',
              bottom: 'calc(0px - env(safe-area-inset-bottom))',
              width: '100%',
              padding:
                '16px 16px calc(env(safe-area-inset-bottom) + 16px) 16px',
              backgroundColor: '#04D9C4',
              boxShadow: '0px 0px 30px 0px rgba(4, 217, 196, 0.2)',
              fontWeight: 500,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: '8px',
                width: '100%',
                color: '#ffffff',
              }}
            >
              <div>MadeINHA</div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundImage: `url(${require('../../../resources/images/bi-no-background.png')})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                }}
              />
              <div>Kicluster</div>
            </div>
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
  background-color: #04d9c4;
  border-radius: 12px;
  box-shadow: 0 5px 7.5px 0 rgba(4, 217, 196, 0.2);
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
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
