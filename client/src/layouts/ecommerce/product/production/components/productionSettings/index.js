import './productionSetting.css';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import React from 'react';
import SoftTypography from 'components/SoftTypography';

const ProductionSettings = () => {
  const navigate = useNavigate();

  const handleProductMapping = () => {
    navigate('/product/production-mapping');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box className="production-settings">
        <Grid container spacing={4}>
          <Grid item md={6} xl={6} xs={12}>
            <Box className="setting-card" onClick={handleProductMapping}>
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem',color: 'white' }}
              >
                Production Mapping
              </SoftTypography>
            </Box>
          </Grid>
          <Grid item md={6} xl={6} xs={12}>
            <Box className="setting-card">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem',color: 'white'  }}
              >
                Integration
              </SoftTypography>
            </Box>
          </Grid>
          <Grid item md={6} xl={6} xs={12}>
            <Box className="setting-card">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem',color: 'white'  }}
              >
               Machines
              </SoftTypography>
            </Box>
          </Grid>
          <Grid item md={6} xl={6} xs={12}>
            <Box className="setting-card">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem',color: 'white'  }}
              >
                Production Executives
              </SoftTypography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default ProductionSettings;
