import './all-orders.css';
import { AllOrdersFilter } from './components/Filter/AllOrdersFilter';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { getAllOrdersList, getAllOrdersListV2 } from '../../../../config/Services';
import {
  getAllOrdersPage,
  getAllOrdersSearchValue,
  setAllOrdersPage,
  setAllOrdersSearchValue,
} from '../../../../datamanagement/Filters/allOrdersSlice';
import { useDebounce } from 'usehooks-ts';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import CommonSearchBar from '../../Common/MobileSearchBar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Divider from '@mui/material/Divider';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MobileCardAllOrders from './components/MobilAllOrdersCard';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import NoDataFound from '../../Common/No-Data-Found';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import Spinner from 'components/Spinner/index';
import Status from '../../Common/Status';

function Allorders({ mobileApp }) {
  //material ui media query
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();

  const columns = [
    {
      field: 'orderId',
      headerName: 'Order Number',
      minWidth: 120,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'invoiceId',
      headerName: 'Invoice Id',
      minWidth: 120,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'fulfilmentStatus',
      headerName: 'Fulfillment Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
      renderCell: (params) => {
        return (
          <>
            {/* {params?.row?.fulfilmentStatus === 'DELIVERED' ? (
                  <div className='sales-order-fulfill-common sales-order-delivered'>
                    {params?.row?.fulfilmentStatus}
                  </div>
                ) : (
                  <div className='sales-order-fulfill-common sales-order-completed' >
                    {params?.row?.fulfilmentStatus}
                  </div>
                )} */}
            <Status label={params?.row?.fulfilmentStatus} />
          </>
        );
      },
    },
    {
      field: 'createdDate',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 0.75,
    },
    {
      field: 'channel',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'totalItems',
      headerName: 'Items',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 40,
      flex: 0.75,
    },
    {
      field: 'grandTotal',
      headerName: 'Total Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      // field: 'paymentStatus',
      // headerName: 'Payment Status',
      field: 'orderStatus',
      headerName: 'Order Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
      renderCell: (cellValues) => {
        return (
          <>
            <Status label={cellValues.value} />
          </>
        );
      },
    },
  ];

  const [errorComing, setErrorComing] = useState(false);
  const [currLocation, setCurrLocation] = useState('');
  const location = useLocation();

  // persist values from redux
  const persistedPage = useSelector(getAllOrdersPage);
  const persistedSearchValue = useSelector(getAllOrdersSearchValue);
  const dispatch = useDispatch();

  const [tabs, setTabs] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: persistedPage,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const [dataRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tempTitle, setTempTitle] = useState(persistedSearchValue || '');
  const [orderType, setOrderType] = useState(mobileApp ? 'B2C_ORDER' : localStorage.getItem('Order_Type') || '');
  // <--- filter states to handle clear
  const [onClear, setOnClear] = useState(false);
  // --->

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToDetailsPage = (orderId) => {
    navigate(`/order/details/${orderId}`);
  };
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const newOrderType = localStorage.getItem('Order_Type');
  const [isApplied, setIsApplied] = useState(false);
  const [isInputCleared, setIsInputCleared] = useState(false);
  const [isFilterCleared, setIsFilterCleared] = useState(false);

  const filterObject = {
    locationId: locId,
    // searchBox: tempTitle,
    page: pageState.page,
    pageSize: pageState.pageSize,
    // "sourceType": [
    //   "string"
    // ],
  };

  const debouncedTempTitle = useDebounce(tempTitle, 300); // Adjust the delay as needed

  let dataArr,
    dataRow = [];
  useEffect(() => {
    if (debouncedTempTitle) {
      searchOrderList();
    } else {
      if (isFilterCleared) {
        setIsFilterCleared(false);
        return;
      }
      if (isInputCleared) {
        setIsInputCleared(false);
        allOrderList();
        return;
      }
      // allOrderList();
      if (isApplied === false) {
        allOrderList();
      }
    }
  }, [
    debouncedTempTitle,
    pageState.page,
    pageState.pageSize,
    // orderType
  ]);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      const isClearFilter = true;
      allOrderList(isClearFilter);
      setOnClear(false);
      setIsFilterCleared(true);
    }
  }, [onClear]);

  let retryCount = 0;
  const allOrderList = (isAppliedFilterOrClear) => {
    setLoader(true);
    setErrorComing(false);
    // setPageState((old) => ({ ...old, loader: true }));
    if (isAppliedFilterOrClear === true) {
      setPageState((old) => ({ ...old, loader: true, page: 0 }));
      filterObject.page = 0;
      dispatch(setAllOrdersPage(0));
      // handleClearSearchInput();
    } else {
      setPageState((old) => ({ ...old, loader: true }));
    }
    getAllOrdersList(filterObject)
      .then(function (response) {
        if (response.data.data.code === 'ECONNRESET') {
          if (retryCount < 3) {
            allOrderList();
            retryCount++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows: [] }));
            setLoader(false);
          }
        } else {
          if (response?.data?.data?.orderResponseList.length > 0) {
            dataArr = response?.data?.data;
            dataRow.push(
              dataArr?.orderResponseList?.map((row) => ({
                customerName:
                  row?.baseOrderResponse?.customerName !== null
                    ? row?.baseOrderResponse?.customerName
                      ? textFormatter(row?.baseOrderResponse?.customerName)
                      : '----'
                    : 'WALK-IN',
                salesChannel: row?.baseOrderResponse?.salesChannel ? row?.baseOrderResponse?.salesChannel : '----',
                orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '----',
                orderNumber: row.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
                // fulfilmentStatus: row?.baseOrderResponse?.fulfilmentStatus
                //   ? row?.baseOrderResponse?.fulfilmentStatus
                //   : '-----',
                orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '-----',
                fulfilmentStatus: row?.baseOrderResponse?.fulfilmentStatus
                  ? row?.baseOrderResponse?.fulfilmentStatus
                  : '-----',
                grandTotal: row?.orderBillingDetails?.grandTotal
                  ? row?.orderBillingDetails?.grandTotal +
                    ' (' +
                    (row?.orderBillingDetails?.paymentMethod ? row?.orderBillingDetails?.paymentMethod : 'NA') +
                    ')'
                  : '-----',
                orderId: row?.baseOrderResponse?.orderId ? row?.baseOrderResponse?.orderId : '-----',
                invoiceId: row?.baseOrderResponse?.orderId ? row?.baseOrderResponse?.invoiceId : '-----',
                totalItems: row?.baseOrderResponse?.numberOfLineItems
                  ? row?.baseOrderResponse?.numberOfLineItems
                  : '-----',
                channel: row?.baseOrderResponse?.salesChannel
                  ? textFormatter(row?.baseOrderResponse?.salesChannel)
                  : '-----',
                // orderId: row?.baseOrderResponse?.orderId
                //   ? row?.baseOrderResponse?.orderId + ' (' + row?.baseOrderResponse?.fulfilmentStatus + ' )'
                //   : '-----',
                createdDate: row?.baseOrderResponse?.createdAt
                  ? // convertUtcToAsiaKolkata(row?.baseOrderResponse?.createdAt)
                    dateFormatter(row?.baseOrderResponse?.createdAt)
                  : '-----',
              })),
            );
            setTableRows(dataRow[0]);
            setLoader(false);
            setTotalPage(dataArr.totalPages);
            setPageState((old) => ({
              ...old,
              loader: false,
              datRows: dataRow[0] || [],
              total: dataArr.totalResults || 0,
            }));
          } else {
            showSnackbar('No Orders Found', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows: [] }));
            setLoader(false);
            setErrorComing(true);
          }
        }
        setIsApplied(false);
      })
      .catch((err) => {
        showSnackbar('No Data Found', 'error');
        setLoader(false);
        setErrorComing(true);
      });
  };

  const searchOrderList = async () => {
    try {
      const payload = {
        destinationLocationId: [locId],
        searchBox: tempTitle,
        page: 0,
        pageSize: pageState.pageSize,
      };

      setLoader(true);
      setPageState((old) => ({ ...old, loader: true }));

      const response = await getAllOrdersListV2(payload);

      if (response?.data?.data?.code === 'ECONNRESET') {
        if (retryCount < 3) {
          allOrderList();
          retryCount++;
        } else {
          showSnackbar('Some Error Occured, Try after some time', 'error');
          setLoader(false);
        }
      } else {
        if (response?.data?.data?.orderResponseList?.length > 0) {
          dataArr = response?.data?.data;
          dataRow.push(
            dataArr?.orderResponseList?.map((row) => ({
              customerName:
                row?.baseOrderResponse?.customerName !== null
                  ? row?.baseOrderResponse?.customerName
                    ? textFormatter(row?.baseOrderResponse?.customerName)
                    : '----'
                  : 'WALK-IN',
              salesChannel: row?.baseOrderResponse?.salesChannel ? row?.baseOrderResponse?.salesChannel : '----',
              channel: row?.baseOrderResponse?.salesChannel
                ? textFormatter(row?.baseOrderResponse?.salesChannel)
                : '-----',
              totalItems: row?.baseOrderResponse?.numberOfLineItems ? row?.baseOrderResponse?.numberOfLineItems : 'NA',
              orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '----',
              orderNumber: row?.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
              fulfilmentStatus: row?.baseOrderResponse?.fulfilmentStatus
                ? row?.baseOrderResponse?.fulfilmentStatus
                : '-----',
              orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '-----',
              grandTotal: row?.orderBillingDetails?.grandTotal
                ? row?.orderBillingDetails?.grandTotal +
                  ' (' +
                  (row?.orderBillingDetails?.paymentMethod ? row?.orderBillingDetails?.paymentMethod : 'NA') +
                  ')'
                : '-----',
              orderId: row?.baseOrderResponse?.orderId
                ? row?.baseOrderResponse?.orderId + ' (' + row?.baseOrderResponse?.fulfilmentStatus + ' )'
                : '-----',
              invoiceId: row?.baseOrderResponse?.orderId ? row?.baseOrderResponse?.invoiceId : '-----',
              createdDate: row?.baseOrderResponse?.createdAt
                ? // ? convertUtcToAsiaKolkata(row?.baseOrderResponse?.createdAt)
                  dateFormatter(row?.baseOrderResponse?.createdAt)
                : '-----',
            })),
          );
          setTableRows(dataRow[0]);
          setLoader(false);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRow[0] || [],
            total: dataArr.totalResults || 0,
          }));
        } else {
          showSnackbar('No Orders Found', 'error');
          setLoader(false);
          setPageState((old) => ({ ...old, loader: false, datRows: [] }));
          setErrorComing(true);
        }
      }
    } catch (err) {
      showSnackbar('No Data Found', 'error');
      setLoader(false);
      setErrorComing(true);
    }
    // const payload = {
    //   destinationLocationId: [locId],
    //   searchBox: tempTitle,
    //   page: pageState.page - 1,
    //   pageSize: pageState.pageSize,
    // };

    // setLoader(true);
    // setPageState((old) => ({ ...old, loader: true }));
    // getAllOrdersListV2(payload)
    //   .then(function (response) {
    //     if (response?.data?.data?.code === 'ECONNRESET') {
    // if (retryCount < 3) {
    //   allOrderList();
    //   retryCount++;
    // } else {
    //   showSnackbar('Some Error Occured, Try after some time', 'error');
    //   setLoader(false);
    // }
    //     } else {
    //       if (response?.data?.data?.orderResponseList?.length > 0) {
    //         showSnackbar('Success Order List', 'success');
    //         dataArr = response.data.data;
    //         dataRow.push(
    //           dataArr?.orderResponseList?.map((row) => ({
    //             customerName:
    //               row?.baseOrderResponse?.customerName !== null
    //                 ? row?.baseOrderResponse?.customerName
    //                   ? textFormatter(row?.baseOrderResponse?.customerName)
    //                   : '----'
    //                 : 'WALK-IN',
    //             salesChannel: row?.baseOrderResponse?.salesChannel ? row?.baseOrderResponse?.salesChannel : '----',
    //             orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '----',
    //             orderNumber: row.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
    //             fulfilmentStatus: row?.baseOrderResponse?.fulfilmentStatus
    //               ? row?.baseOrderResponse?.fulfilmentStatus
    //               : '-----',
    //             orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '-----',
    //             grandTotal: row?.orderBillingDetails?.grandTotal
    //               ? row?.orderBillingDetails?.grandTotal +
    //                 ' (' +
    //                 (row?.orderBillingDetails?.paymentMethod ? row?.orderBillingDetails?.paymentMethod : 'NA') +
    //                 ')'
    //               : '-----',
    //             orderId: row?.baseOrderResponse?.orderId
    //               ? row?.baseOrderResponse?.orderId + ' (' + row?.baseOrderResponse?.fulfilmentStatus + ' )'
    //               : '-----',
    //             createdDate: row?.baseOrderResponse?.createdAt
    //               ? convertUtcToAsiaKolkata(row?.baseOrderResponse?.createdAt)
    //               : '-----',
    //           })),
    //         );
    //         setTableRows(dataRow[0]);
    //         setLoader(false);
    //         setPageState((old) => ({
    //           ...old,
    //           loader: false,
    //           datRows: dataRow[0] || [],
    //           total: dataArr.totalResults || 0,
    //         }));
    //       } else {
    //         showSnackbar('No Orders Found', 'error');
    //         setLoader(false);
    //         setPageState((old) => ({ ...old, loader: false, datRows: [] }));
    //         setErrorComing(true);
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     showSnackbar('No Data Found', 'error');
    //     setLoader(false);
    //     setErrorComing(true);
    //   });
  };

  const handleSearchFliter = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setTempTitle('');
      dispatch(setAllOrdersSearchValue(''));
      setOnClear(true);
    } else {
      setTempTitle(e.target.value);
      dispatch(setAllOrdersSearchValue(e.target.value));
    }
  };

  // clear sales order search input fn
  const handleClearSearchInput = () => {
    setTempTitle('');
    dispatch(setAllOrdersSearchValue(''));
    setPageState((old) => ({ ...old, loader: true, page: 0 }));
    filterObject.page = 0;
    delete filterObject.searchBox;
    dispatch(setAllOrdersPage(0));
    setIsInputCleared(true);
  };

  const handleNew = () => {
    setLoader(true);
    navigate('/sales/all-orders/new');
  };

  //responsiveness
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState();

  const fetchMoreData = () => {
    const filterObjectFetchMoreData = {
      ...filterObject,
      page: infinitePageNo,
      // names: searchProductName,
    };
    if (orderType !== '') {
      if (mobileApp) {
        filterObjectFetchMoreData.orderType = 'B2C_ORDER';
      } else if (orderType) {
        filterObjectFetchMoreData.orderType = orderType;
      } else {
        filterObjectFetchMoreData.orderType = localStorage.getItem('Order_Type') || '';
      }
    }
    getAllOrdersList(filterObjectFetchMoreData)
      .then(function (response) {
        if (response.data.data.code === 'ECONNRESET') {
          if (retryCount < 3) {
            fetchMoreData();
            retryCount++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setInfiniteLoader(false);
          }
        } else {
          if (response?.data?.data?.orderResponseList?.length > 0) {
            dataArr = response?.data?.data;
            dataRow.push(
              dataArr?.orderResponseList?.map((row) => ({
                customerName:
                  row?.baseOrderResponse?.customerName !== null
                    ? row?.baseOrderResponse?.customerName
                      ? textFormatter(row?.baseOrderResponse?.customerName)
                      : '----'
                    : 'WALK-IN',
                salesChannel: row?.baseOrderResponse?.salesChannel ? row?.baseOrderResponse?.salesChannel : '----',
                orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '----',
                orderNumber: row.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
                // fulfilmentStatus: row?.baseOrderResponse?.fulfilmentStatus
                //   ? row?.baseOrderResponse?.fulfilmentStatus
                //   : '-----',
                orderStatus: row?.baseOrderResponse?.orderStatus ? row?.baseOrderResponse?.orderStatus : '-----',
                fulfilmentStatus: row?.baseOrderResponse?.fulfilmentStatus
                  ? row?.baseOrderResponse?.fulfilmentStatus
                  : '-----',
                grandTotal: row?.orderBillingDetails?.grandTotal
                  ? row?.orderBillingDetails?.grandTotal +
                    ' (' +
                    (row?.orderBillingDetails?.paymentMethod ? row?.orderBillingDetails?.paymentMethod : 'NA') +
                    ')'
                  : '-----',
                orderId: row?.baseOrderResponse?.orderId ? row?.baseOrderResponse?.orderId : '-----',
                totalItems: row?.baseOrderResponse?.numberOfLineItems
                  ? row?.baseOrderResponse?.numberOfLineItems
                  : '-----',
                channel: row?.baseOrderResponse?.salesChannel
                  ? textFormatter(row?.baseOrderResponse?.salesChannel)
                  : '-----',
                // orderId: row?.baseOrderResponse?.orderId
                //   ? row?.baseOrderResponse?.orderId + ' (' + row?.baseOrderResponse?.fulfilmentStatus + ' )'
                //   : '-----',
                createdDate: row?.baseOrderResponse?.createdAt
                  ? // convertUtcToAsiaKolkata(row?.baseOrderResponse?.createdAt)
                    dateFormatter(row?.baseOrderResponse?.createdAt)
                  : '-----',
              })),
            );
            setPageState((old) => ({
              ...old,
              datRows: [...old.datRows, ...dataRow[0]],
              total: dataArr.totalResults || 0,
            }));
            setInfiniteLoader(false);
          } else {
            showSnackbar('No Orders Found', 'error');
            setInfiniteLoader(false);
            setErrorComing(true);
          }
        }
      })
      .catch((err) => {
        showSnackbar('No Data Found', 'error');
        setLoader(false);
        setErrorComing(true);
      });
  };

  const handleScroll = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight &&
      infinitePageNo < totalPages
    ) {
      if (infinitePageNo === totalPages - 1) {
        setNoData(true);
      }
      setInfiniteLoader(true);
      setInfintiePageNo(infinitePageNo + 1);
      if (isMobileDevice) {
        fetchMoreData();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [infinitePageNo, totalPages]);

  return (
    <>
      <DashboardLayout>
        {!isMobileDevice && <DashboardNavbar />}
        {isMobileDevice && (
          <SoftBox className="new-search-header po-box-shadow">
            <MobileNavbar title={'All Orders'} />
            <CommonSearchBar
              searchFunction={handleSearchFliter}
              handleNewBtnFunction={handleNew}
              placeholder="Search Orders..."
            />
          </SoftBox>
        )}
        {!isMobileDevice ? (
          <SoftBox className="search-bar-filter-and-table-container">
            <SoftBox className="search-bar-filter-container">
              <Grid container spacing={2} className="filter-product-list-cont">
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder={mobileApp ? 'Search App Orders' : 'Search Sales Order'}
                      value={tempTitle}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchFliter}
                    />
                    {tempTitle !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                </Grid>

                <Grid item md={4} sm={4} xs={12} style={{ marginLeft: 'auto' }}>
                  <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                    {mobileApp ? (
                      <SoftButton onClick={() => navigate('/sales_channels/ods')}>ODS</SoftButton>
                    ) : (
                      <SoftButton onClick={handleNew} variant="solidWhiteBackground">
                        <AddIcon />
                        New
                      </SoftButton>
                    )}

                    <AllOrdersFilter
                      setTempTitle={setTempTitle}
                      filterObject={filterObject} //payload
                      mobileApp={mobileApp}
                      orderType={orderType}
                      newOrderType={newOrderType}
                      setOrderType={setOrderType}
                      setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                      // get filtered result fn
                      allOrderList={allOrderList}
                      setIsApplied={setIsApplied}
                    />
                  </SoftBox>
                </Grid>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleOpen2}>
                    <ListItemIcon>
                      <FileUploadIcon fontSize="small" />
                    </ListItemIcon>
                    Export
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <FileDownloadIcon fontSize="small" />
                    </ListItemIcon>
                    Import
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <SaveIcon fontSize="small" />
                    </ListItemIcon>
                    Saved
                  </MenuItem>
                </Menu>
              </Grid>
            </SoftBox>
            {loader ? (
              <Box
                sx={{
                  height: '70vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            ) : (
              <SoftBox
                style={{ height: 525, width: '100%' }}
                className="dat-grid-table-box"
                sx={{
                  '& .super-app.Approved': {
                    color: '#69e86d',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Reject': {
                    color: '#df5231',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Create': {
                    color: '#888dec',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Assign': {
                    color: 'purple',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Deliver': {
                    color: '#E384FF',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Inwarded': {
                    color: 'Blue',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Partially': {
                    color: 'Purple',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                }}
              >
                {errorComing && pageState.datRows.length === 0 ? (
                  <SoftBox className="No-data-text-box">
                    <SoftBox className="src-imgg-data">
                      <img className="src-dummy-img" src={noDatagif} />
                    </SoftBox>

                    <h3 className="no-data-text-I">NO DATA FOUND</h3>
                  </SoftBox>
                ) : (
                  <>
                    {pageState.loader && (
                      <Box
                        sx={{
                          height: '70vh',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Spinner />
                      </Box>
                    )}
                    {!pageState.loader && (
                      <DataGrid
                        sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                        columns={columns}
                        rows={pageState.datRows}
                        getRowId={(row) => row?.orderNumber}
                        rowCount={parseInt(pageState?.total)}
                        loading={pageState.loader}
                        pagination
                        page={tempTitle ? 0 : pageState.page}
                        pageSize={pageState.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setPageState((old) => ({ ...old, page: newPage }));
                          dispatch(setAllOrdersPage(newPage));
                        }}
                        onPageSizeChange={(newPageSize) => {
                          setPageState((old) => ({ ...old, pageSize: newPageSize }));
                        }}
                        onCellClick={(rows) => navigateToDetailsPage(rows.row['orderNumber'])}
                        disableSelectionOnClick
                      />
                    )}
                  </>
                )}
              </SoftBox>
            )}
          </SoftBox>
        ) : (
          <SoftBox>
            {pageState.loader ? (
              <SoftBox className="circularProgess-main-div">
                <CircularProgress className="circular-loader-common" />
              </SoftBox>
            ) : (
              <SoftBox sx={{ paddingBottom: '10px' }}>
                {pageState.datRows.length > 0 ? (
                  pageState.datRows.map((item) => (
                    <MobileCardAllOrders product={item} navigateToDetailsPage={navigateToDetailsPage} />
                  ))
                ) : (
                  <NoDataFound message={'No Orders Found'} />
                )}
                <Box
                  className="infinite-loader"
                  sx={{
                    visibility: infiniteLoader ? 'visible' : 'hidden',
                    display: noData ? 'none' : 'flex',
                  }}
                >
                  <CircularProgress size={30} color="info" />
                </Box>
              </SoftBox>
            )}
          </SoftBox>
        )}
      </DashboardLayout>
    </>
  );
}

export default Allorders;
