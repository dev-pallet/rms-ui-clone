import { Stack, Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../components/SoftBox';

import './Manufacture.css';

const ManufacturerCard = ({ name, desc, image, location, brand, product }) => {
  return (
    <Stack className='manufacture-card-main-div'>
      <SoftBox sx={{width: '100%', display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
        <img src={image} className="manufacture-card-img" />
      </SoftBox>
      <Stack direction="row" width="100%" justifyContent="space-between" p={1}>
        <Stack alignItems="flex-start" >
          <Typography fontSize="12px">Products</Typography>
          <Typography fontSize="14px" fontWeight={700}>{product}</Typography>
        </Stack>
        <Stack alignItems="center">
          <Typography fontSize="12px">Location</Typography>
          <Typography fontSize="14px" fontWeight={700}>{location}</Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontSize="12px">Brand</Typography>
          <Typography fontSize="14px" fontWeight={700}>{brand}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ManufacturerCard;
