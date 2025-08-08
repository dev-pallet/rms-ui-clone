import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { Box, Chip, Divider, Grid, Menu, MenuItem, Modal, Stack, Tooltip } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import {
  exportItemWiseReport,
  exportTaxInvoice,
  getOrderTimeLine,
  getsalesorderdetailsvalue,
  salesPartialPayment,
  salesPaymentRequest,
  soCreateComment,
  sogetAllComment,
  updateOrderTimeline,
} from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { convertUTCtoIST, isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import MobileDrawerCommon from '../../../../Common/MobileDrawer';
import AdditionalDetails from '../../../../Common/new-ui-common-components/additional-details';
import CommentComponent from '../../../../Common/new-ui-common-components/comment-component';
import CommonDataGrid from '../../../../Common/new-ui-common-components/common-datagrid';
import CommonTimeLine from '../../../../Common/new-ui-common-components/timeline';
import FormField from '../../../../purchase-bills/components/FormField';
import {
  additionalInfoArray,
  additionalInfoPOSArray,
  completeDetailColumns,
  createAdditionalDetailsArray,
  createGridChipArray,
  createIndentDetailsChipArray,
  createMetricsData,
  createPosArray,
  discountArray,
  limitedDetailColumns,
  renderDiscountDetails,
  renderItemDetails,
  renderReturnDetails,
  renderShipmentDetails,
  returnArray,
  shipmentArray,
} from './components/additionalData';
import BillingAddress from './components/addressCard';
import BillingDataRow from './components/billingData';
import './index.css';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';
import SoftInput from '../../../../../../components/SoftInput';
import OrderMobileDetailsPage from './mobileDetails';

const SalesOrderDetailsPage = () => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const { orderId } = useParams();
  const [additionalDetailsArray, setAdditionalDetailsArray] = useState([]);
  const [allData, setAllData] = useState();
  const [orderDate, setOrderDate] = useState({
    date: '',
    time: '',
  });
  const [paymentDate, setPaymentDate] = useState({
    date: '',
    time: '',
  });
  const [fileLoader, setFileLoader] = useState(false);
  const [salesChannel, setSalesChannel] = useState();
  const [infoDetails, setInfoDetails] = useState({});
  const [timelineArray, setTimelineArray] = useState([]);
  const [timelineLoader, setTimelineLoader] = useState(false);
  const [packageLoader, setPackageLoader] = useState(false);
  const [transitLoader, setTransitLoader] = useState(false);
  const [deliveredLoader, setDeliveredLoader] = useState(false);
  const [quoteLoader, setQuoteLoader] = useState(false);
  const [addressDetails, setAddressDetails] = useState();
  const [detailsSelectedValue, setDetailsSelectedValue] = useState('');
  const [gridSelectedValue, setGridsSelectedValue] = useState('order_details');
  const [detailedView, setDeatiledView] = useState(false);
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [shipmentData, setShipmentData] = useState([]);
  const [returnData, setReturnDate] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loader, setLoader] = useState(false);
  const [comments, setComments] = useState([]);
  const [createdComment, setCreatedComment] = useState('');
  const [commentLoader, setCommentLoader] = useState(false);
  const [getCommentsLoader, setGetCommentsLoader] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({ value: 'CASH', label: 'Cash' });
  const [payLoader, setPayLoader] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [itemWiseReportLoader, setItemWiseReportLoader] = useState(false);

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };
  const openMenu = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePurchaseIdCopy = () => {
    navigator.clipboard.writeText(orderId);
    showSnackbar('Copied', 'success');
  };

  const gridChipArray = createGridChipArray(salesChannel);

  const array = useMemo(() => createAdditionalDetailsArray(allData), [allData]);

  const posArray = useMemo(() => createPosArray(allData), [allData]);

  const indentDetailsChipArray = createIndentDetailsChipArray(addressDetails, salesChannel);

  const metricsData = createMetricsData(allData);

  const returnInitiatedby = [
    { label: 'Mahesh', value: allData?.returnDetails?.updatedBy || 'NA' },
    {
      label: 'Date',
      value: allData?.returnDetails?.updatedDate ? convertUTCtoIST(allData?.returnDetails?.updatedDate) : 'NA',
    },
    { label: 'Source', value: salesChannel },
  ];
  const refundInitiatedby = [
    { label: 'Mahesh', value: '' },
    { label: 'Date', value: '1 May, 2024' },
    { label: 'Mode', value: 'Refund to source' },
  ];

  useEffect(() => {
    setLoader(true);
    getsalesorderdetails();
    setTimelineLoader(true);
    timelineFunction();
    fetchComments();
  }, []);

  const contentMap = {
    order_details: itemData,
    discount: discountData,
    shipment: shipmentData,
    returns: returnData,
  };

  const renderMap = {
    order_details: renderItemDetails,
    discount: renderDiscountDetails,
    shipment: renderShipmentDetails,
    returns: renderReturnDetails,
  };
  const currentData = contentMap[gridSelectedValue] || [];
  const renderFunction =
    renderMap[gridSelectedValue] ||
    (() => (
      <div className="no-data-purchase">
        <span>No data found</span>
      </div>
    ));

  const timelineSalesStatus = (statusName, userName, reason, date) => {
    switch (statusName) {
      case 'CREATED':
        return {
          name: 'Created',
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'PENDING':
        return {
          name: 'Pending',
          iconColor: '#f08a09',
          icon: <HourglassTopIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'PARTIAL_PAYMENT_COMPLETED':
        return {
          name: 'Partial payment completed',
          iconColor: '#f08a09',
          icon: <AttachMoneyIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'PAYMENT_COMPLETED':
        return {
          name: 'Payment success',
          iconColor: '#4cd964',
          icon: <AttachMoneyIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'PAYMENT_FAILED':
        return {
          name: 'Paqyment failed',
          iconColor: '#ff3b30',
          icon: <AttachMoneyIcon />,
          userDesc: `By-  ${userName}`,
          dateTime: `${date}`,
        };
      case 'SHIPMENT_CREATED':
        return {
          name: 'Shipment created',
          iconColor: '367df3',
          icon: <LocalShippingIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'LOYALTY_REWARD_SUCCESS':
        return {
          name: 'Loyalty reward success',
          iconColor: '#4fb061',
          icon: <LoyaltyOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'LOYALTY_REWARD_FAILED':
        return {
          name: 'Loyalty reward failed',
          iconColor: '#ff3b30',
          icon: <LoyaltyOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'PACKAGED':
        return {
          name: 'Packaged',
          iconColor: '#0562fb',
          icon: <InventoryIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'IN_TRANSIT':
        return {
          name: 'In-Transit',
          iconColor: '#0562fb',
          icon: <LocalShippingIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'INVENTORY_CONSUMED':
        return {
          name: 'Inventory consumed',
          iconColor: '#0562fb',
          icon: <InventoryIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'INVENTORY_CONSUMPTION_FAILED':
        return {
          name: 'Inventory consumtion failed',
          iconColor: '#ff3b30',
          icon: <InventoryIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'INVENTORY_RESTOCKED':
        return {
          name: 'Inventory restocked',
          iconColor: '#4cd964',
          icon: <InventoryIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'TAX_INVOICE_GENERATED':
        return {
          name: 'Tax Invoice Generated',
          iconColor: '#0562fb',
          icon: <ReceiptOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'TAX_INVOICE_GENERATED_FAILED':
        return {
          name: 'Tax Invoice Generation failed',
          iconColor: '#ff3b30',
          icon: <ReceiptOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'DELIVERED':
        return {
          name: 'Delivered',
          iconColor: '#4fb061',
          icon: <DoneAllIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'LOYALTY_REWARDED':
        return {
          name: 'Loyalty rewarded',
          iconColor: '#4fb061',
          icon: <LoyaltyIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'LOYALTY_REDEEMED':
        return {
          name: 'Loyalty redeemed',
          iconColor: '#0562fb',
          icon: <LoyaltyIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'LOYALTY_REVERTED':
        return {
          name: 'Loyalty reverted',
          iconColor: '#ff3b30',
          icon: <DoneAllIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'DYNAMIC_COUPON_GENERATED':
        return {
          name: 'Dynamic coupon generated',
          iconColor: '#4fb061',
          icon: <ConfirmationNumberIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'RETURN_INITIATED':
        return {
          name: 'Return Initiated',
          iconColor: '#0562fb',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'RETURN_COMPLETED':
        return {
          name: 'Return success',
          iconColor: '#4cd964',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'RETURN_REJECTED':
        return {
          name: 'Return rejected',
          iconColor: '#ff3b30',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By-  ${userName}`,
          dateTime: `${date}`,
        };
      case 'RETURN_CANCELLED':
        return {
          name: 'Return cancelled',
          iconColor: '#ff3b30',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By-  ${userName}`,
          dateTime: `${date}`,
        };
      case 'CANCELLED':
        return {
          name: 'Cancelled',
          iconColor: '#ff3b30',
          icon: <CancelOutlinedIcon />,
          userDesc: `By-  ${userName}`,
          reason: reason,
          dateTime: `${date}`,
        };
      default:
        return {
          name: 'Unknown status',
          iconColor: '#0562fb',
          icon: '',
          userDesc: 'Unknown User',
          dateTime: 'Unknown Date',
        };
    }
  };

  const timelineFunction = () => {
    getOrderTimeLine(orderId)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message || 'Some error occured', 'error');
          setTimelineLoader(false);
          return;
        }
        const response = res?.data?.data;
        if (response?.timeLine?.length === 0) {
          setDeatiledView(true);
          setTimelineLoader(false);
          return;
        }
        const timelineData = response?.timeLine?.map((item, index) => {
          // Format the parsed date
          const parsedTimestamp = convertUTCtoIST(item?.updateAt);
          const status = timelineSalesStatus(
            //getting status object for timeline .ie name, icon, userDesc, dateTime
            item?.fulfilmentStatus,
            item?.updatedBy,
            item?.reason || null,
            parsedTimestamp,
          );
          return {
            id: index,
            ...status,
          };
        });
        setTimelineArray(timelineData);
        setTimelineLoader(false);
      })
      .catch((err) => {
        setTimelineLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const getsalesorderdetails = () => {
    getsalesorderdetailsvalue(orderId)
      .then((res) => {
        const response = res?.data?.data;
        if (res?.data?.status === 'ERROR') {
          showSnackbar(rs?.data?.message || 'Some error occured', 'error');
          return;
        }
        setAllData(response);
        setPaidAmount(response?.baseOrderResponse?.outstandingAmount || 0);
        const purdchaseOrderAddress = {
          billingAddress: response?.addressEntityModel?.billingAddress || null,
          shippingAddress: response?.addressEntityModel?.shippingAddress || null,
        };
        const newDate = response?.baseOrderResponse?.createdAt
          ? convertUTCtoIST(response?.baseOrderResponse?.createdAt)
          : 'NA';
        if (newDate !== 'NA') {
          const parts = newDate.split(',');
          const datePart = parts[0].trim();
          const yearPart = parts[1].trim();
          const timePart = parts[2].trim();
          setOrderDate({ date: `${datePart}, ${yearPart}`, time: timePart });
        }
        const newPaymentDate = response?.baseOrderResponse?.paymentTime
          ? convertUTCtoIST(response?.baseOrderResponse?.paymentTime)
          : 'NA';
        if (newPaymentDate !== 'NA') {
          const parts = newPaymentDate.split(',');
          const datePart = parts[0].trim();
          const yearPart = parts[1].trim();
          const timePart = parts[2].trim();
          setPaymentDate({ date: `${datePart}, ${yearPart}`, time: timePart });
        }
        setAddressDetails(purdchaseOrderAddress);
        const itemData = response?.baseOrderResponse?.orderItemList?.map((item, index) => ({
          id: index,
          title: item?.productName || 'NA',
          barcode: item?.gtin || 'NA',
          mrp: item?.mrp || 0,
          rate: item?.sellingPrice || 0,
          quantity: item?.quantity || 0,
          quantityFullfilled: item?.quantityFulfilled || item?.quantityReceived || 0,
          fillRate: item?.fillRate ?? '0%',
          totalAmount: item?.subTotal || 0,
          tax: item?.igst || 0,
          cess: item?.cess || 0,
          purchasePrice: item?.purchasePrice || 0,
          offers: item?.offerValue || 0,
          discount: item?.discountPrice || 0,
          finalSalePrice: item?.finalSalePrice || 0,
          taxableValue: item?.taxableValue || 0,
        }));
        setItemData(itemData);
        if (response?.discountDetails?.discounts?.length > 0) {
          const disData = response?.discountDetails?.discounts?.map((item, index) => ({
            id: index,
            discountType: item?.discountType || 'NA',
            title: item?.title || 'NA',
            discountValue: item?.discount || 0,
            products: item?.numberOfProducts || 0,
            quantity: item?.quantity || 0,
            amount: item?.amount || 0,
          }));
          setDiscountData(disData);
        }
        if (response?.shipmentDetails?.shipmentStatus) {
          const shipmentArray = Object.entries(response?.shipmentDetails)?.map(([key, value], index) => ({
            id: index,
            field: key,
            value: value !== null ? value : 'NA',
          }));
          setShipmentData(shipmentArray);
        }
        if (response?.returnDetails?.returnedItems?.length > 0) {
          const retData = response?.returnDetails?.returnedItems?.map((item, index) => ({
            id: index,
            title: item?.productName || 'NA',
            barcode: item?.gtin || 'NA',
            orderQuantity: item?.quantityOrdered || 'NA',
            salePrice: item?.sellingPrice || 0,
            returnQuantity: item?.quantityBySpecs || 0,
            deliveryTime: item?.deliveryTime || 'NA',
            amount: item?.subTotal || 0,
          }));

          setReturnDate(retData);
        }
        setSalesChannel(response?.baseOrderResponse?.salesChannel);
        if (response?.baseOrderResponse?.salesChannel === 'POS_ORDER') {
          const updatedAdditionalInfoArray = additionalInfoPOSArray?.map((info) => {
            switch (info.infoName) {
              case 'Channel':
                return {
                  ...info,
                  infoValue:
                    response?.baseOrderResponse?.salesChannel === 'B2C_ORDER'
                      ? response?.baseOrderResponse?.salesChannel
                      : textFormatter(response?.baseOrderResponse?.salesChannel) || 'NA',
                };
              case 'Payment mode':
                return { ...info, infoValue: response?.orderBillingDetails?.paymentMode || 'NA' };
              case 'Order Type':
                return { ...info, infoValue: response?.orderBillingDetails?.orderType || 'NA' };
              case 'Session ID':
                return { ...info, infoValue: response?.orderBillingDetails?.sessionId || 'NA' };
              case 'Terminal':
                return { ...info, infoValue: response?.baseOrderResponse?.licenseName || 'NA' };
              case 'Cashier':
                return { ...info, infoValue: response?.baseOrderResponse?.createdBy || 'NA' };
              default:
                return info;
            }
          });
          setAdditionalDetailsArray(updatedAdditionalInfoArray);
        } else {
          const updatedAdditionalInfoArray = additionalInfoArray?.map((info) => {
            switch (info.infoName) {
              case 'Channel':
                return {
                  ...info,
                  infoValue:
                    response?.baseOrderResponse?.salesChannel === 'B2C_ORDER'
                      ? response?.baseOrderResponse?.salesChannel
                      : textFormatter(response?.baseOrderResponse?.salesChannel) || 'NA',
                };
              case 'Payment mode':
                return { ...info, infoValue: response?.orderBillingDetails?.paymentMode };
              case 'PO date':
                return {
                  ...info,
                  infoValue: response?.baseOrderResponse?.poDate
                    ? formatDate(response?.baseOrderResponse?.poDate)
                    : 'NA',
                };
              case 'PO number':
                return { ...info, infoValue: response?.baseOrderResponse?.poNumber || 'NA' };
              case 'Payment due on':
                return {
                  ...info,
                  infoValue: response?.baseOrderResponse?.paymentDueOn
                    ? formatDate(response?.baseOrderResponse?.paymentDueOn)
                    : 'NA',
                };
              case 'Shipment':
                return { ...info, infoValue: response?.baseOrderResponse?.shipmentType || 'NA' };
              case 'Cancelled reason':
                return { ...info, infoValue: response?.baseOrderResponse?.cancelReason || 'NA' };
              default:
                return info;
            }
          });
          setAdditionalDetailsArray(updatedAdditionalInfoArray);
        }
        const totalQuantity = itemData?.reduce((accumulator, item) => {
          return (accumulator += item?.quantity);
        }, 0);
        if (response?.baseOrderResponse?.salesChannel === 'POS_ORDER') {
          setInfoDetails({
            coupons: response?.orderBillingDetails?.couponValue ?? 'NA',
            earnedLoyalty: response?.orderBillingDetails?.earnedPointValue ?? 'NA',
            discount: response?.discountDetails?.totalDiscount ?? 0,
            returns: response?.returnDetails?.refundAmount ?? 0,
            redeemLoyalty: response?.orderBillingDetails?.loyaltyPoints ?? 'NA',
            quantity: totalQuantity ?? 0,
          });
        } else {
          setInfoDetails({
            poValue: response?.baseOrderResponse?.poValue ?? 'NA',
            fillRate: response?.baseOrderResponse?.fillRate ?? 'NA',
            discount: response?.discountDetails?.totalDiscount || 0,
            returns: response?.baseOrderResponse?.refund || 0,
            addtionalCharge: response?.baseOrderResponse?.additionalExpenses || 0,
            quantity: totalQuantity || 0,
          });
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const addressChipOnClick = (value) => {
    setDetailsSelectedValue(value);
    setOpenDetailsDrawer(true);
  };

  const gridChipOnClick = (value) => {
    setGridsSelectedValue(value);
    if (value !== 'order_details') {
      setDeatiledView(false);
    }
  };
  const detailChipOnClick = (value) => {
    setDeatiledView(value);
  };

  const handleExportItemWiseReport = async () => {
    setItemWiseReportLoader(true);
  
    const payload = {
      locationId: locId,
      orderId: orderId,
      orgId: orgId,
      frequency: 'day',
      reportType: 'ITEM_WISE_INVOICE',
      exportType: 'excel',
      createdBy: userName,
    };
  
    try {
      const res = await exportItemWiseReport(payload);
      const docUrl = res?.data?.data?.docUrl;
  
      if (docUrl) {
        const link = document.createElement('a');
        link.href = docUrl;
        link.setAttribute('download', 'report.xlsx'); // optional, for hinting
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showSnackbar('Report is being generated', 'success');
      }
    } catch (error) {
      showSnackbar('Report generation failed', 'error');
    } finally {
      setItemWiseReportLoader(false);
    }
  };
   

  const handleDownload = async () => {
    setQuoteLoader(true);
    const payload = {
      orderId: orderId,
      orderType: salesChannel === 'POS_ORDER' ? 'POS_ORDER' : salesChannel,
    };
    try {
      const response = await exportTaxInvoice(payload);
      setQuoteLoader(false);
      if (response?.data?.status === 'ERROR') {
        showSnackbar(response?.data?.message || 'Some error occured', 'error');
        return;
      }
      const newblob = await response.blob();
      const headers = response.headers;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = `Tax invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setAnchorEl(null);
    } catch (err) {
      setQuoteLoader(false);
      showSnackbar('Payment Needs to be confirmed', 'error');
    }
  };

  const handleStatusChange = (value) => {
    if (value === 'PACKAGED') {
      setPackageLoader(true);
    } else if (value === 'IN_TRANSIT') {
      setTransitLoader(true);
    } else if (value === 'DELIVERED') {
      setDeliveredLoader(true);
    }
    const payload = {
      orderId: orderId,
      orderStatus: value,
      updatedBy: userName,
    };
    updateOrderTimeline(payload)
      .then((res) => {
        setPackageLoader(false);
        setTransitLoader(false);
        setDeliveredLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message || 'Some error occured', 'error');
          return;
        }
        setAnchorEl(null);
        timelineFunction();
        getsalesorderdetails();
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        setPackageLoader(false);
        setTransitLoader(false);
        setDeliveredLoader(false);
      });
  };

  const fetchComments = () => {
    setGetCommentsLoader(true);
    sogetAllComment(orderId)
      .then((res) => {
        const commentsData = res?.data?.data?.comments?.map((item, index) => ({
          id: index,
          comment: item?.comment,
          commentedBy: item?.createdBy,
          commentId: item?.commentId,
        }));
        setComments(commentsData);
        handleAddComment('');
        setGetCommentsLoader(false);
      })
      .catch((err) => {
        setComments([]);
        setGetCommentsLoader(false);
      });
  };

  const handleAddComment = (value) => {
    setCreatedComment(value);
  };

  const handleCreateComment = () => {
    if (createdComment == '') {
      return;
    }
    setCommentLoader(true);
    const commentPayload = {
      orderId: orderId,
      createdBy: userName,
      commentType: 'ORDER',
      comment: createdComment,
    };
    if (salesChannel === 'POS_ORDER') {
      commentPayload.orderType = 'POS_ORDER';
    } else if (salesChannel === 'DIRECT') {
      commentPayload.orderType = 'SALES_ORDER';
    } else if (salesChannel === 'B2C_ORDER') {
      commentPayload.orderType = 'B2C_ORDER';
    } else if (salesChannel === 'B2B_ORDER') {
      commentPayload.orderType = 'B2B_ORDER';
    }
    soCreateComment(commentPayload)
      .then((res) => {
        fetchComments();
        setCommentLoader(false);
      })
      .catch((err) => {
        setCommentLoader(false);
      });
  };

  const handleEdit = () => {
    localStorage.setItem('cartId-SO', allData?.baseOrderResponse?.cartId);
    localStorage.setItem('sales_OrderId', orderId);
    navigate('/sales/all-orders/new');
  };

  const handleReturn = () => {
    navigate(`/sales/returns/add/${orderId}`);
  };

  const handlePayment = () => {
    setOpenPaymentModal(true);
  };

  const handleSubmitPyament = () => {
    if (allData?.baseOrderResponse?.outstandingAmount === 0) {
      showSnackbar('Payment already completed', 'error');
      return;
    }
    if (paymentMethod.value === '') {
      showSnackbar('Select payment method', 'warning');
    } else if (paidAmount === 0) {
      showSnackbar('Enter amount', 'warning');
    } else {
      setPayLoader(true);
      if (Number(paidAmount) < allData?.baseOrderResponse?.outstandingAmount && salesChannel !== 'B2C_ORDER') {
        const payload = {
          orderId: orderId,
          amount: paidAmount,
          paymentMethod: paymentMethod.value,
          paymentMode: 'OFFLINE',
          licenseId: allData?.baseOrderResponse?.licenseId,
          sessionId: allData?.baseOrderResponse?.sessionId,
          loggedInUserId: uidx,
          tender: allData?.baseOrderResponse?.tender,
          balance: allData?.baseOrderResponse?.balance,
          machineCode: allData?.baseOrderResponse?.machineCode,
        };
        salesPartialPayment(payload)
          .then((res) => {
            if (res?.data?.status === 'ERROR') {
              showSnackbar(res?.data?.message || 'Some error occured', 'error');
              return;
            }
            if (res?.data?.data?.es > 0) {
              showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
              return;
            }
            setPayLoader(false);
            setAnchorEl(null);
            showSnackbar(res?.data?.data?.paymentStatus, 'success');
            timelineFunction();
            getsalesorderdetails();
            handleClosePaymentModal();
          })
          .catch((err) => {
            setPayLoader(false);
            showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
          });
      } else {
        const payload = {
          referenceId: orderId,
          paymentMethod: paymentMethod.value,
          paymentMode: 'OFFLINE',
          amountPaid: paidAmount,
          paymentStatus: 'COMPLETED',
          paymentType: 'MANUAL',
        };

        salesPaymentRequest(payload)
          .then((res) => {
            if (res?.data?.status === 'ERROR') {
              showSnackbar(res?.data?.message || 'Some error occured', 'error');
              return;
            }
            if (res?.data?.data?.es > 0) {
              showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
              return;
            }
            setPayLoader(false);
            setAnchorEl(null);
            showSnackbar(res?.data?.data?.message || 'Payment completed', 'success');
            timelineFunction();
            getsalesorderdetails();
            handleClosePaymentModal();
          })
          .catch((err) => {
            setPayLoader(false);
            showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
          });
      }
    }
  };

  const handleInvoiceDownload = async () => {
    const payload = {
      orderId: orderId,
      orderType: salesChannel,
    };
    setFileLoader(true);
    try {
      const response = await exportTaxInvoice(payload);
      setFileLoader(false);
      if (response?.data?.status === 'ERROR') {
        showSnackbar(response?.data?.message || 'Some error occured', 'error');
        return;
      }
      const newblob = await response.blob();
      const headers = response.headers;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = `Tax invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setAnchorEl(null);
    } catch (err) {
      setFileLoader(false);
      showSnackbar('Payment Needs to be confirmed', 'error');
    }
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const day = date?.getDate();
    const month = date?.toLocaleString('default', { month: 'long' });
    const year = date?.getFullYear();

    // Function to add suffix to the day
    const getDayWithSuffix = (day) => {
      if (day > 3 && day < 21) {
        return day + 'th';
      }
      switch (day % 10) {
        case 1:
          return day + 'st';
        case 2:
          return day + 'nd';
        case 3:
          return day + 'rd';
        default:
          return day + 'th';
      }
    };

    const formattedDay = getDayWithSuffix(day);
    return `${formattedDay} ${month}, ${year}`;
  }

  const billingDataRowsOrder = useMemo(() => {
    const rows = [
      { label: 'Subtotal', value: allData?.orderBillingDetails?.subTotal || 0 },
      { label: 'Discount', value: allData?.discountDetails?.totalDiscount || 0 },
      { label: 'IGST', value: allData?.orderBillingDetails?.igst || 0 },
      { label: 'SGST', value: allData?.orderBillingDetails?.sgst || 0 },
      { label: 'CGST', value: allData?.orderBillingDetails?.cgst || 0 },
      { label: 'CESS', value: allData?.orderBillingDetails?.cess || 0, hasDivider: true },
    ];

    // Only include Grand Total if not mobile
    if (isMobileDevice) {
      rows.push({
        label: 'Total',
        value: allData?.orderBillingDetails?.grandTotal || 0,
      });
    } else {
      rows.push({
        label: <b>Total</b>,
        value: <b>{allData?.orderBillingDetails?.grandTotal || 0}</b>,
        hasDivider: true,
      });
    }
    return rows;
  }, [allData]);

  const billingDataRowsB2C = useMemo(() => {
    const rows = [
      { label: 'Subtotal', value: allData?.orderBillingDetails?.subTotal || 0 },
      { label: 'Tax (GST)', value: allData?.orderBillingDetails?.igst || 0 },
      { label: 'Coupon', value: `(- ${allData?.orderBillingDetails?.couponValue || 0})` },
      { label: 'Loyalty Points Redeemed', value: `(- ${allData?.orderBillingDetails?.loyaltyPointsValue || 0})` },
      { label: 'Wallet Balance Used', value: `(- ${allData?.orderBillingDetails?.redeemableWalletBalance || 0})` },
      { label: 'Delivery Charges', value: allData?.orderBillingDetails?.deliveryCharges || 0, hasDivider: true },
    ];

    // Only include Grand Total if not mobile
    if (isMobileDevice) {
      rows.push({
        label: 'Grand Total',
        value: allData?.orderBillingDetails?.grandTotal || 0,
      });
    } else {
      rows.push({
        label: <b>Grand Total</b>,
        value: <b>{allData?.orderBillingDetails?.grandTotal || 0}</b>,
        hasDivider: true,
      });
    }

    return rows;
  }, [allData]);

  const billingDataRowsReturn = useMemo(() => {
    const rows = [
      { label: 'Discount corrections', value: allData?.returnDetails?.discountCorrections || 0 },
      { label: 'Pickup charges', value: allData?.returnDetails?.pickUpCharges || 0 },
      { label: 'Taxable value', value: allData?.returnDetails?.totalTaxableValue || 0 },
      { label: 'IGST', value: allData?.returnDetails?.igst || 0 },
      { label: 'SGST', value: allData?.returnDetails?.sgst || 0 },
      { label: 'CGST', value: allData?.returnDetails?.cgst || 0 },
      { label: 'Delivery Charges', value: allData?.orderBillingDetails?.deliveryCharges || 0, hasDivider: true },
    ];

    // Only include Grand Total if not mobile
    if (isMobileDevice) {
      rows.push({
        label: 'Total',
        value: allData?.returnDetails?.refundAmount || 0,
      });
    } else {
      rows.push({
        label: <b>Total</b>,
        value: <b>{allData?.returnDetails?.refundAmount || 0}</b>,
        hasDivider: true,
      });
    }

    return rows;
  }, [allData]);

  return (
    <DashboardLayout>
      {!isMobileDevice ? (
        <>
          <DashboardNavbar prevLink={true} />
          <div>
            <div className="purchDet-main-info-container component-bg-br-sh-p">
              <div className="purchDet-main-info-main-div">
                <div className="purchDet-main-info">
                  <div className="title-menu-main-container-mobile">
                    <div className="purchDet-id-main-conatiner">
                      <h1 className="purchase-id">Order ID {orderId}</h1>
                      <ContentCopyIcon
                        className="copy-icon"
                        sx={{ cursor: 'pointer' }}
                        onClick={handlePurchaseIdCopy}
                      />
                      <span
                        className={
                          allData?.baseOrderResponse?.fulfilmentStatus === 'DELIVERED'
                            ? 'order-status-box-success'
                            : 'order-status-box-pending'
                        }
                      >
                        {textFormatter(allData?.baseOrderResponse?.fulfilmentStatus) || 'NA'}
                      </span>
                      {loader && <Spinner size={20} />}
                    </div>
                    <div className="menu-icon-div-mobile">
                      <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        {[
                          salesChannel === 'DIRECT' && <MenuItem onClick={handleEdit}>Edit</MenuItem>,
                          salesChannel === 'DIRECT' &&
                            allData?.baseOrderResponse?.fulfilmentStatus === 'DELIVERED' &&
                            allData?.baseOrderResponse?.outstandingAmount === 0 && (
                              <MenuItem onClick={handleReturn}>Return</MenuItem>
                            ),
                          payLoader ? (
                            <Spinner size={20} key="pay-spinner" />
                          ) : (
                            <MenuItem onClick={handlePayment}>Payment</MenuItem>
                          ),
                          packageLoader ? (
                            <Spinner size={20} key="package-spinner" />
                          ) : (
                            <MenuItem onClick={() => handleStatusChange('PACKAGED')} key="package-menu-item">
                              Packaged
                            </MenuItem>
                          ),
                          transitLoader ? (
                            <Spinner size={20} key="transit-spinner" />
                          ) : (
                            <MenuItem onClick={() => handleStatusChange('IN_TRANSIT')} key="transit-menu-item">
                              In-transit
                            </MenuItem>
                          ),
                          deliveredLoader ? (
                            <Spinner size={20} key="delivered-spinner" />
                          ) : (
                            <MenuItem onClick={() => handleStatusChange('DELIVERED')} key="delivered-menu-item">
                              Delivered
                            </MenuItem>
                          ),
                          <Divider key="divider" className="common-divider-mob" />,
                          quoteLoader ? (
                            <Spinner size={20} key="quote-spinner" />
                          ) : (
                            <MenuItem key="quote" onClick={handleDownload}>
                              {allData?.baseOrderResponse?.paymentStatus === 'PAYMENT_PENDING' ? 'Quote ' : 'Invoice '}
                              <span style={{ fontSize: '20px' }}>
                                <DownloadIcon fontSize="12px" color="success" />
                              </span>
                            </MenuItem>
                          ),
                          itemWiseReportLoader ? (
                            <Spinner size={20} key="quote-spinner" />
                          ) : (
                          <MenuItem key="itemWiseReport" onClick={handleExportItemWiseReport}>
                            Export
                            <span style={{ fontSize: '20px' }}>
                              <DownloadIcon fontSize="12px" color="success" />
                            </span>
                          </MenuItem>
                          )
                        ]}
                      </Menu>
                    </div>
                  </div>
                  {openPaymentModal && (
                    <Modal
                      open={openPaymentModal}
                      onClose={handleClosePaymentModal}
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
                          maxWidth: '300px',
                        }}
                      >
                        <Grid container spacing={1} p={1}>
                          <Grid item xs={12} md={12}>
                            <FormField
                              type="number"
                              label="Amount to be paid"
                              value={allData?.baseOrderResponse?.outstandingAmount || 0}
                              disabled
                            />
                          </Grid>
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
                              isDisabled={allData?.baseOrderResponse?.outstandingAmount === 0 ? true : false}
                              options={[
                                { value: 'CASH', label: 'Cash' },
                                { value: 'CHEQUE', label: 'Cheque' },
                                { value: 'BANK TRNASFER', label: 'Bank Transfer' },
                                { value: 'CREDIT CARD', label: 'Credit card' },
                                { value: 'DEBIT CARD', label: 'Debit card' },
                              ]}
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e)}
                            />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <FormField
                              type="number"
                              disabled={allData?.baseOrderResponse?.outstandingAmount === 0 ? true : false}
                              label="Amount"
                              placeholder="Rs."
                              value={paidAmount}
                              onChange={(e) => setPaidAmount(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <SoftBox className="header-submit-box">
                              <SoftButton className="vendor-second-btn" onClick={handleClosePaymentModal}>
                                Cancel
                              </SoftButton>
                              {payLoader ? (
                                <Spinner size={20} />
                              ) : (
                                <SoftButton className="vendor-add-btn" onClick={handleSubmitPyament}>
                                  Save
                                </SoftButton>
                              )}
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                  )}
                  <div className="purchDet-id-main-conatiner">
                    <span className="purchDet-vendorName-value-title approval-info-title" style={{ width: '100%' }}>
                      Created by: {allData?.baseOrderResponse?.createdBy || 'NA'}
                    </span>
                  </div>
                  <div className="purchDet-id-main-container">
                    <span className="purchDet-vendorName-value-title approval-info-title" style={{ width: '100%' }}>
                      Tax invoice{': '}
                      {allData?.baseOrderResponse?.invoiceId ? (
                        <>
                          {allData?.baseOrderResponse?.invoiceId}{' '}
                          {allData?.baseOrderResponse?.invoiceId &&
                            (fileLoader ? (
                              <div>
                                <Spinner size={20} />
                              </div>
                            ) : (
                              <FileDownloadIcon
                                color="success"
                                onClick={handleInvoiceDownload}
                                sx={{ cursor: 'pointer', fontSize: '20px' }}
                              />
                            ))}
                        </>
                      ) : (
                        'NA'
                      )}
                    </span>
                  </div>
                  <div className="purchDet-vendor-name" style={{ width: '400px' }}>
                    <span className="purchDet-vendorName-value-title approval-info-title">Customer name</span>
                    <span
                      className="purchDet-vendorName-value-title approval-info-title cursor-pointer"
                      style={{ color: '#367df3', width: '100%' }}
                      onClick={() => {
                        if (
                          allData?.baseOrderResponse?.salesChannel === 'B2C_ORDER' &&
                          allData?.baseOrderResponse?.mobileNumber &&
                          allData?.baseOrderResponse?.customerId
                        ) {
                          navigate(
                            `/customer/details?phoneNumber=${allData?.baseOrderResponse?.mobileNumber}&customerId=${allData?.baseOrderResponse?.customerId}`,
                          );
                          return;
                        }

                        if(
                          allData?.baseOrderResponse?.salesChannel === 'POS_ORDER' &&
                          allData?.baseOrderResponse?.customerId
                        ){
                          navigate(`/customer/details?uidx=${allData?.baseOrderResponse?.customerId}`);
                          return;
                        }

                        if(
                          allData?.baseOrderResponse?.salesChannel === 'DIRECT' &&
                          allData?.baseOrderResponse?.customerId
                        ){
                          navigate(`/customer/details?retailId=${allData?.baseOrderResponse?.customerId}`)
                        }
                      }}
                    >
                      {allData?.baseOrderResponse?.customerName || 'WALK-IN'}
                    </span>
                  </div>
                </div>
                <div className="purchDet-main-tools">
                  <div className="purchDet-main-aprroval-info">
                    <div className="purchDet-estimated-value">
                      <span className="purchDet-vendorName-value-title">Order Value</span>
                      <span className="estimated-value">₹{allData?.orderBillingDetails?.grandTotal || 'NA'}</span>
                    </div>
                    <div className="purchDet-approval-info-details">
                      <div className="purchDet-approval-info-span-div">
                        <span className="purchDet-vendorName-value-title approval-info-title">Order date</span>
                        <span className="purchDet-vendorName-value-title">{orderDate?.date || 'NA'}</span>
                      </div>
                      <div className="purchDet-approval-info-span-div">
                        <span className="purchDet-vendorName-value-title approval-info-title">Order time</span>
                        <span className="purchDet-vendorName-value-title">{orderDate?.time || 'NA'}</span>
                      </div>
                      <div className="purchDet-approval-info-span-div">
                        <span className="purchDet-vendorName-value-title approval-info-title">Shipment date</span>
                        <span className="purchDet-vendorName-value-title">
                          {allData?.baseOrderResponse?.shipmentDate
                            ? formatDate(allData?.baseOrderResponse?.shipmentDate)
                            : 'NA'}
                        </span>
                      </div>
                      <div className="purchDet-approval-info-span-div">
                        <span className="purchDet-vendorName-value-title approval-info-title">Payment status</span>
                        <span
                          className={`purchDet-vendorName-value-title ${
                            allData?.baseOrderResponse?.paymentStatus === 'COMPLETED'
                              ? 'order-status-box-success'
                              : 'order-status-box-pending'
                          }`}
                        >
                          {textFormatter(allData?.baseOrderResponse?.paymentStatus) || 'NA'}
                        </span>
                      </div>
                      {salesChannel === 'POS_ORDER' ? (
                        <>
                          {/* <div className="purchDet-approval-info-span-div">
                          <span className="purchDet-vendorName-value-title approval-info-title">Store</span>
                          <span className="purchDet-vendorName-value-title">{'NA'}</span>
                        </div> */}
                          <div className="purchDet-approval-info-span-div">
                            <span className="addDet-value approval-info-title">Order time</span>
                            <span className="sales-order-quick-link-text" style={{ marginLeft: '0px' }}>
                              {allData?.baseOrderResponse?.fulfilmentTime || 'NA'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="purchDet-approval-info-span-div">
                            <span className="purchDet-vendorName-value-title approval-info-title">Payment date</span>
                            <span className="purchDet-vendorName-value-title">{paymentDate?.date || 'NA'}</span>
                          </div>
                          <div className="purchDet-approval-info-span-div">
                            <span className="purchDet-vendorName-value-title approval-info-title">Total savings</span>
                            <span className="purchDet-vendorName-value-title">
                              ₹ {allData?.orderBillingDetails?.totalSavings || '0'}
                            </span>
                          </div>
                          {/* <div className="purchDet-approval-info-span-div">
                          <span className="purchDet-vendorName-value-title approval-info-title">Payment time</span>
                          <span className="purchDet-vendorName-value-title">{paymentDate?.time || 'NA'}</span>
                        </div> */}
                          <div className="purchDet-approval-info-span-div">
                            <span className="addDet-value approval-info-title">Fulfillment time</span>
                            <span className="sales-order-quick-link-text" style={{ marginLeft: '0px' }}>
                              {allData?.baseOrderResponse?.fulfilmentTime || 'NA'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="menu-icon-div">
                    <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
                  </div>
                </div>
              </div>

              <div className="additional-info-main-container">
                {additionalDetailsArray?.map((info) => {
                  if (info.infoName === 'Cancelled reason' && info?.infoValue === 'NA') {
                    return;
                  }
                  return (
                    <div className="purchDet-header-additional-info">
                      <span className="additionalInfo-title">{info?.infoName}</span>
                      <span className="purchDet-vendorName-value-value second-tooltip-container">
                        {info?.infoValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* AdditionalDetails */}
            <AdditionalDetails
              additionalDetailsArray={salesChannel === 'POS_ORDER' ? posArray : array}
              additionalDetails={infoDetails}
            />
            <div className="indent-details-main-container">
              {!detailedView && <span className="purch-det-heading-title">Order Timeline</span>}
              <div className="indent-details-main-div">
                {!detailedView && (
                  <div className="purchase-details-timeline component-bg-br-sh-p">
                    <CommonTimeLine
                      timelineArray={timelineArray}
                      timelineLoader={timelineLoader}
                      purchaseId={orderId}
                      timelineFunction={timelineFunction}
                    />
                  </div>
                )}
                <div
                  className="purchase-details-data"
                  style={{
                    marginTop: !addressDetails && '-50px',
                    flex: detailedView ? '1' : '0.8',
                  }}
                >
                  <div className="vendor-details-pi" style={{ justifyContent: 'flex-start', marginBottom: '25px' }}>
                    {/* CommonAddressCard 1 */}
                    {addressDetails?.billingAddress && (
                      <>
                        <BillingAddress
                          title="Billing Address"
                          addressData={allData?.addressEntityModel?.billingAddress}
                        />
                      </>
                    )}
                    {/* CommonAddressCard 2 */}
                    {addressDetails?.shippingAddress && (
                      <>
                        <BillingAddress
                          title="Shipping Address"
                          addressData={allData?.addressEntityModel?.shippingAddress}
                        />
                      </>
                    )}
                    {/* Quick link */}
                    {/* <div className="sales-order-quick-link-box">
                      <span className="sales-order-quick-link-text">Quick links</span>
                      <div className="quick-link-box">
                        <div className="sales-order-quick-icon">
                          <LocalShippingIcon sx={{ color: '#2782a7' }} />
                        </div>
                        <div className="sales-order-quick-icon">
                          <CurrencyRupeeIcon sx={{ color: '#4cd964' }} />
                        </div>
                        <div className="sales-order-quick-icon">
                          <ReceiptLongIcon sx={{ color: '#007aff' }} />
                        </div>
                      </div>
                      <br />
                      <div className="quick-link-box">
                        <div className="sales-order-quick-icon">
                          <AssignmentReturnIcon sx={{ color: '#5856d6' }} />
                        </div>
                        <div className="sales-order-quick-icon">
                          <CurrencyExchangeIcon sx={{ color: '#ff3b30' }} />
                        </div>
                        <div className="sales-order-quick-icon">
                          <RepeatOneIcon sx={{ color: '#367df3' }} />
                        </div>
                      </div>
                    </div> */}
                    {salesChannel === 'POS_ORDER' && (
                      <>
                        <div className="sales-order-quick-link-box">
                          <span className="sales-order-quick-link-text">Cart Metrics</span>
                          <div style={{ padding: '10px' }}>
                            {metricsData.map((metric) => {
                              return (
                                <Grid container p={0.2} key={metric.label}>
                                  <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Stack alignItems={'flex-start'}>
                                      <span className="card-small-title">{metric.label}</span>
                                    </Stack>
                                  </Grid>
                                  <Grid item lg={4} md={4} sm={4} xs={4}>
                                    <Stack alignItems={'flex-start'}>
                                      <span className="card-small-title">{metric.value}</span>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              );
                            })}
                          </div>
                        </div>
                        <div className="sales-order-quick-link-box">
                          <span className="sales-order-quick-link-text">Cart Search Items</span>
                          <div style={{ padding: '10px' }}>
                            {allData?.cartMetrics?.cartSearchedItems ? (
                              allData?.cartMetrics?.cartSearchedItems?.map((item) => {
                                return (
                                  <Grid container p={0.2} key={item.label}>
                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                      <Stack alignItems={'flex-start'}>
                                        <span className="card-small-title">{item.label}</span>
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                );
                              })
                            ) : (
                              <SoftTypography fontSize="14px" sx={{ marginLeft: '50px', marginTop: '30px' }}>
                                No item found
                              </SoftTypography>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="purchase-details-datagrid">
                    <div className="pinsghts-title-main-container grid-boxes-flex">
                      <div className="vendor-details-pi">
                        {gridChipArray.map((item, index) => {
                          return (
                            <>
                              {item.toShow && (
                                <Chip
                                  label={item.chipName}
                                  className="chip-style-purchase"
                                  sx={{
                                    border:
                                      gridSelectedValue === item.chipValue
                                        ? '1px solid #0562fa !important'
                                        : '1px solid #505050 !important',
                                    color:
                                      gridSelectedValue === item.chipValue
                                        ? '#0562fa !important'
                                        : '#505050 !important',
                                  }}
                                  variant="outlined"
                                  onClick={() => gridChipOnClick(item.chipValue)}
                                />
                              )}
                            </>
                          );
                        })}
                      </div>
                      {gridSelectedValue === 'order_details' &&
                        timelineArray?.length > 0 &&
                        (detailedView ? (
                          <div onClick={() => setDeatiledView(false)}>
                            <CloseIcon fontSize="12px" sx={{ cursor: 'pointer' }} />
                          </div>
                        ) : (
                          <Chip
                            label={'Detailed view'}
                            className="chip-style-purchase"
                            sx={{
                              border: '1px solid #0562fa !important',
                              color: '#0562fa !important',
                            }}
                            variant="outlined"
                            onClick={() => detailChipOnClick(true)}
                          />
                        ))}
                    </div>
                  </div>
                  <CommonDataGrid
                    columns={
                      gridSelectedValue === 'order_details'
                        ? detailedView
                          ? completeDetailColumns
                          : limitedDetailColumns
                        : gridSelectedValue === 'discount'
                        ? discountArray
                        : gridSelectedValue === 'shipment'
                        ? shipmentArray
                        : returnArray
                    }
                    rows={currentData}
                    rowCount={currentData?.length}
                    disableSelectionOnClick
                  />

                  {/* Billing and Transaction data */}
                  {gridSelectedValue === 'order_details' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px',
                        marginTop: '20px',
                        width: '850px',
                        marginLeft: 'auto',
                        marginRight: '0',
                      }}
                    >
                      {' '}
                      {allData?.orderBillingDetails?.payments?.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            height: '220px',
                            overflow: 'auto',
                          }}
                        >
                          {allData?.orderBillingDetails?.payments?.length
                            ? allData?.orderBillingDetails?.payments?.map((data, index) => {
                                return (
                                  <div
                                    className="transaction-history-data"
                                    style={{
                                      width: '500px',
                                      marginTop: '20px',
                                    }}
                                  >
                                    <Tooltip title={data?.paymentMethod}>
                                      <div>
                                        {data?.paymentMethod === 'CASH' ? (
                                          <CurrencyRupeeRoundedIcon className="transaction-visa-icon-order" />
                                        ) : (
                                          <CreditCardOutlinedIcon className="transaction-visa-icon-order" />
                                        )}
                                      </div>
                                    </Tooltip>
                                    <div className="transaction-text-order" style={{ width: '80%' }}>
                                      <div>
                                        <b>Transaction ID: </b>
                                        {data?.paymentId?.length > 28 ? (
                                          <Tooltip title={data?.paymentId}>
                                            {data?.paymentId?.slice(0, 28) + '...'}
                                          </Tooltip>
                                        ) : (
                                          data?.paymentId || 'NA'
                                        )}
                                      </div>
                                      <div>{convertUTCtoIST(data?.paymentDate) || 'Date: NA'}</div>
                                    </div>
                                    <div className="transaction-text-order">
                                      <b>
                                        ₹
                                        {data?.amountPaid?.length > 7 ? (
                                          <Tooltip title={data?.amountPaid}>
                                            {data?.amountPaid?.slice(0, 7) + '...'}
                                          </Tooltip>
                                        ) : (
                                          data?.amountPaid || 0
                                        )}
                                      </b>
                                    </div>
                                    <div
                                      className={
                                        data?.paymentStatus === 'COMPLETED'
                                          ? 'transaction-success-order'
                                          : 'transaction-failed-order'
                                      }
                                      style={{ marginRight: '10px' }}
                                    >
                                      {data?.paymentStatus === 'COMPLETED' ? 'Success' : data?.paymentStatus}
                                    </div>
                                    {/* <MoreHorizIcon color="info" sx={{ marginRight: '10px' }} /> */}
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      )}
                      <div
                        className="sales-order-item-bill-data"
                        style={{
                          width: '262px',
                          marginTop: '20px',
                          marginLeft: allData?.orderBillingDetails?.payments?.length === 0 && 'auto',
                          marginRight: allData?.orderBillingDetails?.payments?.length === 0 && '0',
                          height: 'auto',
                        }}
                      >
                        {salesChannel === 'B2C_ORDER' ? (
                          <>
                            {billingDataRowsB2C?.map((bill, index) => (
                              <BillingDataRow
                                key={index}
                                label={bill.label}
                                value={bill.value}
                                hasDivider={bill.hasDivider}
                              />
                            ))}
                          </>
                        ) : (
                          <>
                            {billingDataRowsOrder?.map((bill, index) => (
                              <BillingDataRow
                                key={index}
                                label={bill.label}
                                value={bill.value}
                                hasDivider={bill.hasDivider}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    gridSelectedValue === 'returns' && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '10px',
                          marginTop: '20px',
                          width: '850px',
                          marginLeft: 'auto',
                          marginRight: '0',
                        }}
                      >
                        <div>
                          {allData?.returnDetails?.refund?.length > 0 && (
                            <div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1px',
                                  height: '90px',
                                  overflow: 'auto',
                                }}
                              >
                                {allData?.returnDetails?.refund?.length
                                  ? allData?.returnDetails?.refund?.map((data, index) => {
                                      return (
                                        <div
                                          className="transaction-history-data"
                                          style={{
                                            width: '500px',
                                            marginTop: '20px',
                                          }}
                                        >
                                          <Tooltip title={data?.refundMode}>
                                            <div>
                                              {data?.refundMode === 'CASH' ? (
                                                <CurrencyRupeeRoundedIcon className="transaction-visa-icon-order" />
                                              ) : (
                                                <CreditCardOutlinedIcon className="transaction-visa-icon-order" />
                                              )}
                                            </div>
                                          </Tooltip>
                                          <div className="transaction-text-order" style={{ width: '80%' }}>
                                            <div>
                                              <b>Transaction ID: </b>
                                              {data?.transactionCode?.length > 28 ? (
                                                <Tooltip title={data?.transactionCode}>
                                                  {data?.transactionCode?.slice(0, 28) + '...'}
                                                </Tooltip>
                                              ) : (
                                                data?.transactionCode || 'NA'
                                              )}
                                            </div>
                                            <div>{convertUTCtoIST(data?.createdDate) || 'Date: NA'}</div>
                                          </div>
                                          <div className="transaction-text-order">
                                            <b>
                                              ₹
                                              {data?.refundAmount?.length > 7 ? (
                                                <Tooltip title={data?.refundAmount}>
                                                  {data?.refundAmount?.slice(0, 7) + '...'}
                                                </Tooltip>
                                              ) : (
                                                data?.refundAmount || 0
                                              )}
                                            </b>
                                          </div>
                                          <div
                                            className={
                                              data?.status === 'COMPLETED'
                                                ? 'transaction-success-order'
                                                : 'transaction-failed-order'
                                            }
                                            style={{ marginRight: '10px' }}
                                          >
                                            {data?.status === 'COMPLETED' ? 'Success' : data?.status}
                                          </div>
                                          {/* <MoreHorizIcon color="info" sx={{ marginRight: '10px' }} /> */}
                                        </div>
                                      );
                                    })
                                  : null}
                              </div>
                            </div>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              margin: 'auto',
                              marginTop: '10px',
                              gap: '10px',
                              width: '100%',
                            }}
                          >
                            <div className="sales-order-quick-link-box" style={{ height: '150px', width: '227px' }}>
                              <span className="sales-order-quick-link-text">Return initiated by</span>
                              <div style={{ padding: '10px' }}>
                                {returnInitiatedby.map((metric) => {
                                  return (
                                    <Grid container p={0.2} key={metric.label}>
                                      <Grid item lg={4} md={4} sm={4} xs={4}>
                                        <Stack alignItems={'flex-start'}>
                                          <span className="card-small-title">{metric.label}</span>
                                        </Stack>
                                      </Grid>
                                      <Grid item lg={8} md={8} sm={8} xs={8}>
                                        <Stack alignItems={'flex-start'}>
                                          <span className="card-small-title">{metric.value}</span>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="sales-order-quick-link-box" style={{ height: '150px', width: '227px' }}>
                              <span className="sales-order-quick-link-text">Refund initiated by</span>
                              <div style={{ padding: '10px' }}>
                                {refundInitiatedby.map((metric) => {
                                  return (
                                    <Grid container p={0.2} key={metric.label}>
                                      <Grid item lg={4} md={4} sm={4} xs={4}>
                                        <Stack alignItems={'flex-start'}>
                                          <span className="card-small-title">{metric.label}</span>
                                        </Stack>
                                      </Grid>
                                      <Grid item lg={8} md={8} sm={8} xs={8}>
                                        <Stack alignItems={'flex-start'}>
                                          <span className="card-small-title">{metric.value}</span>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="sales-order-item-bill-data"
                          style={{
                            width: '300px',
                            height: '230px',
                            marginTop: '20px',
                            alignContent: 'center',
                          }}
                        >
                          {billingDataRowsReturn?.map((bill, index) => (
                            <BillingDataRow
                              key={index}
                              label={bill.label}
                              value={bill.value}
                              hasDivider={bill.hasDivider}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {/* COMMENTS */}
                  <div
                    style={{
                      marginTop: '20px',
                      width: '850px',
                      marginLeft: 'auto',
                      marginRight: '0',
                    }}
                  >
                    <CommentComponent
                      commentData={comments}
                      addCommentFunction={handleAddComment}
                      handleSend={handleCreateComment}
                      loader={commentLoader}
                      getCommentsLoader={getCommentsLoader}
                      createdComment={createdComment}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <OrderMobileDetailsPage
            loader={loader}
            orderId={orderId}
            allData={allData}
            handlePayment={handlePayment}
            handleStatusChange={handleStatusChange}
            handleInvoiceDownload={handleInvoiceDownload}
            fileLoader={fileLoader}
            deliveredLoader={deliveredLoader}
            handlePurchaseIdCopy={handlePurchaseIdCopy}
            additionalDetailsArray={additionalDetailsArray}
            orderDate={orderDate}
            salesChannel={salesChannel}
            formatDate={formatDate}
            posArray={posArray}
            array={array}
            infoDetails={infoDetails}
            metricsData={metricsData}
            addressDetails={addressDetails}
            timelineArray={timelineArray}
            timelineLoader={timelineLoader}
            timelineFunction={timelineFunction}
            gridChipArray={gridChipArray}
            gridChipOnClick={gridChipOnClick}
            gridSelectedValue={gridSelectedValue}
            currentData={currentData}
            comments={comments}
            handleAddComment={handleAddComment}
            handleCreateComment={handleCreateComment}
            commentLoader={commentLoader}
            getCommentsLoader={getCommentsLoader}
            createdComment={createdComment}
            renderFunction={renderFunction}
            billingDataRowsB2C={billingDataRowsB2C}
            billingDataRowsOrder={billingDataRowsOrder}
            billingDataRowsReturn={billingDataRowsReturn}
          />

          <MobileDrawerCommon
            anchor="bottom"
            paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
            drawerOpen={openPaymentModal}
            drawerClose={() => {
              handleClosePaymentModal();
            }}
            overflowHidden={true}
          >
            <div className="mob-drawer-main-box">
              <div className="mob-drawer-heading">Payment</div>
              <div className="mob-drawer-item-main-box">
                <div>Amount to be paid</div>
                <SoftInput disabled value={allData?.baseOrderResponse?.outstandingAmount || 0} />
                <div>Payment Method</div>
                <div style={{ width: '100%' }}>
                  <SoftSelect
                    isDisabled={allData?.baseOrderResponse?.outstandingAmount === 0 ? true : false}
                    options={[
                      { value: 'CASH', label: 'Cash' },
                      { value: 'CHEQUE', label: 'Cheque' },
                      { value: 'BANK TRNASFER', label: 'Bank Transfer' },
                      { value: 'CREDIT CARD', label: 'Credit card' },
                      { value: 'DEBIT CARD', label: 'Debit card' },
                    ]}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e)}
                  />
                </div>
                <div>Amount</div>
                <SoftInput
                  disabled={allData?.baseOrderResponse?.outstandingAmount === 0 ? true : false}
                  value={paidAmount}
                  placeholder="Rs."
                  onChange={(e) => setPaidAmount(e.target.value)}
                />

                {/* <Grid container spacing={1} p={1}>
            <Grid item xs={12} md={12}>
              <FormField
                type="number"
                label="Amount to be paid"
                value={allData?.baseOrderResponse?.outstandingAmount || 0}
                disabled
              />
            </Grid>
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
            </Grid>
            <Grid item xs={12} md={12}>
              <FormField
                type="number"
                disabled={allData?.baseOrderResponse?.outstandingAmount === 0 ? true : false}
                label="Amount"
                placeholder="Rs."
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </Grid>
          </Grid> */}
              </div>
              <div className="header-submit-box">
                <CustomMobileButton title="Cancel" variant="black-S" onClickFunction={handleClosePaymentModal} />
                <CustomMobileButton
                  title="Save"
                  variant="blue-D"
                  loading={payLoader}
                  onClickFunction={handleSubmitPyament}
                />
              </div>
            </div>
          </MobileDrawerCommon>
        </>
      )}
    </DashboardLayout>
  );
};

export default SalesOrderDetailsPage;
