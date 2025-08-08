import React from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';
import SoftBox from '../../../../../../components/SoftBox';
import { Card, Grid } from '@mui/material';

function IndentificationInfo({ aadhaarNumber,uanNumber,panNumber}) {
  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100%',
        marginTop: '20px',
        boxShadow: '0px 2px 10px rgba(3, 3, 3, 0.1)',
        borderRadius: '1.5rem',
        padding: '20px',
      }}
    >
      <SoftTypography>Indentification Information</SoftTypography>

      <Grid container spacing={2} p={1}>
        <Grid item xs={6} sm={6} md={4}>
          <SoftTypography className="hrms-employee-title">Adhaar Number</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{aadhaarNumber}</SoftTypography>
        </Grid>

        <Grid item xs={6} sm={6} md={4}>
          <SoftTypography className="hrms-employee-title">PAN number</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{panNumber}</SoftTypography>
        </Grid>

        <Grid item xs={6} sm={6} md={4}>
          <SoftTypography className="hrms-employee-title">UAN number</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{uanNumber}</SoftTypography>
        </Grid>
      </Grid>
    </Card>
  );
}

export default IndentificationInfo;
