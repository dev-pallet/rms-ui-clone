import { ChevronDownIcon } from '@heroicons/react/24/outline';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { CircularProgress, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import clsx from 'clsx';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import Spinner from 'components/Spinner/index';
import { getAllPurchaseOrders } from 'config/Services';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import {
  getFilters,
  getPage,
  getPageTitle,
  getSearchValue,
  resetCommonReduxState,
  setPage,
  setPageTitle,
  setSearchValueFilter,
} from '../../../datamanagement/Filters/commonFilterSlice';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import {
  ClearSoftInput,
  CopyToClipBoard,
  dateFormatter,
  noDatagif,
  isSmallScreen,
  textFormatter,
} from '../Common/CommonFunction';
import NoDataFoundMob from '../Common/mobile-new-ui-components/no-data-found';
import Status from '../Common/Status';
import PurchaseOrderFilter from './components/Filter/purchaseOrderFilter';
import PoListcard from './components/po-list-card';
import './purchase-main.css';

const Purchasemain = ({ mobileSearchedValue, filters, setIsFilterOpened, applyFilter, setApplyFilter }) => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const persistedPage = useSelector(getPage);
  const persistedSearchValue = useSelector(getSearchValue);
  const pageTitle = useSelector(getPageTitle);
  //material ui media query
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showSnackbar = useSnackbar();
  const [showViewMore, setShowViewMore] = useState(false);

  const [infiniteLoader, setInfiniteLoader] = useState(false);

  const columns = [
    {
      field: 'orderedOn',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'poNumber',
      headerName: 'PO number',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          Approved: params.value === 'ACCEPTED',
          Reject: params.value === 'REJECTED',
          Create: params.value === 'CREATED',
          Assign: params.value === 'IN_TRANSIT',
          Deliver: params.value === 'DELIVERED',
          Inwarded: params.value === 'INWARDED',
          Partially: params.value === 'PARTIALLY_INWARDED',
        });
      },
      renderCell: (cellValues) => {
        return (
          <div
          // style={{
          //   padding: '5px',
          //   // width: '160px',
          //   // height: '20px',
          //   backgroundColor: '#F6F6F6',
          //   borderRadius: '5px',
          //   textAlign: 'left',
          //   border: '1px solid lightgreen',
          // }}
          >
            {cellValues.value !== '' && <Status label={cellValues.value} />}
          </div>
        );
      },
    },
    {
      field: 'orderedBy',
      headerName: 'Vendor',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'piNumber',
      headerName: 'PI Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'grossAmount',
      headerName: 'Estimated value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'expectedDeliveryDate',
      headerName: 'Expected delivery date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    // {
    //   field: 'paymentStatus',
    //   headerName: 'Payment Status',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   minWidth: 80,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   flex: 0.75,
    // },
    // {
    //   field: 'discount',
    //   headerName: 'Discount',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   minWidth: 60,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   flex: 0.75,
    // },
    // {
    //   field: 'discountType',
    //   headerName: 'Discount Type',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   minWidth: 70,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   flex: 0.75,
    // },
  ];

  const [anchorElAction, setAnchorElAction] = useState(null);
  const openAction = Boolean(anchorElAction);
  const [onClear, setOnClear] = useState(false);

  const actionButtonClick = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  const [value, setValue] = useState([null, null]);
  const [loader, setLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const handleGo = () => {
    localStorage.removeItem('piNum');
    navigate('/purchase/purchase-indent/create-purchase-indent');
  };
  const handleOpen2 = () => setOpen2(true);
  const [open2, setOpen2] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigateToDetailsPage = (poNumber) => {
    navigate(`/purchase/purchase-orders/details/${poNumber}`);
  };

  const [searchorders, setsearchOrders] = useState(persistedSearchValue || '');
  const debouncedSearchValue = useDebounce(searchorders || mobileSearchedValue, 300); // Adjust the delay as needed
  const handleordersearch = (e) => {
    // let orderName = e.target.value;
    // if (orderName.length === 0) {
    //   setsearchOrders('');
    // } else {
    //   setsearchOrders(e.target.value);
    // }
    const value = e.target.value;
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setsearchOrders(value);
    dispatch(setSearchValueFilter(value));
  };

  // clear purchase order search input fn
  const handleClearOrderSearch = () => {
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setsearchOrders('');
    dispatch(setSearchValueFilter(''));
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [errorComing, setErrorComing] = useState(false);
  const [purchaseOrderListLoader, setPurchaseOrderListLoader] = useState(false);

  const filterObjectMain = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          status: [],
          vendorId: [],
          from: '',
          to: '',
        };
  }, [persistedFilters]);

  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 10,
  });

  let retryCount = 0;
  const allPurchaseOrder = async ({ pageNo }) => {
    try {
      if (isMobileDevice) {
        setInfiniteLoader(true);
      }
      if (pageNo === 0) {
        setPurchaseOrderListLoader(true);
      }
      setPageState((prev) => ({ ...prev, loading: true }));
      setLoader(true);

      let obj = {
        status: filterObjectMain?.status?.value ? [filterObjectMain?.status?.value] : [],
        vendorId: filterObjectMain?.selectedVendor?.value ? [filterObjectMain?.selectedVendor?.value] : [],
        from: filterObjectMain?.startDate || '',
        to: filterObjectMain?.endDate || '',
      };

      if (isMobileDevice) {
        const status = filters?.['status']?.[0]?.value ? [filters?.['status']?.[0]?.value] : [];
        const vendorId = filters?.['vendor']?.[0]?.value ? [filters?.['vendor']?.[0]?.value] : [];
        const startDate = filters?.['startDate']?.[0]?.value ? filters?.['startDate']?.[0]?.value : '';
        const endDate = filters?.['endDate']?.[0]?.value ? filters?.['endDate']?.[0]?.value : '';
        obj = {
          status: status,
          vendorId: vendorId,
          from: startDate,
          to: endDate,
        };
      }

      const payload = {
        page: pageNo,
        size: pageState.pageSize,
        orgId: [orgId],
        poSearchInput: debouncedSearchValue,
        sourceLocation: [locId],
        ...obj,
      };

      setPageState((prev) => ({ ...prev, page: pageNo }));

      const response = await getAllPurchaseOrders(payload);

      if (response?.data?.data?.es > 0) {
        setErrorComing(true);
        setPurchaseOrderListLoader(false);
        if (pageNo === 0) setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        showSnackbar(response?.data?.data?.message, 'error');
        setInfiniteLoader(false);
        setLoader(false);
        return;
      }

      if (response?.data?.data?.code === 'ECONNRESET') {
        if (retryCount < 3) {
          retryCount++;
          return allPurchaseOrder({ pageNo: 0 });
        } else {
          showSnackbar('Some Error Occured, Try after some time', 'error');
          setPurchaseOrderListLoader(false);
          setLoader(false);
          return;
        }
      } else {
        const dataArr = response?.data?.data || [];

        if (dataArr?.purchaseOrderList?.length === 0) {
          if (pageNo > 1) showSnackbar(dataArr?.message, 'error');
          if (pageNo === 0) setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
          setErrorComing(true);
          setPurchaseOrderListLoader(false);
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
          setInfiniteLoader(false);
          setLoader(false);
          return;
        }

        const rowsData = dataArr?.purchaseOrderList?.map((row) => ({
          poNumber: row?.poNumber || 'NA',
          orderedBy: row?.vendorName ? textFormatter(row?.vendorName) : 'NA',
          piNumber: row?.piNumber || 'NA',
          status: row?.status || 'NA',
          orderedOn: row?.orderedOn ? dateFormatter(row?.orderedOn) : 'NA',
          discount: row?.discount || 'NA',
          discountType: row?.discountType || 'NA',
          grossAmount: row?.grossAmount || 'NA',
          expectedDeliveryDate: row?.expectedDeliveryDate || 'NA',
          paymentStatus: row?.paymentStatus || 'NA',
          createdOn: row?.createdOnDate || 'NA',
          totalPoProducts: row?.totalPoProducts || 'NA',
        }));

        if (rowsData?.length > 0) {
          if (isMobileDevice && pageNo > 0) {
            setPageState((prev) => ({ ...prev, dataRows: [...prev.dataRows, ...rowsData] }));
          } else {
            setPageState((prev) => ({ ...prev, dataRows: rowsData }));
          }
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
        } else {
          setErrorComing(true);
          setPurchaseOrderListLoader(false);
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
          setInfiniteLoader(false);
          setLoader(false);
          return;
        }

        if (dataArr?.totalResults === dataArr?.pageResults) {
          setShowViewMore(false);
        } else {
          if (!showViewMore) {
            setShowViewMore(true);
          }
        }

        setPageState((prev) => ({
          ...prev,
          totalResults: dataArr?.totalResults,
          totalPages: dataArr?.totalPage,
          loading: false,
        }));

        setInfiniteLoader(false);
        setErrorComing(false);
        setPurchaseOrderListLoader(false);

        setLoader(false);
      }
    } catch (error) {
      if (error?.response?.status === 429 && retryCount < 3) {
        retryCount++;
        return allPurchaseOrder({ pageNo: 0 });
      } else {
        showSnackbar(error?.response?.data?.message || 'An error occurred', 'error');
        setLoader(false);
        setErrorComing(true);
        setPurchaseOrderListLoader(false);
      }
    }
  };

  useEffect(() => {
    if (applyFilter) {
      allPurchaseOrder({ pageNo: 0 });
    }
  }, [applyFilter]);

  useEffect(() => {
    // purchase-order
    if (pageTitle !== 'purchase-order') {
      dispatch(resetCommonReduxState());
      dispatch(setPageTitle('purchase-order'));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (debouncedSearchValue !== '') {
        allPurchaseOrder({ pageNo: 0 });
      } else {
        allPurchaseOrder({ pageNo: persistedPage });
      }
    }
  }, [filterObjectMain, debouncedSearchValue, isInitialized]);

  //useMediaQuery
  const isMobileDevice = isSmallScreen();

  const handleNextListingPage = () => {
    allPurchaseOrder({ pageNo: pageState?.page + 1 });
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {!isMobileDevice ? (
        <Box
          className={`${
            !isMobileDevice
              ? //  'table-css-fix-box-scroll-pi'
                'search-bar-filter-and-table-container'
              : 'purchase-indent-new-header'
          }`}
        >
          <SoftBox className="search-bar-filter-container">
            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox sx={{ position: 'relative' }}>
                  <SoftInput
                    className="filter-soft-input-box"
                    placeholder="Search Purchases Order"
                    value={searchorders}
                    onChange={handleordersearch}
                    icon={{ component: 'search', direction: 'left' }}
                  />
                  {searchorders !== '' && <ClearSoftInput clearInput={handleClearOrderSearch} />}
                </SoftBox>
                <SoftBox
                // className="filter-add-list2-cont"
                >
                  <SoftBox>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateRangePicker
                        label="Advanced keyboard"
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        renderInput={(startProps, endProps) => (
                          <>
                            {/* <input ref={startProps.inputRef} {...startProps.inputProps} className="date-input-box made-date"/>
                        <Box sx={{ mx: 1 }} className="to"> to </Box>
                        <input ref={endProps.inputRef} {...endProps.inputProps} className="date-input-box made-date-o" /> */}
                          </>
                        )}
                      />
                    </LocalizationProvider>
                  </SoftBox>
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
                </Menu>
              </Grid>
              <Grid item>
                {/* <SoftBox className="export-div">
                <SoftBox onClick={handleClick} className="st-dot-box">
                  <MoreVertIcon />
                </SoftBox>
            </SoftBox> */}
                <SoftBox sx={{ display: 'flex' }}>
                  <SoftButton
                    // className="vendor-add-btn"
                    onClick={handleGo}
                    variant="solidWhiteBackground"
                  >
                    <AddIcon />
                    Indent
                  </SoftButton>
                  {/* filter  */}
                  <PurchaseOrderFilter showSnackbar={showSnackbar} filterObjectMain={filterObjectMain} />
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          {loader && !isMobileDevice && (
            <Box className="centerspinner">
              <Spinner />
            </Box>
          )}
          {!loader && !isMobileDevice && (
            <SoftBox
              py={0}
              px={0}
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
                '& .super-app.Deliver': {
                  color: '#E384FF',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Inwarded': {
                  color: 'Blue',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Partially': {
                  color: 'Purple',
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
                  // rows={datRows}
                  // page={poNumberPayload?.page}
                  // pageSize={poNumberPayload?.pageSize}
                  rows={pageState.dataRows}
                  page={pageState?.page}
                  pageSize={pageState?.pageSize}
                  className="data-grid-table-boxo"
                  autoPageSize
                  pagination
                  paginationMode="server"
                  onPageChange={(newPage) => {
                    allPurchaseOrder({ pageNo: newPage });
                    dispatch(setPage(newPage));
                  }}
                  // onPageSizeChange={(newSize) => {
                  //   setPoNumberPayload((old) => ({ ...old, pageSize: newSize }))
                  // }}
                  // rowCount={poNumberPayload?.total}
                  rowCount={pageState?.totalResults}
                  loading={pageState?.loading}
                  getRowId={(row) => row.poNumber}
                  disableSelectionOnClick
                  onCellDoubleClick={(rows) => navigateToDetailsPage(rows.row['poNumber'])}
                  columns={columns}
                />
              )}
            </SoftBox>
          )}
        </Box>
      ) : (
        <SoftBox>
          {purchaseOrderListLoader ? (
            <div className="circular-progress-div">
              <CircularProgress sx={{ color: '#0562fb !important' }} />
            </div>
          ) : pageState?.dataRows?.length > 0 ? (
            <>
              <div className="pi-listing-card-main-div">
                {pageState?.dataRows?.map((row) => (
                  <PoListcard
                    poStatus={row?.status}
                    poDiscount={row?.discount}
                    poDiscountType={row?.discountType}
                    poGrossAmount={row?.grossAmount}
                    poPiNumber={row?.piNumber}
                    poVendorName={row?.orderedBy}
                    poPoNumber={row?.poNumber}
                    poOrderedOn={row?.orderedOn}
                    poEXpDate={row?.expectedDeliveryDate}
                    poCreatedDate={row?.createdOn}
                    totalPoProducts={row?.totalPoProducts}
                  />
                ))}
              </div>
              {showViewMore && (
                <div className="view-more-listing-cards" onClick={handleNextListingPage}>
                  {infiniteLoader ? (
                    <CircularProgress size={20} sx={{ color: '#0562fb !Important' }} />
                  ) : (
                    <>
                      <span className="view-more-btn">View More</span>
                      <ChevronDownIcon
                        style={{
                          width: '1rem',
                          height: '1rem',
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <NoDataFoundMob />
          )}
        </SoftBox>
      )}
    </DashboardLayout>
  );
};
export default Purchasemain;
