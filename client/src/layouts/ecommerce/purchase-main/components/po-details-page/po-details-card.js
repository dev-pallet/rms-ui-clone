import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../components/SoftBox';

const PODetailsCard = ({ data, index }) => {
  return (
    <SoftBox className="pi-det-prdt-card-main-div" sx={{
      borderTop: index === 0 && 'none'
    }}>
      <Stack sx={{ width: '100%' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack>
            <Typography fontSize="14px" fontWeight="bold">
              {data.itemName}
            </Typography>
            <Typography fontSize="12px">GTIN: {data.itemNo}</Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Specification</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data.specification}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Unit Price</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data.unitPrice}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Purchase Price</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data.purchasePrice}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />

        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Po Ordered</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data.poordered}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Amount</Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography fontSize="12px">
                Tax -
              </Typography>
              <Typography fontSize="12px">
                {data.taxValue || 0}
              </Typography>
            </Stack>
            <Typography fontSize="14px" fontWeight="bold">
              {'Rs' + ' ' + data.finalPrice || 'Rs' +  ' ' + 0}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </SoftBox>
  );
};

export default PODetailsCard;
