import styled from '@emotion/styled';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import StorefrontIcon from '@mui/icons-material/Storefront';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Badge,
  Box,
  Chip,
  CircularProgress,
  Drawer,
  Grid,
  Menu,
  MenuItem,
  Modal,
  TextareaAutosize,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, parse, parseISO } from 'date-fns';
import FormField from 'layouts/ecommerce/purchase-bills/components/FormField/index';
import { useEffect, useMemo, useState } from 'react';
import { emit } from 'react-native-react-bridge/lib/web';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import UpgradePlan from '../../../../UpgardePlan';
import crownIcon from '../../../../assets/images/crown.svg';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import {
  addaQuote,
  approvedpurchaserequest,
  createComment,
  downloadIndentpdf,
  downloadOrderspdf,
  fetchPurchaseOrderDetails,
  getAllVendorDetails,
  getAllVendors,
  getComments,
  getInwardedItemsV2,
  getPiTimelineDetails,
  getPurchaseIndentDetails,
  getUserFromUidx,
  getVendorAddressForPI,
  getpiagedetails,
  getpurchaseordertimeline,
  getrelatedpodetails,
  postNewbills,
  postPaymentBills,
  postSendToVendor,
  postbillgeneratedDetails,
  rejectpurchaseorder,
  rejectpurchaserequest,
} from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { dateFormatter, isSmallScreen, productIdByBarcode } from '../../Common/CommonFunction';
import MobileDrawerCommon from '../../Common/MobileDrawer';
import CommentComponent from '../../Common/new-ui-common-components/comment-component';
import CommonDataGrid from '../../Common/new-ui-common-components/common-datagrid';
import NewPurchaseDetailsPage from '../../Common/new-ui-common-components/purchase-common-components/purchase-details-page';
import CommonTimeLine from '../../Common/new-ui-common-components/timeline';
import BillingAddress from '../../sales-order/new-sales/components/sales-details/components/addressCard';
import CommonPurchaseCard from '../data-grid-cards/common-purchase-card';
import InwardCard from '../data-grid-cards/inward-card';
import RelatedPoCard from '../data-grid-cards/related-po';
import './new-pi-details-info.css';
import VendorListCard from '../data-grid-cards/vendor-list-card';
import DetailsPageEndInfo from './component/details-page-end-info';
import CommonAccordion from '../../Common/mobile-new-ui-components/common-accordion';
import CustomMobileButton from '../../Common/mobile-new-ui-components/button';
import CommonMobileAddressDetail from '../../Common/mobile-new-ui-components/common-address-detaill';

