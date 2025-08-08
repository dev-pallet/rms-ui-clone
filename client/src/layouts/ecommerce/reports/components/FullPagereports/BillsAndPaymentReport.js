import React from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Grid, Paper, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import { useNavigate } from 'react-router-dom';
import { billReportArray } from '../ReportsData';

const BillsAndPaymentReport = () => {
  const navigate = useNavigate();
  const onCard = (reportId) => {
    navigate(`/reports/Generalreports/${reportId}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Grid container sx={{ marginTop: '20px' }} spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ padding: '15px' }}>
            <SoftBox>
              <Box>
                <Typography variant="h6" fontWeight="550">
                  Bills And Payments Reports
                </Typography>
                <SoftTypography width="80%" mt="10px" fontSize="14px" color="black">
                  Monitor and analyze transaction trends{' '}
                </SoftTypography>
              </Box>
            </SoftBox>
            <Box sx={{ marginTop: '25px' }}>
              <SoftTypography className="reports-text-div">Reports</SoftTypography>
              <Box>
                {billReportArray?.map((item) => (
                  <Box className="reports-title-div" onClick={() => onCard(item?.onCardParam)}>
                    <SoftTypography className="reports-title-text">{item?.title}</SoftTypography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default BillsAndPaymentReport;
