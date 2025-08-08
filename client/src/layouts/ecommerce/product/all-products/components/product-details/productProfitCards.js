import { Grid, Paper, Typography } from '@mui/material';
import { getProductProfit } from '../../../../../../config/Services';
import Counter from '../../../../Pallet-pay/AnimateCounter';
import React, { useEffect, useState } from 'react';

const ProductProfitCards = ({ gtin }) => {
  const [productProfit, setProductProfit] = useState({});
  const locId = localStorage.getItem('locId');
  useEffect(() => {
    const payload = {
      gtin: gtin,
      locationId: locId,
    };
    getProductProfit(payload)
      .then((res) => {
        setProductProfit(res?.data?.data || {});
      })
      .catch(() => {});
  }, [gtin]);

  return (
    <Grid container spacing={2} justifyContent="space-evenly" style={{ margin: '20px', marginLeft: '-20px' }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper
          elevation={2}
          sx={{
            background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
            padding: '18px',
            color: 'white',
            borderRadius: '10px',
          }}
        >
          {/* <img
    src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
    alt=""
    style={{ width: '30px', marginBottom: '15px' }}
  /> */}
          <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
            Gross Profit
          </Typography>
          <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
            <Counter value={productProfit?.grossProfit || 0} />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper
          elevation={2}
          sx={{
            background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
            padding: '18px',
            color: 'white',
            borderRadius: '10px',
          }}
        >
          {/* <img
    src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
    alt=""
    style={{ width: '30px', marginBottom: '15px' }}
  /> */}
          <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
            Net Profit
          </Typography>
          <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
            <Counter value={productProfit?.netProfit || 0} />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper
          elevation={2}
          sx={{
            background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
            padding: '18px',
            color: 'white',
            borderRadius: '10px',
          }}
        >
          {/* <img
    src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
    alt=""
    style={{ width: '30px', marginBottom: '15px' }}
  /> */}
          <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
            Average Margin
          </Typography>
          <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
            <Counter value={productProfit?.margin || 0} />
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper
          elevation={2}
          sx={{
            background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
            padding: '18px',
            color: 'white',
            borderRadius: '10px',
          }}
        >
          {/* <img
    src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
    alt=""
    style={{ width: '30px', marginBottom: '15px' }}
  /> */}
          <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
            Coupon discounts
          </Typography>
          <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
            <Counter value={productProfit?.discounts || 0} />
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProductProfitCards;
