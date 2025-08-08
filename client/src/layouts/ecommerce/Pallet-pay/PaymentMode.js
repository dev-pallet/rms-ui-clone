import { Box } from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import amexLogo from './components/assets/Amex.svg';
import mastercardLogo from './components/assets/mastercard.svg';
import rupayLogo from './components/assets/rupay.svg';
import sodexoLogo from './components/assets/sodexo.svg';
import upiLogo from './components/assets/upi.svg';
import visaLogo from './components/assets/visa.svg';

const PaymentMode = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftTypography
        sx={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Payment Modes
      </SoftTypography>
      <SoftBox className="mdr-details">
        <Box className="payment-mode">
          <Box className="payment-activated">
            <Box className="payment-mode-card-logo">
              <img src={mastercardLogo} className="payment-logo" />
            </Box>
          </Box>
          <Box className="payment-activated-btn">
            <SoftButton className="activated">Activated</SoftButton>
          </Box>
        </Box>
        <Box className="payment-mode">
          <Box className="payment-activated">
            <Box className="payment-mode-card-logo">
              <img src={visaLogo} className="payment-logo" />
            </Box>
          </Box>
          <Box className="payment-activated-btn">
            <SoftButton className="activated">Activated</SoftButton>
          </Box>
        </Box>
        <Box className="payment-mode">
          <Box className="payment-activated">
            <Box className="payment-mode-card-logo">
              <img src={upiLogo} className="payment-logo" />
            </Box>
          </Box>
          <Box className="payment-activated-btn">
            <SoftButton className="activated">Activated</SoftButton>
          </Box>
        </Box>
        <Box className="payment-mode">
          <Box className="payment-activated">
            <Box className="payment-mode-card-logo">
              <img src={rupayLogo} className="payment-logo" />
            </Box>
          </Box>
          <Box className="payment-activated-btn">
            <SoftButton className="activated">Activated</SoftButton>
          </Box>
        </Box>
        <Box className="payment-mode">
          <Box className="payment-not-activated">
            <Box className="payment-mode-card-logo">
              <img src={sodexoLogo} className="payment-logo" />
            </Box>
          </Box>
          <Box className="payment-not-activated-btn">
            <SoftButton>Activate</SoftButton>
          </Box>
        </Box>
        <Box className="payment-mode">
          <Box className="payment-not-activated">
            <Box className="payment-mode-card-logo">
              <img src={amexLogo} className="payment-logo" />
            </Box>
          </Box>
          <Box className="payment-not-activated-btn">
            <SoftButton>Activate</SoftButton>
          </Box>
        </Box>
      </SoftBox>
    </DashboardLayout>
  );
};

export default PaymentMode;