const NewCommonPurchaseDetailsPage = () => {
  const isMobileDevice = isSmallScreen();
  const [isPi, setIsPi] = useState(null);
  const [isPo, setIsPo] = useState(null);
  const location = useLocation();
  const params = useParams();
  const locId = localStorage.getItem('locId');
  const { pathname } = location;
  const { purchaseId } = params;
  const [purchaseIndentDetails, setPurchaseIndentDetails] = useState({});
  const [approved, setApproved] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loader, setLoader] = useState(false);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({});
  const [piType, setPiType] = useState('');
  const [purchaseIndentDataRows, setPurchaseIndentDataRows] = useState({
    page: 0,
    pageSize: 10,
    rows: [],
    total: 0,
    loader: false,
  });
  const [purchaseOrderDataRows, setPurchaseOrderDataRows] = useState({
    page: 0,
    pageSize: 10,
    rows: [],
    total: 0,
    loader: false,
  });
  const [relatedPurchaseOrderDataRows, setRelatedPurchaseOrderDataRows] = useState([]);
  const [inwardedItemsDataRows, setInwardedItemsDataRows] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState();
  const [piTimelineData, setPiTimelineData] = useState([]);
  const [poTimelineData, setPoTimelineData] = useState([]);
  const [piApprovedBy, setPiApprovedBy] = useState();
  const [vendorList, setVendorList] = useState();
  const [pdfDownloaderLoader, setPdfDownloaderLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal2, setOpenModal2] = useState(false);
  const [timelineloader, setTimelineloader] = useState(false);
  const [rejection, setRejection] = useState('');
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));
  const [selectedImages, setSelectedImages] = useState();
  const [timelineLoader, setTimelineLoader] = useState(false);
  const [addressDetails, setAddressDetails] = useState();
  const [comments, setComments] = useState([]);
  const [createdComment, setCreatedComment] = useState('');
  const [commentLoader, setCommentLoader] = useState(false);
  const [createdBy, setCreatedBy] = useState('');

  //menu functionlaity

  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal2 = () => setOpenModal2(false);

  const [piRejected, setPiRejected] = useState(false);
  const handleReject = () => {
    if (relatedPurchaseOrderDataRows?.length > 0) {
      showSnackbar('Cannot reject PI as PO has already been created', 'error');
      return;
    }
    if (isRejected) {
      showSnackbar('Sorry you cannot convert this PI to PO as it has already been rejected', 'error');
      return;
    }
    setOpenModal2(true);
    setAnchorEl(null);
  };

  async function handleRejecthandler() {
    setTimelineloader(true);
    const payload = {
      piNumber: purchaseId,
      piStatus: 'REJECTED',
      comments: 'string',
      updatedByUser: userInfo?.uidx,
      rejectedReason: rejection,
    };
    try {
      const result = await rejectpurchaserequest(payload);
      showSnackbar('Success PI Rejected', 'success');
      setPiRejected(true);
      await timelineFunction({ isPiPage: true, isPoPage: false });
      piAgeData();
      fetchPurchaseDetails({ isPiPage: true, isPoPage: false });
      setOpenModal2(false);
      setTimelineloader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setTimelineloader(false);
      setOpenModal2(false);
    }
  }

  const handleEdit = () => {
    localStorage.setItem('piNum', purchaseId);
    navigate(`/purchase/purchase-indent/create-purchase-indent/${purchaseId}`);
  };

  // upgrade plan functionlaity
  const handleCloseUpgradeModal = () => {
    setOpenUpgradeModal(false);
  };

  const handleOpenUpgradePlan = () => {
    setOpenUpgradeModal(true);
  };

  //adding quote

  const [addquoteLoader, setAddQuoteLoader] = useState(false);

  const handleOpenModal = () => {
    if (!approved) {
      showSnackbar('Approve the PI to add a quote', 'error');
      return;
    }
    setOpenModal(true);
    setAnchorEl(null);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //file upload add a quote
  const [vendorData, setVendorData] = useState('');
  const handleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);
  };

  const handleSubmitFile = (event) => {
    const payload = {
      piNumber: purchaseId,
      vendorName: vendorData,
      createdBy: userInfo?.uidx,
    };
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedImages);
    formData.append(
      'addQuoteRequest',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    if (selectedImages) {
      setTimelineloader(true);
      setAddQuoteLoader(true);
      addaQuote(formData)
        .then(async (res) => {
          showSnackbar('Success Quote Added', 'success');
          await timelineFunction({ isPiPage: true, isPoPage: false });
          setTimelineloader(false);
          setAddQuoteLoader(false);
          setOpenModal(false);

          // products / product - label;
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
          setTimelineloader(false);
          setAddQuoteLoader(false);
          setOpenModal(false);
          // setQuoteAdded(true);
        });
    } else {
      showSnackbar('Upload Document', 'error');
    }
  };

  //getting all the vednors

  const [dataRows, setTablevendorRows] = useState([]);
  let dataArrvendor,
    dataRow = [];

  const orgId = localStorage.getItem('orgId');
  const filterObject = {
    page: 0,
    pageSize: 0,
    filterVendor: {
      searchText: '',
      startDate: '',
      endDate: '',
      locations: [],
      type: [],
      productName: [],
      productGTIN: [],
    },
  };

  useEffect(() => {
    if (openModal) {
      getAllVendors(filterObject, orgId).then(function (result) {
        dataArrvendor = result?.data?.data;
        dataRow.push(
          dataArrvendor?.vendors?.map((row) => ({
            value: row?.vendorId,
            label: row?.vendorName,
          })),
        );
        setTablevendorRows(dataRow[0]);
      });
    }
  }, [openModal]);

  //exporting  pdf
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    if (isMobileDevice) {
      const deviceType = localStorage.getItem('deviceType');
      if (deviceType === 'mobile') {
        if (isApp && isPi) {
          emit({
            type: 'fileOpen',
            data: JSON.stringify({ link: `/po/api/purchase-indent/preview/pdf/${purchaseId}` }),
          });
        } else if (isApp && isPo) {
          emit({
            type: 'fileOpen',
            data: JSON.stringify({ link: `/po/api/purchase-order/preview/pdf/${purchaseId}` }),
          });
        }
        setIsApp(false);
      }
    }
  }, [isApp]);

  const handleClickpdf = async () => {
    // setTimelineloader(true);
    setPdfDownloaderLoader(true);
    try {
      const response = await downloadIndentpdf(purchaseId);
      if (response?.status !== 200) {
        showSnackbar('Some error occured', 'error');
        return;
      }
      setIsApp(true);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      setPdfDownloaderLoader(false);
      link.download = `${purchaseId} ${
        purchaseIndentDetails?.deliveryLocation !== 'NA' ? purchaseIndentDetails?.deliveryLocation : ''
      } ${purchaseIndentDetails?.vendorName !== 'NA' ? purchaseIndentDetails?.vendorName : ''}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // setTimelineloader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setPdfDownloaderLoader(false);

      // setTimelineloader(false);
    }
  };

  const timelineStatusObject = (statusName, userName, date, time, logType, view, quoteId, refId) => {
    if (logType === 'PI') {
      switch (statusName) {
        case 'DRAFT':
          return {
            name: 'Draft',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'CREATED':
          return {
            name: 'Pending Approval',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'INDENT_CREATED':
          return {
            name: 'Indent Created',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'APPROVED':
          return {
            name: 'Indent Approved',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Approved by  ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'REJECTED':
          return {
            name: 'Indent Rejected',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: `Rejected by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'VENDOR_ASSIGNED':
          return {
            name: 'Vendor Assigned',
            iconColor: '#0562fb',
            icon: <StorefrontIcon />,
            userDesc: `Preferred Vendor - ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'ORDER_CONFIRMED':
          return {
            name: 'Order Confirmed',
            iconColor: '#0562fb',
            icon: <ShoppingCartCheckoutIcon />,
            userDesc: `Preferred Vendor - ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'PO_CREATED':
          return {
            name: 'PO Created',
            iconColor: '#0562fb',
            icon: <ShoppingBagIcon />,
            userDesc: `Via Inward (GRN) - ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'CLOSED':
          return {
            name: 'Indent Closed',
            iconColor: 'green',
            icon: <DoneAllIcon />,
            userDesc: `Via Inward (GRN) - ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'DELIVERED':
          return {
            name: 'Delivered',
            iconColor: '#0562fb',
            icon: <LocalShippingIcon />,
            userDesc: `Delivery received by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'INWARD':
          return {
            name: 'Inward (GRN)',
            iconColor: '#0562fb',
            icon: <SouthWestIcon />,
            userDesc: `Inward completed by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'BILL':
          return {
            name: 'Bill',
            iconColor: '#0562fb',
            icon: <ReceiptIcon />,
            userDesc: `Bill added by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'PO_CLOSED':
          return {
            name: 'PO Closed',
            iconColor: 'green',
            icon: <CheckBoxIcon />,
            userDesc: `Closed by ${userName}`,
            dateTime: `${date}, ${time}`,
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
    } else if (logType === 'Quote') {
      switch (statusName) {
        case 'CREATED':
          return {
            name: 'Quote Created' + ' (' + quoteId + ')',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
            view: view,
            logType: logType,
            quoteId: quoteId,
          };
        case 'APPROVED':
          return {
            name: 'Quote Approved' + ' (' + quoteId + ')',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Approved by ${userName}`,
            dateTime: `${date}, ${time}`,
            view: view,
            logType: logType,
            quoteId: quoteId,
          };
        case 'REJECTED':
          return {
            name: 'Quote Rejected' + ' (' + quoteId + ')',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: `Rejected by ${userName}`,
            dateTime: `${date}, ${time}`,
            view: view,
            logType: logType,
            quoteId: quoteId,
          };
        case 'DELETED':
          return {
            name: 'Quote Deleted' + ' (' + quoteId + ')',
            iconColor: 'red',
            icon: <DeleteIcon />,
            userDesc: `Deleted by ${userName}`,
            dateTime: `${date}, ${time}`,
            view: view,
            logType: logType,
            quoteId: quoteId,
          };
        default:
          return {
            name: 'Unknown status',
            iconColor: '#0562fb',
            icon: '',
            userDesc: 'Unknown User',
            dateTime: 'Unknown Date',
            view: 'View',
          };
      }
    } else if (logType === 'PO Status') {
      switch (statusName) {
        case 'Created':
          return {
            name: 'Po Created (' + purchaseId + ')',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Accepted':
          return {
            name: 'Po Accepted',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Accepted by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'In transit':
          return {
            name: 'In transit',
            iconColor: '#0562fb',
            icon: <LocalShippingIcon />,
            userDesc: `Done by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Partially inwarded':
          return {
            name: 'Partially inwarded',
            iconColor: '#0562fb',
            icon: <UnfoldLessIcon />,
            userDesc: `Done by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Inwarded':
          return {
            name: 'Inwarded',
            iconColor: '#0562fb',
            icon: <UnfoldLessIcon />,
            userDesc: `Inward Completed by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Closed':
          return {
            name: 'PO Closed',
            iconColor: 'red',
            icon: <DoNotDisturbIcon />,
            userDesc: `PO Closed by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Rejected':
          return {
            name: 'PO Rejected',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: `PO Rejected by ${userName}`,
            dateTime: `${date}, ${time}`,
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
    } else if (logType.includes('Bill')) {
      switch (statusName) {
        case 'Created':
          return {
            name: `Bill ${refId ?? ''}`,
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Accepted':
          return {
            name: `Bill Accepted ${refId ?? ''}`,
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Accepted by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Rejected':
          return {
            name: `Bill Rejected ${refId ?? ''}`,
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: `Rejected by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Deleted':
          return {
            name: `Bill Deleted ${refId ?? ''}`,
            iconColor: 'red',
            icon: <DeleteIcon />,
            userDesc: `Deleted by ${userName}`,
            dateTime: `${date}, ${time}`,
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
    } else if (logType.includes('Payment')) {
      switch (statusName) {
        case 'Successful':
          return {
            name: `Payment ${refId ?? ''}`,
            iconColor: '#0562fb',
            icon: <RequestQuoteIcon />,
            userDesc: `Payment added by ${userName}`,
            dateTime: `${date}, ${time}`,
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
    }
  };

  useEffect(() => {
    if (pathname.includes('purchase-indent')) {
      setIsPi(true);
      fetchPurchaseDetails({ isPiPage: true, isPoPage: false });
      setIsPo(false);
    } else {
      setIsPo(true);
      fetchPurchaseDetails({ isPiPage: false, isPoPage: true });
      setIsPi(false);
    }
    // setPurchaseId('purchase-order');
  }, [pathname, purchaseId]);

  const [indentDetailsSelectedValue, setIndentDetailsSelectedValue] = useState('');
  const [openIndentDetailsDrawer, setOpenIndentDetailsDrawer] = useState(false);

  //this is fro flag recommendation
  const FlagTooltips = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 750,
        fontSize: theme.typography.pxToRem(12),
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        padding: '10px',
        border: '2px dotted rgb(158, 156, 156)',
      },
    }),
  );

  const categoryColour = (data) => {
    switch (data) {
      case 'GREEN':
        return 'success';
      case 'ORANGE':
        return 'warning';
      case 'RED':
        return 'error';
      case 'GREY':
        return 'secondary';
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  const getTagDescription = (type, result) => {
    if (type === 'INVENTORY') {
      switch (result) {
        case 'A':
          return 'Highest Consumption';
        case 'B':
          return 'Average Consumption';
        case 'C':
          return 'Lowest Consumption';
        case 'D':
          return 'Dead Stock';
        default:
          return '';
      }
    } else if (type === 'SALES') {
      switch (result) {
        case 'A':
          return 'Fast Movement';
        case 'B':
          return 'Average Movement';
        case 'C':
          return 'Low Movement';
        default:
          return '';
      }
    } else if (type === 'PROFIT') {
      switch (result) {
        case 'A':
          return 'Highest Value';
        case 'B':
          return 'Average Value';
        case 'C':
          return 'Lowest Value';
        default:
          return '';
      }
    }
  };

  //data grid columns
  const indentDetailsColumns = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 250,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          return (
            <div className="flag-tooltip-container-main">
              <Tooltip title={<div>{params?.row?.barcode}</div>}>
                <InfoOutlinedIcon sx={{ height: 18, width: 18, cursor: 'pointer', color: '#0562fb' }} />
              </Tooltip>
              {params?.row?.purchaseRecommendationFlag === 'NA' ||
              params?.row?.purchaseRecommendationFlag === '' ||
              params?.row?.purchaseRecommendationFlag === '' ? (
                <div>{params?.value} </div>
              ) : (
                <div className="flag-tooltip-container">
                  <Badge
                    badgeContent={
                      <FlagTooltips
                        placement="bottom-start"
                        title={
                          <div className="tooltip-flag-recommend">
                            <div className="tooltip-flag-heading-name">
                              <SoftTypography fontSize="14px" fontWeight="bold">
                                Recommendation:
                              </SoftTypography>
                              <SoftTypography
                                fontSize="14px"
                                fontWeight="bold"
                                mt={params?.row?.inventoryFlag === 'D' ? '' : 1}
                              >
                                Inventory:
                              </SoftTypography>
                              <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                                Sales:
                              </SoftTypography>
                              <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                                Gross Profit:
                              </SoftTypography>
                            </div>
                            <div className="tooltip-flag-heading-name">
                              <SoftTypography fontSize="14px">{params?.row?.purchaseFlagReason || 'NA'}</SoftTypography>
                              <div className={params?.row?.inventoryFlag === 'D' ? 'tooltip-flag-cat-data' : ''}>
                                {params?.row?.inventoryFlag === 'D' ? (
                                  <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>Dead Stock</span>
                                ) : (
                                  <>
                                    <Chip
                                      color={categoryColour(params?.row?.inventoryFlag)}
                                      label={params?.row?.inventoryFlag || 'NA'}
                                    />
                                    {params?.row?.inventoryFlag !== 'NA' && (
                                      <Chip
                                        color={categoryColour(params?.row?.inventoryFlag)}
                                        label={getTagDescription('INVENTORY', params?.row?.inventoryFlag) || 'NA'}
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="tooltip-flag-cat-data">
                                <Chip
                                  color={categoryColour(params?.row?.salesFlag)}
                                  label={params?.row?.salesFlag || 'NA'}
                                />
                                {params?.row?.salesFlag !== 'NA' && (
                                  <Chip
                                    color={categoryColour(params?.row?.salesFlag)}
                                    label={getTagDescription('SALES', params?.row?.salesFlag) || 'NA'}
                                  />
                                )}
                              </div>
                              <div className="tooltip-flag-cat-data">
                                <Chip
                                  color={categoryColour(params?.row?.profitFlag)}
                                  label={params?.row?.profitFlag || 'NA'}
                                />
                                {params?.row?.profitFlag !== 'NA' && (
                                  <Chip
                                    color={categoryColour(params?.row?.profitFlag)}
                                    label={getTagDescription('PROFIT', params?.row?.profitFlag) || 'NA'}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <FlagIcon fontSize="small" style={{ color: '#fff', cursor: 'pointer' }} />
                      </FlagTooltips>
                    }
                    color={categoryColour(params?.row?.purchaseRecommendationFlag || 'NA')}
                  ></Badge>
                  <SoftBox>{params?.value}</SoftBox>
                </div>
              )}
            </div>
          );
        },
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'salesPerWeek',
        headerName: 'Sales/Week',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'availableQty',
        headerName: 'Available Qty',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 110,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'orderQty',
        headerName: 'Order Qty',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'quantityFullfilled',
        headerName: 'Quantity Fullfilled',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 150,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
    ],
    [],
  );
  const orderDetailsColumns = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 250,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          return (
            <div className="flag-tooltip-container-main">
              <Tooltip title={<div>{params?.row?.barcode}</div>}>
                <InfoOutlinedIcon sx={{ height: 18, width: 18, cursor: 'pointer', color: '#0562fb' }} />
              </Tooltip>
              <sapn>{params?.row?.title}</sapn>
            </div>
          );
        },
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'salesPerWeek',
        headerName: 'Sales/Week',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'stockWhenOrdered',
        headerName: 'Stock When Ordered',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 110,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'orderQty',
        headerName: 'Order Qty',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'fillRate',
        headerName: 'Fill Rate',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 150,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
    ],
    [],
  );

  const relatedPurchaseOrderColumns = useMemo(
    () => [
      {
        field: 'date',
        headerName: 'Date',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 150,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'purchaseOrder',
        headerName: 'Purchase Order',
        minWidth: 100,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'poValue',
        headerName: 'PO Value',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 100,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'fillRate',
        headerName: 'Fill Rate',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 110,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'procurementCycle',
        headerName: 'Procurement Cycle',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 110,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'delivery',
        headerName: 'Delivery',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 180,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
    ],
    [],
  );

  const inwardedDetailsColumns = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 250,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          return (
            <div className="flag-tooltip-container-main">
              <Tooltip title={<div>{params?.row?.barcode}</div>}>
                <InfoOutlinedIcon sx={{ height: 18, width: 18, cursor: 'pointer', color: '#0562fb' }} />
              </Tooltip>
              <sapn>{params?.row?.title}</sapn>
            </div>
          );
        },
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'purchaseCost',
        headerName: 'Purchase Cost',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 100,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'tax',
        headerName: 'Tax',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 50,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'cess',
        headerName: 'Cess',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 50,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'costPerUnit',
        headerName: 'Cost/Unit',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'purchaseMargin',
        headerName: 'Purchase Margin',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 120,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'totalAmount',
        headerName: 'Total Amount',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 100,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
    ],
    [],
  );

  //purchase details function

  const timelineFunction = async ({ isPiPage, isPoPage }) => {
    setTimelineLoader(true);
    if (isPiPage) {
      await getPiTimelineDetails(purchaseId)
        .then((response) => {
          //getting pi timeline details
          const res = response?.data?.data;
          setAdditionalDetails((prev) => ({
            //setting additional details for quote received
            ...prev,
            quoteReceived: res?.quoteReceived || 'NA',
          }));
          const timelineData = res?.timelines?.map((item, index) => {
            const parsedTimestamp = parseISO(item?.updatedOn); //parsing timestamp to convert date and time in this format (dd MMMM yyyy, HH:mm 'Hours')
            const date = format(parsedTimestamp, 'dd MMMM yyyy');
            const time = format(parsedTimestamp, "HH:mm 'Hours'");
            const status = timelineStatusObject(
              //getting status object for timeline .ie name, icon, userDesc, dateTime
              item?.status,
              item?.updatedBy,
              date,
              time,
              item?.logType,
              item?.view,
              item?.quoteId,
            );
            return {
              id: index,
              ...status,
            };
          });
          const createdByName = res?.timelines?.find((item) => item?.status === 'CREATED')?.updatedBy;
          setCreatedBy(createdByName);
          setPiTimelineData(timelineData); //setting timeline data
          setTimelineLoader(false);
        })
        .catch((err) => {
          // showSnackbar(err?.response?.data?.message, 'error');
          setTimelineLoader(false);
          setAdditionalDetails((prev) => ({
            //setting additional details for quote received
            ...prev,
            quoteReceived: 'NA',
          }));
        });
    } else {
      //getting po timeline details - same thing as above

      await getpurchaseordertimeline(purchaseId)
        .then((response) => {
          const res = response?.data?.data;
          const timelineData = res?.timelines?.map((item, index) => {
            // const parsedTimestamp = parseISO(item?.updatedOn);
            const parsedDateTime = parse(item?.updatedOn, 'dd MMMM yyyy hh:mm:ss aa', new Date());
            const date = format(parsedDateTime, 'dd MMMM yyyy');
            const time = format(parsedDateTime, "HH:mm 'Hours'");
            const status = timelineStatusObject(
              item?.status,
              item?.updatedBy,
              date,
              time,
              item?.logType,
              item?.view,
              item?.quoteId,
              item?.refId,
            );
            return {
              id: index,
              ...status,
            };
          });
          const createdByName = res?.timelines?.find((item) => item?.status === 'Created')?.updatedBy;
          setCreatedBy(createdByName);

          setPoTimelineData(timelineData);
          setTimelineLoader(false);
        })
        .catch((err) => {
          // showSnackbar(err?.response?.data?.message, 'error');
          setTimelineLoader(false);
        });
    }
  };

  const [getCommentsLoader, setGetCommentsLoader] = useState(false);

  const fetchComments = () => {
    setGetCommentsLoader(true);
    getComments(purchaseId)
      .then((res) => {
        const commentsData = res?.data?.data?.commentList?.map((item, index) => ({
          id: index,
          comment: item?.comments,
          commentedBy: item?.createdByUser,
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

  const handleCreateComment = () => {
    setCommentLoader(true);
    const payload = {
      refId: purchaseId,
      comments: createdComment,
      createdBy: userInfo?.uidx,
      createdByUser: userInfo?.firstName + ' ' + userInfo?.secondName,
    };
    createComment(payload)
      .then((res) => {
        fetchComments();
        setCommentLoader(false);
      })
      .catch((err) => {
        setCommentLoader(false);
      });
  };

  const handleAddComment = (value) => {
    setCreatedComment(value);
  };

  useEffect(() => {
    if (purchaseId) {
      fetchComments();
    }
  }, [purchaseId]);

  function formatString(str) {
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const fetchPurchaseDetails = async ({ isPiPage, isPoPage }) => {
    if (isPiPage) {
      let estimatedTotalValue; //for calculating purchase value differnce
      setLoader(true);
      getPurchaseIndentDetails(purchaseId)
        .then((response) => {
          //getting pi details
          const res = response?.data?.data;
          if (res?.status === 'DRAFT') {
            if (isMobileDevice) {
              navigate('/purchase/ros-app-purchase?value=purchaseIndent');
            } else {
              navigate('/purchase/purchase-indent');
            }
          }
          setPiType(res?.piType); //setting pi type for indent details to check vendor specific or open to vendot
          // calling address pi
          // if (res?.piType === 'VENDOR_SPECIFIC') {
          //   piAddressData(res?.vendorId);
          // }
          setPurchaseIndentDetails({
            //setting pi details
            vendorName: res?.preferredVendor || 'NA',
            vendorId: res?.vendorId || 'NA',
            expectedDeliveryDate: res?.expectedDeliveryDate || 'NA',
            assignedTo: res?.assignedTo || [],
            deliveryLocation: res?.deliveryLocation || 'NA',
            purchaseMethod: res?.purchase_method || 'NA',
            purchaseTerms: res?.purchaseTerms || 'NA',
            returnAndReplacement: res?.returnAndReplacement || 'NA',
            openDebitNote: res?.vendorDebitNote || '0',
            vendorCreditNote: res?.vendorCreditNote || '0',
            openReturns: res?.vendorReturns || '0',
            purchaseIndentItems: res?.purchaseIndentItems || 'NA',
            estimatedCost: res?.exclusiveOfCharge === null ? 'NA' : res?.exclusiveOfCharge,
            piStatus: res?.status,
            isSameLoaction: res?.sourceId === locId,
          });

          estimatedTotalValue = res?.estimatedTotal;

          setPiApprovedBy(res?.approvedBy);
          creatingVendorList({
            piItems: res?.purchaseIndentItems,
            vendorId: res?.vendorId,
            preferredVendor: res?.preferredVendor,
            isVendorSpecific: res?.piType === 'VENDOR_SPECIFIC' ? true : false,
          });
          const piRows = res?.purchaseIndentItems?.map((item) => ({
            //setting pi datagrid rows
            id: item?.id || 'NA',
            title: item?.itemName || 'NA',
            barcode: item?.itemCode || 'NA',
            mrp: item?.finalPrice,
            salesPerWeek: item?.salesPerWeek || 'NA',
            availableQty: item?.availableStock || 'NA',
            orderQty: item?.quantityOrdered || 'NA',
            quantityFullfilled: Number((item?.quantityOrdered - item?.quantityLeft).toFixed(2)),
            salesFlag: item?.salesFlag || 'NA',
            spec: item?.spec || 'NA',
            status: item?.status || 'NA',
            purchaseRecommendationFlag: item?.purchaseRecommendationFlag || 'NA',
            purchaseFlagReason: item?.purchaseFlagReason || 'NA',
            inventoryFlag: item?.inventoryFlag || 'NA',
            salesFlag: item?.salesFlag || 'NA',
            profitFlag: item?.profitFlag || 'NA',
            previousPurchasePrice: item?.previousPurchasePrice,
            quantityLeft: item?.quantityLeft,
            purchaseMargin: item?.purchaseMargin,
          }));
          setPurchaseIndentDataRows((prevState) => ({
            ...prevState,
            rows: piRows,
            total: piRows?.length,
            loader: false,
          }));
          // fillRateCalculator(piRows);
          // calculatingEstimatedCost(piRows);
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
          setPurchaseIndentDetails({
            //setting pi details
            vendorName: 'NA',
            vendorId: 'NA',
            expectedDeliveryDate: 'NA',
            assignedTo: [],
            deliveryLocation: 'NA',
            purchaseMethod: 'NA',
            purchaseTerms: 'NA',
            returnAndReplacement: 'NA',
            openDebitNote: 'NA',
            vendorCreditNote: 'NA',
            openReturns: 'NA',
            purchaseIndentItems: 'NA',
            estimatedCost: 'NA',
            isSameLoaction: false,
          });
        });

      await getrelatedpodetails(purchaseId)
        .then((res) => {
          //related po api call
          //related po datagrid data
          const relatedPoData = res?.data?.data?.relatedPOs?.map((item, index) => ({
            id: index,
            date: item?.orderedOn || 'NA',
            purchaseOrder: item?.poNumber || 'NA',
            poValue: item?.grossAmount || 'NA',
            fillRate: res?.fillRate === null ? 'NA' : `${item?.fillRate || '0'}%`,
            procurementCycle: item?.procurementCycle || 'NA',
            delivery: item?.deliveryStatus || 'NA',
            status: item?.status || 'NA',
          }));
          setRelatedPurchaseOrderDataRows(relatedPoData); //setting related po datagrid data

          //values for additional details
          const response = res?.data?.data;
          setAdditionalDetails((prev) => {
            //setting rest of the additional details
            const purchDescValue =
              ((Number(response?.poValue) - Number(estimatedTotalValue)) / Number(estimatedTotalValue)) * 100; //calculating purchase value difference ((PO - PI) / PI * 100)

            return {
              ...prev,
              purchaseValue: `₹${response?.poValue}` || '0',
              purchaseDescValue: isNaN(purchDescValue) ? '0' : purchDescValue?.toFixed(2),
              poCreated: response?.posCreated || 'NA',
              vendors: response?.vendors || 'NA',
              procurementCycle: response?.procurementCycle === null ? 'NA' : response?.procurementCycle,
              shipmentCount: response?.shipmentCount || 'NA',
              fillRate: response?.fillRate === null ? 'NA' : `${response?.fillRate}%`,
              fillRateFrom: response?.fillRateFrom || 'NA',
            };
          });
        })
        .catch((err) => {
          setAdditionalDetails((prev) => {
            return {
              ...prev,
              purchaseValue: 'NA',
              purchaseDescValue: 'NA',
              poCreated: 'NA',
              vendors: 'NA',
              procurementCycle: 'NA',
              shipmentCount: 'NA',
              fillRate: 'NA',
              fillRateFrom: 'NA',
            };
          });
        });

      // calling piAge api
      piAgeData();
      //calling the timeline function
      await timelineFunction({ isPiPage: true, isPoPage: false }); //timeline function calling to create timeline
    } else if (isPoPage) {
      //calling the purchase order details api =====================================
      setLoader(true);
      await fetchPurchaseOrderDetails(purchaseId)
        .then((response) => {
          // if()
          if (response?.data?.data?.es > 0 || response?.data?.status === 'ERROR') {
            setPurchaseOrderDataRows((prev) => ({
              ...prev,
              rows: [],
              total: 0,
            }));
            setAdditionalDetails((prev) => {
              return {
                ...prev,
                poValue: 'NA',
                poDescValue: 'NA',
                purchaseOffers: 'NA',
                purchaseOfferValue: 'NA',
                purchaseBills: 'NA',
                purchaseBillDueDate: 'NA',
                paymentMadeValue: 'NA',
                paymentPendingPercentage: 'NA%',
                additionalExpense: 'NA',
                additionalExpenseValue: 'NA',
                fillRate: 'NA',
                fillRateFrom: 'NA',
                // fillRate: fillRateCalculator(fillRateArray, true),
              };
            });
            setPurchaseOrderDetails((prev) => ({
              ...prev,
              vendorName: 'NA',
              expectedDeliveryDate: 'NA',
              deliveryLocation: 'NA',
              purchaseMethod: 'NA',
              purchaseTerms: 'NA',
              returnAndReplacement: 'NA',
              deliveredOn: 'NA',
              deliveryDays: 'NA',
              openDebitNote: 'NA',
              vendorCreditNote: 'NA',
              openReturns: 'NA',
              estimatedCost: 'NA',
              fillRate: 'NA',
            }));
            setLoader(false);
            return;
          }
          const res = response?.data?.data;
          const purchaseOrderRowData = res?.purchaseOrderItemList?.map((item) => {
            return {
              id: item?.id || 'NA',
              title: item?.itemName || 'NA',
              barcode: item?.itemNo || 'NA',
              mrp: item?.unitPrice || '0',
              salesPerWeek: item?.salesPerWeek || 'NA',
              stockWhenOrdered: item?.availableStock || 'NA',
              orderQty: item?.quantityOrdered || 'NA',
              availableQty: item?.availableStock,
              estimatedValue: item?.estimatedValue,
              fillRate: fillRateCalculator(
                [{ orderQty: item?.quantityOrdered, quantityReceived: item?.quantityReceived }],
                true,
              ),
            };
          });

          const vendorAddressList = {
            vendorAddress: res?.vendorLocationAddress,
            vendorBillingAddress: res?.sourceLocationAddress,
            vendorShippingAddress: res?.destinationLocationAddress,
          };

          setAddressDetails(vendorAddressList);

          setPurchaseOrderDataRows((prev) => ({
            ...prev,
            rows: purchaseOrderRowData,
            total: purchaseOrderRowData?.length,
          }));

          const poDetails = {
            vendorName: res?.vendorName ?? 'NA',
            vendorId: res?.vendorId ?? 'NA',
            expectedDeliveryDate: dateFormatter(res?.expectedDeliveryDate) ?? 'NA',
            deliveryLocation: res?.destinationLocationName ?? 'NA',
            purchaseMethod: res?.purchaseMethod ?? 'NA',
            deliveredOn: dateFormatter(res?.deliveredOn) ?? 'NA',
            deliveryDays: res?.deliveryDays ?? 'NA',
            openDebitNote: res?.debitNoteValue,
            openReturns: res?.openReturns ?? 'NA',
            estimatedCost: res?.estimatedValue ?? 'NA',
            fillRate: res?.fillRate === null ? 'NA' : `${res?.fillRate ?? '0'}%`,
            piNumber: res?.piNumber ?? 'NA',
            invoiceRefNo: res?.invoiceRefNo ?? [],
            status: res?.status ?? 'NA',
          };
          const vendorPayload = {
            vendorId: [res?.vendorId],
          };
          getAllVendorDetails(vendorPayload)
            .then((res) => {
              const response = res?.data?.data?.object[0];
              const returns = response?.vendorReturn?.some((ele) => ele?.flag === true);
              const newPurchaseTerm = [];
              if (response?.purchaseTerms) {
                response?.purchaseTerms
                  ?.filter((ele) => ele?.flag === true)
                  ?.map((ele) => {
                    newPurchaseTerm.push(formatString(ele?.paymentOption));
                  });
              }
              poDetails.vendorCreditNote = res?.data?.data?.object?.[0]?.availableCredits
                ? Number(res?.data?.data?.object?.[0]?.availableCredits).toFixed(2)
                : 'NA';
              poDetails.returnAndReplacement = returns ? 'Yes' : 'No';
              poDetails.purchaseTerms = newPurchaseTerm?.length > 0 ? newPurchaseTerm?.join(', ') : 'NA';
              setPurchaseOrderDetails(poDetails);
            })
            .catch((err) => {
              setPurchaseOrderDetails(poDetails);
            });
          setAdditionalDetails((prev) => {
            // const fillRateArray = res?.purchaseOrderItemList?.map((item) => ({
            //   orderQty: item?.quantityOrdered,
            //   quantityReceived: item?.quantityReceived,
            // }));
            const purchDescValue = res?.purchaseValue
              ? ((Number(res?.purchaseValue) - Number(res?.estimatedValue)) / Number(res?.estimatedValue)) * 100
              : 'NA'; //calculating purchase value difference ((PO - PI) / PI * 100)
            return {
              ...prev,
              poValue: `₹${res?.purchaseValue ?? 'NA'}`,
              poDescValue: isNaN(purchDescValue) ? '0' : purchDescValue.toFixed(2) || '0',
              purchaseOffers: res?.purchaseOffers ?? 'NA',
              purchaseOfferValue: res?.offerProductCount ?? '0',
              purchaseBills: res?.purchaseBillCount ?? 0,
              purchaseBillDueDate: dateFormatter(res?.purchaseBillDueDate) ?? 'NA',
              paymentMadeValue: `₹${res?.paymentMadeValue ?? 'NA'}`,
              paymentPendingPercentage: `${res?.paymentPendingPercentage ?? 'NA'}%`,
              additionalExpense: `₹${res?.additionalExpense ?? 'NA'}`,
              additionalExpenseValue: res?.purchaseBillCount ?? '0',
              fillRate: res?.fillRate === null ? 'NA' : `${res?.fillrate}%`,
              fillRateFrom: res?.fillRateFrom ?? 'NA',
              // fillRate: fillRateCalculator(fillRateArray, true),
            };
          });

          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
          setPurchaseOrderDataRows((prev) => ({
            ...prev,
            rows: [],
            total: 0,
          }));
          setLoader(false);
          setAdditionalDetails((prev) => {
            return {
              ...prev,
              poValue: 'NA',
              poDescValue: '0',
              purchaseOffers: 'NA',
              purchaseOfferValue: '0',
              purchaseBills: '0',
              purchaseBillDueDate: 'NA',
              paymentMadeValue: '0',
              paymentPendingPercentage: '0%',
              additionalExpense: '0',
              additionalExpenseValue: '0',
              fillRate: '0',
              fillRateFrom: 'NA',
              // fillRate: fillRateCalculator(fillRateArray, true),
            };
          });
          setPurchaseOrderDetails((prev) => ({
            ...prev,
            vendorName: 'NA',
            expectedDeliveryDate: 'NA',
            deliveryLocation: 'NA',
            purchaseMethod: 'NA',
            purchaseTerms: 'NA',
            returnAndReplacement: 'NA',
            deliveredOn: 'NA',
            deliveryDays: 'NA',
            openDebitNote: '0',
            vendorCreditNote: 'NA',
            openReturns: '0',
            estimatedCost: 'NA',
            fillRate: 'NA',
          }));
        });

      //calling the inwarded items api =====================================
      getInwardedItemsV2(purchaseId)
        .then((response) => {
          if (response?.data?.status === 'ERROR' || response?.data?.data?.es > 1) {
            setInwardedItemsDataRows([]);
            return;
          }
          const inwardedItems = response?.data?.data?.items?.map((item, index) => {
            return {
              id: index,
              title: item?.itemName || 'NA',
              mrp: item?.latestMRP || 'NA',
              barcode: item?.gtin || 'NA',
              quantity: item?.totalQuantityOrdered,
              purchaseCost: item?.totalPurchaseCost ?? 'NA',
              tax: 'NA',
              cess: item?.cess || 'NA',
              costPerUnit: item?.latestPurchasePrice,
              purchaseMargin: `${item?.purchaseMargin ?? 'NA'}%`,
              totalAmount: item?.totalPurchaseCost || 'NA',
            };
          });
          setInwardedItemsDataRows(inwardedItems === undefined ? [] : inwardedItems);
        })
        .catch((err) => {
          setInwardedItemsDataRows([]);
        });

      //calling the timeline function =============================================

      await timelineFunction({ isPiPage: false, isPoPage: true });
      // getPurchaseOrderDetails();
    }
  };

  const creatingVendorList = async ({ piItems, vendorId, preferredVendor, isVendorSpecific }) => {
    let vendorSummary;
    if (isVendorSpecific) {
      const piItemsAmount = piItems?.reduce((acc, product) => {
        const { finalPrice } = product;
        acc += isNaN(finalPrice) ? 0 : Number(finalPrice);
        return acc;
      }, 0);
      vendorSummary = [
        {
          vendorId,
          preferredVendor,
          noOfProducts: piItems?.length,
          amount: piItemsAmount,
        },
      ];
    } else {
      vendorSummary = piItems?.reduce((acc, product) => {
        const { vendorId, preferredVendor, finalPrice } = product;

        if (!vendorId || vendorId === '') {
          return acc; // Skiping this product and returning the accumulator as is
        }

        // Checking if the vendor already exists in the accumulator
        const existingVendor = acc.find((vendor) => vendor.vendorId === vendorId);

        if (existingVendor) {
          // Incrementing the number of products for this vendor
          existingVendor.noOfProducts += 1;
          existingVendor.amount += Number(finalPrice);
        } else {
          // Adding a new vendor entry
          acc.push({
            vendorId,
            preferredVendor,
            noOfProducts: 1,
            amount: Number(finalPrice),
          });
        }

        return acc;
      }, []);
    }

    setVendorList(vendorSummary);
  };

  // DO NOT DELETE THIS CODE AS IT CAN BE REUSED LATER ==============================================================
  // const piAddressData = (vendorId) => {
  //   getVendorAddressForPI(vendorId, purchaseId)
  //     .then((vendorRes) => {
  //       if (vendorRes?.data?.status === 'ERROR') {
  //         return;
  //       }
  //       const vendorData = vendorRes?.data?.data?.addresses?.find((ele) => ele?.addressType === 'VENDOR');
  //       const billData = vendorRes?.data?.data?.addresses?.find((ele) => ele?.addressType === 'BILLING');
  //       const deliveryData = vendorRes?.data?.data?.addresses?.find((ele) => ele?.addressType === 'DELIVERY');
  //       const vendorLocationAddress = {
  //         addressId: vendorData?.addressId,
  //         addressLine1: vendorData?.line1,
  //         addressLine2: vendorData?.line2,
  //         city: vendorData?.city,
  //         state: vendorData?.state,
  //         country: vendorData?.country,
  //         pinCode: vendorData?.pinCode,
  //         phoneNumber: vendorData?.mobileNumber,
  //       };
  //       const sourceLocationAddress = {
  //         id: billData?.addressId,
  //         addressLine1: billData?.line1,
  //         addressLine2: billData?.line2,
  //         city: billData?.city,
  //         state: billData?.state,
  //         country: billData?.country,
  //         pincode: billData?.pinCode,
  //         mobileNumber: billData?.mobileNumber,
  //         name: billData?.name,
  //       };
  //       const destinationLocationAddress = {
  //         id: deliveryData?.addressId,
  //         addressLine1: deliveryData?.line1,
  //         addressLine2: deliveryData?.line2,
  //         city: deliveryData?.city,
  //         state: deliveryData?.state,
  //         country: deliveryData?.country,
  //         pincode: deliveryData?.pinCode,
  //         mobileNumber: deliveryData?.mobileNumber,
  //         name: deliveryData?.name,
  //       };

  //       const purdchaseOrderAddress = {
  //         vendorAddress: vendorLocationAddress || 'NA',
  //         vendorBillingAddress: sourceLocationAddress || 'NA',
  //         vendorShippingAddress: destinationLocationAddress || 'NA',
  //       };
  //       setAddressDetails(purdchaseOrderAddress);
  //     })
  //     .catch((err) => {});
  // };

  const fillRateCalculator = (data, isPo) => {
    const overallQty = data?.reduce((acc, item) => {
      return acc + item?.orderQty;
    }, 0);

    let overallQtyReceived = 0;
    if (isPo) {
      overallQtyReceived = data?.reduce((acc, item) => {
        return acc + item?.quantityReceived;
      }, 0);
    } else {
      overallQtyReceived = data?.reduce((acc, item) => {
        return acc + (item?.orderQty - item?.quantityLeft);
      }, 0);
    }

    const initialFillRateValue = ((overallQtyReceived / overallQty) * 100).toString();
    const fillRate = initialFillRateValue?.replace(/(\.\d\d)\d*/, '$1') + '%';
    if (!isPo) {
      setAdditionalDetails((prev) => ({
        ...prev,
        fillRate: fillRate === 'NaN%' ? 'NA' : fillRate,
        fillRateFrom: data?.length,
      }));
    } else {
      return fillRate;
    }
  };

  useEffect(() => {
    if (piApprovedBy) {
      const getUserData = async () => {
        const response = await gettingUserDetails(piApprovedBy);
        setPurchaseIndentDetails((prev) => ({
          ...prev,
          approvedBy: response?.name || 'NA',
        }));
      };
      getUserData();
    }
  }, [piApprovedBy]);

  const gettingUserDetails = async (data) => {
    //created a new promise so that we can resolve the data and use it in the function
    return new Promise(async (resolve, reject) => {
      let userdata = {};
      await getUserFromUidx(data)
        .then((response) => {
          userdata = {
            name: response?.data?.data?.firstName + ' ' + response?.data?.data?.secondName,
            email: response?.data?.data?.email,
            mobileNumber: response?.data?.data?.mobileNumber,
          };
          resolve(userdata);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  //indent details drawer funtions

  const handleOpen = () => {
    setOpenIndentDetailsDrawer(true);
  };

  const handleClose = () => {
    setOpenIndentDetailsDrawer(false);
  };

  const chipOnClick = (value) => {
    setIndentDetailsSelectedValue(value);
    handleOpen();
  };

  const indentDetailsChipArray = [
    { chipName: 'Indent Timeline', chipValue: 'indent_timeline', toShow: true },
    {
      chipName: 'Vendor Details',
      chipValue: 'vendor_details',
      toShow: addressDetails && (isPo || piType === 'VENDOR_SPECIFIC') ? true : false,
    },
    {
      chipName: 'Billing Address',
      chipValue: 'billing_address',
      toShow: addressDetails && (isPo || piType === 'VENDOR_SPECIFIC') ? true : false,
    },
    {
      chipName: 'Shipping Address',
      chipValue: 'shipping_address',
      toShow: addressDetails && (isPo || piType === 'VENDOR_SPECIFIC') ? true : false,
    },
  ];

  //po functionlaity
  const handlePOEdit = () => {
    navigate(`/purchase/purchase-orders/create-purchase-order/${purchaseId}`);
  };

  const [poAnchorEl, setPOAnchorEl] = useState(null);

  const open2 = Boolean(poAnchorEl);
  const handlePOMenu = (event) => {
    setPOAnchorEl(event.currentTarget);
  };
  const handlePOMenuClose = () => {
    setPOAnchorEl(null);
  };

  const handleBill = () => {
    if (inwardedItemsDataRows?.length === 0) {
      showSnackbar('No single GRN has been created to add a bill', 'error');
      return;
    }
    navigate(`/purchase/create-bills/${purchaseId}`);
  };

  //payment functionality

  const [paymentSelectedImages, setPaymentSelectedImages] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billBalance, setBillBalance] = useState('');
  const [billPoNum, setBillPoNum] = useState('');
  const [billStatus, setBillStatus] = useState('');
  const [billGenerated, setBillGenerated] = useState(false);
  const [paymentDate, setPaymentDate] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billReference, setBillReference] = useState('');
  const [billPayTerms, setBillPayTerms] = useState('');
  const [billComment, setBillComment] = useState('');
  const [billSelectedImages, setBillSelectedImages] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paysum, setPaysum] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openBillModal, setOpenBillModal] = useState(false);
  const handlePaymentModal = () => {
    if (datRowsbill?.length === 0) {
      showSnackbar('No single Bill has been created to add payment', 'error');
      return;
    }
    setOpenPaymentModal(!openPaymentModal);
    setPOAnchorEl(null);
  };

  const handleBillModal = () => {
    if (inwardedItemsDataRows?.length === 0) {
      showSnackbar('No single GRN has been created to add a bill', 'error');
      return;
    }
    setOpenBillModal(!openBillModal);
    setPOAnchorEl(null);
  };

  const handlePaymentFileChange = (event) => {
    setPaymentSelectedImages(event.target.files[0]);
  };

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  const handlePaymentSubmitForm = (event) => {
    setSaveLoader(true);
    const userInfoDetails = JSON.parse(localStorage.getItem('user_details'));
    const payload = {
      billNumber: billNumber,
      poNumber: purchaseId,
      paymentMadeDate: paymentDate,
      paidAmount: paidAmount,
      paymentMethod: paymentMethod,
      createdBy: userInfoDetails?.uidx,
    };
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', paymentSelectedImages);
    formData.append(
      'poPaymentMade',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    if (billStatus === 'PAID') {
      showSnackbar('Bill already Paid', 'error');
      setOpenPaymentModal(false);
      setSaveLoader(false);
    } else {
      postPaymentBills(formData)
        .then(async (res) => {
          showSnackbar('Success Payment Made', 'success');
          setPaysum(!paysum);
          setOpenPaymentModal(false);
          setSaveLoader(false);
          await timelineFunction({ isPiPage: false, isPoPage: true });
        })
        .catch((err) => {
          setTimelineloader(false);
          showSnackbar(err?.response?.data?.message, 'error');
          setOpenPaymentModal(false);
          setSaveLoader(false);
        });
    }
  };

  const handleBillFileChange = (event) => {
    setBillSelectedImages(event.target.files[0]);
  };

  const handleBillSubmitForm = (event) => {
    setSaveLoader(true);
    const userInfoDetails = JSON.parse(localStorage.getItem('user_details'));
    const payload = {
      poNumber: purchaseId,
      referenceNumber: billReference,
      dueDate: billDate,
      paymentMethod: billPayTerms,
      vendorId: purchaseOrderDetails?.vendorId,
      vendorName: purchaseOrderDetails?.vendorName,
      createdBy: userInfoDetails?.uidx,
      comments: billComment,
    };
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', billSelectedImages);
    formData.append(
      'purchaseOrderBill',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    postNewbills(formData)
      .then(async (res) => {
        showSnackbar('Bill added succesfully', 'success');
        setPaysum(!paysum);
        setOpenBillModal(false);
        setSaveLoader(false);
        await timelineFunction({ isPiPage: false, isPoPage: true });
      })
      .catch((err) => {
        setTimelineloader(false);
        showSnackbar(err?.response?.data?.message, 'error');
        setOpenBillModal(false);
        setSaveLoader(false);
      });
  };

  const payload = {
    poNumber: [purchaseId],
  };
  const [datRowsbill, setTableRowsBill] = useState([]);
  let dataArr,
    dataRowPo = [];

  useEffect(() => {
    postbillgeneratedDetails(payload).then((res) => {
      dataArr = res?.data?.data;
      dataRowPo.push(
        dataArr?.purchaseOrderBillList?.map((row) => ({
          value: row?.billNumber || '',
          label: row?.billNumber || '',
          bill: row?.billNumber || '',
          balance: row?.balance || '',
          poNumber: row?.poNumber || '',
          status: row?.status || '',
        })),
      );
      setTableRowsBill(dataRowPo[0]);
    });
  }, []);

  const handlePoPdf = async () => {
    setPdfDownloaderLoader(true);
    try {
      const response = await downloadOrderspdf(purchaseId);
      setIsApp(true);
      if (response?.status === 200) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${purchaseId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setPdfDownloaderLoader(false);
      } else {
        const responseData = await response.json();
        showSnackbar(responseData?.message || 'Some error occurred', 'error');
        // setOpenModal(false);
        setPdfDownloaderLoader(false);
      }
    } catch (error) {
      showSnackbar(error?.res?.data?.message, 'error');
      setPdfDownloaderLoader(false);
    }
  };

  const [sendToVendorLoader, setSendToVendorLoader] = useState(false);
  const handleSendToVendor = () => {
    setSendToVendorLoader(true);
    postSendToVendor(purchaseId)
      .then((res) => {
        if (res?.data?.data?.es > 0) {
          setSendToVendorLoader(false);
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        setSendToVendorLoader(false);
        showSnackbar('Success', 'success');
      })
      .catch((err) => {
        setSendToVendorLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleInwardNavigate = () => {
    if (isMobileDevice) {
      showSnackbar('Action unavailable on mobile device', 'warning');
      return;
    }
    localStorage.setItem('poNumber', purchaseId);
    localStorage.removeItem('epoNumber');
    navigate('/purchase/express-grn/create-express-grn');
  };

  //convert to po

  const convertPo = () => {
    if (isRejected) {
      showSnackbar('Sorry you cannot convert this PI to PO as it has already been rejected', 'error');
      return;
    }
    if (!approved) {
      showSnackbar('Approve PI to convert to PO', 'error');
      return;
    }
    const items = purchaseIndentDetails?.purchaseIndentItems;
    const quantityLeft = items?.some((ele) => ele.quantityLeft > 0);
    if (!quantityLeft) {
      return showSnackbar('No quantity left for conversion', 'error');
    }
    if (!purchaseIndentDetails?.isSameLoaction) {
      showSnackbar('Delivery location must match with the logged in location for PO conversion', 'error');
      return;
    }
    const allEmpty = items?.every((item) => item?.vendorId === null || item?.vendorId === '');
    const validVendorIds = items?.filter((item) => item?.vendorId !== null && item?.vendorId !== '');
    const allSameVendorId =
      validVendorIds?.length === items?.length &&
      validVendorIds?.every((item) => item?.vendorId === validVendorIds[0]?.vendorId);
    // if (piType === 'VENDOR_SPECIFIC') {
    //   navigate(`/purchase/purchase-orders/create-purchase-order/${purchaseId}/${purchaseIndentDetails?.vendorId}`);
    // } else
    if (allEmpty) {
      navigate(`/purchase/purchase-orders/create-purchase-order/${purchaseId}`);
    } else if (allSameVendorId) {
      navigate(`/purchase/purchase-orders/create-purchase-order/${purchaseId}/${items[0]?.vendorId}`);
    } else {
      navigate(`/purchase/purchase-indent/convert-to-po/${purchaseId}`);
    }
  };

  // pi age
  const piAgeData = () => {
    getpiagedetails(purchaseId).then((res) => {
      if (res?.data?.data?.status == 'APPROVED') {
        setApproved(true);
        setIsCreated(false);
        setIsRejected(false);
      }
      if (res?.data?.data?.status == 'CREATED') {
        setIsCreated(true);
        setApproved(false);
        setIsRejected(false);
      }
      if (res?.data?.data?.status == 'REJECTED') {
        setIsRejected(true);
        setIsCreated(false);
        setApproved(false);
      }
    });
  };
  //approve functionality

  const [piAnchorEl, setPiEnchorEll] = useState(null);
  const [piApproveOpenModal, setPiApproveOpenModal] = useState(false);

  const handleApproveOpen = () => {
    if (isRejected) {
      showSnackbar('Cannot change state, as already rejected', 'error');
      return;
    }
    if (approved) {
      showSnackbar('Cannot change state, as already approved', 'error');
      return;
    }
    setPiApproveOpenModal(true);
    setAnchorEl(null);
  };

  const handleApproveClose = () => {
    setPiApproveOpenModal(false);
  };

  async function handleApprove() {
    setTimelineloader(true);
    const payload = {
      piNumber: purchaseId,
      piStatus: 'APPROVED',
      comments: 'string',
      updatedByUser: userInfo?.uidx,
      rejectedReason: 'string',
    };

    try {
      const res = await approvedpurchaserequest(payload);
      if (res?.data?.status === 'ERROR') {
        setPiApproveOpenModal(false);
        setTimelineloader(false);
        return;
      }
      showSnackbar('Success PI Approved', 'success');
      setPiApproveOpenModal(false);
      setTimelineloader(false);
      fetchPurchaseDetails({ isPiPage: true, isPoPage: false });
      await timelineFunction({ isPiPage: true, isPoPage: false });
      piAgeData();
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setPiApproveOpenModal(false);
      setTimelineLoader(false);
    }
  }

  //po rejection
  const [openPoRejectModal, setOpenPoRejectModal] = useState(false);
  const [poRejectReason, setPoRejectionReason] = useState('');
  const handleCloseModalPoReject = () => setOpenPoRejectModal(false);
  const handlePoReject = () => {
    setOpenPoRejectModal(true);
    setAnchorEl(null);
  };

  async function handlePORejection() {
    setTimelineloader(true);
    const payload = {
      poNumber: purchaseId,
      poStatus: 'REJECTED',
      poEvents: 'REJECT',
      comments: poRejectReason,
      updatedByUser: userInfo?.uidx,
    };

    try {
      const result = await rejectpurchaseorder(payload);
      showSnackbar('Success PO Canceled', 'success');
      navigate('/purchase/purchase-orders');
      setTimelineLoader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setTimelineloader(false);
    }
  }

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <div>
      <NewPurchaseDetailsPage
        isPi={isPi}
        isPo={isPo}
        purchaseIndentDetails={purchaseIndentDetails}
        purchaseOrderDetails={purchaseOrderDetails}
        purchaseId={purchaseId}
        additionalDetails={additionalDetails}
        timelineArray={isPi ? piTimelineData : isPo && poTimelineData}
        piType={piType}
        handleMenu={handleMenu}
        handlePoMenu={handlePOMenu}
        timelineLoader={timelineLoader}
        timelineFunction={timelineFunction}
        loader={loader}
        addressDetails={addressDetails}
        createdBy={createdBy}
        handlePiApprove={handleApproveOpen}
        handlePiDecline={handleReject}
        isRelatedPoCreated={relatedPurchaseOrderDataRows?.length > 0}
        handleClickpdfPi={handleClickpdf}
        handleClickpdfPo={handlePoPdf}
        pdfDownloaderLoader={pdfDownloaderLoader}
        convertPo={convertPo}
        isPoInwarded={inwardedItemsDataRows?.length > 0}
      >
        {!isMobileDevice && addressDetails && isPo && (
          <div className="vendor-details-pi">
            <BillingAddress title="Vendor Details" addressData={addressDetails?.vendorAddress} />
            <BillingAddress title="Billing Address" addressData={addressDetails?.vendorBillingAddress} />
            <BillingAddress title="Shipping Address" addressData={addressDetails?.vendorShippingAddress} />
          </div>
        )}

        <div className="purchase-details-datagrid">
          <div className="pinsghts-title-main-container">
            <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">
              {isPi ? (isMobileDevice ? 'Product Details' : 'Indent Details') : 'PO Details'}
            </span>
          </div>
          {isMobileDevice ? (
            isPi ? (
              <>
                <div
                  className="indent-details-mob-card-main-container"
                  style={{ height: purchaseIndentDataRows?.rows?.length <= 2 ? 'auto' : '400px' }}
                >
                  {purchaseIndentDataRows?.rows?.map((item, index) => (
                    <CommonPurchaseCard
                      data={item}
                      index={index}
                      handleProductNavigation={handleProductNavigation}
                      // getTagDescription={getTagDescription}
                      // categoryColour={categoryColour}
                    />
                  ))}
                </div>
                {purchaseIndentDataRows?.rows?.length === 0 && (
                  <div className="no-data-purchase width-100">
                    <span>No Data found</span>
                  </div>
                )}
              </>
            ) : (
              isPo && (
                <>
                  <div
                    className="indent-details-mob-card-main-container"
                    style={{ height: purchaseOrderDataRows?.rows?.length <= 2 ? 'auto' : '400px' }}
                  >
                    {purchaseOrderDataRows?.rows?.map((item, index) => (
                      <CommonPurchaseCard
                        data={item}
                        index={index}
                        isPo={isPo}
                        handleProductNavigation={handleProductNavigation}
                      />
                    ))}
                  </div>
                  {purchaseOrderDataRows?.rows?.length === 0 && (
                    <div className="no-data-purchase width-100">
                      <span>No Data found</span>
                    </div>
                  )}
                </>
              )
            )
          ) : (
            <CommonDataGrid
              columns={isPi ? indentDetailsColumns : orderDetailsColumns}
              rows={isPi ? purchaseIndentDataRows?.rows : purchaseOrderDataRows?.rows}
              rowCount={purchaseIndentDataRows?.total || purchaseOrderDataRows?.total}
              disableSelectionOnClick
            />
          )}
        </div>

        <div className="purchase-details-datagrid">
          <div className="pinsghts-title-main-container">
            <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">
              {isPi ? 'Related Purchase Orders' : 'Inward (GRN) Report'}
            </span>
          </div>
          {isMobileDevice ? (
            isPi ? (
              <div
                className="indent-details-mob-card-main-container"
                style={{ height: relatedPurchaseOrderDataRows?.length <= 2 ? 'auto' : '400px' }}
              >
                {relatedPurchaseOrderDataRows?.length ? (
                  relatedPurchaseOrderDataRows?.map((item, index) => <RelatedPoCard data={item} index={index} />)
                ) : (
                  <div className="no-data-purchase">
                    <span>No related purchase orders found</span>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="indent-details-mob-card-main-container"
                style={{ height: inwardedItemsDataRows?.length <= 1 ? 'auto' : '400px' }}
              >
                {inwardedItemsDataRows?.length ? (
                  inwardedItemsDataRows?.map((item, index) => <InwardCard data={item} index={index} />)
                ) : (
                  <div className="no-data-purchase">
                    <span>No related inwarded items found</span>
                  </div>
                )}
              </div>
            )
          ) : (
            <CommonDataGrid
              columns={isPi ? relatedPurchaseOrderColumns : inwardedDetailsColumns}
              rows={isPi ? relatedPurchaseOrderDataRows : inwardedItemsDataRows}
              rowCount={relatedPurchaseOrderDataRows?.length || inwardedItemsDataRows?.length}
              disableSelectionOnClick
            />
          )}
        </div>
        {isMobileDevice && isPi && vendorList?.length > 0 && (
          <div className="purchase-details-datagrid">
            <div className="width-100">
              <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">Vendor List</span>
              <div style={{ height: vendorList?.length <= 2 ? 'auto' : '400px' }} className="main-vendor-list-parent">
                {vendorList?.map((item) => (
                  <VendorListCard item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
        {isMobileDevice && isPo && (
          <div className="purchase-details-datagrid">
            <div className="address-list-pi-po-ros-app">
              <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">Addresses</span>
              <div style={{ height: 'auto' }} className="main-adress-list-parent">
                <CommonMobileAddressDetail
                  heading={'Vendor Address'}
                  address={addressDetails?.vendorAddress}
                  includeFields={isPo ? [] : ['addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
                />
                <CommonMobileAddressDetail
                  heading={'Billing Address'}
                  address={addressDetails?.vendorBillingAddress}
                  includeFields={isPo ? [] : ['addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
                />
                <CommonMobileAddressDetail
                  heading={'Shipping Address'}
                  address={addressDetails?.vendorShippingAddress}
                  includeFields={isPo ? [] : ['addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
                />
              </div>
            </div>
          </div>
        )}
        {isMobileDevice && (
          <CommonAccordion title={isPo ? 'Purchase Order Timeline' : 'Indent Timeline'} backgroundColor={'black-D'}>
            <div className="common-timeline-main-div">
              <CommonTimeLine
                timelineArray={isPi ? piTimelineData : isPo && poTimelineData}
                timelineLoader={timelineLoader}
                purchaseId={purchaseId}
                timelineFunction={timelineFunction}
              />
            </div>
          </CommonAccordion>
        )}
        {isMobileDevice && (
          <DetailsPageEndInfo
            isPi={isPi}
            isPo={isPo}
            data={isPi ? purchaseIndentDetails : purchaseOrderDetails}
            createdBy={createdBy}
          />
        )}
        <div
          style={{
            paddingTop: isMobileDevice && '10px',
            width: isMobileDevice && '100%',
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
        <>
          <MobileDrawerCommon
            anchor="bottom"
            paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
            drawerOpen={openIndentDetailsDrawer}
            drawerClose={handleClose}
            overflowHidden={true}
          >
            <div className="mobileDrawer-box-wrapper">
              {indentDetailsSelectedValue === 'indent_timeline' && (
                <div className="component-bg-br-sh-p">
                  <CommonTimeLine
                    timelineArray={isPi ? piTimelineData : isPo && poTimelineData}
                    timelineLoader={timelineLoader}
                    purchaseId={purchaseId}
                    timelineFunction={timelineFunction}
                  />
                </div>
              )}
              {indentDetailsSelectedValue === 'vendor_details' && (
                <BillingAddress title="Vendor Details" addressData={addressDetails?.vendorAddress} />
              )}
              {indentDetailsSelectedValue === 'billing_address' && (
                <BillingAddress title="Billling Address" addressData={addressDetails?.vendorBillingAddress} />
              )}
              {indentDetailsSelectedValue === 'shipping_address' && (
                <BillingAddress title="Shipping Address" addressData={addressDetails?.vendorShippingAddress} />
              )}
            </div>
          </MobileDrawerCommon>
          <Menu
            id="basic-menu"
            // className="menu-box"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleApproveOpen}>Approve</MenuItem>
            <MenuItem onClick={handleReject}>Reject</MenuItem>
            {!isRejected && (relatedPurchaseOrderDataRows?.length === 0 || piRejected) && (
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
            )}
            <MenuItem onClick={convertPo}>Convert To P.O</MenuItem>
            <MenuItem
              onClick={
                featureSettings !== null && featureSettings['QUOTE_MANAGEMENT'] == 'FALSE'
                  ? handleOpenUpgradePlan
                  : handleOpenModal
              }
            >
              {featureSettings !== null && featureSettings['QUOTE_MANAGEMENT'] == 'FALSE' ? (
                <img src={crownIcon} style={{ height: '1rem' }} />
              ) : null}
              Add a quote
            </MenuItem>
            <MenuItem onClick={handleClickpdf}>
              {pdfDownloaderLoader ? (
                <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />
              ) : (
                'Export as PDF'
              )}
            </MenuItem>
          </Menu>
          {!isMobileDevice ? (
            <Modal
              open={openModal2}
              onClose={handleCloseModal2}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div className="pi-approve-menu-1">
                <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                  Purchase indent rejected cannot be revoked. Are you sure you want to reject?
                </SoftTypography>
                <SoftBox>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                  >
                    Reason
                  </SoftTypography>
                </SoftBox>
                <SoftSelect
                  defaultValue={{ value: '', label: '' }}
                  onChange={(e) => setRejection(e.value)}
                  options={[
                    { value: 'Dummy PI', label: 'Dummy PI' },
                    { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                    { value: 'Needs revision', label: 'Needs revision' },
                    { value: 'Others', label: 'Others' },
                  ]}
                />
                <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                  <SoftButton className="vendor-second-btn" onClick={handleCloseModal2}>
                    Cancel
                  </SoftButton>
                  {timelineloader ? (
                    <SoftButton color="info" variant="gradient">
                      <CircularProgress
                        size={24}
                        sx={{
                          color: '#fff',
                        }}
                      />
                    </SoftButton>
                  ) : (
                    <SoftButton className="vendor-add-btn" onClick={handleRejecthandler}>
                      Save
                    </SoftButton>
                  )}
                </SoftBox>
              </div>
            </Modal>
          ) : (
            <MobileDrawerCommon
              anchor="bottom"
              paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
              drawerOpen={openModal2}
              drawerClose={handleCloseModal2}
              overflowHidden={true}
            >
              <div className="pi-approve-menu-1-mobile">
                <SoftTypography id="modal-modal-title" className="reject-title-new-pi" variant="h6" component="h2">
                  Purchase indent rejected cannot be revoked. Are you sure you want to reject?
                </SoftTypography>
                <div className="reason-main-div">
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                    sx={{
                      textAlign: 'start',
                    }}
                  >
                    Reason
                  </SoftTypography>
                </div>
                <SoftBox sx={{ width: '100% !important', marginBottom: '10px' }}>
                  <SoftSelect
                    defaultValue={{ value: '', label: '' }}
                    onChange={(e) => setRejection(e.value)}
                    options={[
                      { value: 'Dummy PI', label: 'Dummy PI' },
                      { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                      { value: 'Needs revision', label: 'Needs revision' },
                      { value: 'Others', label: 'Others' },
                    ]}
                    menuPlacement="top"
                    sx={{
                      width: '100% !important',
                    }}
                  />
                </SoftBox>
                <SoftBox className="header-button-action-main-div" style={{ gap: '10px' }}>
                  <CustomMobileButton
                    variant={'black-S'}
                    className="picancel-btn"
                    title={'Cancel'}
                    onClickFunction={handleCloseModal2}
                  />

                  <CustomMobileButton
                    variant={'blue-D'}
                    className="picancel-btn"
                    title={'Save'}
                    onClickFunction={handleRejecthandler}
                    loading={timelineloader}
                  />
                </SoftBox>
              </div>
            </MobileDrawerCommon>
          )}
          {!isMobileDevice ? (
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="modal-pi-border"
            >
              <div className="pi-box-inventory">
                <Grid container spacing={1} p={1}>
                  <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Select Vendor
                    </SoftTypography>
                  </SoftBox>
                  <Grid item xs={12} sm={12}>
                    <SoftSelect options={dataRows} onChange={(e) => setVendorData(e.value)} />
                  </Grid>

                  <SoftBox className="attach-file-box" mt={3}>
                    {selectedImages ? (
                      <SoftBox className="logo-box-org-I">
                        <img src={selectedImages} className="logo-box-org" />
                        <Grid item xs={12} md={6} xl={6}>
                          <SoftButton onClick={() => setSelectedImages('')}>
                            <EditIcon />
                          </SoftButton>
                        </Grid>
                      </SoftBox>
                    ) : (
                      <SoftBox className="add-customer-file-box-I">
                        <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                        <SoftBox className="profile-box-up">
                          <input type="file" name="file" id="my-file" className="hidden" onChange={handleFileChange} />
                          <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                            <SoftTypography className="upload-text-I">Upload Photo</SoftTypography>
                          </label>
                        </SoftBox>
                      </SoftBox>
                    )}
                  </SoftBox>
                  <Grid item xs={12} sm={12}>
                    <SoftBox className="header-submit-box">
                      <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                        cancel
                      </SoftButton>
                      <SoftButton className="vendor-add-btn" onClick={handleSubmitFile}>
                        {addquoteLoader ? <CircularProgress size={18} /> : 'Save'}
                      </SoftButton>
                    </SoftBox>
                  </Grid>
                </Grid>
              </div>
            </Modal>
          ) : (
            <MobileDrawerCommon
              anchor="bottom"
              paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
              drawerOpen={openModal}
              drawerClose={handleCloseModal}
            >
              <Box className="pi-box-inventory" sx={{ margin: '0px', width: '100% !important' }}>
                <Grid container spacing={1} p={1}>
                  <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Select Vendor
                    </SoftTypography>
                  </SoftBox>
                  <Grid item xs={12} sm={12}>
                    <SoftSelect options={dataRows} onChange={(e) => setVendorData(e.value)} />
                  </Grid>

                  <SoftBox className="attach-file-box" mt={3}>
                    {selectedImages ? (
                      <SoftBox className="logo-box-org-I">
                        <img src={selectedImages} className="logo-box-org" />
                        <Grid item xs={12} md={6} xl={6}>
                          <SoftButton onClick={() => setSelectedImages('')}>
                            <EditIcon />
                          </SoftButton>
                        </Grid>
                      </SoftBox>
                    ) : (
                      <SoftBox className="add-customer-file-box-I">
                        <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                        <SoftBox className="profile-box-up">
                          <input type="file" name="file" id="my-file" className="hidden" onChange={handleFileChange} />
                          <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                            <SoftTypography className="upload-text-I">Upload Photo</SoftTypography>
                          </label>
                        </SoftBox>
                      </SoftBox>
                    )}
                  </SoftBox>
                  <Grid item xs={12} sm={12}>
                    <SoftBox className="header-submit-box">
                      <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                        cancel
                      </SoftButton>
                      <SoftButton className="vendor-add-btn" onClick={handleSubmitFile}>
                        {addquoteLoader ? <CircularProgress size={18} /> : 'Save'}
                      </SoftButton>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Box>
            </MobileDrawerCommon>
          )}
          <Modal
            open={openUpgradeModal}
            onClose={handleCloseUpgradeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div
              style={{
                width: '60vw',
                height: '70vh',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
                marginTop: '6rem',
                borderRadius: '1rem',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-6rem',
                  bottom: '3rem',
                  width: '100%',
                }}
              >
                <UpgradePlan />
              </div>
            </div>
          </Modal>
        </>
        <Menu
          anchorEl={poAnchorEl}
          open={open2}
          onClose={handlePOMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {inwardedItemsDataRows?.length === 0 && !isMobileDevice && <MenuItem onClick={handlePOEdit}>Edit</MenuItem>}
          <MenuItem onClick={handleBillModal}>Add Bill</MenuItem>
          <MenuItem onClick={handlePaymentModal}>Add Payment</MenuItem>
          {!isMobileDevice && <MenuItem onClick={handleInwardNavigate}>Inward (GRN)</MenuItem>}
          {/* <MenuItem onClick={() => GoToPiForm()}>Edit</MenuItem> */}
          {!isMobileDevice && (
            <MenuItem onClick={handlePoPdf}>
              {pdfDownloaderLoader ? (
                <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />
              ) : (
                'Export as PDF'
              )}
            </MenuItem>
          )}
          <MenuItem onClick={handleSendToVendor}>
            {sendToVendorLoader ? (
              <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />
            ) : (
              'Send to Vendor'
            )}
          </MenuItem>
          <MenuItem onClick={handlePoReject}>Cancel</MenuItem>
        </Menu>
        {!isMobileDevice && (
          <Modal open={openPaymentModal} onClose={handlePaymentModal} className="modal-pi-border">
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
                <SoftBox className="soft-select-menu-box-O-bill">
                  <SoftSelect
                    placeholder="Bill No"
                    options={datRowsbill}
                    onChange={(e) => {
                      setBillNumber(e?.value);
                      setBillBalance(e?.balance);
                      setBillPoNum(e?.poNumber);
                      setBillStatus(e?.status);
                      setBillGenerated(true);
                    }}
                  />
                </SoftBox>
                {billGenerated ? (
                  <Box ml={2} mt={0.5}>
                    <Grid item xs={12} md={12}>
                      <SoftTypography fontSize="12px">
                        <b>P.O No:</b> {billPoNum}{' '}
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <SoftTypography fontSize="12px">
                        <b>Balance:</b> Rs. {billBalance}{' '}
                      </SoftTypography>
                    </Grid>
                  </Box>
                ) : null}

                <Grid item xs={12} md={12}>
                  <FormField
                    type="number"
                    label="Amount"
                    placeholder="Rs."
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontSize="13px" fontWeight="bold">
                      Date
                    </SoftTypography>
                  </SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      // disablePast
                      views={['year', 'month', 'day']}
                      format="DD-MM-YYYY"
                      onChange={(date) => setPaymentDate(format(date.$d, 'yyyy-MM-dd'))}
                    />
                  </LocalizationProvider>
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
                      Payment Mode
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    options={[
                      { value: 'cash', label: 'Cash' },
                      { value: 'cheque', label: 'Cheque' },
                      { value: 'bank transfer', label: 'Bank Transfer' },
                      { value: 'online payment', label: 'Online Payment' },
                      { value: 'credit card', label: 'Credit card' },
                      { value: 'debit card', label: 'Debit card' },
                    ]}
                    onChange={(e) => setPaymentMethod(e.value)}
                  />
                </Grid>
                <SoftBox className="attach-file-box" mt={3}>
                  {paymentSelectedImages ? (
                    <SoftBox className="logo-box-org-I">
                      <img src={paymentSelectedImages} className="logo-box-org" />
                      <Grid item xs={12} md={6} xl={6}>
                        <SoftButton onClick={() => setPaymentSelectedImages('')}>
                          <EditIcon />
                        </SoftButton>
                      </Grid>
                    </SoftBox>
                  ) : (
                    <SoftBox className="add-customer-file-box-I">
                      <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                      <SoftBox className="profile-box-up">
                        <input
                          type="file"
                          name="file"
                          id="my-file"
                          className="hidden"
                          onChange={handlePaymentFileChange}
                        />
                        <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                          <SoftTypography className="upload-text-I">
                            Upload <UploadFileIcon />{' '}
                          </SoftTypography>
                        </label>
                      </SoftBox>
                    </SoftBox>
                  )}
                </SoftBox>
                <Grid item xs={12} sm={12}>
                  <SoftBox className="header-submit-box">
                    <SoftButton className="vendor-second-btn" onClick={handlePaymentModal}>
                      cancel
                    </SoftButton>
                    <SoftButton className="vendor-add-btn" onClick={handlePaymentSubmitForm}>
                      {saveLoader ? <CircularProgress size={18} /> : 'Save'}
                    </SoftButton>
                  </SoftBox>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        )}
        {/* Mobile Drawer */}
        {isMobileDevice && (
          <MobileDrawerCommon anchor="bottom" drawerOpen={openPaymentModal} drawerClose={handlePaymentModal}>
            <Box className={`${isMobileDevice ? 'payment-drawer-mob' : 'pi-box-inventory'}`}>
              <SoftBox className="width-hunderedpercent">
                <SoftSelect
                  placeholder="Bill No"
                  options={datRowsbill}
                  onChange={(e) => {
                    setBillNumber(e?.value);
                    setBillBalance(e?.balance);
                    setBillPoNum(e?.poNumber);
                    setBillStatus(e?.status);
                    setBillGenerated(true);
                  }}
                />
              </SoftBox>
              {billGenerated ? (
                <Box ml={2} mt={0.5}>
                  <Grid item xs={12} md={12}>
                    <SoftTypography fontSize="12px">
                      <b>P.O No:</b> {billPoNum}{' '}
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftTypography fontSize="12px">
                      <b>Balance:</b> Rs. {billBalance}{' '}
                    </SoftTypography>
                  </Grid>
                </Box>
              ) : null}

              <FormField
                type="number"
                label="Amount"
                placeholder="Rs."
                onChange={(e) => setPaidAmount(e.target.value)}
              />
              <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography fontSize="13px" fontWeight="bold">
                  Date
                </SoftTypography>
              </SoftBox>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="width-hunderedpercent"
                  disablePast
                  views={['year', 'month', 'day']}
                  format="DD-MM-YYYY"
                  onChange={(date) => setPaymentDate(format(date.$d, 'yyyy-MM-dd'))}
                />
              </LocalizationProvider>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Payment Mode
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                className="width-hunderedpercent"
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'bank transfer', label: 'Bank Transfer' },
                  { value: 'online payment', label: 'Online Payment' },
                  { value: 'credit card', label: 'Credit card' },
                  { value: 'debit card', label: 'Debit card' },
                ]}
                onChange={(e) => setPaymentMethod(e.value)}
              />
              <SoftBox className="attach-file-box" mt={3}>
                {paymentSelectedImages ? (
                  <SoftBox className="logo-box-org-I">
                    <img src={paymentSelectedImages} className="logo-box-org" />
                    <Grid item xs={12} md={6} xl={6}>
                      <SoftButton onClick={() => setPaymentSelectedImages('')}>
                        <EditIcon />
                      </SoftButton>
                    </Grid>
                  </SoftBox>
                ) : (
                  <SoftBox className="add-customer-file-box-I">
                    <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                    <SoftBox className="profile-box-up">
                      <input
                        type="file"
                        name="file"
                        id="my-file"
                        className="hidden"
                        onChange={handlePaymentFileChange}
                      />
                      <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                        <SoftTypography className="upload-text-I">
                          Upload <UploadFileIcon />{' '}
                        </SoftTypography>
                      </label>
                    </SoftBox>
                  </SoftBox>
                )}
              </SoftBox>
              <SoftBox className="header-submit-box-mob">
                <SoftButton className="vendor-second-btn" onClick={handlePaymentModal}>
                  cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={handlePaymentSubmitForm}>
                  {saveLoader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </MobileDrawerCommon>
        )}
        {!isMobileDevice && (
          <Modal open={openBillModal} onClose={handleBillModal} className="modal-pi-border">
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
                      <b>Purchase value:</b> Rs. {additionalDetails?.poValue}{' '}
                    </SoftTypography>
                  </Grid>
                </Box>
                <Grid item xs={12} md={12}>
                  <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontSize="13px" fontWeight="bold">
                      Due date
                    </SoftTypography>
                  </SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disablePast
                      views={['year', 'month', 'day']}
                      format="DD-MM-YYYY"
                      onChange={(date) => setBillDate(format(date.$d, 'yyyy-MM-dd'))}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={12}>
                  <SoftTypography variant="h6">Reference Number</SoftTypography>
                  <SoftBox>
                    <SoftInput type="text" onChange={(e) => setBillReference(e.target.value)} />
                  </SoftBox>
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
                      Payment Terms
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    options={[
                      { value: 'due on receipts', label: 'Due On receipts' },
                      { value: 'net 30', label: 'Net 30' },
                      { value: 'DUE END OF MONTH', label: 'DUE END OF MONTH' },
                      { value: 'net 15', label: 'NET 15' },
                      { value: 'due on delivery', label: 'Due On Delivery' },
                    ]}
                    onChange={(e) => setPaymentMethod(e.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12} style={{ marginTop: '-10px' }}>
                  <SoftBox className="textarea-box">
                    <SoftTypography fontSize="12px" fontWeight="bold">
                      Customer Notes
                    </SoftTypography>
                    <SoftBox>
                      <TextareaAutosize
                        onChange={(e) => setBillComment(e.target.value)}
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Will be displayed on Bill Details"
                        className="add-pi-textarea"
                      />
                    </SoftBox>
                  </SoftBox>
                </Grid>

                <SoftBox className="attach-file-box" style={{ margin: 'auto', marginTop: '10px' }}>
                  {billSelectedImages ? (
                    <SoftBox className="logo-box-org-I">
                      <img src={billSelectedImages} className="logo-box-org" />
                      <Grid item xs={12} md={6} xl={6}>
                        <SoftButton onClick={() => setBillSelectedImages('')}>
                          <EditIcon />
                        </SoftButton>
                      </Grid>
                    </SoftBox>
                  ) : (
                    <SoftBox className="add-customer-file-box-I">
                      <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                      <SoftBox className="profile-box-up">
                        <input
                          type="file"
                          name="file"
                          id="my-file"
                          className="hidden"
                          onChange={handleBillFileChange}
                        />
                        <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                          <SoftTypography className="upload-text-I">
                            Upload <UploadFileIcon />{' '}
                          </SoftTypography>
                        </label>
                      </SoftBox>
                    </SoftBox>
                  )}
                </SoftBox>
                <Grid item xs={12} sm={12}>
                  <SoftBox className="header-submit-box">
                    <SoftButton className="vendor-second-btn" onClick={handleBillModal}>
                      cancel
                    </SoftButton>
                    <SoftButton className="vendor-add-btn" onClick={handleBillSubmitForm}>
                      {saveLoader ? <CircularProgress size={18} /> : 'Save'}
                    </SoftButton>
                  </SoftBox>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        )}
        {/* Mobile Drawer */}
        {isMobileDevice && (
          <MobileDrawerCommon drawerOpen={openBillModal} drawerClose={handleBillModal} anchor="bottom">
            <SoftButton
              className="back-icon-button"
              onClick={handleBillModal}
              sx={{ backgroundColor: 'white !important' }}
            >
              <ArrowBackIosNewIcon className="back-icon-navbar" />
            </SoftButton>
            <Box className={`${isMobileDevice ? 'payment-drawer-mob' : 'pi-box-inventory'}`}>
              <Box ml={0.5} mt={0.5}>
                <Grid item xs={12} md={12}>
                  <SoftTypography fontSize="12px">
                    <b>Purchase value:</b> Rs. {additionalDetails?.poValue}{' '}
                  </SoftTypography>
                </Grid>
              </Box>
              <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography fontSize="13px" fontWeight="bold">
                  Due date
                </SoftTypography>
              </SoftBox>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="width-hunderedpercent"
                  disablePast
                  views={['year', 'month', 'day']}
                  format="DD-MM-YYYY"
                  onChange={(date) => setBillDate(format(date.$d, 'yyyy-MM-dd'))}
                />
              </LocalizationProvider>

              <FormField
                type="number"
                label="Reference no"
                placeholder="Ex. A24M"
                onChange={(e) => setBillReference(e.target.value)}
              />
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Payment Terms
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                className="width-hunderedpercent"
                options={[
                  { value: 'due on receipts', label: 'Due On receipts' },
                  { value: 'net 30', label: 'Net 30' },
                  { value: 'DUE END OF MONTH', label: 'DUE END OF MONTH' },
                  { value: 'net 15', label: 'NET 15' },
                  { value: 'due on delivery', label: 'Due On Delivery' },
                ]}
                onChange={(e) => setPaymentMethod(e.value)}
              />
              <SoftTypography fontSize="12px" fontWeight="bold">
                Customer Notes
              </SoftTypography>
              <SoftBox width="100%">
                <TextareaAutosize
                  onChange={(e) => setBillComment(e.target.value)}
                  // aria-label="minimum height"
                  // minRows={3}
                  placeholder="Will be displayed on Bill Details"
                  className="add-pi-textarea"
                />
              </SoftBox>
              <SoftBox className="attach-file-box" style={{ margin: 'auto', marginTop: '-5px' }}>
                {billSelectedImages ? (
                  <SoftBox className="logo-box-org-I">
                    <img src={billSelectedImages} className="logo-box-org" />
                    <Grid item xs={12} md={6} xl={6}>
                      <SoftButton onClick={() => setBillSelectedImages('')}>
                        <EditIcon />
                      </SoftButton>
                    </Grid>
                  </SoftBox>
                ) : (
                  <SoftBox className="add-customer-file-box-I">
                    <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                    <SoftBox className="profile-box-up">
                      <input type="file" name="file" id="my-file" className="hidden" onChange={handleBillFileChange} />
                      <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                        <SoftTypography className="upload-text-I">
                          Upload <UploadFileIcon />{' '}
                        </SoftTypography>
                      </label>
                    </SoftBox>
                  </SoftBox>
                )}
              </SoftBox>
              <SoftBox className="header-submit-box-mob">
                <SoftButton className="vendor-second-btn" onClick={handleBillModal}>
                  cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={handleBillSubmitForm}>
                  {saveLoader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </MobileDrawerCommon>
        )}
        {!isMobileDevice ? (
          <Modal
            open={piApproveOpenModal}
            onClose={handleApproveClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                {' '}
                {/* <img src={crownIcon} style={{ height: '1.5rem' }} /> */}
                Are you sure you want to approve this.
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={handleApproveClose}>
                  Cancel
                </SoftButton>
                {timelineloader ? (
                  <SoftButton color="info" variant="gradient">
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  </SoftButton>
                ) : (
                  <SoftButton className="vendor-add-btn" onClick={handleApprove}>
                    Save
                  </SoftButton>
                )}
              </SoftBox>
            </Box>
          </Modal>
        ) : (
          <MobileDrawerCommon
            anchor="bottom"
            paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
            drawerOpen={piApproveOpenModal}
            drawerClose={handleApproveClose}
          >
            <Box className="approve-modal-new-pi">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to approve this.
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn picancel-btn" onClick={handleApproveClose}>
                  Cancel
                </SoftButton>
                {timelineloader ? (
                  <SoftButton color="info" variant="gradient" className="picancel-btn">
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  </SoftButton>
                ) : (
                  <SoftButton className="vendor-add-btn picancel-btn" onClick={handleApprove}>
                    Save
                  </SoftButton>
                )}
              </SoftBox>
            </Box>
          </MobileDrawerCommon>
        )}
        {!isMobileDevice ? (
          <Modal
            open={openPoRejectModal}
            onClose={handleCloseModalPoReject}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu-1">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Purchase order canceled cannot be revoked. Are you sure you want to cancel?
              </SoftTypography>
              <SoftBox>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Reason
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                defaultValue={{ value: '', label: '' }}
                onChange={(e) => setPoRejectionReason(e.value)}
                options={[
                  { value: 'Dummy PO', label: 'Dummy PO' },
                  { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                  { value: 'Needs revision', label: 'Needs revision' },
                  { value: 'Price change', label: 'Price change' },
                  { value: 'Others', label: 'Others' },
                ]}
              />
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={handleCloseModalPoReject}>
                  Cancel
                </SoftButton>
                {timelineloader ? (
                  <SoftButton color="info" variant="gradient">
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  </SoftButton>
                ) : (
                  <SoftButton className="vendor-add-btn" onClick={handlePORejection}>
                    Save
                  </SoftButton>
                )}
              </SoftBox>
            </Box>
          </Modal>
        ) : (
          <MobileDrawerCommon
            anchor="bottom"
            paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
            drawerOpen={openPoRejectModal}
            drawerClose={handleCloseModalPoReject}
            overflowHidden={true}
          >
            <Box className="pi-approve-menu-1-mobile">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2" className="rejected-title">
                Purchase order canceled cannot be revoked. Are you sure you want to cancel?
              </SoftTypography>
              <SoftBox className="reason-main-div-po">
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Reason
                </SoftTypography>
                <SoftSelect
                  defaultValue={{ value: '', label: '' }}
                  onChange={(e) => setPoRejectionReason(e.value)}
                  options={[
                    { value: 'Dummy PO', label: 'Dummy PO' },
                    { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                    { value: 'Needs revision', label: 'Needs revision' },
                    { value: 'Price change', label: 'Price change' },
                    { value: 'Others', label: 'Others' },
                  ]}
                  menuPlacement="top"
                  sx={{
                    width: '100% !important',
                  }}
                />
              </SoftBox>
              <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModalPoReject}>
                  Cancel
                </SoftButton>
                {timelineloader ? (
                  <SoftButton color="info" variant="gradient" className="vendor-add-btn picancel-btn">
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  </SoftButton>
                ) : (
                  <SoftButton className="vendor-add-btn picancel-btn" onClick={handlePORejection}>
                    Save
                  </SoftButton>
                )}
              </SoftBox>
            </Box>
          </MobileDrawerCommon>
        )}
      </NewPurchaseDetailsPage>
    </div>
  );
};

export default NewCommonPurchaseDetailsPage;
