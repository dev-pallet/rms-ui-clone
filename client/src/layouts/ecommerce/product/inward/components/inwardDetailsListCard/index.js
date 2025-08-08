import './inwardDetailsCard.css';
import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import clsx from 'clsx';

const InwardDetailCard = ({ data }) => {

  return (
    <SoftBox className="main-po-card-wrapper po-box-shadow" sx={{marginBottom: '10px !important'}}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>
            {data.item}
          </Typography>
          <Typography fontSize="12px">Id: {data.id} </Typography>
        </Stack>
        <Typography
          fontSize="12px"
          className={clsx('inward-status-mob', {
            'inward-details-received': data.status === 'RECEIVED',
            'inward-details-partially': data.status === 'PARTIALLY_RECEIVED',
          })}
        >
          {data.status}
        </Typography>
        <Typography fontSize="14px">Qty: {data.quantity}</Typography>
      </Stack>
      <Divider
        sx={{
          margin: '5px 0px !important',
        }}
      />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Batch</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data.batch}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Expiry Date</Typography>
          <Typography fontSize="14px" fontWeight={700} textAlign="end">
            {data.createdOn}
          </Typography>
        </Stack>
      </Stack>
    </SoftBox>
  );
};

export default InwardDetailCard;
