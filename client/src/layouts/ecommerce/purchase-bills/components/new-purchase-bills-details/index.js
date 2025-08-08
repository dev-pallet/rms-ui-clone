import { TrashIcon } from '@heroicons/react/24/outline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ReceiptIcon from '@mui/icons-material/Receipt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, CircularProgress, Grid, Menu, MenuItem, Modal } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format, parse } from 'date-fns';
import FormField from 'layouts/ecommerce/purchase-bills/components/FormField/index';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import {
  approvebillpost,
  billdelete,
  billtimelinedetailsO,
  createComment,
  fetchBillDetails,
  getComments,
  getvendorNameBill,
  postPaymentBills,
  rejectbillpost,
  vieworderspdf,
} from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../../Common/buttonColor';
import { dateFormatter, isSmallScreen } from '../../../Common/CommonFunction';
import CustomMobileButton from '../../../Common/mobile-new-ui-components/button';
import CommonAccordion from '../../../Common/mobile-new-ui-components/common-accordion';
import CommonIcon from '../../../Common/mobile-new-ui-components/common-icon-comp';
import MobileDrawerCommon from '../../../Common/MobileDrawer';
import AdditionalDetails from '../../../Common/new-ui-common-components/additional-details';
import CommentComponent from '../../../Common/new-ui-common-components/comment-component';
import CommonDataGrid from '../../../Common/new-ui-common-components/common-datagrid';
import CommonTimeLine from '../../../Common/new-ui-common-components/timeline';
import PurchaseBillHeaders from './component/purchase-header-bills';
import './purchase-bill-details.css';
import CommonStatus from '../../../Common/mobile-new-ui-components/status';

