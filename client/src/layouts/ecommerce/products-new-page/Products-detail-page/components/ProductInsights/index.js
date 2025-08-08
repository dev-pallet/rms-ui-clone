import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import {
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import './product-insights.css';
import { useNavigate } from 'react-router-dom';
import { formatDateDDMMYYYY, isSmallScreen } from '../../../../Common/CommonFunction';
import SplideCommon from '../../../../../dashboards/default/components/common-tabs-carasoul';
import { SplideSlide } from '@splidejs/react-splide';
import ComingSoonAlert from '../../../ComingSoonAlert';
import {
  addProductInventory,
  getBranchAllAdresses,
  getLocationDetailsByGtin,
  getRetailBranchDetails,
  getVendorDetailsByGtin,
} from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import CloseIcon from '@mui/icons-material/Close';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftInput from '../../../../../../components/SoftInput';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';

const ProductInsights = ({
  gtin,
  reloadBatchDetails,
  isBundle,
  pricingDetail,
  price,
  productDetails,
  selectedVariant,
  setReloadBatchDetails,
}) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [locationDetails, setLocationDetails] = useState([]);
  const [locationPopup, setLocationPopup] = useState(false);
  const [locationNames, setLocationNames] = useState([]);
  const [openSettings, setOpenSettings] = useState(false);
  const [marginLoader, setMarginLoader] = useState(false);

  const isMobileDevice = isSmallScreen();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userName = localStorage.getItem('user_name');

  const [openComingSoon, setOpenComingSoon] = useState(false);

  const handleOpenComingSoon = () => {
    setOpenComingSoon(true);
  };

  const handleCloseComingSoon = () => {
    setOpenComingSoon(false);
  };

  const getProductLocationDetails = () => {
    const payload = {};
    getLocationDetailsByGtin(payload, gtin, orgId).then((res) => {
      if (res?.data?.data?.es === 0) {
        const locations = res?.data?.data?.data || [];
        setLocationDetails(locations);

        const locationIds = locations.map((location) => location.locationId);
        fetchLocationNames(locationIds); // Fetching location names separately
      } else {
        // showSnackbar('Cannot fetch location details', 'error');
      }
    });
  };

  // Function to fetch location names based on locationIds
  const fetchLocationNames = (locationIds) => {
    Promise.all(locationIds.map((id) => getRetailBranchDetails(id)))
      .then((responses) => {
        const names = responses.map((res) => res?.data?.data?.branch?.displayName || 'NA');
        setLocationNames(names); // Update state with fetched names
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getProductLocationDetails();
  }, [gtin, reloadBatchDetails]);

  const handleClosePopup = () => {
    setLocationPopup(false);
  };

  const handleViewMore = () => {
    setLocationPopup(true);
  };

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    filterOffers();
  }, [pricingDetail]);

  const filterOffers = () => {
    const filteredOffers = pricingDetail?.filter((item) => item?.offerId !== null);
    setOffers(filteredOffers);
  };

  const [showMoreOffer, setShowMoreOffers] = useState(false);

  // Filter unique offers based on offerId
  const uniqueOffers = offers?.filter(
    (item, index, self) => index === self.findIndex((t) => t.offerId === item.offerId),
  );

  // Split the offers to show first 2 in the grid and the rest in the popup
  const visibleOffers = uniqueOffers?.slice(0, 2);
  const remainingOffers = uniqueOffers?.slice(2);

  const handleShowMoreOffers = () => {
    setShowMoreOffers(true);
  };
  const handleCloseOffers = () => {
    setShowMoreOffers(false);
  };

  const handleOpenNew = () => {
    setOpenSettings(true);
  };

  const [marginValue, setMarginValue] = useState(''); // State for margin input value
  const [unit, setUnit] = useState('%');
  const [marginBasedOn, setMarginBasedOn] = useState('');

  // Options for SoftSelect dropdown
  const options = [
    { value: 'Rs', label: 'Rs' },
    { value: '%', label: '%' },
  ];

  // Handle change in SoftSelect
  const handleSelectChange = (selectedOption) => {
    setUnit(selectedOption.value);
  };

  // Handle margin input change
  const handleInputChange = (e) => {
    setMarginValue(e.target.value);
  };

  const [vendorTOT, setVendorTOT] = useState([]);

  // const vendorTOT = [
  //   {
  //     id: 1,
  //     vendorName: 'jekrnfej',
  //     vendorMargin: '12',
  //   },
  //   {
  //     id: 2,
  //     vendorName: 'jekrnfdfnej',
  //     vendorMargin: '2',
  //   },
  //   {
  //     id: 3,
  //     vendorName: 'jekrnnfcfej',
  //     vendorMargin: '10',
  //   },
  //   {
  //     id: 4,
  //     vendorName: 'ekrnfej',
  //     vendorMargin: '20',
  //   },
  // ];

  const [viewMoreVendors, setViewMoreVendors] = useState(false);

  const handleViewVendors = () => {
    setViewMoreVendors(true);
  };

  useEffect(() => {
    const payload = {
      pageNo: 1,
      pageSize: 100,
      locationId: locId,
      orgId: orgId,
      gtin: [gtin],
    };

    getVendorDetailsByGtin(payload).then((res) => {
      if (res?.data?.data?.es === 0) {
        const results = res?.data?.data?.object;
        const data = results?.map((item) => {
          return {
            id: item?.vendorId,
            vendorName: item?.displayName || 'NA',
            vendorMargin: item?.purchaseMargin || 'NA',
          };
        });
        setVendorTOT(data);
      }
    });
  }, []);

  const handleCreateMargin = () => {
    setMarginLoader(true);
    const payload = {
      productId: productDetails?.id,
      locationId: locId,
      createdBy: userName,
      sourceId: orgId,
      gtin: gtin,
      orgId: orgId,
      locationType: 'RETAIL',
      itemName: selectedVariant?.name,
      category: productDetails?.appCategories?.categoryLevel1?.[0],
      brand: productDetails?.companyDetail?.brand,
      subCategory: productDetails?.appCategories?.categoryLevel2?.[0],
      multipleBatchCreations: price?.multipleBatchCreations,
      packagingType: selectedVariant?.needsWeighingScaleIntegration ? 'weighingScale' : 'standard',
      sellingUnit: selectedVariant?.weightUnit,
      skuid: gtin,
      marginValue: marginValue,
      marginType: unit,
      marginBasedOn: marginBasedOn,
    };
    addProductInventory(payload)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          showSnackbar('Selling Margin added', 'success');
        } else {
          showSnackbar('There was an error while creating selling margin', 'error');
        }
        setMarginLoader(false);
        setReloadBatchDetails(!reloadBatchDetails);
        setOpenSettings(false);
      })
      .catch((error) => {
        setMarginLoader(false);
        setReloadBatchDetails(!reloadBatchDetails);
        setOpenSettings(false);
        showSnackbar(error, 'error');
      });
  };

  return (
    <div>
      <Dialog
        open={locationPopup}
        onClose={handleClosePopup}
        PaperProps={{ style: { width: '500px', maxWidth: 'none', padding: '15px' } }}
      >
        <DialogTitle>Location Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            <Grid item lg={2} sm={2} md={2}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">Location</Typography>
                {locationDetails?.slice(0, 3).map((item, index) => (
                  <Typography key={index} className="products-new-details-variants-price-typo-value">
                    {locationNames[index] ? locationNames[index] : 'NA'}
                  </Typography>
                ))}
              </div>
            </Grid>
            <Grid item lg={2} sm={2} md={2}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">MRP</Typography>
                {locationDetails?.slice(0, 3).map((item, index) => (
                  <Typography key={index} className="products-new-details-variants-price-typo-value">
                    {item?.mrp ? `₹${item?.mrp}` : 'NA'}
                  </Typography>
                ))}
              </div>
            </Grid>
            <Grid item lg={2} sm={2} md={2}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">Sale Price</Typography>
                {locationDetails?.slice(0, 3).map((item, index) => (
                  <Typography key={index} className="products-new-details-variants-price-typo-value">
                    {item?.sellingPrice ? `₹${item?.sellingPrice}` : 'NA'}
                  </Typography>
                ))}
              </div>
            </Grid>
            <Grid item lg={3} sm={3} md={3}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">Available Stock</Typography>
                {locationDetails?.slice(0, 3).map((item, index) => (
                  <Typography key={index} className="products-new-details-variants-price-typo-value">
                    {item?.availableUnits ? item?.availableUnits.toFixed(2) : 'NA'}
                  </Typography>
                ))}
              </div>
            </Grid>
            <Grid item lg={3} sm={3} md={3}>
              <div className="products-new-details-performance-price">
                <Typography className="products-new-details-variants-price-typo">Stock Turnover</Typography>
                {locationDetails?.slice(0, 3).map((item, index) => (
                  <Typography key={index} className="products-new-details-variants-price-typo-value">
                    {item?.stockTurnOver ? item?.stockTurnOver : 'NA'}
                  </Typography>
                ))}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        PaperProps={{ style: { width: '500px', maxWidth: 'none', padding: '15px' } }}
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SoftTypography variant="h6" fontWeight="bold">
              Custom Price Edit
            </SoftTypography>
            <IconButton onClick={() => setOpenSettings(false)} size="small">
              <CloseIcon color="error" fontSize="small" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <SoftSelect
            // menuPortalTarget={document.body}
            id="status"
            placeholder="Select Margin Type"
            options={[
              { value: 'pp', label: 'MARKUP (Based on pp)' },
              { value: 'mrp', label: 'MARKDOWN (Based on mrp)' },
              // { value: 'CUSTOM', label: 'CUSTOM' },
            ]}
            onChange={(option) => setMarginBasedOn(option?.value)}
          ></SoftSelect>
          <Typography
            className="products-new-details-performance-sales-typo"
            style={{ color: '#367df3', marginTop: '20px', marginBottom: '0px !important' }}
          >
            Margin
          </Typography>
          <Grid container>
            <Grid item lg={10}>
              <SoftInput
                value={marginValue}
                onChange={handleInputChange}
                placeholder="Enter margin"
                style={{ flex: 1 }}
              />
            </Grid>
            <Grid item lg={2}>
              <SoftSelect
                options={options}
                value={options.find((option) => option.value === unit)}
                onChange={handleSelectChange}
                style={{
                  width: '60px !important',
                  minWidth: '60px',
                }}
              />
            </Grid>
          </Grid>

          <SoftBox display="flex" justifyContent="flex-end" mt={4}>
            <SoftBox display="flex">
              <SoftButton className="vendor-second-btn" onClick={() => setOpenSettings(false)}>
                Cancel
              </SoftButton>
              <SoftBox ml={2}>
                <SoftButton color="info" className="vendor-add-btn" onClick={handleCreateMargin}>
                  {marginLoader ? (
                    <CircularProgress
                      size={18}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  ) : (
                    <>Save</>
                  )}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showMoreOffer}
        onClose={handleCloseOffers}
        PaperProps={{ style: { width: '500px', maxWidth: 'none', padding: '15px' } }}
      >
        <DialogTitle>Additional Offers</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {visibleOffers?.map((item, index) => (
              <React.Fragment key={index}>
                <Grid item lg={3} md={3} sm={3}>
                  <Typography className="products-new-details-variants-price-typo">
                    {formatDateDDMMYYYY(item?.offerDetails?.offerResponse?.createdOn)}
                  </Typography>
                </Grid>
                <Grid item lg={9} md={9} sm={9}>
                  {/* Offer conditions */}
                  {(item?.offerDetails?.offerResponse?.offerType === 'BUY_X_GET_Y' ||
                    item?.offerDetails?.offerResponse?.offerType === 'BUY X GET Y') &&
                    !item?.offerDetails?.freebie && (
                      <>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {`BUY ${item?.offerDetails?.offerResponse?.buyQuantity} GET ${
                            item?.offerDetails?.offerResponse?.offerDetailsEntityList?.[0].getQuantity || 'NA'
                          } FREE`}
                        </Typography>
                        <Typography className="products-new-details-variants-price-typo">
                          {`BUY ${item?.offerDetails?.name} (MRP - ₹${item?.offerDetails?.mrp}, SP - ₹${item?.offerDetails?.sellingPrice})`}
                        </Typography>
                        <Typography className="products-new-details-variants-price-typo">
                          {`GET ${
                            item?.offerDetails?.offerResponse?.offerSubType === 'SAME ITEM'
                              ? item?.offerDetails?.name
                              : item?.offerDetails?.offerResponse?.offerDetailsEntityList?.[0].itemName || 'NA'
                          } FREE`}
                        </Typography>
                      </>
                    )}
                  {(item?.offerDetails?.offerResponse?.offerType === 'BUY_X_GET_Y' ||
                    item?.offerDetails?.offerResponse?.offerType === 'BUY X GET Y') &&
                    item?.offerDetails?.freebie && (
                      <>
                        <Typography className="products-new-details-variants-price-typo-value">{'FREEBIE'}</Typography>
                        <Typography className="products-new-details-variants-price-typo">
                          {`BUY ${item?.offerDetails?.name} - Qty ${item?.offerDetails?.offerResponse?.buyQuantity}`}
                        </Typography>
                      </>
                    )}
                  {(item?.offerDetails?.offerResponse?.offerType === 'OFFER_ON_MRP' ||
                    item?.offerDetails?.offerResponse?.offerType === 'OFFER ON MRP') && (
                    <>
                      <Typography className="products-new-details-variants-price-typo-value">OFFER ON MRP</Typography>
                      <Typography className="products-new-details-variants-price-typo">
                        {`Mrp: ₹${item?.offerDetails?.mrp}`}
                      </Typography>
                      <Typography className="products-new-details-variants-price-typo">
                        {`Offer Price: ₹${Number(item?.offerDetails?.mrp) - Number(item?.offerDetails?.sellingPrice)}`}
                      </Typography>
                      <Typography className="products-new-details-variants-price-typo">
                        {`Selling Price: ₹${item?.offerDetails?.sellingPrice}`}
                      </Typography>
                    </>
                  )}

                  {(item?.offerDetails?.offerResponse?.offerType === 'FREE_PRODUCTS' ||
                    item?.offerDetails?.offerResponse?.offerType === 'FREE PRODUCTS') && (
                    <>
                      <Typography className="products-new-details-variants-price-typo-value">FREE PRODUCT</Typography>
                    </>
                  )}
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={viewMoreVendors}
        onClose={() => setViewMoreVendors(false)}
        PaperProps={{ style: { width: '500px', maxWidth: 'none', padding: '15px' } }}
      >
        <DialogTitle>More Vendors</DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item lg={6} sm={6} md={6}>
              <div className="products-new-details-performance-price products-location-alignCenter">
                <Typography className="products-new-details-variants-price-typo">Vendor Name</Typography>
                {vendorTOT?.map((vendor) => (
                  <Typography
                    className="products-new-details-variants-price-typo-value"
                    style={{ textAlign: 'center' }}
                  >
                    {vendor?.vendorName}
                  </Typography>
                ))}
              </div>
            </Grid>
            <Grid item lg={6} sm={6} md={6}>
              <div className="products-new-details-performance-price products-location-alignCenter">
                <Typography className="products-new-details-variants-price-typo">Vendor Margin</Typography>
                {vendorTOT?.map((vendor) => (
                  <Typography
                    className="products-new-details-variants-price-typo-value"
                    style={{ textAlign: 'center' }}
                  >
                    {`${vendor?.vendorMargin} %`}
                  </Typography>
                ))}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <SoftBox>
        {!isBundle ? (
          <Typography className="products-new-details-pack-typo">Product insights</Typography>
        ) : (
          <Typography
            className="products-new-details-performance-sales-typo"
            style={{ color: '#0562FB', marginBottom: '0px' }}
          >
            Bundle Insights
          </Typography>
        )}

        {!isMobileDevice && (
          <>
            {!isBundle && (
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={12}>
                  <SoftBox className="products-new-details-performance-sales-block-2">
                    <div className="display-flex-space-between">
                      <Typography className="products-new-details-performance-sales-typo" style={{ color: '#367df3' }}>
                        Price Settings
                      </Typography>
                      <div className="products-new-department-right-bar">
                        <button onClick={handleOpenNew}>Edit</button>
                      </div>
                    </div>
                    <>
                      <Grid container spacing={1} style={{ marginTop: '10px' }}>
                        <Grid item lg={3} sm={3} md={3}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Margin Type</Typography>
                            <Typography
                              className="products-new-details-variants-price-typo-value"
                              style={{ textAlign: 'center' }}
                              sx={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                maxWidth: '150px',
                              }}
                            >
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
                        </Grid>
                        <Grid item lg={3} sm={3} md={3}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Selling Margin</Typography>

                            <Typography
                              className="products-new-details-variants-price-typo-value"
                              style={{ textAlign: 'center' }}
                            >
                              {price?.marginValue && price?.marginType
                                ? price?.marginType === 'Rs'
                                  ? `₹ ${price?.marginValue}`
                                  : `${price?.marginValue} ${price?.marginType}`
                                : 'NA'}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item lg={3} sm={3} md={3}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Vendor Name</Typography>
                            {vendorTOT?.length > 0 ? (
                              vendorTOT?.slice(0, 3).map((vendor, index) => (
                                <Tooltip title={vendor?.vendorName}>
                                  <Typography
                                    key={index}
                                    className="products-new-details-variants-price-typo-value"
                                    style={{ textAlign: 'center' }}
                                    sx={{
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '120px',
                                    }}
                                  >
                                    {vendor?.vendorName}
                                  </Typography>
                                </Tooltip>
                              ))
                            ) : (
                              <Typography
                                className="products-new-details-variants-price-typo-value"
                                style={{ textAlign: 'center' }}
                              >
                                NA
                              </Typography>
                            )}
                          </div>
                        </Grid>

                        <Grid item lg={3} sm={3} md={3}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Vendor Margin</Typography>
                            {vendorTOT.length > 0 ? (
                              vendorTOT?.slice(0, 3)?.map((vendor, index) => (
                                <Typography
                                  key={index}
                                  className="products-new-details-variants-price-typo-value"
                                  style={{ textAlign: 'center' }}
                                >
                                  {`${vendor?.vendorMargin} %`}
                                </Typography>
                              ))
                            ) : (
                              <Typography
                                className="products-new-details-variants-price-typo-value"
                                style={{ textAlign: 'center' }}
                              >
                                NA
                              </Typography>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                      {vendorTOT?.length > 3 && (
                        <Typography onClick={handleViewVendors} className="products-new-details-insights-see-more">
                          View More
                        </Typography>
                      )}
                    </>
                  </SoftBox>
                </Grid>
                <Grid item lg={6} md={6} sm={12}>
                  <SoftBox className="products-new-details-performance-sales-block-2">
                    <Typography className="products-new-details-performance-sales-typo" style={{ color: '#367df3' }}>
                      Current Offers
                    </Typography>
                    <SoftBox className="products-new-details-product-insights-box">
                      <Grid container spacing={2}>
                        {visibleOffers?.length > 0 ? (
                          visibleOffers?.map((item, index) => (
                            <React.Fragment key={index}>
                              <Grid item lg={3} md={3} sm={3}>
                                <Typography className="products-new-details-variants-price-typo">
                                  {formatDateDDMMYYYY(item?.offerDetails?.offerResponse?.createdOn)}
                                </Typography>
                              </Grid>
                              <Grid item lg={9} md={9} sm={9}>
                                {/* Offer conditions */}
                                {(item?.offerDetails?.offerResponse?.offerType === 'BUY_X_GET_Y' ||
                                  item?.offerDetails?.offerResponse?.offerType === 'BUY X GET Y') &&
                                  !item?.offerDetails?.freebie && (
                                    <>
                                      <Typography className="products-new-details-variants-price-typo-value">
                                        {`BUY ${item?.offerDetails?.offerResponse?.buyQuantity} GET ${
                                          item?.offerDetails?.offerResponse?.offerDetailsEntityList?.[0].getQuantity ||
                                          'NA'
                                        } FREE`}
                                      </Typography>
                                      <Typography className="products-new-details-variants-price-typo">
                                        {`BUY ${item?.offerDetails?.name} (MRP - ₹${item?.offerDetails?.mrp}, SP - ₹${item?.offerDetails?.sellingPrice})`}
                                      </Typography>
                                      <Typography className="products-new-details-variants-price-typo">
                                        {`GET ${
                                          item?.offerDetails?.offerResponse?.offerSubType === 'SAME ITEM'
                                            ? item?.offerDetails?.name
                                            : item?.offerDetails?.offerResponse?.offerDetailsEntityList?.[0].itemName ||
                                              'NA'
                                        } FREE`}
                                      </Typography>
                                    </>
                                  )}
                                {(item?.offerDetails?.offerResponse?.offerType === 'BUY_X_GET_Y' ||
                                  item?.offerDetails?.offerResponse?.offerType === 'BUY X GET Y') &&
                                  item?.offerDetails?.freebie && (
                                    <>
                                      <Typography className="products-new-details-variants-price-typo-value">
                                        {'FREEBIE'}
                                      </Typography>
                                      <Typography className="products-new-details-variants-price-typo">
                                        {`BUY ${item?.offerDetails?.name} - Qty ${item?.offerDetails?.offerResponse?.buyQuantity}`}
                                      </Typography>
                                    </>
                                  )}
                                {(item?.offerDetails?.offerResponse?.offerType === 'OFFER_ON_MRP' ||
                                  item?.offerDetails?.offerResponse?.offerType === 'OFFER ON MRP') && (
                                  <>
                                    <Typography className="products-new-details-variants-price-typo-value">
                                      OFFER ON MRP
                                    </Typography>
                                    <Typography className="products-new-details-variants-price-typo">
                                      {`Mrp: ₹${item?.offerDetails?.mrp}`}
                                    </Typography>
                                    <Typography className="products-new-details-variants-price-typo">
                                      {`Offer Price: ₹${
                                        Number(item?.offerDetails?.mrp) - Number(item?.offerDetails?.sellingPrice)
                                      }`}
                                    </Typography>
                                    <Typography className="products-new-details-variants-price-typo">
                                      {`Selling Price: ₹${item?.offerDetails?.sellingPrice}`}
                                    </Typography>
                                  </>
                                )}

                                {(item?.offerDetails?.offerResponse?.offerType === 'FREE_PRODUCTS' ||
                                  item?.offerDetails?.offerResponse?.offerType === 'FREE PRODUCTS') && (
                                  <>
                                    <Typography className="products-new-details-variants-price-typo-value">
                                      FREE PRODUCT
                                    </Typography>
                                  </>
                                )}
                              </Grid>
                            </React.Fragment>
                          ))
                        ) : (
                          <Typography
                            className="products-new-details-performance-sales-typo"
                            style={{ marginLeft: '16px' }}
                          >
                            No offers available
                          </Typography>
                        )}
                      </Grid>

                      {remainingOffers?.length > 2 && (
                        <Typography onClick={handleShowMoreOffers} className="products-new-details-insights-see-more-2">
                          View More
                        </Typography>
                      )}
                    </SoftBox>
                  </SoftBox>
                </Grid>
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12}>
                <SoftBox className="products-new-details-performance-sales-block-2">
                  <Typography className="products-new-details-performance-sales-typo" style={{ color: '#367df3' }}>
                    Available Locations
                  </Typography>
                  {locationDetails?.length === 0 ? (
                    <Typography className="products-new-details-performance-sales-typo" style={{ textAlign: 'center' }}>
                      No Locations available
                    </Typography>
                  ) : (
                    <>
                      <Grid container spacing={1} style={{ marginTop: '10px' }}>
                        <Grid item lg={2} sm={2} md={2}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Location</Typography>
                            {locationDetails?.slice(0, 3).map((item, index) => (
                              <Tooltip title={locationNames[index] ? locationNames[index] : 'NA'}>
                                <Typography
                                  key={index}
                                  className="products-new-details-variants-price-typo-value"
                                  style={{ textAlign: 'center' }}
                                  sx={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '95px',
                                  }}
                                >
                                  {locationNames[index] ? locationNames[index] : 'NA'}
                                </Typography>
                              </Tooltip>
                            ))}
                          </div>
                        </Grid>
                        <Grid item lg={2} sm={2} md={2}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Mrp</Typography>
                            {locationDetails?.slice(0, 3).map((item, index) => (
                              <Typography
                                key={index}
                                className="products-new-details-variants-price-typo-value"
                                style={{ textAlign: 'center' }}
                              >
                                {item?.mrp ? `₹${item?.mrp}` : 'NA'}
                              </Typography>
                            ))}
                          </div>
                        </Grid>
                        <Grid item lg={2} sm={2} md={2}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Sale Price</Typography>
                            {locationDetails?.slice(0, 3).map((item, index) => (
                              <Typography
                                key={index}
                                className="products-new-details-variants-price-typo-value"
                                style={{ textAlign: 'center' }}
                              >
                                {item?.sellingPrice ? `₹${item?.sellingPrice}` : 'NA'}
                              </Typography>
                            ))}
                          </div>
                        </Grid>
                        <Grid item lg={3} sm={3} md={3}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">
                              Available Stock
                            </Typography>
                            {locationDetails?.slice(0, 3).map((item, index) => (
                              <Typography
                                key={index}
                                className="products-new-details-variants-price-typo-value"
                                style={{ textAlign: 'center' }}
                              >
                                {item?.availableUnits ? item?.availableUnits.toFixed(2) : 'NA'}
                              </Typography>
                            ))}
                          </div>
                        </Grid>
                        <Grid item lg={3} sm={3} md={3}>
                          <div className="products-new-details-performance-price products-location-alignCenter">
                            <Typography className="products-new-details-variants-price-typo">Stock Turnover</Typography>
                            {locationDetails?.slice(0, 3).map((item, index) => (
                              <Typography
                                key={index}
                                className="products-new-details-variants-price-typo-value"
                                style={{ textAlign: 'center' }}
                              >
                                {item?.stockTurnOver ? item?.stockTurnOver : 'NA'}
                              </Typography>
                            ))}
                          </div>
                        </Grid>
                      </Grid>
                      {locationDetails?.length > 3 && (
                        <Typography onClick={handleViewMore} className="products-new-details-insights-see-more">
                          View More
                        </Typography>
                      )}
                    </>
                  )}
                </SoftBox>
              </Grid>
              <Grid item lg={6} md={6} sm={12}>
                <SoftBox className="products-new-details-performance-sales-block-2">
                  <Typography className="products-new-details-performance-sales-typo" style={{ color: '#367df3' }}>
                    Quick Actions
                  </Typography>
                  <SoftBox className="products-new-details-product-insights-box">
                    <Grid container spacing={2}>
                      <Grid item lg={4} md={4} sm={4}>
                        <div
                          className="products-new-details-insights-price"
                          onClick={() => navigate('/marketting/offers-promotions')}
                        >
                          <img
                            src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20percent.png"
                            style={{ width: '35px', height: '35px' }}
                          />
                          <Typography className="products-new-details-insights-typo">Offers</Typography>
                        </div>
                        <div
                          className="products-new-details-insights-price"
                          style={{ marginTop: '20px' }}
                          onClick={() => navigate('/inventory/stock-adjustment')}
                        >
                          <img
                            src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20crop.png"
                            style={{ width: '35px', height: '35px' }}
                          />
                          <Typography className="products-new-details-insights-typo">Inventory adjustment</Typography>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={4} sm={4}>
                        <div
                          className="products-new-details-insights-price"
                          onClick={() => navigate('/purchase/purchase-returns')}
                        >
                          <img
                            src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20assignment%20return%20(1).png"
                            style={{ width: '35px', height: '35px' }}
                          />
                          <Typography className="products-new-details-insights-typo">Purchase return</Typography>
                        </div>
                        <div
                          className="products-new-details-insights-price"
                          style={{ marginTop: '20px' }}
                          onClick={() => navigate('/marketing/Coupons')}
                        >
                          <img
                            src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20local%20offer.png"
                            style={{ width: '35px', height: '35px' }}
                          />
                          <Typography className="products-new-details-insights-typo">Coupon</Typography>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={4} sm={4}>
                        <div
                          className="products-new-details-insights-price"
                          onClick={() => navigate('/inventory/transfers')}
                        >
                          <img
                            src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20move%20up.png"
                            style={{ width: '35px', height: '35px' }}
                          />
                          <Typography className="products-new-details-insights-typo">Stock transfer</Typography>
                        </div>
                        <div
                          className="products-new-details-insights-price"
                          style={{ marginTop: '20px' }}
                          onClick={handleOpenComingSoon}
                        >
                          <img
                            src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20auto%20awesome%20(1).png"
                            style={{ width: '35px', height: '35px' }}
                          />
                          <Typography className="products-new-details-insights-typo">Pallet IQ</Typography>
                        </div>
                      </Grid>
                      <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
                    </Grid>
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
          </>
        )}

        {isMobileDevice && (
          <SoftBox>
            <Typography
              className="products-new-details-performance-sales-typo"
              style={{ color: '#367df3', marginBottom: '0px !important' }}
            >
              Current offers
            </Typography>
            {visibleOffers?.length === 0 ? (
              <Typography className="products-new-details-performance-sales-typo" style={{ textAlign: 'center' }}>
                No offers available
              </Typography>
            ) : (
              <SplideCommon>
                {visibleOffers?.map((item, index) => (
                  <SplideSlide>
                    <Card className="productKpiCard">
                      <div style={{ display: 'flex' }}>
                        <Typography className="products-new-details-variants-price-typo">Created On : </Typography>
                        <Typography
                          key={index}
                          className="products-new-details-variants-price-typo-value"
                          sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            maxWidth: '150px',
                          }}
                        >
                          {formatDateDDMMYYYY(item?.offerDetails?.offerResponse?.createdOn)}
                        </Typography>
                      </div>
                      {(item?.offerDetails?.offerResponse?.offerType === 'BUY_X_GET_Y' ||
                        item?.offerDetails?.offerResponse?.offerType === 'BUY X GET Y') &&
                        !item?.offerDetails?.freebie && (
                          <>
                            <Typography className="products-new-details-variants-price-typo-value">
                              {`BUY ${item?.offerDetails?.offerResponse?.buyQuantity} GET ${
                                item?.offerDetails?.offerResponse?.offerDetailsEntityList?.[0].getQuantity || 'NA'
                              } FREE`}
                            </Typography>
                            <Typography className="products-new-details-variants-price-typo">
                              {`BUY ${item?.offerDetails?.name} (MRP - ₹${item?.offerDetails?.mrp}, SP - ₹${item?.offerDetails?.sellingPrice})`}
                            </Typography>
                            <Typography className="products-new-details-variants-price-typo">
                              {`GET ${
                                item?.offerDetails?.offerResponse?.offerSubType === 'SAME ITEM'
                                  ? item?.offerDetails?.name
                                  : item?.offerDetails?.offerResponse?.offerDetailsEntityList?.[0].itemName || 'NA'
                              } FREE`}
                            </Typography>
                          </>
                        )}
                      {(item?.offerDetails?.offerResponse?.offerType === 'BUY_X_GET_Y' ||
                        item?.offerDetails?.offerResponse?.offerType === 'BUY X GET Y') &&
                        item?.offerDetails?.freebie && (
                          <>
                            <Typography className="products-new-details-variants-price-typo-value">
                              {'FREEBIE'}
                            </Typography>
                            <Typography className="products-new-details-variants-price-typo">
                              {`BUY ${item?.offerDetails?.name} - Qty ${item?.offerDetails?.offerResponse?.buyQuantity}`}
                            </Typography>
                          </>
                        )}
                      {(item?.offerDetails?.offerResponse?.offerType === 'OFFER_ON_MRP' ||
                        item?.offerDetails?.offerResponse?.offerType === 'OFFER ON MRP') && (
                        <>
                          <Typography className="products-new-details-variants-price-typo-value">
                            OFFER ON MRP
                          </Typography>
                          <Typography className="products-new-details-variants-price-typo">
                            {`Mrp: ₹${item?.offerDetails?.mrp}`}
                          </Typography>
                          <Typography className="products-new-details-variants-price-typo">
                            {`Offer Price: ₹${
                              Number(item?.offerDetails?.mrp) - Number(item?.offerDetails?.sellingPrice)
                            }`}
                          </Typography>
                          <Typography className="products-new-details-variants-price-typo">
                            {`Selling Price: ₹${item?.offerDetails?.sellingPrice}`}
                          </Typography>
                        </>
                      )}

                      {(item?.offerDetails?.offerResponse?.offerType === 'FREE_PRODUCTS' ||
                        item?.offerDetails?.offerResponse?.offerType === 'FREE PRODUCTS') && (
                        <>
                          <Typography className="products-new-details-variants-price-typo-value">
                            FREE PRODUCT
                          </Typography>
                        </>
                      )}
                    </Card>
                  </SplideSlide>
                ))}
              </SplideCommon>
            )}
            <Typography
              className="products-new-details-performance-sales-typo"
              style={{ color: '#367df3', marginBottom: '0px !important', marginTop: '10px' }}
            >
              Available Locations
            </Typography>
            {locationDetails?.length === 0 ? (
              <Typography className="products-new-details-performance-sales-typo" style={{ textAlign: 'center' }}>
                No Locations available
              </Typography>
            ) : (
              <SplideCommon>
                {locationDetails?.map((item, index) => (
                  <SplideSlide>
                    <Card className="productKpiCard">
                      <div style={{ display: 'flex' }}>
                        <Typography className="products-new-details-variants-price-typo">Location : </Typography>
                        <Typography
                          key={index}
                          className="products-new-details-variants-price-typo-value"
                          sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            maxWidth: '150px',
                          }}
                        >
                          {locationNames[index] ? locationNames[index] : 'NA'}
                        </Typography>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <div className="products-new-details-performance-price">
                          <Typography className="products-new-details-variants-price-typo">MRP</Typography>
                          <Typography key={index} className="products-new-details-variants-price-typo-value">
                            {item?.mrp ? `₹${item?.mrp}` : 'NA'}
                          </Typography>
                        </div>
                        <div className="products-new-details-performance-price-mob">
                          <Typography className="products-new-details-variants-price-typo">Sale Price</Typography>
                          <Typography key={index} className="products-new-details-variants-price-typo-value">
                            {item?.sellingPrice ? `₹${item?.sellingPrice}` : 'NA'}
                          </Typography>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <div className="products-new-details-performance-price">
                          <Typography className="products-new-details-variants-price-typo">Available Stock</Typography>
                          <Typography key={index} className="products-new-details-variants-price-typo-value">
                            {item?.availableUnits ? item?.availableUnits.toFixed(2) : 'NA'}
                          </Typography>
                        </div>
                        <div className="products-new-details-performance-price-mob">
                          <Typography className="products-new-details-variants-price-typo">Stock Turnover</Typography>
                          <Typography key={index} className="products-new-details-variants-price-typo-value">
                            {item?.stockTurnOver ? item?.stockTurnOver : 'NA'}
                          </Typography>
                        </div>
                      </div>
                    </Card>
                  </SplideSlide>
                ))}
              </SplideCommon>
            )}
          </SoftBox>
        )}
      </SoftBox>
    </div>
  );
};

export default ProductInsights;
