import { motion } from 'motion/react';
import styled from 'styled-components/macro';

const TopButton = styled(motion.div)`
  padding: 4px 16px;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: 0px 5px 7.5px 0px rgba(0, 0, 0, 0.2);
  color: #515151;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
`;

export default TopButton;
