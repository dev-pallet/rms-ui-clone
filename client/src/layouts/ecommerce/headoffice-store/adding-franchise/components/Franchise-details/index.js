import { Grid } from '@mui/material';
import FranchiseAddressInformation from '../Address-information';
import FranchiseBankInformation from '../Bank-information';
import FranchiseBusinessInformation from '../Business-information';
import FranchiseContactInformation from '../Contact-information';
import FranchiseOtherInformation from '../Other-information';
import React, { memo } from 'react';
import SoftBox from '../../../../../../components/SoftBox';

const FranchiseDetails = memo(
  ({
    businessInformation,
    setBusinessInformation,
    addressInformation,
    setAddressInformation,
    contactInformation,
    setContactInformation,
    otherInformation,
    setOtherInformation,
    bankInformation,
    setBankInformation,
  }) => {
    
    return (
      <>
        <SoftBox className="main-wrapper-ho">
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FranchiseBusinessInformation
                businessInformation={businessInformation}
                setBusinessInformation={setBusinessInformation}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FranchiseAddressInformation
                addressInformation={addressInformation}
                setAddressInformation={setAddressInformation}
              />
            </Grid>
          </Grid>
          <FranchiseContactInformation
            contactInformation={contactInformation}
            setContactInformation={setContactInformation}
          />
          <FranchiseOtherInformation otherInformation={otherInformation} setOtherInformation={setOtherInformation} />
          <FranchiseBankInformation bankInformation={bankInformation} setBankInformation={setBankInformation} />
        </SoftBox>
      </>
    );
  },
);

export default FranchiseDetails;
