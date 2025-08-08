import { Box, Chip, Grid, Menu, MenuItem, Modal, ThemeProvider, Tooltip, Typography, createTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';
import {
  changeStatusSTN,
  createComment,
  deleteStockTransfer,
  detailsStockTransfer,
  getComments,
  getStockTransferAdditionalDetails,
  getlocationNameByLocId,
  stnTimeline,
  vieworderspdf,
} from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
// import TimelineItem from '../../../../../../examples/Timeline/TimelineItem';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftButton from '../../../../../../components/SoftButton';
import Spinner from '../../../../../../components/Spinner';
// import TimelineSTN from './components/TimelineStn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { format, parse } from 'date-fns';
import dayjs from 'dayjs';
import SoftInput from '../../../../../../components/SoftInput';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { CopyToClipBoard, isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import AdditionalDetails from '../../../../Common/new-ui-common-components/additional-details';
import CommentComponent from '../../../../Common/new-ui-common-components/comment-component';
import CommonDataGrid from '../../../../Common/new-ui-common-components/common-datagrid';
import CommonAddressCard from '../../../../Common/new-ui-common-components/purchase-common-components/common-addresses';
import CommonTimeLine from '../../../../Common/new-ui-common-components/timeline';
import TransferProductCard from './components/product-card';
import './transferDetails.css';

export const StockTransferDetails = () => {
  const { stn } = useParams();
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const [data, setData] = useState({});
  const [itemData, setItemData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineLoader, setTimelineLoader] = useState(false);
  const [approverModal, setApproverModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [approveloader, setApproveloader] = useState(false);
  const [sourceApproval, setSourceApproval] = useState(false);
  const [shipped, setShipped] = useState(false);
  const [shipLoader, setShipLoader] = useState(false);
  const [received, setReceived] = useState(false);
  const [receiveLoader, setReceiveLoader] = useState(false);
  const [locIdDetails, setLocIdDetails] = useState([]);
  const [datRows, setTableRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [stnCreationDate, setStnCreationDate] = useState('');
  const [stnDeliveryDate, setStnDeliveryDate] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [clickedOnReceived, setClickedOnReceived] = useState(false);

  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const [createdComment, setCreatedComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoader, setCommentLoader] = useState(false);
  const [getCommentsLoader, setGetCommentsLoader] = useState(false);

  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const userName = localStorage.getItem('user_name');
  const locId = localStorage.getItem('locId');

  const chipColor = createTheme({
    palette: {
      secondary: {
        main: '#ffc107',
      },
    },
  });

  useEffect(() => {
    stnDetails();

    return () => {
      // This will run when the component unmounts
      localStorage.removeItem('newStockTransfer');
    };
  }, []);

  // Function to calculate the days between two dates
  const calculateDaysBetween = (date1, date2) => {
    return Math.abs(date1.diff(date2, 'day'));
  };

  // Function to call calculateDaysBetween
  const DateDifference = (date1, date2) => {
    return calculateDaysBetween(date1, date2);
  };

  const stnDetails = () => {
    detailsStockTransfer(stn)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.stockTransfer;
          setData(response);
          handleLocNameById(response?.sourceLocationId, response.destinationLocationId);
          setItemData(response?.stockTransferItemList);

          // Parse createdOn date
          const createdDate = dayjs(response?.createdOn, 'M/D/YY, h:mm A');
          const parsedCreatedDate = createdDate.format('D MMMM, YYYY');
          setStnCreationDate(parsedCreatedDate);

          // Parse inwardUpdatedOn date
          const inwardDate = response?.inwardUpdatedOn ? dayjs(response?.inwardUpdatedOn) : null;
          const parsedDeliveryDate = inwardDate ? inwardDate.format('D MMMM, YYYY') : '';
          setStnDeliveryDate(parsedDeliveryDate);

          if (inwardDate) {
            // Calculate the difference in days
            const deliveryDays = inwardDate.diff(createdDate, 'day');
            setDeliveryDays(deliveryDays);
          }

          if (response.status === 'PENDING_APPROVAL_1' && response.sourceLocationId === locId) {
            setSourceApproval(true);
          } else if (response.status === 'PENDING_APPROVAL_2' && response.destinationLocationId === locId) {
            setSourceApproval(true);
          } else if (response.status === 'APPROVED' && response.sourceLocationId === locId) {
            setSourceApproval(false);
            setShipped(true);
          } else if (response.status === 'SHIPPED' && response.destinationLocationId === locId) {
            setShipped(false);
            setReceived(true);
          } else {
            setSourceApproval(false);
            setShipped(false);
            setReceived(false);
          }
        } else if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const getAdditionalDetails = async () => {
    try {
      const response = await getStockTransferAdditionalDetails(stn);

      if (response?.data?.data?.es) {
        showSnackbar(response?.message, 'error');
        return;
      }
      setAdditionalData(response?.data?.data);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  const handleAddComment = (value) => {
    setCreatedComment(value);
  };

  const fetchComments = () => {
    setGetCommentsLoader(true);
    getComments(stn)
      .then((res) => {
        const commentsData = res?.data?.data?.commentList?.map((item, index) => ({
          id: index,
          comment: item?.comments,
          commentedBy: item?.createdByUser,
        }));
        setComments(commentsData.reverse());
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
      refId: stn,
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

  useEffect(() => {
    if (stn) {
      fetchComments();
    }
  }, [stn]);

  useEffect(() => {
    stockTimeline();
    getAdditionalDetails();
  }, [approveloader, shipLoader, receiveLoader]);

  const [viewBillLoader, setViewBillLoader] = useState(false);
  const handleViewPdf = async (docId) => {
    if (docId === 'NA' || docId === null || docId === undefined) {
      return showSnackbar('No document found', 'error');
    }
    setViewBillLoader(true);
    const res = await vieworderspdf(docId);
    let blob;
    if (res?.headers?.['content-type'] === 'application/pdf') {
      blob = new Blob([res?.data], { type: 'application/pdf' });
    } else {
      blob = new Blob([res?.data], { type: 'image/png' });
    }
    const url = URL.createObjectURL(blob);
    setViewBillLoader(false);
    window.open(url, '_blank');
  };

  // <-- menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // -->

  const handleApprove = () => {
    setApproverModal(true);
  };

  const handleEdit = () => {
    // localStorage.setItem('stnNumber', stn);
    // navigate(`/products/new-transfers/${stn}`);
    navigate(`/inventory/new-transfers/${stn}`);
  };

  const handleCloseModal = () => {
    setApproverModal(false);
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleDeleteStockTransfer = () => {
    const payload = {
      stnNumber: stn,
      userId: uidx,
      userName: userName,
      reason: deleteReason,
      locId: locId,
    };

    deleteStockTransfer(payload)
      .then((res) => {
        showSnackbar('Stock Tranfer deleted successfully', 'success');
        // localStorage.removeItem('stnNumber');        
        navigate('/inventory/stock-transfer');
      })
      .catch((err) => showSnackbar('Failed to delete', 'error'));

    handleClose();
  };

  const payload = {
    stnNumber: stn,
    status: 'APPROVED',
    comments: 'string',
    updatedBy: uidx,
    userName: userName,
    locId: locId,
  };
  const handleApproved = () => {
    setApproveloader(true);
    payload.status = 'APPROVED';
    changStatus();
  };
  const handleShipped = () => {
    setShipLoader(true);
    payload.status = 'SHIPPED';
    changStatus();
  };
  const handleReceived = () => {
    setReceiveLoader(true);
    payload.status = 'RECEIVED';
    changStatus();
    showSnackbar('Process has started, please do not hit receive button again', 'warning');
  };

  const changStatus = () => {
    changeStatusSTN(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1 || res?.data?.code === 'ECONNRESET') {
          showSnackbar(res?.data?.data?.message || res?.data?.message, 'error');
          setApproveloader(false);
          setShipLoader(false);
          setReceiveLoader(false);
          setClickedOnReceived(true);
        } else if (res?.data?.data?.es === 0) {
          handleCloseModal();
          setApproveloader(false);
          setShipLoader(false);
          showSnackbar(res?.data?.data?.message, 'success');
          setReceiveLoader(false);
          stnDetails();
          setSourceApproval(false);
          setClickedOnReceived(true);
        }
      })
      .catch((err) => {
        handleCloseModal();
        showSnackbar(err?.response?.data?.message, 'error');
        setApproverModal(false);
        setApproveloader(false);
        setShipLoader(false);
        setReceiveLoader(false);
      });
  };

  const array = [
    {
      tabName: 'Stock Value',
      tabValue: 'stockValue',
      tabDescription: `${additionalData?.stockValueDiff ?? 0}% difference`,
      tabIcon: '',
    },
    {
      tabName: 'Inward Fill Rate',
      tabValue: 'inwardFillRate',
      tabDescription: `${data?.stockTransferItemList?.length ?? 0} products`,
      tabIcon: '',
    },
    {
      tabName: 'Tax Value',
      tabValue: 'taxValue',
      tabDescription: `on ${additionalData?.taxValueFrom ?? 0} products`,
      tabIcon: '',
    },
    {
      tabName: 'E-way Bill',
      tabValue: 'eWayBill',
      tabDescription: `on ${additionalData?.billDate ?? 'NA'}`,
      tabIcon: data?.docId ? <DownloadIcon onClick={() => handleViewPdf(data?.docId)} /> : '',
    },
    {
      tabName: 'Additional Expense',
      tabValue: 'additionalExpense',
      tabDescription: `from ${additionalData?.billCount ?? 'NA'} bill`,
      // tabIcon: <DownloadIcon />,
      tabIcon: '',
    },
    {
      tabName: 'Items',
      tabValue: 'items',
      tabDescription: `from ${additionalData?.itemCount ?? 0} new products`,
      tabIcon: '',
    },
  ];

  const additionalDetails = useMemo(() => {
    return {
      stockValue: additionalData?.stockValue ?? 'NA',
      inwardFillRate: additionalData?.inwardFillRate ? additionalData?.inwardFillRate + ' %' : 'NA',
      taxValue: additionalData?.taxValue ?? 'NA',
      eWayBill: additionalData?.billCount ?? 'NA',
      additionalExpense: additionalData?.additionalExp ?? 'NA',
      items: additionalData?.quantity ?? 'NA',
    };
  });

  const stockTimeline = () => {
    setTimelineLoader(true);
    stnTimeline(stn)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          const timeline_data = res?.data?.data?.timelines?.map((item, index) => {
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
            );
            return {
              id: index,
              ...status,
            };
          });
          setTimelineData(timeline_data);
        } else {
          showSnackbar(res?.data?.data?.message, 'error');
        }
        setTimelineLoader(false);
      })
      .catch((err) => {
        setTimelineLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const timelineStatusObject = (statusName, userName, date, time, logType, view, quoteId) => {
    switch (statusName) {
      case 'Draft':
        return {
          name: `${logType} Draft Created`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `Draft Created by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Created':
        return {
          name: `${logType} Created`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `Created by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Pending approval 1':
        return {
          name: `${logType} Pending approval 1`,
          iconColor: '#0562fb',
          icon: <PendingActionsIcon />,
          userDesc: `Pending approval 1 by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Source approved':
        return {
          name: `${logType} Source Approved`,
          iconColor: '#0562fb',
          icon: <CheckBoxIcon />,
          userDesc: `Source approved by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Pending approval 2':
        return {
          name: `${logType} Pending approval 2`,
          iconColor: '#0562fb',
          icon: <PendingActionsIcon />,
          userDesc: `Pending approval 2 by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Approved':
        return {
          name: `${logType} Approved`,
          iconColor: '#0562fb',
          icon: <CheckBoxIcon />,
          userDesc: `Approved by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Shipped':
        return {
          name: `${logType} Shipped`,
          iconColor: '#0562fb',
          icon: <LocalShippingIcon />,
          userDesc: `Shipped by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Inward successful':
        return {
          name: `${logType} Inward successful`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `Inward successfully done by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Inward failed':
        return {
          name: `${logType} Inward failed`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          dateTime: `${date} ${time}`,
        };
      case 'Put away successful':
        return {
          name: `${logType} Put away successful`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `Put away successfully done by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Put away failed':
        return {
          name: `${logType} Put away failed`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          dateTime: `${date} ${time}`,
        };
      case 'Received':
        return {
          name: `${logType} Received`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `Received by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Rejected':
        return {
          name: `${logType} Rejected`,
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `Rejected by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      case 'Closed':
        return {
          name: `${logType} Closed`,
          iconColor: '#0562fb',
          icon: <DoneAllIcon />,
          userDesc: `Closed by ${userName}`,
          dateTime: `${date} ${time}`,
        };

      default:
        return {
          name: 'Name Not Found',
          iconColor: '#0562fb',
          icon: '',
          userDesc: 'Unknown User',
          dateTime: 'Unknown Date',
        };
    }
  };

  const columns = [
    {
      field: 'info',
      headerName: '',
      minWidth: 30,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => (
        <Tooltip title={`${params?.row?.barcode}`} arrow>
          <InfoOutlinedIcon
            color="info"
            sx={{
              marginRight: '5px',
              pointer: 'cursor',
            }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'purchaseCost',
      headerName: 'Purchase Cost',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'transferQuantity',
      headerName: 'Transfer Quantity',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchNumber',
      headerName: 'Batch Number',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'fillRate',
      headerName: 'Fill Rate',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  useEffect(() => {
    const updatedRow = itemData.map((e) => {
      return {
        id: e?.id,
        title: textFormatter(e?.itemName) || 'NA',
        // itemCode: e?.itemNo,
        barcode: e?.itemNo || 'NA',
        mrp: e?.unitPrice || 0,
        transferQuantity: e?.quantityTransfer || e?.quantity || 'NA',
        purchaseCost: e?.purchasePrice || 0,
        totalAmount: e?.finalPrice || 0,
        batchNumber: e?.batchNumber || 0,
        fillRate: `${(e?.quantityReceived / e?.quantityTransfer) * 100} %` || 'NA',
      };
    });
    setRowData(updatedRow);
  }, [itemData]);

  const handleLocNameById = (sourceLocId, destLocId) => {
    const payload = {
      branchIds: [sourceLocId, destLocId],
    };
    getlocationNameByLocId(payload)
      .then((res) => {
        const branches = res?.data?.data?.branches;
        const result = branches?.map((item) => `${item?.displayName || ''} (${item?.branchId})`);
        setLocIdDetails(result);
      })
      .catch(() => {});
  };

  const approverName = useMemo(() => {
    if (data?.sourceLocationId === locId) {
      return additionalData?.sourceApprover ?? 'NA';
    } else if (data?.destinationLocationId === locId) {
      return additionalData?.destinationApprover ?? 'NA';
    } else {
      return 'NA';
    }
  }, [data, additionalData, locId]);

  return (
    <DashboardLayout>
      <SoftBox sx={{padding: isMobileDevice ? "16px" : ""}}>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <SoftBox className="bills-details-top-box">
        <SoftBox className="bills-details-inner-left-box">
          {/* <SoftTypography fontSize="16px">
            STN No: <b> {stn}</b>
          </SoftTypography> */}
        </SoftBox>
        {sourceApproval && (
          <>
            <SoftBox className={`bills-details-inner-right-box ${isMobileDevice && 'approve-btn-transfer'}`}>
              <Box display="flex" gap="10px">
                <SoftButton className="vendor-second-btn" onClick={handleApprove}>
                  Approve
                </SoftButton>
              </Box>
            </SoftBox>
          </>
        )}
        {shipped && (
          <>
            <SoftBox className="bills-details-inner-right-box approve-btn-transfer">
              <Box display="flex" gap="10px">
                <SoftButton className="vendor-second-btn" onClick={handleShipped} disabled={shipLoader ? true : false}>
                  {shipLoader ? <Spinner size={20} /> : <> Start Shipment</>}
                </SoftButton>
              </Box>
            </SoftBox>
          </>
        )}
        {((received && clickedOnReceived === false) || data?.eventStatus === 'FAILED') && (
          <>
            <SoftBox className="bills-details-inner-right-box approve-btn-transfer">
              <Box display="flex" gap="10px">
                <SoftButton
                  className="vendor-second-btn"
                  onClick={handleReceived}
                  disabled={receiveLoader ? true : false}
                >
                  {receiveLoader ? (
                    <Spinner size={20} />
                  ) : (
                    <> {data?.eventStatus === 'FAILED' ? 'Retry' : 'Received'}</>
                  )}
                </SoftButton>
              </Box>
            </SoftBox>
          </>
        )}
        <Modal
          open={approverModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="pi-approve-menu">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to approve this.
            </SoftTypography>
            <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                Cancel
              </SoftButton>
              <SoftButton className="vendor-add-btn" onClick={handleApproved} disabled={approveloader ? true : false}>
                Save
              </SoftButton>
            </SoftBox>
          </Box>
        </Modal>
        {/* delete modal  */}
        <Modal
          open={deleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="pi-approve-menu">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete ?
            </SoftTypography>
            <SoftInput
              sx={{ marginTop: '10px' }}
              placeholder="Reason for delete"
              value={deleteReason}
              onChange={({ target }) => setDeleteReason(target.value)}
            />
            <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn" onClick={handleCloseDeleteModal}>
                Cancel
              </SoftButton>
              <SoftButton
                className="vendor-add-btn"
                onClick={handleDeleteStockTransfer}
                disabled={deleteReason === '' ? true : false}
              >
                Delete
              </SoftButton>
            </SoftBox>
          </Box>
        </Modal>
      </SoftBox>

      {/* new  */}
      {/* 1 */}
      <SoftBox className="container-card">
        <SoftBox className="content-space-between" flexWrap={isMobileDevice && 'wrap'}>
          {/* left  */}
          <SoftBox sx={{ width: !isMobileDevice ? '70%' : '100%' }}>
            <SoftTypography fontWeight="bold">
              Stock Transfer
              {stn ? (
                <span style={{ display: 'inline-block', marginLeft: '20px' }}>
                  <CopyToClipBoard params={{ value: stn }} />
                </span>
              ) : (
                'NA'
              )}
              <span style={{ marginLeft: '10px', marginRight: '20px', display: 'inline-block' }}>
                <ThemeProvider theme={chipColor}>
                  <Chip //main category
                    label={
                      locId === data?.sourceLocationId
                        ? 'Outward'
                        : locId === data?.destinationLocationId
                        ? 'Inward'
                        : 'External'
                    }
                    color={'secondary'}
                    variant="outlined"
                  />
                </ThemeProvider>
              </span>
            </SoftTypography>
            <SoftTypography fontSize="14px" my={2}>
              Created By {data?.userCreated}
            </SoftTypography>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Origin Location
            </SoftTypography>
            <SoftTypography fontSize="14px">
              {/* {locIdDetails[0] ? locIdDetails[0] : data?.sourceLocationId} */}
              {data?.sourceLocationName || 'NA'}
            </SoftTypography>
          </SoftBox>
          {/* right  */}
          <SoftBox sx={{ width: !isMobileDevice ? '40%' : '100%' }}>
            <SoftBox className="content-space-between">
              <SoftTypography fontSize="18px">Stock Value</SoftTypography>
              <SoftBox>
                {!data?.sourceApproved && (
                  <SoftButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={(e) => handleClick(e)}
                    className="stock-count-details-menu"
                  >
                    <MoreHorizIcon color="primary" sx={{ width: '1.5em', height: '1.5em' }} />
                  </SoftButton>
                )}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {sourceApproval && data?.status === 'PENDING_APPROVAL_1' && (
                    <MenuItem
                      onClick={() => {
                        handleEdit();
                        handleClose();
                      }}
                    >
                      <EditIcon sx={{ marginRight: '10px' }} />
                      Edit
                    </MenuItem>
                  )}

                  <MenuItem
                    onClick={() => {
                      handleDelete();
                      handleClose();
                    }}
                  >
                    <DeleteIcon sx={{ marginRight: '10px' }} /> Delete
                  </MenuItem>
                </Menu>
              </SoftBox>
            </SoftBox>
            <SoftTypography fontWeight="bold">
              <CurrencyRupeeIcon /> {data?.grossAmount || 'NA'}
            </SoftTypography>
            <SoftBox className="content-left">
              <SoftTypography fontSize="14px" sx={{ width: '40%' }}>
                Created On
              </SoftTypography>
              <SoftTypography fontSize="14px" sx={{ width: '60%' }}>
                {stnCreationDate || 'NA'}
              </SoftTypography>
            </SoftBox>
            <SoftBox className="content-left">
              <SoftTypography fontSize="14px" sx={{ width: '40%' }}>
                Delivery Days
              </SoftTypography>
              <SoftTypography fontSize="14px" sx={{ width: '60%' }}>
                {deliveryDays === '' ? 'NA' : deliveryDays === 0 ? 'Today' : deliveryDays}
              </SoftTypography>
            </SoftBox>
            <SoftBox className="content-left-align-top" sx={{ gap: '10px !important' }}>
              <SoftTypography fontSize="14px" sx={{ width: '40%' }}>
                Delivery Location
              </SoftTypography>
              <SoftTypography fontSize="14px" sx={{ width: '60%' }}>
                {data.destinationLocationName ? textFormatter(data.destinationLocationName) : 'NA'}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>

        {/* bottom  */}
        <SoftBox className="content-left" mt={3} gap="30px" flexWrap="wrap">
          <SoftBox>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Destination
            </SoftTypography>
            <SoftTypography fontSize="14px">
              {data.destinationLocationName ? textFormatter(data.destinationLocationName) : 'NA'}
            </SoftTypography>
          </SoftBox>
          <SoftBox>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Inward Type
            </SoftTypography>
            <SoftTypography fontSize="14px">Stock Transfer</SoftTypography>
          </SoftBox>
          <SoftBox>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Approved By
            </SoftTypography>
            <SoftTypography fontSize="14px">{approverName}</SoftTypography>
          </SoftBox>
          <SoftBox>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Inward Number
            </SoftTypography>
            <SoftTypography fontSize="14px">{data?.inwardRefId || 'NA'}</SoftTypography>
          </SoftBox>
          <SoftBox>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Inward Date
            </SoftTypography>
            <SoftTypography fontSize="14px">{stnDeliveryDate || 'NA'}</SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      {/* --> */}

      {/* 2 */}
      <AdditionalDetails additionalDetailsArray={array} additionalDetails={additionalDetails} />

      {isMobileDevice && (
        <SoftBox className="pi-details-prdt-main-div po-box-shadow" mt={3}>
          <Typography fontSize="1rem" fontWeight={500} mb={2}>
            Product Details
          </Typography>
          <SoftBox>
            {itemData.map((item, index) => (
              <TransferProductCard data={item} index={index} length={itemData?.length} />
            ))}
          </SoftBox>
        </SoftBox>
      )}
      <SoftBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} ld={4} xl={4}>
            {/* {!timelineloader ? ( */}
            {/* <TimelineList title="Stock Transfer Timeline">{renderTimelineItems}</TimelineList> */}
            <SoftTypography fontSize="16px" marginBottom="10px" fontWeight="bold">
              Stock Transfer Timeline
            </SoftTypography>
            <SoftBox className="component-bg-br-sh-p" sx={{ backgroundColor: '#ffffff !important' }}>
              <CommonTimeLine timelineArray={timelineData} timelineLoader={timelineLoader} />
            </SoftBox>
            {/* ) : ( 
                <Spinner />
              )} */}
          </Grid>

          <Grid item xs={12} md={12} lg={10} xl={8}>
            <Grid item xs={12} mb={2}>
              <SoftBox>
                {/* shipment details  */}
                <SoftTypography fontSize="16px" marginBottom="10px" fontWeight="bold">
                  Shipment Details
                </SoftTypography>
                <SoftBox className="content-left-align-top" mb={2}>
                  {/* pickup  */}
                  <CommonAddressCard title="Pick Up Address" addressData={data?.sourceLocationAddress || 'NA'} />
                  {/* delivery  */}
                  <CommonAddressCard title="Delivery Address" addressData={data?.destinationLocationAddress || 'NA'} />
                </SoftBox>
              </SoftBox>
            </Grid>

            {!isMobileDevice && (
              <Grid item xs={12}>
                <SoftBox marginBottom="20px">
                  <SoftTypography fontSize="16px" marginBottom="10px" fontWeight="bold">
                    Stock transfer Details
                  </SoftTypography>
                  <SoftBox style={{ height: 300 }}>
                    <CommonDataGrid rows={rowData} columns={columns} />
                  </SoftBox>
                </SoftBox>
                {/* comments  */}
                <CommentComponent
                  commentData={comments}
                  addCommentFunction={handleAddComment}
                  handleSend={handleCreateComment}
                  loader={commentLoader}
                  getCommentsLoader={getCommentsLoader}
                  createdComment={createdComment}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};
