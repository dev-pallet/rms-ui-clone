import './purchase-return-details.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Badge, CircularProgress, Grid, Menu, MenuItem, Modal } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { buttonStyles } from '../../../Common/buttonColor';
import {
  createComment,
  cumulativePurchaseReturnDetails,
  debitNoteStatusChange,
  downloadDebitNotePDF,
  getAllInventoryReturns,
  getComments,
  getReturnsDebitNoteId,
  inventoryReturnStateChange,
  inventoryReturnTimeline,
  startInward,
  updateInventoryReturn,
  verifyBatch,
} from '../../../../../config/Services';
import { format, parse } from 'date-fns';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CommentComponent from '../../../Common/new-ui-common-components/comment-component';
import CommonDataGrid from '../../../Common/new-ui-common-components/common-datagrid';
import CommonTimeLine from '../../../Common/new-ui-common-components/timeline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PurchaseReturnHeader from './components/purchase-header-return';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import dayjs from 'dayjs';

const NewPurchaseReturnDetailsPage = () => {
  const params = useParams();
  const returnId = params?.purchaseReturnId;
  const showSnackbar = useSnackbar();
  const [data, setData] = useState({});
  const [itemData, setItemData] = useState([]);
  const [comments, setComments] = useState([]);
  const [createdComment, setCreatedComment] = useState('');
  const [commentLoader, setCommentLoader] = useState(false);
  const [getCommentsLoader, setGetCommentsLoader] = useState(false);
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const [returnTimelineData, setReturnTimelineData] = useState([]);
  const [timelineLoader, setTimelineLoader] = useState(false);
  const navigate = useNavigate();
  const [approverModal, setApproverModal] = useState(false);
  const [returnStatus, setReturnStatus] = useState('');
  const [approveLoader, setApproveLoader] = useState(false);
  const [rejectLoader, setRejectLoader] = useState(false);
  const userName = localStorage.getItem('user_name');
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [inwardItemModal, setInwardItemModal] = useState(false);
  const [openDebitModal, setOpenDebitModal] = useState(false);
  const [openRejectDebitModal, setOpenRejectDebitModal] = useState(false);
  const [refundMode, setRefundMode] = useState(false);
  const [optionChange, setOptionChange] = useState('No');
  const [expectedPickup, setExpectedPickup] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [debitNoteData, setDebitNoteData] = useState({});
  const [debitAppLoader, setDebitAppLoader] = useState(false);
  const [materialModal, setMaterialModal] = useState(false);
  const [materialLoader, setMaterialLoader] = useState(false);
  const [inwardItemsData, setInwardItemsData] = useState([]);
  const [inwardItemsDataLoader, setInwardItemsDataLoader] = useState(false);
  const [inwardData, setInwardData] = useState([]);
  const [renderKey, setRenderKey] = useState(0);
  const [inwardItemValueChange, setInwardItemValueChange] = useState('');
  const debounceInwardItems = useDebounce(inwardItemValueChange, 500);
  const locId = localStorage.getItem('locId');
  const [newBatchValue, setNewBatchValue] = useState('');
  const [batchGtin, setBatchGtin] = useState('');
  const [batchIndex, setBatchIndex] = useState();
  const debouncedBatch = useDebounce(newBatchValue, 500);
  const [verfyingbatchNumberLoader, setVerfyingbatchNumberLoader] = useState(false);
  const [mainDebitNoteStatus, setMainDebitNoteStatus] = useState('');

  useEffect(() => {
    if (debounceInwardItems !== '') {
      const apiPayload = { ...inwardData };
      apiPayload.returnJobItemList = inwardItemsData;
      updateInwardItemsField(apiPayload);
    }
  }, [debounceInwardItems]);

  useEffect(() => {
    if (debouncedBatch !== '') {
      setVerfyingbatchNumberLoader(true);
      verifyBatch(locId, batchGtin, newBatchValue)
        .then((res) => {
          showSnackbar(res?.data?.data?.message, 'success');
          setVerfyingbatchNumberLoader(false);
          updatingInwardItems(newBatchValue, batchIndex, 'newBatchNo');
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
          setVerfyingbatchNumberLoader(false);
        });
    }
  }, [debouncedBatch]);

  const updatingInwardItems = (value, index, field) => {
    const inwardItemsDataCopy = [...inwardItemsData];
    inwardItemsDataCopy[index][field] = value;
    setInwardItemsData(inwardItemsDataCopy);
    setInwardItemValueChange(value);
  };

  const verfyingbatchNumber = (item, value, index) => {
    setBatchGtin(item?.itemCode);
    setBatchIndex(index);
    setNewBatchValue(value);
  };

  //status updates
  const [debitNoteStatus, setDebitNoteStatus] = useState({});
  const [debitNoteReturnType, setDebitNoteReturnType] = useState({});
  const [isMaterialReplacedStatus, setIsMaterialReplacedStatus] = useState('');
  const [materialIncoming, setMaterialIncoming] = useState('');
  const [materialOutgoing, setMaterialOutgoing] = useState('');
  const [materialIncomingValue, setMaterialIncomingValue] = useState('');
  const [materialOutgoingValue, setMaterialOutgoingValue] = useState('');

  const handleChange = (event) => {
    setOptionChange(event.target.value);
  };

  const fetchComments = () => {
    setGetCommentsLoader(true);
    getComments(returnId)
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
      refId: returnId,
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

  const [returnLoader, setReturnLoader] = useState(false);
  const fetchReturnDetails = () => {
    setReturnLoader(true);
    cumulativePurchaseReturnDetails(returnId)
      .then((res) => {
        const dataResponse = res?.data?.data;
        if (dataResponse?.es > 0 || res?.data?.status === 'ERROR') {
          setItemData([]);
          showSnackbar(dataResponse?.message || 'Some error occured', 'error');
          setReturnLoader(false);
          return;
        }
        setData(dataResponse);
        setMainDebitNoteStatus(dataResponse?.status);
        setMaterialIncoming(dataResponse?.materialIncoming);
        setMaterialOutgoing(dataResponse?.materialOutgoing);
        setIsMaterialReplacedStatus(dataResponse?.status);
        const itemData = dataResponse?.returnJobItemList?.map((item, index) => ({
          id: index,
          title: item?.itemName ?? 'NA',
          mrp: item?.mrp ?? 'NA',
          currentPrice: item?.currentStock ?? 'NA',
          purchasePrice: item?.purchasePrice ?? 'NA',
          expiry: item?.expiry ?? 'NA',
          retutnQty: item?.quantity ?? 'NA',
          purchaseMargin: item?.purchaseMargin ?? 'NA',
          totalAmount: item?.finalPrice ?? 'NA',
          gtin: item?.itemCode ?? 'NA',
          isReturnDetails: true,
        }));
        setItemData(itemData);
        setReturnLoader(false);
      })
      .catch((err) => {
        setItemData([]);
        setReturnLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const fetchAllReturnsData = () => {
    setInwardItemsDataLoader(true);
    getAllInventoryReturns(returnId)
      .then((res) => {
        setInwardData(res?.data?.data?.returnDetails);
        setInwardItemsData(res?.data?.data?.returnDetails?.returnJobItemList);
        setInwardItemsDataLoader(false);
      })
      .catch((err) => {
        setInwardItemsData([]);
        setInwardItemsDataLoader(false);
      });
  };

  useEffect(() => {
    if (statusUpdate && mainDebitNoteStatus === 'REPLACEMENT') {
      fetchAllReturnsData();
    }
  }, [mainDebitNoteStatus, statusUpdate]);

  const updateInwardItemsField = (payload, isReplacementModal) => {
    setDebitAppLoader(true);

    updateInventoryReturn(payload)
      .then((res) => {
        // console.log(res);
        if (isReplacementModal) {
          setDebitAppLoader(false);
          if (res?.data?.data?.es === 0) {
            setStatusUpdate(false);
            fetchReturnDetails();
            showSnackbar(res?.data?.data?.message, 'success');
          } else {
            showSnackbar(res?.data?.data?.message || 'Something Went Wrong', 'error');
          }
        }
      })
      .catch((err) => {
        setDebitAppLoader(false);

        // console.log(err);
      });
  };

  const timelineStatusObject = (statusName, userName, date, time, logType, view, quoteId) => {
    if (logType === 'Return') {
      switch (statusName) {
        case 'Pending approval':
          return {
            name: 'Pending approval',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Approved':
          return {
            name: 'Bill Approved',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Approved by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Rejected':
          return {
            name: 'Debit Rejected',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: `Rejected by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Credit note':
          return {
            name: 'Credit Note Received',
            iconColor: '#0562fb',
            icon: <ShoppingBagIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Refund':
          return {
            name: 'Refund',
            iconColor: '#0562fb',
            icon: <CurrencyRupeeIcon />,
            userDesc: `Refund by  ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Replacement':
          return {
            name: 'Replacement',
            iconColor: '#0562fb',
            icon: <LocalShippingIcon />,
            userDesc: `Received by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Inwarded':
          return {
            name: 'Inward (GRN)',
            iconColor: '#0562fb',
            icon: <CallReceivedIcon />,
            userDesc: `Inwarde completed by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Closed':
          return {
            name: 'Return Closed',
            iconColor: 'green',
            icon: <CheckBoxIcon />,
            userDesc: `Closed by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Material returned to vendor':
          return {
            name: 'Material returned to vendor',
            iconColor: '#0562fb',
            icon: <InventoryIcon />,
            userDesc: `By ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Material wastage to vendor':
          return {
            name: 'Material wastage to vendor',
            iconColor: '#0562fb',
            icon: <InventoryIcon />,
            userDesc: `By ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Material replaced':
          return {
            name: 'Material replaced',
            iconColor: '#0562fb',
            icon: <InventoryIcon />,
            userDesc: `By ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Material picked up':
          return {
            name: 'Material picked up',
            iconColor: '#0562fb',
            icon: <InventoryIcon />,
            userDesc: `By ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Material returned':
          return {
            name: 'Material returned',
            iconColor: '#0562fb',
            icon: <InventoryIcon />,
            userDesc: `By ${userName}`,
            dateTime: `${date}, ${time}`,
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
    } else if (logType.includes('Debit Note')) {
      switch (statusName) {
        case 'Created':
          return {
            name: logType + ' ' + 'Created',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Approved':
          return {
            name: logType + ' ' + 'Accepted',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
          };
        case 'Rejected':
          return {
            name: logType + ' ' + 'Rejected',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
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
    }
  };

  const timelineFunction = () => {
    setTimelineLoader(true);
    inventoryReturnTimeline(returnId)
      .then((res) => {
        const timelineData = res?.data?.data?.timelines?.map((item, index) => {
          const parsedDate = parse(item?.updatedOn, 'dd MMM yyyy hh:mm:ss a', new Date());
          // Format the parsed date
          const date = format(parsedDate, 'dd MMMM yyyy');
          const time = format(parsedDate, "HH:mm 'Hours'");
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

        setReturnTimelineData(timelineData);
        setTimelineLoader(false);
      })
      .catch((err) => {
        setTimelineLoader(false);
      });
  };

  const getDebitNoteId = () => {
    getReturnsDebitNoteId(returnId)
      .then((res) => {
        const response = res?.data?.data;
        if (response?.es) {
          // showSnackbar(response?.message || 'Some error occured', 'error');
          return;
        }
        setDebitNoteData(response?.debitNote);
      })
      .catch((err) => {
        showSnackbar('Some error occured while fetching debitNoteId', 'error');
      });
  };

  useEffect(() => {
    if (returnId) {
      fetchReturnDetails();
      fetchComments();
      timelineFunction();
      getDebitNoteId();
    }
  }, [returnId]);

  useEffect(() => {
    if (inwardItemModal) {
      fetchAllReturnsData();
    }
  }, [inwardItemModal]);

  //menu functions:

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    localStorage.setItem('returnJobId', returnId);
    navigate(`/purchase/purchase-returns/new-return/${returnId}`);
  };

  //approve
  const handleApprove = () => {
    if (data?.status === 'APPROVED') {
      showSnackbar('Already approved', 'warning');
      handleMenuClose();
      return;
    }
    setApproverModal(true);
    handleMenuClose();
  };

  // const handleMaterialUpdate = () => {
  //   setMaterialModal(true);
  //   handleMenuClose();
  // };

  const statusPayload = {
    returnId: returnId,
    updatedByUser: userInfo?.uidx,
    userName: userName,
    comments: 'string',
  };
  const updateApproveStatus = () => {
    statusPayload.status = 'APPROVED';
    setApproveLoader(true);
    inventoryReturnStateChange(statusPayload)
      .then((res) => {
        setApproveLoader(false);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          return;
        }
        fetchReturnDetails();
        setApproverModal(false);
        getDebitNoteId();
        timelineFunction();
      })
      .catch((err) => {
        setApproveLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  // status update changes
  const statusUpdateHandler = () => {
    if (debitNoteStatus?.value === 'REJECT') {
      updateRejectStatus();
    } else if (debitNoteStatus?.value === 'APPROVE' && isMaterialReplacedStatus !== 'REPLACEMENT') {
      updateReturnStatus();
    } else if (isMaterialReplacedStatus === 'REPLACEMENT') {
      const apiPayload = { ...inwardData };
      apiPayload.returnJobItemList = inwardItemsData;
      apiPayload.materialIncoming = materialIncomingValue;
      apiPayload.materialOutgoing = materialOutgoingValue;
      updateInwardItemsField(apiPayload, true);
      // setInwardItemModal(true);
      // setStatusUpdate(false);
    }
  };

  //reject

  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    setRejectModal(true);
    handleMenuClose();
  };

  const rejectStatusPayload = {
    returnId: returnId,
    updatedByUser: userInfo?.uidx,
    userName: userName,
    comments: rejectReason || 'string',
  };
  const updateRejectStatus = () => {
    rejectStatusPayload.status = 'REJECTED';
    setRejectLoader(true);
    inventoryReturnStateChange(rejectStatusPayload)
      .then((res) => {
        setRejectLoader(false);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          return;
        }
        fetchReturnDetails();
        timelineFunction();
        getDebitNoteId();
        setOpenDebitModal(false);
        setStatusUpdate(false);
        setRejectModal(false);
      })
      .catch((err) => {
        setRejectLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  //status update

  const [selectedFiles, setSelectedFiles] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files[0]);
  };

  // const refundOptions = [
  //   { value: 'CREDIT_NOTE', label: 'Credit Note' },
  //   { value: 'REFUND', label: 'Bank Transfer' },
  // ];

  // const materialOptions = [
  //   { value: 'MATERIAL_RETURNED', label: 'Refund' },
  //   { value: 'MATERIAL_REPLACED', label: 'Replaced' },
  // ];

  const handleStatusUpdate = () => {
    setStatusUpdate(true);
    handleMenuClose();
  };

  // let debitPayload = {
  //   debitNoteId: debitNoteData?.debitNoteId,
  //   comments: 'string',
  //   updatedByUser: userInfo?.uidx,
  //   userName: userName,
  // };

  // const debitApprovalModal = () => {
  //   setOpenDebitModal(true);
  //   setStatusUpdate(false);
  // };
  // const debitRejectModal = () => {
  //   setOpenRejectDebitModal(true);
  //   setStatusUpdate(false);
  // };

  // const handleDebitOptionChange = (value) => {
  //   setRefundMode(value);
  //   setSelectedFiles(null);
  //   setOptionChange('No');
  //   setExpectedPickup('');
  //   setReferenceNumber('');
  // };

  // const handleCancelApprove = () => {
  //   setOpenDebitModal(false);
  //   setRefundMode(false);
  //   setSelectedFiles(null);
  //   setOptionChange('No');
  //   setExpectedPickup('');
  //   setReferenceNumber('');
  // };

  // const handleMaterial = (value) => {
  //   setMaterialLoader(true);
  //   let payload = {
  //     returnId: returnId,
  //     status: value.value,
  //     updatedByUser: userInfo?.uidx,
  //     userName: userName,
  //     comments: 'string',
  //   };
  //   returnMaterialStatusUpdate(payload)
  //     .then((res) => {
  //       setMaterialLoader(false);
  //       if (res?.data?.data?.es) {
  //         showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
  //         setMaterialModal(false);
  //         return;
  //       }
  //       setDeleteModal(false);
  //       getDebitNoteId();
  //       timelineFunction();
  //       setMaterialModal(false);
  //     })
  //     .catch((err) => {
  //       setMaterialLoader(false);
  //       showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
  //     });
  // };

  const updateReturnStatus = () => {
    const payload = {
      debitNoteId: debitNoteData?.debitNoteId,
      status: 'APPROVED',
      comments: 'string',
      updatedByUser: userInfo?.uidx,
      userName: userName,
      returnStatus: debitNoteReturnType?.value,
      materialExpectedDate: '',
      materialPickUpDate: expectedPickup,
      referenceNo: referenceNumber,
    };

    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    if (selectedFiles !== null) {
      formData.append('file', selectedFiles);
    }
    setDebitAppLoader(true);
    debitNoteStatusChange(formData)
      .then((res) => {
        if (res?.data?.data?.es !== 0) {
          showSnackbar(res?.data?.data?.message, 'error');
          setDebitAppLoader(false);
          return;
        }
        getDebitNoteId();
        timelineFunction();
        fetchReturnDetails();
        setDebitAppLoader(false);
        setOpenDebitModal(false);
        setStatusUpdate(false);
        setSelectedFiles(null);
        if (debitNoteReturnType?.value === 'REPLACEMENT') {
          setIsMaterialReplacedStatus(debitNoteReturnType?.value);
        } else {
          setStatusUpdate(false);
        }
      })
      .catch((err) => {
        setDebitAppLoader(false);
        showSnackbar(err?.response?.data?.message || err?.message, 'error');
      });
  };

  const [viewDebitNoteLoader, setViewDebitNoteLoader] = useState(false);
  const downloadFile = () => {
    setViewDebitNoteLoader(true);
    downloadDebitNotePDF(returnId)
      .then((res) => {
        const blob = new Blob([res?.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
        setViewDebitNoteLoader(false);
      })
      .catch((err) => {
        setViewDebitNoteLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured while viewing pdf', 'error');
      });
  };

  const [debitRejectLoader, setDebitRejectLoader] = useState(false);

  const handleRejectDebit = () => {
    const payload = {
      debitNoteId: debitNoteData?.debitNoteId,
      status: 'REJECTED',
      comments: rejectReason,
      updatedByUser: userInfo?.uidx,
      userName: userName,
      returnStatus: refundMode,
      materialExpectedDate: '',
      materialPickUpDate: expectedPickup,
      referenceNo: referenceNumber,
    };
    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    setDebitRejectLoader(true);
    debitNoteStatusChange(formData)
      .then((res) => {
        const response = res?.data?.data;
        setDebitRejectLoader(false);
        if (response?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          return;
        }
        getDebitNoteId();
        setOpenRejectDebitModal(false);
        timelineFunction();
        setSelectedFiles(null);
      })
      .catch((err) => {
        setDebitRejectLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
    handleMenuClose();
  };

  //material update

  const additionalInfoArray = [
    { infoName: 'Purchase Method', infoValue: 'purchaseMethod' },
    { infoName: 'Purchase Terms', infoValue: 'purchaseTerms' },
    { infoName: 'Returns & Replacement', infoValue: 'returnAndReplacement' },
    { infoName: 'Open Debit Notes', infoValue: 'openDebitNote' },
    { infoName: 'Available Credits', infoValue: 'availableCredits' },
    { infoName: 'Open Returns', infoValue: 'openReturns' },
  ];

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
              {/* <Tooltip title={<div>{params?.row?.barcode}</div>}>
                <InfoOutlinedIcon sx={{ height: 18, width: 18, cursor: 'pointer', color: '#0562fb' }} />
              </Tooltip> */}
              <span>{params?.row?.title}</span>
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
        field: 'currentPrice',
        headerName: 'Current Stock',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 100,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'purchasePrice',
        headerName: 'Purchase Price',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 110,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'expiry',
        headerName: 'Expiry',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 60,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'retutnQty',
        headerName: 'Return Qty',
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
        minWidth: 150,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          const mrp = params?.row?.mrp;
          const purchasePrice = params?.row?.purchasePrice;
          const purchaseMargin =
            mrp !== 'NA' && purchasePrice !== 'NA' ? (((mrp - purchasePrice) / mrp) * 100)?.toFixed(2) : 'NA';
          return `${purchaseMargin}%`;
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

  const [startInwardLoader, setStartInwardLoader] = useState(false);
  const handleStartInward = () => {
    const payload = {
      returnId: returnId,
      requestBy: userInfo?.uidx,
      requestUser: userInfo?.firstName + ' ' + userInfo?.secondName,
    };
    setStartInwardLoader(true);
    startInward(payload)
      .then((res) => {
        setStartInwardLoader(false);
        setInwardItemModal(false);
        showSnackbar(res?.data?.data?.message || 'Inward started successfully', 'success');
      })
      .catch((err) => {
        setStartInwardLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <PurchaseReturnHeader
        purchaseReturnId={returnId}
        data={data}
        additionalInfoArray={additionalInfoArray}
        handleMenuOpen={handleMenuOpen}
        downloadFile={downloadFile}
        viewDebitNoteLoader={viewDebitNoteLoader}
        returnLoader={returnLoader}
      />
      <div className="indent-details-main-container">
        <div className="indent-details-main-div">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 0.3,
            }}
          >
            <span className="purch-det-heading-title" style={{ marginBottom: '10px' }}>
              Return Timeline
            </span>
            <div className="purchase-details-timeline component-bg-br-sh-p">
              <CommonTimeLine
                timelineArray={returnTimelineData}
                timelineLoader={timelineLoader}
                purchaseId={returnId}
                timelineFunction={timelineFunction}
              />
            </div>
          </div>
          <div className="purchase-details-data purchase-return-second-children">
            <span className="purch-det-heading-title">Return Details</span>
            <div style={{ maringTop: '10px !important' }}>
              <CommonDataGrid rows={itemData} columns={indentDetailsColumns} disableRowSelectionOnClick />
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
        {mainDebitNoteStatus === 'PENDING_APPROVAL' && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
        <MenuItem onClick={handleApprove}>Approve</MenuItem>
        <MenuItem onClick={handleReject}>Reject</MenuItem>
        {/* <MenuItem onClick={downloadFile}>
          {viewDebitNoteLoader ? (
            <CircularProgress size={16} sx={{ color: '#0562fb !important' }} />
          ) : (
            'View Debit Note'
          )}
        </MenuItem> */}
        {mainDebitNoteStatus !== 'CREDIT_NOTE' &&
          mainDebitNoteStatus !== 'REFUND' &&
          mainDebitNoteStatus !== 'CLOSED' && (
            <MenuItem onClick={handleStatusUpdate}>
              {mainDebitNoteStatus === 'REPLACEMENT' ? 'Replacement Status' : 'Status'}
            </MenuItem>
          )}
        {mainDebitNoteStatus === 'REPLACEMENT' && materialIncoming === 'RECEIVED' && (
          <MenuItem onClick={() => setInwardItemModal(true)}>Inward</MenuItem>
        )}

        {/* {menuArray?.map((item, index) => (
          <MenuItem onClick={item.func}>{item.label}</MenuItem>
        ))} */}
        {/* <MenuItem onClick={handleMaterialUpdate}>Material Update</MenuItem> */}
      </Menu>
      <Modal
        open={approverModal}
        onClose={() => setApproverModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="pi-approve-menu">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to approve this.
          </SoftTypography>
          <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => setApproverModal(false)}>
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton vendor-add-btn"
              onClick={updateApproveStatus}
              disabled={approveLoader ? true : false}
            >
              {approveLoader ? <CircularProgress size={18} /> : <>Approve</>}
            </SoftButton>
          </SoftBox>
        </div>
      </Modal>
      <Modal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="pi-approve-menu-1">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to reject this.
          </SoftTypography>
          <SoftBox>
            <SoftSelect
              value={{ value: rejectReason, label: rejectReason }}
              options={[
                { value: 'Dummy Return', label: 'Dummy Return' },
                { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                { value: 'Needs revision', label: 'Needs revision' },
                { value: 'Others', label: 'Others' },
              ]}
              onChange={(e) => setRejectReason(e.value)}
            />
          </SoftBox>
          <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => setRejectModal(false)}>
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton vendor-add-btn"
              onClick={updateRejectStatus}
              disabled={rejectLoader ? true : false}
            >
              {rejectLoader ? <CircularProgress size={18} /> : <>Reject</>}
            </SoftButton>
          </SoftBox>
        </div>
      </Modal>
      <Modal
        open={statusUpdate}
        onClose={() => setStatusUpdate(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <div className="pi-approve-menu-1" style={{ width: '180px' }}>
          <div className="approve-bedit-reject-debit">
            <MenuItem onClick={debitApprovalModal}>Approve Debit</MenuItem>
            <MenuItem onClick={debitRejectModal}>Reject Debit</MenuItem>
          </div>
        </div> */}
        <div
          className="status-modal-main-div pi-approve-menu-1"
          style={{
            marginTop:
              optionChange === 'Yes'
                ? '95px'
                : optionChange === 'No' && debitNoteReturnType?.value === 'REFUND' && '110px',
            maxHeight: optionChange === 'Yes' && '500px',
            overflowY: optionChange === 'Yes' && 'scroll',
          }}
        >
          <div className="status-modal-heading-div">
            <span style={{ fontWeight: 'bold' }}>
              {isMaterialReplacedStatus === 'REPLACEMENT' ? 'Replacement Status' : 'Return Status'}
            </span>
            <span style={{ fontSize: '14px' }}>
              {isMaterialReplacedStatus === 'REPLACEMENT' ? 'Replacement Created' : 'Debit note created'}
            </span>
          </div>
          {isMaterialReplacedStatus !== 'REPLACEMENT' && (
            <div className="status-modal-softSelect">
              <span>Debit Note Status</span>
              <div style={{ width: '300px' }}>
                <SoftSelect
                  value={debitNoteStatus}
                  options={[
                    { value: 'APPROVE', label: 'Approve' },
                    { value: 'REJECT', label: 'Reject' },
                  ]}
                  onChange={(option) => setDebitNoteStatus(option)}
                />
              </div>
            </div>
          )}
          {isMaterialReplacedStatus === 'REPLACEMENT' && (
            <div className="status-modal-softSelect">
              <span>Material Outgoing</span>
              <div style={{ width: '300px' }}>
                <SoftSelect
                  // value={debitNoteStatus}
                  options={[
                    { value: 'PENDING_COLLECTION', label: 'Pending Collection' },
                    { value: 'MATERIAL_SENT', label: 'Material Sent' },
                  ]}
                  onChange={(option) => setMaterialOutgoingValue(option.value)}
                />
              </div>
            </div>
          )}
          {debitNoteStatus?.value === 'REJECT' && (
            <div className="status-modal-softSelect">
              <span>Inventory Adjustment Reason</span>
              <div style={{ width: '300px' }}>
                <SoftSelect
                  value={{ value: rejectReason, label: rejectReason }}
                  options={[
                    { value: 'Dummy Debit', label: 'Dummy Debit' },
                    { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                    { value: 'Needs revision', label: 'Needs revision' },
                    { value: 'Others', label: 'Others' },
                  ]}
                  onChange={(option) => setRejectReason(option.value)}
                />
              </div>
            </div>
          )}
          {debitNoteStatus?.value === 'APPROVE' && isMaterialReplacedStatus !== 'REPLACEMENT' && (
            <div className="status-modal-softSelect">
              <span>Return Type</span>
              <div style={{ width: '300px' }}>
                <SoftSelect
                  value={debitNoteReturnType}
                  options={[
                    { value: 'CREDIT_NOTE', label: 'Credit Note' },
                    { value: 'REFUND', label: 'Bank Transfer' },
                    { value: 'REPLACEMENT', label: 'Material Replacement' },
                  ]}
                  onChange={(option) => {
                    setDebitNoteReturnType(option);
                    setOptionChange('No');
                  }}
                />
              </div>
            </div>
          )}
          {isMaterialReplacedStatus === 'REPLACEMENT' && (
            <div className="status-modal-softSelect">
              <span>Material Incoming</span>
              <div style={{ width: '300px' }}>
                <SoftSelect
                  // value={{ value: debitNoteStatus, label: debitNoteStatus }}
                  options={[
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'RECEIVED', label: 'Received' },
                  ]}
                  onChange={(option) => setMaterialIncomingValue(option.value)}
                />
              </div>
            </div>
          )}
          {debitNoteReturnType?.value === 'CREDIT_NOTE' ? (
            <Grid item xs={12} md={12}>
              <Grid container>
                <Grid item xs={12} md={12} mt={1}>
                  <SoftTypography variant="h6">Expected material pick-up date</SoftTypography>
                </Grid>
                <Grid item xs={12} md={12} mt={1}>
                  <SoftBox>
                    <SoftInput type="date" onChange={(e) => setExpectedPickup(e.target.value)} />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={12} mt={1}>
                  <SoftBox>
                    <SoftBox
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: selectedFiles ? 'flex-start' : 'center',
                        alignItems: 'center',
                      }}
                    >
                      <SoftTypography className="add-customer-file-head">Attach Document</SoftTypography>
                      <SoftBox
                        style={{
                          display: 'flex',
                          justifyContent: selectedFiles ? 'flex-start' : 'center',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <SoftBox className="profile-box-up">
                          <form className="profile-box-up">
                            <input
                              type="file"
                              name="file"
                              id="my-file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />
                            <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                              <SoftTypography className="upload-text-I">
                                Upload <UploadFileIcon />
                              </SoftTypography>
                            </label>
                          </form>
                        </SoftBox>
                        {selectedFiles && (
                          <Badge
                            badgeContent={
                              <CancelIcon sx={{ fontSize: '25px' }} onClick={() => setSelectedFiles(null)} />
                            } // Icon representing file type
                            // color="primary" // You can change the color of the badge
                          >
                            <SoftBox>
                              {selectedFiles?.type?.includes('image') ? (
                                <div>
                                  <SoftBox
                                    style={{
                                      border: '1px solid gray',
                                      padding: '10px',
                                      borderRadius: '7px',
                                      width: '50px',
                                    }}
                                  >
                                    <img src={selectedFiles} />
                                  </SoftBox>
                                </div>
                              ) : (
                                <div className="upload-text-I">
                                  <SoftBox style={{ border: '1px solid gray', padding: '10px', borderRadius: '7px' }}>
                                    <SoftTypography style={{ fontSize: '12px' }}>{selectedFiles?.name}</SoftTypography>
                                  </SoftBox>
                                </div>
                              )}
                            </SoftBox>
                          </Badge>
                        )}
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </Grid>
              </Grid>
            </Grid>
          ) : debitNoteReturnType?.value === 'REFUND' ? (
            <>
              <Grid item xs={12} md={12}>
                <SoftTypography fontSize="14px">
                  Status can only be updated once you receive money from the vendor. Have you received?{' '}
                </SoftTypography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid container mt={1} display="column" alignItems="center" gap="10px">
                  <Grid xs={12} md={12} lg={12}>
                    <div className="common-display-flex-1">
                      <label className="common-display-flex-1" style={{ gap: '5px' }}>
                        <input
                          type="radio"
                          name="moneyRecieved"
                          value="Yes"
                          onChange={handleChange}
                          className="radio-checbox-products"
                          checked={optionChange === 'Yes'}
                        />
                        <span className="input-label-text">Yes</span>
                      </label>
                      <label className="common-display-flex-1" style={{ gap: '5px' }}>
                        <input
                          type="radio"
                          name="moneyRecieved"
                          value="No"
                          onChange={handleChange}
                          className="radio-checbox-products"
                          checked={optionChange === 'No'}
                        />
                        <span className="input-label-text">No</span>
                      </label>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {optionChange === 'Yes' && (
                <Grid item xs={12} md={12}>
                  <Grid conatiner>
                    <Grid xs={12} lg={12} mt={1}>
                      <SoftTypography fontSize="16px">Reference number</SoftTypography>
                    </Grid>
                    <Grid xs={12} lg={12} mt={1}>
                      <SoftInput type="text" onChange={(e) => setReferenceNumber(e.target.value)} />
                    </Grid>
                    <Grid xs={12} lg={12} mt={1}>
                      <SoftTypography fontSize="16px">Expected material pick-up date</SoftTypography>
                    </Grid>
                    <Grid xs={12} lg={12} mt={1}>
                      <SoftInput type="date" onChange={(e) => setExpectedPickup(e.target.value)} />
                    </Grid>
                    <Grid xs={12} lg={12} mt={1}>
                      <SoftBox
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: selectedFiles ? 'flex-start' : 'center',
                          alignItems: 'center',
                        }}
                      >
                        <SoftTypography className="add-customer-file-head">Attach Document</SoftTypography>
                        <SoftBox
                          style={{
                            display: 'flex',
                            justifyContent: selectedFiles ? 'flex-start' : 'center',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <SoftBox className="profile-box-up">
                            <form className="profile-box-up">
                              <input
                                type="file"
                                name="file"
                                id="my-file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              />
                              <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                                <SoftTypography className="upload-text-I">
                                  Upload <UploadFileIcon />
                                </SoftTypography>
                              </label>
                            </form>
                          </SoftBox>
                          {selectedFiles && (
                            <Badge
                              badgeContent={
                                <CancelIcon sx={{ fontSize: '25px' }} onClick={() => setSelectedFiles(null)} />
                              } // Icon representing file type
                              // color="primary" // You can change the color of the badge
                            >
                              <SoftBox>
                                {selectedFiles?.type?.includes('image') ? (
                                  <div>
                                    <SoftBox
                                      style={{
                                        border: '1px solid gray',
                                        padding: '10px',
                                        borderRadius: '7px',
                                        width: '50px',
                                      }}
                                    >
                                      <img src={selectedFiles} />
                                    </SoftBox>
                                  </div>
                                ) : (
                                  <div className="upload-text-I">
                                    <SoftBox style={{ border: '1px solid gray', padding: '10px', borderRadius: '7px' }}>
                                      <SoftTypography style={{ fontSize: '12px' }}>
                                        {selectedFiles?.name}
                                      </SoftTypography>
                                    </SoftBox>
                                  </div>
                                )}
                              </SoftBox>
                            </Badge>
                          )}
                        </SoftBox>
                      </SoftBox>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </>
          ) : null}
          <div className="status-button-div">
            <SoftButton variant="outlined" color="info" onClick={() => setStatusUpdate(false)}>
              Cancel
            </SoftButton>
            <SoftButton
              variant="contained"
              color="info"
              onClick={statusUpdateHandler}
              disabled={optionChange === 'No' && debitNoteReturnType?.value === 'REFUND'}
            >
              {debitAppLoader ? <CircularProgress size={18} /> : 'Save'}
            </SoftButton>
          </div>
        </div>
      </Modal>
      <Modal open={inwardItemModal} onClose={() => setInwardItemModal(false)}>
        <div
          className="pi-approve-menu-1 inward-item-modal-div-container"
          style={{
            width: '80%',
          }}
        >
          <span>Inward</span>
          <div className="inward-table-return">
            <Grid container sx={{ width: '100% !important' }} className="header-grid-inward-table">
              <Grid item lg={2.2} md={2.2} sm={2.2} xs={2.2}>
                <div className="inward-table-item-div">
                  <span>Title</span>
                </div>
              </Grid>
              <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                <div className="inward-table-item-div">
                  <span>Barcode</span>
                </div>
              </Grid>
              <Grid item lg={0.8} md={0.8} sm={0.8} xs={0.8}>
                <div className="inward-table-item-div">
                  <span>Mrp</span>
                </div>
              </Grid>
              <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                <div className="inward-table-item-div">
                  <span>Purchase Price</span>
                </div>
              </Grid>
              <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                <div className="inward-table-item-div">
                  <span>Return quantity</span>
                </div>
              </Grid>
              <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                <div className="inward-table-item-div">
                  <span>Inward Quantity</span>
                </div>
              </Grid>
              <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                <div className="inward-table-item-div">
                  <span>Batch Number</span>
                </div>
              </Grid>
              <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                <div className="inward-table-item-div">
                  <span>Expiry</span>
                </div>
              </Grid>
            </Grid>
            {/* <div className="input-field-inward-table"> */}
            <Grid container sx={{ width: '100% !important' }}>
              {inwardItemsDataLoader ? (
                <div className="inward-item-data-loader">
                  <CircularProgress
                    sx={{
                      color: '#0562fb !important',
                    }}
                  />
                </div>
              ) : (
                inwardItemsData?.map((item, index) => {
                  return (
                    <>
                      <Grid item lg={2.2} md={2.2} sm={2.2} xs={2.2}>
                        <div className="inward-table-input-div">
                          <SoftInput value={item?.itemName} disabled />
                        </div>
                      </Grid>
                      <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                        <div className="inward-table-input-div">
                          <SoftInput value={item?.itemCode} disabled />
                        </div>
                      </Grid>
                      <Grid item lg={0.8} md={0.8} sm={0.8} xs={0.8}>
                        <div className="inward-table-input-div">
                          <SoftInput
                            value={item?.mrp}
                            onChange={(e) => updatingInwardItems(e.target.value, index, 'mrp')}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                        <div className="inward-table-input-div">
                          <SoftInput
                            value={item?.purchasePrice}
                            onChange={(e) => updatingInwardItems(e.target.value, index, 'purchasePrice')}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                        <div className="inward-table-input-div">
                          <SoftInput
                            value={item?.quantity}
                            onChange={(e) => updatingInwardItems(e.target.value, index, 'quantity')}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                        <div className="inward-table-input-div">
                          <SoftInput
                            value={item?.quantityReceived}
                            onChange={(e) => updatingInwardItems(e.target.value, index, 'quantityReceived')}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                        <div className="inward-table-input-div batch-number-div">
                          <SoftInput
                            value={item?.newBatchNo}
                            onChange={(e) => verfyingbatchNumber(item, e.target.value, index)}
                          />
                          {verfyingbatchNumberLoader && (
                            <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={1.5} md={1.5} sm={1.5} xs={1.5}>
                        <div className="inward-table-input-div">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              key={index}
                              value={dayjs(item?.expiryDate)}
                              onChange={(e) => updatingInwardItems(format(e.$d, 'yyyy-MM-dd'), index, 'expiryDate')}
                              disablePast
                              views={['year', 'month', 'day']}
                              format="DD-MM-YYYY"
                              sx={{ width: '100% !important' }}
                              className="date-picker-newpi-ui"
                            />
                          </LocalizationProvider>
                        </div>
                      </Grid>
                    </>
                  );
                })
              )}
            </Grid>
          </div>
          <div className="inward-item-table-btn">
            <SoftButton variant="outlined" color="info" onClick={() => setInwardItemModal(false)}>
              Cancel
            </SoftButton>
            <SoftButton variant="contained" color="info" onClick={handleStartInward}>
              {startInwardLoader ? <CircularProgress size={18} sx={{ color: 'white !important' }} /> : 'Save'}
            </SoftButton>
          </div>
        </div>
      </Modal>
      {/* <Modal
        open={openDebitModal}
        onClose={handleCancelApprove}
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
            width: '55vh',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            overflow: 'auto',
            maxHeight: '80vh',
          }}
        >
          <Grid container spacing={1} p={1}>
            <Grid item xs={12} md={12}>
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Select mode of refund
              </SoftTypography>
            </Grid>
            <Grid item xs={12} md={12}>
              <SoftSelect
                value={refundOptions.find((option) => option.value === refundMode) || ''}
                onChange={(option) => handleDebitOptionChange(option.value)}
                options={refundOptions}
              />
            </Grid>
            {refundMode === 'CREDIT_NOTE' ? (
              <Grid item xs={12} md={12}>
                <Grid container>
                  <Grid item xs={12} md={12} mt={1}>
                    <SoftTypography variant="h6">Expected material pick-up date</SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={12} mt={1}>
                    <SoftBox>
                      <SoftInput type="date" onChange={(e) => setExpectedPickup(e.target.value)} />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12} mt={1}>
                    <SoftBox>
                      <SoftBox
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: selectedFiles ? 'flex-start' : 'center',
                          alignItems: 'center',
                        }}
                      >
                        <SoftTypography className="add-customer-file-head">Attach Document</SoftTypography>
                        <SoftBox
                          style={{
                            display: 'flex',
                            justifyContent: selectedFiles ? 'flex-start' : 'center',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <SoftBox className="profile-box-up">
                            <form className="profile-box-up">
                              <input
                                type="file"
                                name="file"
                                id="my-file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              />
                              <label for="my-file" className="custom-file-upload-data-I-bills">
                                <SoftTypography className="upload-text-I">
                                  Upload <UploadFileIcon />
                                </SoftTypography>
                              </label>
                            </form>
                          </SoftBox>
                          {selectedFiles && (
                            <Badge
                              badgeContent={
                                <CancelIcon sx={{ fontSize: '25px' }} onClick={() => setSelectedFiles(null)} />
                              } // Icon representing file type
                              // color="primary" // You can change the color of the badge
                            >
                              <SoftBox>
                                {selectedFiles?.type?.includes('image') ? (
                                  <div>
                                    <SoftBox
                                      style={{
                                        border: '1px solid gray',
                                        padding: '10px',
                                        borderRadius: '7px',
                                        width: '50px',
                                      }}
                                    >
                                      <img src={selectedFiles} />
                                    </SoftBox>
                                  </div>
                                ) : (
                                  <div className="upload-text-I">
                                    <SoftBox style={{ border: '1px solid gray', padding: '10px', borderRadius: '7px' }}>
                                      <SoftTypography style={{ fontSize: '12px' }}>
                                        {selectedFiles?.name}
                                      </SoftTypography>
                                    </SoftBox>
                                  </div>
                                )}
                              </SoftBox>
                            </Badge>
                          )}
                        </SoftBox>
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Grid>
            ) : refundMode === 'REFUND' ? (
              <>
                <Grid item xs={12} md={12}>
                  <SoftTypography fontSize="14px">
                    Status can only be updated once you receive money from the vendor. Have you received?{' '}
                  </SoftTypography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid container mt={1} display="column" alignItems="center" gap="10px">
                    <Grid xs={12} md={12} lg={12}>
                      <div className="common-display-flex-1">
                        <label className="common-display-flex-1" style={{ gap: '5px' }}>
                          <input
                            type="radio"
                            name="moneyRecieved"
                            value="Yes"
                            onChange={handleChange}
                            className="radio-checbox-products"
                            checked={optionChange === 'Yes'}
                          />
                          <span className="input-label-text">Yes</span>
                        </label>
                        <label className="common-display-flex-1" style={{ gap: '5px' }}>
                          <input
                            type="radio"
                            name="moneyRecieved"
                            value="No"
                            onChange={handleChange}
                            className="radio-checbox-products"
                            checked={optionChange === 'No'}
                          />
                          <span className="input-label-text">No</span>
                        </label>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {optionChange === 'Yes' && (
                  <Grid item xs={12} md={12}>
                    <Grid conatiner>
                      <Grid xs={12} lg={12} mt={1}>
                        <SoftTypography fontSize="16px">Reference number</SoftTypography>
                      </Grid>
                      <Grid xs={12} lg={12} mt={1}>
                        <SoftInput type="text" onChange={(e) => setReferenceNumber(e.target.value)} />
                      </Grid>
                      <Grid xs={12} lg={12} mt={1}>
                        <SoftTypography fontSize="16px">Expected material pick-up date</SoftTypography>
                      </Grid>
                      <Grid xs={12} lg={12} mt={1}>
                        <SoftInput type="date" onChange={(e) => setExpectedPickup(e.target.value)} />
                      </Grid>
                      <Grid xs={12} lg={12} mt={1}>
                        <SoftBox
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: selectedFiles ? 'flex-start' : 'center',
                            alignItems: 'center',
                          }}
                        >
                          <SoftTypography className="add-customer-file-head">Attach Document</SoftTypography>
                          <SoftBox
                            style={{
                              display: 'flex',
                              justifyContent: selectedFiles ? 'flex-start' : 'center',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <SoftBox className="profile-box-up">
                              <form className="profile-box-up">
                                <input
                                  type="file"
                                  name="file"
                                  id="my-file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                />
                                <label for="my-file" className="custom-file-upload-data-I-bills">
                                  <SoftTypography className="upload-text-I">
                                    Upload <UploadFileIcon />
                                  </SoftTypography>
                                </label>
                              </form>
                            </SoftBox>
                            {selectedFiles && (
                              <Badge
                                badgeContent={
                                  <CancelIcon sx={{ fontSize: '25px' }} onClick={() => setSelectedFiles(null)} />
                                } // Icon representing file type
                                // color="primary" // You can change the color of the badge
                              >
                                <SoftBox>
                                  {selectedFiles?.type?.includes('image') ? (
                                    <div>
                                      <SoftBox
                                        style={{
                                          border: '1px solid gray',
                                          padding: '10px',
                                          borderRadius: '7px',
                                          width: '50px',
                                        }}
                                      >
                                        <img src={selectedFiles} />
                                      </SoftBox>
                                    </div>
                                  ) : (
                                    <div className="upload-text-I">
                                      <SoftBox
                                        style={{ border: '1px solid gray', padding: '10px', borderRadius: '7px' }}
                                      >
                                        <SoftTypography style={{ fontSize: '12px' }}>
                                          {selectedFiles?.name}
                                        </SoftTypography>
                                      </SoftBox>
                                    </div>
                                  )}
                                </SoftBox>
                              </Badge>
                            )}
                          </SoftBox>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </>
            ) : null}
            <Grid item xs={12} md={12}>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={handleCancelApprove}>
                  Cancel
                </SoftButton>
                <SoftButton
                  variant={buttonStyles?.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={updateReturnStatus}
                  disabled={debitAppLoader ? true : false}
                >
                  {debitAppLoader ? <CircularProgress size={18} /> : <>Save</>}
                </SoftButton>
              </SoftBox>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={openRejectDebitModal}
        onClose={() => setOpenRejectDebitModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="pi-approve-menu-1">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to reject the debit?
          </SoftTypography>
          <SoftBox>
            <SoftSelect
              value={{ value: rejectReason, label: rejectReason }}
              options={[
                { value: 'Dummy Debit', label: 'Dummy Debit' },
                { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                { value: 'Needs revision', label: 'Needs revision' },
                { value: 'Others', label: 'Others' },
              ]}
              onChange={(e) => setRejectReason(e.value)}
            />
          </SoftBox>
          <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => setOpenRejectDebitModal(false)}>
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton vendor-add-btn"
              onClick={handleRejectDebit}
              disabled={debitRejectLoader ? true : false}
            >
              {debitRejectLoader ? <CircularProgress size={20} /> : <>Reject</>}
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>
      <Modal
        open={materialModal}
        onClose={() => setMaterialModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="pi-approve-menu">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Select Material Update Status
          </SoftTypography>
          <SoftBox>
            <SoftSelect
              value={materialState}
              options={[
                { value: 'MATERIAL_RETURNED_TO_VENDOR', label: 'Material Returned to Vendor' },
                { value: 'MATERIAL_WASTAGE_ON_VENDOR', label: 'Material wastage to Vendor' },
                { value: 'MATERIAL_REPLACED', label: 'Material Replacement' },
              ]}
              onChange={(e) => setMaterialState(e)}
            />
          </SoftBox>
          <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => setMaterialModal(false)}>
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton vendor-add-btn"
              onClick={() => handleMaterial(materialState)}
              disabled={materialLoader ? true : false}
            >
              {materialLoader ? <CircularProgress size={20} /> : <>Save</>}
            </SoftButton>
          </SoftBox>
        </div>
      </Modal> */}
    </DashboardLayout>
  );
};

export default NewPurchaseReturnDetailsPage;
