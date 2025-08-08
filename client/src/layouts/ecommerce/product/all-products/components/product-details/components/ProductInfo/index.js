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

// @mui material components
import Grid from '@mui/material/Grid';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// Soft UI Dashboard PRO React components
import './prod-inffo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Chip, InputLabel } from '@mui/material';
import { filterVendorSKUData } from '../../../../../../../../config/Services';
import { getValueAfterSecondUnderscore } from '../../../../../../Common/cartUtils';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PropTypes from 'prop-types';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import moment from 'moment';
function ProductInfo({
  datRows,
  inwardedData,
  price,
  barImage,
  loader,
  avgStockTurnoverRatio,
  packagingType,
  pricingDetail,
}) {
  //
  const [foodType, setFoodType] = useState('');
  // const [packagingType, setPackagingType] = useState('');
  const [isCompare, setIsCompare] = useState(false);
  const [bundleProducts, setBundleProducts] = useState([]);
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();

  const html = `${datRows?.description}`;
  const veg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/120px-Veg_symbol.svg.png';
  const nonveg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Non_veg_symbol.svg/120px-Non_veg_symbol.svg.png';
  const d_img = 'https://i.imgur.com/dL4ScuP.png';
  useEffect(() => {
    const payload = {
      page: '1',
      pageSize: '10',
      gtin: datRows?.productSource?.bundledGtins,
      sort: {
        mrpSortOption: 'DEFAULT',
        popular: 'DEFAULT',
        creationDateSortOption: 'DEFAULT',
      },
    };
    if (datRows?.productSource?.bundledGtins.length) {
      filterVendorSKUData(payload)
        .then((res) => {
          setBundleProducts(res?.data?.data?.products);
        })
        .catch((err) => {});
    } else {
      setBundleProducts([]);
    }
  }, [datRows]);

  useEffect(() => {
    if (datRows) {
      if (datRows?.attributes?.food_type === 'Vegetarian') {
        setFoodType('Vegetarian');
      } else if (datRows?.attributes?.food_type === 'Non Vegetarian') {
        setFoodType('Non Vegetarian');
      } else {
        setFoodType('Not Applicable');
      }
      // setPackagingType(datRows?.packaging_type ? datRows.packaging_type.toLowerCase().replace(/\s/g, '') : '');
    }
    if (inwardedData?.sellingPrice || price?.sellingPrice <= inwardedData?.mrp || price?.mrp) {
      setIsCompare(true);
    }
  }, [datRows, inwardedData]);

  const download = () => {
    const link = document.createElement('a');
    link.href = barImage;
    link.download = `${datRows.name}_barcode.png`;
    document.body.appendChild(link);
    link.click();
  };
  const handleBundleProduct = (gtin) => {
    // navigate(`/products/all-products/details/${gtin}`)
  };

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
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  function getBatchHealth(createdDate, expiryDate) {
    const totalDuration = new Date(expiryDate)?.getTime() - new Date(createdDate)?.getTime();

    // Get the duration from creation to current date
    // const elapsedDuration = moment.duration(moment(expiryDate).diff(moment(new Date)));
    const elapsedDuration = new Date()?.getTime() - new Date(createdDate).getTime();
    const progressValue = elapsedDuration / totalDuration;
    // const progress=elapsedDuration

    // Calculate progress value
    // Ensure progress value is within 0 to 100 range
    if (progressValue * 100 >= 1) {
      return progressValue * 100;
    } else {
      return 100;
    }
  }

  const renderExpiryMessage = (expiryDateApi) => {
    if (!expiryDateApi) {
      return 'Date Unavailable';
    }

    // const expiryDate = new Date(expiryDateApi);
    const relativeTime = moment(expiryDateApi).fromNow();

    if (relativeTime.includes('ago')) {
      return `Expired ${relativeTime}`;
    } else if (relativeTime.includes('in')) {
      return `Expiring ${relativeTime}`;
    } else {
      return 'Invalid expiry date';
    }
  };

  const renderExpiredColor = (expiryDateApi) => {
    if (!expiryDateApi) {
      return '';
    }

    const expiryDate = new Date(expiryDateApi);
    const relativeTime = moment(expiryDate).fromNow();

    if (relativeTime.includes('ago')) {
      return 'danger';
    } else if (relativeTime.includes('in')) {
      if (relativeTime.includes('month') || relativeTime.includes('year')) {
        return 'success';
      } else {
        return 'warning';
      }
    } else {
      return 'success';
    }
  };

  return (
    <SoftBox>
      <SoftBox mb={1}>
        <SoftBox className="prod-mini-box">
          <SoftTypography variant="h6" fontWeight="small" className="fruits-text">
            {datRows?.main_category}
            {datRows?.category_level_1 && <KeyboardArrowRightIcon className="left-icon-fruits" />}
            {datRows?.category_level_1}
            {datRows?.category_level_2 && <KeyboardArrowRightIcon />}
            {datRows?.category_level_2}
          </SoftTypography>
        </SoftBox>
        <div className="prod_InfoTag">
          <SoftTypography variant="h3" fontWeight="bold">
            {datRows?.name}
            <img
              style={{
                display: datRows?.attributes?.food_type === 'Not Applicable' ? 'none' : 'inline',
                width: '1.2rem',
                height: '1.2rem',
                position: 'absolute',
                marginTop: '12px',
                marginLeft: '0.5rem',
              }}
              src={datRows?.attributes?.food_type === 'Vegetarian' ? veg : nonveg}
              alt=""
            />
          </SoftTypography>
        </div>

        <SoftTypography component="label" variant="caption" fontWeight="bold">
          {price?.specification} {price?.unitType}
        </SoftTypography>
      </SoftBox>

      <SoftBox className="price-prod-box-flex">
        <SoftBox mt={1} className="first-price-box">
          {isCompare && price?.comparePrice === 'Y' ? (
            <>
              <SoftTypography variant="h6" fontWeight="medium">
                MRP/ Sale Price
              </SoftTypography>
              <SoftTypography variant="h5" fontWeight="medium">
                <span className="mrp">₹{inwardedData?.mrp || price?.mrp}</span>
                <span className="sell">₹{inwardedData?.sellingPrice || price?.sellingPrice}</span>
              </SoftTypography>
            </>
          ) : (
            <>
              <SoftTypography variant="h6" fontWeight="medium">
                MRP/ Sale Price
              </SoftTypography>
              <SoftTypography variant="h5" fontWeight="medium">
                <span className="sell">₹{inwardedData?.mrp || price?.mrp}</span>
                <span className="sell">/ ₹{inwardedData?.sellingPrice || price?.sellingPrice}</span>
              </SoftTypography>
            </>
          )}
        </SoftBox>

        <SoftBox mt={1} className="first-price-box">
          <SoftTypography variant="h6" fontWeight="medium">
            Purchase Price
          </SoftTypography>
          <SoftTypography variant="h5" fontWeight="medium">
            ₹{inwardedData?.purchasePrice || price?.purchasePrice}
          </SoftTypography>
        </SoftBox>
      </SoftBox>

      {/* <SoftBox className="badge-box">
        <SoftBadge variant="contained" color="success" badgeContent="in stock" container />
        <SoftBadge variant="contained" color="warning" badgeContent="Non Returnable " container />
      </SoftBox> */}
      <div style={{ marginTop: '5px' }}>
        {bundleProducts?.map((product, index) => (
          <div className="bundle-cardStyle" key={index} onClick={() => handleBundleProduct(product?.gtin)}>
            <div className="bundle-cardContentStyle">
              <img
                src={product?.images?.front || 'https://i.imgur.com/dL4ScuP.png'}
                alt={index}
                className="bundle-imageStyle"
              />
              <div className="bundle-textContainerStyle">
                <SoftTypography class="bundle-productNameStyle">{product?.name || 'NA'}</SoftTypography>
                <SoftTypography class="bundle-gtinStyle">{product?.gtin || 'NA'}</SoftTypography>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packagingType === 'weighingscale' || barImage === 'NA' ? null : (
        <SoftBox className="price-prod-box-flex">
          <SoftBox mt={1} mb={1} ml={0.5}>
            {loader ? (
              <Spinner />
            ) : (
              <div className="barcode-container">
                <img
                  style={{
                    display: barImage ? 'block' : 'none',
                    objectFit: 'cover',
                    height: '90px',
                  }}
                  src={barImage || d_img}
                  alt=""
                />
                <SoftButton variant="gradient" color="info" iconOnly onClick={download}>
                  <DownloadIcon />
                </SoftButton>
              </div>
            )}
          </SoftBox>
        </SoftBox>
      )}
      {isMobileDevice && (
        <>
          {/* product KPIS */}
          {price && (
            <div>
              <SoftBox style={{ margin: '10px 0px 10px 0px' }} className="content-space-between">
                <SoftTypography variant="h6" fontWeight="medium" style={{ fontSize: 16 }}>
                  Product KPIs
                </SoftTypography>
              </SoftBox>

              <Card className="productKpiCard">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize: '0.9rem', width: '150px' }}
                        >
                          Inventory
                        </SoftTypography>
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
                          <Chip
                            color={categoryColour(price?.inventoryAnalysis)}
                            label={getTagDescription('INVENTORY', price?.inventoryAnalysis)}
                            // variant="outlined"
                            className="tagChipStyle"
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize: '0.9rem', width: '150px' }}
                        >
                          Sales
                        </SoftTypography>
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
                          <Chip
                            color={categoryColour(price?.salesAnalysis)}
                            label={getTagDescription('SALES', price?.salesAnalysis)}
                            className="tagChipStyle"
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize: '0.9rem', width: '150px' }}
                        >
                          Profit
                        </SoftTypography>
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
                          <Chip
                            color={categoryColour(price?.salesProfitAnalysis)}
                            label={getTagDescription('PROFIT', price?.salesProfitAnalysis)}
                            className="tagChipStyle"
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize:"0.9rem",width: '150px' }}
                        >
                          Average Sales Margin
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                    
                      </Grid>
                 
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize:"0.9rem",width: '150px' }}
                        >
                          Average Purchase Margin
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                    
                      </Grid>
                 
                    </Grid>
                  </Grid> */}
                </Grid>
              </Card>
            </div>
          )}
          {/* batch Health */}
          {pricingDetail && pricingDetail[0]?.batchId && (
            <div>
              <SoftBox style={{ margin: '10px 0px 3px 5px' }} className="content-space-between">
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767' }}>Batch Health</InputLabel>
              </SoftBox>
              <Card
                className="productKpiCard"
                style={{ maxHeight: '250px', overflow: 'scroll', scrollbarWidth: 'none' }}
              >
                {' '}
                <Grid container spacing={1} justifyContent={'space-between'} alignItems={'center'}>
                  {pricingDetail
                    ?.filter((item) => item?.availableUnits > 0)
                    ?.map((item) => {
                      return (
                        <>
                          <Grid item xs={4}>
                            <SoftTypography
                              variant="caption"
                              fontWeight="bold"
                              style={{ fontSize: '0.85rem', width: '150px' }}
                            >
                              {item?.batchId}
                            </SoftTypography>
                          </Grid>
                          <Grid item xs={7} justifyContent={'space-between'} alignItems={'center'}>
                            <ProgressBar
                              variant={renderExpiredColor(item?.expiryDateApi)}
                              now={getBatchHealth(item?.createdOn, item?.expiryDateApi)}
                              style={{ height: '0.5rem' }}
                              animated
                            />
                            <SoftTypography
                              variant="caption"
                              fontWeight="bold"
                              style={{ width: '150px', textAlign: 'right' }}
                            >
                              {renderExpiryMessage(item?.expiryDateApi)}
                            </SoftTypography>
                          </Grid>
                          {/* <Grid item xs={7} md={4}>
                    <SoftTypography
                      variant="caption"
                      fontWeight="bold"
                      style={{ fontSize: '0.9rem', width: '150px', textAlign: 'right' }}
                    >
                      {renderExpiryMessage(item?.expiryDateApi)}
                    </SoftTypography>
                  </Grid> */}
                        </>
                      );
                    })}
                </Grid>
              </Card>
            </div>
          )}
        </>
      )}

      <SoftBox mt={3} mb={1} ml={0.5}>
        <SoftTypography variant="caption" fontWeight="bold">
          Description
        </SoftTypography>
      </SoftBox>
      <SoftBox mb={1} ml={1}>
        <div style={{ fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: datRows?.description || 'NA' }} />
      </SoftBox>
      <SoftBox overflow="hidden" style={{ width: '130%', boxSizing: 'border-box' }}>
        <SoftBox mt={3} style={{ width: '100%', boxSizing: 'border-box' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Brand
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input"> {datRows?.brand || 'NA'}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Manufacturer
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input"> {datRows?.company_detail?.name}</p>
            </Grid>

            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Preferred Vendor
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{datRows?.productSource?.supportedVendorNames?.at(-1) || 'NA'}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  HSN
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{datRows?.hs_code}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  GST
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{datRows?.igst}%</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  CESS
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{datRows?.cess || 0}%</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Continue selling when out of stock
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{datRows?.sell_out_of_stock === 'Y' ? <>Yes</> : <>No</>}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Returnable Item
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{datRows?.returnable === 'Y' ? <>Yes</> : <>No</>}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Reorder Point
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{price?.reorderPoint || 0}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Reorder Quantity
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">
                {price?.reorderQuantity || 0} {price?.reorderQuantityType}
              </p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Opening Stock
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{price?.openingStock || 0}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Min. Order Quantity
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">
                {datRows?.minimum_order_quantity || 0} {datRows?.minimum_order_quantity_unit}
              </p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Selling Price Margin Based On
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{price?.marginBasedOn === 'pp' ? 'Purchase Price' : 'MRP'}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Margin
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">
                {price?.marginValue} {price?.marginType}
              </p>
            </Grid>
            {datRows?.productSource?.tags.length > 0 && (
              <Grid item xs={12} lg={6} xl={6}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold">
                    Tags
                  </SoftTypography>
                </SoftBox>
                <div style={{ marginTop: '5px' }}>
                  {datRows?.productSource?.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      // onDelete={() => handleTagDelete(tag)}
                      style={{ marginRight: '8px', marginBottom: '8px', flexWrap: 'wrap', fontSize: '0.75rem' }}
                    />
                  ))}
                </div>
              </Grid>
            )}

            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Average stock turnover ratio
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{avgStockTurnoverRatio}</p>
            </Grid>
            <Grid item xs={12} lg={6} xl={6}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Store Item References
                </SoftTypography>
              </SoftBox>
              <p className="hidden-input">{getValueAfterSecondUnderscore(datRows?.storeItemReferences)}</p>
            </Grid>

            {packagingType === 'weighingscale' ? (
              <>
                <Grid item xs={12} lg={6} xl={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Additional Weighing Specs & units
                    </SoftTypography>
                  </SoftBox>
                  {datRows?.weights_and_measures?.secondarySpecs ? (
                    datRows?.weights_and_measures?.secondarySpecs?.map((item) => (
                      <SoftBox style={{ display: 'flex' }}>
                        <p className="hidden-input">{item?.gross_weight}</p>
                        <p className="hidden-input">{item?.measurement_unit}</p>
                      </SoftBox>
                    ))
                  ) : (
                    <p className="hidden-input">NA</p>
                  )}

                  {/* <SoftBox style={{ display: 'flex' }}>
                    <p className="hidden-input">{datRows?.weights_and_measures?.secondarySpecs[0]?.gross_weight}</p>

                    <p className="hidden-input">{datRows?.weights_and_measures?.secondarySpecs[0]?.measurement_unit}</p>
                  </SoftBox> */}
                </Grid>
                <Grid item xs={12} lg={6} xl={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Selling Unit
                    </SoftTypography>
                  </SoftBox>
                  <p className="hidden-input">{price?.sellingUnit}</p>
                </Grid>
              </>
            ) : null}
            <Grid item xs={12} lg={6} xl={6}></Grid>
            {datRows?.language?.nativeLanguages !== null &&
            datRows?.language?.nativeLanguages[0]?.language &&
            datRows?.language?.nativeLanguages.length ? (
                <Grid item xs={12} lg={8} sx={{ paddingTop: '10px !important' }}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                    Product Title in local language
                    </SoftTypography>
                  </SoftBox>
                  {datRows?.language?.nativeLanguages.map((item) => (
                    <p key={item.language} className="hidden-input">
                      {item.language}: {item.name}
                    </p>
                  ))}
                </Grid>
              ) : (
                <></>
              )}
          </Grid>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}
ProductInfo.propTypes = {
  datRows: PropTypes.object,
};
export default ProductInfo;
