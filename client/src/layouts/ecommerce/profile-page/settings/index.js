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
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Settings page components
import { isSmallScreen } from '../../Common/CommonFunction';
import Authentication from 'layouts/ecommerce/profile-page/settings/components/Authentication';
import BasicInfo from 'layouts/ecommerce/profile-page/settings/components/BasicInfo';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DeleteAccount from 'layouts/ecommerce/profile-page/settings/components/DeleteAccount';
import Header from 'layouts/ecommerce/profile-page/settings/components/Header';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import Notifications from 'layouts/ecommerce/profile-page/settings/components/Notifications';
import Sessions from 'layouts/ecommerce/profile-page/settings/components/Sessions';


function NavSettings() {
  const isMobileDevice = isSmallScreen();
  return (
    <DashboardLayout>
      {!isMobileDevice ? <DashboardNavbar/> : <>
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Profile Page'} />
        </SoftBox>
      </>}
      <SoftBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <SoftBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Header />
                </Grid>
                <Grid item xs={12}>
                  <BasicInfo />
                </Grid>
                <Grid item xs={12}>
                  <Authentication />
                </Grid>
                <Grid item xs={12}>
                  <Notifications />
                </Grid>
                <Grid item xs={12}>
                  <Sessions />
                </Grid>
                <Grid item xs={12}>
                  <DeleteAccount />
                </Grid>
              </Grid>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
}

export default NavSettings;
