import './order-info-mobcard.css';
import { Divider, Stack, Typography, useMediaQuery } from '@mui/material';
import SoftBox from '../../../../../../../../../../../../components/SoftBox';

const OrderInfoMobCard = ({ data,index,dataLength }) => {
  const is420px = useMediaQuery('(max-width: 420px)');


  return (
    <SoftBox className="pi-det-prdt-card-main-div" sx={{borderBottom: index === dataLength - 1 ? '1px solid lightgrey' : 'unset'}}>
      <SoftBox className="pi-det-prdt-card-img-div">
        <img
          src={` ${
            data?.productImage ||
            'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
          }`}
          alt=""
          className="pi-prdt-image"
        />
      </SoftBox>
      <Stack sx={{ width: '80%' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack>
            <Typography fontSize="14px" fontWeight="bold">
              {is420px ? data?.productName.slice(0, 13) + '...' : data?.productName}
            </Typography>
            {/* <Typography fontSize="12px">GTIN: {data?.itemCode}</Typography> */}
          </Stack>
          {/* <Stack alignItems="flex-end">
            <Typography fontSize="12px">Spec</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.specification}
            </Typography>
          </Stack> */}
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">MRP</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.mrp}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Selling Price</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.sellingPrice}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Quantity</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.quantity}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Amount</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data?.subTotal}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </SoftBox>
  );
};

export default OrderInfoMobCard;
