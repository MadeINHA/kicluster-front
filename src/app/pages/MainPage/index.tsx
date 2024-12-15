import { useState } from 'react';
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
import useNearestArea from 'hooks/useNearestArea';
import Notification from 'app/components/Notification';
import useKickBoards from 'hooks/useKickBoards';
import useRedKickBoards from 'hooks/useRedKickBoards';
import LoadingScreen from 'app/components/LoadingScreen';
import TowSuccessScreen from 'app/components/TowSuccessScreen';
import TopButton from 'app/components/TopButton';

// const UPDATE_TIME_INTERVAL = 30000;

export function MainPage() {
  const dispatch = useDispatch();

  const { getDynamicData } = useData();

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);
  const [isTowSuccessStackVisible, setIsTowSuccessStackVisible] =
    useState(false);
  const [isAreasVisible, setIsAreasVisible] = useState(true);
  const [kickBoardVisibility, setKickBoardVisibility] = useState({
    kickBoard: true,
    redKickBoard: true,
  });
  const [isRawSelection, setIsRawSelection] = useState(false);
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
    // setIsOnlyTowableKickBoardVisible(true);
    // setIsNotificationVisible(false);
  };

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
            setIsNotificationVisible(true);
          }}
        />
        <Notification
          onClick={readyForTow}
          isVisible={isNotificationVisible}
          message="불량 주차된 킥보드가 감지되었습니다"
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: isNotificationVisible
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
