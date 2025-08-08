import { Divider, Stack, Typography } from '@mui/material';

const PurchaseMadeCard = ({ data ,index}) => {

  return (
    <Stack className="all-order-card-main-div po-box-shadow" key={index}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>{data?.id}</Typography>
          <Typography fontSize="12px" >{data?.billnumber}</Typography>
        </Stack>
        <Typography fontSize="14px" sx={{color: 'gray !important'}}>{data?.createdOn.split(',')[0]}</Typography>
      </Stack>
      <Divider sx={{margin: '5px !important'}} />
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">PO Number</Typography>
          <Typography fontSize="14px" fontWeight={700}>{data?.purchaseOrderNo}</Typography>
        </Stack>
        <Stack alignItems="center">
          <Typography fontSize="12px">Payment Method</Typography>
          <Typography fontSize="14px" fontWeight={700}>{data?.paymentmethod}</Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Amount</Typography>
          <Typography fontSize="14px" fontWeight={700}>{data?.amount}</Typography>
        </Stack>
      </Stack>
      <Divider sx={{margin: '5px !important'}} />
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Vendor Name</Typography>
          <Typography fontSize="14px" fontWeight={700}>{data?.vendorname}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PurchaseMadeCard;
