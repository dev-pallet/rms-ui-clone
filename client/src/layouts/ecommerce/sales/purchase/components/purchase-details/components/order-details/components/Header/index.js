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
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';

function Header() {
  return (
    <SoftBox display="flex" justifyContent="space-between" alignItems="center">
      <SoftBox>
        <SoftBox mb={1}>
          <SoftTypography variant="h5" fontWeight="medium">
            Order Details
          </SoftTypography>
        </SoftBox>
        <SoftTypography component="p" variant="button" fontWeight="regular" color="text">
          Order No: <span sx={{ fontWeight: 'bold' }}>#24589</span> 
        </SoftTypography>
        <SoftTypography component="p" variant="button" fontWeight="regular" color="text">
          Order date: <span sx={{ fontWeight: 'bold' }}>23.02.2021</span> 
        </SoftTypography>
        <SoftTypography component="p" variant="button" fontWeight="regular" color="text">
          Delivery method: <span sx={{ fontWeight: 'bold' }}>Bike</span>
        </SoftTypography>
      </SoftBox>
      <SoftButton variant="gradient" color="secondary">
        invoice
      </SoftButton>
    </SoftBox>
  );
}

export default Header;
