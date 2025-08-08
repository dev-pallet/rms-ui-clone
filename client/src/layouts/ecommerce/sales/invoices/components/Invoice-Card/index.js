import { Divider, Stack, Typography } from '@mui/material';

const InvoiceMobCard = ({ data }) => {
  return (
    <Stack
      className="all-order-card-main-div po-box-shadow"
      //   onClick={() => navigateToDetailsPage(product?.orderNumber)}
    >
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>
            {data?.paymentId}
          </Typography>
          <Typography fontSize="12px" sx={{ color: 'gray !important' }}>
            {data?.invoiceDate}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Channel</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.channel}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ margin: '5px !important' }} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Order Id</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.orderID}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Invoice Id</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.invoiceId}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ margin: '5px 0px !important' }} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Amount</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.totalAmount}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Payment Status</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.paymentStatus}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ margin: '5px 0px !important' }} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Payment Mode</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.paymentMode}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default InvoiceMobCard;
