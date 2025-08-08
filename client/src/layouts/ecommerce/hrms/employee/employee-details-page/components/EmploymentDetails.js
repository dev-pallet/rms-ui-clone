import { Box, Card, InputLabel } from '@mui/material';
import React, { useEffect } from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

function EmploymentDetails({ employmentDetails }) {
  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100% ',
        marginTop: '20px',
        boxShadow:
          'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px;',
        borderRadius: '1.5rem',
        padding: '20px',
      }}
    >
      {employmentDetails?.length > 0 &&
        employmentDetails?.map((item, index) => (
          <Box sx={{ marginTop: index > 0 ? '30px' : '' }}>
            <InputLabel sx={{ fontWeight: 'bold' }}>Employment details {index + 1} </InputLabel>
            <Box
              sx={{
                display: 'flex',
                marginTop: '10px',
                justifyContent: 'space-between',
                flexDirection: { lg: 'row', xs: 'column' },
              }}
            >
              <Box sx={{ padding: '10px 0' }}>
                <SoftTypography className="hrms-employee-title">Employer</SoftTypography>
                <SoftTypography className="hrms-employee-title-info">{item?.employerName || 'N/A'}</SoftTypography>
              </Box>
              <Box sx={{ padding: '10px 0 ' }}>
                <SoftTypography className="hrms-employee-title">Start Date</SoftTypography>
                <SoftTypography className="hrms-employee-title-info">{item?.startDate || 'N/A'}</SoftTypography>
              </Box>
              <Box sx={{ padding: '10px 0' }}>
                <SoftTypography className="hrms-employee-title">End Date</SoftTypography>
                <SoftTypography className="hrms-employee-title-info">{item?.endDate || 'N/A'}</SoftTypography>
              </Box>
              <Box sx={{ padding: '10px 0' }}>
                <SoftTypography className="hrms-employee-title">Years of experience</SoftTypography>
                <SoftTypography sx={{ maxWidth: '70%' }} className="hrms-employee-title-info">
                  {item?.yearsOfExperience || 'N/A'}
                </SoftTypography>
              </Box>
              <Box sx={{ padding: '10px 0' }}>
                <SoftTypography className="hrms-employee-title">Verification status</SoftTypography>
                <SoftTypography sx={{ maxWidth: '70%' }} className="hrms-employee-title-info">
                  {item?.verificationStatus ? 'Verified' : 'Pending'}
                </SoftTypography>
              </Box>
            </Box>
          </Box>
        ))}
    </Card>
  );
}

export default EmploymentDetails;
