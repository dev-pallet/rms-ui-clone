import './BillingPage.css';
import { Box, Container, Grid } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import StandardPlan from './StandardPlan';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';


const BillingPage = () => {
  const [tabValue, setTabValue] = useState(parseInt(localStorage.getItem('pricingPageTabVal')) || 0);

  const handleTabsChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const tabCurrent = parseInt(localStorage.getItem('pricingPageTabVal'));
    setTabValue(tabCurrent);
  }, [tabValue]);

  if (localStorage.getItem('rzp_checkout_anon_id')) {
    localStorage.removeItem('rzp_checkout_anon_id');
  }
  if (localStorage.getItem('rzp_device_id')) {
    localStorage.removeItem('rzp_device_id');
  }
  if (localStorage.getItem('rzp_checkout_user_id')) {
    localStorage.removeItem('rzp_checkout_user_id');
  }

  useEffect(() => {
    if (localStorage.getItem('rzp_checkout_anon_id')) {
      localStorage.removeItem('rzp_checkout_anon_id');
    }
    if (localStorage.getItem('rzp_device_id')) {
      localStorage.removeItem('rzp_device_id');
    }
    if (localStorage.getItem('rzp_checkout_user_id')) {
      localStorage.removeItem('rzp_checkout_user_id');
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="billing-page">
        <Box
          className="header-top"
          sx={{
            marginTop: '1rem',
          }}
        >
          <SoftTypography className="header-top-text">
            Upgrade to our Standard Plan today and experience a new level of convenience, value, and premium features
            that will make your experience truly extraordinary.
          </SoftTypography>
        </Box>

        <Container
          sx={{
            marginTop: '1rem',
          }}
        >
          <Grid container item xs={12} sm={10} md={8} lg={7} sx={{ mx: 'auto' }}>
            <SoftBox width="100%" mt={2}>
              <SoftBox>
                <Tabs
                  value={tabValue}
                  onChange={handleTabsChange}
                  TabIndicatorProps={{ style: { backgroundColor: '#0562FB' } }}
                >
                  <Tab
                    id="monthly"
                    label={
                      <SoftBox
                        py={0.5}
                        px={2}
                        sx={{
                          color: tabValue == 0 ? 'white !important' : null,
                        }}
                      >
                        Monthly
                      </SoftBox>
                    }
                  />
                  <Tab
                    id="annual"
                    label={
                      <SoftBox
                        py={0.5}
                        px={2}
                        sx={{
                          color: tabValue == 1 ? 'white !important' : null,
                        }}
                      >
                        Yearly (Save 7%)
                      </SoftBox>
                    }
                  />
                </Tabs>
              </SoftBox>
              {tabValue == 1 ? (
                <Box className="annaul-text-details">
                  <SoftTypography className="annual-text">Pay Once, Enjoy All Year- </SoftTypography>
                  <SoftTypography
                    sx={{
                      color: '#0562FB',
                    }}
                  >
                    Go Annual!
                  </SoftTypography>
                </Box>
              ) : null}
            </SoftBox>
          </Grid>
        </Container>

        <StandardPlan tabValue={tabValue} />
      </SoftBox>
    </DashboardLayout>
  );
};

export default BillingPage;
