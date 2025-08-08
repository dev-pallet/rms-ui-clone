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

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect } from 'react';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React example components
import DefaultNavbar from 'examples/Navbars/DefaultNavbar';

// Soft UI Dashboard PRO React page layout routes
import pageRoutes from 'page.routes';

// Images
import waves from 'assets/images/shapes/waves-white.svg';
import { Paper } from '@mui/material';

function Header({ tabValue, tabHandler }) {

  // console.log('tabValue', tabValue);
  console.log("tabHandler",tabHandler)
  
  return (
    <div>
      {/* <DefaultNavbar
        routes={pageRoutes}
        transparent
        light
      /> */}
      <Grid container item xs={12} sm={10} md={8} lg={7} sx={{ mx: 'auto' }}>
        <SoftBox width="100%" mt={6}>
          <SoftBox>
            <Tabs
              value={tabValue}
              onChange={tabHandler}
              // TabIndicatorProps={{style: {background:'blue'}}}
            >
              <Tab
                id="monthly"
                label={
                  <SoftBox py={0.5} px={2}>
                    Monthly
                  </SoftBox>
                }
              />
              <Tab
                id="annual"
                label={
                  <SoftBox py={0.5} px={2}>
                    Annual
                  </SoftBox>
                }
              />
            </Tabs>
          </SoftBox>
        </SoftBox>
      </Grid>
    </div>
  );
}

// Typechecking props for the Header
Header.propTypes = {
  tabValue: PropTypes.number.isRequired,
  tabHandler: PropTypes.func.isRequired,
};

export default Header;
