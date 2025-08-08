import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ClickAwayListener, Tooltip } from '@material-ui/core';
import { CircularProgress } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import FormField from 'layouts/ecommerce/purchase-bills/components/FormField/index';
import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { billPaymentSummary, postbillstabledetails } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { buttonStyles } from '../Common/buttonColor';
import { ClearSoftInput, dateFormatter, noDatagif, isSmallScreen, textFormatter } from '../Common/CommonFunction';
import NoDataFoundMob from '../Common/mobile-new-ui-components/no-data-found';
import Status from '../Common/Status';
import PurchaseBillsFilter from './components/Filter/purchaseBillsFilter';
import PurchaseBillCard from './components/purchase-bill-card';
import './purchase-bills.css';
import { useDebounce } from 'usehooks-ts';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getFilters, setFilters } from '../../../datamanagement/Filters/commonFilterSlice';

const Purchasebills = ({
  setBillsAdditionalDetails,
  mobileSearchedValue,
  filters,
  setIsFilterOpened,
  applyFilter,
  setApplyFilter,
}) => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const [loader, setLoader] = useState(false);
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const [summaryData, setsummaryData] = useState();
  const [openPayNow, setOpenPayNow] = useState(false);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);
  // const [viewMorePageNumber, setViewMorePageNumber] = useState(0);
  const [searchorders, setsearchOrders] = useState(null);
  const debouncedSearchValue = useDebounce(searchorders || mobileSearchedValue, 300);
  const [showViewMore, setShowViewMore] = useState(false);
  const [billsTotalResults, setBillsTotalResults] = useState(0);
  const [billsPageNo, setBillsPageNo] = useState(persistedFilters?.page || 0);

  const handleClickAway = () => {
    setOpenPayNow((prev) => !prev);
  };

  const handleCloseClick = () => {
    setOpenPayNow(false);
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      minWidth: 60,
    },
    {
      field: 'poNumber',
      headerName: 'PO number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      minWidth: 120,
    },
    {
      field: 'invoiceBillNumber',
      headerName: 'Invoice Bill number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      minWidth: 50,
    },
    {
      field: 'vendorname',
      headerName: 'Vendor',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      minWidth: 150,
    },
    {
      field: 'amount',
      headerName: 'Bill value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      flex: 0.75,
      minWidth: 50,
    },
    {
      field: 'balancedue',
      headerName: 'Outstanding',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      flex: 0.75,
      minWidth: 50,
    },
    {
      field: 'status',
      headerName: 'Clearance',
      type: 'number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      minWidth: 160,
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          Approved: params.value === 'ACCEPTED',
          Reject: params.value === 'REJECTED',
          Create: params.value === 'CREATED',
          Assign: params.value === 'ASSIGNED',
          Partial: params.value === 'PARTIALLY_PAID',
          Paid: params.value === 'PAID',
        });
      },
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      minWidth: 150,
    },
    // {
    //   field: 'duedate',
    //   headerName: 'Due Date',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   flex: 0.75,
    //   minWidth: 150,
    // },
  ];

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [onClear, setOnClear] = useState(false);

  const selectedFilters = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          status: [],
          selectedVendor: []
        };
  }, [persistedFilters]);

  const handleordersearch = (e) => {
    const orderName = e.target.value;
    if (orderName.length === 0) {
      setsearchOrders('');
    } else {
      setsearchOrders(e.target.value);
    }
  };

  // clear bills search input fn
  const handleClearOrderSearch = () => {
    setsearchOrders('');
  };

  let filterObject = {
    page: persistedFilters?.page || 0,
    size: 10,
    orgId: [orgId],
    sourceLocation: [locId],
    billSearchInput: debouncedSearchValue,
    status: selectedFilters?.status?.value ? [selectedFilters?.status?.value] : [],
    vendorId: selectedFilters?.selectedVendor?.value ? [selectedFilters?.selectedVendor?.value] : [],
  };
  
  const [datRows, setTableRows] = useState([]);
  const [errorComing, setErrorComing] = useState(false);
  let dataArr,
    dataRow = [];
  const isFirstRender = useRef(true);

  useEffect(() => {
    billsData();
  }, [selectedFilters]);

  useEffect(() => {
    if(applyFilter){
      billsData();
    }
  }, [applyFilter])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // set to false after first render
      return;
    }
    dispatch(setFilters({ ...persistedFilters, search: debouncedSearchValue, page: 0 }));
    setBillsPageNo(0);
  }, [debouncedSearchValue]);

  useEffect(() => {
    paymentSummary();
  }, []);

  const billsData = (pageNo) => {
    if(pageNo){
      setBillsPageNo(pageNo);
      filterObject.page = pageNo;
    }

    if (isMobileDevice && filters && Object.keys(filters)?.length > 0) {
      const status = filters?.['status']?.[0]?.value ? [filters?.['status']?.[0]?.value] : [];
      const vendors = filters?.['selectedVendor']?.[0]?.value ? [filters?.['selectedVendor']?.[0]?.value] : [];
      filterObject = {
        ...filterObject,
        status: status,
        vendorId: vendors,
      };
    }
    if (billsPageNo >= 0 && !isMobileDevice) {
      setLoader(true);
    }
    if (pageNo && pageNo + 1 > 0 && isMobileDevice) {
      setViewMoreLoader(true);
    }
    if (filterObject?.page >= 0 && !isMobileDevice) {
      setLoader(true);
    }
    postbillstabledetails(filterObject)
      .then((res) => {
        dataArr = res?.data?.data;
        if (res?.data?.data?.message === 'No bills found') {
          showSnackbar('No Bills Found', 'error');
          if (pageNo > 0 && isMobileDevice) {
            setTableRows([...datRows]);
            setViewMoreLoader(false);
            return;
          }
          setErrorComing(true);
          setLoader(false);
          return;
        }
        dataRow.push(
          dataArr?.purchaseOrderBillList?.map((row) => ({
            date: row.createdOn ? dateFormatter(row.createdOn) : '-----',
            id: row.billNumber ? row.billNumber : '-----',
            invoiceBillNumber: row.invoiceRefNo ? row.invoiceRefNo : '-----',
            poNumber: row.poNumber ? row.poNumber : '-----',
            vendorname: row.vendorName ? textFormatter(row.vendorName) : '-----',
            status: row.status ? row.status : '-----',
            duedate: row.dueDate ? dateFormatter(row.dueDate) : '-----',
            amount: row.totalAmount ? row.totalAmount : '-----',
            balancedue: row.balance ? row.balance : '-----',
            paymentMethod: row.paymentMethod ? row.paymentMethod : '-----',
            billNumber: row?.billNumber ?? 'NA',
          })),
        );
        if (isMobileDevice && pageNo + 1 > 1) {
          setTableRows([...datRows, ...dataRow[0]]);
        } else {
          setTableRows(dataRow[0]);
        }
        setBillsTotalResults(dataArr?.totalResults);
        setViewMoreLoader(false);
        setLoader(false);
        setErrorComing(false);
        if (!isMobileDevice) {
          showSnackbar('Success Bill list', 'success');
        } else {
          setApplyFilter(false);
          setIsFilterOpened(false);
        }

        if (dataArr?.pageResults === dataArr?.totalResults) {
          setShowViewMore(false);
        } else {
          if (!showViewMore) {
            setShowViewMore(true);
          }
        }
      })
      .catch((err) => {
        setViewMoreLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
        setLoader(false);
        setErrorComing(true);
        if (isMobileDevice) {
          setApplyFilter(false);
          setIsFilterOpened(false);
        }
      });
  };

  const [value, setValue] = useState([null, null]);
  const navigate = useNavigate();

  const createBill = () => {
    navigate('/purchase/new-bills');
  };
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [selectedImages, setSelectedImages] = useState([]);

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

  const navigateToDetailsPage = (id) => {
    navigate(`/purchase/purchase-bills/details/${id}`);
  };

  const paymentSummary = () => {
    billPaymentSummary(orgId, locId)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data;

        setsummaryData({
          dueToday: response?.dueToday,
          dueIn7days: response?.dueIn7days,
          dueIn30Days: response?.dueIn30Days,
          overdue: response?.overdue,
          totalOutstanding: response?.totalOutstanding,
        });

        if (isMobileDevice) {
          setBillsAdditionalDetails({
            dueToday: response?.dueToday,
            dueIn7days: response?.dueIn7days,
            dueIn30Days: response?.dueIn30Days,
            overdue: response?.overdue,
            totalOutstanding: response?.totalOutstanding,
          });
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'erro');
      });
  };

  const handleNextBillsPage = (pageNo) => {
    billsData(pageNo);
  };

  return (
    <DashboardLayout>
      {!isMobileDevice ? (
        <DashboardNavbar />
      ) : // <SoftBox className="new-search-header po-box-shadow">
      //   <MobileNavbar title={'Bills'} />
      //   <CommonSearchBar searchFunction={handleordersearch} placeholder="Search Bills..." handleNewRequired={false} />
      // </SoftBox>
      null}

      {!isMobileDevice ? (
        <Box className="search-bar-filter-and-table-container">
          <SoftBox
            className="search-bar-filter-container"
          >
            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox className="vendor-filter-input" sx={{ position: 'relative' }}>
                  <SoftInput
                    className="filter-soft-input-box-bill-I"
                    placeholder="Search Bills"
                    value={searchorders}
                    onChange={handleordersearch}
                    icon={{ component: 'search', direction: 'left' }}
                  />
                  {searchorders && <ClearSoftInput clearInput={handleClearOrderSearch} />}
                </SoftBox>
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

              {/* <SoftBox className="export-div-bill"> */}
              {/* <SoftBox onClick={handleClick} className="st-dot-box">
                <MoreVertIcon />
              </SoftBox> */}
              {/* </SoftBox> */}

              <Grid item>
                <SoftBox className="content-space-between">
                  <SoftBox className="vendors-new-btn">
                    {/* <SoftButton
                    // className="small-inner-bills-box"
                    onClick={() => createBill()}
                    // backgroundColor="#0562FB"
                    variant="solidWhiteBackground"
                  >
                    <AddIcon />
                    New
                  </SoftButton> */}
                    <Modal
                      open={openModal}
                      onClose={handleCloseModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      className="modal-pi-border"
                    >
                      <Box className="pi-box-inventory">
                        <Grid container spacing={1} p={1}>
                          <Grid item xs={12} md={12}>
                            <FormField
                              type="number"
                              label="Bill No"
                              placeholder="eg:#1234"
                              onChange={(e) => setMrp(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <FormField
                              type="number"
                              label="P.O No"
                              placeholder="eg:#1234"
                              onChange={(e) => setMrp(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <FormField
                              type="number"
                              label="Amount"
                              placeholder="Rs"
                              onChange={(e) => setMrp(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <FormField
                              type="date"
                              label="Date"
                              placeholder="Rs"
                              onChange={(e) => setMrp(e.target.value)}
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
                              onChange={(option) => setCustType(option)}
                              options={[
                                { value: 'CASH', label: 'Cash' },
                                { value: 'CHEQUE', label: 'Cheque' },
                                { value: 'BANK TRNASFER', label: 'Bank Transfer' },
                                { value: 'CREDIT CARD', label: 'Credit card' },
                                { value: 'DEBIT CARD', label: 'Debit card' },
                              ]}
                            />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <SoftBox className="multiple-box">
                              <label variant="body2" className="body-label">
                                <br />
                                Browse Image
                                <input
                                  type="file"
                                  name="images"
                                  onChange={onSelectFile}
                                  multiple
                                  accept="image/png , image/jpeg, image/webp"
                                />
                              </label>
                            </SoftBox>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <SoftBox className="header-submit-box">
                              <SoftButton className="modal-cancel-pi" onClick={handleCloseModal}>
                                cancel
                              </SoftButton>
                              <SoftButton variant="gradient" color="info">
                                submit
                              </SoftButton>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                  </SoftBox>
                  &nbsp;&nbsp;
                  {/* filter  */}
                  <PurchaseBillsFilter
                    selectedFilters={selectedFilters} // payload
                    setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                    setBillsPageNo={setBillsPageNo}         
                    // fn
                    billsData={billsData}
                  />
                </SoftBox>
              </Grid>
            </Grid>
            <Grid container spacing={2} className="payment-summary">
              <Grid item xs={12}>
                <SoftTypography className="payment-heading-summary">Payment Summary</SoftTypography>
              </Grid>
              <Grid item xs={12} mt={-2} mb={-2}>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  py={2}
                  px={1}
                  alignItems="center"
                >
                  <Grid item xs={2.5} md={2.5} xl={2.5} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">
                        Total outstanding payables
                      </SoftTypography>
                      <SoftTypography className="payment-text-summary">{`₹ ${
                        summaryData?.totalOutstanding ? summaryData?.totalOutstanding : '0'
                      }`}</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.8} md={1.8} xl={1.8} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary" style={{ color: '#ed9e17' }}>
                        Due today
                      </SoftTypography>
                      <SoftTypography className="payment-text-summary">{`₹ ${
                        summaryData?.dueToday ? summaryData?.dueToday : '0'
                      }`}</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.8} md={1.8} xl={1.8} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Due in 7 days</SoftTypography>
                      <SoftTypography className="payment-text-summary">{`₹ ${
                        summaryData?.dueIn7days ? summaryData?.dueIn7days : '0'
                      }`}</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.8} md={1.8} xl={1.8} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Due in 30 days</SoftTypography>
                      <SoftTypography className="payment-text-summary">{`₹ ${
                        summaryData?.dueIn30Days ? summaryData?.dueIn30Days : '0'
                      }`}</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Overdue</SoftTypography>
                      <SoftTypography className="payment-text-summary">{`₹ ${
                        summaryData?.overdue ? summaryData?.overdue : '0'
                      }`}</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5} mt={-2}>
                    <Tooltip title="Coming soon">
                      <SoftBox className="payment-text-box-summary">
                        <SoftButton
                          variant={buttonStyles.primaryVariant}
                          className="contained-softbutton vendor-add-btn"
                          sx={{ cursor: 'pointer' }}
                          disabled
                        >
                          Pay now
                        </SoftButton>
                      </SoftBox>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </SoftBox>

          {loader && (
            <Box className="centerspinner">
              <Spinner />
            </Box>
          )}
          {!loader && (
            <Box
              style={{ height: 525, width: '100%' }}
              // className="dat-grid-table-box-vendor"
              sx={{
                // marginTop: '10px',
                '& .super-app.Approved': {
                  color: '#69e86d',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Reject': {
                  color: '#df5231',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Create': {
                  color: '#888dec',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Assign': {
                  color: 'purple',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Partial': {
                  color: 'purple',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Paid': {
                  color: 'green',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
              }}
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
                  getRowId={(row) => row.id}
                  rows={datRows}
                  page={billsPageNo}
                  pageSize={10}
                  rowCount={billsTotalResults}
                  loading={loader}
                  className="data-grid-table-boxo"
                  columns={columns}
                  autoPageSize
                  pagination
                  onPageChange={(newPage) => {
                    // billsData({ pageNo: newpage });
                    dispatch(setFilters({ ...persistedFilters, page: newPage })); 
                    setBillsPageNo(newPage);                 
                  }}
                  paginationMode="server"
                  disableSelectionOnClick
                  onCellDoubleClick={(rows) => navigateToDetailsPage(rows.row['id'])}
                />
              )}
            </Box>
          )}
        </Box>
      ) : (
        <>
          {loader ? (
            <Box className="centerspinnerI">
              <Spinner />
            </Box>
          ) : (
            <>
              {!isMobileDevice && (
                <div className="payment-summary-container">
                  <div className="payment-summary-header">
                    <span className="payment-heading-summary">Payment Summary</span>
                  </div>
                  <div className="payment-summary-content">
                    <div className="payment-long-summary-item">
                      <div className="payment-text-box-summary">
                        <span className="bil-payment-sub-heading-summary">Total outstanding payables</span>
                        <span className="payment-text-summary">{`₹ ${
                          summaryData?.totalOutstanding ? summaryData?.totalOutstanding : '0'
                        }`}</span>
                      </div>
                    </div>
                    <div className="payment-summary-item">
                      <div className="payment-text-box-summary">
                        <span className="bil-payment-sub-heading-summary" style={{ color: '#ed9e17' }}>
                          Due today
                        </span>
                        <span className="payment-text-summary">{`₹ ${
                          summaryData?.dueToday ? summaryData?.dueToday : '0'
                        }`}</span>
                      </div>
                    </div>
                    <div className="payment-summary-item">
                      <div className="payment-text-box-summary">
                        <span className="bil-payment-sub-heading-summary">Due in 7 days</span>
                        <span className="payment-text-summary">{`₹ ${
                          summaryData?.dueIn7days ? summaryData?.dueIn7days : '0'
                        }`}</span>
                      </div>
                    </div>
                    <div className="payment-summary-item">
                      <div className="payment-text-box-summary">
                        <span className="bil-payment-sub-heading-summary">Due in 30 days</span>
                        <span className="payment-text-summary">{`₹ ${
                          summaryData?.dueIn30Days ? summaryData?.dueIn30Days : '0'
                        }`}</span>
                      </div>
                    </div>
                    <div className="payment-summary-item">
                      <div className="payment-text-box-summary">
                        <span className="bil-payment-sub-heading-summary">Overdue</span>
                        <span className="payment-text-summary">{`₹ ${
                          summaryData?.overdue ? summaryData?.overdue : '0'
                        }`}</span>
                      </div>
                    </div>
                    <div className="payment-btn-summary-item">
                      <ClickAwayListener
                        mouseEvent="onMouseDown"
                        touchEvent="onTouchStart"
                        onClickAway={handleCloseClick}
                      >
                        <Box className="bill-relative-box">
                          <div className="payment-text-box-summary" onClick={handleClickAway}>
                            <SoftButton
                              variant={buttonStyles.primaryVariant}
                              className="contained-softbutton vendor-add-btn"
                              sx={{ cursor: 'pointer' }}
                              disabled
                            >
                              Pay now
                            </SoftButton>
                          </div>
                          {openPayNow ? <Box className="bill-dropdown-box">Coming soon</Box> : null}
                        </Box>
                      </ClickAwayListener>
                      {/* <Tooltip title="Coming soon">
                      <div className="payment-text-box-summary">
                        <SoftButton
                          variant={buttonStyles.primaryVariant}
                          className="contained-softbutton vendor-add-btn"
                          sx={{ cursor: 'pointer' }}
                          disabled
                        >
                          Pay now
                        </SoftButton>
                      </div>
                    </Tooltip> */}
                    </div>
                  </div>
                </div>
              )}

              {!errorComing ? (
                <>
                  <div className="purchase-bills-main-card">
                    {datRows?.map((purchase, index) => (
                      <PurchaseBillCard data={purchase} index={index} />
                    ))}
                  </div>
                  <div className="view-more-listing-cards">
                    {viewMoreLoader ? (
                      <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
                    ) : (
                      showViewMore && (
                        <div onClick={() => handleNextBillsPage(billsPageNo + 1)}>
                          <span className="view-more-btn">View More</span>
                          <ChevronDownIcon
                            style={{
                              width: '1rem',
                              height: '1rem',
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <NoDataFoundMob />
              )}
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Purchasebills;
