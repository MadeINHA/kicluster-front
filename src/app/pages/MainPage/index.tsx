import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { motion } from 'motion/react';
import useMap from 'hooks/useMap';
import useData from 'hooks/useData';
import useRecommendedAreas from 'hooks/useRecommendedAreas';
import useProhibitedAreas from 'hooks/useProhibitedAreas';
import useExistingAreas from 'hooks/useExistingAreas';
import Notification from 'app/components/Notification';
import useKickBoards from 'hooks/useKickBoards';
import useRedKickBoards from 'hooks/useRedKickBoards';
import LoadingScreen from 'app/components/LoadingScreen';
import TowSuccessScreen from 'app/components/TowSuccessScreen';

// const UPDATE_TIME_INTERVAL = 30000;

export function MainPage() {
  const { getDynamicData } = useData();

  const [isKickBoardVisible, setIsKickBoardVisible] = useState(true);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);
  const [isRedKickBoardVisible, setIsRedKickBoardVisible] = useState(true);
  const [isTowSuccessStackVisible, setIsTowSuccessStackVisible] =
    useState(false);
  // const [isTowFailureStackVisible, setIsTowFailureStackVisible] =
  //   useState(false);

  const { mapRef, goToMyLocation } = useMap();
  useRecommendedAreas(mapRef);
  useProhibitedAreas(mapRef);
  useExistingAreas(mapRef);
  useKickBoards(mapRef, isKickBoardVisible);
  useRedKickBoards(mapRef, isRedKickBoardVisible);
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
