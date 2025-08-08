import { Grid } from '@mui/material';
import DefaultStatisticsCard from '../../../../../../../examples/Cards/StatisticsCards/DefaultStatisticsCard';
import React from 'react';
import SoftBox from '../../../../../../../components/SoftBox';

const OtherDeliveryDetails = () => {
  return (
    <div>
      <SoftBox className="other-details-box" p={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DefaultStatisticsCard title="Trips completed" count={0} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DefaultStatisticsCard title="COD handled" count={0} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DefaultStatisticsCard title="Success deliveries" count={0} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DefaultStatisticsCard title="Failed deliveries" count={0} />
          </Grid>
        </Grid>
      </SoftBox>
    </div>
  );
};

export default OtherDeliveryDetails;
