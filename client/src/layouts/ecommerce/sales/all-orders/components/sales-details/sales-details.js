import './sales-details.css';
import { Box, Divider, Menu, MenuItem, Modal } from '@mui/material';
import {
  cancelMarketplaceOrder,
  exportTaxInvoice,
  getOrderTimeLine,
  getsalesorderdetailsvalue,
  salesPaymentRequest,
  updateOrderTimeline,
} from '../../../../../../config/Services';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import FormField from '../../../../purchase-bills/components/FormField';
import Grid from '@mui/material/Grid';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OrderDetailspage from '../sales-details/components/order-details/index';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import Timeline from '../sales-details/components/timeline/index';
import TimelineList from '../../../../../../examples/Timeline/TimelineList';

export const SalesDetails = () => {
  const { orderId } = useParams();
  const showSnackbar = useSnackbar();
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const [timelineloader, setTimelineloader] = useState(true);
  const [datRows, setTableRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loader, setLoader] = useState(false);
  const [timelineStatus, setTimelineStatus] = useState(false);
  const [responseTrue, setResponseTrue] = useState(false);
  const [allResponse, setAllResponse] = useState({});
  const [locationId, setLocationId] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [actions, setActions] = useState(false);
  const [isPosOrder, setIsPosOrder] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [fulfilmentStatus, setFulfilmentStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [cartId, setCartId] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);
  const [returnItem, setReturnItem] = useState(false);
  const [orderType , setOrderType] = useState('');
  const user_roles = localStorage.getItem('user_roles');

  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const userName = localStorage.getItem('user_name');

  const handlePaymentModal = () => {
    setPaymentModal(true);
  };
  const handleCloseModal = () => {
    setPaymentModal(false);
  };

  useEffect(() => {
    orderTimeLine();
  }, []);

  useEffect(() => {
    if (user_roles?.includes('SUPER_ADMIN')) {
      setIsSuperAdmin(true);
    }
  }, []);

  const orderTimeLine = () => {
    getOrderTimeLine(orderId)
      .then((res) => {
        setTimelineloader(false);
        setTableRows(res?.data?.data?.timeLine);
      })
      .catch((err) => {
        setTimelineloader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  useEffect(() => {
    setLoader(true);
    getsalesorderdetails();
  }, [timelineStatus]);

  const getsalesorderdetails = () => {
    getsalesorderdetailsvalue(orderId)
      .then((res) => {
        setCustomerName(res?.data?.data?.baseOrderResponse?.customerName);
        setLoggedInUserId(res?.data?.data?.baseOrderResponse?.loggedInUserId);
        if (res?.data?.data?.baseOrderResponse?.salesChannel === 'PALLET_POS') {
          setIsPosOrder(true);
        } else {
          setIsPosOrder(false);
        }
        if (res?.data?.data?.baseOrderResponse?.destinationLocationId === locId) {
          setLocationId(true);
        } else if (res?.data?.data?.baseOrderResponse?.sourceLocationId === locId) {
          setLocationId(false);
        }
        setAllResponse(res?.data?.data);
        setFulfilmentStatus(res?.data?.data?.baseOrderResponse?.fulfilmentStatus);
        setPaymentStatus(res?.data?.data?.baseOrderResponse?.paymentStatus);
        setOrderType(res?.data?.data?.baseOrderResponse?.salesChannel);
        setCartId(res?.data?.data?.baseOrderResponse?.cartId);
        setLoader(false);
        setResponseTrue(true);
      })
      .catch((error) => {
        setLoader(false);
        showSnackbar(error?.response?.data?.message, 'error');
      });
  };

  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderTimelineItems = datRows.map(({ fulfilmentStatus, updateAt, updatedBy }) => (
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
  useEffect(() => {}, [timelineStatus]);
  const updateOrderStatus = (payload) => {
    updateOrderTimeline(payload)
      .then((res) => {
        setTimelineStatus(true);
        orderTimeLine();
        getsalesorderdetails();
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setLoader(false);
      });
  };

  const handleEdit = () => {
    localStorage.setItem('cartId-SO', cartId);
    localStorage.setItem('sales_OrderId', orderId);
    navigate('/sales/all-orders/new');
  };

  const handlRefund = () => {};

  const handleReturn = () => {
    setAnchorEl(null);
    setReturnItem(true);
    showSnackbar('Select product to return', 'info');
  };
  const handleCancelReturn = () => {
    setAnchorEl(null);
    setReturnItem(false);
  };

  const handlePackaged = () => {
    setLoader(true);
    const payload = {
      orderId: orderId,
      orderStatus: 'PACKAGED',
      updatedBy: userName,
    };
    updateOrderStatus(payload);
    setAnchorEl(null);
  };

  const handleShipment = () => {};

  const handleInTransit = () => {
    setLoader(true);
    const payload = {
      orderId: orderId,
      orderStatus: 'IN_TRANSIT',
      updatedBy: userName,
    };
    updateOrderStatus(payload);
    setAnchorEl(null);
  };
  const handleDelivered = () => {
    setLoader(true);
    const payload = {
      orderId: orderId,
      orderStatus: 'DELIVERED',
      updatedBy: userName,
    };
    updateOrderStatus(payload);
    setAnchorEl(null);
  };

  useEffect(() => {}, [actions]);

  const handleCancelOrder = () => {
    setLoader(true);
    setActions(true);
    setAnchorEl(null);
    cancelMarketplaceOrder(orderId, loggedInUserId)
      .then((res) => {
        setTimelineStatus(true);
        setLoader(false);
        orderTimeLine();
        getsalesorderdetails();
        showSnackbar('Order Cancelled successfull', 'success');
      })
      .catch((err) => {
        setLoader(false);
        if (err?.response?.data?.code !== 404) {
          showSnackbar(err?.response?.data?.message, 'error');
        } else {
          showSnackbar('Some error occured', 'error');
        }
      });
  };

  const handleInvoice = async () => {
    const payload = {
      orderId: orderId,
      orderType : orderType === 'PALLET_POS' ? 'POS_ORDER' : orderType
    };
    try {
      const response = await exportTaxInvoice(payload);
      const newblob = await response.blob();
      const headers = response.headers;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = `TaxInvoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showSnackbar('Payment Needs to be confirmed', 'error');
    }
  };

  const handlePayment = () => {
    const payload = {
      referenceId: orderId,
      paymentMethod: paymentMethod,
      paymentMode: 'OFFLINE',
      // "transactionCode": "string",
      amountPaid: paidAmount,
      paymentStatus: 'COMPLETED',
      paymentType: 'MANUAL',
    };
    handleCloseModal();
    salesPaymentRequest(payload)
      .then((res) => {
        showSnackbar(res?.data?.data?.message, 'success');
        getsalesorderdetails();
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleShipmentModal = () => {};

  const isMobileDevice = isSmallScreen();

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Sales Order Details'} prevLink={true} />
        </SoftBox>
      )}
      <>
        <SoftBox
          className={`${!isMobileDevice ? 'bills-details-top-box' : 'bills-details-mob'}`}
          // sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',marginTop: '20px' }}
        >
          <SoftBox className="bills-details-inner-left-box-PI">
            <SoftTypography
              className={`${isMobileDevice ? 'bills-details-typo-mobile' : 'bills-details-typo'}`}
            >{`${customerName} (Order ID- ${orderId})`}</SoftTypography>
          </SoftBox>
          <SoftBox className={`${isMobileDevice ? 'sales-details-btn-div' : 'bills-details-inner-right-box'}`}>
            {paymentStatus !== 'COMPLETED' && !isPosOrder && (
              <SoftButton
                // className="vendor-second-btn"
                variant="solidBlueBackground"
                onClick={handlePaymentModal}
              >
                <AddIcon />
                Payment
              </SoftButton>
            )}
            {permissions?.RETAIL_SalesOrder?.WRITE ||
            permissions?.WMS_SalesOrder?.WRITE ||
            permissions?.VMS_SalesOrder?.WRITE ? (
                <SoftBox className="st-dot-box-I" onClick={handleMenu}>
                  <MoreVertIcon />
                </SoftBox>
              ) : null}
          </SoftBox>

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
            {fulfilmentStatus === 'DELIVERED' ? (
              <>
                {/* <MenuItem onClick={handleReturn}>Return</MenuItem> */}
                {/* {paymentStatus === 'COMPLETED' && <MenuItem onClick={handlRefund}>Refund</MenuItem>} */}
              </>
            ) : !isPosOrder ? (
              <>
                {fulfilmentStatus === 'CREATED' && paymentStatus !== 'COMPLETED' && (
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                )}
                <MenuItem onClick={handlePackaged}>Packaged</MenuItem>
                {/* {fulfilmentStatus === 'PACKAGED' && <MenuItem onClick={handleShipmentModal}>Shipment</MenuItem>} */}
                <MenuItem onClick={handleInTransit}>In-transit</MenuItem>
                <MenuItem onClick={handleDelivered}>Delivered</MenuItem>
                <MenuItem onClick={handleCancelOrder}>Cancel</MenuItem>
              </>
            ) : null}
            <Divider />
            {isPosOrder && isSuperAdmin ? (
              <MenuItem onClick={handleInvoice}>{paymentStatus !== 'COMPLETED' ? 'Quote' : 'Tax Invoice'}</MenuItem>
            ) : !isPosOrder ? (
              <MenuItem onClick={handleInvoice}>{paymentStatus !== 'COMPLETED' ? 'Quote' : 'Tax Invoice'}</MenuItem>
            ) : null}
          </Menu>
          <Modal
            open={paymentModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="modal-pi-border"
          >
            <Box
              className="pi-box-inventory"
              sx={{
                position: 'absolute',
                top: '35%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                overflow: 'auto',
                maxHeight: '80vh',
              }}
            >
              <Grid container spacing={1} p={1}>
                <Box ml={2} mt={0.5}>
                  <Grid item xs={12} md={12}>
                    <SoftTypography fontSize="12px">
                      <b>Order Id:</b> {orderId}{' '}
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftTypography fontSize="12px">
                      <b>Amount to be paid:</b> ₹ {allResponse?.orderBillingDetails?.grandTotal}{' '}
                    </SoftTypography>
                  </Grid>
                </Box>

                <Grid item xs={12} md={12}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Payment Method
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    options={[
                      { value: 'CASH', label: 'Cash' },
                      { value: 'CHEQUE', label: 'Cheque' },
                      { value: 'BANK TRNASFER', label: 'Bank Transfer' },
                      { value: 'CREDIT CARD', label: 'Credit card' },
                      { value: 'DEBIT CARD', label: 'Debit card' },
                    ]}
                    onChange={(e) => setPaymentMethod(e.value)}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <FormField
                    type="number"
                    label="Amount"
                    placeholder="Rs."
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <SoftBox className="header-submit-box">
                    <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                      Cancel
                    </SoftButton>
                    <SoftButton className="vendor-add-btn" onClick={handlePayment}>
                      Save
                    </SoftButton>
                  </SoftBox>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </SoftBox>
        <SoftBox>
          <Grid container spacing={1}>
            <Grid item xs={12} xl={4} mt={3}>
              {!timelineloader ? (
                <TimelineList title={isPosOrder ? 'POS Order Timeline' : 'Sales Order Timeline'}>
                  {renderTimelineItems}
                </TimelineList>
              ) : (
                <Spinner />
              )}
            </Grid>
            {loader && <Spinner size={20} />}
            {responseTrue && (
              <Grid item xs={12} xl={8}>
                <OrderDetailspage
                  loader={loader}
                  allResponse={allResponse}
                  locationId={locationId}
                  handleCancelReturn={handleCancelReturn}
                  returnItem={returnItem}
                />
              </Grid>
            )}
          </Grid>
        </SoftBox>
      </>
    </DashboardLayout>
  );
};
