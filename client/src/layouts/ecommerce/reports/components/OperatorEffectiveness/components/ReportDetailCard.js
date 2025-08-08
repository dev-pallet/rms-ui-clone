import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';

const ReportDetailCard = ({ data, id }) => {
  return (
    <div>
      <SoftBox className="main-po-card-wrapper po-box-shadow" sx={{ marginBottom: '10px !important' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack alignItems="flex-start">
            <Typography fontSize="14px" fontWeight={700}>
              {data?.sessionId}
            </Typography>
            <Typography fontSize="12px">License Id: {data?.licenseId} </Typography>
          </Stack>
          <Typography fontSize="14px">Day Id: {data?.dayId}</Typography>
        </Stack>
        <Divider
          sx={{
            margin: '5px 0px !important',
          }}
        />
        <Stack direction="row" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Role</Typography>
            <Typography fontSize="14px" fontWeight={700}>
              {data?.role}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Cashier Name</Typography>
            <Typography fontSize="14px" fontWeight={700} textAlign="end">
              {data?.cashierName}
            </Typography>
          </Stack>
        </Stack>
        {id === 'CART_DELETED' || id === 'CART_HOLD' || id === 'CART_ITEM_REMOVED' ? (
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Cart Id</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.cartId}
              </Typography>
            </Stack>
          </Stack>
        ) : id === 'ORDER_EDITED' || id === 'ORDER_RECEIPT_REPRINT' ? (
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Order Id</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.orderId}
              </Typography>
            </Stack>
          </Stack>
        ) : id === 'LOYALTY_AWARDED' ? (
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Cart Id</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.cartId}
              </Typography>
            </Stack>
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Order Id</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.orderId}
              </Typography>
            </Stack>
          </Stack>
        ) : id === 'PAYMENT_MODE_CHANGE' ? (
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Terminal Id</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.terminalId}
              </Typography>
            </Stack>
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Approved By</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.approvedBy}
              </Typography>
            </Stack>
          </Stack>
        ) : null}
      </SoftBox>
    </div>
  );
};

export default ReportDetailCard;
