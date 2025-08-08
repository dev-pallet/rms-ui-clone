import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { DAY_INTERVAL } from '../../Common/date';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
const MarketingBussinessReports = () => {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const navigate = useNavigate();
  const onCard = () => {
    navigate('/reports/gstchart');
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

    // salesReports(payload)
    //   .then((res) => {
    //     // setData(res?.data?.data?.salesReportOverTime);
    //   })
    //   .catch((err) => {});
  }, []);

  useEffect(() => {
    function getStartOfMonth() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      return `${year}-${month}-01`;
    }

    // Create a function to get the end date of the current month in "YYYY-MM-DD" format
    function getEndOfMonth() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();
      return `${year}-${month}-${lastDay}`;
    }

    // Usage: Call the functions to populate the payload
    const payload = {
      startDate: getStartOfMonth(),
      endDate: getEndOfMonth(),
      locationId: locId,
      orgId: orgId,
      frequency: 'month',
    };

    // getProfitDetails(payload)
    //   .then((res) => {
    //     // setMarginData(res?.data?.data?.marginData[0].netProfit);
    //     // setMarginData('₹ ' + formatLargeNumber(Math.round(res?.data?.data?.marginData[0].netProfit)));
    //   })
    //   .catch((err) => {});
  }, []);

  const handleNavigate = (reportId) => {
    navigate(`/reports/marketing/${reportId}`);
  };
  
  return (
    <Grid container sx={{ marginTop: '20px' }} spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                Marketing
              </Typography>
              <Typography className="reportDescriptionText">
                See how products and locations contribute to the gross profit and margin for your business.{' '}
              </Typography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              <Box className="reports-title-div" onClick={() => handleNavigate('Coupon-Report')}>
                <Typography fontSize="14px" color="blue">
                  Coupon Reports{' '}
                </Typography>
                <Typography fontSize="14px"></Typography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue">
                  Offers & Promotions
                </Typography>
                <Typography fontSize="14px"></Typography>
              </Box>
              {/* <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue">
                  Loyalty Reports{' '}
                </Typography>
                <Typography fontSize="14px"></Typography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue">
                  Gift Vocher Reports{' '}
                </Typography>
                <Typography fontSize="14px"></Typography>
              </Box> */}
            </Box>
          </Box>
          <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="" className="linkFontStyle" disabled={true}>
              See all
            </Link>
          </SoftBox>
        </Paper>
      </Grid>

    
    </Grid>
  );
};

export default MarketingBussinessReports;
