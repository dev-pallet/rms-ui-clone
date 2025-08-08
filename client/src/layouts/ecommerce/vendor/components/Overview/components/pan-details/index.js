import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import React from 'react';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

const PanDetails = () => {
  const [panData, setPanData] = useState('');

  const vendorData = useSelector((state) => state.vendorBaseDetails);
  const vendorBaseData = vendorData.vendorBaseDetails[0];

  useEffect(() => {
    if (vendorBaseData != undefined) {
      setPanData(vendorBaseData?.kycDetails);
    }
  }, [vendorBaseData]);

  return (
    <Card sx={{ overflow: 'visible' }}>
      <SoftBox
        pt={1.5}
        px={2}
        // display="flex"
        // justifyContent="space-between"
      >
        <SoftTypography fontWeight="bold" fontSize="14px">
          Tax information
        </SoftTypography>
      </SoftBox>

      <SoftBox pt={0.5}  px={2} lineHeight={1.25}>
        <SoftBox mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Gst number
            </SoftTypography>
          </SoftBox>

          <SoftBox width="70%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {panData?.gst || 'NA'} 
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Pan
            </SoftTypography>
          </SoftBox>

          <SoftBox width="70%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {panData?.pan || 'NA'}
            </SoftTypography>
          </SoftBox>
        </SoftBox>

        <SoftBox  mb={0.5}>
          <SoftBox>
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Gst treatment
            </SoftTypography>
          </SoftBox>

          <SoftBox>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {/* {panData.isValidPan} */}
              Registered business - Regular
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox  mb={0.5}>
          <SoftBox>
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Tax preference
            </SoftTypography>
          </SoftBox>

          <SoftBox>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Taxable
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox  mb={0.5}>
          <SoftBox>
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Billing currency
            </SoftTypography>
          </SoftBox>

          <SoftBox>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              indian rupees
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
};

export default PanDetails;
