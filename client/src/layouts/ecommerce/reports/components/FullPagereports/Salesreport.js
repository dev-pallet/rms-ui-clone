import './reports.css';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { salesReports } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import { salesReportArray } from '../ReportsData';

const Salesreport = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const onCard = (reportId, isPos) => {
    if (reportId) {
      if (isPos) {
        navigate(`/reports/pos/${reportId}`);
      } else {
        navigate(`/reports/Saleschart/${reportId}`);
      }
    } else {
      navigate('/reports/Saleschart');
    }
  };
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Grid container sx={{ marginTop: '20px' }} spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ padding: '15px' }}>
            <SoftBox>
              <Box>
                <Typography variant="h6" fontWeight="550">
                  Sales
                </Typography>
                <SoftTypography width="80%" mt="10px" fontSize="14px" color="black">
                  See how products and locations contribute to the gross profit and margin for your business.{' '}
                </SoftTypography>
              </Box>
            </SoftBox>
            <Box sx={{ marginTop: '25px' }}>
              <Box>
                {salesReportArray?.map((item) => (
                  <Box
                    key={item?.title}
                    className={`reports-title-div ${item?.available ? '' : 'unAvailable_Report'}`}
                    onClick={item?.available ? () => onCard(item?.onCardParam, item?.pos) : undefined}
                  >
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

export default Salesreport;
