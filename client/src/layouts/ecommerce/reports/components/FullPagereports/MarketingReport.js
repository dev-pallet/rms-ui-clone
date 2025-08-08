import './reports.css';
import { Box, Grid, Paper } from '@mui/material';
import { DAY_INTERVAL } from '../../../Common/date';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';

const BussinessReport = () => {
  const navigate = useNavigate();
  const onCard = (reportId) => {
    navigate(`/reports/gstchart/${reportId}`);
  };
  const [data, setData] = useState();
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
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Grid item xs={12} md={6}>
        <Paper sx={{ padding: '15px' }}>
          <SoftBox>
            <Box>
              <SoftTypography variant="h6" fontWeight="550">
                Marketing Report
              </SoftTypography>
              <SoftTypography width="80%" mt="10px" fontSize="14px" color="black">
                Gain insights into who your customers are and how they interact with your business.{' '}
              </SoftTypography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <SoftTypography className="reports-text-div">Reports</SoftTypography>
            <Box>
              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Mark-Up/Mark Down Report</SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstSales}</SoftTypography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Product List </SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstOutputTax}</SoftTypography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Item Wise-EANCODE</SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstCollected}</SoftTypography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Price List Summary</SoftTypography>
                <SoftTypography fontSize="14px">0</SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Category Item Price List</SoftTypography>
                <SoftTypography fontSize="14px">0</SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Customer List</SoftTypography>
                <SoftTypography fontSize="14px">0 </SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Price-Level Wise Customer List</SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstPaymentsMade}</SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Price-Level Item Wise Customer List</SoftTypography>
                <SoftTypography fontSize="14px">{data?.refundsReceived}</SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Supplier List</SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstExemptSupplies}</SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Manufacturer List</SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstByInterStateSales}</SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Item Wise Conversion Rate</SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstByIntraStateSales}</SoftTypography>
              </Box>

              <Box className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">Item Conversion Wise Sales Rate Report</SoftTypography>
                <SoftTypography fontSize="14px">{data?.gstTaxRateBreakDown}</SoftTypography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </DashboardLayout>
  );
};

export default BussinessReport;
