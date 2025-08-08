import './sessionDetails.css';
import { Box, Grid } from '@mui/material';
import { IndividualSessionDetails } from '../individualSessionDetails/individualSessionDetails';
import { getLicenseActivity, getSessionDetailsForTerminal } from '../../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../../../examples/Navbars/DashboardNavbar';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import img from 'assets/images/online.png';
import img1 from 'assets/images/offline.png';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';

export const SessionDetailsPage = () => {
  const isMobileDevice = isSmallScreen();
  const [data, setData] = useState([]);
  const [totalSession, setTotalSession] = useState('');
  const [cclSession, setCclSession] = useState({});

  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const sessionId = localStorage.getItem('sessionId');

  const { licenseId, licenseName, status } = useParams();

  useEffect(() => {
    const locId = localStorage.getItem('locId');
    const orgId = localStorage.getItem('orgId');
    getSessionDetailsForTerminal(locId, licenseId).then((response) => {
      setCclSession(response?.data?.data?.terminalData?.terminalSalesData);
    });

    getLicenseActivity(locId, orgId, licenseId, sessionId).then((response) => {
      setData(response?.data?.userSessions);
      setTotalSession(response?.data?.totalSessions);
    });
  }, []);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <Box style={{ padding: '15px' }}>
        <Box className="session-details-span">
          <SoftTypography variant="h3" fontSize="19px" fontWeight="bold">
            {licenseName} -&nbsp;
          </SoftTypography>
          <Box className="session-details-span">
            <SoftTypography variant="h3" fontSize="19px" fontWeight="bold">
              {status == 'true' ? 'Active' : 'Inactive'}{' '}
            </SoftTypography>
            {status == 'true' ? (
              <img className="active-img-logo" src={img} alt="" />
            ) : (
              <img className="active-img-logo" src={img1} alt="" />
            )}
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} xl={7}>
            <Box mb={2} mt={2}>
              <SoftTypography variant="h3" fontSize="19px" fontWeight="bold">
                Cumulative Session Report
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
                    {totalSession || 0}
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    {cclSession?.totalOrders || 0}
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    {cclSession?.adjustedOrders || 0}
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    ₹ {cclSession?.cashOrdersValue || 0}
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    ₹ {cclSession?.upiOrdersValue || 0}
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    ₹ {cclSession?.cardOrdersValue || 0}
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    --
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    --
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    --
                  </SoftTypography>
                  <SoftTypography fontSize="16px" fontWeight="600" variant="h3">
                    --
                  </SoftTypography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {data ? (
            <Grid item xs={12} md={12} xl={7}>
              <Box mt={3} mb={2}>
                <SoftTypography variant="h3" fontSize="19px" fontWeight="bold">
                  Individual Session Report
                </SoftTypography>
              </Box>
              <IndividualSessionDetails data={data} id={licenseId} type={'session'} />
            </Grid>
          ) : null}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};
