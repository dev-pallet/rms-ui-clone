import './over-view.css';
import { AllOrdersAndInvoicesAndPurchaseHistoryFilter } from '../all-orders/components/Filter/AllOrdersAndInvoicesAndPurchaseHistoryFilter';
import { Box, CircularProgress, Grid } from '@mui/material';
import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { convertUtcToAsiaKolkata } from '../../UTC-TimeChange';
import { salesPymentRecieved } from '../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import CommonSearchBar from '../../Common/MobileSearchBar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import PaymentRecMobCard from './components/Payment-card';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import Spinner from '../../../../components/Spinner';

function Paymentreceived() {
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const [orderType, setOrderType] = useState(localStorage.getItem('Order_Type') || '');
  const [onClear, setOnClear] = useState(false);

  const columns = [
    // {
    //   field: 'invoiceDate',
    //   headerName: 'Invoice Date',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   minWidth: 150,
    //   flex: 0.75,
    // },
    {
      field: 'paymentId',
      headerName: 'Payment ID',
      type: 'number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 140,
      flex: 0.75,
      renderCell: (cellValues) => {
        return <div>{dateFormatter(cellValues.value)}</div>;
      },
    },
    {
      field: 'invoiceNumber',
      headerName: 'Invoice Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 140,
      flex: 0.75,
    },
    // {
    //   field: 'orderID',
    //   headerName: 'Order ID',
    //   minWidth: 110,
    //   flex: 0.75,
    //   headerAlign: 'left',
    //   headerClassName: 'datagrid-columns',
    //   cellClassName: 'datagrid-rows',
    // },
    {
      field: 'customerName',
      headerName: 'Customer',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 0.75,
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      type: 'number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    // {
    //   field: 'paymentStatus',
    //   headerName: 'Payment Status',
    //   type: 'number',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   minWidth: 150,
    //   flex: 0.75,
    // },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
  ];

  const [errorComing, setErrorComing] = useState(false);

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
    page: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const [dataRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

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

  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState();
  const [fetchCount, setFetchCount] = useState(0);

  const filterObject = {
    destinationLocationId: [locId],
    searchBox: tempTitle,
    page: pageState.page - 1,
    pageSize: pageState.pageSize,
  };

  const debouncedTempTitle = useDebounce(tempTitle, 300); // Adjust the delay as needed

  let dataArr,
    dataRow = [];
  useEffect(() => {
    // if(debouncedTempTitle){
    //   allOrderList();
    // }else{
    allOrderList();
    // }
  }, [debouncedTempTitle, pageState.page, pageState.pageSize]);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      allOrderList();
      setOnClear(false);
    }
  }, [onClear]);

  let retryCount = 0;
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
            {
              fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
            }
          }
        } else {
          if (response?.data?.data?.payments.length > 0) {
            !isMobileDevice && showSnackbar('Success Order List', 'success');

            dataArr = response?.data?.data;
            dataRow.push(
              dataArr?.payments?.map((row, index) => ({
                invoiceDate: row.invoiceDate ? convertUtcToAsiaKolkata(row.invoiceDate) : '-----',
                orderID: row.orderId ? row.orderId : '-----',
                customerName: row?.customerName !== null ? (row?.customerName ? row?.customerName : '----') : 'WALK-IN',
                paymentDate: row.paymentDate
                  ? // convertUtcToAsiaKolkata(row.paymentDate)
                    row.paymentDate
                  : '-----',
                amount: row.amountPaid ? row.amountPaid : '-----',
                paymentId: row.paymentId ? row.paymentId : '-----',
                paymentMethod: row.paymentMethod ? row.paymentMethod : '-----',
                paymentStatus: row.paymentStatus ? row.paymentStatus : '-----',
                invoiceNumber: row.invoiceNumber ? row.invoiceNumber : 'NA',
                id: index,
              })),
            );
            setTableRows(dataRow[0]);
            {
              isMobileDevice && setFetchCount(fetchCount + 1);
            }
            setPageState((old) => ({
              ...old,
              loader: false,
              datRows: fetchCount === 0 || tempTitle !== '' ? dataRow[0] || [] : [...old.datRows, ...dataRow[0]],
              total: dataArr.totalResults || 0,
            }));
            setTotalPage(response?.data?.data?.totalPages);
            fetchCount === 0 || tempTitle !== '' ? setLoader(false) : setInfiniteLoader(false);
          } else {
            showSnackbar('No Orders Found', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows: [] }));
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

  const handleSearchFliter = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setTempTitle('');
    } else {
      setTempTitle(e.target.value);
    }
  };

  // clear payments search input fn
  const handleClearSearchInput = () => {
    setTempTitle('');
  };

  const handleNew = () => {
    setLoader(true);
    navigate('/sales/all-orders/new');
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
        {!isMobileDevice && <DashboardNavbar />}
        {isMobileDevice && (
          <SoftBox className="new-search-header po-box-shadow">
            <MobileNavbar title={'Payment Received'} />
            <CommonSearchBar
              searchFunction={handleSearchFliter}
              handleNewBtnFunction={handleNew}
              placeholder="Search Payments..."
              handleNewRequired={false}
            />
          </SoftBox>
        )}

        {!isMobileDevice ? (
          <SoftBox
            //  className="softbox-box-shadow view"
            className="search-bar-filter-and-table-container"
          >
            <SoftBox
              //  className="list-div-heading1"
              className="search-bar-filter-container"
            >
              <Grid
                container
                spacing={2}
                className="filter-product-list-cont"
                // sx={{
                //   padding: '15px 15px 0px 15px ',
                // }}
              >
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  {/* <SoftBox className="filter-product-list-cont"> */}
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search Payments"
                      value={tempTitle}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchFliter}
                    />
                    {tempTitle !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                  {/* </SoftBox> */}
                </Grid>

                <Grid item md={6.5} sm={4} xs={12}>
                  <Box sx={{ float: 'right' }}>
                    {/* filter */}
                    <AllOrdersAndInvoicesAndPurchaseHistoryFilter
                      page="payment_received"
                      filterObject={filterObject} //payload
                      orderType={orderType}
                      newOrderType={newOrderType}
                      setOrderType={setOrderType}
                      setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                      // get filtered result fn
                      allOrderList={allOrderList}
                    />
                  </Box>
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
            ) : tabs.tab1 ? (
              <SoftBox
                // py={0}
                // px={0}
                // p={'15px'}
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
                        getRowId={(row) => row.paymentId}
                        rowCount={parseInt(pageState.total)}
                        loading={pageState.loader}
                        pagination
                        page={pageState.page - 1}
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
            ) : null}
          </SoftBox>
        ) : (
          <>
            {loader ? <Spinner /> : pageState?.datRows?.map((item) => <PaymentRecMobCard data={item} />)}
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

export default Paymentreceived;
