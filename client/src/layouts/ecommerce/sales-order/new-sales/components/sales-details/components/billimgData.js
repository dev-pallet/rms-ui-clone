import React from 'react';
import { Grid, Stack, Divider } from '@mui/material';

const BillingDataRow = ({ label, value, isBold = false, hasDivider = false }) => (
  <Grid container>
    <Grid item lg={6} md={6} sm={6} xs={6}>
      <Stack alignItems={'flex-end'}>
        <span className={`card-small-title ${isBold ? 'bold' : ''}`}>{label}</span>
      </Stack>
    </Grid>
    <Grid item lg={6} md={6} sm={6} xs={6}>
      <Stack alignItems={'center'}>
        <span className={`card-small-title ${isBold ? 'bold' : ''}`}>{value}</span>
      </Stack>
      {hasDivider && <Divider className="common-divider-mob-cards" />}
    </Grid>
  </Grid>
);

export default BillingDataRow;
