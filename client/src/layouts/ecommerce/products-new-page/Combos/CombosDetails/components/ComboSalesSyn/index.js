import { Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import { isSmallScreen } from '../../../../../Common/CommonFunction';

const ComboSalesSync = ({ productDetails }) => {
  const isMobileDevice = isSmallScreen();

  return (
    <div>
      <SoftBox>
        <Typography
          className="products-new-details-performance-sales-typo"
          style={{ color: '#0562FB', marginBottom: '0px' }}
        >
          Bundle Sales and profit
        </Typography>
        <SoftBox className="products-new-details-performance-sales-block-23">
          <div className={isMobileDevice ? 'mobile-device-bundle-info' : 'web-screen-bundle-info'}>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Avg. Sales margin</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.salesSync?.avgSalesMargin || 'NA'}
              </Typography>
            </div>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Gross profit</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.salesSync?.totalProfit || 'NA'}
              </Typography>
            </div>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Total purchase</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.purchaseSync?.totalPurchase || 'NA'}
              </Typography>
            </div>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Total sales</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.salesSync?.totalSales || 'NA'}
              </Typography>
            </div>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Discounts</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.salesSync?.totalDiscounts || 'NA'}
              </Typography>
            </div>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Wastage</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.inventoryWastageSync?.totalWastage || 'NA'}
              </Typography>
            </div>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Purchase returns</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.purchaseSync?.totalPurchaseReturns || 'NA'}
              </Typography>
            </div>
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo">Sales returns</Typography>
              <Typography className="products-new-details-variants-price-typo-value">
                {productDetails?.variants?.[0]?.salesSync?.totalSalesReturns || 'NA'}
              </Typography>
            </div>
          </div>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default ComboSalesSync;
