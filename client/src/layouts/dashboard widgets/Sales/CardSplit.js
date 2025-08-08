import { Card, CircularProgress, Grid } from '@mui/material';
import React from 'react';
import SoftTypography from '../../../components/SoftTypography';
import './CardSplit.css';
const CardSplit = ({ valueSplit, ordersSplit, appValueSplit, appOrdersSplit, type }) => {
  const formatLargeNumber = (num) => {
    return num.toLocaleString('en-IN');
  };
  return (
    <Card className="card-box-shadow">
      
      <Grid container spacing={1} style={{ padding: '20px' }}>
        <Grid item xs={12}>
          <div className="CardAlignStyle">
            <SoftTypography className="CardFontStyle">In Store </SoftTypography>
            <SoftTypography className="CardtypeStyle">{type}</SoftTypography>
          </div>

          <div className="CardAlignStyle">
            <SoftTypography style={{ fontSize: '1.25rem', color: '#344767', fontWeight: '700' }}>
              {valueSplit ? `₹ ${formatLargeNumber(Math.round(valueSplit))}` : 'NA'}
            </SoftTypography>
            <SoftTypography style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              {ordersSplit ? `From ${ordersSplit} orders` : null}
            </SoftTypography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <SoftTypography className="CardFontStyle">App </SoftTypography>

          <div className="CardAlignStyle">
            <div>
              <SoftTypography style={{ fontSize: '1.25rem', color: '#344767', fontWeight: '700' }}>
                {appValueSplit ? `₹ ${formatLargeNumber(Math.round(appValueSplit))}` : 'NA'}
              </SoftTypography>
            </div>
            <SoftTypography style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              {appOrdersSplit ? `From ${appOrdersSplit} orders` : null}
            </SoftTypography>
          </div>
          {true ? (
            <div className="card-orderStatus">
              <div className="card-orderStaus-tag order-status-success"> 100</div>
              <div className="card-orderStaus-tag order-status-pending"> 40</div>
              <div className="card-orderStaus-tag order-status-failed"> 18</div>
            </div>
          ) : (
            <div></div>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CardSplit;
