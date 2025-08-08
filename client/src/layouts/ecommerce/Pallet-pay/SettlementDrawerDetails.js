import { Box } from '@mui/material';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';

const SettlementDrawerDetails = ({ settlementDetails }) => {
  const { settlementAmount, transactionCharges, rate, calculatedOn, paymentMethod, cardType, cardBrand } =
    settlementDetails;

  return (
    <SoftBox
      className="transaction-details"
      sx={{
        padding: '1rem',
      }}
    >
      <Box
        className="transaction-flex"
        sx={{
          marginTop: '0',
        }}
      >
        <SoftTypography className="header-text">Settlement Amount</SoftTypography>
        <SoftTypography className="header-subtext">
          ₹{settlementAmount !== null ? settlementAmount : '---'}
        </SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Transaction Charges</SoftTypography>
        <SoftTypography className="header-subtext">
          ₹{transactionCharges !== null ? transactionCharges : '---'}
        </SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Rate</SoftTypography>
        <SoftTypography className="header-subtext">{rate !== null ? rate : '---'}%</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Payment Method</SoftTypography>
        <SoftTypography className="header-subtext">{paymentMethod !== null ? paymentMethod : '---'}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Card Type</SoftTypography>
        <SoftTypography className="header-subtext">{cardType !== null ? cardType : '---'}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Card Brand</SoftTypography>
        <SoftTypography className="header-subtext">{cardBrand !== null ? cardBrand : '---'}</SoftTypography>
      </Box>
    </SoftBox>
  );
};

export default SettlementDrawerDetails;
