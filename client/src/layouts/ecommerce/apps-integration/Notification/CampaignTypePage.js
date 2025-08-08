import { Grid, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';

const CampaignTypePage = () => {
  const navigate = useNavigate();
  const typeSelectionArray = [
    {
      image: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/5.png',
      title: 'Automated Campaigns',
      des: 'Automate multi-channel campaigns effortlessly and reach your contacts seamlessly.',
      label: 'Create New',
      route: '/marketing/campaigns/automated',
    },
    {
      image: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/8.png',
      title: 'Whatsapp Campaigns',
      des: 'Elevate your marketing game – reach contacts instantly with WhatsApp campaigns with just one click!',
      label: 'Create New',
      route: '/campaigns/whatsapp',
    },
    {
      image: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/6.png',
      title: 'Rewards',
      des: 'Send referral and rewards campaigns effortlessly to engage and reward your contacts.',
      label: 'Create New',
      route: '',
    },
    {
      image: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/7.png',
      title: 'Push Notifications',
      des: 'Boost engagement with targeted push notification campaigns sent directly to your contacts!',
      label: 'Create New',
      route: '/campaigns/push',
    },
  ];

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox>
          <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold" style={{ marginBottom: '20px' }}>
            Select Campaign Type
          </SoftTypography>
        </SoftBox>
        <Grid container spacing={3}>
          {typeSelectionArray?.map((e) => (
            <Grid item xs={12} md={6} xl={4} style={{ flexBasis: '24.333%' }}>
              <div className="campaign-template-single-box">
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <img src={e.image} />
                  <Typography className="campaign-template-box-header">{e.title}</Typography>
                  <Typography className="campaign-template-box-typo">{e.des}</Typography>
                </div>
                <Typography className="campaign-template-box-create-new" onClick={() => navigate(e.route)}>
                  Create new{' '}
                  <span style={{ verticalAlign: 'middle' }}>
                    <ArrowForwardIosIcon />
                  </span>
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </DashboardLayout>
    </div>
  );
};

export default CampaignTypePage;
