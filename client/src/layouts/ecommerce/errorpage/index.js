import './error.css';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';

import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import error404 from 'assets/images/illustrations/error-404.png';
import typography from 'assets/theme/base/typography';

const contextType = localStorage.getItem('contextType');

export const E404Page = () => {
  const { d1, d3, d4, d5 } = typography;
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true}/>
      <SoftBox my={24} height="calc(100vh - 24rem)">
        <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
          <Grid item xs={11} sm={9} container alignItems="center">
            <Grid item xs={12} lg={6}>
              <SoftBox
                fontSize={{ xs: d5.fontSize, sm: d4.fontSize, md: d3.fontSize, lg: d1.fontSize }}
                lineHeight={1.2}
              >
                <SoftTypography variant="inherit" color="error" textGradient fontWeight="bold">
                  Error 404
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h2" color="dark" textGradient fontWeight="bold">
                Erm. Page not found
              </SoftTypography>
              <SoftBox mt={1} mb={2}>
                <SoftTypography variant="body1" color="text">
                  The page you are trying to access was not found.
                </SoftTypography>
              </SoftBox>
              <SoftBox mt={4} mb={2}>
                <SoftButton onClick={() => navigate(`/dashboards/${contextType}`)} variant="gradient" color="dark">
                  go to homepage
                </SoftButton>
              </SoftBox>
            </Grid>
            <Grid item xs={12} lg={6}>
              <SoftBox component="img" src={error404} alt="" width="100%" />
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};
