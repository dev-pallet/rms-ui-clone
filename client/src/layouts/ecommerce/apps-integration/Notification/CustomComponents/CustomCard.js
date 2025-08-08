import React from 'react';

import { styled } from '@mui/material/styles';
import MainCard from '../../../../dashboard widgets/StockOverview/MainCard';
import  customClassNameStyles  from '../Notificationsettings.css';

const CustomCardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  minHeight: '8.5rem',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(210.04deg, rgb(144, 202, 249) -50.94%, rgba(144, 202, 249, 0) 83.49%)',
    borderRadius: '50%',
    top: -30,
    right: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)',
    borderRadius: '50%',
    top: -160,
    right: -130,
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(210.04deg, rgb(144, 202, 249) -50.94%, rgba(144, 202, 249, 0) 83.49%)',
    borderRadius: '50%',
    bottom: -30,
    left: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)',
    borderRadius: '50%',
    bottom: -160,
    left: -130,
  },
}));

const CustomClassNameStyles = styled('div')`
  ${customClassNameStyles};
`;

const CustomCard = ({ children, className }) => {
  return (
    <CustomCardWrapper className={className}>
      <CustomClassNameStyles>{children}</CustomClassNameStyles>
    </CustomCardWrapper>
  );
};
export default CustomCard;