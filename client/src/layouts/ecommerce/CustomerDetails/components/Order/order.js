import './order.css';
import { dateFormatter, isSmallScreen, noDatagif } from '../../../Common/CommonFunction';
import { getCustomerOrders } from '../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import SoftBox from 'components/SoftBox';
import Spinner from 'components/Spinner/index';
import moment from 'moment';
import CommonDataGrid from '../../../Common/new-ui-common-components/common-datagrid';
import dayjs from 'dayjs';
import ViewMore from '../../../Common/mobile-new-ui-components/view-more';

export const Order = ({customerId}) => {
  // const { retailId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const retailId = query.get('retailId');
  const navigate = useNavigate();
  const [errorComing, setErrorComing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [pageState, setPageState] = useState({
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 10,
  });
  const isMobileDevice = isSmallScreen();
  const [showViewMore, setShowViewMore] = useState(false);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);

  const locId = localStorage.getItem('locId');

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 200,
    },
    {
      field: 'id',
      headerName: 'Order ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 200,
    },
    // {
    //   field: 'customerName',
    //   headerName: 'Customer Name',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   width: 200,
    // },
    // {
    //   field: 'items',
    //   headerName: 'Items',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   width: 200,
    // },
    {
      field: 'channel',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 200,
    },
    {
      field: 'location',
      headerName: 'Location',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 200,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 200,
    },
  ];

  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();

    let formattedDate = moment(stillUtc).local().format('L, LT').split(',');
    formattedDate[0] = dateFormatter(formattedDate[0]);
    formattedDate = formattedDate.join(',');

    return formattedDate;
  };

  useEffect(() => {
    const filterObj = {
      page: pageState?.page,
      pageSize: pageState?.pageSize,
      destinationId: customerId || retailId ? '' : locId,
      userId: customerId || retailId,
    };

    setLoader(true);
    getCustomerOrders(filterObj)
      .then((response) => {
        const orderData = response?.data?.data?.orderResponse2List;
        let orderTableData = [];
        if (orderData?.length) {
          orderTableData = orderData?.map((row, index) => ({
            date: row?.baseOrderResponse?.createdAt ? dayjs(row?.baseOrderResponse?.createdAt).format('D MMM, YYYY, h:mm A') : 'N/A',
            id: row?.baseOrderResponse ? row?.baseOrderResponse?.orderId : 'N/A',
            customerName: row.baseOrderResponse ? row.baseOrderResponse.userName : 'N/A',
            channel: row?.baseOrderResponse ? row?.baseOrderResponse?.salesChannel : '',
            location: row?.addressEntityModel?.billingAddress?.city || 'N/A',
            amount: row?.baseOrderResponse ? '₹' + row?.orderBillingDetails?.grandTotal?.toString() : 'N/A',
            status: row?.baseOrderResponse ? row?.baseOrderResponse?.orderStatus : 'N/A',
          }));
        }

        const showViewMoreButton = (filterObj?.page + 1) * filterObj?.pageSize < response?.data?.data?.totalResults;
        setShowViewMore(showViewMoreButton);

        if(isMobileDevice){
          setOrdersData((prev) => ([...prev, ...orderTableData]));
        }else{
          setOrdersData(orderTableData);
        }
        setPageState((prev) => ({...prev, totalPages: response?.data?.data?.totalPages, totalResults: response?.data?.data?.totalResults}))
        setLoader(false);
        setViewMoreLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setErrorComing(true);
        setViewMoreLoader(false);
        setOrdersData([])
      });
  }, [pageState?.page]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);

  const handleCellClick = (rows) => {
    const orderId = rows?.row?.id;
    navigate(`/order/details/${orderId}`);
  };

  return (
    <>
      {!isMobileDevice ?
      <SoftBox className="softbox-box-shadow" sx={{padding:"26px 10px"}}>
        <Box sx={{ height: 400, width: '100%' }}>
          {errorComing || (!loader && !ordersData?.length) ? (
            <SoftBox className="No-data-text-box">
              <SoftBox className="src-imgg-data">
                <img className="src-dummy-img" src={noDatagif} />
              </SoftBox>

              <h3 className="no-data-text-I">NO DATA FOUND</h3>
            </SoftBox>
          ) : (
            <>
              {loader && <Spinner />}
              {!loader && ordersData?.length && (
                // <DataGrid
                //   rows={ordersData}
                //   columns={columns}
                //   pageSize={5}
                //   rowsPerPageOptions={[5]}
                //   // checkboxSelection
                //   disableSelectionOnClick
                //   onCellClick={(rows) => handleCellClick(rows)}
                // />
                <CommonDataGrid 
                  rows={ordersData || []} 
                  columns={columns} 
                  page={pageState?.page}
                  pageSize={pageState?.pageSize}
                  getRowId={(row) => row?.id}
                  pagination
                  disableSelectionOnClick
                  onCellClick={(rows) => handleCellClick(rows)}
                  rowCount={pageState?.totalResults}
                  paginationMode="server"
                  onPageChangeFunction={(newPage) => 
                    setPageState((prev) => ({...prev, page: newPage}))
                  }
                />
              )}
            </>
          )}
        </Box>
      </SoftBox>
      :
      <>
        {loader && <Spinner />}
        <div className='job-listing-main-div'>
          <div className='stock-count-title-div'>
            <span className='stock-count-title'>Orders</span>
          </div>
          <div className='job-list-card-main'>
            {ordersData?.map((el) =>
                <div className='job-card' onClick={() => handleCellClick({row: {id: el?.id} })}> 
                  <div className='stack-row-center-between width-100'>
                    <div className='flex-colum-align-start'>
                      <span className='bill-card-label'>Customer Name</span>
                      <span className='bill-card-value'>{el?.customerName || 'N/A'}</span>
                    </div>
                    <div className='flex-colum-align-start'>
                      <span className='bill-card-label'>Order Id</span>
                      <span className='bill-card-value'>{el?.id || 'N/A'}</span>
                    </div>
                  </div>
                  <div className='stack-row-center-between width-100'>
                    <div className='flex-colum-align-start'>
                      <span className='bill-card-label'>Amount</span>
                      <span className='bill-card-value'>{el?.amount || 'N/A'}</span>
                    </div>
                    <div className='flex-colum-align-start'>
                      <span className='bill-card-label'>Channel</span>
                      <span className='bill-card-value'>{el?.channel || 'N/A'}</span>
                    </div>
                  </div>
                  <div className='stack-row-center-between width-100'>
                    <div className='flex-colum-align-start'>
                      <span className='bill-card-label'>Location</span>
                      <span className='bill-card-value'>{el?.location || 'N/A'}</span>
                    </div>
                    <div className='flex-colum-align-start'>
                      <span className='bill-card-label'>Status</span>
                      <span className='bill-card-value'>{el?.status || 'N/A'}</span>
                    </div>
                  </div>
                  <div className='stack-row-center-between width-100'>
                    <div className='flex-colum-align-start'>
                      <span className='bill-card-label'>Date</span>
                      <span className='bill-card-value'>{el?.date || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )
            }
            {showViewMore &&
              <ViewMore loading={viewMoreLoader} handleNextFunction={() => {
                setViewMoreLoader(true);
                setPageState((prev)=> ({...prev, page: prev?.page + 1}))
              }}/>
            }
          </div>
        </div>
      </>
      }
    </>
  );
}
