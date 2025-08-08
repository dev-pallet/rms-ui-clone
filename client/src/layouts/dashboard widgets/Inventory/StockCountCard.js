import { Card, CircularProgress, Grid } from '@mui/material';
import React from 'react';
import SoftTypography from '../../../components/SoftTypography';
import './inventoryCard.css';
const StockCountCard = ({ value, orders, appValue, appOrders, type }) => {
  const formatLargeNumber = (num) => {
    return num.toLocaleString('en-IN');
  };
  return (
    <Card className="card-box-shadow" >
      <Grid container spacing={1} style={{minHeight:"146px" , padding:"20px"}} >
        <Grid item xs={12}>
          <div className="CardAlignStyle">
            <SoftTypography className="CardFontStyle">Stock Count</SoftTypography>
          </div>

          <div className="CardAlignStyle" style={{ marginTop: '5px' }}>
            <SoftTypography style={{ fontSize: '1rem', color: '#344767', fontWeight: '700' }}>Session</SoftTypography>
            <SoftTypography style={{ fontSize: '0.95rem', color: '#344767', fontWeight: '700' }}>
              ---------
            </SoftTypography>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className="CardAlignStyle">
            <div>
              <SoftTypography style={{ fontSize: '1rem', color: '#344767', fontWeight: '700' }}>
                Counted{' '}
              </SoftTypography>
            </div>
            <div>
              <SoftTypography style={{ fontSize: '1rem', color: '#344767', fontWeight: '700' }}>
                500/ 5326{' '}
              </SoftTypography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default StockCountCard;
