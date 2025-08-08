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

// Soft UI Dashboard PRO React components
import Grid from '@mui/material/Grid';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';


function BillingInformation(props) {
  const billingAddress = props.billingAddress;
  const shippingAddress = props.shippingAddress;
  return (
    <>
  
      <Grid container sapcing={3}>
        {billingAddress?.city === null || shippingAddress?.city === null
          ? null
          :<Grid item xs={12} xl={5.5} mr={2}>
            <SoftTypography variant="h6" fontWeight="medium">Billing Address</SoftTypography> 
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
                    {billingAddress?.addressLine1} {billingAddress?.addressLine2} {billingAddress?.city} {billingAddress?.state} {billingAddress?.pinCode} {billingAddress?.country}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </SoftBox> 
          </Grid>
        }

        {shippingAddress === null
          ?null
          :<Grid item xs={12} xl={5.5} mr={2}>
            <SoftTypography variant="h6" fontWeight="medium">Shipping Address</SoftTypography> 
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
                    {shippingAddress.addressLine1} {shippingAddress.addressLine2} {shippingAddress.city} {shippingAddress.state} {shippingAddress.pinCode} {shippingAddress.country}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </Grid>
        }
      </Grid>
    </>
  );
}

export default BillingInformation;
