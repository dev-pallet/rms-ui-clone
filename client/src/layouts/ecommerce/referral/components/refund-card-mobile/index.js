import { Divider, Stack, Typography } from '@mui/material';

const RefundCard = ({ data ,index}) => {
  return( 
    <Stack className="all-order-card-main-div po-box-shadow" key={index}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>{data?.id}</Typography>
          <Typography fontSize="12px">{data?.purchaseOrderNo}</Typography>
        </Stack>
        <Typography fontSize="14px" sx={{color: 'gray !important'}}>{data?.createdOn.split(',')}</Typography>
      </Stack>
      <Divider sx={{margin: '5px !important'}} />
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Refund Method</Typography>
          <Typography fontSize="14px" fontWeight={700}>{data?.refundmethod}</Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Amount</Typography>
          <Typography fontSize="14px" fontWeight={700}>{data?.amount}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );};

export default RefundCard;
