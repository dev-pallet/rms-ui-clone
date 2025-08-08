import { Container, Grid, Icon } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

import { CouponDashboardApi } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import GradientLineChart from '../../../../examples/Charts/LineCharts/GradientLineChart';
import MiniStatisticsCard from '../../../../examples/Cards/StatisticsCards/MiniStatisticsCard';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import gradientLineChartData from '../../../dashboards/default/data/gradientLineChartData';
function Couponsettings() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationChannelEl, setNotificationChannelEl] = useState(null);
  const [CouponData, SetCouponData] = useState();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  useEffect(() => {
    const payload = {
      orgId: orgId,
      orgLocId: locId,
    };
    CouponDashboardApi(payload)
      .then((res) => {
        SetCouponData(res?.data?.data);
      })
      .catch((err) => {});
  }, []);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
    navigate('/marketing/Coupons');
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

  const handleMouseLeave = () => {
    if (!anchorEl) {
      handleMenuClose();
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Container sx={{ marginBottom: '100px' }}>
        {/* <Paper
          elevation={3}
          sx={{
            float: 'right',
            marginRight: '1rem',
            display: 'flex',
            padding: '10px',
            borderRadius: '7px',
            marginBottom: '20px',
          }}
          onClick={handleButtonClick}
        >
          <SettingsIcon fontSize="small" />
          <Typography style={{ fontSize: '12px', fontWeight: '700' }}>Settings</Typography>
        </Paper> */}
        <SoftButton sx={{ float: 'right' }} variant="gradient" color="info" onClick={handleButtonClick}>
          <SettingsIcon sx={{ marginRight: '0.5rem' }} fontSize="small" />
          Settings
        </SoftButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>Notification</MenuItem>
          <MenuItem onClick={handleMenuClose}>Change Plan</MenuItem>
          <MenuItem onClick={handleNotificationChannelClick}>Notification Channels</MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationChannelEl}
          open={Boolean(notificationChannelEl)}
          onClose={handleNotificationChannelClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleNotificationChannelClose}>
            Sms <ArrowForwardIcon /> connect
          </MenuItem>
          <MenuItem onClick={handleNotificationChannelClose}>
            whatsapp <ArrowForwardIcon /> connect
          </MenuItem>
          <MenuItem onClick={handleNotificationChannelClose}>
            Email <ArrowForwardIcon /> connect
          </MenuItem>
          <MenuItem onClick={handleNotificationChannelClose}>
            Push notification <ArrowForwardIcon /> connect
          </MenuItem>
        </Menu>
      </Container>

      {/* <Container sx={{display: window.innerWidth < 800 ? 'block' : 'flex',marginTop:"50px"}}>
       <Card sx={{ minWidth: 300 ,maxWidth:500,marginRight:"40px",marginBottom:"30px"}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="gray" gutterBottom>
          Connected
        </Typography>
        <Typography variant="h5" component="div">
          S M S
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="blue">
          500
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          "a benevolent smile"'
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>

    <Card sx={{ minWidth: 300 , maxWidth:500,marginRight:"40px",marginBottom:"30px"}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="gray" gutterBottom>
          Connected
        </Typography>
        <Typography variant="h5" component="div">
          EMAIL
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="blue">
          1200
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          "a benevolent smile"'
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
     </Container> */}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <SoftBox mb={3}>
            <MiniStatisticsCard
              title={{ text: 'Active Coupons', fontWeight: 'bold' }}
              count={CouponData?.activeCoupons || 'NA'}
              percentage={{ color: 'success', text: '+63%' }}
              icon={{ color: 'info', component: 'paid' }}
            />
          </SoftBox>
          <SoftBox mb={3}>
            <MiniStatisticsCard
              title={{ text: 'Used Coupons', fontWeight: 'bold' }}
              count={CouponData?.usedCoupon || 'NA'}
              percentage={{ color: 'success', text: '+58%' }}
              icon={{ color: 'info', component: 'paid' }}
            />
          </SoftBox>
          <SoftBox mb={3}>
            <MiniStatisticsCard
              title={{ text: 'Scheduled Coupons', fontWeight: 'bold' }}
              count={CouponData?.scheduledCoupon || 'NA'}
              percentage={{ color: 'success', text: '+40%' }}
              icon={{ color: 'info', component: 'paid' }}
            />
          </SoftBox>
        </Grid>
        <Grid item xs={12} sm={5}>
          <SoftBox mb={3}>
            <MiniStatisticsCard
              title={{ text: 'expired Coupons', fontWeight: 'bold' }}
              count={CouponData?.expiredCoupon || 'NA'}
              percentage={{ color: 'success', text: '+70%' }}
              icon={{ color: 'info', component: 'paid' }}
            />
          </SoftBox>
          <SoftBox mb={3}>
            <MiniStatisticsCard
              title={{ text: 'Total value', fontWeight: 'bold' }}
              count={CouponData?.totalValue || 'NA'}
              percentage={{ color: 'success', text: '+60%' }}
              icon={{ color: 'info', component: 'paid' }}
            />
          </SoftBox>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={7}>
        <GradientLineChart
          title="Coupon Overview"
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
          chart={gradientLineChartData}
        />
      </Grid>
    </DashboardLayout>
  );
}

export default Couponsettings;
