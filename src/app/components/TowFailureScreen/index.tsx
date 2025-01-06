import { motion } from 'motion/react';
import styled from 'styled-components/macro';

export default function TowFailureScreen({
  isVisible,
  onButtonClick,
}: {
  isVisible: boolean;
  onButtonClick: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        position: 'absolute',
        top: 0,
        right: isVisible ? undefined : '-100%',
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
        <div style={{ fontSize: '24px', fontWeight: 500 }}>
          견인을 포기하였습니다.
        </div>
        <div
          style={{
            width: '72px',
            height: '72px',
            backgroundImage: `url(${require('../../../resources/images/crying_face.png')})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          }}
        />
      </div>

      <TempButton
        whileTap={{ scale: 0.95, backgroundColor: '#00BBA9' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={onButtonClick}
      >
        돌아가기
      </TempButton>
    </div>
  );
}

const TempButton = styled(motion.div)`
  box-shadow: 0px 5px 7.5px 0px rgba(0, 0, 0, 0.2);
  color: #515151;
  font-size: 18px;
  text-align: center;

  & > svg {
    fill: #515151;
  }
  width: calc(100% - 2 * 16px);
  padding: 12px 12px;
  background-color: #04d9c4;
  border-radius: 12px;
  box-shadow: 0 5px 7.5px 0 rgba(4, 217, 196, 0.2);
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
`;
