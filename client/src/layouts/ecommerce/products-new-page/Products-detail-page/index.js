import React, { useEffect, useState } from 'react';
import './product-details.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import { Card, Chip, Dialog, Grid, Menu, MenuItem, Slide, Tooltip, Typography } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import WrongLocationOutlinedIcon from '@mui/icons-material/WrongLocationOutlined';
import ProductImages from '../../product/all-products/components/product-details/components/ProductImages';
import ProductsDetailsInfo from './components/ProductDetailsInfo';
import ProductPerformance from './components/ProductPerformance';
import ProductInformation from './components/ProductInformation';
import ProductInsights from './components/ProductInsights';
import PriceRevisions from './components/PriceRevisions';
import ProductBatchDetails from './components/BatchDetails';
import SalesAndPurchaseTrends from './components/SalesAndPurchaseTrends';
import {
  activateCMSProduct,
  deleteCMSProduct,
  editCmsProduct,
  generateBarcodeWithNum,
  getBatchIdOfferDetails,
  getInventoryDetails,
  getProductDetails,
  getProductDetailsFromLogs,
  getProductDetailsNew,
  getProductIdByBarcode,
  getProductLogs,
} from '../../../../config/Services';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Spinner from '../../../../components/Spinner';
import OfferPopup from '../../product/all-products/components/product-details/components/OfferPopup';
import moment from 'moment';
import { expireDateChecker, isSmallScreen } from '../../Common/CommonFunction';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MergeProductDialog from './MergeProductDailog';
import UnmergeProductDialog from './UnMergerProductDailog';
import Status from '../../Common/Status';
import Swal from 'sweetalert2';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const location1 = useLocation();
  const showSnackBar = useSnackbar();
  const [productDetails, setProductDetails] = useState({});
  const [isBundle, setIsBundle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  const [notAvailable, setNotAvailable] = useState(false);
  const [pricingDetail, setPricingDetail] = useState([]);

  const [expiredChipCount, setExpiredChipCount] = useState('noExpiry');
  const [expiredCount, setExpiredCount] = useState({});
  const [selectedVariant, setSelectedVariant] = useState();
  const [selectedVariantBarcode, setSelectedVariantBarcode] = useState('');

  const [openMergeMenu, setOpenMergeMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [reloadBatchDetails, setReloadBatchDetails] = useState(false);

  const [avgStockTurnover, setAvgStockTurnover] = useState('NA');
  const [expectedStockOut, setExpectedStockOut] = useState('NA');

  const [openProductLogs, setOpenProductLogs] = useState(false);

  const { id } = useParams();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const logId = params.get('logId');
    return { logId };
  };

  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');

  const editProductForm = () => {
    if (isBundle) {
      navigate(`/products/edit-bundle/${id}`);
    } else {
      navigate('/products/edit-product/' + id);
    }
  };

  let pricingArr = [];

  const handleGtinChange = (newGtin) => {
    setSelectedVariantBarcode(newGtin);
    setPricingDetail([]);
    setPriceInfo([]);
  };

  let gtin = selectedVariantBarcode || '';

  async function getProduct() {
    setLoader(true);
    let locIdData;
    if (location.pathname === `/products/product/details/${id}`) {
      locIdData = locId;
    }

    await getProductDetailsNew(id, locIdData).then(function (responseTxt) {
      if (!responseTxt?.data) {
        navigate('/products/all-products');
        return;
      }
      setLoader(false);
      setProductDetails(responseTxt?.data?.data?.data);
      setIsBundle(responseTxt?.data?.data?.data?.isBundle);
      sessionStorage.setItem('tableData', JSON.stringify(responseTxt?.data?.data));
    });
  }

  async function getProductLogsfunc() {
    const payload = {};
    setLoader(true);
    await getProductDetailsFromLogs(logId, payload).then(function (responseTxt) {
      if (!responseTxt?.data) {
        navigate('/products/all-products');
        return;
      }
      setLoader(false);
      setProductDetails(responseTxt?.data?.data?.data?.product);
      setIsBundle(responseTxt?.data?.data?.data?.isBundle);
    });
  }

  const { logId } = getQueryParams();

  useEffect(() => {
    if (logId) {
      getProductLogsfunc();
    } else {
      getProduct();
    }
  }, [logId]);

  function formatExpiryDate(expiryDate) {
    if (expiryDate) {
      return moment(expiryDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
    return '';
  }

  useEffect(() => {
    if (!gtin) return;
    getInventoryDetails(locId, gtin)
      .then(async (res) => {
        if (res?.data?.data?.es === 1) {
          setNotAvailable(true);
          showSnackBar('There is no stock available for this product.', 'error');
          setLoader(false);
        } else {
          setPriceInfo(res?.data?.data?.data);
          setLoader(false);
          pricingArr = res?.data?.data?.data?.multipleBatchCreations;
          if (pricingArr.length === 0) {
            setNotAvailable(true);
            showSnackBar('There is no stock available for this product.', 'error');
          }
          pricingArr.sort((a, b) => {
            const idA = parseInt(a.inventoryId.substr(2), 10);
            const idB = parseInt(b.inventoryId.substr(2), 10);

            return idB - idA;
          });
          const offerExist = res?.data?.data?.data?.multipleBatchCreations?.find((data) => data.offerId !== null);
          const newPricingarr = await batchOfferNameFunc(pricingArr);
          setPricingDetail(
            newPricingarr?.map((row, index) => {
              const marginBasedOn = res?.data?.data?.data?.marginBasedOn;
              const marginType = res?.data?.data?.data?.marginType;
              const marginValue =
                marginBasedOn === 'pp' ? row?.sellingPrice - row?.purchasePrice : row?.mrp - row?.sellingPrice;

              const marginDisplay =
                marginType === '%'
                  ? `${Math.round((marginValue / (marginBasedOn === 'pp' ? row?.purchasePrice : row?.mrp)) * 100)}%`
                  : `${Math.round(marginValue)}`;
              const newMargin =
                marginDisplay !== 'NaN%' && marginDisplay !== Infinity && marginDisplay !== 'Infinity%'
                  ? marginDisplay
                  : 'NA';
              return {
                id: index,
                quantity: row.quantity >= 0 ? row.quantity : '-----',
                expiryDate: row?.expiryDate ? moment(row?.expiryDate).format('Do MMM, YYYY') : '-----',
                expiryDateApi: formatExpiryDate(row?.expiryDate),
                purchasePrice: row?.purchasePrice >= 0 ? row?.purchasePrice : '-----',
                sellingPrice: row?.sellingPrice >= 0 ? `${row?.sellingPrice}` : '-----',
                batchId: row?.batchId ? row?.batchId : '-----',
                availableUnits: row?.availableUnits >= 0 ? row?.availableUnits : '-----',
                mrp: row?.mrp >= 0 ? row?.mrp : '-----',
                upArrow: marginBasedOn === 'pp' && row?.sellingPrice > row?.purchasePrice ? 'true' : 'false',
                downArrow: marginBasedOn !== 'pp' && row?.sellingPrice < row?.mrp ? 'true' : 'false',
                offerId: row.offerId,
                haveOffer: row.haveOffer,
                freebie: row.freebie,
                offerName: row.offerName,
                offerDetails: row.offerDetails,
                requestNumber: row?.requestNumber,
                requestNumberType: row?.requestNumberType,
                expired: expireDateChecker(row?.expiryDate),
                createdOn: res?.data?.data?.data?.createdOn,
                inwardedOn: row?.createdOn ? moment?.utc(row?.createdOn).format('Do MMM, YYYY') : '-----',
                modifiedOn: row?.modifiedOn,
                inventoryId: row?.inventoryId,
                purchaseMargin: `${(((row?.mrp - row?.purchasePrice) / row?.mrp) * 100)?.toFixed(1)}%`,
                negativeConsumption: row?.overSoldQuantity,
              };
            }),
          );
        }
      })
      .catch((err) => {
        showSnackBar('There is no stock available for this product.', 'error');
        setLoader(false);
      });
  }, [gtin, reloadBatchDetails]);

  const batchOfferNameFunc = async (batchArr) => {
    const transformedBatchArr = await Promise.all(
      batchArr?.map(async (batch) => {
        if (batch.offerId !== null) {
          let offerName;
          let offerDetails;

          // Fetch the batch offer and product details
          const response = await getBatchIdOfferDetails(batch.offerId);
          const productResponse = await getProductIdByBarcode(
            response?.data?.data?.data?.mainGtin,
            locId.toLowerCase(),
          );

          // Extract necessary fields
          const type = response?.data?.data?.data?.offerType;
          const res = response?.data?.data?.data;
          const buyName = productResponse?.data?.data?.data?.name;

          if (type === 'BUY_X_GET_Y' || type === 'OFFER_ON_MRP' || type === 'BUY X GET Y' || type === 'OFFER ON MRP') {
            offerName = (
              <OfferPopup
                mrp={batch?.mrp}
                sellingPrice={batch?.sellingPrice}
                name={buyName}
                type={type}
                offerResponse={res}
                freebie={batch?.freebie}
              />
            );
            offerDetails = {
              mrp: batch?.mrp,
              sellingPrice: batch?.sellingPrice,
              name: buyName,
              type,
              offerResponse: res,
              freebie: batch?.freebie,
            };
          } else if (type === 'FREE_PRODUCTS' || type === 'FREE PRODUCTS') {
            const freeProductName = res?.offerDetailsEntityList?.[0]?.itemName || 'Unknown Product';
            offerName = `Free Product - ${freeProductName}`;
            offerDetails = {
              description: `Free Product - ${freeProductName}`,
            };
          } else {
            offerDetails = { description: 'No Offer' }; // Default if no offer type matches
          }

          return {
            ...batch,
            offerName,
            offerDetails,
          };
        } else {
          return batch;
        }
      }),
    );
    return transformedBatchArr;
  };

  const getChipColor = (rowData) => {
    const expiredCount = rowData?.filter((item) => item?.expired)?.length;
    const data = rowData.map((item) => item?.expired);
    const count = { totalCount: rowData?.length, expiredCount: expiredCount };
    if (expiredCount !== rowData?.length || rowData?.length !== 1) {
      setExpiredCount(count);
    }
    const halfLength = rowData?.length / 2;
    if (expiredCount === 0) {
      return 'noExpiry';
    }

    if (expiredCount === rowData?.length) {
      return 'error';
    } else if (expiredCount !== rowData?.length) {
      return 'warning';
    }
  };

  useEffect(() => {
    if (pricingDetail?.length > 0) {
      const data = getChipColor(pricingDetail);
      setExpiredChipCount(data);
    } else {
      setExpiredChipCount('noExpiry');
    }
  }, [pricingDetail]);

  const isMobileDevice = isSmallScreen();

  const columns = [
    {
      field: 'id',
      headerName: 'Log Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'loggedBy',
      headerName: 'Logged By',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages([]);

    if (productDetails?.isBundle) {
      setImages(productDetails.imageUrls || []);
    } else if (selectedVariant?.images) {
      setImages(selectedVariant.images);
    }
  }, [selectedVariant, productDetails]);

  const [rowData, setRowData] = useState([]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getAllProductLogsFilter = () => {
    const payload = {
      page: 1,
      pageSize: 100,
      productId: [id],
      sortByCreatedDate: 'ASCENDING',
      sortByLogDate: 'ASCENDING',
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getProductLogs(payload).then((res) => {
      const data = res?.data?.data?.results;
      const updatedData = data.map((item) => {
        const createdOn = new Date(item?.created);
        const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;
        return {
          id: item?.logId,
          action: item?.action,
          date: formattedDate,
          loggedBy: item?.loggedByName || item?.product?.createdByName || item?.product?.updatedByName,
        };
      });
      setRowData(updatedData);
    });
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMergeMenu(true);
  };

  const handleClose = () => {
    setOpenMergeMenu(false);
    setOpenDialog(false);
    setAnchorEl(null);
    getProduct();
  };

  const handleOpenMerge = (type) => {
    setOpenMergeMenu(false);
    setAnchorEl(null);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDeleteProduct = () => {
    const payload = {
      id: productDetails?.id,
      storeId: orgId,
      storeLocationId: locId.toLowerCase(),
      deletedBy: uidx,
      deletedByName: userName,
      // barcode: productDetails?.variants?.map((variant) => variant?.barcodes[0]).join(', ') || '',
    };
    const newSwal = Swal.mixin({
      buttonsStyling: false, // Disable default styling if using custom classes
    });

    // Fire the Swal popup
    newSwal
      .fire({
        title: `Are you sure you want to delete this product?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        reverseButtons: true,
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn',
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteCMSProduct(payload)
            .then((res) => {
              if (res?.data?.data?.es === 1) {
                showSnackBar(res?.data?.data?.message, 'error');
              } else {
                showSnackBar('The product has been deleted successfully', 'success');
                navigate('/products/all-products');
              }
            })
            .catch((err) => {
              showSnackBar('Error while deleting the product', 'error');
            });
        }
      });
  };

  const handleActivation = (type) => {
    const payload = {
      id: id,
      locationId: locId,
      updatedBy: uidx,
      updatedByName: userName,
      activate: type === 'ACTIVE' ? true : false,
    };
    const newSwal = Swal.mixin({
      buttonsStyling: false, // Disable default styling if using custom classes
    });

    // Fire the Swal popup
    newSwal
      .fire({
        title: `Are you sure you want to ${type.toLowerCase()} this product?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        reverseButtons: true,
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn',
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          activateCMSProduct(payload)
            .then((res) => {
              if (res?.data?.data?.es === 1) {
                showSnackBar(res?.data?.data?.message, 'error');
                handleClose();
              } else {
                if (type === 'ACTIVE') {
                  showSnackBar('The product has been activated', 'success');
                  handleClose();
                } else {
                  showSnackBar('The product has been deactivated', 'success');
                  handleClose();
                }
              }
            })
            .catch((error) => {
              handleClose();
              showSnackBar(`Error while ${type.toLowerCase()} product`, 'error');
            });
        }
      });
  };

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMergeMenu}
        onClose={() => setOpenMergeMenu(false)}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={() => handleOpenMerge('merge')}>Merge</MenuItem>
        <MenuItem onClick={() => handleOpenMerge('unmerge')}>Unmerge</MenuItem>
        <MenuItem onClick={() => handleActivation('ACTIVE')}>Activate</MenuItem>
        <MenuItem onClick={() => handleActivation('DEACTIVE')}>Deactivate</MenuItem>
        {/* <MenuItem onClick={handleDeleteProduct}>Delete</MenuItem> */}
      </Menu>

      {dialogType === 'merge' ? (
        <MergeProductDialog open={openDialog} handleClose={handleClose} productId={id} />
      ) : (
        <UnmergeProductDialog
          open={openDialog}
          handleClose={handleClose}
          variantDetails={productDetails?.variants || []}
          productName={productDetails?.name || ''}
          productId={productDetails?.id || ''}
        />
      )}

      <DashboardLayout>
        {!isMobileDevice && (
          <>
            <DashboardNavbar prevLink={true} />

            <SoftBox className="products-new-wrapper">
              <div className="products-new-details-top-nav-bar">
                <Typography className="products-new-details-category-typo">
                  {productDetails?.appCategories?.categoryLevel1}
                  {productDetails?.appCategories?.categoryLevel2.length !== 0 && (
                    <KeyboardArrowRightIcon className="left-icon-fruits" />
                  )}
                  {productDetails?.appCategories?.categoryLevel2}
                  {productDetails?.appCategories?.categoryLevel3.length !== 0 && <KeyboardArrowRightIcon />}
                  {productDetails?.appCategories?.categoryLevel3}
                </Typography>

                <div className="products-new-details-top-right-bar">
                  <div className="products-new-department-right-bar">
                    <button
                      onClick={() => {
                        setOpenProductLogs(true), getAllProductLogsFilter();
                      }}
                    >
                      Product Logs
                    </button>
                  </div>
                  <Status label={productDetails?.isActive ? 'ACTIVE' : 'INACTIVE'} />

                  {loader || notAvailable ? (
                    <Tooltip title={'Unavailable for Selling'}>
                      <WrongLocationOutlinedIcon
                        fontSize="medium"
                        sx={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
                        color="error"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title={'Available for Selling'}>
                      <WhereToVoteOutlinedIcon
                        fontSize="medium"
                        sx={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
                        color="success"
                      />
                    </Tooltip>
                  )}

                  {expiredChipCount !== 'noExpiry' && (
                    <SoftBox style={{ margin: '5px' }}>
                      <Chip
                        color={expiredChipCount}
                        label={`Expired ${
                          expiredCount &&
                          expiredCount?.totalCount > 0 &&
                          expiredCount?.expiredCount !== expiredCount?.totalCount
                            ? `${expiredCount?.expiredCount || ''}/${expiredCount?.totalCount}`
                            : ''
                        }`}
                      />
                    </SoftBox>
                  )}
                  <ModeEditIcon
                    sx={{
                      display:
                        permissions?.RETAIL_Products?.WRITE ||
                        permissions?.WMS_Products?.WRITE ||
                        permissions?.VMS_Products?.WRITE
                          ? 'block'
                          : 'none',
                      float: 'right',
                      cursor: 'pointer',
                    }}
                    onClick={() => editProductForm()}
                  ></ModeEditIcon>
                  <MoreVertIcon
                    sx={{
                      display:
                        permissions?.RETAIL_Products?.WRITE ||
                        permissions?.WMS_Products?.WRITE ||
                        permissions?.VMS_Products?.WRITE
                          ? 'block'
                          : 'none',
                      float: 'right',
                      cursor: 'pointer',
                    }}
                    onClick={handleClick}
                  ></MoreVertIcon>
                </div>
              </div>

              <SoftBox style={{ marginTop: '10px' }}>
                <Grid container spacing={2}>
                  <Grid item lg={3} md={3} xs={12} sm={12}>
                    {loader ? <Spinner /> : <ProductImages Imgs={images} />}
                  </Grid>
                  <Grid item lg={9} md={7} sm={12} xs={12}>
                    <ProductsDetailsInfo
                      productDetails={productDetails}
                      setSelectedVariantBarcode={setSelectedVariantBarcode}
                      selectedVariantBarcode={selectedVariantBarcode}
                      handleGtinChange={handleGtinChange}
                      selectedVariant={selectedVariant}
                      setSelectedVariant={setSelectedVariant}
                      pricingDetail={pricingDetail}
                      reloadBatchDetails={reloadBatchDetails}
                    />
                  </Grid>
                </Grid>
              </SoftBox>

              {loader && <Spinner />}
              {!loader && gtin !== '' && (
                <>
                  <SoftBox style={{ marginTop: '50px' }}>
                    <ProductPerformance
                      price={priceInfo}
                      gtin={gtin}
                      pricingDetail={pricingDetail}
                      loader={loader}
                      selectedVariantBarcode={selectedVariantBarcode}
                      selectedVariant={selectedVariant}
                      avgStockTurnover={avgStockTurnover}
                      expectedStockOut={expectedStockOut}
                    />
                  </SoftBox>
                  <SoftBox style={{ marginTop: '50px' }}>
                    <ProductBatchDetails
                      pricingDetail={pricingDetail}
                      gtin={gtin}
                      selectedVariant={selectedVariant}
                      selectedVariantBarcode={selectedVariantBarcode}
                      inventoryData={priceInfo}
                      productDetails={productDetails}
                      setReloadBatchDetails={setReloadBatchDetails}
                      reloadBatchDetails={reloadBatchDetails}
                      setAvgStockTurnover={setAvgStockTurnover}
                      setExpectedStockOut={setExpectedStockOut}
                    />
                  </SoftBox>

                  <SoftBox style={{ marginTop: '50px' }}>
                    <SalesAndPurchaseTrends gtin={gtin} selectedVariantBarcode={selectedVariantBarcode} />
                  </SoftBox>

                  <SoftBox style={{ marginTop: '50px' }}>
                    <ProductInsights
                      gtin={gtin}
                      isBundle={isBundle}
                      reloadBatchDetails={reloadBatchDetails}
                      pricingDetail={pricingDetail}
                      price={priceInfo}
                      productDetails={productDetails}
                      selectedVariant={selectedVariant}
                      setReloadBatchDetails={setReloadBatchDetails}
                    />
                  </SoftBox>

                  <SoftBox style={{ marginTop: '50px' }}>
                    <PriceRevisions
                      gtin={gtin}
                      selectedVariantBarcode={selectedVariantBarcode}
                      setReloadBatchDetails={setReloadBatchDetails}
                      reloadBatchDetails={reloadBatchDetails}
                    />
                  </SoftBox>
                </>
              )}
              <SoftBox style={{ marginTop: '50px' }}>
                <ProductInformation productDetails={productDetails} selectedVariant={selectedVariant} />
              </SoftBox>
            </SoftBox>
          </>
        )}

        {isMobileDevice && (
          <>
            {/* <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
              <MobileNavbar title={'Product Details'} prevLink={true} isNavigateNull={true} />
            </SoftBox> */}
            <SoftBox>
              <Card sx={{ maxWidth: '100vw' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
                <SoftBox p={3}>
                  <div className="products-new-details-top-right-bar" style={{ justifyContent: 'flex-end' }}>
                    {/* <div className="products-new-department-right-bar">
                      <button>Logs</button>
                    </div> */}
                    <Status label={productDetails?.isActive ? 'ACTIVE' : 'INACTIVE'} />
                    {loader || notAvailable ? (
                      <Tooltip title={'Unavailable for Selling'}>
                        <WrongLocationOutlinedIcon
                          fontSize="medium"
                          sx={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
                          color="error"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title={'Available for Selling'}>
                        <WhereToVoteOutlinedIcon
                          fontSize="medium"
                          sx={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
                          color="success"
                        />
                      </Tooltip>
                    )}
                    {/* {loader || productDetails?.storeSpecificData?.storeLocationId === 'PALLET_PRODUCT' ? null : (
                      <Tooltip title={'Global Product'}>
                        <StarRateOutlinedIcon
                          fontSize="medium"
                          sx={{ float: 'right', color: '#ffd700', marginRight: '5px', cursor: 'pointer' }}
                        />
                      </Tooltip>
                    )} */}
                    {expiredChipCount !== 'noExpiry' && (
                      <SoftBox style={{ margin: '5px' }}>
                        <Chip
                          color={expiredChipCount}
                          label={`Expired ${
                            expiredCount &&
                            expiredCount?.totalCount > 0 &&
                            expiredCount.expiredCount !== expiredCount.totalCount
                              ? `${expiredCount.expiredCount || ''}/${expiredCount.totalCount}`
                              : ''
                          }`}
                        />
                      </SoftBox>
                    )}
                    {/* <ModeEditIcon
                      sx={{
                        display:
                          permissions?.RETAIL_Products?.WRITE ||
                          permissions?.WMS_Products?.WRITE ||
                          permissions?.VMS_Products?.WRITE
                            ? 'block'
                            : 'none',
                        float: 'right',
                        cursor: 'pointer',
                      }}
                      onClick={() => editProductForm()}
                    ></ModeEditIcon> */}
                  </div>
                  {loader ? (
                    <Spinner />
                  ) : (
                    <div style={{ marginTop: '10px' }}>
                      <ProductImages
                        Imgs={productDetails?.isBundle ? productDetails?.imageUrls : selectedVariant?.images}
                      />
                    </div>
                  )}
                  <div style={{ marginTop: '12px' }}>
                    <Typography
                      className="products-new-details-category-typo"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {productDetails?.appCategories?.categoryLevel1}
                      {productDetails?.appCategories?.categoryLevel2.length !== 0 && (
                        <KeyboardArrowRightIcon className="left-icon-fruits" />
                      )}
                      {productDetails?.appCategories?.categoryLevel2}
                      {productDetails?.appCategories?.categoryLevel3.length !== 0 && <KeyboardArrowRightIcon />}
                      {productDetails?.appCategories?.categoryLevel3}
                    </Typography>
                  </div>

                  <ProductsDetailsInfo
                    productDetails={productDetails}
                    setSelectedVariantBarcode={setSelectedVariantBarcode}
                    selectedVariantBarcode={selectedVariantBarcode}
                    handleGtinChange={handleGtinChange}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                    reloadBatchDetails={reloadBatchDetails}
                  />

                  {loader && <Spinner />}
                  {!loader && gtin !== '' && (
                    <>
                      <SoftBox style={{ marginTop: '12px' }}>
                        <ProductPerformance
                          price={priceInfo}
                          gtin={gtin}
                          pricingDetail={pricingDetail}
                          loader={loader}
                          selectedVariantBarcode={selectedVariantBarcode}
                          avgStockTurnover={avgStockTurnover}
                          expectedStockOut={expectedStockOut}
                        />
                      </SoftBox>

                      <SoftBox style={{ marginTop: '12px' }}>
                        <ProductBatchDetails
                          pricingDetail={pricingDetail}
                          gtin={gtin}
                          selectedVariantBarcode={selectedVariantBarcode}
                          inventoryData={priceInfo}
                          productDetails={productDetails}
                          setReloadBatchDetails={setReloadBatchDetails}
                          reloadBatchDetails={reloadBatchDetails}
                          setAvgStockTurnover={setAvgStockTurnover}
                          setExpectedStockOut={setExpectedStockOut}
                        />
                      </SoftBox>

                      <SoftBox style={{ marginTop: '12px' }}>
                        <SalesAndPurchaseTrends gtin={gtin} selectedVariantBarcode={selectedVariantBarcode} />
                      </SoftBox>

                      <SoftBox style={{ marginTop: '12px' }}>
                        <ProductInsights
                          gtin={gtin}
                          isBundle={isBundle}
                          reloadBatchDetails={reloadBatchDetails}
                          pricingDetail={pricingDetail}
                          price={priceInfo}
                          productDetails={productDetails}
                          selectedVariant={selectedVariant}
                          setReloadBatchDetails={setReloadBatchDetails}
                        />
                      </SoftBox>

                      <SoftBox style={{ marginTop: '12px' }}>
                        <PriceRevisions
                          gtin={gtin}
                          selectedVariantBarcode={selectedVariantBarcode}
                          setReloadBatchDetails={setReloadBatchDetails}
                          reloadBatchDetails={reloadBatchDetails}
                        />
                      </SoftBox>

                      <SoftBox style={{ marginTop: '12px' }}>
                        <ProductInformation productDetails={productDetails} selectedVariant={selectedVariant} />
                      </SoftBox>
                    </>
                  )}
                </SoftBox>
              </Card>
            </SoftBox>
          </>
        )}

        <Dialog
          open={openProductLogs}
          TransitionComponent={Transition}
          keepMounted
          maxWidth={false}
          PaperProps={{ style: { width: '100%', maxWidth: 'none', padding: '15px' } }}
          onClose={() => setOpenProductLogs(false)}
        >
          <SoftBox mb={2} mt={2} sx={{ width: '100%' }}>
            <DataGrid
              sx={{
                ...dataGridStyles.header,
                borderRadius: '24px',
                cursor: 'pointer',
                '& .MuiDataGrid-root': {
                  height: '100%',
                },
              }}
              columns={columns}
              rows={rowData}
              pagination
              pageSize={5}
              disableHover
              autoHeight
              disableSelectionOnClick
              getRowId={(row) => row.id}
              onRowClick={(params) => {
                const logId = params.row.id;
                navigate(`/products/product/details/${id}?logId=${logId}`);
                setOpenProductLogs(false);
              }}
            />
          </SoftBox>
        </Dialog>
      </DashboardLayout>
    </div>
  );
};

export default ProductDetailsPage;
