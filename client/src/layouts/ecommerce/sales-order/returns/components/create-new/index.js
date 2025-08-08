import './style.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Box, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { buttonStyles } from '../../../../Common/buttonColor';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SalesBillingDetailRow from '../../../new-sales/components/create-sales/components/billingDetail';
import SalesReturnProductLookup from './returnLookup';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import dayjs from 'dayjs';
import getCustomerList, {
  createReturnSalesOrder,
  getsalesorderdetailsvalue,
  salesCustomerProduct,
  salesOrderRetunBilling,
} from '../../../../../../config/Services';

const SalesOrderCreateReturn = () => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const { id } = useParams();
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [orderID, setOrderID] = useState(id ? id : '');
  const [rowData, setRowData] = useState([
    {
      itemId: uuidv4(),
      orderId: '',
      orderItemId: '',
      gtin: '',
      productName: '',
      mrp: '',
      sellingPrice: '',
      quantityReturned: 0,
      quantity: 0,
      igst: 0,
      cess: 0,
      returnedSubTotal: '',
    },
  ]);
  const [productSelected, setProductSelected] = useState([]);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const [currIndex, setCurrIndex] = useState(0);
  const debounceProductName = useDebounce(curentProductName, 700);
  const [allData, setAllData] = useState({});
  const [returnMode, setReturnMode] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [billChange, setBillChange] = useState('');
  const debounceBill = useDebounce(billChange, 300);
  const [billData, setBilllingData] = useState({});
  const [customerOptions, setCutomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [openLookupModal, setOpenLookupModal] = useState(false);
  const [isCreateAPIResponse, setIsCreateAPIResponse] = useState(false);

  useEffect(() => {
    if (id && id !== '') {
      handleVerify();
      setOrderID(id);
    }
  }, [id]);

  useEffect(() => {
    customerList();
  }, []);

  useEffect(() => {
    if (debounceBill !== '') {
      billingCalculation();
      setBillChange('');
    }
  }, [debounceBill]);

  const billingItems = [
    { label: 'Discount corrections', value: billData?.discountCorrections || 0 || 0 },
    { label: 'Pickup charges', value: billData?.pickupCharges || 0 || 0 },
    { label: 'Total taxable value', value: billData?.subTotal || 0 || 0 },
    { label: 'IGST', value: billData?.igst || 0 },
    { label: 'CGST', value: billData?.cgst || 0 },
    { label: 'SGST', value: billData?.sgst || 0 },
    { label: 'Expected Total', value: billData?.grandTotal || 0, isBold: true },
  ].filter(Boolean);

  const customerList = () => {
    const payload = {
      pageNumber: 0,
      pageSize: 50,
      partnerId: orgId,
      partnerType: contextType === 'WMS' ? 'WAREHOUSE' : contextType,
    };
    getCustomerList(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.retails;
        let assuser,
          assRow = [];
        assuser = response;
        assRow.push(
          assuser
            ?.map((row) => ({
              value: row?.retailId,
              label: row?.displayName,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        );
        setCutomerOptions(assRow[0]);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some errr occured', 'error');
      });
  };

  const handleCustomerSelect = (option) => {
    if (option.value === selectedCustomer?.value) {
      return;
    }
    setSelectedCustomer(option);
  };

  const handleVerify = () => {
    setVerifyLoader(true);
    getsalesorderdetailsvalue(orderID)
      .then((res) => {
        setVerifyLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        setAllData(res?.data?.data);
        setSelectedCustomer({
          value: res?.data?.data?.baseOrderResponse?.customerId,
          label: res?.data?.data?.baseOrderResponse?.customerName,
        });
        const response = res?.data?.data?.baseOrderResponse?.orderItemList;
        if (response?.length > 0) {
          const updatedRowData = response?.map((row, index) => {
            return {
              orderId: row?.orderId,
              orderItemId: row?.orderItemId,
              gtin: row?.gtin,
              productName: row?.productName,
              mrp: row?.mrp,
              sellingPrice: row?.sellingPrice,
              quantity: row?.quantity,
              igst: row?.igst,
              cess: row?.cess,
              batchNo: row?.batchNo,
              returnedSubTotal: '',
              quantityReturned: '',
            };
          });
          setRowData(updatedRowData);
        }
      })
      .catch((err) => {
        setVerifyLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleMasterCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAllChecked(isChecked);
    if (isChecked) {
      setSelectedRows(rowData?.map((row, index) => row?.orderItemId));
    } else {
      setSelectedRows([]);
    }
    setBillChange(uuidv4());
  };

  const handleRowCheckboxChange = (id) => {
    if (selectedRows?.includes(id)) {
      setSelectedRows(selectedRows?.filter((item) => item !== id));
      setSelectAllChecked(false);
    } else {
      // Row not selected, select it
      setSelectedRows([...selectedRows, id]);
      if (selectedRows?.length + 1 === rowData?.length) {
        setSelectAllChecked(true);
      }
    }
    setBillChange(uuidv4());
  };

  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        if (searchText.length >= 3) {
          salesCustomerProduct(selectedCustomer?.value, locId, searchText)
            .then((res) => {
              if (res?.data?.status === 'SUCCESS') {
                const response = res?.data?.data?.orderItemList;
                if (response?.length === 1) {
                  selectProduct(response[0], currIndex);
                } else if (response?.length > 1) {
                  setAutocompleteBarcodeOptions(response);
                } else {
                  showSnackbar(`No products found for ${searchText}`, 'error');
                }
              }
              setProductSelected((prevState) => {
                const newState = [...prevState];
                newState[currIndex] = true;
                return newState;
              });
            })
            .catch((err) => {
              showSnackbar(err?.response?.data?.message, 'error');
            });
        }
      };
      searchProduct();
    }
  }, [debounceProductName]);

  const handleChangeIO = (e, index) => {
    setCurentProductName(e.target.value);
    setCurrIndex(index);
  };

  const selectProduct = (item, index) => {
    if (item === null) {
      setProductSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });
      const updatedRow = [...rowData];
      updatedRow[index]['orderId'] = '';
      updatedRow[index]['orderItemId'] = '';
      updatedRow[index]['gtin'] = '';
      updatedRow[index]['productName'] = '';
      updatedRow[index]['mrp'] = '';
      updatedRow[index]['sellingPrice'] = '';
      updatedRow[index]['quantityReturned'] = 0;
      updatedRow[index]['quantity'] = 0;
      updatedRow[index]['igst'] = 0;
      updatedRow[index]['cess'] = 0;
      setRowData(updatedRow);
      return;
    }
    setCurentProductName('');
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);

    if (item?.gtin !== undefined && item?.gtin !== '') {
      const updatedRow = [...rowData];
      if (rowData?.find((ele) => ele?.itemCode === item?.gtin)) {
        showSnackbar('Product is already added', 'error');
        return;
      }
      updatedRow[index]['orderId'] = item?.orderId;
      updatedRow[index]['orderItemId'] = item?.orderItemId;
      updatedRow[index]['gtin'] = item?.gtin;
      updatedRow[index]['productName'] = item?.productName;
      updatedRow[index]['mrp'] = item?.mrp ?? 0;
      updatedRow[index]['sellingPrice'] = item?.sellingPrice ?? 0;
      updatedRow[index]['quantity'] = item?.quantity ?? 0;
      updatedRow[index]['igst'] = item?.igst ?? 0;
      updatedRow[index]['cess'] = item?.cess ?? 0;
      setRowData(updatedRow);
    } else {
      setProductSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });
      const updatedRow = [...rowData];
      updatedRow[index]['orderId'] = '';
      updatedRow[index]['orderItemId'] = '';
      updatedRow[index]['gtin'] = '';
      updatedRow[index]['productName'] = '';
      updatedRow[index]['mrp'] = '';
      updatedRow[index]['sellingPrice'] = '';
      updatedRow[index]['quantityReturned'] = 0;
      updatedRow[index]['quantity'] = 0;
      updatedRow[index]['igst'] = 0;
      updatedRow[index]['cess'] = 0;
      setRowData(updatedRow);
    }
  };
  const handleInputChange = (value, fieldName, index) => {
    const updateData = [...rowData];
    updateData[index][fieldName] = value;
    setRowData(updateData);

    setBillChange(uuidv4());
  };

  const handleAddmore = () => {
    if (!selectedCustomer) {
      showSnackbar('Please select a customer', 'error');
      return;
    }
    const newRowData = [
      ...rowData,
      {
        itemId: uuidv4(),
        orderId: '',
        orderItemId: '',
        gtin: '',
        productName: '',
        mrp: '',
        sellingPrice: '',
        quantityReturned: 0,
        quantity: 0,
        igst: 0,
        cess: 0,
        returnedSubTotal: '',
      },
    ];
    setRowData(newRowData);
  };

  const handleItemDelete = (index) => {
    const updatedRowData = [...rowData];
    updatedRowData.splice(index, 1);
    setRowData(updatedRowData);
    return;
  };

  const billingCalculation = () => {
    if (rowData?.length === 0) {
      return;
    }
    // const returnData = rowData?.filter((item) => selectedRows?.includes(item?.orderItemId));
    const itemListArray = rowData
      ?.map((item) => {
        const itemList = {
          orderId: item?.orderId,
          orderItemId: item?.orderItemId,
          gtin: item?.gtin,
          updatedBy: userName,
          productName: item?.productName,
          mrp: item?.mrp || 0,
          sellingPrice: item?.sellingPrice || 0,
          qtyReturned: item?.quantityReturned,
          batchId: item?.batchNo,
          returnType: 'string',
          loggedInUserId: uidx,
          sessionId: 'string',
        };
        return itemList;
      })
      .filter((item) => item.qtyReturned && item.qtyReturned !== '' && item.qtyReturned !== 0);
    const payload = {
      // orderId: orderID,
      locationId: locId,
      updatedBy: userName,
      loggedInUserId: uidx,
      sessionId: 'string',
      licenseId: 'string',
      returnMode: returnMode,
      returnPaymentMethod: 'string',
      returnItems: itemListArray,
    };
    salesOrderRetunBilling(payload)
      .then((res) => {
        setIsCreateAPIResponse(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.orderResponseModel;
        if (response?.returnItems?.length > 0) {
          const returnItemsMap = response?.returnItems?.reduce((map, item) => {
            map[item.orderItemId] = item;
            return map;
          }, {});

          const updatedRowData = rowData.map((row) => {
            if (row?.quantityReturned && row?.quantityReturned !== '') {
              const matchingReturnItem = returnItemsMap[row?.orderItemId];
              if (matchingReturnItem) {
                return {
                  ...row,
                  returnedSubTotal: matchingReturnItem.returnedSubTotal,
                };
              }
            }

            return row;
          });
          setRowData(updatedRowData);
        }

        setBilllingData(response?.returnBillingDetails);
      })
      .catch((err) => {
        showSnackbar(err?.data?.response?.message, 'error');
        setIsCreateAPIResponse(false);
      });
  };
  const handleSaveBtn = () => {
    if (!selectedCustomer || rowData?.length === 0) {
      showSnackbar('Select customers', 'error');
      return;
    }
    // else if (selectedRows?.length === 0) {
    //   showSnackbar('Select products to return', 'error');
    //   return;
    // }
    const returnData = rowData?.filter((item) => selectedRows?.includes(item?.orderItemId));
    if (rowData?.length > 0) {
      const itemListArray = rowData
        ?.map((item) => {
          const itemList = {
            orderId: item?.orderId,
            orderItemId: item?.orderItemId,
            gtin: item?.gtin,
            updatedBy: userName,
            productName: item?.productName,
            mrp: item?.mrp || 0,
            sellingPrice: item?.sellingPrice || 0,
            qtyReturned: item?.quantityReturned,
            batchId: item?.batchNo || null,
            returnType: 'RETURN',
            loggedInUserId: uidx,
            sessionId: 'string',
            sellingUnit: 'string',
          };
          return itemList;
        })
        .filter((item) => item.qtyReturned && item.qtyReturned !== '' && item.qtyReturned !== 0);
      const payload = {
        customerId: selectedCustomer?.value,
        // orderId: orderID,
        locationId: locId,
        updatedBy: userName,
        loggedInUserId: uidx,
        sessionId: 'NA',
        licenseId: 'NA',
        returnMode: returnMode,
        returnPaymentMethod: '',
        returnItemRequests: itemListArray,
      };
      setSaveLoader(true);
      createReturnSalesOrder(payload)
        .then((res) => {
          setSaveLoader(false);
          if (res?.data?.status === 'ERROR') {
            showSnackbar(res?.data?.message, 'error');
            return;
          }
          if (res?.data?.data?.es > 0) {
            showSnackbar(res?.data?.data?.message, 'error');
            return;
          }
          showSnackbar(res?.data?.data.message, 'success');
          navigate('/sales/returns');
        })
        .catch((err) => {
          setSaveLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handleCustProduct = () => {
    setOpenLookupModal((previousOpen2) => !previousOpen2);
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <Box
        sx={{
          height: isMobileDevice ? 'calc(100dvh - 24px)' : '100%',
          width: '100%',
          display: isMobileDevice && 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box mt={!isMobileDevice && 2} pb={isMobileDevice ? 0.5 : 3} sx={{ width: '100%' }}>
          {!isMobileDevice && (
            <SoftBox p={3} display="flex" justifyContent="space-between" alignItems="center">
              <SoftTypography fontSize="24px" fontWeight="bold">
                New return
              </SoftTypography>
            </SoftBox>
          )}
          <SoftBox
            className={`${isMobileDevice ? 'create-pi-card-mobile po-box-shadow sales-main-div' : 'create-pi-card'}`}
            p={3}
            md={3}
          >
            {isMobileDevice && (
              <SoftBox className="create-pi-header">
                <SoftBox sx={{ width: '100%', padding: '10px 15px 10px 15px' }}>
                  <MobileNavbar title={'New Return'} prevLink={true} />
                </SoftBox>
              </SoftBox>
            )}
            <Box display="flex" width="100%" justifyContent="flex-end">
              <Grid container spacing={3} mt={-2}>
                <Grid item xs={12} md={12} xl={12}>
                  <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                    <SoftTypography fontSize="15px" fontWeight="bold" sx={{ marginLeft: '10px' }}>
                      {isMobileDevice && (
                        <Typography fontSize="12px" sx={{ color: 'green' }}>
                          Sales order details
                          <CheckCircleIcon
                            sx={{
                              color: 'green !important',
                              height: 15,
                              width: 15,
                              marginTop: '-2px',
                              marginLeft: '5px',
                            }}
                          />
                        </Typography>
                      )}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              </Grid>
            </Box>
            <div style={{ padding: isMobileDevice ? '10px' : '0px' }}>
              <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={3.5} xl={3.5}>
                  <SoftTypography fontWeight="bold" fontSize="13px" sx={{}}>
                    Select customer <span style={{ color: 'red' }}>*</span>
                  </SoftTypography>
                  <SoftSelect
                    placeholder="Select"
                    value={customerOptions?.find((ele) => ele?.value === selectedCustomer?.value) || ''}
                    onChange={(option) => handleCustomerSelect(option)}
                    options={customerOptions}
                    isDisabled={id ? true : false}
                  />
                </Grid>
                {/* {id && (
                  <Grid item xs={12} md={4} xl={4}>
                    <SoftTypography fontWeight="bold" fontSize="13px" sx={{}}>
                      Sales order number
                    </SoftTypography>
                    <SoftBox
                      style={{ display: 'flex', gap: '5px', justifyContent: 'flex start', alignItems: 'center' }}
                    >
                      <SoftInput
                        placeholder="Ex: O987901234"
                        value={orderID}
                        onChange={(e) => setOrderID(e.target.value)}
                      />
                      <SoftButton
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                        onClick={handleVerify}
                        disabled={orderID === '' || verifyLoader || returnId !== '' ? true : false}
                        style={{ marginLeft: '10px' }}
                      >
                        {verifyLoader ? <CircularProgress size={20} color="info" /> : <>Validate</>}
                      </SoftButton> *
                    </SoftBox>
                  </Grid>
                )} */}
              </Grid>

              <Grid container spacing={3} mt={1}>
                {id && (
                  <>
                    <Grid item xs={12} sm={2.4} md={2.4} xl={2.4}>
                      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <SoftTypography fontWeight="bold" fontSize="13px">
                          Sales order number
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput placeholder="Ex: O987901234" value={orderID} readOnly />
                    </Grid>
                    <Grid item xs={12} sm={2.4} md={2.4} xl={2.4}>
                      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <SoftTypography fontWeight="bold" fontSize="13px">
                          Sales order value
                        </SoftTypography>
                      </SoftBox>
                      <SoftInput type="number" readOnly value={allData?.orderBillingDetails?.grandTotal} />
                    </Grid>
                    <Grid item xs={12} sm={2.4} md={2.4} xl={2.4}>
                      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <SoftTypography fontWeight="bold" fontSize="13px">
                          Sales order date
                        </SoftTypography>
                      </SoftBox>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          {...(allData?.baseOrderResponse?.createdAt && {
                            value: dayjs(allData?.baseOrderResponse?.createdAt),
                          })}
                          disablePast
                          views={['year', 'month', 'day']}
                          format="DD-MM-YYYY"
                          // onChange={(date) => setExpectedDate(format(date.$d, 'yyyy-MM-dd'))}
                          sx={{ width: '100% !important' }}
                          className="date-picker-newpi-ui"
                        />
                      </LocalizationProvider>
                    </Grid>
                  </>
                )}
                {/* <Grid item xs={12} sm={2.4} md={2.4} xl={2.4}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Return shipment
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect />
                </Grid> */}
                <Grid item xs={12} sm={2.4} md={2.4} xl={2.4}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Return mode
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    onChange={(e) => setReturnMode(e.value)}
                    options={[
                      { value: 'Credit note', label: 'Credit note' },
                      { value: 'Material replacement', label: 'Material replacement' },
                      { value: 'Money transfer', label: 'Money transfer' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={2.4} md={2.4} xl={2.4}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Return shipment date
                    </SoftTypography>
                  </SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...(allData?.baseOrderResponse?.createdAt && {
                        value: dayjs(allData?.baseOrderResponse?.createdAt),
                      })}
                      disablePast
                      views={['year', 'month', 'day']}
                      format="DD-MM-YYYY"
                      // onChange={(date) => setExpectedDate(format(date.$d, 'yyyy-MM-dd'))}
                      sx={{ width: '100% !important' }}
                      className="date-picker-newpi-ui"
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </div>
          </SoftBox>
          {!isMobileDevice && (
            <SoftBox
              className={`${isMobileDevice ? 'create-pi-card-mobile po-box-shadow sales-main-div' : 'create-pi-card'}`}
              p={3}
              md={3}
            >
              <div>
                <SoftBox display="flex" gap="30px" justifyContent={selectedCustomer ? 'space-between' : 'flex-start'}>
                  <SoftTypography variant="h6">
                    Add products to your return {rowData?.length > 1 && `(Total Items: ${rowData?.length})`}{' '}
                  </SoftTypography>

                  {selectedCustomer && (
                    <SoftButton
                      style={{ marginTop: '-10px' }}
                      variant={buttonStyles.secondaryVariant}
                      className="outlined-softbutton"
                      onClick={handleCustProduct}
                    >
                      Product Lookup
                    </SoftButton>
                  )}
                  {openLookupModal && (
                    <SalesReturnProductLookup
                      handleCustProduct={handleCustProduct}
                      selectedCustomer={selectedCustomer}
                      rowData={rowData}
                      setRowData={setRowData}
                      setBillChange={setBillChange}
                      isCreateAPIResponse={isCreateAPIResponse}
                      setIsCreateAPIResponse={setIsCreateAPIResponse}
                    />
                  )}
                </SoftBox>
                <table style={{ border: 'none' }}>
                  <thead>
                    <tr className="return-table-head">
                      {/* {rowData?.length > 0 && (
                        <td className="return-table-head-check">
                          <input type="checkbox" checked={selectAllChecked} onChange={handleMasterCheckboxChange} />
                        </td>
                      )} */}
                      <td className="return-table-head-num">S.No</td>
                      <td className="return-table-head-product">Barcode</td>
                      <td className="return-table-head-product">Title</td>
                      <td className="return-table-head-uom">MRP</td>
                      <td className="return-table-head-uom">Rate</td>
                      <td className="return-table-head-big">Qty Ordered</td>
                      <td className="return-table-head-uom">Quanity</td>
                      <td className="return-table-head-uom">GST</td>
                      <td className="return-table-head-uom">Cess</td>
                      <td className="return-table-head-uom">Amount</td>
                      <td className="return-table-head-uom">Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.length > 0 &&
                      rowData?.map((row, index) => {
                        const isBarcodeSelected = productSelected[index];
                        return (
                          <tr className="return-table-body">
                            {/* <td className="return-table-head-check">
                              <input
                                type="checkbox"
                                checked={selectedRows?.includes(row?.orderItemId)}
                                onChange={() => handleRowCheckboxChange(row?.orderItemId)}
                              />
                            </td> */}
                            <td className="return-table-head-num">
                              <SoftInput className="product-aligning" readOnly value={index + 1} />
                            </td>
                            <td className="return-table-head-product">
                              {/* <SoftInput className="product-aligning" readOnly value={row?.gtin} /> */}
                              <SoftBox className="product-input-label" style={{ width: '100%' }}>
                                {isBarcodeSelected === false ? (
                                  <TextField
                                    value={row?.gtin}
                                    readOnly={true}
                                    style={{
                                      width: '100%',
                                    }}
                                    // onClick={() => {
                                    //   row?.gtin ? navigate(`/products/all-products/details/${row?.gtin}`) : null;
                                    // }}
                                  />
                                ) : row?.id !== '' && row?.gtin !== '' ? (
                                  <TextField
                                    value={row?.gtin}
                                    readOnly={true}
                                    style={{ width: '100%' }}
                                    // onClick={() => {
                                    //   row?.gtin ? navigate(`/products/all-products/details/${row?.gtin}`) : null;
                                    // }}
                                  />
                                ) : (
                                  <Autocomplete
                                    freeSolo
                                    disabled={selectedCustomer ? false : true}
                                    options={autocompleteBarcodeOptions}
                                    getOptionLabel={(option) => option.gtin}
                                    onChange={(e, newValue) => {
                                      selectProduct(newValue, index);
                                    }}
                                    onInputChange={(e, newInputValue) => {
                                      handleChangeIO({ target: { value: newInputValue } }, index);
                                    }}
                                    style={{
                                      width: '100%',
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        inputProps={{
                                          ...params.inputProps,
                                          onKeyDown: (e) => {
                                            if (e.key === 'Enter') {
                                              e.stopPropagation();
                                            }
                                          },
                                        }}
                                        type="number"
                                        style={{
                                          width: '100%',
                                        }}
                                      />
                                    )}
                                  />
                                )}
                              </SoftBox>
                            </td>
                            <td className="return-table-head-product">
                              <SoftInput className="product-aligning" disabled value={row?.productName} />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftInput className="product-aligning" disabled value={row?.mrp} />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftInput className="product-aligning" disabled value={row?.sellingPrice} />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftInput className="product-aligning" disabled value={row?.quantity} />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftInput
                                type="number"
                                className="product-aligning"
                                disabled={selectedCustomer ? false : true}
                                value={row?.quantityReturned}
                                onChange={(e) => handleInputChange(e.target.value, 'quantityReturned', index)}
                              />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftInput className="product-aligning" disabled value={row?.igst} />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftInput className="product-aligning" disabled value={row?.cess} />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftInput className="product-aligning" disabled value={row?.returnedSubTotal} />
                            </td>
                            <td className="return-table-head-uom">
                              <SoftBox
                                // mt={index === 0 ? '49px' : '10px'}
                                width="100%"
                                height="40px"
                                style={{
                                  cursor: 'pointer',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                // disabled={listDisplay ? true : false}
                              >
                                <CancelIcon onClick={() => handleItemDelete(index)} fontSize="small" color="error" />
                              </SoftBox>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {!selectedCustomer && (
                  <div>
                    <SoftTypography fontSize="12px" sx={{ color: 'red', marginTop: '10px' }}>
                      Select customer and add product ordered for the same
                    </SoftTypography>
                  </div>
                )}
                <SoftTypography
                  className="add-more-text"
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  onClick={handleAddmore}
                  // sx={{ marginLeft: '-10px', color: '#0562FB' }}
                >
                  + Add More
                </SoftTypography>
                {orderID !== '' && rowData?.length === 0 && (
                  <div>
                    <SoftTypography fontSize="12px" sx={{ color: 'red', marginTop: '10px' }}>
                      No products found !!
                    </SoftTypography>
                  </div>
                )}
              </div>
            </SoftBox>
          )}
          <SoftBox
            className={`${isMobileDevice ? 'create-pi-card-mobile po-box-shadow sales-main-div' : 'create-pi-card'}`}
            p={3}
            md={3}
          >
            <Grid container justifyContent="flex-end">
              <SalesBillingDetailRow billingItems={billingItems} />
            </Grid>
            {!isMobileDevice && (
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  width: isMobileDevice ? '100%' : '200px',
                  marginTop: '20px',
                  marginLeft: 'auto',
                  marginRight: '0',
                }}
              >
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={() => {
                    navigate('/sales/returns');
                  }}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleSaveBtn}
                  disabled={saveLoader ? true : false}
                >
                  {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
                </SoftButton>
              </div>
            )}
          </SoftBox>
        </Box>
        {isMobileDevice && (
          <SoftBox
            className="add-po-btns"
            sx={{ gap: '10px', marginRight: '0px !important', paddingBottom: '10px', alignItems: 'unset' }}
          >
            <SoftButton
              variant={buttonStyles.secondaryVariant}
              className="outlined-softbutton"
              onClick={() => {
                navigate('/sales/returns');
              }}
            >
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton vendor-add-btn"
              onClick={handleSaveBtn}
              disabled={saveLoader ? true : false}
            >
              {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
            </SoftButton>
          </SoftBox>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default SalesOrderCreateReturn;
