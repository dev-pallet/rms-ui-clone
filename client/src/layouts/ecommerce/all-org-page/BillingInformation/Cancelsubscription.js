import * as React from 'react';
import { Card, CardContent, Container } from '@mui/material';
import { FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import { TextareaAutosize } from '@mui/material';
import { cancelSubscriptionForPricingPlans, getFeatureSettings } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import ActivePlan from './ActivePlan';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import PageLayout from '../../../../examples/LayoutContainers/PageLayout';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from 'components/Spinner/index';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

import './CancelSubscription.css';

const steps = ['Feedback', 'Details', 'Review'];
export default function Cancelsubscription() {
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [allReasons, setAllReasons] = useState([
    {
      reason: 'Price is too high',
      checked: false,
    },
    {
      reason: 'Too many bugs or technical issue',
      checked: false,
    },
    {
      reason: 'The product felt too complicated or overwhelming',
      checked: false,
    },
    {
      reason: 'Some features I need are missing',
      checked: false,
    },
    {
      reason: 'I am looking to change my plan',
      checked: false,
    },
    {
      reason: 'I found another product that fulfills my needs',
      checked: false,
    },
    {
      reason: 'I don’t use it enough',
      checked: false,
    },
    {
      reason: 'Don’t need the product / Company no longer wants to pay',
      checked: false,
    },
    {
      reason: 'Other',
      checked: false,
    },
  ]);
  const [description, setDescription] = useState('');
  const [allReasonList, setAllReasonsList] = useState([]);
  const [activePlanDetails, setActivePlanDetails] = useState(
    JSON.parse(localStorage.getItem('activePlanDetails')) || null,
  );

  const accountSubscriptionId = localStorage.getItem('accountSubscriptionId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const orgId = localStorage.getItem('orgId');

  const handleChange = (event, index) => {
    const { value, checked } = event.target;

    const reason = [...allReasons];
    reason[index] = {
      reason: value,
      checked: checked,
    };

    const allReasonChecked = reason.filter((item) => item.checked === true).map((item) => item.reason);

    setAllReasons(reason);
    setAllReasonsList(allReasonChecked);
  };

  const handleDescription = (e) => {
    const descrip = e.target.value;
    setDescription(descrip);
  };

  const navigate = useNavigate();

  const handleNext = () => {
    // console.log('activeStep', activeStep);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onBackToAccount = () => {
    localStorage.removeItem('activePlanDetails');
    navigate('/Billinginfo');
  };

  const handleCancelPlan = async () => {
    if (!allReasonList.length) {
      showSnackbar('Please select any specific reason for cancellation', 'warning');
      return;
    }

    const payload = {
      accountSubscriptionId: accountSubscriptionId,
      deletedBy: uidx,
      reasons: allReasonList,
    };
    try {
      setLoader(true);
      const result = await cancelSubscriptionForPricingPlans(payload);
      setLoader(false);

      const featureResponse = await getFeatureSettings(orgId);
      const featureResult = featureResponse.data.data.data;
      // console.log('featureResult', result);
      localStorage.setItem('featureSettings', JSON.stringify(featureResult));

      // console.log('cancelSubscription', result);
      localStorage.removeItem('accountSubscriptionId');
      localStorage.removeItem('razorPaySubscriptionId');
      // localStorage.removeItem('activePlanDetails');
      handleNext();
    } catch (e) {}

    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <PageLayout>
      <Card style={{ background: '#fafafa', margin: '50px' }}>
        <Box sx={{ width: '100%' }}>
          <Box className="stepper-container">
            <Stepper activeStep={activeStep} sx={{ width: '60%' }}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label} </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>

          {activeStep === 0 && (
            <React.Fragment>
              <center style={{ margin: '15px' }}>
                <SoftTypography>We’re sorry you’re thinking of leaving us. Would you tell us why?</SoftTypography>
              </center>
              <br />
              <Grid container spacing={3} p={3}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Container
                    style={{
                      padding: '20px',
                      border: '1px solid #0562FB',
                      borderRadius: '1rem',
                      backgroundColor: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
                    }}
                  >
                    <FormControl component="fieldset">
                      <FormGroup>
                        {allReasons.map((item, index) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={item.checked}
                                onChange={(event) => handleChange(event, index)}
                                value={item.reason}
                                className="checkbox-label"
                              />
                            }
                            label={item.reason}
                            className="reason-label"
                          />
                        ))}
                      </FormGroup>
                      <TextareaAutosize
                        onChange={handleDescription}
                        name="description"
                        aria-label="minimum height"
                        minRows={4}
                        placeholder="Please specify here..."
                        className="textarea textarea-reason"
                      />
                    </FormControl>
                  </Container>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <ActivePlan activePlanDetails={activePlanDetails} />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
                <Button
                  style={{ backgroundColor: '#0562FB', color: 'white', padding: '10px', borderRadius: '7px' }}
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  style={{ backgroundColor: '#0562FB', color: 'white', padding: '10px', borderRadius: '7px' }}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Cancel Subscription' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}

          {activeStep === 1 && (
            <React.Fragment>
              <center style={{ margin: '15px' }}>
                <SoftTypography>Cancelling your plan today means</SoftTypography>
              </center>
              <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Card sx={{ maxWidth: '250px', height: '19rem', margin: '10px', border: '1px solid #0562FB' }}>
                  <CardContent>
                    {' '}
                    <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      You'll no longer be able to create and publish courses
                    </SoftTypography>
                  </CardContent>

                  <SoftTypography style={{ fontSize: '0.8rem', padding: '16px' }}>
                    Bulk Price Edit
                    <br />
                    Auto MRP and Barcode Updation
                    <br />
                    Quote Management
                    <br />
                    Discount Coupons
                    <br />
                    Loyalty Management
                    <br />
                    Multiple Layout Creations
                    <br />
                  </SoftTypography>
                </Card>

                <Card sx={{ maxWidth: '250px', height: '19rem', margin: '10px', border: '1px solid #0562FB' }}>
                  <CardContent>
                    {' '}
                    <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      Most of the premium features will be unavailable
                    </SoftTypography>
                  </CardContent>

                  <SoftTypography style={{ fontSize: '0.8rem', padding: '16px' }}>
                    Integration with ICICI bulk vendor payment
                    <br />
                    Logistics
                    <br />
                    Third Party Sales Channel Integration
                    <br />
                    100+ Business Intelligence Reports
                  </SoftTypography>
                </Card>

                <Card sx={{ maxWidth: '250px', height: '19rem', margin: '10px', border: '1px solid #0562FB' }}>
                  <CardContent>
                    {' '}
                    <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      You’ll be switched to a free plan with limited access to some services
                    </SoftTypography>
                  </CardContent>

                  <SoftTypography style={{ fontSize: '0.8rem', padding: '16px' }}>
                    Your account will remain active until your plan expires. Our free plan still provides valuable
                    features, and you have the flexibility to switch plans at any time. Rest assured, we'll securely
                    safeguard your data.
                  </SoftTypography>
                </Card>
              </Container>
              <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
                <Button
                  style={{ backgroundColor: '#0562FB', color: 'white', padding: '10px', borderRadius: '7px' }}
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button
                  style={{ backgroundColor: '#0562FB', color: 'white', padding: '10px', borderRadius: '7px' }}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Cancel Subscription' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}

          {activeStep === 2 && (
            <React.Fragment>
              <center style={{ margin: '15px' }}>
                <SoftTypography>What to expect when you cancel</SoftTypography>
              </center>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Container style={{ padding: '20px' }}>
                  <Card
                    sx={{
                      // border: '1px solid #343767',
                      borderRadius: '1rem',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <CardContent>
                      <SoftTypography style={{ fontSize: '0.9rem', marginTop: '20px', fontWeight: 'bold' }}>
                        Termination fee
                      </SoftTypography>
                      <br />
                      <SoftTypography style={{ fontSize: '0.85rem' }}>
                        There is no termination fee to cancel your subscription.
                      </SoftTypography>
                      <br />

                      <SoftTypography style={{ fontSize: '0.9rem', marginTop: '20px', fontWeight: 'bold' }}>
                        Plan date
                      </SoftTypography>
                      <br />
                      <SoftTypography style={{ fontSize: '0.85rem' }}>
                        Your plan will end on your next billing date Feb 28, 2020.
                      </SoftTypography>
                      <br />

                      <SoftTypography style={{ fontSize: '0.9rem', marginTop: '20px', fontWeight: 'bold' }}>
                        Storage
                      </SoftTypography>
                      <br />
                      <SoftTypography style={{ fontSize: '0.85rem' }}>Your plan will end on 12/09/2023.</SoftTypography>
                      <br />

                      <SoftTypography style={{ fontSize: '0.9rem', marginTop: '20px', fontWeight: 'bold' }}>
                        Premium Features
                      </SoftTypography>
                      <br />
                      <SoftTypography style={{ fontSize: '0.85rem' }}>
                        You no longer have access to most of the premium features included in your paid plan.
                      </SoftTypography>
                      <br />

                      <SoftTypography style={{ fontSize: '0.9rem', marginTop: '20px', fontWeight: 'bold' }}>
                        Easy Reactivation{' '}
                      </SoftTypography>
                      <br />
                      <SoftTypography style={{ fontSize: '0.85rem' }}>
                        You can easily reactivate your subscription at any time to regain full access to premium
                        features.
                      </SoftTypography>
                    </CardContent>
                  </Card>
                </Container>
                <ActivePlan activePlanDetails={activePlanDetails} />
              </div>
              <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
                <Button
                  style={{ backgroundColor: '#0562FB', color: 'white', padding: '10px', borderRadius: '7px' }}
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {loader ? (
                  <Spinner />
                ) : (
                  <Button
                    style={{ backgroundColor: '#0562fb', color: 'white', padding: '10px', borderRadius: '7px' }}
                    onClick={activeStep === steps.length - 1 ? handleCancelPlan : handleNext}
                  >
                    {activeStep === steps.length - 1 ? 'Cancel Subscription' : 'Next'}
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
          {activeStep === steps.length && (
            <React.Fragment>
              <center style={{ marginBottom: '20px' }}>
                <SoftTypography>Saying Goodbye (Temporarily, We Hope)</SoftTypography>
              </center>
              <SoftBox style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '60vw', padding: '20px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                  <SoftTypography style={{ fontSize: '0.9rem' }}>
                    Your <b>{activePlanDetails?.planName}</b> plan will be cancelled at the end of your current billing
                    period on <b>{activePlanDetails?.endDate}</b>. You will be automatically switched to the free plan
                    post after your current billing cycle. You can upgrade or change your plan anytime after the current
                    billing cycle. You will get an email confirmation of your cancellation.
                  </SoftTypography>
                </Card>
              </SoftBox>

              <Box sx={{ display: 'flex', flexDirection: 'row', p: 2, justifyContent: 'center', marginTop: '1rem' }}>
                <Box>
                  <Button
                    onClick={onBackToAccount}
                    style={{ backgroundColor: '#0562FB', color: 'white', padding: '10px', borderRadius: '7px' }}
                  >
                    Back to your account
                  </Button>
                </Box>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Card>
    </PageLayout>
  );
}
