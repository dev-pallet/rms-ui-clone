/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';

// @mui material components
import Container from '@mui/material/Container';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Soft UI Dashboard PRO React example components
import PageLayout from 'examples/LayoutContainers/PageLayout';

// Pricing page components
import Header from 'layouts/pages/pricing-page/components/Header';
import Footer from 'layouts/pages/pricing-page/components/Footer';
import PricingCards from 'layouts/pages/pricing-page/components/PricingCards';
import TrustedBrands from 'layouts/pages/pricing-page/components/TrustedBrands';
import Faq from 'layouts/pages/pricing-page/components/Faq';
import { fetchAllMonthlyAndAnuallySubscriptionsAndFeatures } from '../../../config/Services';
import SoftTypography from '../../../components/SoftTypography';
import './pricing-page.css';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles((theme) => ({
//   tabs: {
//     backgroundColor: 'white', // Background color of the tabs
//     color: 'black', // Text color of the tabs
//   },
// }));

function PricingPage() {
  // const classes = useStyles();

  const [tabValue, setTabValue] = useState(parseInt(localStorage.getItem('pricingPageTab')) || 0);
  const [prices, setPrices] = useState(['59', '89', '99']);
  const [monthlySubscriptionAndFeatures, setMonthlySubscriptionAndFeatures] = useState([]);
  const [annualSubscriptionAndFeatures, setAnnualSubscriptionAndFeatures] = useState([]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (event.currentTarget.id === 'annual') {
      setPrices(['119', '159', '399']);
    } else {
      setPrices(['59', '89', '99']);
    }
  };

  useEffect(() => {
    const tabExists = localStorage.getItem('pricingPageTabVal');
    if (tabExists !== null) {
      setTabValue(parseInt(tabExists));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pricingPageTabVal', tabValue.toString());
  }, [tabValue]);
  // console.log("tabValue",tabValue);

  const fetchSubscriptionAndFeatures = async () => {
    try {
      const resp = await fetchAllMonthlyAndAnuallySubscriptionsAndFeatures();
      // console.log('subscriptionPlanResult', resp);
      const result = resp.data.data.data;
      // console.log('subscriptionResult', result);
      const monthlyPlan = result.filter((item) => item.billingCycle == 'MONTHLY');
      const annualPlan = result.filter((item) => item.billingCycle == 'ANNUAL');

      // console.log('monthlyPlan', monthlyPlan);
      // console.log('annualPlan', annualPlan);
      setMonthlySubscriptionAndFeatures(monthlyPlan);
      setAnnualSubscriptionAndFeatures(annualPlan);
    } catch (err) {}
  };

  useEffect(() => {
    fetchSubscriptionAndFeatures();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="pricing-details">
        <SoftTypography className="pricing-text1">Choose Your Plan</SoftTypography>
        <SoftTypography className="pricing-text2">Get the right plan for your business.</SoftTypography>
        <SoftTypography className="pricing-text2">You can easily change the plan in the future.</SoftTypography>
      </SoftBox>

      <Container>
        <Grid container item xs={12} sm={10} md={8} lg={7} sx={{ mx: 'auto' }}>
          <SoftBox width="100%" mt={2}>
            <SoftBox>
              <Tabs
                value={tabValue}
                onChange={handleSetTabValue}
                TabIndicatorProps={{ style: { backgroundColor: '#343767' } }}
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
          </SoftBox>
        </Grid>
      </Container>

      <Container sx={{ paddingTop: '150px' }}>
        <PricingCards
          prices={prices}
          monthlySubscriptionAndFeatures={monthlySubscriptionAndFeatures}
          annualSubscriptionAndFeatures={annualSubscriptionAndFeatures}
          tabValue={tabValue}
        />
      </Container>
    </DashboardLayout>
  );
}

export default PricingPage;
