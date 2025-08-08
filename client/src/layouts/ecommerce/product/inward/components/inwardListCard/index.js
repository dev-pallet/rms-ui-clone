import './inward-list-card.css';
import { Divider, Stack, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import clsx from 'clsx';

const InwardListCard = ({ data }) => {
  const navigate = useNavigate();
  const is340px = useMediaQuery('(max-width: 340px)');
  const navigateToDeatilsPage = (id) => {
    navigate(`/products/inwarddetails/${id}`);
  };
  return (
    <SoftBox className="main-po-card-wrapper po-box-shadow" onClick={()=>navigateToDeatilsPage(data.id)}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>
            {data.id}
          </Typography>
          <Typography fontSize="12px">PO#: {data.ponumber}</Typography>
        </Stack>
        <Typography
          fontSize="12px"
          className={clsx('inward-status-mob', {
            'Inward-approve-mob': data.status === 'STARTED',
            'Inward-closed-mob': data.status === 'CLOSED',
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
          <Typography fontSize="12px">Started At</Typography>
          <Typography fontSize="14px" fontWeight={700} width={`${is340px ? '100%' : '70%'}`}>
            {data.createdOn}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Ended At</Typography>
          <Typography fontSize="14px" fontWeight={700} textAlign="end" width={`${is340px ? '100%' : '70%'}`}>
            {data.endedOn}
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
            {data.vendor}
          </Typography>
        </Stack>
      </Stack>
    </SoftBox>
  );
};

export default InwardListCard;
