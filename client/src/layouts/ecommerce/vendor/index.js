import { ChevronDownIcon } from '@heroicons/react/24/outline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { CircularProgress, Grid, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import { getAllVendors } from 'config/Services';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import { getVendorCapabilityUpdation } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { ClearSoftInput, isSmallScreen, noDatagif, textFormatter } from '../Common/CommonFunction';
import NoDataFoundMob from '../Common/mobile-new-ui-components/no-data-found';
import VendorsFilter from './components/Filter/vendorsFilter';
import VendorListingCard from './components/vendor-listing-card';
import './vendor.css';

function Vendor({ headOffice, mobileSearchedValue, filters, setIsFilterOpened, applyFilter, setApplyFilter }) {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  //material ui media query
  const theme = useTheme();
  const isMobileDevice = isSmallScreen();

  const createVendor = () => {
    if (headOffice) {
      navigate('/sellers/add-vendor/ho');
    } else {
      navigate('/purchase/add-vendor');
    }
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const [vendorCapabilityData, setVendorCapabilityData] = useState(null);
  const [locationType, setlocationType] = useState('');
  const [onClear, setOnClear] = useState(false);

  const [statusType, setstatusType] = useState('');
  const [productName, setProductName] = useState('');

  // handle bulk products
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [openCSVUpload, setOpenCSVUpload] = useState(false);
  const [productCSVFile, setProductCSVFile] = useState(null);
  const [duplicateData, setDuplicateData] = useState([]);
  const [fileUploadSuccess, setFileUploadeSuccess] = useState(false);
  const [errorStatement, setErrorStatement] = useState(false);
  const [loader1, setLoader1] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const vendorCapabilityUpdate = async () => {
    try {
      const res = await getVendorCapabilityUpdation(orgId, locId);
      const result = res?.data?.data;
      setVendorCapabilityData(result);
    } catch (err) {}
  };

  useEffect(() => {
    vendorCapabilityUpdate();
  }, []);

  const open1 = Boolean(anchorEl1);
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleAddBulkProducts = () => {
    setAnchorEl1(null);
    setOpenCSVUpload(true);
    setErrorStatement(false);
  };

  const handleCloseCSVModal = () => {
    setOpenCSVUpload(false);
    setProductCSVFile('');
    setDuplicateData([]);
  };

  const downloadBulkProductsHistory = () => {
    const fileUrl = '';

    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'sample_pallet_bulk_product_upload_file(2023).csv'; // Set the desired filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleValidateCSV = (fileData) => {
    setProductCSVFile(fileData);
    setLoader1(true);
    setErrorStatement(false);
    const filePayload = new Blob([fileData], { type: 'multipart/form-data' });

    const formData = new FormData();
    formData.append('file', filePayload);
  };

  const handleDownloadCSV = () => {
    const csvContent =
      Object.keys(duplicateData[0]) // Get the headers
        .map((header) => `"${header}"`) // Wrap headers in double quotes
        .join(',') +
      '\n' + // Join headers with a comma and add a newline
      duplicateData
        .map(
          (row) =>
            Object.values(row) // Get the values of each row
              .map((value) => value.replace(/"/g, '')) // Remove double quotes
              .map((value) => `"${value}"`) // Wrap values in double quotes
              .join(','), // Join values with a comma
        )
        .join('\n'); // Join rows with a newline

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'data.csv');

    // Trigger the download
    document.body.appendChild(link); // Required for Firefox
    link.click();

    // Clean up the link
    document.body.removeChild(link);
  };

  const handleBulkProductsHistory = () => {
    navigate('/purchase/vendors/bulk-upload/history');
  };

  const columns = [
    {
      field: 'vendorId',
      headerName: 'Vendor ID',
      minWidth: 130,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'vendorType',
      headerName: 'Vendor Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'location',
      headerName: 'Location',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'gstNumber',
      headerName: 'GSTIN',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'contactNumber',
      headerName: 'Contact Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const [anchorElAction, setAnchorElAction] = useState(null);
  const openAction = Boolean(anchorElAction);

  const actionButtonClick = (event) => {
    setAnchorElAction(event.currentTarget);
  };
  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  const [searchVendor, setsearchVendor] = useState('');
  // const [debouncedSearchVendor, setDebouncedSearchVendor] = useState('');
  const debouncedSearchVendor = useDebounce(searchVendor || mobileSearchedValue, 300);

  const handlevendorsearch = (e) => {
    const vendorName = e.target.value;

    if (vendorName.length === 0) {
      setsearchVendor('');
    } else {
      setsearchVendor(e.target.value);
    }
  };

  // clear vendor search input fn
  const handleClearVendorSearch = () => {
    setsearchVendor('');
  };

  const [viewMorePagination, setViewMorePagination] = useState(1);
  const [pageNo, setPageNo] = useState(0);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);

  let filterObject = {
    page: isMobileDevice ? viewMorePagination : pageNo + 1,
    pageSize: 10,
    filterVendor: {
      searchText: debouncedSearchVendor,
      startDate: '',
      endDate: '',
      locations: locationType.length ? [locationType.toUpperCase()] : [],
      type: [],
      productName: productName.length ? [productName.toUpperCase()] : [],
      status: statusType.length ? [statusType.toUpperCase()] : [],
      productGTIN: [],
      vendorType: [],
    },
  };

  const [dataRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  let dataArr,
    dataRow = [];

  const handleCustomer = () => {
    navigate('/customer/addcustomer');
  };

  const getAllVendorsList = () => {
    if (debouncedSearchVendor?.length > 0) {
      filterObject.page = 0;
    }
    if (isMobileDevice && viewMorePagination > 1) {
      setViewMoreLoader(true);
    }
    if (isMobileDevice && Object.keys(filters)?.length > 0) {
      filterObject = {
        ...filterObject,
        filterVendor: {
          ...filterObject.filterVendor,
          status: filters?.['vendorStatus']?.[0]?.value ? [filters?.['vendorStatus']?.[0]?.value] : [],
          vendorType: filters?.['vendorType']?.[0]?.value ? [filters?.['vendorType']?.[0]?.value] : [],
        },
      };
    }
    if (viewMorePagination === 1) {
      setLoader(true);
    }
    getAllVendors(filterObject, orgId)
      .then(function (result) {
        const unique = [];
        const response = result?.data?.data?.vendors;
        setTotalResults(result?.data?.data?.totalResults || 0);
        if (result?.data?.status === 'ERROR') {
          showSnackbar('Something Went Wrong', 'error');
          setLoader(false);
        }

        if (result?.data?.data?.vendors?.length === 0) {
          if (viewMorePagination === 1) setTableRows([]);
          else showSnackbar('No Data found', 'error');
          setViewMoreLoader(false);
          setLoader(false);
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
          return;
        }

        localStorage.setItem('totalVendors', result?.data?.data?.totalResults);
        response.map((x) => (unique.filter((a) => a.vendorId == x.vendorId).length > 0 ? null : unique.push(x)));

        dataArr = unique;
        dataRow.push(
          dataArr?.map((row) => ({
            star: row.vendorId,
            vendorId: row.vendorId ? row.vendorId : '----',
            vendorName: row.vendorName ? textFormatter(row.vendorName) : '----',
            location: row.location ? row.location : '----',
            vendorType: row.vendorType ? textFormatter(row.vendorType) : 'NA',
            gstNumber: row.gstNumber ? row.gstNumber : '----',
            contactNumber: row.contact ? row.contact : '----',
            Status: row.status ? textFormatter(row.status || '') : '----',
          })),
        );
        if (isMobileDevice && filterObject?.page > 0) {
          setTableRows([...dataRows, ...dataRow[0]]);
        } else {
          setTableRows(dataRow[0]);
        }

        if (result?.data?.data?.currentPageTotalResult < result?.data?.data?.pageSize) {
          setShowViewMore(false);
        } else {
          if (!showViewMore) {
            setShowViewMore(true);
          }
        }
        // setTotalPage(response?.data?.data?.totalPages);
        setViewMoreLoader(false);
        if (isMobileDevice) {
          setApplyFilter(false);
          setIsFilterOpened(false);
        }
        setLoader(false);
      })
      .catch((error) => {
        showSnackbar('Something Went Wrong', 'error');
        setViewMoreLoader(false);
        setLoader(false);
      });
  };
  useEffect(() => {
    getAllVendorsList();
  }, [debouncedSearchVendor, viewMorePagination, applyFilter, pageNo]);

  useEffect(() => {
    if (localStorage.getItem('vendorIdForProductPortfolioFromSku')) {
      localStorage.removeItem('vendorIdForProductPortfolioFromSku');
    }
  }, []);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      getAllVendorsList();
      setOnClear(false);
    }
  }, [onClear]);

  const navigateToDetailsPage = (vendorId) => {
    if (headOffice) {
      navigate(`/sellers/vendors/details/${vendorId}`);
    } else {
      navigate(`/sellers/vendors/details/${vendorId}`);
    }
  };

  // Saved
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [tabs, setTabs] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });

  const changeTab = (a, b, c, d) => {
    setTabs({
      tab1: a,
      tab2: b,
      tab3: c,
      tab4: d,
    });
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 6,
    fontSize: '12px',
    border: 'none',
    borderRadius: '10px',
    lineHeight: '1px',
  };

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <SoftBox
        // className="table-css-fix-box-scroll-pi"
        className="search-bar-filter-and-table-container"
        sx={{ marginTop: isMobileDevice ? '0px' : '10px', boxShadow: isMobileDevice && 'none !important' }}
      >
        {!isMobileDevice ? (
          <SoftBox className={`${isMobileDevice ? 'mobile-vendor-card-div' : 'search-bar-filter-container'}`}>
            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox>
                  <SoftBox className="vendor-filter-input" sx={{ position: 'relative' }}>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search Vendors"
                      value={searchVendor}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handlevendorsearch}
                    />
                    {searchVendor !== '' && <ClearSoftInput clearInput={handleClearVendorSearch} />}
                  </SoftBox>
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
                    <MenuItem>
                      <ListItemIcon>
                        <FileDownloadIcon fontSize="small" />
                      </ListItemIcon>
                      Import
                    </MenuItem>
                  </Menu>
                </SoftBox>
              </Grid>

              <Grid item>
                {/* <SoftBox style={{ display: 'flex' }}> */}
                {/* <SoftBox className="export-div">
              <SoftBox onClick={handleClick} className="st-dot-box">
                <MoreVertIcon />
              </SoftBox>
            </SoftBox> */}
                <SoftBox className="content-space-between">
                  <SoftBox className="vendors-new-btn">
                    <SoftButton onClick={() => createVendor()} variant="solidWhiteBackground">
                      <AddIcon />
                      New
                    </SoftButton>
                  </SoftBox>
                  {/* filter  */}
                  <VendorsFilter
                    filterObject={filterObject.filterVendor}
                    setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                    getAllVendorsList={getAllVendorsList}
                  />
                </SoftBox>
                {/* <SoftBox>
              <Button
                id="basic-button"
                aria-controls={open1 ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open1 ? 'true' : undefined}
                onClick={handleClick1}
              >
                    <MoreVertRoundedIcon sx={{ fontSize: '14px' }} />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl1}
                open={open1}
                onClose={handleClose1}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleAddBulkProducts}>Add Bulk Products</MenuItem>
                <MenuItem onClick={handleBulkProductsHistory}>Bulk Upload History</MenuItem>
              </Menu>
            </SoftBox> */}
                {/* </SoftBox> */}
              </Grid>
            </Grid>

            {/** Vendors Payment summary */}
            <Grid container spacing={2} className="payment-summary">
              <Grid item xs={12}>
                <SoftTypography className="payment-heading-summary">Payment Summary</SoftTypography>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" justifyContent="space-between" p={1}>
                  <Grid item xs={2} md={2} xl={2.5}>
                    <SoftBox>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">
                          Total Outstanding Payables
                        </SoftTypography>
                        <SoftBox
                          display="flex"
                          gap="15px"
                          alignItems="center"
                          style={{ height: '10px', marginTop: '1rem' }}
                        >
                          <SoftTypography className="payment-text-summary" fontWeight="bold">
                            {/* Rs. 34355
                             */}
                            ₹{vendorCapabilityData?.outstandingPayable} from {vendorCapabilityData?.fromOfPurchase}{' '}
                            GRN's({vendorCapabilityData?.fromNoOfVendor} Vendors)
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1} md={1} xl={1}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Due Today</SoftTypography>
                      <SoftTypography className="payment-text-due-summary">
                        ₹{vendorCapabilityData?.billDueByToday}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Due within 30 days</SoftTypography>
                      <SoftTypography className="payment-text-summary">
                        ₹{vendorCapabilityData?.billDueByMonth}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5}>
                    <SoftBox className="payment-text-box-summary payment-no-border">
                      <SoftTypography className="payment-sub-heading-summary">Overdue invoice</SoftTypography>
                      <SoftTypography className="payment-text-summary">
                        ₹{vendorCapabilityData?.overDueBill}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </SoftBox>
        ) : (
          <></>
        )}
        {loader && (
          <SoftBox
            sx={{
              height: '70vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </SoftBox>
        )}
        {!isMobileDevice ? (
          <SoftBox
          // py={1}
          >
            <div
              style={{
                // height: '70vh',
                width: '100%',
              }}
            >
              {!loader && !dataRows?.length ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>
                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : (
                dataRows != null &&
                !loader && (
                  <SoftBox
                    // py={0}
                    // px={0}
                    // p={'15px'}
                    style={{ height: 525, width: '100%' }}
                    className="dat-grid-table-box"
                    sx={{
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
                    }}
                  >
                    <DataGrid
                      rows={dataRows}
                      className="data-grid-table-boxo"
                      getRowId={(row) => row.vendorId}
                      pageSize={10}
                      onCellClick={(rows) => navigateToDetailsPage(rows.row['vendorId'])}
                      onPageChange={(newPage) => setPageNo(newPage)}
                      page={pageNo}
                      paginationMode="server"
                      rowCount={totalResults || 0}
                      columns={columns}
                    />
                  </SoftBox>
                )
              )}
            </div>
          </SoftBox>
        ) : (
          <div className="vendor-listing-card-main-div">
            {loader ? (
              <div></div>
            ) : dataRows?.length ? (
              <>
                {dataRows?.map((vendor) => (
                  <VendorListingCard key={vendor.id} data={vendor} />
                ))}
                {viewMoreLoader ? (
                  <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
                ) : (
                  showViewMore && (
                    <div
                      className="view-more-listing-cards"
                      onClick={() => setViewMorePagination(viewMorePagination + 1)}
                    >
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
              </>
            ) : (
              <NoDataFoundMob />
            )}
          </div>
        )}
      </SoftBox>

      {/* modal to add csv for bulk product add */}
      <Modal
        open={openCSVUpload}
        onClose={handleCloseCSVModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modal-pi-border"
      >
        <Box className="pi-box-inventory">
          <Grid container spacing={1} p={1}>
            <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Please Select a csv file of products.
              </SoftTypography>
            </SoftBox>

            <SoftBox className="attach-file-box" mt={3}>
              {productCSVFile ? (
                <SoftBox className="logo-box-org-II">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <img src={productCSVFile} className="logo-box-org" />
                    <Grid item xs={12} md={6} xl={6}>
                      <SoftButton
                        onClick={() => {
                          setProductCSVFile('');
                          setDuplicateData([]);
                          setErrorStatement(false);
                          setLoader1(false);
                        }}
                      >
                        <EditIcon />
                      </SoftButton>
                    </Grid>
                  </div>
                  <SoftBox className="header-submit-box" mt={2} mb={1} lineHeight={0} display="inline-block">
                    <SoftButton onClick={() => handleValidateCSV(productCSVFile)} className="vendor-add-btn">
                      Upload
                    </SoftButton>
                    <SoftButton
                      onClick={handleCloseCSVModal}
                      className="vendor-second-btn"
                      style={{ marginLeft: '10px' }}
                    >
                      Cancel
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              ) : (
                <SoftBox className="add-customer-file-box-I">
                  <SoftTypography className="add-customer-file-head">Attach File(s)</SoftTypography>
                  <SoftBox className="profile-box-up">
                    <input
                      type="file"
                      name="file"
                      id="my-file"
                      className="hidden"
                      onChange={(event) => setProductCSVFile(event.target.files[0])}
                    />
                    <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                      <SoftTypography className="upload-text-I">Upload File</SoftTypography>
                    </label>
                  </SoftBox>
                  <SoftTypography onClick={downloadBulkProductsHistory} className="download-template">
                    Download Template
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            {errorStatement && (
              <SoftBox className="add-customer-file-box-I">
                <SoftTypography className="add-customer-file-head">
                  There was an error parsing your file. Please check and try again.
                </SoftTypography>
              </SoftBox>
            )}
            {duplicateData.length !== 0 && (
              <SoftBox className="add-customer-file-box-I">
                <SoftTypography className="add-customer-file-head">
                  Your file contains duplicate data. There are {duplicateData.length} duplicate rows. Download to see
                  duplicate data
                </SoftTypography>
                <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                  <SoftButton onClick={handleDownloadCSV} className="vendor-add-btn">
                    Download
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            )}
            {fileUploadSuccess && (
              <SoftBox className="add-customer-file-box-I">
                <SoftTypography className="add-customer-file-head">
                  Your file has been uploaded successfully. It will take some time to process your file.
                </SoftTypography>
              </SoftBox>
            )}
            {!fileUploadSuccess && loader1 && (
              <SoftBox className="add-customer-file-box-I" style={{ margin: 'auto', marginTop: '20px' }}>
                <Spinner />
              </SoftBox>
            )}
            {!productCSVFile && (
              <Grid item xs={12} sm={12}>
                <SoftBox className="header-submit-box">
                  <SoftButton className="vendor-second-btn" onClick={handleCloseCSVModal}>
                    cancel
                  </SoftButton>
                </SoftBox>
              </Grid>
            )}
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <SoftBox display="flex" justifyContent="space-between">
            <SoftTypography id="modal-modal-title" className="create-vendor-modal-heading">
              Export
            </SoftTypography>
            <CloseIcon onClick={() => setOpen2(false)} />
          </SoftBox>
          <Divider />

          <SoftTypography id="modal-modal-description" className="vendor-modal-font-size">
            You can export your data CSV or XLS format.
          </SoftTypography>
          <SoftBox>
            <SoftBox mb={1} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                className="select-module-box"
              >
                Select Module*
              </SoftTypography>
            </SoftBox>
            <SoftSelect
              defaultValue={{ value: '', label: '' }}
              options={[
                { value: 'ka', label: 'Karnataka' },
                { value: 'tn', label: 'Tamilnadu' },
                { value: 'kl', label: 'Kerala' },
                { value: 'ap', label: 'Andhra Pradesh' },
                { value: 'ts', label: 'Telengana' },
              ]}
            />
            <SoftBox display="flex">
              <input type="radio" />
              <SoftTypography className="vendor-modal-font-size">Vendors</SoftTypography>
            </SoftBox>
            <SoftBox display="flex">
              <input type="radio" />
              <SoftTypography className="vendor-modal-font-size">Vendor's Contact Persons</SoftTypography>
            </SoftBox>
            <SoftBox display="flex" mb={2}>
              <input type="radio" />
              <SoftTypography className="vendor-modal-font-size">Vendor's Addressess</SoftTypography>
            </SoftBox>
            <SoftBox display="flex">
              <input type="radio" />
              <SoftTypography className="vendor-modal-font-size">All Vendors</SoftTypography>
            </SoftBox>
            <SoftBox display="flex">
              <input type="radio" />
              <SoftTypography className="vendor-modal-font-size">Specific Period</SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftTypography className="create-vendor-modal-heading1">Export as*</SoftTypography>
          <SoftBox display="flex">
            <input type="radio" />
            <SoftTypography className="vendor-modal-font-size">CSV (Comma Separated Value)</SoftTypography>
          </SoftBox>
          <SoftBox display="flex">
            <input type="radio" />
            <SoftTypography className="vendor-modal-font-size">
              XLS (Microsoft Excel 1997-2004 Compatible)
            </SoftTypography>
          </SoftBox>
          <SoftBox display="flex">
            <input type="radio" />
            <SoftTypography className="vendor-modal-font-size">XLSX (Microsoft Excel)</SoftTypography>
          </SoftBox>
          <SoftBox display="flex" mt={2} mb={2}>
            <input type="checkbox" />
            <SoftTypography className="vendor-modal-font-size">
              Include Sensitive Personally Identifiable Information (PII) while exporting.
            </SoftTypography>
          </SoftBox>
          <SoftBox mt={2} mb={2}>
            <SoftTypography className="vendor-modal-font-size">Password to protect the file</SoftTypography>
            <SoftInput type="password" />
          </SoftBox>
          <SoftTypography className="vendor-modal-font-size">
            NOTE: You can export only the first 25,000 rows. If you have more rows, please initiate a backup for the
            data in your organization, and download it. Backup Your Data
          </SoftTypography>
          <SoftButton className="vendor-modal-export-btn">Export</SoftButton>
          <SoftButton className="vendor-modal-cancel-btn">Cancel</SoftButton>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Vendor;
