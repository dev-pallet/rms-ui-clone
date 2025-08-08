import { useSelector } from 'react-redux';
import { useState } from 'react';
import Card from '@mui/material/Card';
import React from 'react';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

const PanDetails = () => {
  const [panData, setPanData] = useState('');

  const custData = useSelector((state) => state.customerBaseDetails);
  const custBaseData = custData?.customerBaseDetails[0];

  // useEffect(()=>{
  //    if(custBaseData !== undefined){
  //     setPanData(custBaseData?.panNumber)
  //    }
  // },[custBaseData])

  return (
    <Card sx={{ overflow: 'visible' }}>
      <SoftBox pt={2} px={2}>
        <SoftTypography fontWeight="bold" fontSize="16px">
          Pan Details
        </SoftTypography>
      </SoftBox>

      <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
        <SoftBox py={1} mb={0.25}>
          {/* <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Pan
            </SoftTypography>
          </SoftBox> */}

          <SoftBox width="70%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {/* {panData} */}
              {custBaseData?.panNumber}
            </SoftTypography>
          </SoftBox>
        </SoftBox>

        <SoftBox py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Pan Status
            </SoftTypography>
          </SoftBox>

          <SoftBox width="70%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {custBaseData?.kycVerified === true ? 'VERIFIED' : 'VERIFIED'}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
};

export default PanDetails;
