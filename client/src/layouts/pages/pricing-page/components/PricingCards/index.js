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

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Soft UI Dashboard PRO React example components
import DefaultPricingCard from 'examples/Cards/PricingCards/DefaultPricingCard';

import InstalledApps from '../../../../ecommerce/apps-integration/InstalledApp';

function PricingCards({ prices, monthlySubscriptionAndFeatures, annualSubscriptionAndFeatures, tabValue }) {
  // console.log('monthly', monthlySubscriptionAndFeatures);
  // console.log("annually",annualSubscriptionAndFeatures)

  // const [free, platinum] = tabValue == 0 ? monthlySubscriptionAndFeatures : annualSubscriptionAndFeatures;

  const [free, platinum, enterprise] = monthlySubscriptionAndFeatures;
  const [free1, platinum1, enterprise1] = annualSubscriptionAndFeatures;

  const enterpriseFeatures = enterprise?.features?.map((item) => ({
    label: item.featureName,
    includes: item.available,
  }));

  const platinumFeatures = platinum?.features?.map((item) => ({
    label: item.featureName,
    includes: item.available,
  }));

  const freeFeatures = free?.features?.map((item) => ({
    label: item.featureName,
    includes: item.available,
  }));

  // console.log(enterpriseFeatures,platinumFeatures)

  // const [starter, premium, enterprise] = prices;

  return (
    <SoftBox position="relative" zIndex={10} mt={-19} px={{ xs: 1, sm: 0 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={4} className="pricingCards">
          <DefaultPricingCard
            badge={{
              color: 'secondary',
              label: free?.packageName.charAt(0).toUpperCase() + free?.packageName.slice(1).toLowerCase(),
            }}
            price={{
              currency: '₹',
              value: tabValue == 0 ? free?.displayPrice : free1?.displayPrice,
              billingCycle: free?.billingCycle,
            }}
            specifications={freeFeatures}
            action={{
              type: 'internal',
              route: '/marketing/pallet-push',
              color: 'dark',
              label: 'Free',
            }}
            subscriptionAndFeatures={tabValue == 0 ? monthlySubscriptionAndFeatures : annualSubscriptionAndFeatures}
            tabValue={tabValue}
          />
        </Grid>
        <Grid item xs={12} lg={4} className="pricingCards">
          <DefaultPricingCard
            badge={{
              color: 'secondary',
              label: platinum?.packageName.charAt(0).toUpperCase() + platinum?.packageName.slice(1).toLowerCase(),
            }}
            price={{
              currency: '₹',
              value: tabValue == 0 ? platinum?.displayPrice : platinum1?.displayPrice,
              billingCycle: platinum?.billingCycle,
            }}
            specifications={platinumFeatures}
            action={{
              type: 'internal',
              route: '/marketing/pallet-push',
              color: 'dark',
              label: 'join',
            }}
            subscriptionAndFeatures={tabValue == 0 ? monthlySubscriptionAndFeatures : annualSubscriptionAndFeatures}
            tabValue={tabValue}
          />
        </Grid>
        <Grid item xs={12} lg={4} className="pricingCards">
          <DefaultPricingCard
            badge={{
              color: 'secondary',
              // label: enterprise?.packageName.charAt(0).toUpperCase() + enterprise?.packageName.slice(1).toLowerCase(),
              label:"Enterprise"
            }}
            price={{
              currency: '₹',
              value: tabValue == 0 ? enterprise?.displayPrice : enterprise1?.displayPrice,
              billingCycle: enterprise?.billingCycle,
            }}
            specifications={enterpriseFeatures}
            action={{
              type: 'enterprise',
              route: '/marketing/pallet-push',
              color: 'dark',
              label: 'contact us',
            }}
            subscriptionAndFeatures={tabValue == 0 ? monthlySubscriptionAndFeatures : annualSubscriptionAndFeatures}
            tabValue={tabValue}
          />
        </Grid>
      </Grid>
    </SoftBox>
  );
}

// Typechecking props for the PricingCards
PricingCards.propTypes = {
  prices: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PricingCards;
