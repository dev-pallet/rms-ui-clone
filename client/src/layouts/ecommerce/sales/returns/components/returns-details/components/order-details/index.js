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

// Soft UI Dashboard PRO React example components

// OrderDetails page components
import BillingInformation from 'layouts/ecommerce/sales/all-orders/components/sales-details/components/order-details/components/BillingInformation/index';
import Header from 'layouts/ecommerce/sales/all-orders/components/sales-details/components/order-details/components/Header/index';
import OrderInfo from 'layouts/ecommerce/sales/all-orders/components/sales-details/components/order-details/components/OrderInfo/index';
import OrderSummary from 'layouts/ecommerce/orders/order-details/components/OrderSummary';
import PaymentDetails from 'layouts/ecommerce/orders/order-details/components/PaymentDetails';
function OrderDetailspage() {
  return (
 
    <SoftBox my={3}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={12}>
          <Card>
            <SoftBox pt={2} px={2}>
              <Header />
            </SoftBox>
            <Divider />
            <SoftBox mt={3} ml={3}>
              <BillingInformation />
            </SoftBox>
            <SoftBox pt={1} pb={3} px={2}>
              <SoftBox mb={3}>
                <OrderInfo />
              </SoftBox>
              <Divider />
              <SoftBox mt={3}>
                <Grid container spacing={3}>
                  
                  <Grid item xs={12} md={6} lg={5}>
                    <PaymentDetails />
                    {/* <SoftBox mt={3}>
                        <BillingInformation />
                      </SoftBox> */}
                  </Grid>
                  <Grid item xs={12} lg={5} sx={{ ml: 'auto' }}>
                    <OrderSummary />
                  </Grid>
                </Grid>
              </SoftBox>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </SoftBox>
    
   
  );
}

export default OrderDetailspage;
