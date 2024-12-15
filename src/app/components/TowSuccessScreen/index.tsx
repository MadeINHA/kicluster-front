export default function TowSuccessScreen() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        position: 'absolute',
        top: 0,
        // right: isTowSuccessStackVisible ? 0 : '-100%',
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
        {/* {isTowSuccessStackVisible ? (
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
        ) : null} */}
      </div>

      {/* <TempButton
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
      </TempButton> */}
    </div>
  );
}
