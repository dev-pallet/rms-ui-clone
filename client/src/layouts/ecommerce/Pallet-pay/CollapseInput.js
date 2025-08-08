import { Box } from '@mui/material';
import { useRef } from 'react';
import React from 'react';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from '../../../components/SoftTypography';

function CollapseInput({ data, title, handleEditRate, key, index }) {
  const inputRef = useRef(null);

  const handleInputFocus = () => {
    inputRef.current.focus();
  };
  const nameInLowerCase = (str) => {
    return str
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
  };

  return (
    <Box className="debit-transaction-charges">
      <Box className="transaction-description">
        <Box className="paymentCard-logo">
          <img src={data.logoUrl} className="payment-logo" />
        </Box>
        {parseInt(data.endAmount) === 2000 ? (
          <SoftTypography className="transaction-rate">
            {nameInLowerCase(data.cardType)} &nbsp;
            {title} less than Rs 2000{' '}
          </SoftTypography>
        ) : (
          <SoftTypography className="transaction-rate" sx={{ marginLeft: '2rem' }}>
            {nameInLowerCase(data.cardType)} &nbsp;
            {title} more than Rs 2000{' '}
          </SoftTypography>
        )}
      </Box>
      <Box className="transaction-charges">
        <SoftInput
          value={
            data.merchantRate == 'string'|| null || 'NA'
              ? // || data.merchantRate.length == 0
              data.rate
              : data.merchantRate
          }
          //   value={data.rate}
          type="number"
          sx={{
            width: '6rem !important',
          }}
          ref={inputRef}
          onChange={(e) => {
            handleInputFocus();
            handleEditRate(e, index);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onKeyUp={(e) => {
            e.stopPropagation();
          }}
          onKeyPress={(e) => {
            e.stopPropagation();
          }}
        />
      </Box>
    </Box>
  );
}

export default CollapseInput;
