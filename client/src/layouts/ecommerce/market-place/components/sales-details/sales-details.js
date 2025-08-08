import './sales-details.css';
import { Box, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MuiAlert from '@mui/material/Alert';
import OrderDetailspage from '../sales-details/components/order-details/index';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Timeline from '../sales-details/components/timeline/index';

import { cancelMarketplaceOrder, getOrderTimeLine, getsalesorderdetailsvalue, marketplaceInvoice } from '../../../../../config/Services';
import SetInterval from '../../../setinterval';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import TimelineList from '../../../../../examples/Timeline/TimelineList';

export const MarketplaceDetails =()=>{

  const { orderId } = useParams();
  const [timelineloader, setTimelineloader] = useState(true);
  const [datRows, setTableRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loader, setLoader] = useState(false);
  const [timelineStatus, setTimelineStatus] = useState(false);
  const [responseTrue, setResponseTrue] = useState(false);
  const [allResponse, setAllResponse] = useState({});
  const [locationId, setLocationId] = useState(false);
  const [fulfilmentStatus, setFulfilmentStatus] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [actions, setActions] = useState(false);
    
  const locId = localStorage.getItem('locId');
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');
  const [opensnack, setOpensnack] = useState(false);
  const [alertmessage, setAlertmessage] = useState('');
  const [timelinerror, setTimelineerror] = useState('');

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
    
  useEffect(() => {
    orderTimeLine();
  }, []);
    
  const orderTimeLine = () => {
    getOrderTimeLine(orderId).then((res) => {
      setTimelineloader(false);
      setTableRows(res.data.data.timeLine);
    })
      .catch((err) => {
        setTimelineloader(false);
      });
  };

  useEffect(() => {
    setLoader(true);
    getsalesorderdetails();
  }, [timelineStatus]);
      
  const getsalesorderdetails = () => {
    getsalesorderdetailsvalue(orderId)
      .then((res) => {
        setFulfilmentStatus(res.data.data.baseOrderResponse.fulfilmentStatus);
        setCustomerName(res.data.data.baseOrderResponse.customerName);
        if(res.data.data.baseOrderResponse.destinationLocationId === locId){
          setLocationId(true);
        }
        else if(res.data.data.baseOrderResponse.sourceLocationId === locId){
          setLocationId(false);
        }
        setAllResponse(res.data.data);
        setLoader(false);
        setResponseTrue(true);
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderTimelineItems = datRows.map(({fulfilmentStatus, updateAt, updatedBy }) => (
    <Timeline
      key={updateAt}
      updateAt={updateAt}
      updatedBy={updatedBy}
      fulfilmentStatus={fulfilmentStatus}
      color={
        fulfilmentStatus == 'PACKAGED'
          ? 'success'
          : fulfilmentStatus == 'IN_TRANSIT'
            ? 'success'
            : fulfilmentStatus === 'DELIVERED'
              ? 'success'
              : fulfilmentStatus === 'CANCELLED'
                ? 'error'
                : 'info'
      }
      icon="archive"
    />
  ));

  useEffect(() => {

  }, [actions]);

  const handleCancelOrder =() => {
    setLoader(true);
    setActions(true);
    setAnchorEl(null);
    cancelMarketplaceOrder(orderId, uidx).then((res)=>{
      setTimelineStatus(true);
      setLoader(false);
      orderTimeLine();
      getsalesorderdetails();
      setAlertmessage('Order Cancelled successfully');
      setTimelineerror('success');
      SetInterval(handleopensnack());
    })
      .catch((err) => {
        if(err.response.data.code !== 404){
          setAlertmessage(err.response.data.message);
          setTimelineerror('error');
          SetInterval(handleopensnack());
        }
        else{
          setAlertmessage('Some error occured');
          setTimelineerror('error');
          SetInterval(handleopensnack());
        }
      });
  };
      
  const handleInvoice = () => {
    setActions(true);
    marketplaceInvoice(orderId).then((res) => {
      if(res.data.data.url !== null ){
        window.open(res.data.data.url, '_blank');
      }
      else{
        setAlertmessage('Payment Needs to be confirmed');
        setTimelineerror('error');
        SetInterval(handleopensnack());
      }
    });
  };
      

  return(
    <DashboardLayout>
      <DashboardNavbar/>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      {loader 
        ?<Spinner/>
        :   <>
          <Box className="bills-details-top-box bills-details-top-1">
            <Box className="bills-details-inner-left-box-PI">
              <SoftTypography className="bills-details-typo">{`${customerName} (Order ID- ${orderId})`}</SoftTypography>
            </Box>
            <Menu
              id="basic-menu"
              className="menu-box"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleCancelOrder}>Cancel</MenuItem>
              {/* <MenuItem >Exchange or Return</MenuItem> */}
              <MenuItem onClick={handleInvoice}>Tax Invoice</MenuItem>
              {/* <MenuItem >Order Confirmation</MenuItem> */}
            </Menu>
            {permissions?.RETAIL_SalesOrder?.WRITE || permissions?.WMS_SalesOrder?.WRITE || permissions?.VMS_SalesOrder?.WRITE
              ?
              <Box className="st-dot-box-I" onClick={handleMenu}>
                <MoreVertIcon />
              </Box>
              :null
            }
          </Box>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12} xl={4} mt={3}>
                {!timelineloader ? <TimelineList title="Order Timeline">{renderTimelineItems}</TimelineList> : <Spinner />}
              </Grid>
              {responseTrue &&
                                <Grid item xs={12} xl={8}>
                                  <OrderDetailspage loader={loader} allResponse={allResponse} locationId={locationId}/>
                                </Grid>
              }
            </Grid>
          </Box>
        </>
      }
    </DashboardLayout>
     
  );
};