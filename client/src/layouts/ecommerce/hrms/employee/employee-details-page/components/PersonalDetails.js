import { Box, Card, InputLabel } from '@mui/material';
import React from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

function PersonalInfo({
  name,
  gender,
  maritalStatus,
  officialPhoneNo,
  personalPhoneNo,
  emergencyPhoneNumber,
  email,
  emergencyContactName,

  emergencyContactRelation,
  bloodGroup,
  dob,
  nationality,
  passportNumber,
  employmentVisa,
  visaExpiryDate,
}) {
  const detailsListOne = [
    { label: 'Full name', value: name },
    { label: 'Official Contact Number', value: officialPhoneNo },
    { label: 'Emergency contact number', value: emergencyPhoneNumber },
    { label: 'Blood group', value: bloodGroup },
    { label: 'Passport Number', value: passportNumber },
  ];

  const detailsListTwo = [
    { label: 'Gender', value: gender },
    { label: 'Personal Contact Number', value: personalPhoneNo },
    { label: 'Emergency Contact name', value: emergencyContactName },
    { label: 'Date of birth', value: dob },
    { label: 'Employment visa', value: employmentVisa },
  ];
  const detailsListThree = [
    { label: 'Marital Status', value: maritalStatus },
    { label: 'Email', value: email },

    { label: 'Relation', value: emergencyContactRelation },

    { label: 'Nationality', value: nationality },

    { label: 'Visa expiry', value: visaExpiryDate },
  ];

  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100%',
        marginTop: '20px',
        boxShadow:
          'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px;',
        borderRadius: '1.5rem',
        borderRadius: '1.5rem',
        padding: '20px',
      }}
    >
      <InputLabel style={{ fontWeight: 'bold' }}>Personal Information</InputLabel>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '10px' }}>
        <Box>
          {detailsListOne?.map((item, index) => (
            <Box sx={{ padding: '10px' }} key={index}>
              <SoftTypography className="hrms-employee-title">{item?.label}</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{item?.value}</SoftTypography>
            </Box>
          ))}
        </Box>

        <Box>
          {detailsListTwo?.map((item, index) => (
            <Box sx={{ padding: '10px' }} key={index}>
              <SoftTypography className="hrms-employee-title">{item?.label}</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{item?.value}</SoftTypography>
            </Box>
          ))}
        </Box>

        <Box>
          {detailsListThree?.map((item, index) => (
            <Box sx={{ padding: '10px' }} key={index}>
              <SoftTypography className="hrms-employee-title">{item?.label}</SoftTypography>
              <SoftTypography className="hrms-employee-title-info">{item?.value}</SoftTypography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}

export default PersonalInfo;
