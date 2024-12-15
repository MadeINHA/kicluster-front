import { motion } from 'motion/react';
import styled from 'styled-components/macro';

export default function TowSuccessScreen({
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
        <div style={{ fontSize: '24px' }}>견인이 완료되었습니다.</div>
        {isVisible ? (
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
              backgroundImage: `url(${require('../../../resources/images/party_popper.png')})`,
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
        onClick={onButtonClick}
      >
        돌아가기
      </TempButton>
    </div>
  );
}

const TempButton = styled(motion.div)`
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16);
  color: #12052e;
  font-size: 18px;
  text-align: center;

  width: calc(100% - 2 * 24px);
  padding: 12px 12px;
  background-color: #ebe8f1;
  border-radius: 12px;
`;
