import './over-view.css';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ClearSoftInput, convertUTCtoIST, isSmallScreen, noDatagif, textFormatter } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { InvoicesAndReturnFilter } from '../Filter/InvoicesFilter';
import { getAllSalesReturn, searchSalesReturns } from '../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import CommonSearchBar from '../../Common/MobileSearchBar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import ReturnMobCard from './components/return-details/returnMobileCard';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from 'components/SoftInput';
import Spinner from '../../../../components/Spinner';
import NoDataFoundMob from '../../Common/mobile-new-ui-components/no-data-found';
import CustomMobileButton from '../../Common/mobile-new-ui-components/button';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function SalesOrderReturns() {
  const isMobileDevice = isSmallScreen();

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
      field: 'orderNumber',
      headerName: 'Order Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'returnId',
      headerName: 'Return ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'returnStatus',
      headerName: 'Return Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'shipmentStatus',
      headerName: 'Shipment Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'amount',
      headerName: 'Return amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
  ];

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorComing, setErrorComing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dataRows, setTableRows] = useState([]);
  const [tempTitle, setTempTitle] = useState('');
  const [orderType, setOrderType] = useState(localStorage.getItem('Order_Type_Return') || '');
  // <--- filter states to handle clear
  const [onClear, setOnClear] = useState(false);
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const filters = [
    { name: 'All', value: '' },
    { name: 'Direct', value: 'SALES_ORDER' },
    { name: 'POS', value: 'POS_ORDER' },
    { name: 'mPOS', value: 'MPOS_ORDER' },
    { name: 'App', value: 'B2C_ORDER' },
  ];
  const [selectedFilter, setSelectedFilter] = useState(localStorage.getItem('Order_Type_Return') || '');
  const newOrderType = localStorage.getItem('Order_Type_Return');

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter?.value);
    filterObject.page = 0;
    if (filter?.value === '') {
      delete filterObject.orderType;
      localStorage.removeItem('Order_Type_Return');
      allReturnList();
    } else {
      filterObject.orderType = filter.value;
      localStorage.setItem('Order_Type_Return', filter.value);
      allReturnList();
    }
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);

  const filterObject = {
    locationId: locId,
    searchBox: tempTitle,
    page: pageState.page - 1,
    pageSize: pageState.pageSize,
    orderType: localStorage.getItem('Order_Type_Return') || '',
  };

  const debouncedTempTitle = useDebounce(tempTitle, 300); // Adjust the delay as needed

  useEffect(() => {
    if (debouncedTempTitle) {
      filterObject.orderType = null;
      filterObject.page = 0;
      searchOrderList();
    } else {
      setLoader(true);
      allReturnList();
    }
  }, [debouncedTempTitle, pageState.page, pageState.pageSize]);

  useEffect(() => {
    if (onClear === true) {
      allReturnList();
      setOnClear(false);
      setTempTitle('');
    }
  }, [onClear]);

  //infinity scroll for mobile, invoices data:
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState();
  const [fetchCount, setFetchCount] = useState(0);

  let dataArr,
    dataRow = [];
  const allReturnList = () => {
    if (filterObject?.orderType === '') {
      filterObject.orderType = null;
    }
    if (fetchCount > 0) {
      filterObject.page = infinitePageNo;
    }

    if (tempTitle !== '') {
      filterObject.page = 0;
    }
    if (filterObject?.orderType === 'MPOS_ORDER') {
      filterObject.subOrderType = filterObject?.orderType;
      filterObject.orderType = 'POS_ORDER';
    }
    fetchCount === 0 || tempTitle !== '' ? setLoader(true) : setInfiniteLoader(true);
    setPageState((old) => ({ ...old, loader: true }));
    getAllSalesReturn(filterObject)
      .then((res) => {
        if (res?.data?.data?.es) {
          setErrorComing(true);
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.orderResponseList;
        if (response.length > 0) {
          !isMobileDevice;
          dataArr = res?.data?.data;
          (dataRow = dataArr?.orderResponseList?.map((row) => ({
            customerName:
              row?.baseOrderResponse?.customerName !== null
                ? row?.baseOrderResponse?.customerName
                  ? textFormatter(row?.baseOrderResponse?.customerName)
                  : '----'
                : 'N/A',
            orderNumber: row?.baseOrderResponse?.orderId ? row?.baseOrderResponse?.orderId : '-----',
            returnStatus: row?.baseOrderResponse?.returnStatus
              ? textFormatter(row?.baseOrderResponse?.returnStatus)
              : '-----',
            shipmentStatus: row?.baseOrderResponse?.shipmentStatus
              ? textFormatter(row?.baseOrderResponse?.shipmentStatus)
              : '-----',
            quantity: row?.baseOrderResponse?.totalReturnedQuantity ?? '0',
            amount: row?.returnDetails?.refundAmount ?? '-----',
            returnId: row?.returnDetails?.returnId ?? '-----',
            channel: row?.baseOrderResponse?.salesChannel
              ? textFormatter(row?.baseOrderResponse?.salesChannel)
              : '----',
            createdDate: row?.baseOrderResponse?.createdAt
              ? convertUTCtoIST(row?.baseOrderResponse?.createdAt)
              : '-----',
          }))),
            isMobileDevice && setFetchCount(fetchCount + 1);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: fetchCount === 0 || tempTitle !== '' ? dataRow || [] : [...old.datRows, ...dataRow],
            total: dataArr.totalResults || 0,
          }));
          setTotalPage(response?.data?.data?.totalPages);
          fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
        } else {
          setLoader(false);
          setErrorComing(true);
          fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
          setPageState((old) => ({
            ...old,
            datRows: isMobileDevice ? [...old.datRows, ...dataRow] : [],
            loader: false,
          }));
          showSnackbar('No returns found', 'error');
        }
      })
      .catch((err) => {
        setPageState((old) => ({ ...old, datRows: [], loader: false }));
        fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        setErrorComing(true);
      });
  };

  const handleSearchFliter = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setTempTitle('');
    } else {
      setTempTitle(e.target.value);
    }
  };

  const searchOrderList = async () => {
    try {
      const payload = {
        searchBox: tempTitle,
        page: 0,
        pageSize: pageState.pageSize,
      };

      setLoader(true);
      setPageState((old) => ({ ...old, loader: true }));

      const response = await searchSalesReturns(payload);

      if (response?.data?.data?.code === 'ECONNRESET') {
        if (retryCount < 3) {
          allOrderList();
          retryCount++;
        } else {
          showSnackbar('Some Error Occured, Try after some time', 'error');
          setLoader(false);
        }
      } else {
        if (response?.data?.data?.data?.length > 0) {
          !isMobileDevice;
          dataArr = response?.data?.data?.data;
          (dataRow = dataArr?.map((row) => ({
            customerName:
              row?.customerName !== null ? (row?.customerName ? textFormatter(row?.customerName) : '----') : 'WALK-IN',
            orderNumber: row?.orderId ?? '-----',
            returnStatus: row?.returnStatus ?? '-----',
            shipmentStatus: row?.shipmentStatus ?? '-----',
            quantity: row?.totalQtyReturned ?? '-----',
            amount: row?.refundAmount ?? '-----',
            returnId: row?.returnId ?? '-----',
            createdDate: row?.createdAt ? convertUTCtoIST(row?.createdAt) : '-----',
          }))),
            // setTableRows(dataRow);
            isMobileDevice && setFetchCount(fetchCount + 1);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: fetchCount === 0 || tempTitle !== '' ? dataRow || [] : [...old.datRows, ...dataRow],
            total: dataArr.totalResults || 0,
          }));
          setTotalPage(response?.data?.data?.totalPages);
          fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
        } else {
          setLoader(false);
          setErrorComing(true);
          fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
          setPageState((old) => ({ ...old, datRows: [], loader: false }));
          showSnackbar('No returns found', 'error');
        }
      }
    } catch (err) {
      setPageState((old) => ({ ...old, datRows: [], loader: false }));
      fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
      showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      setErrorComing(true);
    }
  };

  // clear invoices search input fn
  const handleClearSearchInput = () => {
    setTempTitle('');
  };

  const handleNew = () => {
    navigate('/sales/returns/add');
  };

  const navigateToDetailsPage = (row) => {
    navigate(`/sales/returns/${row?.orderNumber}/${row?.returnId}`);
  };

  const handleNextListingPage = () => {
    if (infinitePageNo > totalPages && !infiniteLoader) return;
    if (infinitePageNo === totalPages) {
      setNoData(true);
    }
    // setInfiniteLoader(true);
    setInfintiePageNo(infinitePageNo + 1);
    if (isMobileDevice) {
      allReturnList();
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight &&
      infinitePageNo <= totalPages &&
      !infiniteLoader
    ) {
      if (infinitePageNo === totalPages) {
        setNoData(true);
      }
      // setInfiniteLoader(true);
      setInfintiePageNo(infinitePageNo + 1);
      if (isMobileDevice) {
        allReturnList();
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
        {!isMobileDevice && <DashboardNavbar prevLink={true} />}
        {/* {isMobileDevice && (
          <SoftBox className="new-search-header po-box-shadow">
            <MobileNavbar title={'Returns'} />
            <CommonSearchBar
              searchFunction={handleSearchFliter}
              handleNewBtnFunction={handleNew}
              placeholder="Search Returns..."
              handleNewRequired={false}
            />
          </SoftBox>
        )} */}
        {!isMobileDevice && (
          <div className="payment-main-header-box">
            <span className="payment-main-heading">Returns</span>
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
                      placeholder="Search"
                      value={tempTitle}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchFliter}
                    />
                    {tempTitle !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                </Grid>
                <Grid item md={6.5} sm={4} xs={12}>
                  <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                    <SoftButton onClick={handleNew} variant="solidWhiteBackground">
                      <AddIcon />
                      Return
                    </SoftButton>
                    <InvoicesAndReturnFilter
                      filterObject={filterObject} //payload
                      orderType={orderType}
                      newOrderType={newOrderType}
                      setOrderType={setOrderType}
                      setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                      // get filtered result fn
                      page="return"
                      allOrderList={allReturnList}
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
                        className="data-grid-table-boxo"
                        columns={columns}
                        rows={pageState.datRows}
                        getRowId={(row) => row?.returnId}
                        rowCount={parseInt(pageState?.total)}
                        loading={pageState.loader}
                        pagination
                        page={tempTitle ? 0 : pageState.page - 1}
                        pageSize={pageState.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setPageState((old) => ({ ...old, page: newPage + 1 }));
                        }}
                        onPageSizeChange={(newPageSize) => {
                          setPageState((old) => ({ ...old, pageSize: newPageSize }));
                        }}
                        onCellClick={(rows) => navigateToDetailsPage(rows.row)}
                        disableSelectionOnClick
                      />
                    )}
                  </>
                )}
              </SoftBox>
            )}
          </SoftBox>
        ) : (
          <>
            {loader ? (
              <div className="circular-progress-div">
                <CircularProgress sx={{ color: '#0562fb !important' }} />
              </div>
            ) : (
              <div>
                {/* <div>
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
                </div> */}
                {pageState?.datRows?.length > 0 ? (
                  <div className="pi-listing-card-main-div">
                    {pageState?.datRows?.map((item) => (
                      <ReturnMobCard data={item} />
                    ))}
                    <div
                      className="view-more-listing-cards"
                      onClick={handleNextListingPage}
                      style={{
                        visibility: infinitePageNo > totalPages ? 'hidden' : 'visible',
                        display: noData ? 'none' : 'flex',
                      }}
                    >
                      {infiniteLoader ? (
                        <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
                      ) : (
                        <div>
                          <span className="view-more-btn">View More</span>
                          <ChevronDownIcon
                            style={{
                              width: '1rem',
                              height: '1rem',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <NoDataFoundMob />
                )}
              </div>
            )}
            {/* <Box
              className="infinite-loader"
              sx={{
                visibility: infiniteLoader ? 'visible' : 'hidden',
                display: noData ? 'none' : 'flex',
              }}
            >
              <CircularProgress size={25} color="info" />
            </Box> */}
          </>
        )}
      </DashboardLayout>
    </>
  );
}

export default SalesOrderReturns;
