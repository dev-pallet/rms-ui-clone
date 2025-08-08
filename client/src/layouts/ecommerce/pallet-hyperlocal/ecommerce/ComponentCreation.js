import './customizeb2c.css';
import { Card, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftTypography from '../../../../components/SoftTypography';

const cardStyle = {
  width: '350px',
  height: '150px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  // background: 'linear-gradient(45deg, #8f7eff, #44a4ff)',
  background: 'linear-gradient(45deg, #f3eaff, #d4ecff)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '20px',
  textAlign: 'center',
  border: '1px solid #ddd',
};

const ComponentCreation = () => {
  const navigate = useNavigate();

  const handleBanner = () => {
    navigate('/pallet-hyperlocal/customize/banner/available');
  };
  const handleTags = () => {
    navigate('/pallet-hyperlocal/customize/tag/filter');
  };
  const handleBrands = () => {
    navigate('/pallet-hyperlocal/customize/brand/preview');
  };
  const handleCategories = () => {
    navigate('/pallet-hyperlocal/customize/categories/preview');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <center style={{ margin: '50px' }}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Card style={cardStyle} onClick={handleBanner}>
              <SoftTypography style={{ fontWeight: 'bold' }}>Banner</SoftTypography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card style={cardStyle} onClick={handleTags}>
              {' '}
              <SoftTypography style={{ fontWeight: 'bold' }}>Tags</SoftTypography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card style={cardStyle} onClick={handleCategories}>
              {' '}
              <SoftTypography style={{ fontWeight: 'bold' }}>Categories</SoftTypography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card style={cardStyle} onClick={handleBrands}>
              {' '}
              <SoftTypography style={{ fontWeight: 'bold' }}>Brand Store</SoftTypography>
            </Card>
          </Grid>
        </Grid>
      </center>
    </DashboardLayout>
  );
};

export default ComponentCreation;
