import '../../totalTransaction.css';
import { Box } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../components/SoftTypography';

const TransactionDetails = ({ transactionIdDetails }) => {
  const {
    externalRefNumber,
    amount,
    totalAmount,
    nameOnCard,
    paymentCardType,
    paymentCardBrand,
    paymentMode,
    createdTime,
    status,
    terminalName,
    cashierDetails,
    orderDetails,
  } = transactionIdDetails;


  const convertEpochTimestampMsToLocalDate = (epochTimestampMs) => {
    const date = new Date(parseInt(epochTimestampMs));
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}   ${hours12}:${minutes}:${seconds} ${ampm}`;
    // console.log('formattedDate', typeof formattedDate, formattedDate);
    return formattedDate;
  };

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
        <SoftTypography className="header-text">Amount Paid</SoftTypography>
        <SoftTypography className="header-subtext">₹{amount}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Order Code</SoftTypography>
        <SoftTypography className="header-subtext">{externalRefNumber}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Card Name</SoftTypography>
        <SoftTypography className="header-subtext">{nameOnCard !== null ? nameOnCard:'---'}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Card Type</SoftTypography>
        <SoftTypography className="header-subtext">{paymentCardType !== null ?paymentCardType :'---'}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Card Brand</SoftTypography>
        <SoftTypography className="header-subtext">{paymentCardBrand !== null ?paymentCardBrand :'---'}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Payment Mode</SoftTypography>
        <SoftTypography className="header-subtext">{paymentMode !== null ?paymentMode:'---'}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Transaction Time</SoftTypography>
        <SoftTypography className="header-subtext">{convertEpochTimestampMsToLocalDate(createdTime)}</SoftTypography>
      </Box>
      <Box className="transaction-flex">
        <SoftTypography className="header-text">Status</SoftTypography>
        <SoftTypography className="header-subtext">{status !== null ? status :'---' }</SoftTypography>
      </Box>
      {terminalName !== null ? (
        <Box className="transaction-flex">
          <SoftTypography className="header-text">Terminal Name</SoftTypography>
          <SoftTypography className="header-subtext">{terminalName !== null ? terminalName :'---'}</SoftTypography>
        </Box>
      ) : null}
      {cashierDetails !== null ? (
        <Box className="transaction-flex">
          <SoftTypography className="header-text">Cashier Details</SoftTypography>
          <SoftTypography className="header-subtext">{cashierDetails.name}</SoftTypography>
        </Box>
      ) : null}
      {orderDetails !== null ? (
        <Box className="transaction-flex">
          <SoftTypography className="header-text">Order Details</SoftTypography>
          <SoftTypography className="header-subtext">{orderDetails.orderId}</SoftTypography>
          <SoftTypography className="header-subtext">{orderDetails.amount}</SoftTypography>
          <SoftTypography className="header-subtext">{orderDetails.orderStatus}</SoftTypography>
        </Box>
      ) : null}
    </SoftBox>
  );
};

export default TransactionDetails;
