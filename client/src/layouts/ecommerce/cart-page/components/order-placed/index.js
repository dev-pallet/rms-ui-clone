import { Box, Card, Grid } from '@mui/material';
import { getsalesorderdetailsvalue } from '../../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';

export const OrderPlaced = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderBillingDetails, setOrderBillingDetails] = useState([]);
  const [baseOrderResponse, setBaseOrderResponse] = useState([]);
  const [loader, setLoader] = useState(false);
  const [locationId, setLocationId] = useState(false);
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const locId = localStorage.getItem('locId');
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    // for online payment
    if (timer <= 0) {
      setLoader(true);
      getsalesorderdetailsvalue(orderId).then((res) => {
        setLoader(false);
        if (res?.data?.data?.baseOrderResponse?.destinationLocationId === locId) {
          setLocationId(true);
        } else if (res?.data?.data?.baseOrderResponse?.sourceLocationId === locId) {
          setLocationId(false);
        }
        setBaseOrderResponse(res?.data?.data?.baseOrderResponse);
        setOrderBillingDetails(res?.data?.data?.orderBillingDetails);
        setBillingAddress(res?.data?.data?.addressEntityModel?.billingAddress);
        setShippingAddress(res?.data?.data?.addressEntityModel?.shippingAddress);
      });
    }
  }, [timer]);

  useEffect(() => {
    setLoader(true);
    getsalesorderdetailsvalue(orderId).then((res) => {
      setLoader(false);
      if (res?.data?.data?.baseOrderResponse?.destinationLocationId === locId) {
        setLocationId(true);
      } else if (res?.data?.data?.baseOrderResponse?.sourceLocationId === locId) {
        setLocationId(false);
      }
      setBaseOrderResponse(res?.data?.data?.baseOrderResponse);
      setOrderBillingDetails(res?.data?.data?.orderBillingDetails);
      setBillingAddress(res?.data?.data?.addressEntityModel?.billingAddress);
      setShippingAddress(res?.data?.data?.addressEntityModel?.shippingAddress);
    });
    
  }, []);


  const handleGotoOrder = () => {
    if (baseOrderResponse.destinationId === 'PALLET_ORG') {
      navigate(`/marketplace-order/details/${orderId}`);
    } else {
      navigate(`/order/details/${orderId}`);
    }
  };
  const handleContinue = () => {
    if (baseOrderResponse.destinationId === 'PALLET_ORG') {
      navigate('/market-place/purchase-history');
    } else {
      navigate('/sales/all-orders');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const prodImage = 'https://static.blog.bolt.eu/LIVE/wp-content/uploads/2022/04/30135418/grocery-list-1024x536.jpg';
  return (
    <DashboardLayout>
      <DashboardNavbar />

      {timer !== 0 && timer > 0 && orderBillingDetails.paymentMethod !== 'COD' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            style={{
              height: '300px',
              width: '600px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            <SoftTypography sx={{ fontSize: '14px' }}>
              <b>Order Id:</b> {orderId}
            </SoftTypography>
            <SoftTypography sx={{ fontSize: '15px' }}>
              <b>Your Order is Completed</b>{' '}
            </SoftTypography>
            {/* insert big font timer like 0:05 here */}
            <SoftTypography sx={{ fontSize: '80px', color: '#44d43f' }}>
              <b>{timer > 0 ? `0:${timer.toString().padStart(2, '0')}` : '0:00'}</b>
            </SoftTypography>
          </Card>
        </div>
      )}

      {(timer <= 0 || orderBillingDetails.paymentMethod === 'COD')? (
        <Box>
          <SoftBox className="order-placed">
            <SoftBox className="order-head">
              <CheckCircleIcon color="success" fontSize="large" />
              <SoftTypography color="success">Order placed, thank you! </SoftTypography>
            </SoftBox>
            <Box sx={{ padding: '10px' }}>
              <SoftTypography sx={{ fontSize: '14px' }}>
                <b>Order Id:</b> {orderId}
              </SoftTypography>
              <SoftTypography sx={{ fontSize: '14px' }}>
                <b>Order Value:</b> ₹{orderBillingDetails.grandTotal}
              </SoftTypography>
              <SoftTypography sx={{ fontSize: '14px' }}>
                <b>Order Status:</b> {baseOrderResponse.orderStatus}
              </SoftTypography>
              <SoftTypography sx={{ fontSize: '14px' }}>
                <b>Payment Method:</b> {orderBillingDetails.paymentMethod}
              </SoftTypography>
              <SoftTypography sx={{ fontSize: '14px' }}>
                <b>Payment Status:</b> {baseOrderResponse.paymentStatus}
              </SoftTypography>
            </Box>
            {billingAddress?.city === null || shippingAddress?.city === null ? null : (
              <Grid container gap="20px" p={2}>
                <Grid item xs={12} xl={5.5} mr={2}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Billing Address
                  </SoftTypography>
                  <SoftBox
                    component="li"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    bgColor="grey-100"
                    borderRadius="lg"
                    p={3}
                    mt={2}
                  >
                    <SoftBox width="100%" display="flex" flexDirection="column" lineHeight={1}>
                      <SoftBox mb={1} lineHeight={0}>
                        <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                          {billingAddress?.addressLine1} {billingAddress?.addressLine2} {billingAddress?.city}{' '}
                          {billingAddress?.state} {billingAddress?.pinCode} {billingAddress?.country}
                        </SoftTypography>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} xl={5.5} mr={2}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Shipping Address
                  </SoftTypography>
                  <SoftBox
                    component="li"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    bgColor="grey-100"
                    borderRadius="lg"
                    p={3}
                    mt={2}
                  >
                    <SoftBox width="100%" display="flex" flexDirection="column" lineHeight={1}>
                      <SoftBox mb={1} lineHeight={0}>
                        <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                          {shippingAddress?.addressLine1} {shippingAddress?.addressLine2} {shippingAddress?.city}{' '}
                          {shippingAddress?.state} {shippingAddress?.pinCode} {shippingAddress?.country}
                        </SoftTypography>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </Grid>
              </Grid>
            )}
            <SoftBox className="cart-option">
              <SoftTypography className="go-to-order" onClick={handleGotoOrder}>
                Go to your order
              </SoftTypography>
              <SoftTypography className="go-to-order" onClick={handleContinue}>
                Go to All Orders
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </Box>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
};
