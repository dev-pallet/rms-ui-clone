import './purchase-made.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { buttonStyles } from '../Common/buttonColor';
import { format } from 'date-fns';
import {
  getpurchaseorderbyBill,
  postPaymentBills,
  postpurchasemadetable,
  vieworderspdf,
} from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import BottomNavbar from '../../../examples/Navbars/BottomNavbarMob';
import Box from '@mui/material/Box';
import CommonSearchBar from '../Common/MobileSearchBar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FormField from 'layouts/ecommerce/purchase-bills/components/FormField/index';
import Grid from '@mui/material/Grid';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MobileNavbar from '../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import Modal from '@mui/material/Modal';
import NoDataFound from '../Common/No-Data-Found';
import PurchaseMadeCard from './components/purchase-made-card';
import PurchaseMadeFilter from './components/Filter/purchaseMadeFilter';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Purchasemade = () => {
  const [loader, setLoader] = useState(false);
  const showSnackbar = useSnackbar();
  const [onClear, setOnClear] = useState(false);
  const isMobileDevice = isSmallScreen();

  const columns = [
    {
      field: 'createdOn',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
      renderCell: (cellValues) => {
        return <>{dateFormatter(cellValues.value)}</>;
      },
    },
    {
      field: 'id',
      headerName: 'Payment ID',
      minWidth: 110,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'purchaseOrderNo',
      headerName: 'PO Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 0.75,
    },
    {
      field: 'paymentmethod',
      headerName: 'Payment method',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'vendorname',
      headerName: 'Vendor Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'billnumber',
      headerName: 'Bill Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 0.75,
    },

    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 90,
      flex: 0.75,
    },
    {
      field: 'edit',
      headerName: 'View ',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 105,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <>
            <Box className="less-height" ml={2} onClick={() => handleClickview(params.row.docid)}>
              <SoftButton
                variant={buttonStyles.primaryVariant}
                className="contained-softbutton"
                style={{ fontSize: '0.7rem !important' }}
              >
                View
              </SoftButton>
            </Box>
          </>
        );
      },
    },
  ];

  const at = localStorage.getItem('access_token');
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const handleClickview = async (id) => {
    if (id === '-----' || id === null) {
      showSnackbar('No Image or pdf found', 'error');
    } else {
      setLoader(true);
      try {
        const response = await vieworderspdf(id);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoader(false);
      } catch (err) {
        setLoader(false);
      }
    }
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [searchorders, setsearchOrders] = useState('');

  const handleordersearch = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setsearchOrders('');
    } else {
      setsearchOrders(e.target.value);
    }
  };

  // clear payments search input fn
  const handleClearOrderSearch = () => {
    setsearchOrders('');
  };

  const filterObject = {
    orgId: [orgId],
    sourceLocation: [locId],
    paymentMadeSearchInput: searchorders,
  };

  const [datRows, setTableRows] = useState([]);
  const [paysum, setPaysum] = useState(false);
  const [errorComing, setErrorComing] = useState(false);

  let dataArr,
    dataRow = [];
  useEffect(() => {
    setLoader(true);
    paymentMade();
  }, [paysum, searchorders]);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      paymentMade();
      setOnClear(false);
    }
  }, [onClear]);

  let retryPaymnetMade = 0;
  const paymentMade = () => {
    postpurchasemadetable(filterObject)
      .then((res) => {
        if (res.data.data.code === 'ECONNRESET') {
          if (retryPaymnetMade < 3) {
            paymentMade();
            retryPaymnetMade++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setLoader(false);
          }
        } else {
          showSnackbar('Success Payment list', 'success');
          dataArr = res?.data?.data;
          if ((res?.data?.data?.message).trim() === 'No payment made found') {
            setErrorComing(true);
            setLoader(false);
            return;
          }
          dataRow.push(
            dataArr?.poPaymentMadeList?.map((row) => ({
              createdOn: row?.createdOn ? row?.createdOn : '-----',
              id: row?.paymentId ? row?.paymentId : '-----',
              purchaseOrderNo: row?.poNumber ? row?.poNumber : '-----',
              paymentmethod: row?.paymentMethod ? row?.paymentMethod : '-----',
              vendorname: row?.vendorName ? textFormatter(row?.vendorName) : '-----',
              billnumber: row?.billNumber ? row?.billNumber : '-----',
              amount: row?.paidAmount ? row?.paidAmount : '-----',
              docid: row?.docId ? row?.docId : '-----',
            })),
          );
          setTableRows(dataRow[0]);
          setLoader(false);
          setErrorComing(false);
        }
      })
      .catch((err) => {
        if (err?.response?.status === '429') {
          paymentMade();
        } else {
          showSnackbar(err?.response?.data?.message, 'error');
          setLoader(false);
          setErrorComing(true);
        }
      });
  };

  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState([null, null]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const [selectedImages, setSelectedImages] = useState();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const pathname = useParams();

  const [billValue, setBillValue] = useState('');
  const [newPonumber, setNewPoNumber] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [status, setStatus] = useState(false);
  const [newPaymentMode, setNewPaymentMode] = useState();
  const [newDate, setNewDate] = useState('');
  const [billGenerated, setBillGenerated] = useState(false);

  const [verifyloader, setVerifyloader] = useState(false);

  const handleVerifyBill = (billValue) => {
    setVerifyloader(true);

    if (billValue.length === 0) {
      showSnackbar('Enter valid Bill No', 'error');
      setTimeout(() => {
        setVerifyloader(false);
      }, 2000);
    }

    getpurchaseorderbyBill(billValue)
      .then((res) => {
        setBillGenerated(true);
        setNewPoNumber(res?.data?.data?.poNumber);
        setBillAmount(res?.data?.data?.balance);
        if (res?.data?.data?.status === 'PAID') {
          setStatus(true);
        }
        showSnackbar('Success Bill Verified', 'success');
        setVerifyloader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setVerifyloader(false);
      });
  };

  //File -- upload

  const [formLoader, setFormLoader] = useState(false);

  const handleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);
  };

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  const handleSubmitForm = (event) => {
    setFormLoader(true);
    const payload = {
      billNumber: billValue,
      poNumber: newPonumber,
      paymentMadeDate: newDate,
      paidAmount: newAmount,
      paymentMethod: newPaymentMode,
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
    if (!status) {
      postPaymentBills(formData)
        .then((res) => {
          showSnackbar('Success Bill verified', 'success');
          setPaysum(!paysum);
          setFormLoader(false);
          setOpenModal(false);
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
          setOpenModal(false);
          setFormLoader(false);
        });
    } else {
      showSnackbar('Bill already Paid', 'error');
      setOpenModal(false);
      setFormLoader(false);
    }
  };

  return (
    <DashboardLayout>
      {!isMobileDevice ? (
        <DashboardNavbar />
      ) : (
        <SoftBox className="new-search-header po-box-shadow">
          <MobileNavbar title={'Purchase Made'} />
          <CommonSearchBar searchFunction={handleordersearch} placeholder="Search..." handleNewRequired={false} />
        </SoftBox>
      )}
      {formLoader ? (
        <Spinner />
      ) : !isMobileDevice ? (
        <Box
          //  className="table-css-fix-box-scroll-pi"
          className="search-bar-filter-and-table-container"
        >
          <SoftBox
            // className="vendors-filter-div"
            className="search-bar-filter-container"
            // sx={{
            //   display: 'flex',
            //   justifyContent: 'space-between',
            // }}
          >
            {/* search bar filter container starts here */}
            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox sx={{ position: 'relative' }}>
                  <SoftInput
                    className="filter-soft-input-box"
                    placeholder="Search Payments"
                    value={searchorders}
                    onChange={handleordersearch}
                    icon={{ component: 'search', direction: 'left' }}
                  />
                  {searchorders !== '' && <ClearSoftInput clearInput={handleClearOrderSearch} />}
                </SoftBox>
                {/* <SoftBox className="filter-add-list2-cont">
                  <SoftBox className="soft-select-menu-box-t made-loc">
                    <SoftSelect
                      placeholder="Location"
                      options={[
                        { value: 'ka', label: 'Karnataka' },
                        { value: 'tn', label: 'Tamilnadu' },
                        { value: 'kl', label: 'Kerala' },
                        { value: 'ap', label: 'Andhra Pradesh' },
                        { value: 'ts', label: 'Telengana' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox>
                <SoftBox className="filter-add-list2-cont">
                  <SoftBox className="soft-select-menu-box-c made-status">
                    <SoftSelect
                      placeholder="Status"
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'Created', label: 'Created' },
                        { value: 'Rejected', label: 'Rejected' },
                        { value: 'Approved', label: 'Approved' },
                        { value: 'Blacklisted', label: 'Blacklisted' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox> */}
                <SoftBox>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleOpen2}>
                      <ListItemIcon>
                        <FileUploadIcon fontSize="small" />
                      </ListItemIcon>
                      Export
                    </MenuItem>
                  </Menu>
                </SoftBox>
              </Grid>
              {/* {permissions?.RETAIL_Purchase?.WRITE || permissions?.WMS_Purchase?.WRITE || permissions?.VMS_Purchase?.WRITE
                ?(
                  <SoftBox className="export-div-x">
                    <SoftBox onClick={handleClick} className="st-dot-box">
                      <MoreVertIcon />
                    </SoftBox>
                  </SoftBox>
                )
                :null
              } */}

              <Grid item>
                <SoftBox className="content-space-between">
                  {permissions?.RETAIL_Purchase?.WRITE || permissions?.WMS_Purchase?.WRITE ? (
                    <SoftBox className="vendors-new-btn">
                      <SoftButton
                        // className="vendor-add-btn"
                        onClick={handleOpenModal}
                        variant="solidWhiteBackground"
                      >
                        <AddIcon />
                        Payment
                      </SoftButton>
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
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            // p: 4,
                            overflow: 'auto',
                            maxHeight: '80vh',
                          }}
                        >
                          <Grid container spacing={1} p={1}>
                            {/* <SoftBox className="soft-select-menu-box-O-bill">
                                
                              </SoftBox> */}
                            <Grid item xs={12} md={12} xl={12} display="flex" gap="5px">
                              <SoftBox>
                                <FormField
                                  type="text"
                                  label="Bill No"
                                  placeholder="eg:#1234"
                                  onChange={(e) => setBillValue(e.target.value)}
                                  value={billValue}
                                />
                              </SoftBox>

                              <SoftBox className="verifed-box-bil">
                                {verifyloader ? (
                                  <Spinner />
                                ) : (
                                  <SoftButton
                                    variant={buttonStyles.primaryVariant}
                                    className="contained-softbutton"
                                    onClick={() => handleVerifyBill(billValue)}
                                  >
                                    Verify
                                  </SoftButton>
                                )}
                              </SoftBox>
                            </Grid>
                            {billGenerated ? (
                              <Box ml={2} mt={0.5}>
                                <Grid item xs={12} md={12}>
                                  <SoftTypography fontSize="12px">
                                    <b>P.O No: </b> {newPonumber}{' '}
                                  </SoftTypography>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                  <SoftTypography fontSize="12px">
                                    <b>Balance: </b> {billAmount}{' '}
                                  </SoftTypography>
                                </Grid>
                              </Box>
                            ) : null}

                            <Grid item xs={12} md={12}>
                              <FormField
                                type="number"
                                label="Amount"
                                placeholder="Rs."
                                onChange={(e) => setNewAmount(e.target.value)}
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
                                  onChange={(date) => setNewDate(format(date.$d, 'yyyy-MM-dd'))}
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
                                  { value: 'check', label: 'Cheque' },
                                  { value: 'bank transfer', label: 'Bank Transfer' },
                                  { value: 'online payment', label: 'Online Payment' },
                                  { value: 'credit card', label: 'Credit card' },
                                  { value: 'debit card', label: 'Debit card' },
                                ]}
                                onChange={(e) => setNewPaymentMode(e.value)}
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
                                  <SoftTypography className="add-customer-file-head">
                                    Attach File(s) to Bill
                                  </SoftTypography>
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
                                        Upload <UploadFileIcon />
                                      </SoftTypography>
                                    </label>
                                  </SoftBox>
                                </SoftBox>
                              )}
                            </SoftBox>
                            <Grid item xs={12} sm={12}>
                              <SoftBox className="header-submit-box" style={{ gap: '10px' }}>
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
                    </SoftBox>
                  ) : null}
                  &nbsp;&nbsp;
                  {/* filter  */}
                  <PurchaseMadeFilter
                    filterObject={filterObject} // payload
                    setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                    // fn
                    paymentMade={paymentMade}
                  />
                </SoftBox>
              </Grid>
              {/* search bar filter box ends here */}
            </Grid>
          </SoftBox>

          <SoftBox py={0} px={0}>
            {loader && (
              <Box className="centerspinner">
                <Spinner />
              </Box>
            )}
            {!loader && (
              <Box
                sx={{
                  height: 525,
                  //  marginTop: '10px',
                  width: '100%',
                }}
                className="dat-grid-table-box"
              >
                {errorComing ? (
                  <SoftBox className="No-data-text-box">
                    <SoftBox className="src-imgg-data">
                      <img className="src-dummy-img" src={noDatagif} />
                    </SoftBox>

                    <h3 className="no-data-text-I">NO DATA FOUND</h3>
                  </SoftBox>
                ) : (
                  <DataGrid
                    rows={datRows}
                    className="data-grid-table-boxo"
                    columns={columns}
                    autoPageSize
                    pagination
                    disableSelectionOnClick
                    sx={{
                      border: 'none',
                      borderBottomRightRadius: '10px',
                      borderBottomLeftRadius: '10px',
                    }}
                  />
                )}
              </Box>
            )}
          </SoftBox>
        </Box>
      ) : (
        <>
          {loader ? (
            <Box className="centerspinnerI">
              <Spinner />
            </Box>
          ) : (
            <>
              {!errorComing ? (
                datRows.map((purchase, index) => <PurchaseMadeCard data={purchase} index={index} />)
              ) : (
                <NoDataFound message={'No Purchases Found'} />
              )}
            </>
          )}
        </>
      )}
      {isMobileDevice && <BottomNavbar />}
    </DashboardLayout>
  );
};

export default Purchasemade;
