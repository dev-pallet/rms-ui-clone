import Grid from '@mui/material/Grid';
// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import TimelineList from 'examples/Timeline/TimelineList';
// import TimelineItem from "layouts/ecommerce/purchase-indent/components/po-details-page/TimelineItem/index";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from '@mui/material/Modal';
import AnimatedStatisticsCard from 'examples/Cards/StatisticsCards/AnimatedStatisticsCard';
import MiniStatisticsCard from 'examples/Cards/StatisticsCards/MiniStatisticsCard';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimelineItem from './TimelineItem';
// General page components
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import FormField from 'layouts/ecommerce/purchase-bills/components/FormField/index';
// styles
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Drawer,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SplideSlide } from '@splidejs/react-splide';
import { format } from 'date-fns';
import 'layouts/ecommerce/purchase-main/components/po-details-page/po-details-page.css';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../../../../components/Spinner';
import {
  converpurchasetoopen,
  downloadOrderspdf,
  getUserFromUidx,
  getpurchaseorderdetailsvalue,
  getpurchaseordertimeline,
  getvendorName,
  podelete,
  postPaymentBills,
  postbillgeneratedDetails,
  rejectpurchaseorder,
  updatestatuspurchaseorder,
} from '../../../../../config/Services';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SplideCommon from '../../../../dashboards/default/components/common-tabs-carasoul';
import { buttonStyles } from '../../../Common/buttonColor';
import { dateFormatter, isSmallScreen } from '../../../Common/CommonFunction';
import MobileDrawerCommon from '../../../Common/MobileDrawer';
import SetInterval from '../../../setinterval';
import PODetailsCard from './po-details-card';

