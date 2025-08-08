import { Grid } from '@mui/material';
import { placeofsupply } from '../../../../vendor/components/vendor-details/data/placeofsupply';
import React, { memo } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseOtherInformation = memo((otherInformation,setOtherInformation) => {

  //softSelectOptions
  const taxOptions = [
    { value: 'taxable', label: 'Taxable' },
    { value: 'tax exempt', label: 'Tax Exempt' },
  ];
  
  const gstOptions = [
    { value: 'rbr', label: 'Registered Business - Regular' },
    { value: 'rbc', label: 'Registered Business - Composition' },
    { value: 'urb', label: 'Unregistered Business' },
    { value: 'ovs', label: 'Overseas' },
    { value: 'sez', label: 'Special Economic Zone' },
  ];
  
  const currencies = [
    {
      value: 'India',
      label: 'INR',
    },
    {
      value: 'British Indian Ocean Territory',
      label: 'USD',
    },
    {
      value: 'Australia',
      label: 'EUR',
    },
    {
      value: 'England',
      label: 'GBP',
    },
  ];

  return (
    <SoftBox mt={2} className="details-item-wrrapper">
      <SoftTypography className="information-heading-ho">Other Information</SoftTypography>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <SoftTypography className="soft-input-heading-ho">GST Treatment</SoftTypography>
          <SoftSelect options={gstOptions} placeholder="Select GST Treatment..." />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <SoftTypography className="soft-input-heading-ho">Place Of Supply</SoftTypography>
          <SoftSelect options={placeofsupply} placeholder="Select Place..." />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <SoftTypography className="soft-input-heading-ho">Tax Prefernce</SoftTypography>
          <SoftSelect options={taxOptions} placeholder="Select Tax Preference..." />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <SoftTypography className="soft-input-heading-ho">Currency</SoftTypography>
          <SoftSelect options={currencies} placeholder="Select Currency..." />
        </Grid>
      </Grid>
    </SoftBox>
  );
});

export default FranchiseOtherInformation;
