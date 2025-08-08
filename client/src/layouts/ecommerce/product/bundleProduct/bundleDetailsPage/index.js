import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import {
  activateCMSProduct,
  deleteCMSProduct,
  generateBarcodeWithNum,
  getBundleDetailsIms,
  getProductDetailsFromLogs,
  getProductDetailsNew,
  getProductLogs,
} from '../../../../../config/Services';
import SoftBox from '../../../../../components/SoftBox';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Dialog, Grid, Menu, MenuItem, Slide, Tooltip, Typography } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProductImages from '../../all-products/components/product-details/components/ProductImages';
import Spinner from '../../../../../components/Spinner';
import { isSmallScreen } from '../../../Common/CommonFunction';
import DownloadIcon from '@mui/icons-material/Download';
import { CopyToClipboardIcon } from '../../../products-new-page/Products-detail-page/components/ProductDetailsInfo';
import ProductInsights from '../../../products-new-page/Products-detail-page/components/ProductInsights';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SplideCommon from '../../../../dashboards/default/components/common-tabs-carasoul';
import { SplideSlide } from '@splidejs/react-splide';
import './bundleDetails.css';
import Swal from 'sweetalert2';
import Status from '../../../Common/Status';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BundleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location1 = useLocation();
  const showSnackBar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const [anchorEl, setAnchorEl] = useState(null);

  const [loader, setLoader] = useState(false);
  const [barcodeLoader, setBarcodeLoader] = useState(false);

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [productDetails, setProductDetails] = useState({});
  const [openProductLogs, setOpenProductLogs] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [openMergeMenu, setOpenMergeMenu] = useState(false);
  const [variants, setVariants] = useState([]);
  const [bundleBarcodeImage, setBundleBarcodeImage] = useState('');
  const [batchData, setBatchData] = useState([]);
  const [isBundle, setIsBundle] = useState(false);
  const [bundleInfo, setBundleInfo] = useState({});

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const logId = params.get('logId');
    return { logId };
  };

  async function getProduct() {
    setLoader(true);
    await getProductDetailsNew(id, locId.toLowerCase()).then(function (responseTxt) {
      if (!responseTxt?.data) {
        navigate('/products/all-bundle-products');
        return;
      }
      setLoader(false);
      setProductDetails(responseTxt?.data?.data?.data);
      sessionStorage.setItem('tableData', JSON.stringify(responseTxt?.data?.data));
      setIsBundle(responseTxt?.data?.data?.data?.isBundle);
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

  const getBundleDataFromInventory = (gtin) => {
    getBundleDetailsIms(locId, gtin)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackBar(res?.data?.message, 'error');
        } else if (res?.data?.data?.es > 0) {
          showSnackBar(res?.data?.data?.message, 'error');
        } else {
          setBundleInfo(res?.data?.data?.bundle);
        }
      })
      .catch((err) => {
        showSnackBar('There was an error fetching data', 'error');
      });
  };

  const { logId } = getQueryParams();

  useEffect(() => {
    if (logId) {
      getProductLogsfunc();
    } else {
      getProduct();
    }
  }, [logId]);

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

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      productId: [id],
      sortByCreatedDate: 'ASCENDING',
      sortByLogDate: 'ASCENDING',
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
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMergeMenu(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (productDetails?.variants?.length > 0) {
      const updatedVariants = productDetails?.variants?.map((variant, index) => ({
        ...variant,
        checked: index === 0,
        barcodeImage: null,
        mrp: '-----', // Set initially to '-----', will update later
        salePrice: '-----',
        purchasePrice: '-----',
        purchaseMargin: '-----',
        availableQty: '-----',
      }));

      const variantPromises = updatedVariants.map((variant) => {
        const payload = {
          gtin: [variant.barcodes[0]],
        };

        const barcodePromise = generateBarcodeWithNum(variant?.barcodes[0] || 'NA').catch((err) => {
          showSnackBar(err?.response?.data?.message?.error || 'Error generating barcode', 'error');
          return { data: { data: { image: d_img } } };
        });

        return Promise.all([barcodePromise]);
      });

      Promise.all(variantPromises)
        .then((results) => {
          const updatedVariantsWithDetails = updatedVariants?.map((variant, idx) => {
            const barcodeResult = results[idx][0];
            return {
              ...variant,
              barcodeImage: barcodeResult ? `data:image/png;base64,${barcodeResult?.data?.data?.image || ''}` : d_img,
            };
          });

          setVariants(updatedVariantsWithDetails);
        })
        .catch((err) => {});
    }
  }, [productDetails]);

  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  const download = (image) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `${productDetails?.name}_barcode.png`;
    document.body.appendChild(link);
    link.click();
  };

  const uomArr = [
    { value: 'nos', label: 'each' },
    { value: 'Grams', label: 'gm' },
    { value: 'Kilograms', label: 'kg' },
    { value: 'Millilitres', label: 'ml' },
    { value: 'Litres', label: 'ltr' },
  ];

  const getWeightUnitLabel = (weightUnitValue) => {
    const uom = uomArr.find((unit) => unit.value === weightUnitValue);
    return uom ? uom.label : weightUnitValue; // Return the label if found, else return the value itself
  };

  function truncateText(text) {
    if (text?.length > 12) {
      return text?.substring(0, 12) + '...';
    }
    return text;
  }

  useEffect(() => {
    setBarcodeLoader(true);
    if (productDetails?.bundleBarcode) {
      getBundleDataFromInventory(productDetails?.bundleBarcode);
      generateBarcodeWithNum(productDetails?.bundleBarcode)
        .then((res) => {
          setBarcodeLoader(false);
          setBundleBarcodeImage(`data:image/png;base64,${res?.data?.data?.image || ''}`);
        })
        .catch((err) => {
          setBarcodeLoader(false);
        });
    }
  }, [productDetails]);

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
      minWidth: 220,
      cellClassName: 'datagrid-rows',
      align: 'left',
      // renderCell: renderBatchCell,
    },
    {
      field: 'quantity',
      headerName: 'Purchased Quantity',
      minWidth: 30,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchasePrice',
      headerName: 'Purchase Price',
      minWidth: 80,
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
      field: 'availableUnits',
      headerName: 'Available Qty',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
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
    {
      field: 'stockTurnover',
      headerName: 'Stock Turnover',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

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
                navigate('/products/all-bundle-products');
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
                  getProduct();
                } else {
                  showSnackBar('The product has been deactivated', 'success');
                  handleClose();
                  getProduct();
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
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={() => handleActivation('ACTIVE')}>Activate</MenuItem>
        <MenuItem onClick={() => handleActivation('ACTIVE')}>Deactivate</MenuItem>
        <MenuItem onClick={handleDeleteProduct}>Delete</MenuItem>
      </Menu>
      <DashboardLayout>
        {!isMobileDevice && <DashboardNavbar prevLink={true} />}
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
              {!isMobileDevice && (
                <div className="products-new-department-right-bar">
                  <button onClick={() => setOpenProductLogs(true)}>Product Logs</button>
                </div>
              )}
              <Status label={productDetails?.isActive ? 'ACTIVE' : 'INACTIVE'} />

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
                onClick={() => navigate(`/products/edit-bundle/${id}`)}
              ></ModeEditIcon> */}
              {/* <MoreVertIcon
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
              ></MoreVertIcon> */}
            </div>
          </div>

          <SoftBox style={{ marginTop: '10px' }}>
            <Grid container spacing={2}>
              <Grid item lg={3} md={3} xs={12} sm={12}>
                {loader ? <Spinner /> : <ProductImages Imgs={productDetails?.imageUrls || []} />}
              </Grid>
              <Grid item lg={9} md={7} sm={12} xs={12}>
                <SoftBox>
                  <Typography className="product-new-details-name-typo">{productDetails?.name}</Typography>
                  <SoftBox
                    className={!isMobileDevice ? 'product-new-details-gst-box' : 'products-new-details-gst-box-mob'}
                  >
                    {Object.entries(productDetails?.taxReference?.metadata || {}).map(([key, value]) => (
                      <Typography key={key} className="product-new-details-gst-typo">
                        {key === 'hsnCode' ? 'HSN Code' : key.toUpperCase()}:{' '}
                        <span className="product-new-details-gst-typo-value">
                          {key === 'hsnCode' ? value : value || 0} {key === 'hsnCode' ? '' : '%'}
                        </span>
                      </Typography>
                    ))}
                    {!productDetails?.taxReference?.metadata?.gst &&
                      productDetails?.taxReference?.taxType === 'GST' && (
                        <Typography className="product-new-details-gst-typo">
                          GST:{' '}
                          <span className="product-new-details-gst-typo-value">
                            {productDetails?.taxReference?.taxRate || 0}%
                          </span>
                        </Typography>
                      )}
                  </SoftBox>
                  <SoftBox className="products-new-details-tags-div">
                    {productDetails?.returnable && (
                      <div className="products-new-details-tag-single">
                        <img
                          src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20assignment%20return.png"
                          style={{ height: '31px' }}
                        />
                        <Typography className="products-new-details-tag-typo">
                          Return within{' '}
                          {productDetails?.minutesToReturnBack ? productDetails.minutesToReturnBack : 'NA'} days
                        </Typography>
                      </div>
                    )}
                  </SoftBox>

                  <SoftBox className="products-new-details-sales-channel-div">
                    <Typography className="products-new-details-pack-typo">Bundle Contents</Typography>
                    {/* {productDetails?.variants &&
                      productDetails?.variants?.length > 0 &&
                      productDetails?.variants?.salesChannels &&
                      productDetails?.variants?.salesChannels.length > 0 && (
                        <div className="products-new-details-sales-channel-box">
                          <Typography className="products-new-details-pack-typo">Sales Channel</Typography>
                          {productDetails?.variants?.salesChannels &&
                            productDetails?.variants?.salesChannels.length > 0 && (
                              <Typography className="products-details-sales-channel-typo">
                                {productDetails?.variants?.salesChannels
                                  .map((channel) => {
                                    if (channel === 'TWINLEAVES_APP') {
                                      return 'App';
                                    }
                                    return channel.replace(/_/g, ' ');
                                  })
                                  .map((channel) => channel.split(' ').map(capitalise).join(' '))
                                  .join(', ')}
                              </Typography>
                            )}
                        </div>
                      )} */}
                    <div className="products-new-details-sales-channel-box">
                      <Typography className="products-new-details-pack-typo">Sales Channel</Typography>

                      <Typography className="products-details-sales-channel-typo">
                        {
                          productDetails?.variants?.[0]?.salesChannels
                            ?.filter((channel) => channel) // Ensure channel exists
                            ?.map((channel) => {
                              if (channel === 'TWINLEAVES_APP') {
                                return 'App';
                              }
                              return channel?.replace(/_/g, ' '); // Replace underscores with spaces
                            })
                            ?.map(
                              (channel) =>
                                channel
                                  ?.split(' ') // Split by spaces
                                  ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
                                  ?.join(' '), // Join the words back
                            )
                            ?.join(', ') || 'No Channels Available' // Fallback message
                        }
                      </Typography>
                    </div>
                  </SoftBox>

                  {!isMobileDevice && (
                    <SoftBox className="products-new-details-variants-div product-new-details-overFlow">
                      {variants?.map((item, index) => (
                        <div className={`products-new-details-variants-box`} key={index}>
                          <Grid container spacing={0.5}>
                            <Grid item lg={9}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">Name</Typography>
                                  <Tooltip title={item?.name}>
                                    <Typography className="products-new-details-variants-price-typo-value">
                                      {item?.name ? truncateText(item?.name) : '-----'}
                                    </Typography>
                                  </Tooltip>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Specification
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {item?.weight && item?.weightUnit
                                      ? `${item.weight} ${getWeightUnitLabel(item.weightUnit)}`
                                      : '-----'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Purchase Price
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.purchasePrice || 'NA'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Quantity
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.quantity || 'NA'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">MRP</Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.mrp || 'NA'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Sale Price
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.sellingPrice || 'NA'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Offer Price
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.offerPrice || 'NA'}
                                  </Typography>
                                </div>
                              </div>
                            </Grid>
                            <Grid item lg={3}>
                              <div className="barcode-container">
                                {item?.barcodeImage && (
                                  <CopyToClipboardIcon textToCopy={item?.barcodes[0]} fontSize="small" />
                                )}
                                <img
                                  style={{
                                    display: item?.barcodeImage ? 'block' : 'none',
                                    objectFit: 'cover',
                                    height: '60px',
                                    marginRight: '2px',
                                  }}
                                  src={item?.barcodeImage ? item?.barcodeImage : d_img}
                                  alt=""
                                />
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  {item?.barcodeImage && (
                                    <DownloadIcon onClick={() => download(item?.barcodeImage)} fontSize="small" />
                                  )}
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      ))}
                    </SoftBox>
                  )}

                  {isMobileDevice && (
                    <SoftBox>
                      <SplideCommon>
                        {variants?.map((item, index) => (
                          <SplideSlide>
                            <Card className="productKpiCard">
                              <div className="barcode-container" style={{ marginTop: '10px' }}>
                                <img
                                  style={{
                                    display: item?.barcodeImage ? 'block' : 'none',
                                    objectFit: 'cover',
                                    height: '60px',
                                    marginRight: '2px',
                                  }}
                                  src={item?.barcodeImage ? item?.barcodeImage : d_img}
                                  alt=""
                                />
                                <div onClick={() => showSnackBar('Copied', 'success')}>
                                  {item?.barcodeImage && (
                                    <CopyToClipboardIcon textToCopy={item?.barcodes[0]} fontSize="small" />
                                  )}
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">Name</Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {item?.name ? truncateText(item?.name) : '-----'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Specification
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {item?.weight && item?.weightUnit
                                      ? `${item.weight} ${getWeightUnitLabel(item.weightUnit)}`
                                      : '-----'}
                                  </Typography>
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">MRP</Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.mrp || 'NA'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Sale Price
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.sellingPrice || 'NA'}
                                  </Typography>
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Quantity
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {' '}
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.quantity || 'NA'}
                                  </Typography>
                                </div>
                                <div className="products-new-details-variants-price">
                                  <Typography className="products-new-details-variants-price-typo-sm">
                                    Offer Price
                                  </Typography>
                                  <Typography className="products-new-details-variants-price-typo-value">
                                    {' '}
                                    {bundleInfo?.bundleProducts?.find((product) => product?.gtin === item?.barcodes[0])
                                      ?.offerPrice || 'NA'}
                                  </Typography>
                                </div>
                              </div>
                            </Card>
                          </SplideSlide>
                        ))}
                      </SplideCommon>
                    </SoftBox>
                  )}
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          <SoftBox style={{ marginTop: '50px' }}>
            <Typography
              className="products-new-details-performance-sales-typo"
              style={{ color: '#0562FB', marginBottom: '0px' }}
            >
              Bundle Information
            </Typography>
            <SoftBox className="products-new-details-performance-sales-block-23">
              <SoftBox className="products-new-details-des-det-box">
                <Grid container spacing={2} style={{ justifyContent: 'center' }}>
                  <Grid item lg={8} sm={12} md={6}>
                    <div className={isMobileDevice ? 'mobile-device-bundle-info' : 'web-screen-bundle-info'}>
                      <div className="products-new-details-variants-price">
                        <Typography className="products-new-details-variants-price-typo-sm">MRP</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          ₹{bundleInfo?.mrp || 'NA'}
                        </Typography>
                      </div>

                      <div className="products-new-details-variants-price">
                        <Typography className="products-new-details-variants-price-typo-sm">Sale Price</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          ₹{bundleInfo?.sellingPrice || 'NA'}
                        </Typography>
                      </div>
                      <div className="products-new-details-variants-price">
                        <Typography className="products-new-details-variants-price-typo-sm">Purchase Price</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          ₹{bundleInfo?.purchasePrice || 'NA'}
                        </Typography>
                      </div>
                      <div className="products-new-details-variants-price">
                        <div style={{ display: 'flex' }}>
                          <Typography className="products-new-details-variants-price-typo-sm">
                            Total Quantity
                          </Typography>
                          <Tooltip title={'This is the total number of items in a single bundle.'}>
                            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
                          </Tooltip>
                        </div>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {bundleInfo?.totalQuantity || 'NA'}
                        </Typography>
                      </div>
                      <div className="products-new-details-variants-price">
                        <div style={{ display: 'flex' }}>
                          <Typography className="products-new-details-variants-price-typo-sm">
                            Bundle Quantity
                          </Typography>
                          <Tooltip title={'This is the total number of bundles.'}>
                            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
                          </Tooltip>
                        </div>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {bundleInfo?.quantity}
                        </Typography>
                      </div>
                      <div className="products-new-details-variants-price">
                        <Typography className="products-new-details-variants-price-typo-sm">Bundle Validity</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {bundleInfo?.startDate}/{bundleInfo?.endDate}
                        </Typography>
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={4} sm={12} md={6}>
                    {barcodeLoader && <Spinner />}
                    {!barcodeLoader && (
                      <div className="barcode-container">
                        {productDetails?.bundleBarcode && (
                          <CopyToClipboardIcon textToCopy={productDetails?.bundleBarcode} fontSize="small" />
                        )}
                        <img
                          style={{
                            display: bundleBarcodeImage ? 'block' : 'none',
                            objectFit: 'cover',
                            height: '60px',
                            marginRight: '2px',
                          }}
                          src={bundleBarcodeImage ? bundleBarcodeImage : d_img}
                          alt=""
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                          {bundleBarcodeImage && (
                            <DownloadIcon onClick={() => download(bundleBarcodeImage)} fontSize="small" />
                          )}
                        </div>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </SoftBox>
              <Typography className="products-new-details-variants-price-typo">Description</Typography>
              {/* <div style={{ fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: productDetails?.shortDescription !== "" ? productDetails?.shortDescription : productDetails?.description !== "" ? productDetails?.description : 'NA' }} /> */}
              <Typography className="products-new-details-variants-price-typo-value" style={{ marginTop: '10px' }}>
                {productDetails?.shortDescription !== '' && productDetails?.shortDescription !== null
                  ? productDetails?.shortDescription
                  : productDetails?.description !== '' && productDetails?.description !== null
                  ? productDetails?.description
                  : 'NA'}
              </Typography>

              <SoftBox className="products-new-details-des-det-box">
                <div className="products-new-details-performance-price">
                  <Typography className="products-new-details-variants-price-typo">
                    Product title in other language
                  </Typography>
                  {productDetails?.nativeLanguages && productDetails?.nativeLanguages?.length > 0 ? (
                    productDetails?.nativeLanguages.map((item) => (
                      <Typography
                        key={item?.language || item?.name}
                        className="products-new-details-variants-price-typo-value"
                      >
                        {item?.language ? `${item?.language}: ${item?.name}` : 'Not available'}
                      </Typography>
                    ))
                  ) : (
                    <Typography className="products-new-details-variants-price-typo-value">Not available</Typography>
                  )}
                </div>
              </SoftBox>

              <SoftBox className="products-new-details-des-det-box">
                <div className="products-new-details-performance-price">
                  <Typography className="products-new-details-variants-price-typo">SEO tags</Typography>
                  {productDetails?.tags && productDetails?.tags?.length > 0 && productDetails?.tags[0] !== '' ? (
                    productDetails?.tags?.map((tag, index) => (
                      <Typography className="products-new-details-variants-price-typo-value">{tag}</Typography>
                    ))
                  ) : (
                    <Typography className="products-new-details-variants-price-typo-value">Not Available</Typography>
                  )}
                </div>
              </SoftBox>
            </SoftBox>
          </SoftBox>

          <SoftBox style={{ marginTop: '50px' }}>
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

          {/* <SoftBox style={{ marginTop: '50px' }}>
            <Typography
              className="products-new-details-performance-sales-typo"
              style={{ color: '#0562FB', marginBottom: '0px' }}
            >
              Bundle Batch details
            </Typography>
            <SoftBox mb={2} mt={2}>
              <DataGrid
                sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
                columns={batchColumns}
                rows={batchData}
                pagination
                pageSize={5}
                disableHover
                autoHeight
                disableSelectionOnClick
                // getRowId={(row) => row.batchId}
              />
            </SoftBox>
          </SoftBox> */}

          {/* <SoftBox style={{ marginTop: '50px' }}>
            <ProductInsights isBundle={isBundle} />
          </SoftBox> */}
        </SoftBox>
      </DashboardLayout>
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
              navigate(`/products/bundle-product/details/${id}?logId=${logId}`);
              setOpenProductLogs(false);
            }}
          />
        </SoftBox>
      </Dialog>
    </div>
  );
};

export default BundleDetailsPage;
