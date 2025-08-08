import { Box, Card, Divider, Grid, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

function IncorporatedAddress({ addressDetails }) {
  const [presentAddressDetails, setPresentAddressDetails] = useState('');
  const [permanentAddressDetails, setPermanentAddressDetails] = useState('');
  const [presentCountry, setPresentCountry] = useState('');
  const [presentState, setPresentState] = useState('');
  const [presentCity, setPresentCity] = useState('');
  const [permanentCountry, setPermanentCountry] = useState('');
  const [permanentState, setPermanentState] = useState('');
  const [permanentCity, setPermanentCity] = useState('');

  useEffect(() => {
    addressDetails.length > 0 &&
      addressDetails?.map((item) => {
        if (item.addressType == 'present') {
          setPresentCountry(item?.country || 'N/A');
          setPresentState(item?.state || 'N/A');
          setPresentCity(item?.city || 'N/A');
          const formattedPresentAddress = [
            item?.addressLine1,
            item?.addressLine2,
            item?.city,
            item?.state,
            item?.pinCode,
            item?.country,
          ]
            .filter(Boolean)
            .join(', ');
          setPresentAddressDetails(formattedPresentAddress);
        } else {
          setPermanentCountry(item?.country || 'N/A');
          setPermanentState(item?.state || 'N/A');
          setPermanentCity(item?.city || 'N/A');
          const formattedPermanentAddress = [
            item?.addressLine1,
            item?.addressLine2,
            item?.city,
            item?.state,
            item?.pinCode,
            item?.country,
          ]
            .filter(Boolean)
            .join(', ');
          setPermanentAddressDetails(formattedPermanentAddress);
        }
      });
  }, [addressDetails]);

  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100%',
        marginTop: '20px',
        boxShadow:
          'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px;',
        borderRadius: '1.5rem',
        padding: '20px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box>
          <InputLabel sx={{ fontWeight: 'bold' }}>Present Address</InputLabel>
          <Box sx={{ marginTop: '10px' }}>
            <Box sx={{ padding: '10px 0' }}>
              <SoftTypography className="hrms-employee-title">Country</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{presentCountry || 'NA'}</SoftTypography>
            </Box>
            <Box sx={{ padding: '10px 0' }}>
              <SoftTypography className="hrms-employee-title">State</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{presentState || 'NA'}</SoftTypography>
            </Box>
            <Box sx={{ padding: '10px 0' }}>
              <SoftTypography className="hrms-employee-title">City</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{presentCity || 'NA'}</SoftTypography>
            </Box>
            <Box sx={{ padding: '10px 0' }}>
              <SoftTypography className="hrms-employee-title">Address</SoftTypography>
              <SoftTypography sx={{ maxWidth: '70%' }} className="hrms-employee-title-info">
                {presentAddressDetails || 'NA'}
              </SoftTypography>
            </Box>
          </Box>
        </Box>

        <Box>
          <InputLabel sx={{ fontWeight: 'bold' }}>Permanent Address</InputLabel>
          <Box sx={{ marginTop: '10px' }}>
            <Box sx={{ padding: '10px 0' }}>
              <SoftTypography className="hrms-employee-title">Country</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{permanentCountry || 'NA'}</SoftTypography>
            </Box>
            <Box sx={{ padding: '10px 0 ' }}>
              <SoftTypography className="hrms-employee-title">State</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{permanentState || 'NA'}</SoftTypography>
            </Box>
            <Box sx={{ padding: '10px 0' }}>
              <SoftTypography className="hrms-employee-title">City</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{permanentCity || 'NA'}</SoftTypography>
            </Box>
            <Box sx={{ padding: '10px 0' }}>
              <SoftTypography className="hrms-employee-title">Address</SoftTypography>
              <SoftTypography sx={{ maxWidth: '70%' }} className="hrms-employee-title-info">
                {permanentAddressDetails || 'NA'}
              </SoftTypography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default IncorporatedAddress;
