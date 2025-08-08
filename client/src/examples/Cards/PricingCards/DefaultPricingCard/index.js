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

import { useState } from 'react';

// react-router-dom components
import { Link } from 'react-router-dom';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import Box from '@mui/material/Box';
import SoftTypography from 'components/SoftTypography';
import SoftBadge from 'components/SoftBadge';
import SoftButton from 'components/SoftButton';
import { useNavigate } from 'react-router-dom';
import {
  activateSubscriptionForPricingPlans,
  createUpgradeSubscriptionPlan,
  getFeatureSettings,
} from '../../../../config/Services';
import Swal from 'sweetalert2';
import './index.css';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import SkeletonLoader from './SkeletonLoader';
import Spinner from '../../../../components/Spinner';

import useRazorpay from 'react-razorpay';
function DefaultPricingCard({ badge, price, specifications, action, subscriptionAndFeatures, tabValue }) {
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [activePlanDetails, setActivePlanDetails] = useState(JSON.parse(localStorage.getItem('activePlanDetails')));

  const orgId = localStorage.getItem('orgId');

  const navigate = useNavigate();
  const Razorpay = useRazorpay();

  const renderSpecifications = specifications?.map(({ label, includes }) => (
    <SoftBox key={label} display="flex" alignItems="center" p={1}>
      <SoftBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="1.5rem"
        height="1.5rem"
        borderRadius="50%"
        shaodw="md"
        bgColor={includes ? '#344767' : 'secondary'}
        variant="gradient"
        mr={2}
        sx={{
          backgroundColor: '#344767',
        }}
      >
        <SoftTypography variant="button" color="white" sx={{ lineHeight: 0 }}>
          <Icon sx={{ fontWeight: 'bold' }}>{includes ? 'done' : 'remove'}</Icon>
        </SoftTypography>
      </SoftBox>
      <SoftTypography
        // variant="body2"
        color="text"
        sx={{
          fontSize: '0.8rem',
        }}
        className={
          badge.label ==
            activePlanDetails?.planName?.charAt(0).toUpperCase() +
              activePlanDetails?.planName?.slice(1).toLowerCase() &&
          activePlanDetails.billingCycle == 'MONTHLY' &&
          tabValue == 0
            ? 'active-plan-highlight'
            : badge.label ==
                activePlanDetails?.planName?.charAt(0).toUpperCase() +
                  activePlanDetails?.planName?.slice(1).toLowerCase() &&
              activePlanDetails.billingCycle == 'ANNUAL' &&
              tabValue == 1
            ? 'active-plan-highlight'
            : null
        }
      >
        {label}
      </SoftTypography>
    </SoftBox>
  ));

  const user = localStorage.getItem('user_name');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const accountId = localStorage.getItem('AppAccountId');

  const handleSubscription = async () => {
    const subscriptionData = subscriptionAndFeatures.find((item) => item.packageName == badge.label.toUpperCase());

    const currentPlan = JSON.parse(localStorage.getItem('planDataToSubscribe'));

    // console.log('current plan: ', currentPlan);

    if (subscriptionData.packageName === 'STARTER' && currentPlan == null) {
      const payload = {
        accountId: accountId,
        subscriptionId: subscriptionData?.subscriptionId,
        status: 'CREATED',
        createdBy: createdById,
        createdByName: user,
        email: user_details.email,
      };
      // console.log(payload);
      try {
        const response = await createUpgradeSubscriptionPlan(payload);
        // console.log('responseCurrentPlan', response);
        const result = response.data.data.data;
        const featureResponse = await getFeatureSettings(orgId);
        const featureResult = featureResponse.data.data.data;
        // console.log('featureResult', result);
        localStorage.setItem('featureSettings', JSON.stringify(featureResult));

        if (response.data.data.es == 1) {
          showSnackbar(response.data.data.message, 'error');
          setTimeout(() => {
            navigate('/setting-organisation');
          }, 500);
          return;
        }
        if (subscriptionData.chargeable == false) {
          // localStorage.setItem('planDataToSubscribe', JSON.stringify(subscriptionData));
          navigate('/Billinginfo');
        }
        localStorage.removeItem('planDataToSubscribe');
      } catch (e) {
        console.log(e);
      }
    }
    if (subscriptionData.packageName === 'STARTER' && currentPlan !== null && currentPlan.packageName == 'STARTER') {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to change your plan.',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Confirm',
      }).then(async () => {
        const payload = {
          accountId: accountId,
          subscriptionId: subscriptionData?.subscriptionId,
          status: 'CREATED',
          createdBy: createdById,
          createdByName: user,
          email: user_details.email,
        };
        // console.log(payload);
        try {
          const response = await createUpgradeSubscriptionPlan(payload);
          // console.log("responseCurrentPlan",response)
          const result = response.data.data.data;
          const featureResponse = await getFeatureSettings(orgId);
          const featureResult = featureResponse.data.data.data;
          // console.log('featureResult', result);
          localStorage.setItem('featureSettings', JSON.stringify(featureResult));

          if (response.data.data.es == 1) {
            showSnackbar(response.data.data.message, 'error');
            setTimeout(() => {
              navigate('/setting-organisation');
            }, 500);
            return;
          }
          if (subscriptionData.chargeable == false) {
            // localStorage.setItem('planDataToSubscribe', JSON.stringify(subscriptionData));
            navigate('/Billinginfo');
          }
          localStorage.removeItem('planDataToSubscribe');
        } catch (e) {
          console.log(e);
        }
      });
    }

    if (subscriptionData.packageName === 'STARTER' && currentPlan !== null && currentPlan.packageName == 'STANDARD') {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to change your plan.',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Confirm',
      }).then(async () => {
        const payload = {
          accountId: accountId,
          subscriptionId: subscriptionData?.subscriptionId,
          status: 'CREATED',
          createdBy: createdById,
          createdByName: user,
          email: user_details.email,
        };
        // console.log(payload);
        try {
          const response = await createUpgradeSubscriptionPlan(payload);
          // console.log("responseCurrentPlan",response)

          const result = response.data.data.data;
          const featureResponse = await getFeatureSettings(orgId);
          const featureResult = featureResponse.data.data.data;
          // console.log('featureResult', result);
          localStorage.setItem('featureSettings', JSON.stringify(featureResult));

          if (response.data.data.es == 1) {
            showSnackbar(response.data.data.message, 'error');
            setTimeout(() => {
              navigate('/setting-organisation');
            }, 500);
            return;
          }
          if (subscriptionData.chargeable == false) {
            localStorage.setItem('planDataToSubscribe', JSON.stringify(subscriptionData));
            navigate('/Billinginfo');
          }
          localStorage.removeItem('planDataToSubscribe');
        } catch (e) {
          console.log(e);
        }
      });
    }

    if (subscriptionData.packageName === 'STANDARD' && currentPlan !== null && currentPlan.packageName == 'STANDARD') {
      navigate('/BillingPage');
      localStorage.setItem('planDataToSubscribe', JSON.stringify(subscriptionData));
    }

    if (subscriptionData.packageName === 'STANDARD' && currentPlan == null) {
      navigate('/BillingPage');
      localStorage.setItem('planDataToSubscribe', JSON.stringify(subscriptionData));
    }

    // const payload = {
    //   accountId: accountId,
    //   subscriptionId: subscriptionData?.subscriptionId,
    //   status: 'CREATED',
    //   createdBy: createdById,
    //   createdByName: user,
    //   email: user_details.email,
    // };

    // try {
    //   // setLoader(true);
    //   const response = await createUpgradeSubscriptionPlan(payload);
    //   // setLoader(false);
    //   // console.log('responseCreateSubscription', response);

    //   const result = response.data.data.data;

    //   if (response.data.data.es == 1) {
    //     showSnackbar(response.data.data.message, 'error');
    //     return;
    //   }

    //   const razorOrderId = result.razorPayGatewayOrderId;
    //   const razorSubsId = result.razorPaySubscriptionId;
    //   localStorage.setItem('razorPaySubscriptionId', razorSubsId);
    //   const redirectUrl = result.url;

    //   // window.location.replace(redirectUrl);

    //   if (subscriptionData.chargeable == false) {
    //     navigate('/Billinginfo');
    //   } else {
    //     var options = {
    //       key: 'rzp_test_zrmNXMjpy3NDog', // Enter the Key ID generated from the Dashboard
    //       amount: (parseInt(subscriptionData.netPrice) * 100).toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //       currency: 'INR',
    //       name: 'Pallet', //your business name
    //       description: 'Test Transaction',
    //       image: 'https://example.com/your_logo',
    //       order_id: razorOrderId,

    //       //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

    //       // prefill: {
    //       //   //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
    //       //   name: 'Gaurav Kumar', //your customer's name
    //       //   email: 'gaurav.kumar@example.com',
    //       //   contact: '9000090000', //Provide the customer's phone number for better conversion rates
    //       // },
    //       handler: async (resp) => {
    //         // console.log('razorPaySuccess', resp);
    //         try {
    //           const acvtiveResponse = await activateSubscriptionForPricingPlans(razorSubsId);

    //           // console.log('activedPlan', acvtiveResponse);

    //           if (resp?.razorpay_payment_id) {
    //             navigate('/Billinginfo');
    //           }
    //         } catch (e) {
    //           console.log('error', e);
    //         }
    //       },
    //       notes: {
    //         address: 'Razorpay Corporate Office',
    //       },
    //       subscription_id: razorSubsId,
    //       theme: {
    //         color: '#3399cc',
    //       },
    //     };
    //     // console.log('optionsRazorPayment', options);
    //     var rzp1 = new Razorpay(options);
    //     rzp1.on('payment.failed', function (responseFailed) {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Payment failed please try again.',
    //         showConfirmButton: true,
    //         confirmButtonText: 'Retry',
    //       }).then(() => {
    //         navigate('/pricingPage');
    //       });
    //     });
    //     rzp1.open();
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleEnterPriseSubscription = () => {
    navigate('/contact-sales');
  };

  const handleContactUs = () => {
    window.open('https://palletnow.co/pricing', '_blank');
  };

  return (
    <>
      <Card
        sx={{
          border: '1px solid #343767',
          height: '100%',
        }}
        className={
          badge.label ==
            activePlanDetails?.planName?.charAt(0).toUpperCase() +
              activePlanDetails?.planName?.slice(1).toLowerCase() &&
          activePlanDetails.billingCycle == 'MONTHLY' &&
          tabValue == 0
            ? 'active-plan-highlight'
            : badge.label ==
                activePlanDetails?.planName?.charAt(0).toUpperCase() +
                  activePlanDetails?.planName?.slice(1).toLowerCase() &&
              activePlanDetails.billingCycle == 'ANNUAL' &&
              tabValue == 1
            ? 'active-plan-highlight'
            : null
        }
      >
        {!subscriptionAndFeatures.length ? (
          <SkeletonLoader />
        ) : (
          <>
            <Box
              className="pricing-details"
              sx={{
                textAlign: 'center',
                marginTop: '1rem',
              }}
            >
              <SoftTypography
                className={
                  badge.label ==
                    activePlanDetails?.planName?.charAt(0).toUpperCase() +
                      activePlanDetails?.planName?.slice(1).toLowerCase() &&
                  activePlanDetails.billingCycle == 'MONTHLY' &&
                  tabValue == 0
                    ? 'active-plan-highlight pricing-details'
                    : badge.label ==
                        activePlanDetails?.planName?.charAt(0).toUpperCase() +
                          activePlanDetails?.planName?.slice(1).toLowerCase() &&
                      activePlanDetails.billingCycle == 'ANNUAL' &&
                      tabValue == 1
                    ? 'active-plan-highlight pricing-details'
                    : 'pricing-details'
                }
              >
                {badge?.label}
              </SoftTypography>
            </Box>
            <Box
              className="pricing-name"
              sx={{
                textAlign: 'center',
              }}
            >
              {badge.label == 'Starter' ? (
                <SoftTypography
                  className={
                    badge.label ==
                      activePlanDetails?.planName?.charAt(0).toUpperCase() +
                        activePlanDetails?.planName?.slice(1).toLowerCase() &&
                    activePlanDetails.billingCycle == 'MONTHLY' &&
                    tabValue == 0
                      ? 'active-plan-highlight pricing-packageName'
                      : badge.label ==
                          activePlanDetails?.planName?.charAt(0).toUpperCase() +
                            activePlanDetails?.planName?.slice(1).toLowerCase() &&
                        activePlanDetails.billingCycle == 'ANNUAL' &&
                        tabValue == 1
                      ? 'active-plan-highlight pricing-packageName'
                      : 'pricing-packageName'
                  }
                >
                  Free
                </SoftTypography>
              ) : badge.label === 'Standard' ? (
                <SoftTypography
                  className={
                    badge.label ==
                      activePlanDetails?.planName?.charAt(0).toUpperCase() +
                        activePlanDetails?.planName?.slice(1).toLowerCase() &&
                    activePlanDetails.billingCycle == 'MONTHLY' &&
                    tabValue == 0
                      ? 'active-plan-highlight pricing-packageName2'
                      : badge.label ==
                          activePlanDetails?.planName?.charAt(0).toUpperCase() +
                            activePlanDetails?.planName?.slice(1).toLowerCase() &&
                        activePlanDetails.billingCycle == 'ANNUAL' &&
                        tabValue == 1
                      ? 'active-plan-highlight pricing-packageName2'
                      : 'pricing-packageName2'
                  }
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  ₹{parseInt(price.value).toLocaleString()}{' '}
                  {subscriptionAndFeatures.length && subscriptionAndFeatures[0]['billingCycle'] !== 'ANNUAL'
                    ? '/m'
                    : '/yr'}{' '}
                  <SoftTypography
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: '400',
                    }}
                    className={
                      badge.label ==
                        activePlanDetails?.planName?.charAt(0).toUpperCase() +
                          activePlanDetails?.planName?.slice(1).toLowerCase() &&
                      activePlanDetails.billingCycle == 'MONTHLY' &&
                      tabValue == 0
                        ? 'active-plan-highlight'
                        : badge.label ==
                            activePlanDetails?.planName?.charAt(0).toUpperCase() +
                              activePlanDetails?.planName?.slice(1).toLowerCase() &&
                          activePlanDetails.billingCycle == 'ANNUAL' &&
                          tabValue == 1
                        ? 'active-plan-highlight'
                        : null
                    }
                  >
                    + GST
                  </SoftTypography>
                </SoftTypography>
              ) : (
                <Box>
                  <SoftTypography className="pricing-packageName3">Custom features tailored for</SoftTypography>
                  <SoftTypography className="pricing-packageName3">your enterprise use case.</SoftTypography>
                </Box>
              )}
            </Box>
            <Box
              className="plan-btns"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {action.type === 'internal' ? (
                <SoftBox mt={3}>
                  {loader ? (
                    <Spinner />
                  ) : (
                    <SoftButton onClick={handleSubscription} color={action.color} fullWidth>
                      {action.label}&nbsp;
                      <Icon sx={{ fontWeight: 'bold' }}>arrow_forward</Icon>
                    </SoftButton>
                  )}
                </SoftBox>
              ) : (
                <SoftBox mt={3}>
                  <SoftButton
                    component="a"
                    variant="gradient"
                    color={action.color}
                    fullWidth
                    onClick={handleEnterPriseSubscription}
                  >
                    {action.label}&nbsp;
                    <Icon sx={{ fontWeight: 'bold' }}>arrow_forward</Icon>
                  </SoftButton>
                </SoftBox>
              )}
            </Box>
            <Box className="feature-description">{renderSpecifications}</Box>
            <Box
              className="all-features"
              sx={{
                textAlign: 'center',
              }}
            >
              {badge.label !== 'Enterprise' && (
                <SoftTypography
                  onClick={handleContactUs}
                  className={
                    badge.label ==
                      activePlanDetails?.planName?.charAt(0).toUpperCase() +
                        activePlanDetails?.planName?.slice(1).toLowerCase() &&
                    activePlanDetails.billingCycle == 'MONTHLY' &&
                    tabValue == 0
                      ? 'active-plan-highlight view-features-highlight'
                      : badge.label ==
                          activePlanDetails?.planName?.charAt(0).toUpperCase() +
                            activePlanDetails?.planName?.slice(1).toLowerCase() &&
                        activePlanDetails.billingCycle == 'ANNUAL' &&
                        tabValue == 1
                      ? 'active-plan-highlight view-features-highlight'
                      : 'view-features'
                  }
                >
                  View all features
                </SoftTypography>
              )}
            </Box>
          </>
        )}
      </Card>
    </>
  );
}

// Typechecking props for the DefaultPricingCard
DefaultPricingCard.propTypes = {
  badge: PropTypes.shape({
    color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'light', 'dark']).isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  price: PropTypes.shape({
    currency: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  specifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(['external', 'internal']).isRequired,
    route: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'light', 'dark']).isRequired,
  }).isRequired,
};

export default DefaultPricingCard;
