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
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BillingInformation from './components/BillingInformation';
import Header from './components/Header';
import OrderInfo from './components/OrderInfo';
import OrderSummary from './components/OrderSummary';
import PaymentDetails from './components/PaymentDetails';

function OrderDetailspage(props) {
  
  const [updatedDate, setUpdatedDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [grandTotal, setGrandTotal] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState('');
  const [igst, setIgst] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [orderItemList, setOrderItemList] = useState([]);

  const { orderId } = useParams();

  useEffect(() => {
    
    setUpdatedDate(props.allResponse?.baseOrderResponse?.createdAt);
    setIgst(props.allResponse?.orderBillingDetails?.igst);
    setCgst(props.allResponse?.orderBillingDetails?.cgst);
    setSgst(props.allResponse?.orderBillingDetails?.sgst);
    setSubTotal(props.allResponse?.orderBillingDetails?.subTotal);
    setGrandTotal(props.allResponse?.orderBillingDetails?.grandTotal);
    setDeliveryCharges(props.allResponse?.orderBillingDetails?.shippingCharges);

    setBillingAddress(props.allResponse?.addressEntityModel?.billingAddress);
    setShippingAddress(props.allResponse?.addressEntityModel?.shippingAddress);
    setOrderItemList(props.allResponse?.baseOrderResponse?.orderItemList);
    setDeliveryMethod(props.allResponse?.baseOrderResponse?.deliveryMethod);
    setPaymentMethod(props.allResponse?.orderBillingDetails.paymentMethod);
  }, [props]);

  return (
    <SoftBox my={3}>
      {!props.loader 
        ?  <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card>
              <SoftBox pt={2} px={2}>
                <Header orderNo={orderId} updatedDate={updatedDate} deliveryMethod={deliveryMethod} />
              </SoftBox>
              <Divider />
              <SoftBox mt={3} ml={3}>
                <BillingInformation billingAddress={billingAddress} shippingAddress={shippingAddress} locationId={props.locationId}/>
              </SoftBox>
              <SoftBox pt={1} pb={3} px={2}>
                <SoftBox mb={3}>
                  <OrderInfo 
                    orderItemList={orderItemList} 
                  />
                </SoftBox>
                <Divider />
                <SoftBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={5}>
                      <PaymentDetails paymentMethod={paymentMethod}/>
                    </Grid>
                    <Grid item xs={12} lg={5} sx={{ ml: 'auto' }}>
                      <OrderSummary
                        subTotal={subTotal}
                        grandTotal={grandTotal}
                        deliveryCharges={deliveryCharges}
                        igst={igst}
                        cgst={cgst}
                        sgst={sgst}
                      />
                    </Grid>
                  </Grid>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
        : null
      }
      
    </SoftBox>
  );
}

export default OrderDetailspage;
