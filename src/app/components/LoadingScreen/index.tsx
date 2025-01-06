import { motion } from 'motion/react';

export default function LoadingScreen({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      style={{
        display: isVisible ? 'flex' : 'none',
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
  );
}
