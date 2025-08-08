import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { Button, Card, Chip, Dialog, DialogContent, DialogTitle, Grid, Tooltip, Typography } from '@mui/material';
import './product-performance.css';
import { avgStockTurnover } from '../../../../../../config/Services';
import dayjs from 'dayjs';
import Spinner from '../../../../../../components/Spinner';
import { isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import ComingSoonAlert from '../../../ComingSoonAlert';

const ProductPerformance = ({
  price,
  gtin,
  pricingDetail,
  loader,
  selectedVariantBarcode,
  selectedVariant,
  avgStockTurnover,
  expectedStockOut,
}) => {
  const [batchDetails, setBatchDetails] = useState([
    {
      batchNumber: '',
      expiry: '',
      stock: '',
      id: 1,
      isExpired: false,
    },
  ]);

  const totalAvailableUnits = pricingDetail?.reduce((total, item) => total + item?.availableUnits, 0);

  const [selectedTab, setSelectedTab] = useState('Sales');

  const calculateExpiryStatus = (expiryDateApi) => {
    if (!expiryDateApi) return { status: 'NA', isExpired: false };

    const now = dayjs();
    const expiryDate = dayjs(expiryDateApi);

    if (now.isAfter(expiryDate)) {
      const monthsExpired = now.diff(expiryDate, 'month');
      const daysExpired = now.diff(expiryDate, 'day');
      if (monthsExpired > 0) {
        return { status: `Expired ${monthsExpired} month${monthsExpired > 1 ? 's' : ''} ago`, isExpired: true };
      } else {
        return { status: `Expired ${daysExpired} day${daysExpired > 1 ? 's' : ''} ago`, isExpired: true };
      }
    }

    const monthsRemaining = expiryDate.diff(now, 'month');
    const daysRemaining = expiryDate.diff(now, 'day');

    if (monthsRemaining > 0) {
      return { status: `Expires in ${monthsRemaining} month${monthsRemaining > 1 ? 's' : ''}`, isExpired: false };
    } else {
      return { status: `Expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`, isExpired: false };
    }
  };

  useEffect(() => {
    // Transform pricingDetails to match batchDetails structure
    const transformedBatchDetails = pricingDetail.map((item, index) => {
      const expiryInfo = calculateExpiryStatus(item?.expiryDateApi);
      return {
        batchNumber: item?.batchId,
        expiry: expiryInfo?.status,
        stock: item?.availableUnits?.toFixed(2),
        id: index + 1, // Ensuring unique IDs starting from 1
        isExpired: expiryInfo?.isExpired,
      };
    });

    // Update the state with the new batch details
    setBatchDetails(transformedBatchDetails);
  }, [pricingDetail, gtin]);

  const [avgStockTurnoverRatio, setAvgStockTurnoverRatio] = useState('');
  const [avgExpected, setAvgExpected] = useState('');

  //   local storage
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const changingChipStatus = (data) => {
    switch (data) {
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  const getTagDescription = (type, result) => {
    if (type === 'INVENTORY') {
      switch (result) {
        case 'A':
          return 'Highest Consumption';
        case 'B':
          return 'Average Consumption';
        case 'C':
          return 'Lowest Consumption';
        case 'D':
          return 'Dead Stock';
        default:
          return '';
      }
    } else if (type === 'SALES') {
      switch (result) {
        case 'A':
          return 'Fast Movement';
        case 'B':
          return 'Average Movement';
        case 'C':
          return 'Low Movement';
        default:
          return '';
      }
    } else if (type === 'PROFIT') {
      switch (result) {
        case 'A':
          return 'Highest Value';
        case 'B':
          return 'Average Value';
        case 'C':
          return 'Lowest Value';
        default:
          return '';
      }
    }
  };

  const categoryColour = (data) => {
    switch (data) {
      case 'A':
        return '#28a745'; // Green
      case 'B':
        return '#ffc107'; // Yellow
      case 'C':
        return '#dc3545'; // Red
      default:
        return '#17a2b8'; // Blue
    }
  };

  const stockTurnOver = () => {
    avgStockTurnover(locId, gtin)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          setAvgStockTurnoverRatio(
            res?.data?.data?.data?.averageStockTurnOver ? res?.data?.data?.data?.averageStockTurnOver + ' days' : 'NA',
          );
          setAvgExpected(res?.data?.data?.data?.averageExpectedStockOut);
        } else if (res?.data?.data?.es === 1) {
          setAvgStockTurnoverRatio('NA');
          setAvgExpected('NA');
        }
      })
      .catch((err) => {
        setAvgStockTurnoverRatio('NA');
        setAvgExpected('NA');
      });
  };

  // useEffect(() => {
  //   stockTurnOver();
  // }, [gtin]);

  const [openComingSoon, setOpenComingSoon] = useState(false);

  const handleOpenComingSoon = () => {
    setOpenComingSoon(true);
  };

  const handleCloseComingSoon = () => {
    setOpenComingSoon(false);
  };

  const isMobileDevice = isSmallScreen();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleViewMoreClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  function truncateText(text) {
    if (text.length > 12) {
      return text.substring(0, 12) + '...';
    }
    return text;
  }

  return (
    <div>
      <Dialog
        open={isPopupOpen}
        onClose={handleClosePopup}
        PaperProps={{ style: { width: '500px', maxWidth: 'none', padding: '15px' } }}
      >
        <DialogTitle>Batch Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} style={{ marginTop: '10px' }}>
            <Grid item xs={5} lg={5} sm={5} md={5}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">Batch no.</Typography>
                {batchDetails.map((item, index) => (
                  <Typography key={index} className="products-new-details-variants-price-typo-value">
                    {textFormatter(item?.batchNumber)}
                  </Typography>
                ))}
              </div>
            </Grid>
            <Grid item xs={5} lg={5} sm={5} md={5}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">Expiry</Typography>
                {batchDetails.map((item, index) => (
                  <Typography
                    className="products-new-details-variants-price-typo-value"
                    key={index}
                    style={{ color: item.isExpired ? 'red' : 'black' }}
                  >
                    {item?.expiry}
                  </Typography>
                ))}
              </div>
            </Grid>
            <Grid item xs={2} lg={2} sm={2} md={2}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">Stock</Typography>
                {batchDetails.map((item, index) => (
                  <Typography key={index} className="products-new-details-variants-price-typo-value">
                    {item?.stock}
                  </Typography>
                ))}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <Button onClick={handleClosePopup} color="primary">
          Close
        </Button>
      </Dialog>
      <SoftBox>
        <Typography className="products-new-details-pack-typo">Product performance</Typography>
        {!isMobileDevice && (
          <Grid container spacing={2}>
            <Grid item lg={4} md={12} sm={12}>
              <SoftBox className="products-new-details-performance-sales-block">
                <Typography className="products-new-details-performance-sales-typo" style={{ color: '#0562FB' }}>
                  Sales & Profit
                </Typography>
                <Grid container spacing={2}>
                  <Grid item lg={6} sm={6} md={6}>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Avg. Sales margin</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {selectedVariant?.salesSync && selectedVariant?.salesSync?.avgSalesMargin
                          ? `₹.${selectedVariant?.salesSync?.avgSalesMargin}`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Total purchase</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.purchaseSync &&
                        selectedVariant?.purchaseSync?.totalPurchase &&
                        selectedVariant?.purchaseSync?.totalPurchaseUnits
                          ? `₹${selectedVariant?.purchaseSync?.totalPurchase} from ${selectedVariant?.purchaseSync?.totalPurchaseUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Discounts</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.salesSync?.totalDiscounts && selectedVariant?.salesSync?.totalDiscountUnits
                          ? `₹${selectedVariant?.salesSync?.totalDiscounts} from ${selectedVariant?.salesSync?.totalDiscountUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Purchase returns</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.purchaseSync?.totalPurchaseReturns &&
                        selectedVariant?.purchaseSync?.totalPurchaseReturnsUnits
                          ? `₹${selectedVariant?.purchaseSync?.totalPurchaseReturns} from ${selectedVariant?.purchaseSync?.totalPurchaseReturnsUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item lg={6} sm={6} md={6}>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Gross profit</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {selectedVariant?.salesSync?.totalProfit && selectedVariant?.salesSync?.totalProfitUnits
                          ? `₹${selectedVariant?.salesSync?.totalProfit} from ${selectedVariant?.salesSync?.totalProfitUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Total sales</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.salesSync?.totalSales && selectedVariant?.salesSync?.totalSalesUnits
                          ? `₹${selectedVariant?.salesSync?.totalSales} from ${selectedVariant?.salesSync?.totalSalesUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Wastage</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.inventoryWastageSync?.totalWastage &&
                        selectedVariant?.inventoryWastageSync?.totalWastageUnits
                          ? `₹${selectedVariant?.inventoryWastageSync?.totalWastage} from ${selectedVariant?.inventoryWastageSync?.totalWastageUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Sales returns</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.salesSync?.totalSalesReturns &&
                        selectedVariant?.salesSync?.totalSalesReturnsUnits
                          ? `₹${selectedVariant?.salesSync?.totalSalesReturns} from ${selectedVariant?.salesSync?.totalSalesReturnsUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </SoftBox>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
              <SoftBox className="products-new-details-performance-sales-block">
                <Typography className="products-new-details-performance-sales-typo" style={{ color: '#0562FB' }}>
                  Inventory
                </Typography>
                <Grid container spacing={2}>
                  <Grid item lg={6} sm={6} md={6}>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Avg. sales/ week</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {selectedVariant?.salesSync && selectedVariant?.salesSync?.totalSalesPerWeekUnits
                          ? selectedVariant?.salesSync?.totalSalesPerWeekUnits
                          : 'NA'}{' '}
                        units
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Avg. stock turnover</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {avgStockTurnover}
                      </Typography>
                    </div>
                    {/* <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Margin Based on</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {price?.marginBasedOn ? price?.marginBasedOn : 'NA'}
                      </Typography>
                    </div> */}
                  </Grid>
                  <Grid item lg={6} sm={6} md={6}>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Stock in hand</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {/* {selectedVariant?.inventoryWastageSync?.stockInHandUnits &&
                        selectedVariant?.inventoryWastageSync?.stockInHandValue
                          ? `${selectedVariant?.inventoryWastageSync?.stockInHandUnits} units - ₹${selectedVariant?.inventoryWastageSync?.stockInHandValue}`
                          : 'NA'} */}
                        {totalAvailableUnits}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Expected stockout</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {expectedStockOut}
                      </Typography>
                    </div>
                    {/* <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Selling margin</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {price?.marginValue && price?.marginType
                          ? price?.marginType === 'Rs'
                            ? `₹ ${price?.marginValue}`
                            : `${price?.marginValue} ${price?.marginType}`
                          : 'NA'}
                      </Typography>
                    </div> */}
                  </Grid>
                </Grid>
                {loader && <Spinner />}
                {!loader && (
                  <>
                    <Grid container spacing={1}>
                      <Grid item lg={3.5} sm={3.5} md={3.5}>
                        <div className="products-new-details-performance-price">
                          <Typography className="products-new-details-variants-price-typo">Batch no.</Typography>
                          {batchDetails?.slice(0, 3).map((item, index) => (
                            <Tooltip key={index} title={item?.batchNumber}>
                              <Typography key={index} className="products-new-details-variants-price-typo-value">
                                {truncateText(item?.batchNumber)}
                              </Typography>
                            </Tooltip>
                          ))}
                        </div>
                      </Grid>
                      <Grid item lg={6.5} sm={6.5} md={6.5}>
                        <div className="products-new-details-performance-price" style={{ alignItems: 'center' }}>
                          <Typography className="products-new-details-variants-price-typo">Expiry</Typography>
                          {batchDetails?.slice(0, 3).map((item, index) => (
                            <Typography
                              className="products-new-details-variants-price-typo-value"
                              key={index}
                              style={{ color: item.isExpired ? 'red' : 'black' }}
                            >
                              {item?.expiry}
                            </Typography>
                          ))}
                        </div>
                      </Grid>
                      <Grid item lg={2} sm={2} md={2}>
                        <div className="products-new-details-performance-price">
                          <Typography className="products-new-details-variants-price-typo">Stock</Typography>
                          {batchDetails?.slice(0, 3).map((item, index) => (
                            <Typography key={index} className="products-new-details-variants-price-typo-value">
                              {item?.stock}
                            </Typography>
                          ))}
                        </div>
                      </Grid>
                    </Grid>
                    {batchDetails?.length > 3 && (
                      <Typography onClick={handleViewMoreClick} className="products-new-details-insights-see-more-1">
                        View More
                      </Typography>
                    )}
                  </>
                )}
              </SoftBox>
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
              <SoftBox className="products-new-details-performance-sales-block">
                <Typography className="products-new-details-performance-sales-typo" style={{ color: '#0562FB' }}>
                  Analysis
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <Typography className="products-new-details-variants-price-typo">Inventory</Typography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        {price?.inventoryAnalysis === 'D' ? (
                          <Chip label="D" />
                        ) : (
                          <Chip
                            color={changingChipStatus(price?.inventoryAnalysis)}
                            label={price?.inventoryAnalysis || 'NA'}
                            variant={price?.inventoryAnalysis === null ? 'outlined' : undefined}
                            style={{ minWidth: 'fit-content' }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.inventoryAnalysis && (
                          <Typography
                            className="products-new-details-variants-price-typo-value"
                            style={{ color: categoryColour(price?.inventoryAnalysis), textAlign: 'left' }}
                          >
                            {getTagDescription('INVENTORY', price?.inventoryAnalysis)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <Typography className="products-new-details-variants-price-typo">Sales</Typography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        <Chip
                          color={changingChipStatus(price?.salesAnalysis)}
                          label={price?.salesAnalysis || 'NA'}
                          variant={price?.salesAnalysis === null ? 'outlined' : undefined}
                          style={{ minWidth: 'fit-content' }}
                        />
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.salesAnalysis && (
                          <Typography
                            className="products-new-details-variants-price-typo-value"
                            style={{ color: categoryColour(price?.salesAnalysis), textAlign: 'left' }}
                          >
                            {getTagDescription('SALES', price?.salesAnalysis)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <Typography className="products-new-details-variants-price-typo">Profit</Typography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        <Chip
                          color={changingChipStatus(price?.salesProfitAnalysis)}
                          label={price?.salesProfitAnalysis || 'NA'}
                          variant={price?.salesProfitAnalysis === null ? 'outlined' : undefined}
                          style={{ minWidth: 'fit-content' }}
                        />
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.salesProfitAnalysis && (
                          <Typography
                            className="products-new-details-variants-price-typo-value"
                            style={{ color: categoryColour(price?.salesProfitAnalysis), textAlign: 'left' }}
                          >
                            {getTagDescription('PROFIT', price?.salesProfitAnalysis)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <div style={{ marginTop: '15px' }}>
                  {/* <Typography className="products-new-details-variants-price-typo">
                    Recommendations <IoInformationCircleOutline color="#367df3" />
                  </Typography>
                  <Typography className="products-new-details-analysis-reco">
                    This product is not generating yield for your store at the moment and classified as dead-stock. Get
                    insights from Pallet IQ for corrective measures.
                  </Typography> */}
                  <div className="products-new-details-analysis-button">
                    <Typography className="products-new-details-analysis-btn-typo" onClick={handleOpenComingSoon}>
                      Try Pallet IQ
                    </Typography>
                  </div>
                  <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
                </div>
              </SoftBox>
            </Grid>
          </Grid>
        )}

        {isMobileDevice && (
          <SoftBox>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <Chip
                label={'Sales & profit'}
                onClick={() => setSelectedTab('Sales')}
                variant={selectedTab === 'Sales' ? '' : 'outlined'}
              />

              <Chip
                label={'Inventory'}
                onClick={() => setSelectedTab('Inventory')}
                variant={selectedTab === 'Inventory' ? '' : 'outlined'}
              />

              <Chip
                label={'Analysis'}
                onClick={() => setSelectedTab('Analysis')}
                variant={selectedTab === 'Analysis' ? '' : 'outlined'}
              />
            </div>

            {selectedTab === 'Sales' && (
              <SoftBox className="products-new-details-performance-sales-block-mob">
                <Typography className="products-new-details-performance-sales-typo" style={{ color: '#0562FB' }}>
                  Sales & Profit
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Avg. Sales margin</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {selectedVariant?.salesSync && selectedVariant?.salesSync?.avgSalesMargin
                          ? `₹.${selectedVariant?.salesSync?.avgSalesMargin}`
                          : 'NA'}
                      </Typography>
                    </div>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Total purchase</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.purchaseSync &&
                        selectedVariant?.purchaseSync?.totalPurchase &&
                        selectedVariant?.purchaseSync?.totalPurchaseUnits
                          ? `₹${selectedVariant?.purchaseSync?.totalPurchase} from ${selectedVariant?.purchaseSync?.totalPurchaseUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Discounts</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.salesSync?.totalDiscounts && selectedVariant?.salesSync?.totalDiscountUnits
                          ? `₹${selectedVariant?.salesSync?.totalDiscounts} from ${selectedVariant?.salesSync?.totalDiscountUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Purchase returns</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.purchaseSync?.totalPurchaseReturns &&
                        selectedVariant?.purchaseSync?.totalPurchaseReturnsUnits
                          ? `₹${selectedVariant?.purchaseSync?.totalPurchaseReturns} from ${selectedVariant?.purchaseSync?.totalPurchaseReturnsUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>
                  </div>
                  <div>
                    <div className="products-new-details-performance-price-mob">
                      <Typography className="products-new-details-variants-price-typo">Gross profit</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {selectedVariant?.salesSync?.totalProfit && selectedVariant?.salesSync?.totalProfitUnits
                          ? `₹${selectedVariant?.salesSync?.totalProfit} from ${selectedVariant?.salesSync?.totalProfitUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price-mob">
                      <Typography className="products-new-details-variants-price-typo">Total sales</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.salesSync?.totalSales && selectedVariant?.salesSync?.totalSalesUnits
                          ? `₹${selectedVariant?.salesSync?.totalSales} from ${selectedVariant?.salesSync?.totalSalesUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price-mob">
                      <Typography className="products-new-details-variants-price-typo">Wastage</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.inventoryWastageSync?.totalWastage &&
                        selectedVariant?.inventoryWastageSync?.totalWastageUnits
                          ? `₹${selectedVariant?.inventoryWastageSync?.totalWastage} from ${selectedVariant?.inventoryWastageSync?.totalWastageUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price-mob">
                      <Typography className="products-new-details-variants-price-typo">Sales returns</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {selectedVariant?.salesSync?.totalSalesReturns &&
                        selectedVariant?.salesSync?.totalSalesReturnsUnits
                          ? `₹${selectedVariant?.salesSync?.totalSalesReturns} from ${selectedVariant?.salesSync?.totalSalesReturnsUnits} units`
                          : 'NA'}
                      </Typography>
                    </div>
                  </div>
                </div>
              </SoftBox>
            )}

            {selectedTab === 'Inventory' && (
              <SoftBox className="products-new-details-performance-sales-block-mob">
                <Typography className="products-new-details-performance-sales-typo" style={{ color: '#0562FB' }}>
                  Inventory
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Avg. sales/ week</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {selectedVariant?.salesSync && selectedVariant?.salesSync?.totalSalesPerWeekUnits
                          ? selectedVariant?.salesSync?.totalSalesPerWeekUnits
                          : 'NA'}{' '}
                        units
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Avg. stock turnover</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {avgStockTurnover}
                      </Typography>
                    </div>
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo">Margin Based on</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {price?.marginBasedOn === 'pp' ? (
                          <>
                            <NorthIcon /> Purchase Price
                          </>
                        ) : price?.marginBasedOn === 'mrp' ? (
                          <>
                            <SouthIcon /> MRP
                          </>
                        ) : (
                          'NA'
                        )}
                      </Typography>
                    </div>
                  </div>
                  <div>
                    <div className="products-new-details-performance-price-mob">
                      <Typography className="products-new-details-variants-price-typo">Stock in hand</Typography>
                      <Typography
                        className="products-new-details-variants-price-typo-value"
                        style={{ color: '#4fb061' }}
                      >
                        {/* {selectedVariant?.inventoryWastageSync?.stockInHandUnits &&
                      selectedVariant?.inventoryWastageSync?.stockInHandValue
                        ? `${selectedVariant?.inventoryWastageSync?.stockInHandUnits} units - ₹${selectedVariant?.inventoryWastageSync?.stockInHandValue}`
                        : 'NA'} */}
                        {totalAvailableUnits}
                      </Typography>
                    </div>

                    <div className="products-new-details-performance-price-mob">
                      <Typography className="products-new-details-variants-price-typo">Expected stockout</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {expectedStockOut}
                      </Typography>
                    </div>
                    <div className="products-new-details-performance-price-mob">
                      <Typography className="products-new-details-variants-price-typo">Selling margin</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {price?.marginValue && price?.marginType
                          ? price?.marginType === 'Rs'
                            ? `₹ ${price?.marginValue}`
                            : `${price?.marginValue} ${price?.marginType}`
                          : 'NA'}
                      </Typography>
                    </div>
                  </div>
                </div>
                {loader && <Spinner />}
                {!loader && (
                  <>
                    <Grid container>
                      <Grid item xs={3} lg={3} sm={3} md={3}>
                        <div className="products-new-details-performance-price">
                          <Typography className="products-new-details-variants-price-typo">Batch no.</Typography>
                          {batchDetails?.slice(0, 2).map((item, index) => (
                            <Tooltip key={index} title={item?.batchNumber}>
                              <Typography key={index} className="products-new-details-variants-price-typo-value">
                                {truncateText(item?.batchNumber)}
                              </Typography>
                            </Tooltip>
                          ))}
                        </div>
                      </Grid>
                      <Grid item xs={6} lg={6} sm={6} md={6}>
                        <div className="products-new-details-performance-price" style={{ alignItems: 'center' }}>
                          <Typography className="products-new-details-variants-price-typo">Expiry</Typography>
                          {batchDetails?.slice(0, 2).map((item, index) => (
                            <Typography
                              className="products-new-details-variants-price-typo-value"
                              key={index}
                              style={{ color: item.isExpired ? 'red' : 'black' }}
                            >
                              {item?.expiry}
                            </Typography>
                          ))}
                        </div>
                      </Grid>
                      <Grid item xs={1.5} lg={1.5} sm={1.5} md={1.5}>
                        <div className="products-new-details-performance-price">
                          <Typography className="products-new-details-variants-price-typo">Stock</Typography>
                          {batchDetails?.slice(0, 2).map((item, index) => (
                            <Typography key={index} className="products-new-details-variants-price-typo-value">
                              {item?.stock}
                            </Typography>
                          ))}
                        </div>
                      </Grid>
                    </Grid>
                    {batchDetails?.length > 2 && (
                      <Typography onClick={handleViewMoreClick} className="products-new-details-insights-see-more-1">
                        View More
                      </Typography>
                    )}
                  </>
                )}
              </SoftBox>
            )}

            {selectedTab === 'Analysis' && (
              <SoftBox className="products-new-details-performance-sales-block-mob">
                <Typography className="products-new-details-performance-sales-typo" style={{ color: '#0562FB' }}>
                  Analysis
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <Typography className="products-new-details-variants-price-typo">Inventory</Typography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        {price?.inventoryAnalysis === 'D' ? (
                          <Chip label="D" />
                        ) : (
                          <Chip
                            color={changingChipStatus(price?.inventoryAnalysis)}
                            label={price?.inventoryAnalysis || 'NA'}
                            variant={price?.inventoryAnalysis === null ? 'outlined' : undefined}
                            style={{ minWidth: 'fit-content' }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.inventoryAnalysis && (
                          <Typography
                            className="products-new-details-variants-price-typo-value"
                            style={{ color: categoryColour(price?.inventoryAnalysis), textAlign: 'left' }}
                          >
                            {getTagDescription('INVENTORY', price?.inventoryAnalysis)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <Typography className="products-new-details-variants-price-typo">Sales</Typography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        <Chip
                          color={changingChipStatus(price?.salesAnalysis)}
                          label={price?.salesAnalysis || 'NA'}
                          variant={price?.salesAnalysis === null ? 'outlined' : undefined}
                          style={{ minWidth: 'fit-content' }}
                        />
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.salesAnalysis && (
                          <Typography
                            className="products-new-details-variants-price-typo-value"
                            style={{ color: categoryColour(price?.salesAnalysis), textAlign: 'left' }}
                          >
                            {getTagDescription('SALES', price?.salesAnalysis)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <Typography className="products-new-details-variants-price-typo">Profit</Typography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        <Chip
                          color={changingChipStatus(price?.salesProfitAnalysis)}
                          label={price?.salesProfitAnalysis || 'NA'}
                          variant={price?.salesProfitAnalysis === null ? 'outlined' : undefined}
                          style={{ minWidth: 'fit-content' }}
                        />
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.salesProfitAnalysis && (
                          <Typography
                            className="products-new-details-variants-price-typo-value"
                            style={{ color: categoryColour(price?.salesProfitAnalysis), textAlign: 'left' }}
                          >
                            {getTagDescription('PROFIT', price?.salesProfitAnalysis)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <div style={{ marginTop: '15px' }}>
                  {/* <Typography className="products-new-details-variants-price-typo">
                  Recommendations <IoInformationCircleOutline color="#367df3" />
                </Typography>
                <Typography className="products-new-details-analysis-reco">
                  This product is not generating yield for your store at the moment and classified as dead-stock. Get
                  insights from Pallet IQ for corrective measures.
                </Typography> */}
                  <div className="products-new-details-analysis-button">
                    <Typography className="products-new-details-analysis-btn-typo" onClick={handleOpenComingSoon}>
                      Try Pallet IQ
                    </Typography>
                  </div>
                  <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
                </div>
              </SoftBox>
            )}
          </SoftBox>
        )}
      </SoftBox>
    </div>
  );
};

export default ProductPerformance;
