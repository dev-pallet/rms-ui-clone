import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { purchaseReports } from '../../../../config/Services';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

const SalesAcquisition = () => {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const navigate = useNavigate();
  const onCard = (reportId) => {
    if (reportId) {
      navigate(`/reports/Generalreports/${reportId}`);
    } else {
      navigate('/reports/Generalreports');
    }
  };

  const onInventory = (reportId) => {
    if (reportId.length) {
      navigate(`/reports/InventoryChart/${reportId}`);
    } else {
      navigate('/reports/InventoryChart');
    }
  };
  const [data, setData] = useState();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  useEffect(() => {
    const payload = {
      orgId: orgId,
      orgLocId: locId,
      days: '30',
    };

    purchaseReports(payload)
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {});
  }, []);

  const reports = [
    { title: 'Purchase Order Report', onClick: () => onCard('PurchaseOrderReport') },
    { title: 'Top Purchase Items', onClick: () => onCard('TopPurchaseItems') },
    // { title: 'Purchase Return Vendor-wise Report', onClick: () => onCard('PurchaseReturnVendorWiseReport') },
    { title: 'GRN Margin Vendor-wise Report', onClick: () => onCard('GrnMarginVendorWiseReport') },
    { title: 'Purchase Forecasting Report', onClick: () => onCard('PurchaseForecastingReport') },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                Purchase
              </Typography>
              <Typography className="reportDescriptionText">
                Make business decisions by comparing sales across products, staff, channels, and more.
              </Typography>
            </Box>
          </SoftBox>

          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              {reports?.map((report, index) => (
                <Box key={index} className="reports-title-div" onClick={report.onClick}>
                  <Typography fontSize="14px" color="blue">
                    {report.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/reports/purchasereport" style={{ fontSize: '0.9rem', paddingTop: '10px', marginLeft: 'auto' }}>
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
                Inventory
              </Typography>
              <Typography className="reportDescriptionText">
                Increase visitor engagement by knowing where your visitors are coming from and measuring the success.
              </Typography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              <Box className="reports-title-div">
                <SoftTypography className="reports-title-text" onClick={() => onInventory('InventoryOverTime')}>
                  {' '}
                  Inventory over time
                </SoftTypography>

                {/* <Typography fontSize="14px">0 orders</Typography> */}
              </Box>
              <Box className="reports-title-div" onClick={() => onInventory('InventoryByDay')}>
                <SoftTypography className="reports-title-text">Inventory by day</SoftTypography>
                {/* <SoftTypography fontSize="14px">0 </SoftTypography> */}
              </Box>
              <Box className="reports-title-div" onClick={() => onInventory('InvalidPriceConditions')}>
                <SoftTypography className="reports-title-text">Invalid Price Conditons</SoftTypography>
                {/* <SoftTypography fontSize="14px">0 </SoftTypography> */}
              </Box>
              <Box className="reports-title-div" onClick={() => onInventory('SlowMovingInventory')}>
                <SoftTypography className="reports-title-text">Slow moving inventory</SoftTypography>
                {/* <SoftTypography fontSize="14px">0 </SoftTypography> */}
              </Box>
            </Box>
          </Box>
          <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/reports/inventoryreport" className="linkFontStyle">
              See all
            </Link>
          </SoftBox>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SalesAcquisition;
