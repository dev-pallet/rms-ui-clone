import { Card, Grid } from '@mui/material';
import React from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

function WorkInfo({
  doj,
  departmentName,
  designationName,
  reportingManagerName,
  employmentType,
  employmentStatus,
  sourceOfHire,
}) {
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
      <SoftTypography>Work Information</SoftTypography>

      <Grid container spacing={3} p={1}>
        <Grid item xs={6} sm={6} md={3}>
          <SoftTypography className="hrms-employee-title">Joining date</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{doj}</SoftTypography>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <SoftTypography className="hrms-employee-title">Department</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{departmentName}</SoftTypography>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <SoftTypography className="hrms-employee-title">Designation</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{designationName}</SoftTypography>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <SoftTypography className="hrms-employee-title">Reporting Authority</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{reportingManagerName}</SoftTypography>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <SoftTypography className="hrms-employee-title">Employment type </SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{employmentType}</SoftTypography>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <SoftTypography className="hrms-employee-title">Employment status</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{employmentStatus}</SoftTypography>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <SoftTypography className="hrms-employee-title">Source of hire</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{sourceOfHire}</SoftTypography>
        </Grid>
      </Grid>
    </Card>
  );
}

export default WorkInfo;
