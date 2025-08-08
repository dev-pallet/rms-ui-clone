import '../../totalTransaction.css';
import { Box } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../components/SoftTypography';

const MerchantDetails = ({ transactionIdDetails }) => {
  const { tid, receiptUrl, payerName } = transactionIdDetails;

  return (
    <SoftBox
      className="merchant-details"
      sx={{
        padding: '1rem',
      }}
    >
      <Box className="transaction-flex">
        <SoftTypography className="header-text">TID</SoftTypography>
        <SoftTypography className="header-subtext">{tid !== null || undefined ? tid : '---'}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Payer Name</SoftTypography>
        <SoftTypography className="header-subtext">
          {payerName !== null || undefined ? payerName : '---'}
        </SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Charge slip url </SoftTypography>
        <SoftTypography className="header-subtext">
          {receiptUrl !== null || undefined ? receiptUrl : '---'}
        </SoftTypography>
      </Box>
    </SoftBox>
  );
};

export default MerchantDetails;
