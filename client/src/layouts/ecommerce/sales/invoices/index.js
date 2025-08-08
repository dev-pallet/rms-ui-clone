import './over-view.css';
import { AllOrdersAndInvoicesAndPurchaseHistoryFilter } from '../all-orders/components/Filter/AllOrdersAndInvoicesAndPurchaseHistoryFilter';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { salesPymentRecieved } from '../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import CommonSearchBar from '../../Common/MobileSearchBar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import InvoiceMobCard from './components/Invoice-Card';
import InvoicePaymentModal from './components/payment-modal';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';

function Invoices() {
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();

  const columns = [
    {
      field: 'invoiceDate',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 0.75,
    },
    {
      field: 'orderID',
      headerName: 'Order ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 160,
      flex: 0.75,
    },
    {
      field: 'invoiceId',
      headerName: 'Invoice ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 160,
      flex: 0.75,
    },
    {
      field: 'channel',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 0.75,
    },
    {
      field: 'paymentId',
      headerName: 'Payment ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 0.75,
    },
    {
      field: 'totalAmount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 100,
      flex: 0.75,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 140,
      flex: 0.75,
    },
  ];

  const [errorComing, setErrorComing] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();
  // const [dataRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [orderType, setOrderType] = useState(localStorage.getItem('Order_Type') || '');
  // <--- filter states to handle clear
  const [onClear, setOnClear] = useState(false);
  const [summaryData, setsummaryData] = useState();
  // --->
  const filters = [
    { name: 'All', value: '' },
    { name: 'Direct', value: 'SALES_ORDER' },
    { name: 'POS', value: 'POS_ORDER' },
    { name: 'mPOS', value: 'mPOS_ORDER' },
    { name: 'App', value: 'B2C_ORDER' },
  ];
  const [selectedFilter, setSelectedFilter] = useState(localStorage.getItem('Order_Type') || '');

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter?.value);
    filterObject.orderType = filter.value;
    localStorage.setItem('Order_Type', filter.value);
    allOrderList();
  };

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

  const filterObject = {
    locationId: locId,
    searchBox: tempTitle,
    page: pageState.page - 1,
    pageSize: pageState.pageSize,
    orderType: localStorage.getItem('Order_Type') || '',
  };

  const debouncedTempTitle = useDebounce(tempTitle, 300); // Adjust the delay as needed

  useEffect(() => {
    if (debouncedTempTitle) {
      searchOrderList();
    } else {
      allOrderList();
    }
  }, [debouncedTempTitle, pageState.page, pageState.pageSize]);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      allOrderList();
      setOnClear(false);
    }
  }, [onClear]);

  //infinity scroll for mobile, invoices data:
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState();
  const [fetchCount, setFetchCount] = useState(0);

  let retryCount = 0;
  let dataArr,
    dataRow = [];
  const allOrderList = () => {
    if (fetchCount > 0) {
      filterObject.page = infinitePageNo;
    }

    if (tempTitle !== '') {
      filterObject.page = 0;
    }
    fetchCount === 0 || tempTitle !== '' ? setLoader(true) : setInfiniteLoader(true);
    setPageState((old) => ({ ...old, loader: true }));
    salesPymentRecieved(filterObject)
      .then(function (response) {
        if (response?.data?.data?.code === 'ECONNRESET') {
          if (retryCount < 3) {
            allOrderList();
            retryCount++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
          }
        } else {
          if (response?.data?.data?.payments.length > 0) {
            !isMobileDevice && showSnackbar('Success Order List', 'success');
            dataArr = response?.data?.data;
            (dataRow = dataArr?.payments?.map((row) => ({
              totalAmount: row?.amountPaid ? row?.amountPaid : '-----',
              orderID: row?.orderId ? row?.orderId : '-----',
              invoiceId: row?.invoiceNumber ? row?.invoiceNumber : 'NA',
              invoiceDate: row?.paymentDate ? dateFormatter(row?.paymentDate) : '-----',
              customer: row?.customerName !== null ? (row?.customerName ? row?.customerName : '----') : 'WALK-IN',
              channel: row?.salesChannel ? textFormatter(row?.salesChannel) : 'NA',
              paymentStatus: row?.paymentStatus ? textFormatter(row?.paymentStatus) : '-----',
              paymentMode: row?.paymentMethod ? row?.paymentMethod : '-----',
              paymentId: row?.paymentId ? row?.paymentId : '-----',
            }))),
              //setting intital loder and infinite loader as false according tofetched data

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
            showSnackbar('No Orders Found', 'error');
            fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
            setErrorComing(true);
          }
        }
      })
      .catch((err) => {
        showSnackbar('No Data Found', 'error');
        fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
        setErrorComing(true);
      });
  };

  const handlePayment = () => {
    setOpenPaymentModal(true);
  };
  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
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

      const response = await salesPymentRecieved(payload);

      if (response?.data?.data?.code === 'ECONNRESET') {
        if (retryCount < 3) {
          allOrderList();
          retryCount++;
        } else {
          showSnackbar('Some Error Occured, Try after some time', 'error');
          setLoader(false);
        }
      } else {
        if (response?.data?.data?.payments.length > 0) {
          !isMobileDevice && showSnackbar('Success Order List', 'success');
          dataArr = response?.data?.data;
          (dataRow = dataArr?.payments?.map((row) => ({
            totalAmount: row?.amountPaid ? row?.amountPaid : '-----',
            orderID: row?.orderId ? row?.orderId : '-----',
            invoiceId: row?.invoiceNumber ? row?.invoiceNumber : 'NA',
            invoiceDate: row?.paymentDate ? dateFormatter(row?.paymentDate) : '-----',
            customer: row?.customerName !== null ? (row?.customerName ? row?.customerName : '----') : 'WALK-IN',
            channel: row?.salesChannel ? textFormatter(row?.salesChannel) : 'NA',
            paymentStatus: row?.paymentStatus ? textFormatter(row?.paymentStatus) : '-----',
            paymentMode: row?.paymentMethod ? row?.paymentMethod : '-----',
            paymentId: row?.paymentId ? row?.paymentId : '-----',
          }))),
            // setTableRows(dataRow);
            setLoader(false);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRow || [],
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
  };

  const handleSearchFliter = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setTempTitle('');
    } else {
      setTempTitle(e.target.value);
    }
  };

  // clear invoices search input fn
  const handleClearSearchInput = () => {
    setTempTitle('');
  };

  const handleNew = () => {
    setLoader(true);
    navigate('/sales/all-orders/new');
  };
  // msc
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
        allOrderList();
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
        {isMobileDevice && (
          <SoftBox className="new-search-header po-box-shadow">
            <MobileNavbar title={'Invoices'} />
            <CommonSearchBar
              searchFunction={handleSearchFliter}
              handleNewBtnFunction={handleNew}
              placeholder="Search payments..."
              handleNewRequired={false}
            />
          </SoftBox>
        )}
        {!isMobileDevice && (
          <div className="payment-main-header-box">
            <span className="payment-main-heading">Payments</span>
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
          <SoftBox
            // className="softbox-box-shadow view"
            className="search-bar-filter-and-table-container"
          >
            <SoftBox
              // className="list-div-heading1"
              className="search-bar-filter-container"
            >
              <Grid container spacing={2} className="filter-product-list-cont">
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search by order ID (or) customer name..."
                      value={tempTitle}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchFliter}
                    />
                    {tempTitle !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                </Grid>
                <Grid item md={6.5} sm={4} xs={12}>
                  <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                    <SoftButton onClick={handlePayment} variant="solidWhiteBackground">
                      <AddIcon />
                      Payment
                    </SoftButton>
                    <AllOrdersAndInvoicesAndPurchaseHistoryFilter
                      filterObject={filterObject} //payload
                      orderType={orderType}
                      newOrderType={newOrderType}
                      setOrderType={setOrderType}
                      setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                      // get filtered result fn
                      allOrderList={allOrderList}
                    />
                  </SoftBox>
                  {openPaymentModal && (
                    <InvoicePaymentModal
                      openPaymentModal={openPaymentModal}
                      handleClosePaymentModal={handleClosePaymentModal}
                      allOrderList={allOrderList}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2} className="payment-summary">
                <Grid item xs={12}>
                  <SoftTypography className="payment-heading-summary">Payment Summary</SoftTypography>
                </Grid>
                <Grid item xs={12} mt={-2} mb={-2}>
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    py={2}
                    px={1}
                    alignItems="center"
                  >
                    <Grid item xs={2.5} md={2.5} xl={2.5} sx={{ borderRight: '2px solid #aab2bf' }}>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">Total sales</SoftTypography>
                        <SoftTypography className="payment-text-summary">{`₹ ${
                          summaryData?.totalOutstanding ? summaryData?.totalOutstanding : '0'
                        } from ${3434} orders`}</SoftTypography>
                      </SoftBox>
                    </Grid>
                    <Grid item xs={1.8} md={1.8} xl={1.8} sx={{ borderRight: '2px solid #aab2bf' }}>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">Payment received</SoftTypography>
                        <SoftTypography className="payment-text-summary">{`₹ ${
                          summaryData?.dueToday ? summaryData?.dueToday : '0'
                        } from 312 orders`}</SoftTypography>
                      </SoftBox>
                    </Grid>
                    <Grid item xs={1.8} md={1.8} xl={1.8} sx={{ borderRight: '2px solid #aab2bf' }}>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">Outstanding</SoftTypography>
                        <SoftTypography className="payment-text-summary">{`₹ ${
                          summaryData?.dueIn7days ? summaryData?.dueIn7days : '0'
                        } from 12 orders`}</SoftTypography>
                      </SoftBox>
                    </Grid>
                    <Grid item xs={1.8} md={1.8} xl={1.8} sx={{ borderRight: '2px solid #aab2bf' }}>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">Cash</SoftTypography>
                        <SoftTypography className="payment-text-summary">{`₹ ${
                          summaryData?.dueIn30Days ? summaryData?.dueIn30Days : '0'
                        } from 39 orders`}</SoftTypography>
                      </SoftBox>
                    </Grid>
                    <Grid item xs={1.5} md={1.5} xl={1.5} sx={{ borderRight: '2px solid #aab2bf' }}>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">Digital</SoftTypography>
                        <SoftTypography className="payment-text-summary">{`₹ ${
                          summaryData?.overdue ? summaryData?.overdue : '0'
                        } from 0 orders`}</SoftTypography>
                      </SoftBox>
                    </Grid>
                    <Grid item xs={1.5} md={1.5} xl={1.5}>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">Others</SoftTypography>
                        <SoftTypography className="payment-text-summary">{`₹ ${
                          summaryData?.overdue ? summaryData?.overdue : '0'
                        } from 0 orders`}</SoftTypography>
                      </SoftBox>
                    </Grid>
                  </Grid>
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
                className="dat-grid-table-box"
                sx={{
                  height: 525,
                  width: '100%',
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
                        getRowId={(row) => row?.invoiceId}
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
            {loader ? <Spinner /> : pageState?.datRows?.map((item) => <InvoiceMobCard data={item} />)}
            <Box
              className="infinite-loader"
              sx={{
                visibility: infiniteLoader ? 'visible' : 'hidden',
                display: noData ? 'none' : 'flex',
              }}
            >
              <CircularProgress size={25} color="info" />
            </Box>
          </>
        )}
      </DashboardLayout>
    </>
  );
}

export default Invoices;
