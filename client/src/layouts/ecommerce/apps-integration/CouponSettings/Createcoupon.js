import { Card, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftTypography from '../../../../components/SoftTypography';

const Createcoupon = () => {
  const navigate = useNavigate();

  const handlecoupon = (event) => {
    navigate('/coupons/create/cart-value');
  };
  const handleproduct = (event) => {
    navigate('/coupons/create/product');
  };
  const handlepreapproved = (event) => {
    navigate('/coupons/create/preapproved');
  };
  const handleFreebie = () => {
    navigate('/coupons/create/freebie');
  };
  const handleDynamic = () => {
    navigate('/coupons/create/dynamic');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <center>
        {/* <Card style={{ padding: '10px', textAlign: 'center', width: '200px', marginBottom: '40px' }}> */}
        <SoftTypography style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#4b524d' }}>
          Create Coupon
        </SoftTypography>
        {/* </Card> */}
      </center>

      <Grid container className="cards">
        <Grid item xs={12} sm={12} md={3} xl={4} onClick={handlecoupon}>
          <Card className="cardname" sx={{ cursor: 'pointer' }}>
            <SoftTypography
              textGradient
              color="info"
              style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' }}
            >
              By Cart Value{' '}
            </SoftTypography>{' '}
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={3} xl={4} onClick={handleproduct}>
          <Card className="cardname" sx={{ cursor: 'pointer' }}>
            <SoftTypography
              textGradient
              color="info"
              style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' }}
            >
              Product{' '}
            </SoftTypography>{' '}
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={3} xl={4} onClick={handlepreapproved}>
          <Card className="cardname" sx={{ cursor: 'pointer' }}>
            <SoftTypography
              textGradient
              color="info"
              style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' }}
            >
              Preapproved{' '}
            </SoftTypography>{' '}
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={3} xl={4} onClick={handleFreebie}>
          <Card className="cardname" sx={{ cursor: 'pointer' }}>
            <SoftTypography
              textGradient
              color="info"
              style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' }}
            >
              Freebie{' '}
            </SoftTypography>{' '}
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={3} xl={4} onClick={handleDynamic}>
          <Card className="cardname" sx={{ cursor: 'pointer' }}>
            <SoftTypography
              textGradient
              color="info"
              style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' }}
            >
              Dynamic{' '}
            </SoftTypography>{' '}
          </Card>
        </Grid> */}
      </Grid>
    </DashboardLayout>
  );
};

export default Createcoupon;
