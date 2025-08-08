import { Card, CircularProgress, Grid, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftTypography from '../../../components/SoftTypography';
import './inventoryCard.css';
import { dashboardInventoryInfo } from '../../../config/Services';
const StockInfoCard = ({ value, orders, appValue, appOrders, type }) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [inventoryStockInfo, setInventoryStockInfo] = useState([]);
  const formatLargeNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  const handleGetStockInfo = () => {
    dashboardInventoryInfo(locId, orgId)
      .then((res) => {
        setInventoryStockInfo(res?.data?.data?.data || []);
      })
      .catch(() => {});
  };
  useEffect(() => {
    handleGetStockInfo();
  }, []);

  function formatNumberToK(value) {
    // Handle negative values
    const isNegative = value < 0;
    value = Math.abs(value);

    // Divide by 1000 and round to two decimal places
    const formattedNumber = (value / 1000).toFixed(2);

    // Add the "k" unit
    const result = formattedNumber + 'k';

    // Prefix a minus sign for negative values
    return isNegative ? '-' + result : result;
  }

  return (
    <Card className="card-box-shadow">
      <Grid container spacing={1} style={{ padding: '20px' }}>
        <Grid item xs={12}>
          <div className="CardAlignStyle">
            <SoftTypography className="CardFontStyle">Stock Info</SoftTypography>
          </div>

          <div className="inventoryCard-splitAlign-Header" style={{ marginTop: '5px' }}>
            <SoftTypography style={{ fontSize: '1rem', color: '#344767', fontWeight: '700' }}>Split</SoftTypography>
            <div className="inventoryCard-splitAlign">
              {inventoryStockInfo?.map((item) => (
                <SoftTypography className="tagHead-flex">
                  {item?.analysis} ({item?.productCount})
                </SoftTypography>
              ))}
              {/* <SoftTypography className="tagHead-flex">B %</SoftTypography>
              <SoftTypography className="tagHead-flex">C %</SoftTypography> */}
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="inventoryCard-splitAlign-Header" style={{ marginTop: '5px' }}>
            <SoftTypography style={{ fontSize: '1rem', color: '#344767', fontWeight: '700' }}>Qty</SoftTypography>
            <div className="inventoryCard-splitAlign">
              {inventoryStockInfo?.map((item) => (
                <Tooltip title={formatLargeNumber(Math.round(item?.totalAvailableUnits))} placement="bottom" arrow>
                  <SoftTypography className="tagHead-flex">
                    {formatLargeNumber(Math.round(item?.totalAvailableUnits))}

                    {/* {formatNumberToK(item?.totalAvailableUnits)} */}
                  </SoftTypography>
                </Tooltip>
              ))}
              {/* <SoftTypography className="tagHead-flex">B %</SoftTypography>
              <SoftTypography className="tagHead-flex">C %</SoftTypography> */}
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="inventoryCard-splitAlign-Header" style={{ marginTop: '5px' }}>
            <SoftTypography style={{ fontSize: '1rem', color: '#344767', fontWeight: '700' }}>Amt</SoftTypography>
            <div className="inventoryCard-splitAlign">
              {inventoryStockInfo?.map((item) => (
                <Tooltip title={formatLargeNumber(Math.round(item?.totalStockValue))} placement="bottom" arrow>
                  <SoftTypography className="tagHead-flex">
                    {/* {formatLargeNumber(Math.round(item?.totalStockValue))} */}
                    {formatNumberToK(item?.totalStockValue)}
                  </SoftTypography>
                </Tooltip>
              ))}
              {/* <SoftTypography className="tagHead-flex">B %</SoftTypography>
              <SoftTypography className="tagHead-flex">C %</SoftTypography> */}
            </div>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default StockInfoCard;
