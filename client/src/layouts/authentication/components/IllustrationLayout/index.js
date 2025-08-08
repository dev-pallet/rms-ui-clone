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
import Box from '@mui/material/Box';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React example components
import DefaultNavbar from 'examples/Navbars/DefaultNavbar';
import PageLayout from 'examples/LayoutContainers/PageLayout';

// Soft UI Dashboard PRO React page layout routes
import pageRoutes from 'page.routes';

// Images
import pattern from 'assets/images/shapes/pattern-lines.svg';

import logo from '../../../../assets/images/PALLETlogo.png';

import Footer from 'layouts/authentication/components/Footer';
import './illustrationLayout.css';
import { useMediaQuery } from '@mui/material';
// import { isSmallScreen } from '../../../ecommerce/Common/CommonFunction';
function IllustrationLayout({ color, header, title, description, illustration, children }) {
  const isMobileDevice = useMediaQuery(`(max-width: 768px)`)
  return (
    <PageLayout background="white">
      {/* <DefaultNavbar
        routes={pageRoutes}
        // action={{
        //   type: "external",
        //   route: "https://creative-tim.com/product/soft-ui-dashboard-pro-react",

        // }}
      /> */}

      <Grid container>
        <Grid item xs={12} lg={6}>
          <SoftBox
            display={{ xs: 'none', lg: 'flex' }}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="calc(100% - 2rem)"
            height="calc(100vh - 2rem)"
            position="relative"
            borderRadius="lg"
            bgColor={color}
            variant="gradient"
            m={2}
            px={13}
            sx={{
              overflow: 'hidden',
              background: 'rgb(0,164,255)',
              background: 'linear-gradient(312deg, rgba(0,164,255,1) 35%, rgba(0,35,255,1) 100%)',
            }}
          >
            <SoftBox
              component="img"
              src={pattern}
              alt=""
              width="120rem"
              position="absolute"
              topl={0}
              left={0}
              opacity={0.6}
            />
            <SoftBox>
              <img className="logo-img" src={logo} alt="" />
            </SoftBox>
            <SoftBox mt={5}>
              <SoftTypography variant="h3" fontWeight="bold" color="white">
                Digital transformation for retailers
              </SoftTypography>
            </SoftBox>
            {!isMobileDevice && <video
              autoPlay
              loop
              muted
              className="video-background"
              // poster="https://assets.codepen.io/6093409/river.jpg"
            >
              <source src="https://i.imgur.com/OQpIiTg.mp4" type="video/mp4" />
            </video>}
            {/* {illustration.image && (
              <SoftBox
                component="img"
                src={illustration.image}
                alt="chat-illustration"
                width="100%"
                maxWidth="31.25rem"
              />
            )}
            {illustration.title && (
              <SoftBox mt={6} mb={1}>
                <SoftTypography variant="h4" color="white" fontWeight="bold">
                  {illustration.title}
                </SoftTypography>
              </SoftBox>
            )}
            {illustration.description && (
              <SoftBox mb={1}>
                <SoftTypography variant="body2" color="white">
                  {illustration.description}
                </SoftTypography>
              </SoftBox>
            )} */}
          </SoftBox>
        </Grid>
        <Grid item xs={11} sm={8} md={6} lg={4} xl={3} sx={{ mx: 'auto' }}>
          <SoftBox
            style={{ paddingTop: !isMobileDevice && '15rem' }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100vh"
          >
            <SoftBox pt={3} px={3}>
              {!header ? (
                <>
                  <SoftBox mb={1}>
                    <SoftTypography variant="h4" fontWeight="bold">
                      {title}
                    </SoftTypography>
                  </SoftBox>
                  <SoftTypography variant="body2" fontWeight="regular" color="text">
                    {description}
                  </SoftTypography>
                </>
              ) : (
                header
              )}
            </SoftBox>
            <SoftBox p={3}>{children}</SoftBox>
          </SoftBox>
        </Grid>
      </Grid>
      {/* <Footer/> */}
    </PageLayout>
  );
}

// Setting default values for the props of IllustrationLayout
IllustrationLayout.defaultProps = {
  color: 'info',
  header: '',
  title: '',
  description: '',
  illustration: {},
};

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  illustration: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default IllustrationLayout;
