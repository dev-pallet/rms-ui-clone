import './index.css';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ClearSoftInput, convertUTCtoIST, isSmallScreen, noDatagif, textFormatter } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { OrderListFilter } from '../Filter/OrderFilter';
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
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import Spinner from 'components/Spinner/index';
import SalesOrderProductCard from './components/sales-card';
import CustomMobileButton from '../../Common/mobile-new-ui-components/button';
import NoDataFoundMob from '../../Common/mobile-new-ui-components/no-data-found';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';

function AllSalesorders({ mobileApp, mobileSearchedValue, setSearchValue, selectedSubFilters, isFilterApplied }) {
  //material ui media query
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const [showViewMore, setShowViewMore] = useState(true);

  const columns = [
    {
      field: 'createdDate',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 0.75,
    },
    {
      field: 'orderId',
      headerName: 'Order ID',
      minWidth: 120,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'invoiceId',
      headerName: 'Invoice ID',
      minWidth: 120,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
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
      minWidth: 60,
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
      field: 'grandTotal',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
      //   renderCell: (params) => {
      //     return (
      //       <>
      //         <Status label={params?.row?.paymentStatus} />
      //       </>
      //     );
      //   },
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
      //   renderCell: (cellValues) => {
      //     return (
      //       <>
      //         <Status label={cellValues.value} />
      //       </>
      //     );
      //   },
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
    pageSize: 8,
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
  const [selectedFilter, setSelectedFilter] = useState(localStorage.getItem('Order_Type') || '');

  const filters = [
    { name: 'All', value: '' },
    { name: 'Direct', value: 'SALES_ORDER' },
    { name: 'POS', value: 'POS_ORDER' },
    { name: 'mPOS', value: 'MPOS_ORDER' },
    { name: 'App', value: 'B2C_ORDER' },
  ];

  useEffect(() => {
    if (mobileSearchedValue) {
      handleSearchFliter(mobileSearchedValue);
    }
  }, [mobileSearchedValue]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter?.value);
    setPageState((old) => ({ ...old, loader: true, page: 0 }));
    filterObject.page = 0;
    dispatch(setAllOrdersPage(0));
    if (filter?.value === '') {
      delete filterObject.orderType;
      localStorage.removeItem('Order_Type');
    } else {
      filterObject.orderType = filter.value;
      localStorage.setItem('Order_Type', filter.value);
    }
    delete filterObject.searchBox;
    if (isMobileDevice) {
      fetchMoreData({ pageNo: 0, orderStatus: true });
      setSearchValue('');
    } else {
      allOrderList();
    }
    setTempTitle('');
    dispatch(setAllOrdersSearchValue(''));
  };

  const filterObject = {
    locationId: locId,
    page: pageState.page,
    pageSize: pageState.pageSize,
  };

  const debouncedTempTitle = useDebounce(tempTitle, 300);

  let dataArr,
    dataRow = [];
  useEffect(() => {
    if (!isMobileDevice) {
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
        if (isApplied === false) {
          allOrderList();
        }
      }
    }
  }, [
    debouncedTempTitle,
    pageState.page,
    pageState.pageSize,
    // orderType
  ]);

  useEffect(() => {
    if (isMobileDevice) {
      if (debouncedTempTitle) {
        searchOrderList({ pageNo: pageState?.page ?? 0 });
      } else {
        fetchMoreData({ pageNo: 0, orderStatus: false });
      }
    }
  }, [debouncedTempTitle]);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true && !isMobileDevice) {
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
    if (isAppliedFilterOrClear === true) {
      setPageState((old) => ({ ...old, loader: true, page: 0 }));
      filterObject.page = 0;
      dispatch(setAllOrdersPage(0));
    } else {
      setPageState((old) => ({ ...old, loader: true }));
    }
    const orderType = localStorage.getItem('Order_Type');
    if (orderType !== '') {
      if (orderType) {
        if (orderType == 'MPOS_ORDER') {
          filterObject.orderType = 'POS_ORDER';
          filterObject.subOrderType = orderType;
        } else {
          filterObject.orderType = orderType;
        }
      } else {
        filterObject.orderType = orderType || null;
      }
    }
    getAllOrdersList(filterObject)
      .then(function (response) {
        if (response?.data?.status === 'ERROR') {
          showSnackbar('Some Error Occured, Try after some time', 'error');
          setPageState((old) => ({ ...old, loader: false, datRows: [] }));
          setLoader(false);
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
                orderStatus: row?.baseOrderResponse?.orderStatus
                  ? textFormatter(row?.baseOrderResponse?.orderStatus)
                  : '----',
                orderNumber: row.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
                orderStatus: row?.baseOrderResponse?.orderStatus
                  ? textFormatter(row?.baseOrderResponse?.orderStatus)
                  : '-----',
                paymentStatus: row?.baseOrderResponse?.paymentStatus
                  ? textFormatter(row?.baseOrderResponse?.paymentStatus)
                  : '-----',
                grandTotal: row?.orderBillingDetails?.grandTotal
                  ? row?.orderBillingDetails?.grandTotal +
                    ' (' +
                    (row?.orderBillingDetails?.paymentMethod ? row?.orderBillingDetails?.paymentMethod : 'NA') +
                    ')'
                  : '-----',
                orderId: row?.baseOrderResponse?.orderId ? row?.baseOrderResponse?.orderId : '-----',
                invoiceId: row?.baseOrderResponse?.invoiceId ? row?.baseOrderResponse?.invoiceId : '-----',
                totalItems: row?.baseOrderResponse?.numberOfLineItems
                  ? row?.baseOrderResponse?.numberOfLineItems
                  : '-----',
                channel: row?.baseOrderResponse?.salesChannel
                  ? textFormatter(row?.baseOrderResponse?.salesChannel)
                  : '-----',
                createdDate: row?.baseOrderResponse?.createdAt
                  ? convertUTCtoIST(row?.baseOrderResponse?.createdAt)
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

  const searchOrderList = async (pageNo) => {
    try {
      const payload = {
        destinationLocationId: [locId],
        searchBox: tempTitle,
        page: pageNo ? pageNo?.pageNo : 0,
        pageSize: pageState.pageSize,
      };
      if (!isMobileDevice) {
        setPageState((old) => ({ ...old, loader: true }));
        setLoader(true);
      } else {
      }
      const response = await getAllOrdersListV2(payload);

      if (response?.data?.status === 'ERROR') {
        showSnackbar('Some Error Occured, Try after some time', 'error');
        setLoader(false);
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
              orderStatus: row?.baseOrderResponse?.orderStatus
                ? textFormatter(row?.baseOrderResponse?.orderStatus)
                : '----',
              orderNumber: row?.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
              paymentStatus: row?.baseOrderResponse?.paymentStatus
                ? textFormatter(row?.baseOrderResponse?.paymentStatus)
                : '-----',
              orderStatus: row?.baseOrderResponse?.orderStatus
                ? textFormatter(row?.baseOrderResponse?.orderStatu)
                : '-----',
              grandTotal: row?.orderBillingDetails?.grandTotal
                ? row?.orderBillingDetails?.grandTotal +
                  ' (' +
                  (row?.orderBillingDetails?.paymentMethod ? row?.orderBillingDetails?.paymentMethod : 'NA') +
                  ')'
                : '-----',
              orderId: row?.baseOrderResponse?.orderId
                ? row?.baseOrderResponse?.orderId + ' (' + row?.baseOrderResponse?.paymentStatus + ' )'
                : '-----',
              invoiceId: row?.baseOrderResponse?.invoiceId ? row?.baseOrderResponse?.invoiceId : '-----',
              createdDate: row?.baseOrderResponse?.createdAt
                ? convertUTCtoIST(row?.baseOrderResponse?.createdAt)
                : '-----',
            })),
          );
          setTableRows(dataRow[0]);
          setLoader(false);
          setPageState((old) => ({
            ...old,
            loader: false,
            // datRows: dataRow[0] || [],
            datRows: !pageNo || pageNo?.pageNo === 0 ? [...dataRow[0]] : [...old.datRows, ...dataRow[0]],
            total: dataArr.totalResults || 0,
            page: dataArr.page || 0,
          }));
          if (dataArr?.page === dataArr?.totalPages) {
            setShowViewMore(false);
          } else {
            if (!showViewMore) {
              setShowViewMore(true);
            }
          }
          setInfiniteLoader(false);
        } else {
          setLoader(false);
          setPageState((old) => ({ ...old, loader: false, datRows: [...old.datRows] || [] }));
          setErrorComing(true);
          setInfiniteLoader(false);
          showSnackbar('No orders found', 'error');
        }
      }
    } catch (err) {
      setLoader(false);
      setPageState((old) => ({ ...old, loader: false, datRows: [] }));
      setErrorComing(true);
      setInfiniteLoader(false);
      showSnackbar('No orders found', 'error');
    }
  };

  const handleSearchFliter = (e) => {
    let orderName = '';
    if (mobileSearchedValue) {
      orderName = e;
    } else {
      orderName = e.target.value;
    }
    if (orderName.length === 0) {
      setTempTitle('');
      dispatch(setAllOrdersSearchValue(''));
      setOnClear(true);
      handleClearSearchInput();
    } else {
      setTempTitle(orderName);
      dispatch(setAllOrdersSearchValue(orderName));
      delete filterObject.orderType;
      localStorage.removeItem('Order_Type');
    }
  };

  useEffect(() => {
    if (isFilterApplied && isMobileDevice) {
      fetchMoreData({ pageNo: 0, orderStatus: true });
    }
  }, [isFilterApplied]);

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
    localStorage.removeItem('cartId-SO');
    localStorage.removeItem('sales_OrderId');
    navigate('/sales/all-orders/new');
  };

  //responsiveness
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState();

  const fetchMoreData = ({ pageNo, orderStatus }) => {
    setInfiniteLoader(true);
    const filterObjectFetchMoreData = {
      ...filterObject,
      page: pageNo,
      // names: searchProductName,
    };
    const orderType = localStorage.getItem('Order_Type');
    if (orderType !== '') {
      if (mobileApp) {
        filterObjectFetchMoreData.orderType = 'B2C_ORDER';
      } else if (orderType) {
        if (orderType == 'MPOS_ORDER') {
          filterObjectFetchMoreData.orderType = 'POS_ORDER';
          filterObjectFetchMoreData.subOrderType = orderType;
        } else {
          filterObjectFetchMoreData.orderType = orderType;
        }
      } else {
        filterObjectFetchMoreData.orderType = orderType || null;
      }
    }

    if (selectedSubFilters) {
      const filterKeys = ['orderStatus', 'payMethod', 'payMode', 'startDate', 'endDate'];

      filterKeys.forEach((key) => {
        if (selectedSubFilters?.[key]) {
          if (selectedSubFilters[key][0]) {
            filterObjectFetchMoreData[key === 'payMethod' ? 'paymentMethod' : key === 'payMode' ? 'paymentMode' : key] =
              selectedSubFilters[key][0].value;
          } else if (
            filterObjectFetchMoreData?.[key === 'payMethod' ? 'paymentMethod' : key === 'payMode' ? 'paymentMode' : key]
          ) {
            delete filterObjectFetchMoreData[
              key === 'payMethod' ? 'paymentMethod' : key === 'payMode' ? 'paymentMode' : key
            ];
          }
        }
      });
    }
    getAllOrdersList(filterObjectFetchMoreData)
      .then(function (response) {
        if (response.data.status === 'ERROR') {
          showSnackbar('Some Error Occured, Try after some time', 'error');
          setInfiniteLoader(false);
          return;
        }

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
              orderStatus: row?.baseOrderResponse?.orderStatus
                ? textFormatter(row?.baseOrderResponse?.orderStatus)
                : '----',
              orderNumber: row.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
              orderStatus: row?.baseOrderResponse?.orderStatus
                ? textFormatter(row?.baseOrderResponse?.orderStatus)
                : '-----',
              paymentStatus: row?.baseOrderResponse?.paymentStatus
                ? textFormatter(row?.baseOrderResponse?.paymentStatus)
                : '-----',
              grandTotal: row?.orderBillingDetails?.grandTotal
                ? row?.orderBillingDetails?.grandTotal +
                  ' (' +
                  (row?.orderBillingDetails?.paymentMethod ? row?.orderBillingDetails?.paymentMethod : 'NA') +
                  ')'
                : '-----',
              orderId: row?.baseOrderResponse?.orderId ? row?.baseOrderResponse?.orderId : '-----',
              invoiceId: row?.baseOrderResponse?.invoiceId ? row?.baseOrderResponse?.invoiceId : '-----',
              totalItems: row?.baseOrderResponse?.numberOfLineItems
                ? row?.baseOrderResponse?.numberOfLineItems
                : '-----',
              channel: row?.baseOrderResponse?.salesChannel
                ? textFormatter(row?.baseOrderResponse?.salesChannel)
                : '-----',
              createdDate: row?.baseOrderResponse?.createdAt
                ? convertUTCtoIST(row?.baseOrderResponse?.createdAt)
                : '-----',
            })),
          );

          setPageState((old) => ({
            ...old,
            datRows: orderStatus && pageNo === 0 ? [...dataRow[0]] : [...old.datRows, ...dataRow[0]],
            total: dataArr.totalResults || 0,
            page: dataArr.page || 0,
            loader: false,
          }));
          if (dataArr?.page === dataArr?.totalPages) {
            setShowViewMore(false);
          } else {
            if (!showViewMore) {
              setShowViewMore(true);
            }
          }
          setInfiniteLoader(false);
        } else {
          setInfiniteLoader(false);
          setErrorComing(true);
          setPageState((prev) => ({ ...prev, datRows: [], loader: false }));
          showSnackbar('No data found', 'error');
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        setLoader(false);
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, datRows: [], loader: false }));
      });
  };

  // const handleScroll = () => {
  //   if (
  //     document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight &&
  //     infinitePageNo < totalPages
  //   ) {
  //     if (infinitePageNo === totalPages - 1) {
  //       setNoData(true);
  //     }
  //     setInfiniteLoader(true);
  //     setInfintiePageNo(infinitePageNo + 1);
  //     if (isMobileDevice) {
  //       fetchMoreData();
  //     }
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [infinitePageNo, totalPages]);

  const handleNextListingPage = () => {
    setInfiniteLoader(true);
    if (tempTitle) {
      searchOrderList({ pageNo: pageState?.page + 1 });
    } else {
      fetchMoreData({ pageNo: pageState?.page + 1, orderStatus: false });
    }
  };

  return (
    <>
      <DashboardLayout>
        {!isMobileDevice && <DashboardNavbar />}
        {/* {isMobileDevice && (
          <SoftBox className="new-search-header po-box-shadow">
            <MobileNavbar title={'All Orders'} />
            <CommonSearchBar
              searchFunction={handleSearchFliter}
              handleNewBtnFunction={handleNew}
              placeholder="Search Orders..."
            />
          </SoftBox>
        )} */}
        {!isMobileDevice && (
          <div className="payment-main-header-box">
            <span className="payment-main-heading">Orders</span>
            {filters.map((filter) => (
              <span
                key={filter.name}
                className={
                  filter.value === selectedFilter
                    ? 'payment-main-channel-filter-selected'
                    : 'payment-main-channel-filter-disselected'
                }
                onClick={() => handleFilterClick(filter)}
              >
                {filter.name}
              </span>
            ))}
          </div>
        )}
        {!isMobileDevice ? (
          <SoftBox className="search-bar-filter-and-table-container">
            <SoftBox className="search-bar-filter-container">
              <Grid container spacing={2} className="filter-product-list-cont">
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder={mobileApp ? 'Search App Orders' : 'Search Orders'}
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
                        Order
                      </SoftButton>
                    )}

                    <OrderListFilter
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
          <div
            className="pi-listing-card-main-div"
            style={{ width: '100%', height: 'auto', paddingBottom: '10px !important' }}
          >
            {pageState.loader ? (
              <div className="circular-progress-div">
                <CircularProgress sx={{ color: '#0562fb !important' }} />
              </div>
            ) : (
              <div>
                <div className="listing-order-name-main">
                  {filters.map((filter) => (
                    <CustomMobileButton
                      key={filter.name}
                      variant={filter.value === selectedFilter ? 'black-D' : 'black-S'}
                      title={filter.name}
                      onClickFunction={() => handleFilterClick(filter)}
                      flex={1}
                      justifyContent={'center'}
                    >
                      {filter.name}
                    </CustomMobileButton>
                  ))}
                </div>
                {pageState?.datRows?.length > 0 ? (
                  <div className="pi-listing-card-main-div">
                    {pageState?.datRows?.map((item) => (
                      <SalesOrderProductCard data={item} navigateToDetailsPage={navigateToDetailsPage} />
                    ))}
                    {showViewMore && <ViewMore loading={infiniteLoader} handleNextFunction={handleNextListingPage} />}
                  </div>
                ) : (
                  <NoDataFoundMob />
                )}
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}

export default AllSalesorders;
