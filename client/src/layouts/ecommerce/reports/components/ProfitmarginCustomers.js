import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { DAY_INTERVAL } from '../../Common/date';
import { Link, useNavigate } from 'react-router-dom';
import { getProfitDetails, salesReports } from '../../../../config/Services';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
const ProfitmarginCustomers = () => {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const navigate = useNavigate();
  const onCard = (reportId) => {
    navigate(`/reports/gstchart/${reportId}`);
  };

  const onSalesCard = (reportId) => {
    if (reportId) {
      navigate(`/reports/Saleschart/${reportId}`);
    } else {
      navigate('/reports/Saleschart');
    }
  };
  const [data, setData] = useState();
  const [marginData, setMarginData] = useState('NA');

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  useEffect(() => {
    const payload = {
      days: DAY_INTERVAL,
      orgId: orgId,
      locationId: locId,
    };

    salesReports(payload)
      .then((res) => {
        setData(res?.data?.data?.salesReportOverTime);
      })
      .catch((err) => {});
  }, []);

  const onPurchaseGstCard = (reportId) => {
    navigate(`/reports/Generalreports/${reportId}`);
  };

  return (
    <Grid container sx={{ marginTop: '20px' }} spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                Sales
              </Typography>
              <Typography className="reportDescriptionText">
                See how products and locations contribute to the gross profit and margin for your business.{' '}
              </Typography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              <Box className="reports-title-div" onClick={() => onSalesCard('Sales Over Time')}>
                <Typography fontSize="14px" color="blue">
                  Sales over time
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => onSalesCard('Sales by Product')}>
                <Typography fontSize="14px" color="blue">
                  Sales by product
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => navigate('/reports/pos/Session')}>
                <Typography fontSize="14px" color="blue">
                  Session Report
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => navigate('/reports/pos/End%20of%20Day')}>
                <Typography fontSize="14px" color="blue">
                  End of day Report
                </Typography>
              </Box>
            </Box>
          </Box>
          <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/reports/Salesreport" style={{ fontSize: '0.9rem', paddingTop: '10px', marginLeft: 'auto' }}>
              See all
            </Link>
          </SoftBox>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                GST
              </Typography>
              <Typography className="reportDescriptionText">
                Gain insights into who your customers are and how they interact with your business.{' '}
              </Typography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              <Box className="reports-title-div" onClick={() => onCard('GstSalesReport')}>
                <SoftTypography className="reports-title-text">Gst sales report</SoftTypography>
                <SoftTypography fontSize="14px"> </SoftTypography>
              </Box>
              <Box className="reports-title-div" onClick={() => onCard('GstConsolidateReport')}>
                <Typography fontSize="14px" color="blue">
                  GST Consolidate report
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => onPurchaseGstCard('GstPurchasesSummary')}>
                <Typography fontSize="14px" color="blue">
                  GST Purchases Summary
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => onPurchaseGstCard('PurchaseGstReportPoWise')}>
                <Typography fontSize="14px" color="blue">
                  Purchase GST Report Po wise
                </Typography>
              </Box>
            </Box>
          </Box>
          <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/reports/Gstreports" className="linkFontStyle">
              See all
            </Link>
          </SoftBox>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProfitmarginCustomers;
