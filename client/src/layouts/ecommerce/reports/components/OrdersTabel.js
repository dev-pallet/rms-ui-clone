import './OrdersTable.css';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import MuiAlert from '@mui/material/Alert';
import OrderCard from './components/OrderCard/OrderCard';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../components/SoftBox';
import Spinner from '../../../../components/Spinner';
import clsx from 'clsx';
import moment from 'moment';
import useGetDevice from '../hooks/useGetDevice';

const cashIcon =
  'https://static.vecteezy.com/system/resources/previews/005/567/661/original/rupee-icon-indian-currency-symbol-illustration-coin-symbol-free-vector.jpg';
const cardIcon = 'https://pngimg.com/uploads/mastercard/mastercard_PNG24.png';
const upiIcon = 'https://logodix.com/logo/1763598.png';

const OrdersTable = () => {
  const isMobile = useGetDevice();
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const getOrderText = useSelector((state) => state.pagination.order_text);
  const dispatch = useDispatch();

  //snackbar

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 180,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'order_id',
      headerName: 'Order Id',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'invoice_id',
      headerName: 'Invoice Id',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'customer_number_name',
      headerName: 'Customer Number/Name',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'items',
      headerName: 'Items',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{params.value}</span>
          <img
            src={renderPaymentIcon(params.row.paymentMethod)}
            alt=""
            width="20px"
            height="20px"
            style={{ marginLeft: 8 }}
          />
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          Paid: params.value === 'PAID',
          Create: params.value === 'CREATED',
          Adjust: params.value === 'ADJUSTED',
          Pending: params.value === 'PAYMENT_PENDING',
          Cancel: params.value === 'CANCELLED',
          Payment_Cancel: params.value === 'PAYMENT_CANCELLED',
        });
      },
      renderCell: (cellValues) => {
        return (
          <div
            className="table-dark-wrapper"
            style={{
              width: '120px',
              height: '20px',
              backgroundColor: '#F6F6F6',
              borderRadius: '5px',
              textAlign: 'center',
              border: '1px solid lightgreen',
            }}
          >
            {cellValues.value}
          </div>
        );
      },
    },
  ];

  const [dataRows, setTableRows] = useState([]);
  const [noData, setNoData] = useState(false);
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  

  const [orderId, setOrderId] = useState('');
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 8,
    // invoiceId:getOrderText,
  });

  let dataArr,
    dataRow = [];

  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    return moment(stillUtc).local().format('L, LT');
  };

  const locId = localStorage.getItem('locId');
  const retailUserDetails = JSON.parse(localStorage.getItem('retailUserDetails'));
  const uidx = retailUserDetails?.uidx;

  const renderPaymentIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case 'CASH':
        return cashIcon;
      case 'CARD':
        return cardIcon;
      case 'UPI':
        return upiIcon;
      default:
        return '';
    }
  };
  if(getOrderText.length == 0){
    var filterObject = {
      page: pageState.page - 1,
      pageSize: 8,
      locationId: locId,
      orderType: 'POS_ORDER',
      loggedInUserId: uidx,
    // invoiceId: getOrderText,
    };
  }
  else{
    var filterObject ={
      invoiceId: getOrderText,
      page: pageState.page - 1,
      pageSize: 8,
    };
  }
 

 

  useEffect(() => {
    setPageState((old) => ({ ...old, loader: true }));
    setLoading(true);
    getAllOrderlist(filterObject)
      .then((responseTxt) => {
        setAlertmessage('Successfully fetched the orders');
        setTimelineerror('success');
        handleopensnack();
        dataArr = responseTxt?.data?.data?.orderResponseList;
        dataRow.push(
          dataArr?.map((row) => ({
            date: row.baseOrderResponse.createdAt
              ? convertUTCDateToLocalDate(row.baseOrderResponse.createdAt)
              : '-----',
            order_id: row.baseOrderResponse.orderId ? row.baseOrderResponse.orderId : '-----',
            invoice_id: row.baseOrderResponse.invoiceId ? row.baseOrderResponse.invoiceId : '-----',
            customer_number_name:
              row.baseOrderResponse.customerName || row.baseOrderResponse.mobileNumber || '-----',
            items: row.baseOrderResponse.numberOfLineItems
              ? row.baseOrderResponse.numberOfLineItems
              : '-----',
            amount: row.orderBillingDetails.grandTotal
              ? `₹ ${row.orderBillingDetails.grandTotal}`
              : '-----',
            status: row.baseOrderResponse.orderStatus ? row.baseOrderResponse.orderStatus : '-----',
            paymentMethod: row.orderBillingDetails.paymentMethod,
          }))
        );
        setTableRows(dataRow[0]);
        setNoData(false);
        setLoading(false);
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: dataRow[0] || [],
          total: responseTxt?.data?.data?.totalResults || 0,
        }));
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        handleopensnack();
      });
  }, [pageState.page, pageState.pageSize, update, getOrderText]);

  

  const handlePageChange = (event, value) => {
    setPageState((old) => ({ ...old, page: value }));
  };

  const renderOrders = () => {
    if (pageState.loader) {
      return (
        <Box className="order-loader-container">
          <CircularProgress />
        </Box>
      );
    }

    if (!dataRows?.length) {
      return (
        <Box className="order-loader-container">
          <Typography variant="h6">No Orders Found</Typography>
        </Box>
      );
    }

    return (
      <Box className="order-main-container">
        <Box className="order-item-container">
          {dataRows?.map((order, index) => (
            <OrderCard key={index} order={order}  />
          ))}
        </Box>
        <Box className="order-pagination-container">
          <Pagination
            count={Math.ceil(pageState.total / pageState.pageSize)}
            page={pageState.page}
            onChange={handlePageChange}
            shape="rounded"
            color="primary"
            className="order-pagination"
          />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      {isMobile ? (
        renderOrders()
      ) : (
        <SoftBox className="customer-main-box">
          {noData ? (
            <SoftBox className="customer-no-data-box">
              <SoftBox
                sx={{
                  height: '525px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <h3>No Orders Found</h3>
              </SoftBox>
            </SoftBox>
          ) : (
            <SoftBox>
              {pageState.loader ? (
                <SoftBox
                  sx={{
                    height: '525px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spinner />
                </SoftBox>
              ) : (
                <SoftBox sx={{ height: '525px' }}>
                  <DataGrid
                    rows={pageState.datRows}
                    columns={columns}
                    getRowId={(row) => row.order_id}
                    rowCount={parseInt(pageState.total)}
                    loading={pageState.loader}
                    pagination
                    page={pageState.page - 1}
                    pageSize={pageState.pageSize}
                    // initialState={{
                    //   pagination: {
                    //     paginationModel: {
                    //       pageSize: 2,
                    //     },
                    //   },
                    // }}
                    paginationMode="server"
                    // components={{
                    //   Pagination: CustomPagination,
                    // }}
                    onPageChange={(newPage) => {
                      setPageState((old) => ({ ...old, page: newPage + 1 }));
                    }}
                    // onCellClick={(row, event) => orderDetailsPage(row.id, event)}
                    hideScrollbar={true}
                    disableSelectionOnClick
                    autoHeight={true}
                    sx={{
                      '& .super-app.Paid': {
                        color: '#69E86D',
                        fontSize: '1em',
                        fontWeight: '600',
                        margin: '0px auto 0px auto',
                        padding: '5px',
                      },
                      '& .super-app.Create': {
                        color: 'blue',
                        fontSize: '1em',
                        fontWeight: '600',
                        margin: '0px auto 0px auto',
                        padding: '5px',
                      },
                      '& .super-app.Adjust': {
                        color: 'darkred',
                        fontSize: '1em',
                        fontWeight: '600',
                        margin: '0px auto 0px auto',
                        padding: '5px',
                      },
                      '& .super-app.Pending': {
                        color: 'orange',
                        fontSize: '1em',
                        fontWeight: '600',
                        margin: '0px auto 0px auto',
                        padding: '5px',
                      },
                      '& .super-app.Cancel': {
                        color: 'red',
                        fontSize: '1em',
                        fontWeight: '600',
                        margin: '0px auto 0px auto',
                        padding: '5px',
                      },
                      '& .super-app.Payment_Cancel': {
                        color: 'red',
                        fontSize: '.75em',
                        fontWeight: '900',
                        margin: '0px auto 0px auto',
                        padding: '5px',
                      },
                    }}
                  />
                </SoftBox>
              )}
            </SoftBox>
          )}
        </SoftBox>
      )}
      <Drawer
        sx={{ marginTop: '2.8rem', width:'100%', zIndex: '1300' }}
        open={state}
        onClose={() => setState(false)}
        anchor={'right'}
      >
        <OrderDetailsPage
          orderId={orderId}
          setUpdate={setUpdate}
          update={update}
          setState={setState}
          setCustomerPage={()=>{}}
        />
      </Drawer>
    </>
  );
};
export default OrdersTable;