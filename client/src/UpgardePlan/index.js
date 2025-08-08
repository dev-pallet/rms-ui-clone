import React from 'react';
import { Box } from '@mui/material';
import SoftTypography from '../components/SoftTypography';
import SoftButton from '../components/SoftButton';
import upgrade from './assets/TimeToUpgrade.svg';
import './upgrade.css';
import { useNavigate } from 'react-router-dom';

const UpgradePlan = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricingPage');
  };

  return (
    <Box className="overlay-div-upgrade-plan">
      <Box className="upgrade-img">
        <img src={upgrade} className="upgrade-img-view" />
      </Box>
      <Box className="upgrade-details">
        <SoftTypography
          sx={{
            fontWeight: 'bold',
          }}
          className="upgrade-details-title"
        >
          Dear User
        </SoftTypography>
        <SoftTypography>For more features and a better user experience, please upgrade your plan.</SoftTypography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SoftButton
            sx={{
              backgroundColor: '#0562FB',
              color: '#FFFFFF',
              marginTop: '2rem',
              width: '10rem',
              '&:hover': {
                color: 'black !important',
              },
            }}
            onClick={handleUpgrade}
          >
            Upgrade
          </SoftButton>
        </Box>
      </Box>
    </Box>
  );
};

export default UpgradePlan;
