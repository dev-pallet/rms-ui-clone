import { Typography } from '@mui/material';
import { isSmallScreen } from '../Common/CommonFunction';
import Amul from '../../../assets/images/amul.png';
import Britania from '../../../assets/images/britania.png';
import Himalaya from '../../../assets/images/himalaya.png';
import Itc from '../../../assets/images/itc.png';
import ManufacturerCard from './ManufacturerCard';
import Nestle from '../../../assets/images/nestle.png';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import Unilever from '../../../assets/images/uniliver.png';

const HeadOfficeSellers = () => {
  const isMobileDevice = isSmallScreen();
  const manufactureArray = [
    {
      manufactuerName: 'Nestle',
      image: Nestle,
      desc: '',
      locations: 4,
      products: 234,
      brands: 23,
    },
    {
      manufactuerName: 'Britania',
      image: Britania,
      desc: '',
      locations: 5,
      products: 765,
      brands: 45,
    },
    {
      manufactuerName: 'Amul',
      image: Amul,
      desc: '',
      locations: 8,
      products: 57,
      brands: 65,
    },
    {
      manufactuerName: 'Unilever',
      image: Unilever,
      desc: '',
      locations: 2,
      products: 345,
      brands: 89,
    },
    {
      manufactuerName: 'Himalaya',
      image: Himalaya,
      desc: '',
      locations: 7,
      products: 23,
      brands: 34,
    },
    {
      manufactuerName: 'Itc',
      image: Itc,
      desc: '',
      locations: 9,
      products: 256,
      brands: 45,
    },
  ];
  return (
    <SoftBox sx={{marginTop:isMobileDevice ? '20px' : '90px'}}>
      <Typography ml={3} fontSize="18px" fontWeight="bold">Manufacturer List</Typography>
      <SoftBox
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '20px',
          overflowX: 'scroll'
        }}
      >
        {manufactureArray.map((card) => (
          <ManufacturerCard
            name={card.manufactuerName}
            brand={card.brands}
            product={card.products}
            location={card.locations}
            image={card.image}
          />
        ))}
      </SoftBox>
    </SoftBox>
  );
};

export default HeadOfficeSellers;
