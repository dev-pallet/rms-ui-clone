import { Divider, Stack, Typography } from '@mui/material';
import SoftBox from '../../../../../../../components/SoftBox';

const TransferProductCard = ({ data,index,length }) => {
  return (
    <SoftBox className="pi-det-prdt-card-main-div" sx={{borderBottom: index === length - 1 && '1px solid lightgray !important'}}>
      <Stack sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack alignItems="flex-start">
            <Typography fontSize="14px" fontWeight={700}>
              {data?.itemName}
            </Typography>
            <Typography fontSize="12px" sx={{ color: 'gray !important' }}>
              {data?.itemNo}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Batch No.</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.batchNumber}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Unit Price</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.unitPrice}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Purchase Price</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.purchasePrice}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />

        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Amount</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {'Rs' + ' ' + data?.finalPrice || 'Rs' + ' ' + 0}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </SoftBox>
  );
};

export default TransferProductCard;
