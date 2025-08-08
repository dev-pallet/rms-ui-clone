import './putaway-card.css';
import { Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import clsx from 'clsx';

const PutAwayCardList = ({ data }) => {
  const navigate = useNavigate();

  const navigateToDetailsPage = (data) => {
    const sessionId = data.id;
    const poNumber = data.inwardRequestNo;
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('poNumber', poNumber);
    navigate('/products/putaway');
  };

  return (
    <SoftBox className="main-po-card-wrapper po-box-shadow" onClick={()=>navigateToDetailsPage(data)}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>
            {data.id}
          </Typography>
          {/* <Typography fontSize="12px">Req#: {data.inwardRequestNo} </Typography> */}
        </Stack>
        <Typography
          fontSize="12px"
          className={clsx('inward-status-mob', {
            'PutAway-complete-mob': data.status === 'COMPLETED',
            'PutAway-open-mob': data.status === 'OPEN',
            'PutAway-reject-mob': data.status === 'REJECTED',
            'PutAway-create-mob': data.status === 'CREATED',
            'PutAway-assign-mob': data.status === 'IN_TRANSIT',
          })}
        >
          {data.status}
        </Typography>
        {/* <Typography fontSize="11px">17 Oct 2023</Typography> */}
      </Stack>
      <Divider
        sx={{
          margin: '5px 0px !important',
        }}
      />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Request No.</Typography>
          <Typography fontSize="14px" fontWeight={700} >
            {data.inwardRequestNo}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Putaway By</Typography>
          <Typography fontSize="14px" fontWeight={700} textAlign="end">
            {data.putAwayByName}
          </Typography>
        </Stack>
      </Stack>
      <Divider
        sx={{
          margin: '5px 0px !important',
        }}
      />

      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Vendor Name</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data.vendorName}
          </Typography>
        </Stack>
      </Stack>
    </SoftBox>
  );
};

export default PutAwayCardList;