export const PoDetailsPage = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [comments, setCommets] = useState('');
  const [comArr, setComArr] = useState([]);
  const [time, setTime] = useState(Date());
  const [datRows, setTableRows] = useState([]);
  const { poNumber } = useParams();
  const open = Boolean(anchorEl);
  const open1 = Boolean(anchorEl1);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenu1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClose1 = () => {
    setAnchorEl1(null);
  };
  const addComment = () => {
    setComArr([...comArr, comments]);
    setCommets('');
    setTime(Date());
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);
  const [openModal5, setOpenModal5] = useState(false);
  const [dele, setDele] = useState(false);
  const [adi, setAdi] = useState(false);
  const [rezo, setRezo] = useState(false);
  const [convopen, setConvtopen] = useState(false);
  const handleCloseModal1 = () => setOpenModal1(false);
  const handleCloseModal5 = () => setOpenModal5(false);

  const handleEdit = () => {
    navigate(`/purchase/purchase-orders/create-purchase-order/${poNumber}`);
  };

  const handleApprove = () => {
    setOpenModal1(true);
    setAnchorEl(null);
  };

  const handleShipped = () => {
    setOpenModal5(true);
    setAnchorEl1(null);
  };
  const handleCloseModal2 = () => setOpenModal2(false);
  const handleReject = () => {
    setOpenModal2(true);
    setAnchorEl(null);
  };

  const handleReject1 = () => {
    setOpenModal4(true);
    setAnchorEl(null);
  };

  const handleCloseModal4 = () => {
    setOpenModal4(false);
  };

  const handleCloseModal3 = () => setOpenModal3(false);
  const handleDelete = () => {
    setOpenModal3(true);
    setAnchorEl(null);
  };

  useEffect(() => {
    poOrderTimeline();
  }, [dele, adi, rezo, convopen, paysum]);

  let retryPoTimeline = 0;
  const poOrderTimeline = () => {
    getpurchaseordertimeline(poNumber)
      .then((res) => {
        if (res?.data?.data?.code === 'ECONNRESET') {
          if (retryPoTimeline < 3) {
            allOrderList();
            retryPoTimeline++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setTimelineloader(false);
          }
        } else {
          setTableRows(res?.data?.data?.timelines);
          setTimelineloader(false);
        }
      })
      .catch((err) => {
        setTimelineloader(false);
        if (err?.response?.status === '429') {
          allOrderList();
        } else {
          showSnackbar('Some Error Occured, Try after some time', 'error');
          setTimelineloader(false);
        }
      });
  };

  const renderTimelineItems = datRows.map(({ logType, status, updatedOn, updatedBy, docId }) => (
    <TimelineItem
      key={updatedOn}
      updatedOn={updatedOn}
      updatedBy={updatedBy}
      status={status}
      docId={docId}
      logType={logType}
      color={
        status == 'Created'
          ? 'info'
          : status == 'Accepted'
          ? 'success'
          : status == 'Successful'
          ? 'success'
          : status === 'In_transit'
          ? 'success'
          : 'error'
      }
      icon="archive"
    />
  ));

  const [openmodel, setOpenmodel] = useState(false);
  const handleopen = () => {
    setOpenmodel(true);
  };
  const [poValue, setpoValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [advancemade, setAdvancemade] = useState('');
  const [resAssign, setResAssign] = useState('');
  const [exdate, setExdate] = useState('');
  const [itemData, setItemdata] = useState([]);
  const [inward, setInward] = useState('');
  const [returnMade, setReturnMade] = useState('');
  const [timelineStatus, setTimelineStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [rejectionreason, setRejectionReason] = useState('');

  useEffect(() => {
    getPODetails();
  }, []);

  const setAssignedToUser = [];
  let newassign = '';

  useEffect(() => {
    const fetchDataForAllKeys = () => {
      for (let i = 0; i < assignedTo?.length; i++) {
        const item = assignedTo[i];
        getUserFromUidx(item?.assignedUidx)
          .then((res) => {
            setAssignedToUser[i] = ' ' + res?.data?.data?.firstName;
            newassign = setAssignedToUser.toString();
            setResAssign(newassign);
          })
          .catch((err) => {
            setResAssign(err?.response?.data?.message);
          });
      }
    };
    fetchDataForAllKeys();
  }, [assignedTo]);

  let retryPodetail = 0;
  const getPODetails = () => {
    getpurchaseorderdetailsvalue(poNumber)
      .then((res) => {
        if (res?.data?.data?.code === 'ECONNRESET') {
          if (retryPodetail < 3) {
            getPODetails();
            retryPodetail++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
          }
        } else {
          setpoValue(res?.data?.data?.poValue);
          setDueDate(res?.data?.data?.dueIn);
          setAdvancemade(res?.data?.data?.advanceMade);
          setExdate(res?.data?.data?.expectedDeliveryDate);

          const originalItemList = res?.data?.data?.purchaseOrderItemList;

          const newItemList = [];

          for (let i = 0; i < originalItemList?.length; i++) {
            const mainProductDetails = originalItemList[i];
            newItemList.push(mainProductDetails);

            if (
              mainProductDetails?.offers &&
              mainProductDetails?.offers.offerType !== 'OFFER ON MRP' &&
              mainProductDetails?.offers.offerDetailsEntityList
            ) {
              const offerDetails = mainProductDetails?.offers?.offerDetailsEntityList[0];
              offerDetails.offerType = mainProductDetails?.offers?.offerType;
              offerDetails.quantityOrdered = mainProductDetails?.offers?.offerDetailsEntityList[0]?.inwardedQuantity;
              offerDetails.itemName = mainProductDetails?.offers?.offerDetailsEntityList[0]?.itemName;
              offerDetails.itemNo = mainProductDetails?.offers?.offerDetailsEntityList[0]?.gtin;
              newItemList.push(offerDetails);
            }
          }
          setItemdata(newItemList);
          setInward(res?.data?.data?.inwardStatus);
          setReturnMade(res?.data?.data?.returns);
        }
      })
      .catch((err) => {
        if (err?.response?.status === '429') {
          getPODetails();
        } else {
          if (err?.response?.data?.message) {
            showSnackbar(err?.response?.data?.message, 'error');
          } else {
            showSnackbar('No Data Found', 'error');
          }
        }
      });
  };

  const handleBill = () => {
    navigate(`/purchase/create-bills/${poNumber}`);
  };
  const [timelineloader, setTimelineloader] = useState(true);
  //timeline handler function
  var val = localStorage.getItem('user_details');
  var object = JSON.parse(val);

  async function handleRejection() {
    setTimelineloader(true);
    const payload = {
      poNumber: poNumber,
      poStatus: 'REJECTED',
      poEvents: 'REJECT',
      comments: rejectionreason,
      updatedByUser: object?.uidx,
    };

    try {
      const result = await rejectpurchaseorder(payload);
      showSnackbar('Success PO Rejected', 'success');
      setRezo(!rezo);
      setOpenModal2(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setOpenModal2(false);
      setTimelineloader(false);
    }
  }

  async function handleApproved() {
    setTimelineloader(true);
    const payload = {
      poNumber: poNumber,
      poStatus: 'ACCEPTED',
      comments: 'string',
      poEvents: 'ACCEPT',
      updatedByUser: object?.uidx,
    };

    try {
      const res = await updatestatuspurchaseorder(payload);
      showSnackbar('Success PO Approved', 'success');
      setAdi(!adi);
      setOpenModal1(false);
      setTimelineloader(false);
      vendorData();
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setOpenModal1(false);
      setTimelineloader(false);
    }
  }

  const [reason, setDeleteReason] = useState('');
  function handleDeleterequest() {
    setTimelineloader(true);
    const payload = {
      poNumber: poNumber,
      userId: object?.uidx,
      reason: reason,
    };
    podelete(payload)
      .then((res) => {
        showSnackbar('Success Deleted', 'success');
        setDele(!dele);
        setOpenModal3(false);
        SetInterval(navigate('/purchase/purchase-orders'));
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setOpenModal3(false);
        setTimelineloader(false);
      });
  }

  const [convertopen, setConvertopen] = useState('');

  async function handletransitsave() {
    setTimelineloader(true);
    const payload = {
      poNumber: poNumber,
      poStatus: 'IN_TRANSIT',
      poEvents: 'IN_TRANSIT',
      comments: convertopen,
      updatedByUser: object?.uidx,
    };
    try {
      const resopen = await converpurchasetoopen(payload);
      showSnackbar('Success PO Converted', 'success');
      setConvtopen(!convopen);
      setOpenModal4(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setOpenModal4(false);
      setTimelineloader(false);
    }
  }

  //file upload

  const [selectedImages, setSelectedImages] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billBalance, setBillBalance] = useState('');
  const [billPoNum, setBillPoNum] = useState('');
  const [billStatus, setBillStatus] = useState('');
  const [billGenerated, setBillGenerated] = useState(false);
  const [paymentDate, setPaymentDate] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paysum, setPaysum] = useState(false);

  const handleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);
  };

  var val = localStorage.getItem('user_details');
  var object = JSON.parse(val);

  const handleSubmitForm = (event) => {
    setTimelineloader(true);
    const payload = {
      billNumber: billNumber,
      poNumber: poNumber,
      paymentMadeDate: paymentDate,
      paidAmount: paidAmount,
      paymentMethod: paymentMethod,
      createdBy: object?.uidx,
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

    if (billStatus === 'PAID') {
      showSnackbar('Bill already Paid', 'error');
      setOpenModal(false);
      setTimelineloader(false);
    } else {
      postPaymentBills(formData)
        .then((res) => {
          showSnackbar('Success Payment Made', 'success');
          setPaysum(!paysum);
          setTimelineloader(false);
          setOpenModal(false);
          window.location.reload(true);
        })
        .catch((err) => {
          setTimelineloader(false);
          showSnackbar(err?.response?.data?.message, 'error');
          setOpenModal(false);
        });
    }
  };

  //vendor--name

  const [vendorName, setVendorName] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingTerm, setshippingTerm] = useState('');
  const [paymentTerm, setpaymentTerm] = useState('');
  const [comment, setCommet] = useState('');

  useEffect(() => {
    setTimelineloader(true);
    vendorData();
  }, []);

  const vendorData = () => {
    getvendorName(poNumber).then((res) => {
      setVendorName(res?.data?.data);
      setshippingTerm(res?.data?.data?.shippingTerms);
      setpaymentTerm(res?.data?.data?.paymentTerms);
      setShippingMethod(res?.data?.data?.shippingMethod);
      setCommet(res?.data?.data?.comments);
      setTimelineloader(false);
      setTimelineStatus(res?.data?.data?.status);
      setAssignedTo(res?.data?.data?.assignedToList);
    });
  };

  //pdf download function

  const handleClickpdf = async () => {
    setTimelineloader(true);
    try {
      const response = await downloadOrderspdf(poNumber);
      if (response?.status === 200) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${poNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimelineloader(false);
      } else {
        const responseData = await response.json();
        showSnackbar(responseData?.message || 'Some error occurred', 'error');
        setOpenModal(false);
        setTimelineloader(false);
      }
    } catch (error) {
      showSnackbar(error?.res?.data?.message, 'error');
      setTimelineloader(false);
    }
  };

  //get all bills for paticular P.O
  const payload = {
    poNumber: [poNumber],
  };
  const [datRowsbill, setTableRowsBill] = useState([]);
  let dataArr,
    dataRow = [];

  useEffect(() => {
    postbillgeneratedDetails(payload).then((res) => {
      dataArr = res.data.data;
      dataRow.push(
        dataArr?.purchaseOrderBillList?.map((row) => ({
          value: row?.billNumber || '',
          label: row?.billNumber || '',
          bill: row?.billNumber || '',
          balance: row?.balance || '',
          poNumber: row?.poNumber || '',
          status: row?.status || '',
        })),
      );
      setTableRowsBill(dataRow[0]);
    });
  }, []);

  //mobile functionlatiy

  const isMobileDevice = isSmallScreen();

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const columns = [
    {
      field: 'item',
      headerName: 'Item',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            {
              <Tooltip title={params?.row?.itemNo}>
                <InfoOutlinedIcon color="info" fontSize="small" />
              </Tooltip>
            }
            {params?.value}
          </div>
        );
      },
    },
    {
      field: 'unit_price',
      headerName: 'Unit Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'Specification',
      headerName: 'Specification',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 50,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'PO_Ordered',
      headerName: 'PO Ordered',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'purchase_price',
      headerName: 'Purchase Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'tax',
      headerName: 'Tax',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'Amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  useEffect(() => {
    const updatedRow = itemData.map((e) => {
      return {
        uniqueId: uuidv4(),
        id: e?.id,
        itemNo: e?.itemNo,
        item: e?.itemName,
        unit_price: e?.unitPrice || 0,
        Specification: e?.specification || 0,
        PO_Ordered: e?.quantityOrdered || 0,
        purchase_price: e?.purchasePrice || 0,
        tax: e?.gst || 0,
        Amount: e?.finalPrice || 0,
      };
    });
    setRowData(updatedRow);
  }, [itemData]);

  function capitalizeWords(str) {
    // Split the string into an array of words
    const words = str.split(' ');

    // Capitalize the first letter of each word
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // Join the words back into a string
    const result = capitalizedWords.join(' ');

    return result;
  }

  function displayFirstWordWithEllipsis(str) {
    // Split the string into an array of words
    const words = str.split(' ');

    // Take the first word
    let firstWord = words[0];

    // If there are more words, append "..."
    if (words.length > 1) {
      firstWord += '...';
    }

    return firstWord;
  }

  const processedShippingMethod = displayFirstWordWithEllipsis(capitalizeFirstLetter(shippingTerm));
  // console.log(processedShippingMethod);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'PO Details'} prevLink={true} />
        </SoftBox>
      )}
      <SoftBox className={`${isMobileDevice && 'mobile-header-fix po-box-shadow'}`}>
        <SoftBox className={`bills-details-top-box ${isMobileDevice && 'bills-details-top-mob'}`}>
          <SoftBox className={`${isMobileDevice ? 'bills-details-inner-left-mob' : 'bills-details-inner-left-box '}`}>
            {vendorName === '' ? (
              <SoftTypography className="bills-details-typo">{poNumber}</SoftTypography>
            ) : !isMobileDevice ? (
              <SoftTypography className="bills-details-typo">
                {vendorName?.vendorName}-{poNumber}
              </SoftTypography>
            ) : (
              <Stack alignItems="center" gap={'5px'} direction={'row'}>
                <SoftTypography className="bills-details-typo bills-details-typo-mob">{poNumber}</SoftTypography>
                <SoftTypography className="vendorname-po-det">{`(${vendorName?.vendorName})`}</SoftTypography>
              </Stack>
            )}
          </SoftBox>

          {permissions?.RETAIL_Purchase?.WRITE ||
          permissions?.WMS_Purchase?.WRITE ||
          permissions?.VMS_Purchase?.WRITE ? (
            <SoftBox
              className={`${isMobileDevice ? 'bills-details-inner-right-box-mob' : 'bills-details-inner-right-box'} `}
            >
              {!isMobileDevice &&
                (timelineStatus !== 'CREATED' ? (
                  <Box display="flex" gap="10px">
                    <SoftButton
                      variant={buttonStyles.secondaryVariant}
                      className="outlined-softbutton"
                      onClick={handleBill}
                    >
                      <AddIcon />
                      Bill
                    </SoftButton>

                    <SoftButton
                      className="vendor-add-btn contained-softbutton"
                      variant={buttonStyles.primaryVariant}
                      onClick={handleOpenModal}
                    >
                      <AddIcon />
                      Payment
                    </SoftButton>
                  </Box>
                ) : null)}
              {/* Laptop Modal */}
              {!isMobileDevice && (
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
                              <input
                                type="file"
                                name="file"
                                id="my-file"
                                className="hidden"
                                onChange={handleFileChange}
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
                          <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                            cancel
                          </SoftButton>
                          <SoftButton className="vendor-add-btn" onClick={handleSubmitForm}>
                            save
                          </SoftButton>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              )}
              {/* Mobile Drawer */}
              {isMobileDevice && (
                <Drawer open={openModal} onClose={handleCloseModal} className="modal-pi-border" anchor="right">
                  <SoftButton
                    className="back-icon-button"
                    onClick={handleCloseModal}
                    sx={{ backgroundColor: 'white !important' }}
                  >
                    <ArrowBackIosNewIcon className="back-icon-navbar" />
                  </SoftButton>
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
                            <input
                              type="file"
                              name="file"
                              id="my-file"
                              className="hidden"
                              onChange={handleFileChange}
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
                      <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                        cancel
                      </SoftButton>
                      <SoftButton className="vendor-add-btn" onClick={handleSubmitForm}>
                        save
                      </SoftButton>
                    </SoftBox>
                  </Box>
                </Drawer>
              )}
              <SoftBox className="st-dot-box-I" onClick={handleMenu}>
                <MoreVertIcon />
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
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleApprove}>Approve</MenuItem>
                <MenuItem onClick={handleReject}>Reject</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                <MenuItem onClick={handleReject1}>Convert to open</MenuItem>
                {/* <MenuItem onClick={() => GoToPiForm()}>Edit</MenuItem> */}
                <MenuItem onClick={handleClickpdf}>Export as PDF</MenuItem>
              </Menu>
              <SoftBox>
                {!isMobileDevice ? (
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
                        <SoftButton className="vendor-second-btn" onClick={handleCloseModal1}>
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
                          <SoftButton className="vendor-add-btn" onClick={handleApproved}>
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
                          <SoftButton color="info" variant="gradient" className="vendor-add-btn picancel-btn">
                            <CircularProgress
                              size={24}
                              sx={{
                                color: '#fff',
                              }}
                            />
                          </SoftButton>
                        ) : (
                          <SoftButton className="vendor-add-btn picancel-btn" onClick={handleApproved}>
                            Save
                          </SoftButton>
                        )}
                      </SoftBox>
                    </Box>
                  </MobileDrawerCommon>
                )}
              </SoftBox>
              <SoftBox>
                {!isMobileDevice ? (
                  <Modal
                    open={openModal2}
                    onClose={handleCloseModal2}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box className="pi-approve-menu-1">
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                        Purchase order rejected cannot be revoked. Are you sure you want to reject?
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
                        onChange={(e) => setRejectionReason(e.value)}
                        options={[
                          { value: 'Dummy PO', label: 'Dummy PO' },
                          { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                          { value: 'Needs revision', label: 'Needs revision' },
                          { value: 'Price change', label: 'Price change' },
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
                          <SoftButton className="vendor-add-btn" onClick={handleRejection}>
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
                    drawerOpen={openModal2}
                    drawerClose={handleCloseModal2}
                    overflowHidden={true}
                  >
                    <Box className="pi-approve-menu-1-mobile">
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2" className="rejected-title">
                        Purchase order rejected cannot be revoked. Are you sure you want to reject?
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
                          <SoftButton className="vendor-add-btn picancel-btn" onClick={handleRejection}>
                            Save
                          </SoftButton>
                        )}
                      </SoftBox>
                    </Box>
                  </MobileDrawerCommon>
                )}
              </SoftBox>
              <SoftBox>
                {!isMobileDevice ? (
                  <Modal
                    open={openModal4}
                    onClose={handleCloseModal4}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box className="pi-approve-menu">
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure you want to convert PO.
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
                        onChange={(e) => setConvertopen(e.value)}
                        options={[
                          { value: 'Inward mismatched', label: 'Inward mismatched' },
                          { value: 'Bill mismatched', label: 'Bill mismatched' },
                          { value: 'Others', label: 'Others' },
                        ]}
                      />
                      <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                        <SoftButton className="vendor-second-btn" onClick={handleCloseModal4}>
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
                          <SoftButton className="vendor-add-btn" onClick={handletransitsave}>
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
                    drawerOpen={openModal4}
                    drawerClose={handleCloseModal4}
                    overflowHidden={true}
                  >
                    <Box className="pi-approve-menu-1-mobile-po">
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure you want to convert PO.
                      </SoftTypography>
                      <SoftBox className="reason-main-div-po">
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                          fontSize="13px"
                          sx={{
                            textAlign: 'start',
                            whiteSpace: 'break-spaces',
                          }}
                        >
                          Reason
                        </SoftTypography>
                        <SoftSelect
                          defaultValue={{ value: '', label: '' }}
                          onChange={(e) => setConvertopen(e.value)}
                          options={[
                            { value: 'Inward mismatched', label: 'Inward mismatched' },
                            { value: 'Bill mismatched', label: 'Bill mismatched' },
                            { value: 'Others', label: 'Others' },
                          ]}
                          menuPlacement="top"
                          sx={{
                            width: '100% !important',
                          }}
                        />
                      </SoftBox>

                      <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                        <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal4}>
                          Cancel
                        </SoftButton>
                        {timelineloader ? (
                          <SoftButton color="info" variant="gradient" className="vendor-second-btn picancel-btn">
                            <CircularProgress
                              size={24}
                              sx={{
                                color: '#fff',
                              }}
                            />
                          </SoftButton>
                        ) : (
                          <SoftButton className="vendor-add-btn picancel-btn" onClick={handletransitsave}>
                            Save
                          </SoftButton>
                        )}
                      </SoftBox>
                    </Box>
                  </MobileDrawerCommon>
                )}
              </SoftBox>
              <SoftBox>
                {!isMobileDevice ? (
                  <Modal
                    open={openModal3}
                    onClose={handleCloseModal3}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box className="pi-approve-menu-1">
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure you want to delete this.
                      </SoftTypography>
                      <SoftSelect
                        defaultValue={{ value: '', label: '' }}
                        onChange={(e) => setDeleteReason(e.value)}
                        options={[
                          { value: 'Dummy PO', label: 'Dummy PO' },
                          { value: 'Wrong data', label: 'Wrong data' },
                          { value: 'No longer required', label: 'No longer required' },
                          { value: 'Others', label: 'Others' },
                        ]}
                      />
                      <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                        <SoftButton className="vendor-second-btn" onClick={handleCloseModal3}>
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
                          <SoftButton className="vendor-add-btn" onClick={handleDeleterequest}>
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
                    drawerOpen={openModal3}
                    drawerClose={handleCloseModal3}
                    overflowHidden={true}
                  >
                    <Box className="pi-approve-menu-1-mobile">
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2" m={1}>
                        Are you sure you want to delete this.
                      </SoftTypography>
                      <SoftBox className="reason-main-div-po">
                        <SoftSelect
                          defaultValue={{ value: '', label: '' }}
                          onChange={(e) => setDeleteReason(e.value)}
                          options={[
                            { value: 'Dummy PO', label: 'Dummy PO' },
                            { value: 'Wrong data', label: 'Wrong data' },
                            { value: 'No longer required', label: 'No longer required' },
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
                          <SoftButton className="vendor-add-btn picancel-btn" onClick={handleDeleterequest}>
                            Save
                          </SoftButton>
                        )}
                      </SoftBox>
                    </Box>
                  </MobileDrawerCommon>
                )}
              </SoftBox>
            </SoftBox>
          ) : null}
        </SoftBox>
        {isMobileDevice && (
          <SoftBox className="pi-det-button-div" mt={0}>
            {permissions?.RETAIL_Purchase?.WRITE ||
            permissions?.WMS_Purchase?.WRITE ||
            permissions?.VMS_Purchase?.WRITE ? (
              <SoftBox className="pi-det-btn-mob">
                {timelineStatus !== 'CREATED' ? (
                  <Box display="flex" gap="10px" className="pi-det-btn-mob">
                    <SoftButton className="vendor-second-btn pi-det-btn-mob no-btn-padding" onClick={handleBill}>
                      <AddIcon />
                      Bill
                    </SoftButton>

                    <SoftButton className="vendor-add-btn pi-det-btn-mob no-btn-padding" onClick={handleOpenModal}>
                      <AddIcon />
                      Payment
                    </SoftButton>
                  </Box>
                ) : null}
              </SoftBox>
            ) : null}
          </SoftBox>
        )}
      </SoftBox>
      {isMobileDevice && (
        <SoftBox className="pi-timeline-accord-main-div" sx={{ top: timelineStatus !== 'CREATED' ? '180px' : '136px' }}>
          <Accordion className="pi-timeline-accord">
            <AccordionSummary className="pi-timeline-accordion" expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={'12px'}>P.I Timeline</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {!timelineloader ? <TimelineList title="P.O Timeline">{renderTimelineItems}</TimelineList> : <Spinner />}
            </AccordionDetails>
          </Accordion>
        </SoftBox>
      )}

      <SoftBox my={3}>
        {isMobileDevice && (
          <SoftBox sx={{ marginBottom: '20px' }}>
            <Typography fontSize="1rem" fontWeight={700} sx={{ marginLeft: '10px' }}>
              Purchase Order Info
            </Typography>
            <SplideCommon title={''} showFilter={false}>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ fontWeight: 'medium', text: 'Advance Made' }}
                  count={advancemade}
                  icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                  direction="left"
                />
              </SplideSlide>
              <SplideSlide>
                {exdate?.length !== 0 ? (
                  <MiniStatisticsCard
                    title={{ fontWeight: 'medium', text: 'Expected Delivery' }}
                    count={exdate}
                    // count={new Date(exdate).toLocaleDateString('en-GB')}
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                ) : (
                  <MiniStatisticsCard
                    title={{ fontWeight: 'medium', text: 'Expected Delivery' }}
                    count="-----"
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                )}
              </SplideSlide>
              <SplideSlide>
                <Tooltip title={shippingTerm}>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'medium', text: 'Shipping Terms' }}
                    count={processedShippingMethod}
                    icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                    direction="left"
                  />
                </Tooltip>
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ fontWeight: 'medium', text: 'Shipping Method' }}
                  count={capitalizeFirstLetter(shippingMethod)}
                  icon={{ color: 'dark', component: 'public' }}
                  direction="left"
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ fontWeight: 'medium', text: 'Returns' }}
                  count={`₹ ${returnMade}`}
                  percentage={{ color: 'success' }}
                  icon={{ color: 'dark', component: 'storefront' }}
                  direction="left"
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ fontWeight: 'medium', text: 'Payment Terms' }}
                  count={dateFormatter(paymentTerm)}
                  // count={new Date(paymentTerm).toLocaleDateString('en-GB')}
                  icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                  direction="left"
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ fontWeight: 'medium', text: 'Inward Status' }}
                  count={inward}
                  icon={{ color: 'dark', component: 'emoji_events' }}
                  direction="left"
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Approved by' }}
                  count={capitalizeWords(resAssign)}
                  icon={{ color: 'dark', component: <PersonIcon /> }}
                  direction="left"
                />
              </SplideSlide>
            </SplideCommon>
          </SoftBox>
        )}
        {isMobileDevice && (
          <>
            <Typography fontSize="1rem" fontWeight={700} sx={{ marginLeft: '10px', marginBottom: '16px' }}>
              Product Details
            </Typography>
            <SoftBox className="pi-details-prdt-main-div po-box-shadow">
              {/* <Typography fontSize="1rem" fontWeight={500} mb={2}>
              Product Details
            </Typography> */}
              <SoftBox>
                {itemData?.map((item, index) => (
                  <PODetailsCard data={item} index={index} />
                ))}
              </SoftBox>
            </SoftBox>
          </>
        )}
        <Grid container spacing={3}>
          {!isMobileDevice && (
            <Grid item xs={12} md={4} lg={3}>
              {!timelineloader ? <TimelineList title="P.O Timeline">{renderTimelineItems}</TimelineList> : <Spinner />}
            </Grid>
          )}

          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                {dueDate === 0 ? (
                  <SoftBox mb={3}>
                    <AnimatedStatisticsCard
                      title="PO value"
                      count={poValue}
                      percentage={{
                        color: 'dark',
                        label: 'No Due Date',
                      }}
                      action={{
                        type: 'internal',
                        route: '',
                        label: '',
                      }}
                    />
                  </SoftBox>
                ) : (
                  <SoftBox mb={3}>
                    <AnimatedStatisticsCard
                      title="PO value"
                      count={poValue}
                      percentage={{
                        color: 'dark',
                        label: `${dueDate}`,
                      }}
                      action={{
                        type: 'internal',
                        route: '',
                        label: 'In Progress',
                      }}
                    />
                  </SoftBox>
                )}
              </Grid>
              {!isMobileDevice && (
                <Grid item xs={12} md={6} lg={4}>
                  <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ fontWeight: 'medium', text: 'Advance Made' }}
                      count={advancemade}
                      icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                      direction="left"
                    />
                  </SoftBox>
                  {exdate?.length !== 0 ? (
                    <SoftBox mb={3}>
                      <MiniStatisticsCard
                        title={{ fontWeight: 'medium', text: 'Expected Delivery' }}
                        count={exdate}
                        // count={new Date(exdate).toLocaleDateString('en-GB')}
                        icon={{ color: 'dark', component: 'public' }}
                        direction="left"
                      />
                    </SoftBox>
                  ) : (
                    <SoftBox mb={3}>
                      <MiniStatisticsCard
                        title={{ fontWeight: 'medium', text: 'Expected Delivery' }}
                        count="-----"
                        icon={{ color: 'dark', component: 'public' }}
                        direction="left"
                      />
                    </SoftBox>
                  )}

                  <SoftBox mb={3}>
                    <Tooltip title={shippingTerm}>
                      <MiniStatisticsCard
                        title={{ fontWeight: 'medium', text: 'Shipping Terms' }}
                        count={processedShippingMethod}
                        icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                        direction="left"
                      />
                    </Tooltip>
                  </SoftBox>
                  <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ fontWeight: 'medium', text: 'Shipping Method' }}
                      count={capitalizeFirstLetter(shippingMethod)}
                      icon={{ color: 'dark', component: 'public' }}
                      direction="left"
                    />
                  </SoftBox>
                </Grid>
              )}
              {!isMobileDevice && (
                <Grid item xs={12} md={6} lg={4}>
                  <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ fontWeight: 'medium', text: 'Returns' }}
                      count={`₹ ${returnMade}`}
                      percentage={{ color: 'success' }}
                      icon={{ color: 'dark', component: 'storefront' }}
                      direction="left"
                    />
                  </SoftBox>
                  <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ fontWeight: 'medium', text: 'Payment Terms' }}
                      count={dateFormatter(paymentTerm)}
                      // count={new Date(paymentTerm).toLocaleDateString('en-GB')}
                      icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                      direction="left"
                    />
                  </SoftBox>
                  <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ fontWeight: 'medium', text: 'Inward Status' }}
                      count={inward}
                      icon={{ color: 'dark', component: 'emoji_events' }}
                      direction="left"
                    />
                  </SoftBox>
                  <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ color: 'info', fontWeight: 'medium', text: 'Approved by' }}
                      count={capitalizeWords(resAssign)}
                      icon={{ color: 'dark', component: <PersonIcon /> }}
                      direction="left"
                    />
                  </SoftBox>
                </Grid>
              )}
            </Grid>
          </Grid>
          <br />
          {!isMobileDevice && (
            <Grid item xs={12}>
              <SoftBox className="items-quan-box">
                <SoftTypography className="bills-details-typo">
                  List of Products Ordered (Total No: {itemData?.length})
                </SoftTypography>
                {/* <table>
                    <thead className="tr-tet">
                      <tr>
                        <th className="th-text">Item</th>
                        <th className="th-text">Unit Price</th>
                        <th className="th-text">Specification</th>
                        <th className="th-text">PO Ordered</th>
                        <th className="th-text">Purchase Price</th>
                        <th className="th-text">Tax</th>
                        <th className="th-text">Amount</th>
                      </tr>
                    </thead>
                    {itemData.map((e) => {
                      return (
                        <>
                          <tbody className="jio">
                            <tr>
                              {e.itemNo !== 0 ? (
                                <td className="tdd-text">
                                  <SoftBox key={e.id} className="gold">
                                    {e?.offerType || e?.purchasePrice === 0 ? (
                                      <span
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'flex-start',
                                        }}
                                      >
                                        <Tooltip title={e.itemNo}>
                                          <InfoOutlinedIcon
                                            color="info"
                                            sx={{
                                              marginRight: '5px',
                                            }}
                                          />
                                        </Tooltip>
                                        <span
                                          style={{
                                            whiteSpace: 'nowrap',
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => navigate(`/products/all-products/details/${e.itemNo}`)}
                                        >
                                          <Tooltip title={e.itemName} placement="bottom">
                                            {e.itemName}
                                          </Tooltip>
                                        </span>
                                        <Tooltip title={e.offerType || 'FREE PRODUCTS'}>
                                          <LocalOfferIcon
                                            color="success"
                                            sx={{
                                              marginLeft: '5px',
                                            }}
                                          />
                                        </Tooltip>
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'flex-start',
                                        }}
                                      >
                                        <Tooltip title={e.itemNo}>
                                          <InfoOutlinedIcon
                                            color="info"
                                            sx={{
                                              marginRight: '5px',
                                            }}
                                          />
                                        </Tooltip>
                                        <span
                                          style={{
                                            whiteSpace: 'nowrap',
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => navigate(`/products/all-products/details/${e.itemNo}`)}
                                        >
                                          <Tooltip title={e.itemName} placement="bottom">
                                            {e.itemName}
                                          </Tooltip>
                                        </span>
                                      </span>
                                    )}
                                  </SoftBox>
                                </td>
                              ) : (
                                <td className="tdd-text">
                                  <SoftBox key={e.id} className="gold">
                                    -----
                                  </SoftBox>
                                </td>
                              )}
                              <td>
                                <SoftBox className="gold">{e.unitPrice || 0}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.specification || 0}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.quantityOrdered || 0}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.purchasePrice || 0}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.gst || 0}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.finalPrice || 0}</SoftBox>
                              </td>
                            </tr>
                          </tbody>
                        </>
                      );
                    })}
                  </table> */}
                <SoftBox style={{ height: 375, width: '100%' }} className="dat-grid-table-box">
                  <DataGrid
                    rows={rowData}
                    columns={columns}
                    getRowId={(row) => row.uniqueId}
                    pagination
                    autoPageSize
                    disableSelectionOnClick
                    onCellClick={(params) => navigate(`/products/all-products/details/${params.row.itemNo}`)}
                  />
                </SoftBox>
              </SoftBox>
            </Grid>
          )}
          {/* {!isMobileDevice && (
              <Grid item xs={12}>
                <SoftBox className="comment-box-pi">
                  <SoftTypography className="comment-text-pi">Comments -- {comment}</SoftTypography>
                </SoftBox>
              </Grid>
            )} */}
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};
