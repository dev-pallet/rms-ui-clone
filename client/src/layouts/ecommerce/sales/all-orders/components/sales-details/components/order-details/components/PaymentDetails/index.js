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

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React base styles
import borders from 'assets/theme/base/borders';

// Images

function PaymentDetails(props) {
  const { borderWidth, borderColor } = borders;

  return (
    <>
      <SoftTypography variant="h6" fontWeight="bold">
        Payment details
      </SoftTypography>
      <SoftBox
        border={`${borderWidth[1]} solid ${borderColor}`}
        borderRadius="lg"
        display="flex"
        flexDirection='column'
        justifyContent="space-between"
        alignItems="flex-start"
        p={3}
        mt={2}
      >
        <SoftTypography fontSize="13px" fontWeight="medium">
          Payment Method: <b>{props.paymentMethod}</b>
        </SoftTypography>
        <SoftTypography fontSize="13px" fontWeight="medium">
          Payment Status: <b style={{color:'green'}}>{props.paymentStatus}</b>
        </SoftTypography>
      </SoftBox>
    </>
  );
}

export default PaymentDetails;
