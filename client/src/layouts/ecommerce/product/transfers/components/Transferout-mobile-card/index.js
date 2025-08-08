import { Divider, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Status from '../../../../Common/Status';

const TransferOutCard = memo(({ data }) => {
  const navigate= useNavigate();
  return (
    <Stack
      className="all-order-card-main-div po-box-shadow"
      onClick={() => {
        // navigate(`/inventory/stock-transfer-details/${data?.transferId}`)
        // for draft
        if (data?.status === 'DRAFT') {
          navigate(`/inventory/new-transfers/${data?.transferId}`);
        }else{
        // except draft
          navigate(`/inventory/stock-transfer-details/${data?.transferId}`);
        }
        }
      }
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack alignItems="flex-start">
          <Typography fontSize="14px" fontWeight={700}>
            {data?.transferId}
          </Typography>
          <Typography fontSize="12px" sx={{ color: 'gray !important' }}>
            {data?.date}
          </Typography>
        </Stack>
        <Status label={data?.status}/>
      </Stack>
      <Divider sx={{ margin: '5px !important' }} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px">Origin</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.origin}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Destination</Typography>
          <Typography fontSize="14px" fontWeight={700}>
            {data?.destination}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ margin: '5px 0px !important' }} />
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="flex-start">
          <Typography fontSize="12px"></Typography>
          <Typography fontSize="14px" fontWeight={700}>
            Total Value: {data?.transferValue}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
});

export default TransferOutCard;
