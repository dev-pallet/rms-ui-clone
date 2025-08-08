import EmailIcon from '@mui/icons-material/Email';
import PercentIcon from '@mui/icons-material/Percent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftProgress from '../../../../components/SoftProgress';
import SoftTypography from '../../../../components/SoftTypography';
import GradientLineChart from '../../../../examples/Charts/LineCharts/GradientLineChart';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { isSmallScreen } from '../../Common/CommonFunction';
import CustomDoughnutChart from '../CustomDoughnutChart';
import './Overview.css';

function CircularProgressWithLabel(props) {
  const { value, color } = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} color={color} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

const MarketingOverview = () => {
  const [progress, setProgress] = useState(10);
  const gradientChartDataCust = {
    labels: ['Nov', 'Dec', 'Jan'],
    datasets: [
      {
        label: 'New Customers',
        color: 'info',
        data: [4, 8, 10],
      },
    ],
  };

  const campaign1value = 25;
  const campaign2value = 17;
  const campaign3value = 13;

  const isMobileDevice = isSmallScreen();
  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container spacing={2} style={{ margin: '10px -20px', padding: '10px' }}>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  Campaign Overview
                </Typography>
              </div>
              <div
                className="marketing-overview-mail-stats-box"
                style={{ height: '80px', justifyContent: 'flex-start' }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.7rem',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  10 <span style={{ fontSize: '0.8rem', fontWeight: 200 }}>Active Campaigns</span>
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box" style={{ paddingBottom: '20px' }}>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  Mail Statistics
                </Typography>
              </div>
              <div className="marketing-overview-mail-stats-box">
                <CustomDoughnutChart value={40} total={100} />
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="marketing-overview-mail-stats-inner">
                      <div className="marketing-overview-mail-dot" style={{ background: '#7ED957' }}></div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.7rem',
                          fontWeight: '200',
                          textAlign: 'center',
                        }}
                      >
                        Sent
                      </Typography>
                    </div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textAlign: 'left',
                        marginLeft: '15px',
                      }}
                    >
                      100
                    </Typography>
                  </div>
                  <div>
                    <div className="marketing-overview-mail-stats-inner">
                      <div className="marketing-overview-mail-dot" style={{ background: '#FF5757' }}></div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.7rem',
                          fontWeight: '200',
                          textAlign: 'center',
                        }}
                      >
                        Cancel
                      </Typography>
                    </div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textAlign: 'left',
                        marginLeft: '15px',
                      }}
                    >
                      40
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  Channel Effectiveness
                </Typography>
                <div className="marketing-overview-mail-stats-box" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '1rem',
                        fontWeight: '200',
                        textAlign: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      SMS
                    </Typography>
                    <CircularProgressWithLabel value={10} color="success" />
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '1rem',
                        fontWeight: '200',
                        textAlign: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      Email
                    </Typography>
                    <CircularProgressWithLabel value={25} color="secondary" />
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '1rem',
                        fontWeight: '200',
                        textAlign: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      Whatsapp
                    </Typography>
                    <CircularProgressWithLabel value={50} color="inherit" />
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ margin: '10px -20px', padding: '10px' }}>
          <Grid item lg={4} xs={12} sm={6} md={6}>
            <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
              <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Campaign Insights</SoftTypography>
            </SoftBox>
            <div className="marketing-overview-second-box">
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#214053',
                  fontSize: '1rem',
                  fontWeight: '200',
                  textAlign: 'left',
                }}
              >
                Campaign Performance (last month)
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#214053',
                  fontSize: '0.8rem',
                  fontWeight: '200',
                  textAlign: 'left',
                  marginTop: '10px',
                }}
              >
                Total Budget Utilization
              </Typography>
              <div className="marketing-overview-second-box-inner">
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.7rem',
                      fontWeight: '600',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    ₹202.5K
                  </Typography>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.8rem',
                        fontWeight: '200',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      Offline
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.8rem',
                        fontWeight: '200',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      ₹60.5K
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.8rem',
                        fontWeight: '200',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      Coupons
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.8rem',
                        fontWeight: '200',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      ₹120.5K
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.8rem',
                        fontWeight: '200',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      Loyalty
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '0.8rem',
                        fontWeight: '200',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      ₹52.5K
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="marketing-overview-second-box" style={{ marginTop: '10px' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#214053',
                  fontSize: '1rem',
                  fontWeight: '200',
                  textAlign: 'left',
                }}
              >
                Top 3 Campaigns by Conversion
              </Typography>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    Campaign 1
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.6rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    25%
                  </Typography>
                </div>
                <div style={{ marginTop: '5px' }}>
                  <SoftProgress variant="gradient" value={campaign1value} />
                </div>
              </div>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    Campaign 2
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.6rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    17%
                  </Typography>
                </div>
                <div style={{ marginTop: '5px' }}>
                  <SoftProgress variant="gradient" value={campaign2value} />
                </div>
              </div>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    Campaign 3
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.6rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    13%
                  </Typography>
                </div>
                <div style={{ marginTop: '5px' }}>
                  <SoftProgress variant="gradient" value={campaign3value} />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item lg={8} xs={12} sm={6} md={6}>
            <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
              <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Customer Insights</SoftTypography>
            </SoftBox>
            <div className="marketing-overview-second-box">
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#214053',
                  fontSize: '1rem',
                  fontWeight: '200',
                  textAlign: 'left',
                }}
              >
                Customers (last month)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    Total Number
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.7rem',
                      fontWeight: '600',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    5670
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    This Month
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    <TrendingUpIcon /> 700 last month
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1rem',
                      fontWeight: '200',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    Customer Value
                  </Typography>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: '50px' }}>
                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          textAlign: 'left',
                          marginTop: '10px',
                        }}
                      >
                        ₹700
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.8rem',
                          fontWeight: '200',
                          textAlign: 'left',
                        }}
                      >
                        LTV
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          textAlign: 'left',
                          marginTop: '10px',
                        }}
                      >
                        ₹150
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.8rem',
                          fontWeight: '200',
                          textAlign: 'left',
                        }}
                      >
                        CAC
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          textAlign: 'left',
                          marginTop: '10px',
                        }}
                      >
                        2mth
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.8rem',
                          fontWeight: '200',
                          textAlign: 'left',
                        }}
                      >
                        Average Lifetime
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          textAlign: 'left',
                          marginTop: '10px',
                        }}
                      >
                        x 2.28
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.8rem',
                          fontWeight: '200',
                          textAlign: 'left',
                        }}
                      >
                        LTV.CAC Ratio
                      </Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
                  <GradientLineChart chart={gradientChartDataCust} />
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <SoftBox style={{ marginTop: '20px' }}>
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Email</SoftTypography>
        </SoftBox>
        <Grid container spacing={2} style={{ margin: '10px -20px', padding: '10px' }}>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.9rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    Email sent to customers
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    2000{' '}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <div className="marketing-overview-inc-box">
                      <Typography style={{ fontSize: '0.7rem', fontWeight: 200, color: '#0562FB' }}>
                        <TrendingUpIcon /> 50%
                      </Typography>
                    </div>
                    <Typography style={{ fontSize: '0.7rem', fontWeight: 200, color: '#0562FB', marginTop: '5px' }}>
                      Since Last Month
                    </Typography>
                  </div>
                </div>
                <div
                  className="marketing-overview-dash-images"
                  style={{ background: 'linear-gradient(60deg, #BF40BF, #CBC3E3)' }}
                >
                  <EmailIcon sx={{ fontSize: '30px', color: '#fff' }} />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.9rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    Average Open Rate
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    70.65%{' '}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <div className="marketing-overview-inc-box">
                      <Typography style={{ fontSize: '0.7rem', fontWeight: 200, color: '#0562FB' }}>
                        <TrendingUpIcon /> 50%
                      </Typography>
                    </div>
                    <Typography style={{ fontSize: '0.7rem', fontWeight: 200, color: '#0562FB', marginTop: '5px' }}>
                      Since Last Month
                    </Typography>
                  </div>
                </div>
                <div
                  className="marketing-overview-dash-images"
                  style={{ background: 'linear-gradient(60deg, #43A047, #FFEB3B)' }}
                >
                  <PercentIcon sx={{ fontSize: '30px', color: '#fff' }} />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.9rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    Unsubscribe Rate
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    3.01%{' '}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <div className="marketing-overview-inc-box">
                      <Typography style={{ fontSize: '0.7rem', fontWeight: 200, color: '#0562FB' }}>
                        <TrendingUpIcon /> 50%
                      </Typography>
                    </div>
                    <Typography style={{ fontSize: '0.7rem', fontWeight: 200, color: '#0562FB', marginTop: '5px' }}>
                      Since Last Month
                    </Typography>
                  </div>
                </div>
                <div
                  className="marketing-overview-dash-images"
                  style={{ background: 'linear-gradient(60deg, #ff0000, #ff6347 )' }}
                >
                  <PercentIcon sx={{ fontSize: '30px', color: '#fff' }} />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ margin: '10px -20px', padding: '10px' }}>
          <Grid item lg={6} xs={12} sm={6} md={6}>
            <div className="marketing-overview-second-box" style={{ height: '215px' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#214053',
                  fontSize: '1rem',
                  fontWeight: '200',
                  textAlign: 'left',
                }}
              >
                Bounce Rate
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.7rem',
                      fontWeight: '600',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    5%{' '}
                    <span style={{ fontSize: '0.7rem' }}>
                      <TrendingUpIcon /> 50%
                    </span>
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.7rem',
                      fontWeight: '200',
                      textAlign: 'left',
                    }}
                  >
                    v last month
                  </Typography>
                </div>
                <CustomDoughnutChart value={10} total={100} />
                <div>
                  <div>
                    <div className="marketing-overview-mail-stats-inner">
                      <div className="marketing-overview-mail-dot" style={{ background: '#7ED957' }}></div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.7rem',
                          fontWeight: '200',
                          textAlign: 'left',
                        }}
                      >
                        Soft Bounce
                      </Typography>
                    </div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textAlign: 'left',
                        marginLeft: '20px',
                      }}
                    >
                      544
                    </Typography>
                  </div>

                  <div>
                    <div className="marketing-overview-mail-stats-inner">
                      <div className="marketing-overview-mail-dot" style={{ background: '#FF5757' }}></div>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#214053',
                          fontSize: '0.7rem',
                          fontWeight: '200',
                          textAlign: 'left',
                        }}
                      >
                        Hard Bounce
                      </Typography>
                    </div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#214053',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textAlign: 'left',
                        marginLeft: '20px',
                      }}
                    >
                      10
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item lg={6} xs={12} sm={6} md={6}>
            <div className="marketing-overview-second-box">
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#214053',
                  fontSize: '1rem',
                  fontWeight: '200',
                  textAlign: 'left',
                }}
              >
                Churn Rate
              </Typography>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    marginTop: '10px',
                  }}
                >
                  15%
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'left',
                  }}
                >
                  Overall customer churn rate
                </Typography>
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    marginTop: '10px',
                  }}
                >
                  3.06%
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'left',
                  }}
                >
                  Avg. monthly customer churn rate
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </DashboardLayout>
    </div>
  );
};

export default MarketingOverview;
