// Soft UI Dashboard PRO React components
import './pb.css';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AnimatedStatisticsCard from 'examples/Cards/StatisticsCards/AnimatedStatisticsCard';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import FormField from 'layouts/ecommerce/purchase-bills/components/FormField/index';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MiniStatisticsCard from 'examples/Cards/StatisticsCards/MiniStatisticsCard';
import Modal from '@mui/material/Modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import TimelineItem from './TimelineItem';
import TimelineList from 'examples/Timeline/TimelineList';
import UploadFileIcon from '@mui/icons-material/UploadFile';
// General page components
// Data
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  approvebillpost,
  billdelete,
  billsDeatilspagedata,
  billtimelinedetailsO,
  getPurchaseordernumber,
  getvendorNameBill,
  postPaymentBills,
  postRefundBills,
  rejectbillpost,
  vieworderspdf,
} from '../../../../../config/Services';
import { buttonStyles } from '../../../Common/buttonColor';
import { dateFormatter } from '../../../Common/CommonFunction';
import { format } from 'date-fns';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import EditIcon from '@mui/icons-material/Edit';
import Spinner from '../../../../../components/Spinner';

export const PurchaseBillsDetailsPage = () => {
  const { id } = useParams();
  const showSnackbar = useSnackbar();
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [selectedImages, setSelectedImages] = useState('');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [comArr, setComArr] = useState([]);
  const [time, setTime] = useState(Date());

  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [datRowsBills, setTableRowsBills] = useState([]);
  const [adi, setAdi] = useState(false);
  const [rejo, setRezo] = useState(false);
  const [dele, setDele] = useState(false);
  const [paysum, setPaysum] = useState(false);
  const [ref, setRef] = useState(false);

  useEffect(() => {
    billtimelinedetailsO(id)
      .then((res) => {
        setTableRowsBills(res?.data?.data?.timelines);
        setTimelineloader(false);
      })
      .catch((err) => {
        setTimelineloader(false);
      });
  }, [adi, rejo, dele, paysum, ref]);

  const renderTimelineItems = datRowsBills.map(({ logType, status, updatedOn, updatedBy, docId }) => (
    <TimelineItem
      key={updatedOn}
      updatedOn={updatedOn}
      updatedBy={updatedBy}
      status={status}
      logType={logType}
      docId={docId}
      color={
        status == 'Created'
          ? 'info'
          : status == 'Accepted'
          ? 'success'
          : status == 'Recorded'
          ? 'success'
          : status == 'Successful'
          ? 'success'
          : 'error'
      }
      icon="archive"
    />
  ));

  const [openModal, setOpenModal] = useState(false);
  const [refundmodal, setRefundModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRefundOpen = () => {
    setRefundModal(true);
  };
  const handleRefundclose = () => {
    setRefundModal(false);
  };

  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);

  // const handleOpenModal1 = () =>
  const handleCloseModal1 = () => setOpenModal1(false);

  const handleApprove = () => {
    setOpenModal1(true);
    setAnchorEl(null);
  };

  const handleCloseModal2 = () => setOpenModal2(false);

  const handleReject = () => {
    setOpenModal2(true);
    setAnchorEl(null);
  };

  const handleCloseModal3 = () => setOpenModal3(false);

  const handleDelete = () => {
    setOpenModal3(true);
    setAnchorEl(null);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Payment ID',
      minWidth: 120,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },

    {
      field: 'date',
      headerName: 'PAYMENT DATE',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 0.75,
    },
    {
      field: 'mode',
      headerName: 'PAYMNET MODE',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 160,
      flex: 0.75,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
  ];

  const handleClickview = async (id) => {
    setTimelineloader(true);
    try {
      const response = await vieworderspdf(id);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.location.reload(true);
    } catch (err) {}
  };

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];

  const [billvalue, setBillvalue] = useState('');
  const [billduedate, setBilldueDate] = useState('');
  const [paymentsMade, setpaymentsMade] = useState('');
  const [refundableAmount, setrefundableAmount] = useState('');
  const [lastPaymentMadeDate, setLastPaymentMadeDate] = useState('');
  const [totalPayments, settotalPayments] = useState('');
  const [balance, setBalance] = useState('');
  const [deliveryStatus, setdeliveryStatus] = useState('');
  const [billStatus, setBillStatus] = useState('');
  const [expectedDeliveryInDays, setexpectedDeliveryInDays] = useState('');
  const [balanceDueIn, setbalanceDueIn] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    billsDetails();
  }, []);

  const billsDetails = () => {
    billsDeatilspagedata(id).then((res) => {
      setBillvalue(res?.data?.data?.billValue);
      setBilldueDate(res?.data?.data?.billDueDate);
      setpaymentsMade(res?.data?.data?.paymentsMade);
      setLastPaymentMadeDate(res?.data?.data?.lastPaymentMadeDate);
      settotalPayments(res?.data?.data?.totalPayments);
      setBalance(res?.data?.data?.balance);
      setBillStatus(res?.data?.data?.billStatus);
      setdeliveryStatus(res?.data?.data?.deliveryStatus);
      setexpectedDeliveryInDays(res?.data?.data?.expectedDeliveryInDays);
      setbalanceDueIn(res?.data?.data?.balanceDueIn);

      dataArr = res?.data?.data;
      dataRow.push(
        dataArr?.poPaymentMadeEntityList?.map((row) => ({
          id: row.paymentId,
          date: row.createdOn ? row.createdOn : '-----',
          mode: row.paymentMethod ? row.paymentMethod : '-----',
          amount: row.paidAmount ? row.paidAmount : '-----',
        })),
      );
      setTableRows(dataRow[0]);
    });
  };

  const [timelineloader, setTimelineloader] = useState(true);

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  async function handleApprovebill() {
    setTimelineloader(true);
    const payload = {
      billNumber: id,
      poBillStatus: 'ACCEPTED',
      poBillEvents: 'ACCEPT',
      comments: 'string',
      updatedBy: object?.uidx,
    };
    try {
      const result = await approvebillpost(payload);
      showSnackbar('Success Bill Approved', 'success');
      setAdi(!adi);
      setOpenModal1(false);
      billsDetails();
    } catch (err) {
      showSnackbar(err.response.data.message, 'error');

      setOpenModal1(false);
      setTimeout(() => {
        setTimelineloader(false);
      }, []);
    }
  }

  const [rejectionreason, setRejectionReason] = useState('');
  async function handleRejectBill() {
    setTimelineloader(true);
    const payload = {
      billNumber: id,
      poBillStatus: 'REJECTED',
      poBillEvents: 'REJECT',
      comments: rejectionreason,
      updatedBy: object?.uidx,
    };
    try {
      const result = await rejectbillpost(payload);
      showSnackbar('Success Bill Rejected', 'success');
      setRezo(!rejo);
      setOpenModal2(false);
    } catch (err) {
      showSnackbar(err.response.data.message, 'error');

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
      billNumber: id,
      userId: object?.uidx,
      reason: reason,
    };
    await billdelete(payload)
      .then((res) => {
        showSnackbar(res.data.data.message, 'success');
        setDele(!dele);
        setOpenModal3(false);
        navigate('/purchase/purchase-bills');
      })
      .catch((err) => {
        showSnackbar(err.response.data.message, 'error');

        setOpenModal3(false);
        setTimeout(() => {
          setTimelineloader(false);
        }, []);
      });

    setOpenModal3(false);
    setTimelineloader(false);
  }

  const [billvendorname, setBillvendorName] = useState('');
  useEffect(() => {
    getvendorNameBill(id).then((res) => {
      setBillvendorName(res.data.data);
    });
  }, []);

  const [poNumber, setpoNumber] = useState('');

  useEffect(() => {
    getPurchaseordernumber(id).then((res) => {
      setpoNumber(res.data.data.poNumber);
      setComment(res?.data?.data?.comments);
      setrefundableAmount(res?.data?.data?.refundableAmount);
    });
  }, []);

  //file upload
  const [paymentDate, setPaymentDate] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [sum, setSum] = useState();

  const handleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);
  };

  const handleSubmitForm = (event) => {
    setTimelineloader(true);
    const payload = {
      billNumber: id,
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

    if (billStatus === 'CREATED') {
      showSnackbar('Bill needs to be approved', 'error');
      setOpenModal(false);
      setTimelineloader(false);
    } else {
      postPaymentBills(formData)
        .then((res) => {
          showSnackbar('Success Payment Made', 'success');
          setPaysum(!paysum);
          setTimelineloader(false);
          setOpenModal(false);
          billsDetails();
          // window.location.reload(true)
        })
        .catch((err) => {
          showSnackbar(err.response.data.message, 'error');
          setTimelineloader(false);
          setOpenModal(false);
        });
    }
  };

  const [refundAmount, setRefundAmount] = useState('');
  const [refundMethod, setRefundMethod] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundDate, setRefundDate] = useState('');

  const userName = localStorage.getItem('user_name');

  const handleSubmitFormRefund = (event) => {
    setTimelineloader(true);
    const payload = {
      billNumber: id,
      poNumber: poNumber,
      createdBy: object?.uidx,
      refundDate: refundDate,
      refundAmount: refundAmount,
      refundMethod: refundMethod,
      reason: refundReason,
      comments: 'string',
    };
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedImages);
    formData.append(
      'refund',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    postRefundBills(formData)
      .then((res) => {
        showSnackbar('Success Refund Made', 'success');
        setRef(!ref);
        setTimelineloader(false);
        setRefundModal(false);
        billsDetails();
      })
      .catch((err) => {
        showSnackbar(err.response.data.message, 'error');
        setTimelineloader(false);
        setRefundModal(false);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <SoftBox className="bills-details-top-box">
        <Grid container spacing={3}>
          <Grid item xs={12} xl={4}>
            <SoftBox className="bills-details-inner-left-box-opppd">
              <SoftTypography className="bills-details-typo">
                {billvendorname.vendorName} - {id}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
        {permissions?.RETAIL_Purchase?.WRITE || permissions?.WMS_Purchase?.WRITE || permissions?.VMS_Purchase?.WRITE ? (
          <SoftBox className="bills-details-inner-right-box-pi-details-page-navbar-bills-details">
            <SoftButton
              variant={buttonStyles.secondaryVariant}
              className="outlined-softbutton"
              onClick={handleOpenModal}
            >
              <AddIcon /> Payment
            </SoftButton>
            {/* <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton vendor-add-btn"
              onClick={handleRefundOpen}
            >
              <AddIcon /> Refund
            </SoftButton> */}
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
                      {id}
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
                        save
                      </SoftButton>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Box>
            </Modal>

            {/* refund modal */}
            <Modal
              open={refundmodal}
              onClose={handleRefundclose}
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
                      {id}
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftTypography fontSize="12px">
                      <b>P.O No:</b> {poNumber}{' '}
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftTypography fontSize="12px">
                      <b>Refundable Amount: </b>
                      {refundableAmount}{' '}
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormField
                      type="number"
                      label="Amount"
                      placeholder="Rs"
                      onChange={(e) => setRefundAmount(e.target.value)}
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
                        onChange={(date) => setRefundDate(format(date.$d, 'yyyy-MM-dd'))}
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
                        Refund Mode
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      options={[
                        { value: 'Credit Note', label: 'Credit Note' },
                        { value: 'bank transfer', label: 'Bank Transfer' },
                      ]}
                      onChange={(e) => setRefundMethod(e.value)}
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
                        Refund Reason
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      options={[
                        { value: 'Damaged Package', label: 'Damaged Package' },
                        { value: 'Poor Quality', label: 'Poor Quality' },
                        { value: 'Used Product', label: 'Used Product' },
                        { value: 'Missing Item', label: 'Missing Item' },
                        { value: 'Less quantity', label: 'Less quantity' },
                      ]}
                      onChange={(e) => setRefundReason(e.value)}
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
                        onClick={handleRefundclose}
                      >
                        cancel
                      </SoftButton>
                      <SoftButton
                        variant={buttonStyles.primaryVariant}
                        className="contained-softbutton vendor-add-btn"
                        onClick={handleSubmitFormRefund}
                      >
                        save
                      </SoftButton>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Box>
            </Modal>

            {/* <SoftButton className="pb-details-more" onClick={handleMenu}>More <ArrowDropDownIcon /></SoftButton> */}

            <SoftBox className="st-dot-box-I" onClick={handleMenu}>
              <MoreVertIcon />
            </SoftBox>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              className="menu-bar-box"
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleApprove}>Approve</MenuItem>
              <MenuItem onClick={handleReject}>Reject</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

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
                      Save
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
            </SoftBox>
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
                      Save
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
            </SoftBox>
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
                      Save
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
            </SoftBox>
          </SoftBox>
        ) : null}
      </SoftBox>
      <SoftBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} ld={12} xl={4}>
            {!timelineloader ? <TimelineList title="Bill Timeline">{renderTimelineItems}</TimelineList> : <Spinner />}
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                <SoftBox mb={3}>
                  <AnimatedStatisticsCard
                    title="Bill Value"
                    count={billvalue}
                    percentage={{
                      color: 'dark',
                      label: `Due on ${dateFormatter(billduedate)}`,
                    }}
                    action={{
                      type: 'internal',
                      route: '',
                      label: 'In Progress',
                    }}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ color: 'info', fontWeight: 'medium', text: 'Payments Made' }}
                    count={paymentsMade}
                    percentage={{ color: 'success', text: `on ${dateFormatter(lastPaymentMadeDate)}` }}
                    icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                    direction="left"
                  />
                </SoftBox>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Total Payments' }}
                  count={totalPayments}
                  percentage={{ color: 'success', text: ' recorded' }}
                  icon={{ color: 'dark', component: 'emoji_events' }}
                  direction="left"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ color: 'info', fontWeight: 'medium', text: 'Balance' }}
                    count={balance}
                    percentage={{ color: 'success', text: `Due in ${balanceDueIn} days` }}
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                </SoftBox>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Delivery Status' }}
                  count={deliveryStatus}
                  percentage={{ color: 'success', text: `${expectedDeliveryInDays}` }}
                  icon={{ color: 'dark', component: 'storefront' }}
                  direction="left"
                />
              </Grid>

              {/* <Grid item xs={12} lg={12}>
                <Card sx={{ padding: "15px" }}>
                  <SoftTypography variant="h6">Add Comments</SoftTypography>
                  <SoftBox className="add-comments-box">
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      placeholder="Write down your comments here..."
                      style={{ width: 300, fontSize: "0.8em", padding: "3px" }}
                      onChange={(e) => setCommets(e.target.value)}
                    />
                    <SoftButton className="add-btn" onClick={() => addComment()}>Add</SoftButton>
                  </SoftBox>

                </Card>

              </Grid> */}
              {/* {comArr.length > 0 ?
                <Grid item xs={12} lg={12}>
                  <Card sx={{ padding: "15px" }}>
                    <SoftTypography variant="h6">Comments</SoftTypography>
                    
                    {comArr.map((e, i) => {
                      return (
                        <SoftBox key={e + i} mb={2} display="flex">
                          <SoftBox pt={1.5} mr={1}>
                            <SoftTypography varinat="p" fontSize="15px">{i + 1}.</SoftTypography>
                          </SoftBox>

                          <Card sx={{ padding: "15px" }}>
                            <SoftTypography varinat="p" fontSize="15px">Created By : {userName} </SoftTypography>
                            <SoftTypography varinat="p" fontSize="15px">Comment : ${e}</SoftTypography>
                            <SoftTypography varinat="p" fontSize="15px">Created At : {time} </SoftTypography>
                          </Card>
                        </SoftBox>

                      )
                    })}
                  </Card>
                </Grid> : null
              } */}
              {/* <Grid item xs={12}>
                <SoftBox className="comment-box-pi">
                  <SoftTypography className="comment-text-pi">Comments -- {comment}</SoftTypography>
                </SoftBox>
            </Grid> */}
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Card sx={{ padding: '10px' }}>
              <SoftTypography marginLeft="10px" fontSize="14px" fontWeight="bold" varinat="h6">
                Payment Details
              </SoftTypography>

              <Box sx={{ height: 380, width: '100%' }}>
                <DataGrid
                  className="data-grid-table-boxo"
                  rows={datRows}
                  columns={columns}
                  getRowId={(row) => row.id}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};
