import './StandardPlan.css';
import { Box, Grid } from '@mui/material';
import ActivePlan from './ActivePlan';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import React, { useEffect, useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';

import { activateSubscriptionForPricingPlans, createUpgradeSubscriptionPlan } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Spinner from '../../../../components/Spinner';
import Swal from 'sweetalert2';
import useRazorpay from 'react-razorpay';

import { fetchPosAndMPosPriceDetailsForSubscription, getFeatureSettings } from '../../../../config/Services';

function StandardPlan({ tabValue }) {
  const showSnackbar = useSnackbar();
  const Razorpay = useRazorpay();
  const navigate = useNavigate();
  const node_env = process.env.MY_ENV;

  const [posCounter, setPosCounter] = useState(1);
  const [mPosCounter, setMPosCounter] = useState(0);
  const [pricingDetails, setPricingDetails] = useState(null);
  const [posBillingDetails, setPosBillingDetails] = useState(null);
  const [mPosBillingDetails, setMposBillingDetails] = useState(null);
  const [loader, setLoader] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(
    JSON.parse(localStorage.getItem('planDataToSubscribe')) || null,
  );

  const user = localStorage.getItem('user_name');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const accountId = localStorage.getItem('AppAccountId');
  const orgId = localStorage.getItem('orgId');

  const fetchPosAndMPosPriceDetails = async () => {
    let payload = '';

    if (tabValue == 0) {
      if (mPosCounter == 0) {
        payload = {
          accountId: accountId,
          addonQuantityModels: [
            {
              addonId: 'ADS0000101',
              quantity: posCounter,
            },
          ],
        };
      } else {
        payload = {
          accountId: accountId,
          addonQuantityModels: [
            {
              addonId: 'ADS0000101',
              quantity: posCounter,
            },
            {
              addonId: 'ADS0000103',
              quantity: mPosCounter,
            },
          ],
        };
      }
    }
    if (tabValue == 1) {
      if (mPosCounter == 0) {
        payload = {
          accountId: accountId,
          addonQuantityModels: [
            {
              addonId: 'ADS0000102',
              quantity: posCounter,
            },
          ],
        };
      } else {
        payload = {
          accountId: accountId,
          addonQuantityModels: [
            {
              addonId: 'ADS0000102',
              quantity: posCounter,
            },
            {
              addonId: 'ADS0000104',
              quantity: mPosCounter,
            },
          ],
        };
      }
    }

    try {
      const result = await fetchPosAndMPosPriceDetailsForSubscription(payload);
      // console.log('result', result);
      const response = result.data.data.data;
      // console.log("response",response)
      if (response.products.length == 1) {
        setPosBillingDetails(response.products[0]);
      }
      if (response.products.length > 1) {
        setPosBillingDetails(response.products[0]);
        setMposBillingDetails(response.products[1]);
      }

      setPricingDetails(response);
    } catch (err) {}
  };

  useEffect(() => {
    fetchPosAndMPosPriceDetails();
  }, [posCounter, mPosCounter]);

  const handleRemovePOS = () => {
    if (posCounter <= 1) {
      setPosCounter(1);
    } else {
      setPosCounter((prev) => prev - 1);
    }
  };

  const handleAddPOS = () => {
    setPosCounter((prev) => prev + 1);
  };

  const handleRemoveMPos = () => {
    if (mPosCounter <= 0) {
      setMPosCounter(0);
    } else {
      setMPosCounter((prev) => prev - 1);
    }
  };

  const handleAddMPos = () => {
    setMPosCounter((prev) => prev + 1);
  };

  const handleContactUs = () => {
    window.open('https://palletnow.co/pricing', '_blank');
  };

  const handleCheckoutAndUpgradePlan = async () => {
    let payload = '';
    if (tabValue == 0) {
      if (mPosCounter == 0) {
        payload = {
          accountId: accountId,
          subscriptionId: subscriptionData?.subscriptionId,
          status: 'CREATED',
          createdBy: createdById,
          createdByName: user,
          email: user_details.email,
          addonQuantityModelList: [
            {
              addonId: 'ADS0000101',
              quantity: posCounter,
            },
          ],
        };
      } else {
        payload = {
          accountId: accountId,
          subscriptionId: subscriptionData?.subscriptionId,
          status: 'CREATED',
          createdBy: createdById,
          createdByName: user,
          email: user_details.email,
          addonQuantityModelList: [
            {
              addonId: 'ADS0000101',
              quantity: posCounter,
            },
            {
              addonId: 'ADS0000103',
              quantity: mPosCounter,
            },
          ],
        };
      }
    }

    if (tabValue == 1) {
      if (mPosCounter == 0) {
        payload = {
          accountId: accountId,
          subscriptionId: subscriptionData?.subscriptionId,
          status: 'CREATED',
          createdBy: createdById,
          createdByName: user,
          email: user_details.email,
          addonQuantityModelList: [
            {
              addonId: 'ADS0000102',
              quantity: posCounter,
            },
          ],
        };
      } else {
        payload = {
          accountId: accountId,
          subscriptionId: subscriptionData?.subscriptionId,
          status: 'CREATED',
          createdBy: createdById,
          createdByName: user,
          email: user_details.email,
          addonQuantityModelList: [
            {
              addonId: 'ADS0000102',
              quantity: posCounter,
            },
            {
              addonId: 'ADS0000104',
              quantity: mPosCounter,
            },
          ],
        };
      }
    }

    // console.log("subscriptionData",subscriptionData);

    try {
      setLoader(true);
      const response = await createUpgradeSubscriptionPlan(payload);
      setLoader(false);
      // console.log('responseCreateSubscription', response);

      const result = response.data.data.data;
      const totalAmountForCheckout = result.totalAmount;
      // console.log('responseNetPrice', response.data.data.data.netPrice);
      // console.log('totalAmountForCheckout', totalAmountForCheckout);

      if (response.data.data.es == 1) {
        showSnackbar(response.data.data.message, 'error');
        return;
      }

      const razorOrderId = result.razorPayGatewayOrderId;
      const razorSubsId = result.razorPaySubscriptionId;
      const referenceId = result.referenceId;
      // localStorage.setItem('razorPaySubscriptionId', razorSubsId);
      // localStorage.setItem('addonReferenceId', referenceId);
      const redirectUrl = result.url;

      // window.location.replace(redirectUrl);
      const options = {
        key:
          node_env === 'development'
            ? 'rzp_test_zrmNXMjpy3NDog'
            : node_env === 'stage'
              ? 'rzp_test_zrmNXMjpy3NDog'
              : 'rzp_live_sixmo4R7913AMb',
        subscription_id: razorSubsId,
        name: 'Pallet', //your business name
        description: 'Test Transaction',
        image: '/your_logo.jpg',
        handler: async (resp) => {
          // console.log('razorPaySuccess', resp);
          const payload = {
            razorPaySubscriptionId: razorSubsId,
            referenceId: referenceId,
          };
          try {
            const acvtiveResponse = await activateSubscriptionForPricingPlans(payload);
            const featureResponse = await getFeatureSettings(orgId);
            const featureResult = featureResponse.data.data.data;
            // console.log('featureResult', result);
            localStorage.setItem('featureSettings', JSON.stringify(featureResult));

            // console.log('activedPlan', acvtiveResponse);

            if (resp?.razorpay_payment_id) {
              localStorage.removeItem('rzp_checkout_anon_id');
              localStorage.removeItem('rzp_device_id');
              localStorage.removeItem('rzp_checkout_user_id');
              navigate('/Billinginfo');
            }
          } catch (e) {
            console.log('error', e);
          }
        },
        // prefill: {
        //   name: 'Gaurav Kumar',
        //   email: 'gaurav.kumar@example.com',
        //   contact: '+919876543210',
        // },
        // notes: {
        //   note_key_1: 'Tea. Earl Grey. Hot',
        //   note_key_2: 'Make it so.',
        // },
        theme: {
          color: '#0562FB',
        },
      };

      // console.log('optionsRazorPayment', options);
      const rzp1 = new Razorpay(options);
      rzp1.on('payment.failed', function (responseFailed) {
        Swal.fire({
          icon: 'error',
          title: 'Payment failed please try again.',
          showConfirmButton: true,
          confirmButtonText: 'Retry',
        }).then(() => {
          navigate('/pricingPage');
        });
      });
      rzp1.open();
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  return (
    <Box
      className="billing-plan-details"
      sx={{
        padding: '2rem',
      }}
    >
      <SoftBox className="reuirements-features">
        <Grid container spacig={4}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <SoftTypography sx={{ color: '#a6a6a6' }}>Tell us more about your requirements</SoftTypography>
            <Box className="requirements">
              <Box className="requirement-details">
                <SoftTypography className="requirement-details-text">
                  Number of POS (billing counter) license you want
                </SoftTypography>
                <Box className="requirement-count">
                  <RemoveIcon className="remove-icon" onClick={handleRemovePOS} />
                  <SoftTypography className="requirement-number">{posCounter}</SoftTypography>
                  <AddIcon className="add-icon" onClick={handleAddPOS} />
                </Box>
              </Box>
              <Box className="requirement-details">
                <SoftTypography className="requirement-details-text">
                  Number of mobile POS license you want (optional)
                </SoftTypography>
                <Box className="requirement-count">
                  <RemoveIcon className="remove-icon" onClick={handleRemoveMPos} />
                  <SoftTypography className="requirement-number">{mPosCounter}</SoftTypography>
                  <AddIcon className="add-icon" onClick={handleAddMPos} />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <SoftTypography sx={{ color: '#a6a6a6' }}>Features you’ll get</SoftTypography>
            <Box className="features">
              <Box className="features-details">
                <Box className="feature-data">
                  <Box className="check-icon-feature">
                    <CheckIcon className="check-icon-svg" />
                  </Box>
                  <SoftTypography className="feature-details-text">Discount Coupons</SoftTypography>
                </Box>
                <Box className="feature-data">
                  <Box className="check-icon-feature">
                    <CheckIcon className="check-icon-svg" />
                  </Box>
                  <SoftTypography className="feature-details-text">Loyalty Management</SoftTypography>
                </Box>
                <Box className="feature-data">
                  <Box className="check-icon-feature">
                    <CheckIcon className="check-icon-svg" />
                  </Box>
                  <SoftTypography className="feature-details-text">Bulk Price Edit</SoftTypography>
                </Box>

                <Box className="feature-data">
                  <Box className="check-icon-feature">
                    <CheckIcon className="check-icon-svg" />
                  </Box>
                  <SoftTypography className="feature-details-text">Average Stock Turnover Ratio</SoftTypography>
                </Box>
                <Box className="feature-data">
                  <Box className="check-icon-feature">
                    <CheckIcon className="check-icon-svg" />
                  </Box>
                  <SoftTypography className="feature-details-text">Price Revision History</SoftTypography>
                </Box>
                <Box className="feature-data">
                  <Box className="check-icon-feature">
                    <CheckIcon className="check-icon-svg" />
                  </Box>
                  <SoftTypography className="feature-details-text">
                    Product Level Sales and Purchase History
                  </SoftTypography>
                </Box>
              </Box>
              <Box className="view-all-features">
                <SoftTypography
                  className="view-all-features-text"
                  sx={{
                    color: '#0562FB',
                    cursor: 'pointer',
                  }}
                  onClick={handleContactUs}
                >
                  View all features
                </SoftTypography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox className="billing-amount-and-active-plan">
        <Grid container spacing={4}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <SoftTypography sx={{ color: '#a6a6a6' }}>Your Billing Amount</SoftTypography>
            <Box className="billing-info">
              <Box className="billing-top-info">
                <table className="standard-plan-table">
                  <tr className="standard-plan-table-tr">
                    <th className="standard-plan-table-th">Description</th>
                    <th className="standard-plan-table-th">Qty</th>
                    <th className="standard-plan-table-th">Unit Price</th>
                    <th className="standard-plan-table-th">Total Amount</th>
                  </tr>
                  <tr className="standard-plan-table-tr">
                    <td className="standard-plan-table-td">POS(Billing Counter)</td>
                    <td className="standard-plan-table-td">{posCounter}</td>
                    <td className="standard-plan-table-td">₹{posBillingDetails?.grossPrice}</td>
                    <td className="standard-plan-table-td">₹{posBillingDetails?.netPrice}</td>
                  </tr>
                  <tr className="standard-plan-table-tr">
                    <td className="standard-plan-table-td">Mobile POS(mPOS)</td>
                    <td className="standard-plan-table-td">{mPosCounter}</td>
                    <td className="standard-plan-table-td">
                      {mPosBillingDetails !== null ? '₹' + mPosBillingDetails?.grossPrice : 0}
                    </td>
                    <td className="standard-plan-table-td">
                      {mPosBillingDetails !== null ? '₹' + mPosBillingDetails?.netPrice : 0}
                    </td>
                  </tr>
                </table>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <span className="line-break"></span>
              </Box>

              <Box className="billing-bottom-info">
                <Box className="bottom-info-details">
                  <SoftTypography className="info-left-text">Subtotal</SoftTypography>
                  <SoftTypography className="info-right-text">₹{pricingDetails?.totalAmountBeforeTax}</SoftTypography>
                </Box>
                <Box className="bottom-info-details">
                  <SoftTypography className="info-left-text">Tax Rate</SoftTypography>
                  <SoftTypography className="info-right-text">18%</SoftTypography>
                </Box>
                <Box className="bottom-info-details">
                  <SoftTypography className="info-left-text">Tax</SoftTypography>
                  <SoftTypography className="info-right-text">₹{pricingDetails?.totalTax}</SoftTypography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '0.5rem',
                }}
              >
                <span
                  className="line-break"
                  style={{
                    height: '0.01rem',
                  }}
                ></span>
              </Box>
              <Box className="total-amount">
                <SoftTypography className="total-amount-left">Total</SoftTypography>
                <SoftTypography className="total-amount-right">₹{pricingDetails?.totalNetPrice}</SoftTypography>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <ActivePlan
              activePlanDetails={{
                billingCycle: 'MONTHLY',
                netPrice: '1112',
                planName: 'STARTER',
                startDate: '03-11-2023',
              }}
            />
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox className="amount-pay">
        <Box className="total-amount-proceed-to-pay">
          <SoftTypography>₹{pricingDetails?.totalNetPrice}</SoftTypography>
          {loader ? (
            <Spinner />
          ) : (
            <SoftButton
              sx={{
                backgroundColor: '#0562FB',
                color: 'white !important',
                borderRadius: '0.5rem',
                '&:hover': {
                  color: 'black !important',
                },
              }}
              onClick={handleCheckoutAndUpgradePlan}
            >
              Proceed to Pay
            </SoftButton>
          )}
        </Box>
      </SoftBox>
    </Box>
  );
}

export default StandardPlan;
