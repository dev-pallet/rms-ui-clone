import './Notificationsettings.css';
import { Grid, Typography } from '@mui/material';
import { subscriptionPlanDetailsForPricingPlans } from '../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomCard from './CustomComponents/CustomCard';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';

const Notificationsettings = () => {
  const accountId = localStorage.getItem('AppAccountId');
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleClose = () => {
    setAnchorEl(null);
    navigate('/pricingPage');
  };

  const handlenotificationchannel = () => {
    navigate('/notificationconnect');
  };

  const handlenotification = () => {
    // old
    // navigate('/allnotificationpage');
    // new
    navigate('/notification-category');
  };

  const handleCampaignOpen = () => {
    navigate('/campaigns');
  };

  const fetchPlanDetails = async () => {
    const payload = {
      accountId: accountId,
    };
    try {
      const response = await subscriptionPlanDetailsForPricingPlans(payload);
      // console.log(response);
      if (response?.data?.data?.es == 0) {
        const result = response.data.data;
        localStorage.setItem('accountSubscriptionId', result.accountSubscription.accountSubscriptionId);

        const activePlanDetails = {
          billingCycle: result.subscriptionPlan.billingCycle,
          planName: result.subscriptionPlan.packageName,
          startDate: result.accountSubscription.startDate,
          netPrice: result.subscriptionPlan.netPrice,
          endDate: result.accountSubscription.endDate,
          subscriptionId: result.accountSubscription.subscriptionId,
        };

        localStorage.setItem('activePlanDetails', JSON.stringify(activePlanDetails));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchPlanDetails();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Grid container className="cards">
        <Grid item xs={12} sm={12} md={3} xl={4} onClick={handlenotificationchannel}>
          <CustomCard className="cardname-category">
            <Typography style={{ fontWeight: '600', fontSize: '1rem', lineHeight: '2', color: '#4b524d' }}>
              Notification Channel{' '}
              <div>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/notification%20(1).png"
                  style={{ height: '50px' }}
                />
              </div>
            </Typography>{' '}
          </CustomCard>
        </Grid>

        {/* <Grid item xs={12} sm={12} md={3} xl={4}>
          <Card className="cardname" onClick={handlenotification}>
            <Typography style={{ fontWeight: '600', fontSize: '1rem', lineHeight: '2', color: '#4b524d' }}>
              Notification{' '}
            </Typography>{' '}
            <span>
              <img
                src="https://i.postimg.cc/qMSgn0MS/notification-2.png"
                style={{ height: '50px', width: '50px' }}
              />
            </span>
          </Card>
        </Grid> */}

        <Grid item xs={12} sm={12} md={3} xl={4} onClick={handleClose}>
          <CustomCard className="cardname-category">
            <Typography style={{ fontWeight: '600', fontSize: '1rem', lineHeight: '2', color: '#4b524d' }}>
              Change Plan{' '}
            </Typography>{' '}
            <span>
              <img
                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/subscription.png"
                style={{ height: '50px', width: '50px' }}
              />
            </span>
          </CustomCard>
        </Grid>

        {/* <Grid item xs={12} sm={12} md={3} xl={4}>
          <Card className="cardname" onClick={handleClose}>
            <Typography style={{ fontWeight: '600', fontSize: '1rem', lineHeight: '2', color: '#4b524d' }}>
              Contacts{' '}
            </Typography>{' '}
            <span>
              <img
                src="https://i.postimg.cc/KvhBBLbR/customer.png"
                style={{ height: '50px', width: '50px' }}
              />
            </span>
          </Card>
        </Grid> */}
      </Grid>
    </DashboardLayout>
  );
};

export default Notificationsettings;
