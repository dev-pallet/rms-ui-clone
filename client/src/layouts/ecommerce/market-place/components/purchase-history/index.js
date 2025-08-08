import './purchase-history.css';
import * as React from 'react';
import { AllOrdersAndInvoicesAndPurchaseHistoryFilter } from '../../../sales/all-orders/components/Filter/AllOrdersAndInvoicesAndPurchaseHistoryFilter';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { convertUtcToAsiaKolkata } from '../../../UTC-TimeChange';
import { getAllOrdersList, getAllOrdersListV2 } from '../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MuiAlert from '@mui/material/Alert';
import SetInterval from '../../../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import Spinner from 'components/Spinner/index';
import { noDatagif } from '../../../Common/CommonFunction';

export const PurchaseHistory = () => {
  const columns = [
    {
      field: 'createdDate',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'orderId',
      headerName: 'Order ID',
      minWidth: 140,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'createdBy',
      headerName: 'Customer',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'deliveryLoc',
      headerName: 'Delivery Location',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 120,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'grandTotal',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 134,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const navigateToDetailsPage = (orderId) => {
    navigate(`/marketplace-order/details/${orderId}`);
  };

  const [searchorders, setsearchOrders] = useState('');
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 7,
  });
  const [orderType, setOrderType] = useState('MARKETPLACE_ORDER');
  // <--- filter states to handle clear
  const [onClear, setOnClear] = useState(false);
  // --->

  const [tabs, setTabs] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });

  const handleordersearch = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setsearchOrders('');
    } else {
      setsearchOrders(e.target.value);
    }
  };

  //snackbar

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const [errorComing, setErrorComing] = useState(false);
  const locId = localStorage.getItem('locId');
  const newOrderType = localStorage.getItem('Order_Type');
  const filterObject = {
    sourceLocId: locId,
    page: pageState.page - 1,
    pageSize: pageState.pageSize,
    // orderType: 'MARKETPLACE_ORDER',
  };

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];

  useEffect(() => {
    if (searchorders) {
      searchOrderList();
    } else {
      allOrderList();
    }
  }, [searchorders, pageState.page, pageState.pageSize]);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      allOrderList();
      setOnClear(false);
    }
  }, [onClear]);

  const allOrderList = () => {
    setLoader(true);
    setPageState((old) => ({ ...old, loader: true }));
    getAllOrdersList(filterObject).then(function (responseTxt) {
      setLoader(false);
      if (responseTxt?.data?.data?.orderResponseList?.length > 0) {
        setAlertmessage('Success MP list');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        dataArr = responseTxt.data.data;
        dataRow.push(
          dataArr?.orderResponseList?.map((row) => ({
            orderId: row.baseOrderResponse?.orderId
              ? row.baseOrderResponse?.orderId + ' (' + row.baseOrderResponse?.fulfilmentStatus + ' )'
              : '-----',
            orderNumber: row.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
            createdBy: row.baseOrderResponse?.customerName
              ? row.baseOrderResponse?.customerName + '( ' + row.baseOrderResponse?.salesChannel + ' )'
              : '-----',
            createdDate: row.baseOrderResponse?.createdAt
              ? convertUtcToAsiaKolkata(row.baseOrderResponse?.createdAt)
              : '-----',
            grandTotal: row.orderBillingDetails?.grandTotal
              ? row.orderBillingDetails?.grandTotal + ' (' + row.orderBillingDetails?.paymentMethod + ' )'
              : '-----',
            deliveryLoc: row.addressEntityModel.shippingAddress?.city
              ? row.addressEntityModel.shippingAddress?.city
              : '-----',
          })),
        );
        setTableRows(dataRow[0]);
        setPageState((old) => ({ ...old, loader: false, datRows: dataRow[0] || [], total: dataArr.totalResults || 0 }));
      } else {
        setPageState((old) => ({ ...old, loader: false }));
        setAlertmessage('No Orders Found');
        setTimelineerror('error');
        SetInterval(handleopensnack());
        setLoader(false);
        setErrorComing(true);
      }
    });
  };

  const searchOrderList = () => {
    const payload = {
      sourceLocationId: [locId],
      searchBox: searchorders,
      page: pageState.page - 1,
      pageSize: pageState.pageSize,
    };
    setLoader(true);
    setPageState((old) => ({ ...old, loader: true }));
    getAllOrdersListV2(payload).then(function (responseTxt) {
      setLoader(false);
      if (responseTxt?.data?.data?.orderResponseList?.length > 0) {
        setAlertmessage('Success MP list');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        dataArr = responseTxt.data.data;
        dataRow.push(
          dataArr?.orderResponseList?.map((row) => ({
            orderId: row.baseOrderResponse?.orderId
              ? row.baseOrderResponse?.orderId + ' (' + row.baseOrderResponse?.fulfilmentStatus + ' )'
              : '-----',
            orderNumber: row.baseOrderResponse?.orderId ? row.baseOrderResponse?.orderId : '-----',
            createdBy: row.baseOrderResponse?.customerName
              ? row.baseOrderResponse?.customerName + '( ' + row.baseOrderResponse?.salesChannel + ' )'
              : '-----',
            createdDate: row.baseOrderResponse?.createdAt
              ? convertUtcToAsiaKolkata(row.baseOrderResponse?.createdAt)
              : '-----',
            grandTotal: row.orderBillingDetails?.grandTotal
              ? row.orderBillingDetails?.grandTotal + ' (' + row.orderBillingDetails?.paymentMethod + ' )'
              : '-----',
            deliveryLoc: row.addressEntityModel.shippingAddress?.city
              ? row.addressEntityModel.shippingAddress?.city
              : '-----',
          })),
        );
        setTableRows(dataRow[0]);
        setPageState((old) => ({ ...old, loader: false, datRows: dataRow[0] || [], total: dataArr.totalResults || 0 }));
      } else {
        setAlertmessage('No Orders Found');
        setTimelineerror('error');
        SetInterval(handleopensnack());
        setLoader(false);
        setPageState((old) => ({ ...old, loader: false }));
        setErrorComing(true);
      }
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      <SoftBox
        // className="table-css-fix-box-scroll-pi list-mp-order"
        className="search-bar-filter-and-table-container list-mp-order"
      >
        <SoftBox
          // className="list-div-heading"
          className="search-bar-filter-container"
        >
          <Grid container>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              <SoftInput
                className="filter-soft-input-box"
                placeholder="Search Marketplace Order"
                onChange={handleordersearch}
                icon={{ component: 'search', direction: 'left' }}
              />
            </Grid>
            <Grid item md={6.5} sm={4} xs={12}>
              <Box sx={{ float: 'right' }}>
                <AllOrdersAndInvoicesAndPurchaseHistoryFilter
                  page="purchase_history" // current page name
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
          {/* <SoftBox className="filter-add-list2-cont">
              <SoftBox className="soft-select-menu-box-q">
                <SoftSelect
                  placeholder="Location"
                  options={[
                    { value: 'ka', label: 'Karnataka' },
                    { value: 'tn', label: 'Tamilnadu' },
                    { value: 'kl', label: 'Kerala' },
                    { value: 'ap', label: 'Andhra Pradesh' },
                    { value: 'ts', label: 'Telengana' },
                  ]}
                />
              </SoftBox>
            </SoftBox>
            <SoftBox className="filter-add-list2-cont">
              <SoftBox className="soft-select-menu-box">
                <SoftSelect
                  placeholder="Status"
                  options={[
                    { value: 'open', label: 'Open' },
                    { value: 'close', label: 'Closed' },
                    { value: 'cancel', label: 'Cancelled' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'billed', label: 'Billed' },
                    { value: 'partially', label: 'Partially billed' },
                    { value: 'made', label: 'Payments made' },
                    { value: 'pay', label: 'Partially Payments' },
                    { value: 'rec', label: 'Received' },
                    { value: 'recei', label: 'Partially received' },
                    { value: 'due', label: 'Past due' },
                  ]}
                />
              </SoftBox>
            </SoftBox> */}
        </SoftBox>

        {loader ? (
          <Box className="centerspinner">
            <Spinner />
          </Box>
        ) : (
          <SoftBox
            py={0}
            px={0}
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
            {errorComing ? (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>

                <h3 className="no-data-text-I">NO DATA FOUND</h3>
              </SoftBox>
            ) : (
              <>
                {pageState.loader && <Spinner />}
                {!pageState.loader && (
                  <DataGrid
                    sx={{ cursor: 'pointer' }}
                    columns={columns}
                    rows={pageState.datRows}
                    getRowId={(row) => row.orderNumber}
                    rowCount={parseInt(pageState.total)}
                    loading={pageState.loader}
                    pagination
                    page={pageState.page - 1}
                    pageSize={pageState.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      setPageState((old) => ({ ...old, page: newPage + 1 }));
                    }}
                    onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                    onCellClick={(rows) => navigateToDetailsPage(rows.row['orderNumber'])}
                    disableSelectionOnClick
                  />
                )}
              </>
            )}
          </SoftBox>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};
