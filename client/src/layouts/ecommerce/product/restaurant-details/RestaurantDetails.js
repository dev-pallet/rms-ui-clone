import React, { useEffect, useState } from 'react';
// import './product-details.css';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import WrongLocationOutlinedIcon from '@mui/icons-material/WrongLocationOutlined';
import { Box, Card, Chip, Dialog, Grid, Menu, MenuItem, Slide, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import SoftBox from '../../../../components/SoftBox';
import Spinner from '../../../../components/Spinner';
import {
  activateCMSProduct,
  deleteCMSProduct,
  getBatchIdOfferDetails,
  getInventoryDetails,
  getProductDetailsFromLogs,
  getProductDetailsNew,
  getProductDetailsRestaurant,
  getProductIdByBarcode,
  getProductLogs,
  getRecipeDetailsRestaurant,
} from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { expireDateChecker, isSmallScreen } from '../../Common/CommonFunction';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import Status from '../../Common/Status';
import ProductBatchDetails from '../../products-new-page/Products-detail-page/components/BatchDetails';
import PriceRevisions from '../../products-new-page/Products-detail-page/components/PriceRevisions';
import ProductsDetailsInfo from '../../products-new-page/Products-detail-page/components/ProductDetailsInfo';
import ProductInformation from '../../products-new-page/Products-detail-page/components/ProductInformation';
import ProductInsights from '../../products-new-page/Products-detail-page/components/ProductInsights';
import ProductPerformance from '../../products-new-page/Products-detail-page/components/ProductPerformance';
import SalesAndPurchaseTrends from '../../products-new-page/Products-detail-page/components/SalesAndPurchaseTrends';
import OfferPopup from '../all-products/components/product-details/components/OfferPopup';
import ProductImages from '../all-products/components/product-details/components/ProductImages';
import MergeProductDialog from '../../products-new-page/Products-detail-page/MergeProductDailog';
import UnmergeProductDialog from '../../products-new-page/Products-detail-page/UnMergerProductDailog';
import RecipeDetails from './components/RecipeDetails';
import SalesChannelDetails from './components/SalesChannelDetails';
import SalesFoodWastageChart from './components/SalesFoodWastageChart';
import RestaurantBasicInfo from './components/RestaurantBasicInfo';
import AddonDetails from './components/AddonDetails';
import SoftButton from '../../../../components/SoftButton';
import PurchaseDetails from './components/PurchaseDetails';
import StockBalanceDetails from './components/StockBalanceDetails';
import Wastage from './components/Wastage';
import FoodCostAnalysis from './components/FoodCostAnalysis';
import PurchaseReturns from './components/PurchaseReturns';
import SalesReturns from './components/SalesReturns';
import ProductInformationRestaurant from './components/ProductInformationRestaurant';
import SalesAndFoodCostTrend from './components/SalesAndFoodCostTrend';
import SplideCommon from '../../../dashboards/default/components/common-tabs-carasoul';
import { SplideSlide } from '@splidejs/react-splide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RestaurantDetails = () => {
  const isRestaurant = localStorage.getItem('retailType') === 'RESTAURANT';
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
  const [batchRows, setBatchRows] = useState([]);

  const [avgStockTurnover, setAvgStockTurnover] = useState('NA');
  const [expectedStockOut, setExpectedStockOut] = useState('NA');
  const [recipeDetails, setRecipeDetails] = useState([]);

  const [openProductLogs, setOpenProductLogs] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Purchase Details');

  const allTabs = [
    'Purchase Details',
    'Stock Balance',
    'Wastage',
    'Food Cost Analysis',
    'Sale Price Revisions',
    'Purchase Returns',
    'Sales Returns',
  ];

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
      navigate('/products/all-products/restaurant/add-products/' + id);
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

    await getProductDetailsRestaurant(id, locIdData).then(function (responseTxt) {
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
          const newData1 = newPricingarr?.map((row, index) => {
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
          });
          setPricingDetail(newData1);
          setBatchRows(newData1);
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

  useEffect(() => {
    if (selectedVariant?.variantId) {
      const recipePayload = {
        page: 1,
        pageSize: 100,
        variantIds: [selectedVariant?.variantId] || [],
      };
      getRecipeDetailsRestaurant(recipePayload).then((recipeResponse) => {
        if (
          recipeResponse?.data?.status === 'ERROR' ||
          recipeResponse?.data?.status === 'error' ||
          recipeResponse?.data?.data?.es > 0
        ) {
          return;
        } else {
          const recipeRes = recipeResponse?.data?.data?.data?.data || [];
          setRecipeDetails(recipeRes);
        }
      });
    }
  }, [selectedVariant]);

  const batchColumns = [
    {
      field: 'inwardedOn',
      headerName: 'Inward Date',
      minWidth: 60,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchId',
      headerName: 'Batch No',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'quantity',
      headerName: 'Qty Purchased',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'availableUnits',
      headerName: 'Available Qty',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const { availableUnits, negativeConsumption } = params?.row;

        const displayValue = negativeConsumption ? `${availableUnits} (-${negativeConsumption})` : availableUnits;

        return negativeConsumption ? (
          <Tooltip title={'Negative consumption'}>
            <span>{displayValue}</span>
          </Tooltip>
        ) : (
          <span>{displayValue}</span>
        );
      },
    },
    {
      field: 'purchasePrice',
      headerName: 'Pp',
      minWidth: 30,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchaseMargin',
      headerName: 'Purchase Margin',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      minWidth: 30,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'sellingPrice',
      headerName: 'Sale Price',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      // renderCell: renderSellingPriceCell,
    },

    {
      field: 'expiryDate',
      headerName: 'Expiry',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

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
                    {/* <ProductsDetailsInfo
                      productDetails={productDetails}
                      setSelectedVariantBarcode={setSelectedVariantBarcode}
                      selectedVariantBarcode={selectedVariantBarcode}
                      handleGtinChange={handleGtinChange}
                      selectedVariant={selectedVariant}
                      setSelectedVariant={setSelectedVariant}
                      pricingDetail={pricingDetail}
                      reloadBatchDetails={reloadBatchDetails}
                      type={'RESTAURANT'}
                    /> */}
                    <RestaurantBasicInfo
                      productDetails={productDetails}
                      setSelectedVariantBarcode={setSelectedVariantBarcode}
                      selectedVariantBarcode={selectedVariantBarcode}
                      handleGtinChange={handleGtinChange}
                      selectedVariant={selectedVariant}
                      setSelectedVariant={setSelectedVariant}
                      pricingDetail={pricingDetail}
                      reloadBatchDetails={reloadBatchDetails}
                      type={'RESTAURANT'}
                    />
                  </Grid>
                </Grid>
              </SoftBox>

              {recipeDetails?.length > 0 && (
                <RecipeDetails
                  productDetails={productDetails}
                  selectedVariant={selectedVariant}
                  recipeDetails={recipeDetails}
                />
              )}
              {selectedVariant?.addOn?.length > 0 && (
                <AddonDetails productDetails={productDetails} selectedVariant={selectedVariant} />
              )}
              {selectedVariant?.externalSalesChannels?.length > 0 && (
                <SalesChannelDetails selectedVariant={selectedVariant} />
              )}
              {/* <SalesFoodWastageChart /> */}
              {loader && <Spinner />}
              {!loader && gtin !== '' && (
                <>
                  {productDetails?.productTypes?.[0] === 'MENU' && (
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
                  )}

                  <SoftBox style={{ marginTop: '50px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <Typography className="products-new-details-pack-typo">Batch Details</Typography>
                    </Box>
                    <DataGrid
                      sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
                      columns={batchColumns}
                      rows={batchRows}
                      pagination
                      pageSize={5}
                      disableHover
                      autoHeight
                      disableSelectionOnClick
                      getRowId={(row) => row.batchId}
                    />
                  </SoftBox>

                  <SoftBox style={{ marginTop: '50px' }}>
                    <SalesAndFoodCostTrend gtin={gtin} selectedVariantBarcode={selectedVariantBarcode} />
                  </SoftBox>
                  <SoftBox style={{ marginTop: '50px' }}>
                    <div className="flex-row-start-center gap-10">
                      {allTabs?.map((tab) => (
                        <div
                          className={
                            selectedTab === tab ? 'product-details-selected-tab' : 'product-details-unselected-tab'
                          }
                          onClick={() => setSelectedTab(tab)}
                        >
                          <Typography style={{ fontSize: '14px' }}>{tab}</Typography>
                        </div>
                      ))}
                    </div>
                  </SoftBox>

                  <SoftBox style={{ marginTop: '10px' }}>
                    {selectedTab === 'Sale Price Revisions' ? (
                      <PriceRevisions
                        gtin={gtin}
                        selectedVariantBarcode={selectedVariantBarcode}
                        setReloadBatchDetails={setReloadBatchDetails}
                        reloadBatchDetails={reloadBatchDetails}
                      />
                    ) : selectedTab === 'Purchase Details' ? (
                      <PurchaseDetails />
                    ) : selectedTab === 'Stock Balance' ? (
                      <StockBalanceDetails />
                    ) : selectedTab === 'Wastage' ? (
                      <Wastage />
                    ) : selectedTab === 'Food Cost Analysis' ? (
                      <FoodCostAnalysis />
                    ) : selectedTab === 'Purchase Returns' ? (
                      <PurchaseReturns />
                    ) : selectedTab === 'Sales Returns' ? (
                      <SalesReturns />
                    ) : null}
                  </SoftBox>
                </>
              )}
              <SoftBox style={{ marginTop: '50px' }}>
                <ProductInformationRestaurant
                  productDetails={productDetails}
                  selectedVariant={selectedVariant}
                  recipeDetails={recipeDetails}
                />
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
                    </Typography>
                  </div>

                  <RestaurantBasicInfo
                    productDetails={productDetails}
                    setSelectedVariantBarcode={setSelectedVariantBarcode}
                    selectedVariantBarcode={selectedVariantBarcode}
                    handleGtinChange={handleGtinChange}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                    pricingDetail={pricingDetail}
                    reloadBatchDetails={reloadBatchDetails}
                    type={'RESTAURANT'}
                  />

                  {recipeDetails?.length > 0 && (
                    <RecipeDetails
                      productDetails={productDetails}
                      selectedVariant={selectedVariant}
                      recipeDetails={recipeDetails}
                    />
                  )}
                  {selectedVariant?.addOn?.length > 0 && (
                    <AddonDetails productDetails={productDetails} selectedVariant={selectedVariant} />
                  )}
                  {selectedVariant?.externalSalesChannels?.length > 0 && (
                    <SalesChannelDetails selectedVariant={selectedVariant} />
                  )}

                  {loader && <Spinner />}
                  {!loader && gtin !== '' && (
                    <>
                      {productDetails?.productTypes?.[0] === 'MENU' && (
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
                      )}

                      <SoftBox style={{ marginTop: '12px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px',
                          }}
                        >
                          <Typography className="products-new-details-pack-typo">Batch Details</Typography>
                        </Box>
                        <DataGrid
                          sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
                          columns={batchColumns}
                          rows={batchRows}
                          pagination
                          pageSize={5}
                          disableHover
                          autoHeight
                          disableSelectionOnClick
                          getRowId={(row) => row.batchId}
                        />
                      </SoftBox>

                      <SoftBox style={{ marginTop: '12px' }}>
                        <SalesAndFoodCostTrend gtin={gtin} selectedVariantBarcode={selectedVariantBarcode} />
                      </SoftBox>
                      <SoftBox style={{ marginTop: '12px' }}>
                        <div className="flex-row-start-center gap-10">
                          <SplideCommon>
                            {allTabs?.map((tab) => (
                              <SplideSlide style={{ padding: '7px' }}
                                className={
                                  selectedTab === tab
                                    ? 'product-details-selected-tab mob-res-slide'
                                    : 'product-details-unselected-tab mob-res-slide'
                                }
                                onClick={() => setSelectedTab(tab)}
                              >
                                <Typography style={{ fontSize: '14px' }}>{tab}</Typography>
                              </SplideSlide>
                            ))}
                          </SplideCommon>
                        </div>
                      </SoftBox>

                      <SoftBox style={{ marginTop: '10px' }}>
                        {selectedTab === 'Sale Price Revisions' ? (
                          <PriceRevisions
                            gtin={gtin}
                            selectedVariantBarcode={selectedVariantBarcode}
                            setReloadBatchDetails={setReloadBatchDetails}
                            reloadBatchDetails={reloadBatchDetails}
                          />
                        ) : selectedTab === 'Purchase Details' ? (
                          <PurchaseDetails />
                        ) : selectedTab === 'Stock Balance' ? (
                          <StockBalanceDetails />
                        ) : selectedTab === 'Wastage' ? (
                          <Wastage />
                        ) : selectedTab === 'Food Cost Analysis' ? (
                          <FoodCostAnalysis />
                        ) : selectedTab === 'Purchase Returns' ? (
                          <PurchaseReturns />
                        ) : selectedTab === 'Sales Returns' ? (
                          <SalesReturns />
                        ) : null}
                      </SoftBox>

                      <SoftBox style={{ marginTop: '12px' }}>
                        <ProductInformationRestaurant
                          productDetails={productDetails}
                          selectedVariant={selectedVariant}
                          recipeDetails={recipeDetails}
                        />
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

export default RestaurantDetails;
