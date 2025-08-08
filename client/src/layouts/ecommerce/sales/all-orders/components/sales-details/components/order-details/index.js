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

// @mui material components
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// OrderDetails page components
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BillingInformation from 'layouts/ecommerce/sales/all-orders/components/sales-details/components/order-details/components/BillingInformation/index';
import Header from 'layouts/ecommerce/sales/all-orders/components/sales-details/components/order-details/components/Header/index';
import OrderInfo from 'layouts/ecommerce/sales/all-orders/components/sales-details/components/order-details/components/OrderInfo/index';
import OrderSummary from './components/OrderSummary';
import PaymentDetails from './components/PaymentDetails';

const OrderDetailspage = ((props) => {
  const [updatedDate, setUpdatedDate] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [tax, setTax] = useState('');
  const [grandTotal, setGrandTotal] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState('');
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [orderItemList, setOrderItemList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [invoiceId , setInvoiceId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [orderBillingDetails, setOrderBillingDetails] = useState({});

  const { orderId } = useParams();

  useEffect(() => {
    setUpdatedDate(props.allResponse?.baseOrderResponse?.createdAt);

    setSubTotal(props.allResponse?.orderBillingDetails?.subTotal);
    setTax(props.allResponse?.orderBillingDetails?.tax);
    setGrandTotal(props.allResponse?.orderBillingDetails?.grandTotal);
    setDeliveryCharges(props.allResponse?.orderBillingDetails?.deliveryCharges);
    setOrderBillingDetails(props.allResponse?.orderBillingDetails);
    setBillingAddress(props.allResponse?.addressEntityModel?.billingAddress);
    setShippingAddress(props.allResponse?.addressEntityModel?.shippingAddress);
    setOrderItemList(props.allResponse?.baseOrderResponse?.orderItemList);
    setDeliveryMethod(props.allResponse?.baseOrderResponse?.deliveryMethod);
    setPaymentMethod(props.allResponse?.orderBillingDetails?.paymentMethod);
    setInvoiceId(props.allResponse?.baseOrderResponse?.invoiceId);
    setPaymentStatus(props.allResponse?.baseOrderResponse?.paymentStatus);
  }, [props]);

  const isMobileDevice = isSmallScreen();

  return (
    <SoftBox my={3}>
      {!props.loader ? (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card className={`${isMobileDevice && 'po-box-shadow'}`}>
              <SoftBox pt={2} px={2}>
                <Header orderNo={orderId} updatedDate={updatedDate} deliveryMethod={deliveryMethod} invoiceId={invoiceId}/>
              </SoftBox>
              <Divider />
              <SoftBox mt={3} ml={3}>
                <BillingInformation
                  billingAddress={billingAddress}
                  shippingAddress={shippingAddress}
                  locationId={props.locationId}
                />
              </SoftBox>
              <SoftBox pt={1} pb={3} px={2}>
                <SoftBox mb={3}>
                  <OrderInfo
                    orderItemList={orderItemList}
                    returnItem={props.returnItem}
                    handleCancelReturn={props.handleCancelReturn}
                  />
                </SoftBox>
                <Divider />
                <SoftBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                      <PaymentDetails paymentMethod={paymentMethod} paymentStatus={paymentStatus} />
                    </Grid>
                    <Grid item xs={12} lg={6} sx={{ ml: 'auto' }}>
                      <OrderSummary
                        subTotal={subTotal}
                        tax={tax}
                        grandTotal={grandTotal}
                        deliveryCharges={deliveryCharges}
                        orderBillingDetails={orderBillingDetails}
                      />
                    </Grid>
                  </Grid>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </SoftBox>
  );
});

export default OrderDetailspage;
