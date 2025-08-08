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
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

function Header(props) {
  

  return (
    <SoftBox display="flex" justifyContent="space-between" alignItems="center">
      <SoftBox>
        <SoftBox mb={1}>
          <SoftTypography variant="h6" fontWeight="bold">
            Order Details
          </SoftTypography>
        </SoftBox>
        <SoftTypography component="p" variant="button" fontWeight="regular" color="text">
          Order ID: <span sx={{ fontWeight: 'bold' }}>{props.orderNo}</span>
        </SoftTypography>
        {props?.invoiceId && (
          <SoftTypography component="p" variant="button" fontWeight="regular" color="text">
            Invoice ID: <span sx={{ fontWeight: 'bold' }}>{props?.invoiceId}</span>
          </SoftTypography>
        )}
        <SoftTypography component="p" variant="button" fontWeight="regular" color="text">
          Order date: <span sx={{ fontWeight: 'bold' }}>{new Date(props.updatedDate).toLocaleString()}</span>
        </SoftTypography>
        <SoftTypography component="p" variant="button" fontWeight="regular" color="text">
          Delivery method: <span sx={{ fontWeight: 'bold' }}>{props.deliveryMethod}</span>
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

export default Header;
