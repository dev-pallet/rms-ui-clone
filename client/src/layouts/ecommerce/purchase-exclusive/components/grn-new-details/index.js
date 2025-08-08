import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import NorthIcon from '@mui/icons-material/North';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import SouthIcon from '@mui/icons-material/South';
import StorefrontIcon from '@mui/icons-material/Storefront';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, Chip, ClickAwayListener, Menu, MenuItem, Modal, Tooltip, styled, tooltipClasses } from '@mui/material';
import { format, parse } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import {
  approveExpressPurchaseEvent,
  createComment,
  cumulativeGRNDetails,
  deleteExpressPurchase,
  getComments,
  itemDetailsExpressPurchase,
  startExpressPurchaseEvent,
  timelineExpressPurchase,
} from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { dateFormatter } from '../../../Common/CommonFunction';
import AdditionalDetails from '../../../Common/new-ui-common-components/additional-details';
import CommentComponent from '../../../Common/new-ui-common-components/comment-component';
import CommonDataGrid from '../../../Common/new-ui-common-components/common-datagrid';
import CommonAddressCard from '../../../Common/new-ui-common-components/purchase-common-components/common-addresses';
import CommonTimeLine from '../../../Common/new-ui-common-components/timeline';
import './grn-new-details.css';

const GRNNewDetailsPage = () => {
  const { epoNumber } = useParams();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const userDetails = localStorage.getItem('user_details');
  const contextType = localStorage.getItem('contextType');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const [loader, setLoader] = useState(false);
  const [allData, setAllData] = useState();
  const [grnTimelineData, setGRNTimelineData] = useState([]);
  const [timelineLoader, setTimelineLoader] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [additionalDetailsArray, setAdditionalDetailsArray] = useState([]);
  const [infoDetails, setInfoDetails] = useState({});
  const [comments, setComments] = useState([]);
  const [purchaseOfferDetails, setPurchaseOfferDetails] = useState([]);
  const [createdComment, setCreatedComment] = useState('');
  const [commentLoader, setCommentLoader] = useState(false);
  const [getCommentsLoader, setGetCommentsLoader] = useState(false);
  const [retryLoader, setRetryLoader] = useState(false);
  const [approverLoader, setApproveLoader] = useState(false);
  const [approverModal, setApproverModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addressDetails, setAddressDetails] = useState();
  const [isGRNApproved, setIsGRNApproved] = useState(false);

  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [openSecond, setOpenSecond] = useState(false);

  const handleSecondTooltipClose = () => {
    setOpenSecond(false);
  };

  const handleSecondTooltipOpen = (e) => {
    e.stopPropagation();
    setOpenSecond(true);
  };

  const additionalInfoArray = [
    { infoName: 'Inward location', infoValue: 'NA' },
    { infoName: 'Inward type', infoValue: 'NA' },
    { infoName: 'Approved by', infoValue: 'NA' },
    { infoName: 'Bill number', infoValue: 'NA' },
    { infoName: 'Bill date', infoValue: 'NA' },
    { infoName: 'Tax type', infoValue: 'NA' },
  ];

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
          const flagForecast = params?.row?.forecastData !== 'NA' ? JSON.parse(params?.row?.forecastData) : {};
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FlagTooltips
                title={
                  <div className="tooltip-flag-recommend">
                    <div className="tooltip-flag-heading-name">
                      <SoftTypography fontSize="14px" fontWeight="bold">
                        Recommendation:
                      </SoftTypography>
                      <SoftTypography
                        fontSize="14px"
                        fontWeight="bold"
                        mt={flagForecast?.grossProfitCat === 'D' ? '' : 1}
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
                      <SoftTypography fontSize="14px">{flagForecast?.recommendation || 'NA'}</SoftTypography>
                      <div className={flagForecast?.inventoryCat === 'D' ? 'tooltip-flag-cat-data' : ''}>
                        {flagForecast?.inventoryCat === 'D' ? (
                          <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>Dead Stock</span>
                        ) : (
                          <>
                            <Chip
                              color={categoryColour(flagForecast?.inventoryCat)}
                              label={flagForecast?.inventoryCat || 'NA'}
                            />
                            {flagForecast?.inventoryCat !== 'NA' && (
                              <Chip
                                color={categoryColour(flagForecast?.inventoryCat)}
                                label={getTagDescription('INVENTORY', flagForecast?.inventoryCat) || 'NA'}
                              />
                            )}
                          </>
                        )}
                      </div>
                      <div className="tooltip-flag-cat-data">
                        <Chip color={categoryColour(flagForecast?.salesCat)} label={flagForecast?.salesCat || 'NA'} />
                        {flagForecast?.salesCat !== 'NA' && (
                          <Chip
                            color={categoryColour(flagForecast?.salesCat)}
                            label={getTagDescription('SALES', flagForecast?.salesCat) || 'NA'}
                          />
                        )}
                      </div>
                      <div className="tooltip-flag-cat-data">
                        <Chip
                          color={categoryColour(flagForecast?.grossProfitCat)}
                          label={flagForecast?.grossProfitCat || 'NA'}
                        />
                        {flagForecast?.grossProfitCat !== 'NA' && (
                          <Chip
                            color={categoryColour(flagForecast?.grossProfitCat)}
                            label={getTagDescription('PROFIT', flagForecast?.grossProfitCat) || 'NA'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                }
              >
                <OutlinedFlagRoundedIcon fontSize="medium" sx={{ color: categoryColour(flagForecast?.flag) }} />
              </FlagTooltips>
              <Tooltip title={<div>{params?.row?.barcode}</div>}>
                <InfoOutlinedIcon sx={{ height: 18, width: 18, cursor: 'pointer', color: '#0562fb' }} />
              </Tooltip>
              {params?.row?.title}
            </div>
          );
        },
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        minWidth: 60,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'caseCost',
        headerName: 'Case cost',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 90,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'tax',
        headerName: 'Tax',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 60,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'cess',
        headerName: 'Cess',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 60,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'pricePerUnit',
        headerName: 'Cost / unit',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 100,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'purchaseMargin',
        headerName: 'Purchase Margin',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 90,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          const mrp = params?.row?.mrp;
          const purchasePrice = params?.row?.pricePerUnit;
          const purchaseMargin =
            mrp !== 'NA' && purchasePrice !== 'NA' ? (((mrp - purchasePrice) / mrp) * 100)?.toFixed(2) : 'NA';

          if (params?.row?.vendorMargin === 'NA') {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                {purchaseMargin}%
              </div>
            );
          } else if (purchaseMargin > params?.row?.vendorMargin) {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                {purchaseMargin}%
                <NorthIcon style={{ color: 'green' }} />
              </div>
            );
          } else if (purchaseMargin < params?.row?.vendorMargin) {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                {purchaseMargin}%
                <SouthIcon style={{ color: 'red' }} />
              </div>
            );
          } else if (purchaseMargin === params?.row?.vendorMargin) {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                {purchaseMargin}% (=)
              </div>
            );
          }
        },
      },
      {
        field: 'totalAmount',
        headerName: 'Total Amount',
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
  const purchaseOfferColumn = useMemo(
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Tooltip title={<div>{params?.row?.barcode}</div>}>
                <InfoOutlinedIcon sx={{ height: 18, width: 18, cursor: 'pointer', color: '#0562fb' }} />
              </Tooltip>
              {params?.row?.title}
            </div>
          );
        },
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        minWidth: 60,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'caseCost',
        headerName: 'Case Cost',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 90,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'offerType',
        headerName: 'Offer Type',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 60,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'costPerUnit',
        headerName: 'Cost/Unit',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 60,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'purchaseMargin',
        headerName: 'Purchase Margin',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 90,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          const mrp = params?.row?.mrp;
          const purchasePrice = params?.row?.costPerUnit;
          const purchaseMargin = (mrp - purchasePrice) / (mrp * 100);
          return <div>{purchaseMargin?.toFixed(2) || 'NA'}%</div>;
        },
      },
      {
        field: 'totalAmount',
        headerName: 'Total Amount',
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

  const array = useMemo(
    () => [
      {
        tabName: 'Indent value',
        tabValue: 'indentValue',
        tabDescription: `${allData?.indentValueDiff || '0'}% difference`,
        tabIcon: '',
      },
      {
        tabName: 'Fill Rate',
        tabValue: 'fillRate',
        tabDescription: `${allData?.fillRateFrom || '0'} products`,
        tabIcon: '',
      },
      {
        tabName: 'Purchase offers',
        tabValue: 'purchaseOffers',
        tabDescription: `on ${allData?.offerProductCount || '0'} products`,
        tabIcon: '',
      },
      {
        tabName: 'Purchase bills',
        tabValue: 'purchaseBills',
        tabDescription: `due on ${allData?.billDueDate || 'NA'}`,
        tabIcon: '',
      },
      {
        tabName: 'Additional expense',
        tabValue: 'addtionalCharge',
        tabDescription: `from ${allData?.billCount || 0} bill`,
        tabIcon: '',
      },
      {
        tabName: 'Quantity',
        tabValue: 'quantity',
        tabDescription: ` form ${allData?.fromProduct || '0'} products`,
        tabIcon: '',
      },
    ],
    [allData],
  );

  useEffect(() => {
    grnDetails();
    timelineFunction();
    fetchComments();
  }, []);

  const timelineStatusObject = (statusName, userName, date, time, logType, view, quoteId) => {
    if (logType === 'Express PO Status') {
      switch (statusName) {
        case 'Draft':
          return {
            name: 'Draft',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Pending approval':
          return {
            name: 'Pending approval',
            iconColor: '#0562fb',
            icon: <UpdateIcon />,
            userDesc: 'Pending approval',
            dateTime: `${date}, ${time}`,
          };
        case 'Accepted':
          return {
            name: 'Accepted',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Approved by  ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Po created':
          return {
            name: 'Po created',
            iconColor: '#0562fb',
            icon: <ShoppingBagIcon />,
            userDesc: `By - ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Po updated':
          return {
            name: 'Po updated',
            iconColor: '#0562fb',
            icon: <ShoppingBagIcon />,
            userDesc: `By ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Po failed':
          return {
            name: 'Po failed',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: '',
            dateTime: `${date}, ${time}`,
          };
        case 'Inward successful':
          return {
            name: 'Inward successful',
            iconColor: '#0562fb',
            icon: <StorefrontIcon />,
            userDesc: `By - ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Inward failed':
          return {
            name: 'Inward failed',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: '',
            dateTime: `${date}, ${time}`,
          };
        case 'Put away successful':
          return {
            name: 'Put away successful',
            iconColor: '#0562fb',
            icon: <SocialDistanceIcon />,
            userDesc: `By ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Put away failed':
          return {
            name: 'Put away failed',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: '',
            dateTime: `${date}, ${time}`,
          };
        case 'Close':
          return {
            name: 'Close',
            iconColor: 'green',
            icon: <DoneAllIcon />,
            userDesc: `Via Inward (GRN) - ${userName}`,
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

  const timelineFunction = () => {
    setTimelineLoader(true);
    timelineExpressPurchase(epoNumber)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data;
        const timelineData = response?.timelines?.map((item, index) => {
          // Format the parsed date
          const parsedTimestamp = parse(item?.updatedOn, 'dd MMM yyyy hh:mm:ss a', new Date()); //parsing timestamp to convert date and time in this format (dd MMMM yyyy, HH:mm 'Hours')
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
        setGRNTimelineData(timelineData);
        setTimelineLoader(false);
      })
      .catch((err) => {
        setTimelineLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const grnDetails = () => {
    setLoader(true);
    cumulativeGRNDetails(epoNumber)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          setTimelineLoader(false);
          setPurchaseOfferDetails([]);
          setItemData([]);
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es) {
          setLoader(false);
          setTimelineLoader(false);

          setPurchaseOfferDetails([]);
          setItemData([]);
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data;
        setAllData(response);
        const itemData = response?.expressPurchaseOrderItemList?.map((item, index) => ({
          id: index,
          title: item?.itemName ?? 'NA',
          mrp: item?.unitPrice ?? 'NA',
          quantity: item?.quantityOrdered ?? 'NA',
          caseCost: 'NA',
          tax: item?.gstValue ?? 'NA',
          cess: item?.cessValue ?? 'NA',
          pricePerUnit: item?.purchasePrice ?? 'NA',
          totalAmount: item?.finalPrice ?? 'NA',
          vendorMargin: item?.vendorPurchaseMargin ?? 'NA',
          barcode: item?.itemNo ?? 'NA',
          forecastData: item?.forecastData ?? 'NA',
        }));
        setItemData(itemData);
        const updatedAdditionalInfoArray = additionalInfoArray.map((info) => {
          switch (info.infoName) {
            case 'Inward location':
              return { ...info, infoValue: response?.sourceLocationName || 'NA' };
            case 'Inward type':
              // Assuming you want to use some field, add the appropriate field here
              return { ...info, infoValue: response?.inwardType }; // Replace with the correct field
            case 'Approved by':
              return { ...info, infoValue: response?.approvedBy || 'NA' };
            case 'Bill number':
              return { ...info, infoValue: response?.billNo || 'NA' };
            case 'Bill date':
              return { ...info, infoValue: dateFormatter(response?.billDate) ?? 'NA' };
            case 'Tax type':
              return { ...info, infoValue: response?.taxType || 'NA' };
            default:
              return info;
          }
        });
        setAdditionalDetailsArray(updatedAdditionalInfoArray);
        setInfoDetails({
          indentValue: response?.indentValue ?? 'NA',
          fillRate: response?.fillRate === null ? 'NA' : `${response?.fillRate}%` ?? 'NA',
          purchaseOffers: response?.purchaseOfferValue ?? 'NA',
          purchaseBills: response?.billCount ?? 'NA',
          addtionalCharge: response?.additionalExp ?? 'NA',
          quantity: response?.quantity ?? 'NA',
        });
        setAddressDetails({
          vendorAddress: response?.vendorLocationAddress,
          vendorBillingAddress: response?.sourceLocationAddress,
          vendorShippingAddress: response?.destinationLocationAddress,
        });
        const purchaseOfferDetails = response?.offerDetailsList?.map((item, index) => ({
          id: index,
          title: item?.itemName || 'NA',
          mrp: item?.mrp || 'NA',
          quantity: item?.inwardedQuantity === null ? 'NA' : item?.inwardedQuantity || 0,
          caseCost: 'NA',
          offerType: item?.offerType || 'NA',
          costPerUnit: item?.purchasePrice === null ? 'NA' : item?.purchasePrice || 0,
          totalAmount: item?.finalAmount || 0,
          barcode: item?.gtin || 'NA',
        }));
        setPurchaseOfferDetails(purchaseOfferDetails);
        if (response?.expressPOAssignedList?.length > 0) {
          const isMatch = response?.expressPOAssignedList?.some((item) => item.assignedUidx === userInfo?.uidx);
          setIsApprover(isMatch);
        }
        const grnStatus = response?.status;
        setIsGRNApproved(grnStatus === 'PENDING_APPROVAL');
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setPurchaseOfferDetails([]);
        setItemData([]);
        setTimelineLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };
  const fetchComments = () => {
    setGetCommentsLoader(true);
    getComments(epoNumber)
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

  const handleAddComment = (value) => {
    setCreatedComment(value);
  };

  const handleCreateComment = () => {
    setCommentLoader(true);
    const payload = {
      refId: epoNumber,
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

  const handleEdit = () => {
    localStorage.setItem('epoNumber', epoNumber);
    navigate(`/purchase/express-grn/create-express-grn/${epoNumber}`);
  };

  const handleRetry = async () => {
    if (allData?.eventStatus === 'IN_PROGRESS') {
      showSnackbar('Express GRN event already started', 'error');
      return;
    }
    setRetryLoader(true);
    const payload = {
      epoNumber: epoNumber,
      requestedBy: userInfo?.uidx,
      reqSourceType: contextType,
    };

    try {
      const res = await startExpressPurchaseEvent(payload);
      if (res?.data?.data?.es === 0) {
        setTimeout(() => {
          setRetryLoader(false);
          //   fetchData();
          //   exPOTimeline();
        }, 5000);
      } else if (res?.data?.data?.es === 1) {
        showSnackbar(res?.data?.data?.message, 'error');
        setRetryLoader(false);
      }
    } catch (err) {
      setRetryLoader(false);
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleApprove = () => {
    setApproverModal(true);
    handleMenuClose();
  };

  const handleApproved = async () => {
    setApproveLoader(true);
    const payload = {
      epoNumber: epoNumber,
      status: 'ACCEPTED',
      comments: 'string',
      updatedBy: userInfo?.uidx,
      userName: userInfo?.firstName + ' ' + userInfo?.secondName,
    };

    try {
      const res = await approveExpressPurchaseEvent(payload);
      showSnackbar(res?.data?.data?.message, 'success');
      timelineFunction();
      try {
        const itemRes = await itemDetailsExpressPurchase(epoNumber);
        if (itemRes?.data?.data?.es === 0) {
          setAllData(itemRes?.data?.data?.expressPurchaseOrder);
          const grnStatus = itemRes?.data?.data?.expressPurchaseOrder?.status;
          setIsGRNApproved(grnStatus === 'PENDING_APPROVAL');
        }
      } catch (err) {
        // showSnackbar(err?.response?.data?.message, 'error');
      }

      await handleRetry();
      setApproverModal(false);
      setApproveLoader(false);
    } catch (err) {
      setApproveLoader(false);
      setApproverModal(false);
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleDeleteEXPO = () => {
    setDeleteLoader(true);
    setDeleteModal(false);
    const payload = {
      userId: userInfo?.uidx,
      reason: deleteReason,
      epoNumber: epoNumber,
    };
    deleteExpressPurchase(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else {
          showSnackbar('Deleted', 'success');
          localStorage.removeItem('epoNumber');
          navigate('/purchase/express-grn');
        }
        setDeleteLoader(false);
      })
      .catch((err) => {
        setDeleteLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'red',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
    },
  }));

  const navigateToPoDetails = (poNumber) => {
    if (poNumber === 'NA' || poNumber === null || poNumber === undefined) {
      showSnackbar('PO number not available', 'error');
      return;
    }
    navigate(`/purchase/purchase-orders/details/${poNumber}`);
  };

  const handleGrnIdCopy = () => {
    navigator.clipboard.writeText(epoNumber);
    showSnackbar('Copied', 'success');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      {/* PURCHASE HEADER */}
      <div className="purchDet-main-info-container component-bg-br-sh-p">
        <div className="purchDet-main-info-main-div">
          <div className="purchDet-main-info">
            <div className="title-menu-main-container-mobile">
              <div className="purchDet-id-main-conatiner">
                <h1 className="purchase-id">{`Purchase inward ${epoNumber}`}</h1>
                <ContentCopyIcon className="copy-icon" sx={{ cursor: 'pointer' }} onClick={handleGrnIdCopy} />
                {loader && <Spinner size={20} />}
              </div>
              {allData?.status === 'PENDING_APPROVAL' && (
                <div className="menu-icon-div-mobile">
                  <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenuOpen} />
                </div>
              )}
              {/* {allData?.eventStatus === 'IN_PROGRESS' && (
                <LightTooltip
                  title={`${allData?.eventStatus === 'IN_PROGRESS' ? 'Express GRN event already started' : 'Retry'}`}
                >
                  <div className="menu-icon-div-mobile">
                    <SoftButton
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton vendor-add-btn"
                      onClick={handleRetry}
                      disabled={retryLoader || allData?.eventStatus === 'IN_PROGRESS' ? true : false}
                    >
                      {retryLoader ? <Spinner size={20} /> : <>Retry</>}
                    </SoftButton>
                  </div>
                </LightTooltip>
              )} */}
            </div>
            <div
              className="purchDet-vendor-name"
              style={{
                cursor: 'pointer',
              }}
              onClick={() => navigateToPoDetails(allData?.poNumber)}
            >
              <span className="purchDet-vendorName-value-title grn-poNumber">{`PO Number ${
                allData?.poNumber ?? 'NA'
              }`}</span>
            </div>
            <div className="purchDet-vendor-name">
              <span className="purchDet-vendorName-value-title">{`Created by ${allData?.createdBy ?? 'NA'}`}</span>
            </div>
            <div className="purchDet-vendor-name">
              <span className="purchDet-vendorName-value-title">Vendor Name</span>
              <span className="purchDet-vendorName-value-value">{allData?.vendorName}</span>
            </div>
          </div>
          <div className="purchDet-main-tools">
            <div className="purchDet-main-aprroval-info">
              <div className="purchDet-estimated-value">
                <span className="purchDet-vendorName-value-title">Bill value</span>
                <span className="estimated-value">₹{allData?.billValue === null ? 'NA' : allData?.billValue}</span>
              </div>
              <div className="purchDet-approval-info-details">
                <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Delivered on</span>
                  <span className="purchDet-vendorName-value-title">{dateFormatter(allData?.deliveredOn) || 'NA'}</span>
                </div>
                <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Delivery days</span>
                  <span className="purchDet-vendorName-value-title">{allData?.deliveryDays || '0'}</span>
                </div>
                <div className="purchDet-estimated-value">
                  <span className="purchDet-vendorName-value-title">Inward time</span>
                  <span className="estimated-value inward-time-value">{allData?.inwardTime || 'NA'}</span>
                </div>
              </div>
            </div>
            <div className="menu-icon-div">
              <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenuOpen} />
            </div>
          </div>
        </div>
        <div className="additional-info-main-container">
          {additionalDetailsArray.map((info) => {
            return (
              <div className="purchDet-header-additional-info">
                <span className="additionalInfo-title">{info?.infoName}</span>
                <span
                  className="purchDet-vendorName-value-value second-tooltip-container"
                  onClick={info?.infoName === 'Approved by' && handleSecondTooltipOpen}
                >
                  {info?.infoValue?.length > 15 ? (
                    <ClickAwayListener onClickAway={handleSecondTooltipClose}>
                      <Tooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        open={undefined}
                        onClose={undefined}
                        title={
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                            }}
                          >
                            {info?.infoValue}
                          </div>
                        }
                      >
                        {info?.infoValue?.slice(0, 15) + '...'}
                      </Tooltip>
                    </ClickAwayListener>
                  ) : (
                    info?.infoValue
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <AdditionalDetails additionalDetailsArray={array} additionalDetails={infoDetails} />
      <div className="indent-details-main-container">
        <div className="indent-details-main-div">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 0.3,
            }}
          >
            <span
              className="purch-det-heading-title"
              style={{
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              Inward timeline
            </span>
            <div className="purchase-details-timeline component-bg-br-sh-p">
              <CommonTimeLine
                timelineArray={grnTimelineData}
                timelineLoader={timelineLoader}
                purchaseId={epoNumber}
                timelineFunction={timelineFunction}
              />
            </div>
          </div>
          <div className="purchase-details-data">
            <div className="vendor-details-pi" style={{ marginTop: '50px', marginBottom: '10px' }}>
              <CommonAddressCard title="Vendor Details" addressData={addressDetails?.vendorAddress} />
              <CommonAddressCard title="Billing Address" addressData={addressDetails?.vendorBillingAddress} />
              <CommonAddressCard title="Shipping Address" addressData={addressDetails?.vendorShippingAddress} />
            </div>
            <div className="second-children-flex">
              <span className="purch-det-heading-title">Inward (GRN) report</span>
              <CommonDataGrid rows={itemData} columns={indentDetailsColumns} disableRowSelectionOnClick />
              <span className="purch-det-heading-title">Purchase Offers</span>
              <CommonDataGrid rows={purchaseOfferDetails} columns={purchaseOfferColumn} disableRowSelectionOnClick />
              <div className="comment-main-div">
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
      <Menu
        id="basic-menu"
        // className="menu-box"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {isGRNApproved && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
        {isApprover && isGRNApproved && <MenuItem onClick={handleApprove}>Approve</MenuItem>}
        <MenuItem onClick={() => setDeleteModal(true)}>Delete</MenuItem>
        {allData?.eventStatus === 'FAILED' && (
          <MenuItem
            disabled={retryLoader || allData?.eventStatus === 'IN_PROGRESS' ? true : false}
            onClick={handleRetry}
          >
            {retryLoader ? <Spinner size={20} /> : 'Retry'}
          </MenuItem>
        )}
      </Menu>
      <Modal
        open={approverModal}
        onClose={() => setApproverModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="pi-approve-menu">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to approve this.
          </SoftTypography>
          <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => setApproverModal(false)}>
              Cancel
            </SoftButton>
            {approverLoader ? (
              <SoftButton color="info" variant="gradient">
                <Spinner
                  size={24}
                  sx={{
                    color: '#fff',
                  }}
                />
              </SoftButton>
            ) : (
              <SoftButton className="vendor-add-btn" onClick={handleApproved}>
                Save
              </SoftButton>
            )}
          </SoftBox>
        </Box>
      </Modal>
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="pi-approve-menu-1">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this.
          </SoftTypography>
          <SoftSelect
            onChange={(e) => setDeleteReason(e.value)}
            options={[
              { value: 'Dummy PO', label: 'Dummy PO' },
              { value: 'Wrong data', label: 'Wrong data' },
              { value: 'No longer required', label: 'No longer required' },
              { value: 'Others', label: 'Others' },
            ]}
          />
          <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => setDeleteModal(false)}>
              Cancel
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={handleDeleteEXPO}>
              {deleteLoader ? <Spinner size={20} /> : <>Delete</>}
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};

export default GRNNewDetailsPage;