const NewPurchaseBillDetailsPage = () => {
  const isMobileDevice = isSmallScreen();
  const params = useParams();
  const { billId } = params;
  const [billDetails, setBillDetails] = useState({});
  const [additionalDetails, setAdditionalDetails] = useState({});
  const [comments, setComments] = useState([]);
  const [createdComment, setCreatedComment] = useState('');
  const [commentLoader, setCommentLoader] = useState(false);
  const [getCommentsLoader, setGetCommentsLoader] = useState(false);
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const [timlineData, setTimelineData] = useState([]);
  const [timelineLoader, setTimelineLoader] = useState(false);
  const [billMenuAnchorEll, setBillMenuAnchorEll] = useState(null);
  const billOpen = Boolean(billMenuAnchorEll);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const showSnackbar = useSnackbar();
  const [billStatus, setBillStatus] = useState('');
  const [selectedImages, setSelectedImages] = useState('');
  const [paymentRows, setPaymentRows] = useState([]);

  //file upload
  const [paymentDate, setPaymentDate] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [poNumber, setpoNumber] = useState('');

  const handleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);
  };

  const handleSubmitForm = (event) => {
    setTimelineloader(true);
    const payload = {
      billNumber: billId,
      poNumber: poNumber,
      paymentMadeDate: paymentDate,
      paidAmount: paidAmount,
      paymentMethod: paymentMethod,
      createdBy: userInfo?.uidx,
    };
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedImages);
    formData.append(
      'poPaymentMade',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    if (billStatus === 'CREATED') {
      showSnackbar('Bill needs to be approved', 'error');
      setOpenModal(false);
      setTimelineloader(false);
    } else {
      postPaymentBills(formData)
        .then((res) => {
          showSnackbar('Success Payment Made', 'success');
          // setPaysum(!paysum);
          setTimelineloader(false);
          setOpenModal(false);
          fetchingVendorNameBill();
          fetchingBillDetails();
          fetchBillTimeline();
          // billsDetails();
          // window.location.reload(true)
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
          setTimelineloader(false);
          setOpenModal(false);
        });
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const handleRefundOpen = () => {
  //   setRefundModal(true);
  // };
  // const handleRefundclose = () => {
  //   setRefundModal(false);
  // };

  const navigate = useNavigate();

  const handleCloseModal1 = () => setOpenModal1(false);

  const handleApprove = () => {
    setOpenModal1(true);
    setBillMenuAnchorEll(null);
  };

  const handleCloseModal2 = () => setOpenModal2(false);

  const handleReject = () => {
    setOpenModal2(true);
    setBillMenuAnchorEll(null);
  };

  const handleCloseModal3 = () => setOpenModal3(false);

  const handleDelete = () => {
    setOpenModal3(true);
    setBillMenuAnchorEll(null);
  };

  const handleBillMenuOpen = (event) => {
    setBillMenuAnchorEll(event.currentTarget);
  };

  const handleBillMenuClose = () => {
    setBillMenuAnchorEll(null);
  };

  const [timelineloader, setTimelineloader] = useState(false);
  async function handleApprovebill() {
    setTimelineloader(true);
    const payload = {
      billNumber: billId,
      poBillStatus: 'ACCEPTED',
      poBillEvents: 'ACCEPT',
      comments: 'string',
      updatedBy: userInfo?.uidx,
    };
    try {
      const result = await approvebillpost(payload);
      showSnackbar('Success Bill Approved', 'success');
      fetchingBillDetails();
      fetchBillTimeline();
      setOpenModal1(false);
      setTimelineloader(false);
      // billsDetails();
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setOpenModal1(false);
      setTimelineloader(false);
      setTimeout(() => {
        setTimelineloader(false);
      }, []);
    }
  }

  const [rejectionreason, setRejectionReason] = useState('');
  async function handleRejectBill() {
    setTimelineloader(true);
    const payload = {
      billNumber: billId,
      poBillStatus: 'REJECTED',
      poBillEvents: 'REJECT',
      comments: rejectionreason,
      updatedBy: userInfo?.uidx,
    };
    try {
      const result = await rejectbillpost(payload);
      showSnackbar('Success Bill Rejected', 'success');
      fetchingBillDetails();
      fetchBillTimeline();
      setOpenModal2(false);
      setTimelineLoader(false);
    } catch (err) {
      showSnackbar(err.response.data.message, 'error');
      setTimelineLoader(false);

      setOpenModal2(false);
      setTimeout(() => {
        setTimelineloader(false);
      }, []);
    }
  }

  const [reason, setDeleteReason] = useState('');
  async function handleDeletebill() {
    setTimelineloader(true);
    const payload = {
      billNumber: billId,
      userId: userInfo?.uidx,
      reason: reason,
    };
    await billdelete(payload)
      .then((res) => {
        showSnackbar(res.data.data.message, 'success');
        setTimelineLoader(false);
        // setDele(!dele);
        fetchBillTimeline();
        setOpenModal3(false);
        if (isMobileDevice) {
          navigate('/purchase/ros-app-purchase?value=bills');
        } else {
          navigate('/purchase/purchase-bills');
        }
      })
      .catch((err) => {
        showSnackbar(err.response.data.message, 'error');
        setTimelineLoader(false);

        setOpenModal3(false);
        setTimeout(() => {
          setTimelineloader(false);
        }, []);
      });

    setOpenModal3(false);
    setTimelineloader(false);
  }

  const [billvendorname, setBillvendorName] = useState('');

  const fetchingVendorNameBill = () => {
    getvendorNameBill(billId).then((res) => {
      setBillvendorName(res?.data?.data);
    });
  };
  useEffect(() => {
    fetchingVendorNameBill();
  }, []);

  // useEffect(() => {
  //   getPurchaseordernumber(billId).then((res) => {
  //     setpoNumber(res.data.data.poNumber);
  //     // setComment(res?.data?.data?.comments);
  //     // setrefundableAmount(res?.data?.data?.refundableAmount);
  //   });
  // }, []);

  const array = useMemo(
    () => [
      {
        tabName: 'Paid',
        tabValue: 'paid',
        tabDescription: `on ${additionalDetails?.paidDate}`,
        tabIcon: '',
      },
      {
        tabName: 'Balance',
        tabValue: 'balance',
        tabDescription: `due on ${additionalDetails?.balanceDate}`,
        tabIcon: '',
      },
      {
        tabName: 'Payment Method',
        tabValue: 'paymentMethod',
        tabDescription: `on ${additionalDetails?.paymentDate}`,
        tabIcon: '',
      },
      {
        tabName: 'Inward Status',
        tabValue: 'inwardStatus',
        tabDescription: `on ${additionalDetails?.inwardStatusDate}`,
        tabIcon: '',
      },
      {
        tabName: 'Inward Rejection',
        tabValue: 'inwardRejection',
        tabDescription: `from ${additionalDetails?.inwardRejectionValue || '0'} products`,
        tabIcon: '',
      },
      {
        tabName: 'Inward Quantity',
        tabValue: 'inwardQuantity',
        tabDescription: `from ${additionalDetails?.inwardQuantityValue || 0} products`,
        tabIcon: '',
      },
    ],
    [additionalDetails],
  );

  const fetchingBillDetails = () => {
    fetchBillDetails(billId)
      .then((response) => {
        if (response?.data?.data?.es > 0) {
          setPaymentRows([]);  // No payment data, so set it as empty
          showSnackbar(response?.data?.data?.message, 'error');
          return;
        }
        const res = response?.data?.data;
        setBillDetails({
          vendorName: res?.vendorName ?? 'NA',
          createdBy: res?.createdBy ?? 'NA',
          billValue: res?.billValue ?? 'NA',
          deliveredOn: dateFormatter(res?.deliveredOn) ?? 'NA',
          deliveryLocation: res?.deliveryLocation ?? 'NA',
          inwardId: res?.inwardId ?? 'NA',
          inwardLocation: res?.inwardLocation ?? 'NA',
          inwardType: res?.inwardType ?? 'NA',
          approvedBy: res?.approvedBy ?? 'NA',
          poNumber: res?.poNumber ?? 'NA',
          billDate: dateFormatter(res?.billDate) ?? 'NA',
          dueDate: dateFormatter(res?.dueDate) ?? 'NA',
          poNumber: res?.poNumber ?? 'NA',
          invoiceRefNo: res?.invoiceRefNo ?? 'NA',
          docId: res?.docId ?? 'NA',
        });
        setAdditionalDetails({
          paid: res?.paid ?? 'NA',
          paidDate: dateFormatter(res?.paidDate) ?? 'NA',
          balance: res?.balance ?? 'NA',
          balanceDate: dateFormatter(res?.balanceDue) ?? 'NA',
          paymentMethod: res?.paymentMethod ?? 'NA',
          paymentDate: dateFormatter(res?.paymentMethodValue) ?? 'NA',
          inwardStatus:
            res?.inwardStatus
              ?.toLowerCase()
              ?.split('_')
              ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
              ?.join(' ') ?? 'NA',
          inwardStatusDate: dateFormatter(res?.inwardOn) ?? 'NA',
          inwardRejection: res?.inwardRejection ?? 'NA',
          inwardRejectionValue: res?.inwardRejectionCount ?? 'NA',
          inwardQuantity: res?.inwardQuantity ?? 'NA',
          inwardQuantityValue: res?.inwardProductCount ?? 'NA',
        });
        setBillStatus(res?.status);
        setpoNumber(res?.poNumber);
        const paymentRows = res?.poPaymentMadeList?.map((item, index) => ({
          id: index,
          paymentDate: dateFormatter(item?.paymentMadeDate) ?? 'NA',
          amountPaid: item?.paidAmount ?? 'NA',
          // balance: item?.balance,
          paymentMode: item?.paymentMethod ?? 'NA',
          transactionId: item?.transactionId ?? 'NA',
          document: item?.docId ?? 'NA',
        }));
        setPaymentRows(paymentRows);
      })
      .catch((err) => {
        setPaymentRows([]);
      });
  };

  const fetchBillTimeline = () => {
    setTimelineLoader(true);
    billtimelinedetailsO(billId)
      .then((response) => {
        const timelineData = response?.data?.data?.timelines?.map((item, index) => {
          const parsedDate = parse(item?.updatedOn, 'dd MMM yyyy hh:mm:ss a', new Date());
          const date = format(parsedDate, 'do MMMM yyyy');
          const time = format(parsedDate, "HH:mm'hours'");
          const status = timelineStatusObject(
            //getting status object for timeline .ie name, icon, userDesc, dateTime
            item?.status,
            item?.updatedBy,
            date,
            time,
            item?.logType,
            item?.view,
            item?.quoteId,
            item?.docId,
          );
          return {
            id: index,
            ...status,
          };
        });
        setTimelineData(timelineData);
        setTimelineLoader(false);
      })
      .catch((err) => {
        setTimelineData([]);
        setTimelineLoader(false);
      });
  };

  const [viewLoader, setViewLoader] = useState(false);
  const [viewPdfIndex, setViewPdfIndex] = useState();
  const handleViewPdf = async (docId, index) => {
    if (docId === 'NA' || docId === null || docId === undefined) {
      return showSnackbar('No document found', 'error');
    }
    setViewLoader(true);
    setViewPdfIndex(index);
    const res = await vieworderspdf(docId);
    const blob = new Blob([res?.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setViewLoader(false);
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchingBillDetails();
    fetchBillTimeline();
  }, [billId]);

  const fetchComments = () => {
    setGetCommentsLoader(true);
    getComments(billId)
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
      refId: billId,
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

  const paymentDetailsColumn = useMemo(
    () => [
      {
        field: 'paymentDate',
        headerName: 'Payment Date',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 250,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'amountPaid',
        headerName: 'Amount Paid',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      // {
      //   field: 'balance',
      //   headerName: 'Balance',
      //   headerClassName: 'datagrid-columns',
      //   headerAlign: 'left',
      //   minWidth: 80,
      //   cellClassName: 'datagrid-rows',
      //   align: 'left',
      //   flex: 1,
      // },
      {
        field: 'paymentMode',
        headerName: 'Payment Mode',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 110,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'transactionId',
        headerName: 'Transaction ID',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'document',
        headerName: '',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          return (
            <div className="view-payment-doc" onClick={() => handleViewPdf(params?.row?.document, params?.row?.id)}>
              {viewLoader && viewPdfIndex === params?.row?.id ? (
                <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />
              ) : (
                'View'
              )}
            </div>
          );
        },
      },
    ],
    [viewLoader],
  );

  const timelineStatusObject = (statusName, userName, date, time, logType, view, quoteId, docId) => {
    if (logType === 'Bill Status') {
      switch (statusName) {
        case 'Created':
          return {
            name: 'Pending Approval',
            iconColor: '#0562fb',
            icon: <AddCircleOutlineIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
            docId: docId,
            logType: logType,
          };
        case 'Accepted':
          return {
            name: 'Bill Approved',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Created by ${userName}`,
            dateTime: `${date}, ${time}`,
            docId: docId,
            logType: logType,
          };
        case 'Partially paid':
          return {
            name: 'Bill Partially Paid',
            iconColor: '#0562fb',
            icon: <HowToRegIcon />,
            userDesc: `Payment by  ${userName}`,
            dateTime: `${date}, ${time}`,
            logType: logType,
            docId: docId,
          };
        case 'Rejected':
          return {
            name: 'Bill Rejected',
            iconColor: 'red',
            icon: <HighlightOffIcon />,
            userDesc: `Rejected by ${userName}`,
            dateTime: `${date}, ${time}`,
            logType: logType,
            docId: docId,
          };
        case 'Paid':
          return {
            name: 'Payment Made',
            iconColor: '#0562fb',
            icon: <ReceiptIcon />,
            userDesc: `Preferred Vendor - ${userName}`,
            dateTime: `${date}, ${time}`,
            docId: docId,
            logType: logType,
          };
        case 'Closed':
          return {
            name: 'Bill Closed',
            iconColor: 'green',
            icon: <DoneAllIcon />,
            userDesc: `Closed by ${userName}`,
            dateTime: `${date}, ${time}`,
            logType: logType,
            docId: docId,
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
            name: logType,
            iconColor: '#0562fb',
            icon: <ReceiptIcon />,
            userDesc: `Payment by ${userName}`,
            dateTime: `${date}, ${time}`,
            view: view,
            logType: logType,
            docId: docId,
          };
      }
    }
  };

  return (
    <DashboardLayout>
      {!isMobileDevice ? <DashboardNavbar prevLink={true} /> : null}
      {isMobileDevice ? (
        <div className="purchase-details-main-div purchase-details-all-flex">
          <div className="stack-row-center-between width-100 purchase-action-button-tools">
            <div className="stack-row-center-between action-btn-purchase-ros-app">
              {billStatus === 'CREATED' ? (
                <>
                  <CustomMobileButton title={'Approve'} variant={'blue-D'} onClickFunction={handleApprove} />
                  <CustomMobileButton title={'Decline'} variant={'black-S'} onClickFunction={handleReject} />
                </>
              ) : (
                <CommonStatus status={billStatus} />
              )}
            </div>
            <div className="stack-row-center-between action-btn-purchase-ros-app-icons">
              <CommonIcon icon={<TrashIcon />} iconOnClickFunction={handleDelete} iconColor="red" />
            </div>
          </div>
          <div className="purchase-order-main-div-ros-app">
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="purchase-id-title">{billDetails?.invoiceRefNo}</span>
                <span className="purchase-id-value">Bill Number</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="purchase-id-title">{billDetails?.poNumber}</span>
                <span className="purchase-id-value">Purchase Order</span>
              </div>
            </div>
          </div>

          <div className="listing-card-bg-secondary border-box-true">
            <div className="stack-row-center-between width-100">
              <span className="vendor-name-bills-list">Bill Value</span>
              <span className="purchase-id-title">₹{billDetails?.billValue}</span>
            </div>
            <hr className="horizontal-line-app-ros" />
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Added By</span>
                <span className="bill-card-value">{billDetails?.createdBy}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Vendor name</span>
                <span className="bill-card-value">{billDetails?.vendorName}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Delivered on</span>
                <span className="bill-card-value">{billDetails?.deliveredOn}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Delivered location</span>
                <span className="bill-card-value">{billDetails?.deliveryLocation}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Inward Location</span>
                <span className="bill-card-value">{billDetails?.inwardLocation}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Inward Type</span>
                <span className="bill-card-value">{billDetails?.inwardType}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Bill Date</span>
                <span className="bill-card-value">{billDetails?.billDate}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Due Date</span>
                <span className="bill-card-value">{billDetails?.dueDate}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Inward ID</span>
                <span className="bill-card-value">{billDetails?.inwardId}</span>
              </div>
              <div className="flex-colum-align-end">
                <CustomMobileButton
                  variant="black-D"
                  title="Pay now"
                  justifyContent="space-between"
                  onClickFunction={handleOpenModal}
                  width="100%"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PurchaseBillHeaders
          billId={billId}
          billDetails={billDetails}
          handleMenu={handleBillMenuOpen}
          payNowFunc={handleOpenModal}
          invoiceRefNo={billDetails?.invoiceRefNo}
        />
      )}
      {isMobileDevice ? (
        <div className="purchase-details-main-div purchase-details-all-flex">
          <AdditionalDetails additionalDetailsArray={array} additionalDetails={additionalDetails} />
        </div>
      ) : (
        <AdditionalDetails additionalDetailsArray={array} additionalDetails={additionalDetails} />
      )}

      {isMobileDevice ? (
        <div className="purchase-details-main-div purchase-details-all-flex">
          <CommonAccordion title={'Bill Timeline'} backgroundColor={'black-D'}>
            <div className="common-timeline-main-div">
              <CommonTimeLine timelineArray={timlineData} timelineLoader={timelineLoader} purchaseId={billId} />
            </div>
          </CommonAccordion>

          <div className="bill-details-main-div ">
            <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">Payment Details</span>

            {paymentRows && paymentRows.length > 0 ? (
              paymentRows.map((paymentRow, index) => (
                <div key={index} className="listing-card-bg-secondary">
                  <div className="stack-row-center-between width-100">
                    <span className="vendor-name-bills-list">Transaction ID</span>
                    <span className="purchase-id-title">{paymentRow?.transactionId || 'NA'}</span>
                  </div>

                  <hr className="horizontal-line-app-ros" />

                  <div className="stack-row-center-between width-100">
                    <div className="flex-colum-align-start">
                      <span className="bill-card-label">Payment Date</span>
                      <span className="bill-card-value">{paymentRow?.paymentDate || 'NA'}</span>
                    </div>
                    <div className="flex-colum-align-end">
                      <span className="bill-card-label">Payment mode</span>
                      <span className="bill-card-value">{paymentRow?.paymentMode || 'NA'}</span>
                    </div>
                  </div>

                  <div className="stack-row-center-between width-100">
                    <div className="flex-colum-align-start">
                      <span className="bill-card-label">Amount</span>
                    </div>
                    <div className="flex-colum-align-end">
                      <CustomMobileButton
                        variant="black-D"
                        title={`₹${paymentRow?.amountPaid ?? 'NA'}`}
                        justifyContent="space-between"
                        width="100%"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-purchase">
                <span>No Data Found</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="purchase-bills-divider">
          <div className="purchase-bills-divider-children bill-children-one">
            <span className="purch-det-heading-title pinsights-title">Bill Timeline</span>
            <div
              className="component-bg-br-sh-p"
              style={{
                marginTop: '10px',
              }}
            >
              <CommonTimeLine timelineArray={timlineData} timelineLoader={timelineLoader} purchaseId={billId} />
            </div>
          </div>
          <div className="purchase-bills-divider-children bill-children-two">
            <span className="purch-det-heading-title pinsights-title">Payment Details</span>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <CommonDataGrid rows={paymentRows} columns={paymentDetailsColumn} />
            </div>
            <div
              style={{
                paddingBottom: '10px',
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
      )}

      <Menu
        id="basic-menu"
        // className="menu-box"
        anchorEl={billMenuAnchorEll}
        open={billOpen}
        onClose={handleBillMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleApprove}>Approve</MenuItem>
        <MenuItem onClick={handleReject}>Reject</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      {isMobileDevice ? (
        <MobileDrawerCommon
          anchor="bottom"
          paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
          drawerOpen={openModal1}
          drawerClose={handleCloseModal1}
        >
          <Box className="approve-modal-new-pi">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to approve this.
            </SoftTypography>
            <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal1}>
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
                <SoftButton className="vendor-add-btn picancel-btn" onClick={handleApprovebill}>
                  Save
                </SoftButton>
              )}
            </SoftBox>
          </Box>
        </MobileDrawerCommon>
      ) : (
        <SoftBox>
          <Modal
            open={openModal1}
            onClose={handleCloseModal1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to approve this.
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={handleCloseModal1}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleApprovebill}
                >
                  {timelineloader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </SoftBox>
      )}

      {isMobileDevice ? (
        <MobileDrawerCommon
          anchor="bottom"
          paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
          drawerOpen={openModal2}
          drawerClose={handleCloseModal2}
          overflowHidden={true}
        >
          <Box className="pi-approve-menu-1-mobile">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2" className="rejected-title">
              Are you sure you want to cancel?
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
                onChange={(e) => setRejectionReason(e.value)}
                options={[
                  { value: 'Dummy Bill', label: 'Dummy Bill' },
                  { value: 'Others', label: 'Others' },
                ]}
                menuPlacement="top"
                classNamePrefix="soft-select"
                sx={{
                  width: '100% !important',
                }}
              />
            </SoftBox>
            <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal2}>
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
                <SoftButton className="vendor-add-btn picancel-btn" onClick={handleRejectBill}>
                  Save
                </SoftButton>
              )}
            </SoftBox>
          </Box>
        </MobileDrawerCommon>
      ) : (
        <SoftBox>
          <Modal
            open={openModal2}
            onClose={handleCloseModal2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Bills rejected cannot be revoked. Are you sure you want to reject?
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
              </SoftBox>
              <SoftSelect
                defaultValue={{ value: '', label: '' }}
                menuPlacement="top"
                sx={{
                  width: '100% !important',
                }}
                options={[
                  { value: 'Dummy Bill', label: 'Dummy Bill' },
                  { value: 'Others', label: 'Others' },
                ]}
                onChange={(e) => setRejectionReason(e.value)}
              />
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={handleCloseModal2}>
                  Cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={handleRejectBill}>
                  {timelineloader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </SoftBox>
      )}

      {isMobileDevice ? (
        <MobileDrawerCommon
          anchor="bottom"
          paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
          drawerOpen={openModal3}
          drawerClose={handleCloseModal3}
          overflowHidden={true}
        >
          <Box className="pi-approve-menu-1-mobile">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2" className="rejected-title">
              Are you sure you want to delete this.
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
                onChange={(e) => setDeleteReason(e.value)}
                options={[
                  { value: 'PO cancelled', label: 'PO cancelled' },
                  { value: 'Bill mismatched', label: 'Bill mismatched' },
                  { value: 'Dummy bill', label: 'Dummy bill' },
                  { value: 'Others', label: 'Others' },
                ]}
                menuPlacement="top"
                sx={{
                  width: '100% !important',
                }}
              />
            </SoftBox>
            <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal3}>
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
                <SoftButton className="vendor-add-btn picancel-btn" onClick={handleDeletebill}>
                  Delete
                </SoftButton>
              )}
            </SoftBox>
          </Box>
        </MobileDrawerCommon>
      ) : (
        <SoftBox>
          <Modal
            open={openModal3}
            onClose={handleCloseModal3}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete this.
              </SoftTypography>
              <SoftSelect
                defaultValue={{ value: '', label: '' }}
                options={[
                  { value: 'PO cancelled', label: 'PO cancelled' },
                  { value: 'Bill mismatched', label: 'Bill mismatched' },
                  { value: 'Dummy bill', label: 'Dummy bill' },
                  { value: 'Others', label: 'Others' },
                ]}
                onChange={(e) => setDeleteReason(e.value)}
              />

              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={handleCloseModal3}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleDeletebill}
                >
                  {timelineloader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </SoftBox>
      )}

      <Modal
        open={openModal}
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
            <Grid item xs={12} md={12}>
              <SoftTypography fontSize="12px">
                <b>Bill No: </b>
                {billId}
              </SoftTypography>
            </Grid>
            <Grid item xs={12} md={12}>
              <SoftTypography fontSize="12px">
                <b>P.O No:</b> {poNumber}{' '}
              </SoftTypography>
            </Grid>
            <Grid item xs={12} md={12}>
              <SoftTypography fontSize="12px">
                <b>Balance: </b>
                {billvendorname.balance}{' '}
              </SoftTypography>
            </Grid>
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
                  disablePast
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
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Cheque', label: 'Cheque' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Online Payment', label: 'Online Payment' },
                  { value: 'Credit Card', label: 'Credit card' },
                  { value: 'Debit Card', label: 'Debit card' },
                ]}
                onChange={(e) => setPaymentMethod(e.value)}
              />
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
                      <SoftTypography className="upload-text-I">
                        Upload <UploadFileIcon />
                      </SoftTypography>
                    </label>
                  </SoftBox>
                </SoftBox>
              )}
            </SoftBox>
            <Grid item xs={12} sm={12}>
              <SoftBox className="header-submit-box">
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={handleCloseModal}
                >
                  cancel
                </SoftButton>
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleSubmitForm}
                >
                  {timelineloader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};

export default NewPurchaseBillDetailsPage;
