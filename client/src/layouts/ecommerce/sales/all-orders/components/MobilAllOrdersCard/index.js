import './all-orders-card.css';
import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';

const MobileCardAllOrders = ({product,navigateToDetailsPage}) => {
  return (
    <Stack className='all-order-card-main-div po-box-shadow' onClick={()=>navigateToDetailsPage(product?.orderNumber)}>
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>{product?.orderNumber}</Typography>
          <Typography fontSize="12px" sx={{color: 'gray !important'}}>{product?.createdDate}</Typography>
        </Stack>
        <Typography fontSize="14px" className={`sales-order-fulfill-common ${product?.fulfilmentStatus === 'DELIVERED' ? 'sales-order-delivered' : 'sales-order-completed'}`}>{product?.fulfilmentStatus}</Typography>
      </Stack>
      <Divider sx={{margin: '5px !important'}} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px" >Total Items</Typography>
          <Typography fontSize="14px" fontWeight={700}>{product?.totalItems}</Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px" >Total Amount</Typography>
          <Typography fontSize="14px" fontWeight={700}>{product?.grandTotal}</Typography>
        </Stack>
      </Stack>
      <Divider sx={{margin: '5px 0px !important'}} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px" >Channel</Typography>
          <Typography fontSize="14px" fontWeight={700}>{product?.salesChannel}</Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px" >Payment Status</Typography>
          <Typography fontSize="14px" fontWeight={700}>{product?.paymentStatus}</Typography>
        </Stack>
      </Stack>
      <Divider sx={{margin: '5px 0px !important'}} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px" >Customer</Typography>
          <Typography fontSize="14px" fontWeight={700}>{product?.customerName}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MobileCardAllOrders;