import { Box, Divider, Grid, IconButton, Modal, Tooltip, styled, tooltipClasses } from '@mui/material';
import { returnProductLookup } from '../../../../../../config/Services';
import { useCopyToClipboard, useDebounce, useMediaQuery } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import { noDatagif } from '../../../../Common/CommonFunction';

const SalesReturnProductLookup = ({
  handleCustProduct,
  selectedCustomer,
  rowData,
  setRowData,
  setBillChange,
  isCreateAPIResponse,
  setIsCreateAPIResponse,
}) => {
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const is1143px = useMediaQuery('(min-width:1143px)');
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [customerProducts, setCustomerProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const debouncedQuantities = useDebounce(quantities, 700);
  const [tooltipText, setTooltipText] = useState();
  const [copiedText, setCopiedText] = useCopyToClipboard();

  const noImage =
    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

  const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 360,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }),
  );

  const styles = {
    Icon: {
      color: '#367df3',
      fill: '#367df3',
      fontSize: '12px',
      top: '213px',
      left: '759px',
      width: '12px',
      height: '12px',
    },
  };

  const IconComponent = () => (
    <svg style={styles.Icon} viewBox="0 0 512 512">
      <path d="M0 224C0 188.7 28.65 160 64 160H128V288C128 341 170.1 384 224 384H352V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V224zM224 352C188.7 352 160 323.3 160 288V64C160 28.65 188.7 0 224 0H448C483.3 0 512 28.65 512 64V288C512 323.3 483.3 352 448 352H224z"></path>
    </svg>
  );

  useEffect(() => {
    if (Object.keys(debouncedQuantities)?.length !== 0) {
      const existingProductIndex = rowData?.findIndex((item) => item?.gtin === debouncedQuantities?.product?.gtin);
      const newProduct = {
        itemId: uuidv4(),
        orderId: debouncedQuantities?.product?.orderId,
        orderItemId: debouncedQuantities?.product?.orderItemId,
        gtin: debouncedQuantities?.product?.gtin,
        productName: debouncedQuantities?.product?.productName,
        mrp: debouncedQuantities?.product?.mrp || 0,
        sellingPrice: debouncedQuantities?.product?.sellingPrice || 0,
        quantity: debouncedQuantities?.product?.quantity,
        quantityReturned: debouncedQuantities?.quantity,
        batchNo: debouncedQuantities?.product?.batchNo,
        igst: debouncedQuantities?.product?.igst || 0,
        cess: debouncedQuantities?.product?.cess || 0,
        returnedSubTotal: debouncedQuantities?.product?.returnedSubTotal ?? '',
      };
      if (existingProductIndex !== -1) {
        const updatedRowData = [...rowData];
        if (debouncedQuantities?.quantity === '') {
          updatedRowData.splice(existingProductIndex, 1);
          setRowData(updatedRowData);
        } else {
          updatedRowData[existingProductIndex].quantityReturned = debouncedQuantities?.quantity;
          setRowData(updatedRowData);
        }
        showSnackbar('Product updated', 'success');
        setBillChange(uuidv4());
      } else {
        if (rowData?.length === 1 && rowData[0]?.gtin === '') {
          setRowData([newProduct]);
        } else {
          setRowData([...rowData, newProduct]);
        }
        showSnackbar('Product added', 'success');
        setBillChange(uuidv4());
      }
    }
  }, [debouncedQuantities]);

  const handleCopy = (text) => {
    setTooltipText(text);
    setCopiedText(text);
    setTimeout(() => {
      setTooltipText();
    }, 1000);
  };

  useEffect(() => {
    getCustomerProducts();
  }, []);

  const getCustomerProducts = () => {
    setLoader(true);
    returnProductLookup(selectedCustomer?.value, locId)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es > 0) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.orderItemList?.length > 0) {
          setCustomerProducts(res?.data?.data?.orderItemList);
        } else {
          showSnackbar('No products found for the selected customer', 'error');
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.res?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleQuantityChange = (quantity, product) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      quantity,
      product,
    }));
    setIsCreateAPIResponse(true);
    //   setItemChanged(true);
  };
  return (
    <Modal
      open={true}
      onClose={handleCustProduct}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
      sx={{ padding: '20px !important' }}
    >
      <Box
        className="pi-vendor-box"
        sx={{
          position: 'absolute',
          top: '-67px',
          left: '-67px',
          bottom: '-67px',
          right: '-67px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          width: '95vw',
          overflow: 'hidden',
          height: '95vh',
          marginTop: '',
        }}
      >
        <SoftBox className="vendor-prod-modal">
          <SoftBox className="vendor-prod-modal-fix-heading">
            <div className="pi-product-list-align">
              <SoftTypography fontSize="20px" fontWeight="bold" sx={{ color: '#030303' }}>
                Product list for {selectedCustomer?.label}
              </SoftTypography>
              <IconButton edge="end" color="inherit" onClick={handleCustProduct} aria-label="close">
                <CancelIcon color="error" />
              </IconButton>
            </div>
          </SoftBox>
          {/* If no product present NO PRODUCT FOUND FOR THIS VENDOR */}
          {!loader && customerProducts?.length === 0 && (
            <div style={{ height: '90vh' }}>
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                {errorMessage !== '' ? (
                  <h3 className="no-data-text-I"> {errorMessage}</h3>
                ) : (
                  <h3 className="no-data-text-I">
                    {' '}
                    NO PRODUCTS FOUND FOR <b>{selectedCustomer?.label}</b>
                  </h3>
                )}
              </SoftBox>
            </div>
          )}
          {loader && (
            <div style={{ height: '90vh' }}>
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <Spinner size={40} />
                </SoftBox>
              </SoftBox>
            </div>
          )}
          {!loader && customerProducts?.length > 0 && (
            <SoftBox className="vendor-product" sx={{ height: '80vh', overflowY: 'scroll' }}>
              {customerProducts?.map((ele, index) => {
                const isQuantPresent = rowData?.find((item) => item?.gtin === ele?.gtin);
                const quantityData = ele?.gtin === quantities?.product?.gtin;
                const quantity = quantityData ? quantities?.quantity : '';
                const name = ele?.productName || '';
                const truncatedName = name?.length > 40 ? name?.slice(0, 40) + '...' : name;
                return (
                  <SoftBox className="vendor-prod-mobile-container-1">
                    <SoftBox className="additional-detail-container-1">
                      <SoftBox className="vendor-prod-main-box">
                        <SoftBox className="vendor-prod-img-1">
                          <img src={ele?.productImage ?? noImage} className="all-vendor-prdt-img-1" />
                        </SoftBox>
                        <SoftBox className="vendor-prod-seconday" sx={{ marginLeft: '0px' }}>
                          <SoftBox>
                            <SoftBox display="flex" flexDirection="column">
                              <SoftBox className="vendor-prod-title-box">
                                <CustomTooltip title={ele?.productName}>
                                  <SoftTypography className="vendor-prod-title">{truncatedName}</SoftTypography>
                                </CustomTooltip>

                                <SoftTypography fontSize="14px" textAlign="start">
                                  ({ele?.gtin}){' '}
                                </SoftTypography>
                                <Tooltip title={tooltipText && 'Copied'} placement="top-start">
                                  <SoftBox
                                    onClick={() => {
                                      handleCopy(ele?.gtin);
                                    }}
                                    sx={{ cursor: 'pointer' }}
                                  >
                                    <SoftBox>
                                      <IconComponent />
                                    </SoftBox>
                                  </SoftBox>
                                </Tooltip>
                              </SoftBox>
                              <SoftBox display="flex" justifyContent="space-between">
                                <SoftBox
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  gap="20px"
                                  mt={1}
                                  mb={1}
                                >
                                  <SoftTypography fontSize={'12px'}>
                                    {(ele?.weightsAndMeasures?.net_weight || ' ') +
                                      ' ' +
                                      (ele?.weightsAndMeasures?.measurement_unit || '')}{' '}
                                  </SoftTypography>
                                  <SoftTypography fontSize={'12px'}>
                                    MRP: ₹ {ele?.mrp === 0 ? '0' : ele?.mrp || 'NA'}
                                  </SoftTypography>
                                </SoftBox>
                                <SoftBox className="other-vendor-prod-item-listing-2">
                                  <SoftTypography fontSize="12px" fontWeight="bold">
                                    Quantity
                                  </SoftTypography>
                                  <SoftBox className="vendor-prod-inpt-box" sx={{ border: 'none !important' }}>
                                    <SoftInput
                                      type="number"
                                      sx={{
                                        width: '120px !important',
                                      }}
                                      disabled={isCreateAPIResponse ? true : false}
                                      value={
                                        quantity ? quantity : isQuantPresent ? isQuantPresent?.quantityReturned : ''
                                      }
                                      onChange={(e) => handleQuantityChange(e.target.value, ele)}
                                      inputProps={{ min: 0 }}
                                    />
                                  </SoftBox>
                                </SoftBox>
                              </SoftBox>
                            </SoftBox>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                      <SoftBox className="other-vendor-prod-listing-1">
                        <Grid
                          container
                          spacing={1}
                          mb={2}
                          ml={1}
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          sx={{ width: is1143px ? '70%' : '100%' }}
                        >
                          <Grid item lg={2} md={2} sm={2} xs={2}>
                            <SoftBox className="other-vendor-prod-item-listing">
                              <SoftTypography className="product-vendor-look-up">Batch number</SoftTypography>
                              <SoftTypography fontSize="12px">{ele?.batchNo ?? 'NA'}</SoftTypography>
                            </SoftBox>
                          </Grid>
                          <Grid item lg={2.4} md={2.4} sm={2.4} xs={2.4}>
                            <SoftBox className="other-vendor-prod-item-listing">
                              <SoftTypography className="product-vendor-look-up">Selling price</SoftTypography>
                              <SoftTypography fontSize="12px">{ele?.sellingPrice ?? 0}</SoftTypography>
                            </SoftBox>
                          </Grid>
                          <Grid item lg={2.8} md={2.8} sm={2.8} xs={2.8}>
                            <SoftBox className="other-vendor-prod-item-listing">
                              <SoftTypography className="product-vendor-look-up">Purchase price</SoftTypography>
                              <SoftTypography fontSize="12px">{ele?.purchasePrice ?? 0}</SoftTypography>
                            </SoftBox>
                          </Grid>
                          <Grid item lg={2.4} md={2.4} sm={2.4} xs={2.4}>
                            <SoftBox className="other-vendor-prod-item-listing">
                              <SoftTypography className="product-vendor-look-up">GST</SoftTypography>
                              <SoftTypography fontSize="12px">{ele?.igst ?? 0}</SoftTypography>
                            </SoftBox>
                          </Grid>
                          <Grid item lg={2.4} md={2.4} sm={2.4} xs={2.4}>
                            <SoftBox className="other-vendor-prod-item-listing">
                              <SoftTypography className="product-vendor-look-up">CESS</SoftTypography>
                              <SoftTypography fontSize="12px">{ele?.cess ?? 0}</SoftTypography>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </SoftBox>
                    </SoftBox>
                    <Divider sx={{ margin: '5px !important' }} />
                  </SoftBox>
                );
              })}
            </SoftBox>
          )}
        </SoftBox>
      </Box>
    </Modal>
  );
};

export default SalesReturnProductLookup;
