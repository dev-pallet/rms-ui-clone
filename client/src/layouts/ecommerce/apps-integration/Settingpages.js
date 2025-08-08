import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmsIcon from '@mui/icons-material/Sms';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Card, Grid, Icon, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from '../../../components/Spinner';
import { createCommsOrg, notificationsLimit } from '../../../config/Services';
import GradientLineChart from '../../../examples/Charts/LineCharts/GradientLineChart';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import MainCard from '../../dashboard widgets/StockOverview/MainCard';
import { isSmallScreen } from '../Common/CommonFunction';
import Filter from '../Common/Filter';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'rgb(30, 136, 229)',
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  minHeight: '8.5rem',
  justifyContent: 'center',
  alignItems: 'flex-start',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(210.04deg, rgb(144, 202, 249) -50.94%, rgba(144, 202, 249, 0) 83.49%)',
    borderRadius: '50%',
    top: -30,
    right: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)',
    borderRadius: '50%',
    top: -160,
    right: -130,
  },
}));

function Settingspage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationChannelEl, setNotificationChannelEl] = useState(null);
  const [totalSms, setTotalSms] = useState('');
  const [usedSms, setUsedSms] = useState('');
  const [totalEmail, setTotalEmail] = useState('');
  const [usedEmail, setUsedEmail] = useState('');
  const [totalwhatsapp, setTotalwhatsapp] = useState('');
  const [usedwhatsapp, setUsedwhatsapp] = useState('');
  const [smsPresent, setSmsPresent] = useState(false);
  const [whatsappPresent, setWhatsappPresent] = useState(false);
  const [emailPresent, setEmailPresent] = useState(false);
  const [pushNotificationLimit, setPushNotificationLimit] = useState('');
  const [totalpush, setTotalpush] = useState('');
  const [usedpush, setUsedpush] = useState('');
  const [pushPresent, setPushPresent] = useState(false);

  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
    // navigate('/notificationsettings');
    navigate('/notification-category');
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNotificationChannelClick = (event) => {
    setNotificationChannelEl(event.currentTarget);
  };

  const handleNotificationChannelClose = () => {
    setNotificationChannelEl(null);
  };

  const orgId = localStorage.getItem('orgId');
  const username = localStorage.getItem('user_name');
  const emailCc = localStorage.getItem('user_details');
  const obj = JSON.parse(emailCc);
  const orgType = localStorage.getItem('contextType');
  const sourceApp = localStorage.getItem('sourceApp');
  const orgName = localStorage.getItem('orgName');

  const gradientChartData = {
    labels: ['0-5', '6-10', '10-15', '16-20', '21-25', '26-30'],
    datasets: [
      {
        label: 'New Subscribers',
        color: 'info',
        data: [5, 20, 30, 15, 10, 3],
      },
    ],
  };

  const payload = {
    orgRefId: orgId,
    orgName: orgId,
    orgType: orgType,
    orgPhoneNo: '',
    orgEmail: obj?.email,
    orgWhatsappNo: '',
    tenantId: obj?.tennatId,
    tenantType: '',
    workingHours: '',
    timeZone: '',
    createdBy: '',
    smsLimit: '10000',
    emailLimit: '20000',
    whatsappLimit: '30000',
    pushNotificationLimit: '10000',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        createCommsOrg(payload).then((res) => {
          setClientId(res?.data?.data?.nmsConfigEntity?.clientId);
          setClientName(res?.data?.data?.nmsConfigEntity?.clientName);
          notificationsLimit(res?.data?.data?.nmsConfigEntity?.clientName).then((response) => {
            if (response?.data?.data?.smsLimit) {
              setTotalSms(response?.data?.data?.smsLimit);
              setUsedSms(response?.data?.data?.usedSmsLimit);
              setSmsPresent(true);
              setLoading(false);
            }
            if (response?.data?.data?.emailLimit) {
              setTotalEmail(response?.data?.data?.emailLimit);
              setUsedEmail(response?.data?.data?.usedEmailLimit);
              setEmailPresent(true);
              setLoading(false);
            }
            if (response?.data?.data?.whatsappLimit) {
              setWhatsappPresent(true);
              setTotalwhatsapp(response?.data?.data?.whatsappLimit);
              setUsedwhatsapp(response?.data?.data?.usedWhatsappLimit);
              setLoading(false);
            }
            if (response?.data?.data?.pushNotifyLimit) {
              setPushPresent(true);
              setTotalpush(response?.data?.data?.pushNotifyLimit);
              setUsedpush(response?.data?.data?.usedPushNotifyLimit);
              setLoading(false);
            }
          });
        });
      } catch (error) {
        showSnackbar('Error: Data not Fetched', 'error');
      }
    };
    fetchData();
  }, []);

  const calculatePercent = (value, total) => {
    const percent = (value / total) * 100;
    return percent;
  };

  useEffect(() => {
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('clientName', clientName);
    localStorage.setItem('pushNotificationLimit', totalpush);
  }, [clientId, clientName, totalpush]);

  const handleMouseLeave = () => {
    if (!anchorEl) {
      handleMenuClose();
    }
  };

  // filters
  // SMS
  // Email
  // Whatsapp
  // Push Notifications

  const selectBox = (
    <>
      <SoftBox
        sx={{
          width: '100%',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <SoftSelect
          sx={{
            width: '100%',
          }}
          placeholder="SMS"
          options={[
            { value: 'SMS', label: 'SMS' },
            { value: 'SMS', label: 'Email' },
            { value: 'SMS', label: 'WhatsApp' },
            { value: 'SMS', label: 'Push Notification' },
          ]}
        />
      </SoftBox>
    </>
  );

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [selectBox];
  const isMobileDevice = isSmallScreen();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {loading && <Spinner />}
      <div style={{ marginBottom: '30px' }}>
        <SoftButton sx={{ float: 'right' }} className="vendor-add-btn" onClick={handleButtonClick}>
          {/* <SettingsIcon sx={{ marginRight: '0.5rem' }} fontSize="small" /> */}
          Enable Notifications
        </SoftButton>
        <Typography>Notification Usage</Typography>
      </div>
      <Grid container spacing={1} style={{ ml: '10px -20px', padding: '10px' }}>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <SoftBox mb={3}>
            {smsPresent && (
              <div className="campaign-dashboard-card-box" style={{ width: isMobileDevice ? '' : '250px' }}>
                <div className="campaign-dashboard-inner-box">
                  <div
                    className="campaign-dashboard-card-img"
                    style={{ background: 'linear-gradient(60deg, #5E35B1, #039BE5)' }}
                  >
                    <SmsIcon sx={{ fontSize: '40px', color: '#fff' }} />
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.9rem',
                        fontWeight: '200',
                        textAlign: 'right',
                      }}
                    >
                      SMS
                    </Typography>
                    <Typography style={{ fontSize: '16px' }}>
                      <span style={{ fontSize: '24px', fontWeight: '400' }}>{usedSms}</span>/{totalSms}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </SoftBox>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <SoftBox mb={3}>
            {emailPresent && (
              <div className="campaign-dashboard-card-box" style={{ width: isMobileDevice ? '' : '250px' }}>
                <div className="campaign-dashboard-inner-box">
                  <div
                    className="campaign-dashboard-card-img"
                    style={{ background: 'linear-gradient(60deg, #F50057, #FF8A80)' }}
                  >
                    <EmailIcon sx={{ fontSize: '40px', color: '#fff' }} />
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.9rem',
                        fontWeight: '200',
                        textAlign: 'right',
                      }}
                    >
                      Email
                    </Typography>
                    <Typography style={{ fontSize: '16px' }}>
                      <span style={{ fontSize: '24px', fontWeight: '400' }}>{usedEmail}</span>/{totalEmail}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </SoftBox>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <SoftBox mb={3}>
            {whatsappPresent && (
              <div className="campaign-dashboard-card-box" style={{ width: isMobileDevice ? '' : '250px' }}>
                <div className="campaign-dashboard-inner-box">
                  <div
                    className="campaign-dashboard-card-img"
                    style={{ background: 'linear-gradient(60deg, #fb8c00, #FFCA29)' }}
                  >
                    <WhatsAppIcon sx={{ fontSize: '40px', color: '#fff' }} />
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.9rem',
                        fontWeight: '200',
                        textAlign: 'right',
                      }}
                    >
                      Whatsapp
                    </Typography>
                    <Typography style={{ fontSize: '16px' }}>
                      <span style={{ fontSize: '24px', fontWeight: '400' }}>{usedwhatsapp}</span>/{totalwhatsapp}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </SoftBox>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <SoftBox mb={3}>
            {pushPresent && (
              <div className="campaign-dashboard-card-box" style={{ width: isMobileDevice ? '' : '250px' }}>
                <div className="campaign-dashboard-inner-box">
                  <div
                    className="campaign-dashboard-card-img"
                    style={{ background: 'linear-gradient(60deg, #43A047, #FFEB3B)' }}
                  >
                    <NotificationsIcon sx={{ fontSize: '40px', color: '#fff' }} />
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.9rem',
                        fontWeight: '200',
                        textAlign: 'right',
                      }}
                    >
                      Push Notifications
                    </Typography>
                    <Typography style={{ fontSize: '16px', textAlign: 'right' }}>
                      <span style={{ fontSize: '24px', fontWeight: '400' }}>{usedpush}</span>/{totalpush}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </SoftBox>
        </Grid>
      </Grid>
      {/* 
      <div style={{ marginBottom: '30px' }}>
        <Typography>Active Subscribers</Typography>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={5} lg={3}>
          <SoftBox mb={3}>
            <Card className="cardname1">
              <Typography
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  lineHeight: '2',
                  color: '#fff',
                  backgroundColor: '#0562FB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}
              >
                SMS
              </Typography>{' '}
              <Typography style={{ fontSize: '20px' }}>NA</Typography>
            </Card>
          </SoftBox>
        </Grid>

        <Grid item xs={12} sm={5} lg={3}>
          <SoftBox mb={3}>
            <Card className="cardname1">
              <Typography
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  lineHeight: '2',
                  color: '#fff',
                  backgroundColor: '#0562FB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}
              >
                Email
              </Typography>{' '}
              <Typography style={{ fontSize: '20px' }}>NA</Typography>
            </Card>
          </SoftBox>
        </Grid>

        <Grid item xs={12} sm={5} lg={3}>
          <SoftBox mb={3}>
            <Card className="cardname1">
              <Typography
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  lineHeight: '2',
                  color: '#fff',
                  backgroundColor: '#0562FB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}
              >
                Whatsapp
              </Typography>{' '}
              <Typography style={{ fontSize: '20px' }}>NA</Typography>
            </Card>
          </SoftBox>
        </Grid>

        <Grid item xs={12} sm={5} lg={3}>
          <SoftBox mb={3}>
            <Card className="cardname1">
              <Typography
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  lineHeight: '2',
                  color: '#fff',
                  backgroundColor: '#0562FB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}
              >
                Push Notifications
              </Typography>{' '}
              <Typography style={{ fontSize: '20px' }}>NA</Typography>
            </Card>
          </SoftBox>
        </Grid>
      </Grid> */}

      <Grid container spacing={2} style={{ padding: '10px' }}>
        <Grid item xs={12} lg={6} sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '40px', right: '20px', zIndex: '100', backgroundColor: 'black' }}>
            <Filter color="dark" selectBoxArray={selectBoxArray} />
          </Box>
          <GradientLineChart
            title="New Customers (last 30 days)"
            description={
              <SoftBox display="flex" alignItems="center">
                <SoftBox fontSize={30} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                  <Icon sx={{ fontWeight: 'bold' }}>arrow_upward</Icon>
                </SoftBox>
                <SoftTypography variant="button" color="text" fontWeight="medium">
                  25% more{' '}
                  <SoftTypography variant="button" color="text" fontWeight="regular">
                    in 2022
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
            }
            chart={gradientChartData}
          />
        </Grid>
        <Grid item xs={12} lg={6} sx={{ position: 'relative' }}>
          <SoftBox mb={3}>
            <Card className="cardname1" mr={isMobileDevice ? '0px !important' : '30px'}>
              <Typography
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  lineHeight: '2',
                  color: '#fff',
                  backgroundColor: '#0562FB',
                  borderRadius: '10px',
                  marginBottom: '5px',
                }}
              >
                Current Plan
              </Typography>{' '}
              <hr />
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '100px' }}>
                <div>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', marginTop: '5px' }}>
                    Subscribed Plan:
                  </Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left' }}>Total SMS:</Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left' }}>Total Email:</Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left' }}>Total Whatsapp:</Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left' }}>Total Push Notifications:</Typography>

                  <Typography style={{ fontSize: '12px', textAlign: 'left', marginTop: '5px' }}>
                    Last Purchased:
                  </Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left' }}>Next Renewal:</Typography>
                </div>
                <div>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', marginTop: '5px', fontWeight: '600' }}>
                    NA
                  </Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', fontWeight: '600' }}>NA</Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', fontWeight: '600' }}>NA</Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', fontWeight: '600' }}>NA</Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', fontWeight: '600' }}>NA</Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', marginTop: '5px', fontWeight: '600' }}>
                    NA
                  </Typography>
                  <Typography style={{ fontSize: '12px', textAlign: 'left', fontWeight: '600' }}>NA</Typography>
                </div>
              </div>
              <SoftButton
                style={{
                  marginTop: '10px',
                  backgroundColor: '#0562FB',
                  color: '#fff',
                  width: '100px',
                  marginLeft: 'auto',
                }}
              >
                Renew
              </SoftButton>
            </Card>
          </SoftBox>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Settingspage;
