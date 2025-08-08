import './HorizontalCardDetails.css';
import { Card, Grid } from '@mui/material';
import React from 'react';
import SoftTypography from '../../../../../components/SoftTypography';
import { isSmallScreen } from '../../CommonFunction';

const HorizontalCardDetails = ({ cards = [] }) => {
  const isMobileDevice = isSmallScreen();
  
  return (
    <Card style={{ margin: isMobileDevice ? '16px' : '16px 0px 0px' }} className="vendorCardShadow">
      <Grid container spacing={0}>
        {cards?.map((item) => (
          <Grid item xs={6} md={4} lg={12 / cards?.length} key={item?.id}>
            <div className="detailCardContainer">
              <SoftTypography className="detailCardHeading">{item?.title || ''}</SoftTypography>
              <SoftTypography className="detailCardValue"> {item?.value ? '₹ ' + item?.value : 'NA'}</SoftTypography>
              <SoftTypography className="detailCardCount">{item?.count || ''}</SoftTypography>
            </div>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default HorizontalCardDetails;
