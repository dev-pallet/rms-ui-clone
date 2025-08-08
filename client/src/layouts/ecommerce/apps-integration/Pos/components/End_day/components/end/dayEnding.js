import './dayEnding.css';
import { Box, Button, Grid } from '@mui/material';
import { IndividualSessionDetails } from '../individualSessionDetails/individualSessionDetails';
import { getLocationActivity, getSessionDetailsForLocation } from '../../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../../../examples/Navbars/DashboardNavbar';
import SoftTypography from '../../../../../../../../components/SoftTypography';

export const EndDayDetailsPage = () => {
  const [cumData, setCumData] = useState({});
  const [data, setData] = useState([]);
  const [totalSession, setTotalSessions] = useState({});
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    const sessionId =localStorage.getItem('sessionId');
    getSessionDetailsForLocation(locId).then((response) => {
      setCumData(response?.data?.data?.salesData);
    });

    getLocationActivity(locId, orgId,sessionId).then((res) => {
      setData(res?.data?.licenses);
      setTotalSessions({
        totalSes: res?.data?.totalSessions,
        startamt: res?.data?.startingBalance,
      });
    });
  }, []);

  const goToDashboard = () => {
    navigate('/sales_channels/pos');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} className="report-for-day">
        <Grid item xs={12} md={7} xl={7}>
          <Box mb={2} mt={2}>
            <SoftTypography variant="h3" fontSize="19px" fontWeight="bold">
              Cumulative Terminal Report
            </SoftTypography>
          </Box>
          <Box className="session-cumulative-box">
            <Box className="session-details-map" p={2}>
              <Box>
                <SoftTypography fontSize="16px" fontWeight="800" variant="h3">
                  Total sessions{' '}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Total order processed{' '}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Ajusted Orders
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Starting balance{' '}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Total amount collected via cash{' '}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Total amount collected via UPI{' '}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Total amount collected via card{' '}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Total order process time{' '}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Reconcillation Amount
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Ending cash amount
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  Discrepancy
                </SoftTypography>
              </Box>
              <Box>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  {totalSession.totalSes || 0}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  {cumData.totalOrders || 0}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  {cumData.adjustedOrders || 0}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  {totalSession.startamt || 0}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  {cumData.cashOrdersValue || 0}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  {cumData.upiOrdersValue || 0}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  {cumData.cardOrdersValue || 0}
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  ---
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  ---
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  ---
                </SoftTypography>
                <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                  ---
                </SoftTypography>
              </Box>
            </Box>
          </Box>
        </Grid>
        {data ? (
          <Grid item xs={12} md={7} xl={7}>
            <Box>
              <Box mt={3} mb={2}>
                <SoftTypography variant="h3" fontSize="19px" fontWeight="bold">
           Individual Terminal Report
                </SoftTypography>
              </Box>
              <Box>
                <IndividualSessionDetails data={data} id={locId} type={'terminal'}/>
              </Box>
            </Box> 
          </Grid>):null}
      </Grid>
      <Box className="go-to-dashboard-btn" sx={{marginTop:'300px'}}>
        <Button variant="contained" className="dash-btn" onClick={() => goToDashboard()}>
          Go to dashboard
        </Button>
      </Box>
    </DashboardLayout>
  );
};
