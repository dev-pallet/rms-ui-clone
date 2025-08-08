import './referal.css';
import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { buttonStyles } from '../Common/buttonColor';
import { getpurchaseorderbyBill, getrefundtabledata, postRefundBills, vieworderspdf } from '../../../config/Services';
import { useEffect, useState } from 'react';
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
import RefundCard from './components/refund-card-mobile';
import RefundsFilter from './components/Filter/refundsFilter';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../components/Spinner';
import UploadFileIcon from '@mui/icons-material/UploadFile';

function Referral() {
  const [paysum, setPaysum] = useState(false);
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();

  const columns = [
    {
      field: 'createdOn',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'id',
      headerName: 'Refund ID',
      minWidth: 180,
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
      minWidth: 180,
      flex: 0.75,
    },
    {
      field: 'refundmethod',
      headerName: 'Refund method',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
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
            <Box className="less-height" ml={2} onClick={() => handleClickviewDoc(params.row.docId)}>
              <SoftButton className="view-table-btn">View</SoftButton>
            </Box>
          </>
        );
      },
    },
  ];

  const at = localStorage.getItem('access_token');

  const handleClickviewDoc = async (Id) => {
    if (Id === '-----') {
      showSnackbar('No Image or pdf found', 'error');
    } else {
      setLoader(true);
      try {
        const response = await vieworderspdf(Id);
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
  const [onClear, setOnClear] = useState(false);
  const [datRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const [searchorders, setsearchOrders] = useState('');
  const filterObject = {
    orgId: [orgId],
    sourceLocation: [locId],
    refundSearchInput: searchorders,
  };

  const handleordersearch = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setsearchOrders('');
    } else {
      setsearchOrders(e.target.value);
    }
  };

  // clear refunds search input fn
  const handleClearOrderSearch = () => {
    setsearchOrders('');
  };

  let dataArr,
    dataRow = [];
  useEffect(() => {
    setLoader(true);
    refundData();
  }, [paysum, searchorders]);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      refundData();
      setOnClear(false);
    }
  }, [onClear]);

  const refundData = () => {
    getrefundtabledata(filterObject)
      .then((res) => {
        showSnackbar('Success Refund list', 'success');
        dataArr = res.data.data;
        if (res?.data?.data?.message === 'No such Refund found') {
          setErrorComing(true);
          setLoader(false);
          return;
        }
        dataRow.push(
          dataArr?.refundList?.map((row) => ({
            createdOn: row.createdOn ? dateFormatter(row.createdOn) : '-----',
            id: row.refundId ? row.refundId : '-----',
            purchaseOrderNo: row.poNumber ? row.poNumber : '-----',
            refundmethod: row.refundMethod ? textFormatter(row.refundMethod) : '-----',
            billnumber: row.billNumber ? row.billNumber : '-----',
            amount: row.refundAmount ? row.refundAmount : '-----',
            docId: row.docId ? row.docId : '-----',
          })),
        );
        setTableRows(dataRow[0]);
        setLoader(false);
        setErrorComing(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setLoader(false);
        setErrorComing(true);
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

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    // FOR BUG IN CHROME
    event.target.value = '';
  };

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
  const [verifyloader, setVerifyloader] = useState(false);
  const [billValue, setBillValue] = useState('');
  const [newPonumber, setNewPoNumber] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newRefundMode, setNewRefundMode] = useState();
  const [refundReason, setRefundReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [refundableAmount, setrefundableAmount] = useState('');

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
        setNewPoNumber(res?.data?.data?.poNumber);
        setrefundableAmount(res?.data?.data?.refundableAmount);
        setNewAmount(res?.data?.data?.balance);
        showSnackbar('Success Bill Verified', 'success');
        setVerifyloader(false);
      })
      .catch((err) => {
        setAlertmessage(err?.response?.data?.message, 'error');
        setVerifyloader(false);
      });
  };

  //file upload
  const [formLoader, setFormLoader] = useState(false);
  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  const handleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);
  };

  const handleSubmitForm = (event) => {
    setFormLoader(true);
    const payload = {
      billNumber: billValue,
      poNumber: newPonumber,
      refundDate: newDate,
      refundAmount: newAmount,
      refundMethod: newRefundMode,
      comments: 'string',
      reason: refundReason,
      createdBy: object?.uidx,
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
        setAlertmessage('Success Refund recorded');
        setTimelineerror('success');
        setPaysum(!paysum);
        setTimeout(() => {
          handleopensnack();
        });
        setFormLoader(false);
        setOpenModal(false);
        setBillValue('');
        setRefundReason('');
        setNewAmount('');
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        });
        setOpenModal(false);
        setFormLoader(false);
        setBillValue('');
        setRefundReason('');
        setNewAmount('');
      });
  };

  return (
    <DashboardLayout>
      {!isMobileDevice ? (
        <DashboardNavbar />
      ) : (
        <SoftBox className="new-search-header po-box-shadow">
          <MobileNavbar title={'Refunds'} />
          <CommonSearchBar searchFunction={handleordersearch} placeholder="Search..." handleNewRequired={false} />
        </SoftBox>
      )}

      {formLoader ? (
        <Spinner />
      ) : !isMobileDevice ? (
        <Box
          // className="table-css-fix-box-scroll-pi"
          className="search-bar-filter-and-table-container"
        >
          <Box className="table-scroll-bar-box">
            <SoftBox
              // className="vendors-filter-div"
              className="search-bar-filter-container"
            >
              <Grid container spacing={2} justifyContent={'space-between'}>
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox>
                    <SoftBox
                      // className="vendor-filter-input"
                      sx={{ position: 'relative' }}
                    >
                      <SoftInput
                        className="filter-soft-input-box"
                        placeholder="Search Refunds"
                        value={searchorders}
                        onChange={handleordersearch}
                        icon={{ component: 'search', direction: 'left' }}
                      />
                      {searchorders !== '' && <ClearSoftInput clearInput={handleClearOrderSearch} />}
                    </SoftBox>
                    {/* <SoftBox className="filter-add-list2-cont">
                    <SoftBox className="soft-select-menu-box-O-i">
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
                    <SoftBox className="soft-select-menu-box-O referal-stsu">
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
                    {/* <SoftBox className="filter-add-list2-cont">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateRangePicker
                        label="Advanced keyboard"
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        renderInput={(startProps, endProps) => (
                          <>
                            <input ref={startProps.inputRef} {...startProps.inputProps} className="date-input-box  referal-dat"/>
                <Box sx={{ mx: 1 }} className="to"> to </Box>
                <input ref={endProps.inputRef} {...endProps.inputProps} className="date-input-box  referal-dat-t"/>
                          </>
                        )}
                      />
                    </LocalizationProvider>
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
                  </SoftBox>
                </Grid>

                {/* <SoftBox style={{marginTop:"10px",paddingLeft:"-20px"}}>
                <SoftBox onClick={handleClick} >
                  <MoreVertIcon />
                </SoftBox>
              </SoftBox> */}
                <Grid item>
                  <SoftBox className="content-space-between">
                    <SoftBox className="vendors-new-btn">
                      <SoftButton
                        // className="vendor-add-btn"
                        onClick={handleOpenModal}
                        // style={{ height: '6px' }}
                        variant="solidWhiteBackground"
                      >
                        <AddIcon />
                        Refund
                      </SoftButton>
                    </SoftBox>
                    &nbsp;&nbsp;
                    {/* filter  */}
                    <RefundsFilter
                      filterObject={filterObject} // payload
                      setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                      // fn
                      refundData={refundData}
                    />
                  </SoftBox>
                  {/* <SoftButton className="record-payment-button" onClick={handleOpenModal}>
                  <AddIcon />
                  Refund
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
                        {/* <Grid item xs={12} md={12}>
                        <FormField type="number" label="Bill No" placeholder="eg:#1234" onChange={(e)=>setMrp(e.target.value)}/>
                        </Grid> */}
                        <SoftBox className="soft-select-menu-box-O-bill">
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
                        </SoftBox>
                        {newPonumber !== '' ? (
                          <Grid item xs={12} md={12}>
                            <SoftTypography fontSize="12px">
                              <b>P.O No:</b> {newPonumber}{' '}
                            </SoftTypography>
                          </Grid>
                        ) : null}
                        {refundableAmount !== '' ? (
                          <Grid item xs={12} md={12}>
                            <SoftTypography fontSize="12px">
                              <b>Refundable Amount:</b> {refundableAmount}{' '}
                            </SoftTypography>
                          </Grid>
                        ) : null}
                        <Grid item xs={12} md={12}>
                          <FormField
                            type="number"
                            label="Amount"
                            placeholder="Rs"
                            onChange={(e) => setNewAmount(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <FormField
                            type="date"
                            label="Date"
                            placeholder="Rs"
                            onChange={(e) => setNewDate(e.target.value)}
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
                              Refund Mode
                            </SoftTypography>
                          </SoftBox>
                          <SoftSelect
                            options={[
                              { value: 'Credit Note', label: 'Credit Note' },
                              { value: 'bank transfer', label: 'Bank Transfer' },
                            ]}
                            onChange={(e) => setNewRefundMode(e.value)}
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
                </Grid>
              </Grid>
            </SoftBox>
          </Box>

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
                  // minWidth: '900px',
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
                    disableSelectionOnClick
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
                datRows.map((refunds, index) => <RefundCard data={refunds} index={index} />)
              ) : (
                <NoDataFound message={'No Refunds Found'} />
              )}
            </>
          )}
        </>
      )}
      {isMobileDevice && <BottomNavbar />}
    </DashboardLayout>
  );
}

export default Referral;
