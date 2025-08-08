import { Grid } from '@mui/material';
import React, { memo } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseBankInformation = memo((bankInformation,setBankInformation) => {
  return (
    <SoftBox mt={2} className="details-item-wrrapper">
      <SoftTypography className="information-heading-ho">Bank Information</SoftTypography>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <SoftTypography className="soft-input-heading-ho">Bank Account Number</SoftTypography>
          <SoftInput placeholder="Type Here..." />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <SoftTypography className="soft-input-heading-ho">IFSC Code</SoftTypography>
          <SoftBox className="flex-div-ho">
            <SoftInput placeholder="Type Here..." />
            <SoftButton variant="contained" color="info">
            Verify
            </SoftButton>
          </SoftBox>
        </Grid>
      </Grid>
    </SoftBox>
  );
});

export default FranchiseBankInformation;