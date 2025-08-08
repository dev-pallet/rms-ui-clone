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

import { useState } from 'react';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Images
import { Box } from '@mui/material';
import { getCustomerDetails, getWarehouseData } from '../../../../../../config/Services';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useEffect } from 'react';
import Spinner from 'components/Spinner/index';

function Header() {
  const [logo, setLogo] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobilDevice = isSmallScreen();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  useEffect(() => {
    if (!loading) {
      setLoading(true);
      if (contextType === 'RETAIL') {
        getCustomerDetails(orgId).then((response) => {
          setBusinessName(response?.data?.data?.retail?.displayName);
          setLogo(response?.data?.data?.retail?.logoUrl);
          setLoading(false);
        });
        return;
      }
      getWarehouseData(orgId).then((response) => {
        setBusinessName(response.data.data?.displayName);
        setLogo(response.data.data?.logo);
        setLoading(false);
      });
    }
  }, []);
  return (
    <Card id="profile" className={`${isMobilDevice && 'po-box-shadow'}`}>
      {loading ? (
        <SoftBox p={2}>
          <Spinner />
        </SoftBox>
      ) : (
        <SoftBox p={2}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <SoftAvatar src={logo} alt="" variant="rounded" size="xl" shadow="sm" />
            </Grid>
            <Grid item>
              <SoftBox height="100%" mt={0.5} lineHeight={1}>
                <SoftTypography variant="h6" fontWeight="medium">
                  {businessName}
                </SoftTypography>
                <Box display="flex" flexDirection="column">
                  <SoftTypography variant="button" color="text" fontWeight="medium">
                    Organisation ID: {orgId}
                  </SoftTypography>
                  <SoftTypography variant="button" color="text" fontWeight="medium">
                    Location ID: {locId}
                  </SoftTypography>
                  <SoftTypography variant="button" color="text" fontWeight="bold">
                    {contextType} Management
                  </SoftTypography>
                </Box>
              </SoftBox>
            </Grid>
          </Grid>
        </SoftBox>
      )}
    </Card>
  );
}

export default Header;
