import { ChevronDownIcon } from '@heroicons/react/24/outline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { CircularProgress, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import { getAllPurchaseIndent } from 'config/Services';
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
  isSmallScreen,
  noDatagif,
  textFormatter,
} from '../Common/CommonFunction';
import NoDataFoundMob from '../Common/mobile-new-ui-components/no-data-found';
import Status from '../Common/Status';
import PurchaseIndentFilter from './components/Filter/purchaseIndentFilter';
import PICard from './components/purchaseIndentCard';
import './index.css';

const PurchaseIndent = ({ mobileSearchedValue, filters, applyFilter, setApplyFilter, setIsFilterOpened }) => {
  const isMobileDevice = isSmallScreen();
  const [searchIndent, setSearchIndent] = useState(persistedSearchValue || '');
  const [onClear, setOnClear] = useState(false);
  const [currUserPIList, setCurrUserPIList] = useState(0);
  const debouncedSearchValue = useDebounce(searchIndent || mobileSearchedValue, 300);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const persistedPage = useSelector(getPage);
  const pageTitle = useSelector(getPageTitle);
  const persistedSearchValue = useSelector(getSearchValue);
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 10,
  });
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const locationName = localStorage.getItem('locName');
  const showSnackbar = useSnackbar();
  const [showViewMore, setShowViewMore] = useState(true);

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
      field: 'purchaseIndentNo',
      headerName: 'Indent Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
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
      cellClassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          Approved: params.value === 'APPROVED',
          Reject: params.value === 'REJECTED',
          Create: params.value === 'CREATED',
          Assign: params.value === 'ASSIGNED',
          Delete: params.value === 'DELETED',
          Close: params.value === 'CLOSED',
          Draft: params.value === 'DRAFT',
        });
      },
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues?.value !== '' && (
              <Status label={cellValues?.value === 'CREATED' ? 'PENDING_APPROVAL' : cellValues?.value} />
            )}
          </div>
        );
      },
    },
    {
      field: 'preferredVendor',
      headerName: 'Vendor',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'deliveryLocation',
      headerName: 'Delivery Location',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 220,
      flex: 0.75,
    },
    // {
    //   field: 'assignedTo',
    //   headerName: 'Shipping Method',
    //   type: 'number',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   minWidth: 170,
    //   flex: 0.75,
    // },
    {
      field: 'expectedDeliveryDate',
      headerName: 'Expected Delivery Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 0.75,
    },
  ];

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [tabs, setTabs] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });

  const handleGo = () => {
    localStorage.removeItem('piNum');
    navigate('/purchase/purchase-indent/create-purchase-indent');
  };

  const filterObjectMain = useMemo(() => {
    if (pageTitle !== '' && pageTitle !== 'purchase-indent') {
      return {
        status: [],
        selectedUser: [],
      };
    }

    return persistedFilters
      ? { ...persistedFilters }
      : {
          status: [],
          selectedUser: [],
        };
  }, [persistedFilters, pageTitle]);

  useEffect(() => {
    // purchase-order
    if (pageTitle !== 'purchase-indent') {
      dispatch(resetCommonReduxState());
      dispatch(setPageTitle('purchase-indent'));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (debouncedSearchValue !== '') {
        allPiList({ pageNo: 0 });
      } else {
        allPiList({ pageNo: persistedPage });
      }
    }
  }, [filterObjectMain, debouncedSearchValue, isInitialized]);

  useEffect(() => {
    if (applyFilter) {
      allPiList({ pageNo: 0 });
    }
  }, [applyFilter]);

  const handleSearchFliter = (e) => {
    const value = e.target.value;
    // if (num.length === 0) {
    //   setSearchIndent([]);
    // } else {
    //   setSearchIndent([e.target.value]);
    // }
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setSearchIndent(value);
    dispatch(setSearchValueFilter(value));
  };

  // clear purchase indent search input fn
  const handleClearSearchInput = () => {
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setSearchIndent('');
    dispatch(setSearchValueFilter(''));
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const [errorComing, setErrorComing] = useState(false);

  const filterObject = {
    page: 0,
    size: 10,
    orgId: [orgId],
    sourceId: [locId],
    purchaseIndentNo: searchIndent,
    deliveryLocation: [],
    requestedOn: '',
    expectedDeliveryDate: '',
    shippingMethod: [],
    costCenter: [],
    status: [],
    assignedTo: [],
    assignedBy: [],
    createdBy: [],
    user: 'testuser',
  };
  const [datRows, setTableRows] = useState([]);

  useEffect(() => {
    currentUserPendingPI();
  }, []);

  // when clear is clicked in filter
  useEffect(() => {
    if (onClear === true) {
      allPiList({ pageNo: 0 });
      setOnClear(false);
    }
  }, [onClear]);

  const currentUserPendingPI = () => {
    const payload = {
      orgId: [orgId],
      sourceId: [locId],
      purchaseIndentNo: [searchIndent],
      deliveryLocation: [],
      requestedOn: '',
      expectedDeliveryDate: '',
      shippingMethod: [],
      costCenter: [],
      status: ['CREATED'],
      assignedTo: [],
      assignedBy: [uidx],
      createdBy: [],
      user: 'testuser',
    };
    getAllPurchaseIndent(payload)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS') {
          setCurrUserPIList(res?.data?.data?.purchaseIndentRequestList?.length);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };
  let retryCount = 0;
  const allPiList = async ({ pageNo }) => {
    try {
      if (isMobileDevice) {
        setInfiniteLoader(true);
      }

      setPageState((prev) => ({ ...prev, loading: true }));
      if (pageNo === 0 || !isMobileDevice) {
        setLoader(true);
      }

      let obj = {
        status: filterObjectMain?.status?.value ? [filterObjectMain?.status?.value] : [],
        assignedBy: filterObjectMain?.selectedUser?.value ? [filterObjectMain?.selectedUser?.value] : [],
      };
      if (isMobileDevice && Object.keys(filters)?.length) {
        const status = filters?.['status']?.[0]?.value ? [filters?.['status']?.[0]?.value] : [];
        const assignedBy = filters?.['users']?.[0]?.value ? [filters?.['users']?.[0]?.value] : [];
        obj = {
          status: status,
          assignedBy: assignedBy,
        };
      }

      const payload = {
        page: pageNo,
        size: pageState.pageSize,
        orgId: [orgId],
        search: debouncedSearchValue,
        sourceLocation: [locId],
        ...obj,
      };

      if (response?.data?.data?.page !== null) setPageState((prev) => ({ ...prev, page: pageNo }));

      const response = await getAllPurchaseIndent(payload);
      const responseData = response?.data?.data;

      if (response?.data?.status === 'ERROR') {
        if (isMobileDevice) {
          setApplyFilter(false);
          setIsFilterOpened(false);
        }
        setErrorComing(true);
        if (pageNo === 0) setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        showSnackbar(response?.data?.message, 'error');
        setInfiniteLoader(false);
        setLoader(false);
        return;
      }

      if (responseData?.code === 'ECONNRESET') {
        if (retryCount < 3) {
          retryCount++;
          allPiList({ pageNo: 0 });
          showSnackbar('Some Error Occurred, Try again later.', 'error');
          setLoader(false);
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
        }
      } else {
        const dataArr = responseData;
        if (dataArr?.purchaseIndentRequestList?.length === 0) {
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
          setErrorComing(true);
          if (pageNo > 0) showSnackbar('No Data Found', 'error');
          if (pageNo === 0) setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
          setInfiniteLoader(false);
          setLoader(false);
          return;
        }

        const dataRow = dataArr?.purchaseIndentRequestList?.map((row) => ({
          createdOn: row?.createdOn ? dateFormatter(row?.createdOn) : '-----',
          createdOnMobile: row?.createdOn ? row.createdOn : null,
          purchaseIndentNo: row?.purchaseIndentNo || '-----',
          deliveryLocation: row?.deliveryLocation ? textFormatter(row?.deliveryLocation) : '-----',
          assignedTo: row?.assignedTo ? row?.assignedTo : '',
          expectedDeliveryDate: row?.expectedDeliveryDate ? dateFormatter(row?.expectedDeliveryDate) : '-----',
          status: row?.status || '-----',
          preferredVendor: row?.preferredVendor || 'NA',
          createdBy: row?.createdBy,
          estimatedValue: row?.estimatedValue,
        }));

        if (dataRow.length > 0) {
          if (isMobileDevice && pageNo > 0) {
            // Append new data on mobile devices
            setPageState((prev) => ({
              ...prev,
              dataRows: [...prev.dataRows, ...dataRow],
            }));
          } else {
            // Replace data on non-mobile devices
            setPageState((prev) => ({
              ...prev,
              dataRows: dataRow,
            }));
          }
          if (responseData?.totalResults === responseData?.pageResults) {
            setShowViewMore(false);
          } else {
            if (!showViewMore) {
              setShowViewMore(true);
            }
          }

          setPageState((prev) => ({
            ...prev,
            // page: pageNo,
            totalPages: responseData?.totalPage,
            totalResults: responseData?.totalResults,
            loading: false,
          }));
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
        } else {
          if (isMobileDevice) {
            setApplyFilter(false);
            setIsFilterOpened(false);
          }
          setErrorComing(true);
          setInfiniteLoader(false);
          setLoader(false);
          if (pageNo === 0) setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
          return;
        }

        setInfiniteLoader(false);
        setErrorComing(false);
        setLoader(false);
      }
    } catch (err) {
      if (err?.response?.status === 429) {
        allPiList({ pageNo: 0 });
      } else {
        const errorMessage = err?.response?.data?.message || 'An unexpected error occurred';
        showSnackbar(errorMessage, 'error');
        setLoader(false);
        setInfiniteLoader(false);
        setErrorComing(true);
        if (isMobileDevice) {
          setApplyFilter(false);
          setIsFilterOpened(false);
        }
      }
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  const navigateToDetailsPage = (row) => {
    if (row?.status === 'DRAFT') {
      localStorage.setItem('piNum', row?.purchaseIndentNo);
      navigate(`/purchase/purchase-indent/create-purchase-indent/${row?.purchaseIndentNo}`);
    } else {
      navigate(`/purchase/purchase-indent/details/${row?.purchaseIndentNo}`);
    }
  };

  const handleNextListingPage = () => {
    allPiList({ pageNo: pageState?.page + 1 });
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <Box
        className={`${
          isMobileDevice
            ? 'purchase-indent-new-header'
            : // 'table-css-fix-box-scroll-pi'
              'search-bar-filter-and-table-container'
        }`}
      >
        {!isMobileDevice && (
          <SoftBox
            // className="vendors-filter-div"
            className="search-bar-filter-container"
          >
            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox>
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search Purchase Indent"
                      value={searchIndent}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchFliter}
                    />
                    {searchIndent.length !== 0 && <ClearSoftInput clearInput={handleClearSearchInput} />}
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
                </SoftBox>
              </Grid>
              <Grid item>
                <SoftBox className="content-space-between">
                  <SoftBox className="vendors-new-btn">
                    <SoftButton variant="solidWhiteBackground" onClick={handleGo}>
                      <AddIcon />
                      Indent
                    </SoftButton>
                  </SoftBox>
                  {/* filter  */}
                  <PurchaseIndentFilter
                    // filterObject={filterObject}
                    filterObjectMain={filterObjectMain}
                    setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                    // fn
                    allPiList={allPiList}
                  />
                </SoftBox>
              </Grid>
            </Grid>
            <Grid container spacing={2} className="payment-summary">
              <Grid item xs={12} mt={-1}>
                <SoftTypography className="payment-heading-summary">Pending approval summary</SoftTypography>
              </Grid>
              <Grid item xs={12} mt={1}>
                <SoftTypography className="payment-sub-heading-summary">
                  <b>Total pending approval PI's for current user: </b>
                  <span style={{ fontSize: '18px' }}> {currUserPIList}</span>
                </SoftTypography>
              </Grid>
            </Grid>
          </SoftBox>
        )}
        {loader && infiniteLoader === false ? (
          <Box
            sx={{
              height: '70vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </Box>
        ) : tabs.tab1 ? (
          !isMobileDevice ? (
            <SoftBox>
              <SoftBox
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
                  '& .super-app.Delete': {
                    color: 'black',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Close': {
                    color: 'red',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Draft': {
                    color: 'red',
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
                    sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                    className="data-grid-table-boxo"
                    rows={pageState?.dataRows}
                    rowCount={pageState?.totalResults}
                    loading={pageState?.loading}
                    pagination
                    page={pageState?.page}
                    pageSize={pageState?.pageSize}
                    getRowId={(row) => row?.purchaseIndentNo}
                    disableSelectionOnClick
                    onCellDoubleClick={(rows) => navigateToDetailsPage(rows?.row)}
                    columns={columns}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      allPiList({ pageNo: newPage });
                      dispatch(setPage(newPage));
                    }}
                    onPageSizeChange={(newPageSize) => {
                      setPageState((old) => ({ ...old, pageSize: newPageSize }));
                    }}
                  />
                )}
              </SoftBox>
            </SoftBox>
          ) : (
            <div
              className="pi-listing-card-main-div"
              style={{ width: '100%', height: 'auto', paddingBottom: '10px !important' }}
            >
              {loader ? (
                <div className="circular-progress-div">
                  <CircularProgress sx={{ color: '#0562fb !important' }} />
                </div>
              ) : pageState?.dataRows?.length ? (
                <div className="pi-listing-card-main-div">
                  {pageState?.dataRows?.map((row) => (
                    <PICard
                      key={row.purchaseIndentNo}
                      data={row}
                      navigateToDetailsPage={navigateToDetailsPage}
                      locationName={locationName}
                      userInfo={user_details}
                    />
                  ))}
                  {showViewMore && (
                    <div className="view-more-listing-cards" onClick={handleNextListingPage}>
                      {infiniteLoader ? (
                        <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
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
                </div>
              ) : (
                <NoDataFoundMob />
              )}
            </div>
          )
        ) : null}
      </Box>
    </DashboardLayout>
  );
};

export default PurchaseIndent;
