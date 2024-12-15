import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { motion } from 'motion/react';
import useMap from 'hooks/useMap';
import useData from 'hooks/useData';
import useRecommendedAreas from 'hooks/useRecommendedAreas';
import useProhibitedAreas from 'hooks/useProhibitedAreas';
import useExistingAreas from 'hooks/useExistingAreas';
import useKickBoards from 'hooks/useKickBoards';
import useRedKickBoards from 'hooks/useRedKickBoards';

// const UPDATE_TIME_INTERVAL = 30000;

export function MainPage() {
  const { getDynamicData } = useData();

  const [isKickBoardVisible, setIsKickBoardVisible] = useState(true);
  const [isRedKickBoardVisible, setIsRedKickBoardVisible] = useState(true);

  const { mapRef, goToMyLocation } = useMap();
  useRecommendedAreas(mapRef);
  useProhibitedAreas(mapRef);
  useExistingAreas(mapRef);
  useKickBoards(mapRef, isKickBoardVisible);
  useRedKickBoards(mapRef, isRedKickBoardVisible);

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
