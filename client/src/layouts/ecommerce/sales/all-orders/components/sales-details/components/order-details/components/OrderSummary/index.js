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
import { Drawer } from '@mui/material';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import borders from '../../../../../../../../../../assets/theme/base/borders';

function OrderSummary(props) {
  const { borderWidth, borderColor } = borders;

  return (
    <>
      <SoftBox mb={2}>
        <SoftTypography variant="h6" fontWeight="bold">
          Billing Details
        </SoftTypography>
      </SoftBox>
      <SoftBox
        border={`${borderWidth[1]} solid ${borderColor}`}
        borderRadius="lg"
        p={3}
        mt={2}
      >
        <SoftBox display="flex" justifyContent="space-between" mb={0.5}>
          <SoftTypography fontSize="13px">
            Credit Note:
          </SoftTypography>
          <SoftBox ml={1}>
            <SoftTypography fontSize="13px" >
              {0}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="flex" justifyContent="space-between" mb={0.5}>
          <SoftTypography fontSize="13px">
            Loyality:
          </SoftTypography>
          <SoftBox ml={1}>
            <SoftTypography fontSize="13px" >
              {props?.orderBillingDetails?.loyaltyPointsValue || 0}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="flex" justifyContent="space-between" mb={0.5}>
          <SoftTypography fontSize="13px">
            Coupon:
          </SoftTypography>
          <SoftBox ml={1}>
            <SoftTypography fontSize="13px" >
              {props?.orderBillingDetails?.couponValue || 0}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        {props?.orderBillingDetails?.redeemableWalletBalance !== null &&
          <SoftBox display="flex" justifyContent="space-between" mb={0.5}>
            <SoftTypography fontSize="13px">
            Wallet Balance Redeemed:
            </SoftTypography>
            <SoftBox ml={1}>
              <SoftTypography fontSize="13px" >
                {props?.orderBillingDetails?.redeemableWalletBalance || 0}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        }
        <SoftBox display="flex" justifyContent="space-between" mb={0.5}>
          <SoftTypography fontSize="13px">
            Delivery Charges:
          </SoftTypography>
          <SoftBox ml={1}>
            <SoftTypography fontSize="13px" >
              ₹ {props?.deliveryCharges || 0}
            </SoftTypography>
          </SoftBox>
        </SoftBox>

        <SoftBox display="flex" justifyContent="space-between" mb={0.5}>
          <SoftTypography fontSize="13px">
            Taxes:
          </SoftTypography>
          <SoftBox ml={1}>
            <SoftTypography fontSize="13px" >
              ₹ {props?.tax || 0}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="flex" justifyContent="space-between" mb={0.5}>
          <SoftTypography fontSize="13px">
            SubTotal:
          </SoftTypography>
          <SoftBox ml={1}>
            <SoftTypography fontSize="13px" >
              ₹ {props?.subTotal || 0}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <Drawer />
        <SoftBox display="flex" justifyContent="space-between" mt={3}>
          <SoftTypography fontSize="18px" fontWeight="bold">
            Total:
          </SoftTypography>
          <SoftBox ml={1}>
            <SoftTypography fontSize="18px" fontWeight="bold">
              ₹ {props?.grandTotal || 0}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default OrderSummary;
