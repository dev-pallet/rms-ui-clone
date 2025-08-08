import { Box, CircularProgress, Grid } from '@mui/material';
import {
  ClearSoftInput,
  dateFormatter,
  isSmallScreen,
  noDatagif,
  roundToTwoDecimalPlaces,
} from '../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { fetchReturnSummary, inventoryReturnJobFilter } from '../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReturnFilter from './components/Filter/returnFilter';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from '../../../components/Spinner';
import Status from '../Common/Status';
import PurchaseReturnCard from './components/purchase-return-card';
import NoDataFoundMob from '../Common/mobile-new-ui-components/no-data-found';
import { useDebounce } from 'usehooks-ts';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getFilters, setFilters } from '../../../datamanagement/Filters/commonFilterSlice';
import CommonStatus from '../Common/mobile-new-ui-components/status';

const PurchaseReturns = ({ mobileSearchedValue, filters, setIsFilterOpened, applyFilter, setApplyFilter }) => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);

  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [loader, setLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(true);
  const [onClear, setOnClear] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const debouncedTempTitle = useDebounce(tempTitle || mobileSearchedValue, 500);
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: persistedFilters?.page || 0,
    pageSize: 10,
  });
  const [summaryData, setSummaryData] = useState({});
  const [viewMoreLoader, setViewMoreLoader] = useState(false);
  const [viewMorePageNumber, setViewMorePageNumber] = useState(0);

  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);

  const isFirstRender = useRef(true);
  const [dataRows, setDataRows] = useState([]);
  const columns = [
    {
      field: 'createdOn',
      headerName: 'Date',
      minWidth: 180,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'returnId',
      headerName: 'Return ID',
      minWidth: 80,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'vendorName',
      headerName: 'Vendor',
      minWidth: 180,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'grandTotal',
      headerName: 'Return value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'userCreated',
      headerName: 'Created By',
      minWidth: 140,
      flex: 0.75,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'status',
      headerName: 'Return status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
      renderCell: (cellValues) => {
        return (
          <>
            <Status label={cellValues?.value} />
          </>
        );
      },
    },
    // {
    //   field: 'refundMethod',
    //   headerName: 'Refund Method',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   minWidth: 40,
    //   flex: 0.75,
    // },
    {
      field: 'totalItems',
      headerName: 'Total Items',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 20,
      flex: 0.75,
    },
  ];

  const selectedFilters = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          status: []
        };
  }, [persistedFilters]);

  const filterObj = {
    page: pageState?.page,
    size: pageState?.pageSize,
    // "sortBy": "string",
    // "sortOrder": "string",
    orgId: orgId,
    locId: [locId],
    search: debouncedTempTitle,
    status: selectedFilters?.status?.value ? [selectedFilters?.status?.value] : [],
  };
  let dataArr,
    dataRow = [];
  let retryCount = 0;

  const getAllPurchaseFilter = (pageNo) => {
    if (isMobileDevice) {
      setInfiniteLoader(true);
    }
    if(pageNo){
      filterObj.page = pageNo;
      setPageState((old) => ({ ...old, page: pageNo }));
    }
    if (pageState?.page >= 0 && !isMobileDevice) {
      setLoader(true);
    }
    if (pageNo && pageNo + 1 > 0 && isMobileDevice) {
      setViewMoreLoader(true);
    }
    if (filterObj?.page >= 0 && !isMobileDevice) {
      setLoader(true);
    }

    // setLoader(true);
    setErrorComing(false);
    setPageState((old) => ({ ...old, loader: true }));
    inventoryReturnJobFilter(filterObj)
      .then((res) => {
        if (res?.data?.data?.code === 'ECONNRESET') {
          if (retryCount < 3) {
            getAllPurchaseFilter();
            retryCount++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows: [] }));
            setLoader(false);
          }
        } else {
          const response = res?.data?.data;
          if (response?.es) {
            if (isMobileDevice) {
              setInfiniteLoader(false);
            }
            setLoader(false);
            setErrorComing(true);
            setPageState((old) => ({ ...old, loader: false, datRows: [] }));
            return;
          }
          dataArr = response?.returnJobList;
          if (dataArr?.length > 0) {
            const outputArray = [];

            dataArr?.forEach((obj) => {
              if (obj?.returnList && obj?.returnList?.length > 0) {
                obj?.returnList?.forEach((returnItem) => {
                  outputArray?.push(returnItem);
                });
              } else {
                outputArray?.push(obj);
              }
            });
            dataRow?.push(
              outputArray?.map((row) => ({
                returnId: row?.returnId ? row?.returnId : '----',
                returnJobId: row?.returnJobId ? row?.returnJobId : '----',
                vendorName: row?.vendorName ? row?.vendorName : '----',
                userCreated: row?.userCreated ? row?.userCreated : '----',
                refundMethod: row?.refundMethod ? row?.refundMethod : '----',
                status: row?.status ? row?.status : '----',
                eventStatus: row?.eventStatus ? row?.eventStatus : '----',
                grandTotal:
                  row?.returnAmount === 0
                    ? 0
                    : row?.returnAmount
                    ? roundToTwoDecimalPlaces(row?.returnAmount)
                    : row?.grossAmount === 0
                    ? 0
                    : row?.grossAmount
                    ? roundToTwoDecimalPlaces(row?.grossAmount)
                    : '----',
                totalItems: row?.returnJobItemList?.length ? row?.returnJobItemList?.length : '----',
                createdOn: row?.createdOn
                  ? // convertUtcToAsiaKolkata(row?.createdOn)
                    dateFormatter(row?.createdOn)
                  : '-----',
              })),
            );
            if (isMobileDevice) {
              setInfiniteLoader(false);
            }
            if(isMobileDevice && pageNo + 1 > 1){
              setDataRows((prev) => [...prev, ...dataRow[0]]);
            }else{
              setDataRows(dataRow[0]);
            }
            setPageState((old) => ({
              ...old,
              loader: false,
              datRows: dataRow[0] || [],
              total: response?.totalResult || 0,
            }));
            setLoader(false);
            setErrorComing(false);
            if (response?.totalPage - 1 === response?.currentPage) {
              setShowViewMore(false);
            } else {
              if (!showViewMore) {
                setShowViewMore(true);
              }
            }
          } else {
            if (isMobileDevice) {
              setInfiniteLoader(false);
            }
            setLoader(false);
            setErrorComing(true);
            setPageState((old) => ({ ...old, loader: false, datRows: [] }));
          }
        }
      })
      .catch((err) => {
        if (isMobileDevice) {
          setInfiniteLoader(false);
        }
        showSnackbar(err?.response?.data?.message, 'error');
        setPageState((old) => ({ ...old, loader: false, datRows: [] }));
        setLoader(false);
        setErrorComing(true);
      });
  };

  const fetchingSummaryDetails = () => {
    fetchReturnSummary(orgId, locId)
      .then((res) => {
        setSummaryData(res?.data?.data);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Something went wrong', 'error');
      });
  };

  useEffect(() => {
    getAllPurchaseFilter();
  // }, [pageState.page, debouncedTempTitle]);  
  },[selectedFilters])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // set to false after first render
      return;
    }
    dispatch(setFilters({ ...persistedFilters, search: debouncedTempTitle, page: 0 }));
    setPageState((old) => ({ ...old, page: 0 }));
  }, [debouncedTempTitle]);

  useEffect(() => {
    if (orgId && locId) {
      fetchingSummaryDetails();
    }
  }, [orgId, locId]);

  const handleSearchFliter = (e) => {
    const inputVal = e.target.value;
    if (inputVal.length === 0) {
      setTempTitle('');
    } else {
      setTempTitle(e.target.value);
    }
  };

  const handleGo = () => {
    navigate('/purchase/purchase-returns/new-return');
    localStorage.removeItem('returnJobId');
  };

  const navigateToDetailsPage = (row) => {
    if (row?.row?.returnId === '----' && row?.row?.status === 'DRAFT') {
      navigate(`/purchase/purchase-returns/new-return/${row?.row?.returnJobId}`);
      localStorage.setItem('returnJobId', row?.row?.returnJobId);
    } else {
      navigate(`/purchase/purchase-returns/details/${row?.row?.returnId}`);
    }
  };

  const handleClearSearchInput = () => {
    setTempTitle('');
  };
  
  const handleNextListingPage = (pageNo) => {
    getAllPurchaseFilter(pageNo);
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {!isMobileDevice ? (
        <SoftBox className="search-bar-filter-and-table-container">
          <SoftBox className="search-bar-filter-container">
            <Grid container spacing={2} className="filter-product-list-cont">
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox sx={{ position: 'relative' }}>
                  <SoftInput
                    className="filter-add-list-cont-bill-search"
                    placeholder="Search Return"
                    value={tempTitle}
                    icon={{ component: 'search', direction: 'left' }}
                    onChange={handleSearchFliter}
                  />
                  {tempTitle !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                </SoftBox>
              </Grid>
              <Grid item md={4} sm={4} xs={12} style={{ marginLeft: 'auto' }}>
                <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                  <SoftButton onClick={handleGo} variant="solidWhiteBackground">
                    <AddIcon />
                    Return
                  </SoftButton>
                  {/* filter  */}
                  <ReturnFilter
                    selectedFilters={selectedFilters} // payload
                    // setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                    // fn
                    // returnData={getAllPurchaseFilter}
                  />
                </SoftBox>
              </Grid>
            </Grid>
            <Grid container spacing={2} className="payment-summary">
              <Grid item xs={12}>
                <SoftTypography className="payment-heading-summary">Return Summary</SoftTypography>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  justifyContent="space-between"
                  // py={2}
                  px={1}
                  alignItems="center"
                >
                  <Grid item xs={2.5} md={2.5} xl={2.5} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">
                        Total outstanding recievables
                      </SoftTypography>
                      <SoftTypography className="payment-text-summary">
                        ₹
                        {`${summaryData?.totalOutstanding || '0'} from ${
                          summaryData?.totalOutstandingCount || '0'
                        } returns`}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} md={2} xl={2} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary" style={{ color: '#ed9e17' }}>
                        Open debit notes
                      </SoftTypography>
                      <SoftTypography className="payment-text-summary">
                        ₹{`${summaryData?.openDebitNote || '0'} from ${summaryData?.openDebitNoteCount || '0'} returns`}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} md={2} xl={2} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Replacements</SoftTypography>
                      <SoftTypography className="payment-text-summary">
                        ₹{`${summaryData?.replacement || '0'} from ${summaryData?.replacementCount || '0'} returns`}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} md={2} xl={2} sx={{ borderRight: '2px solid #aab2bf' }}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Material pickup</SoftTypography>
                      <SoftTypography className="payment-text-summary">
                        ₹{`${summaryData?.materialPickUp || '0'} pending pickup`}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} md={2} xl={2}>
                    <SoftBox className="payment-text-box-summary payment-no-border" style={{ border: 'none' }}>
                      <SoftTypography className="payment-sub-heading-summary">Material delivery</SoftTypography>
                      <SoftTypography className="payment-text-summary">
                        ₹{`${summaryData?.materialDelivery || '0'} pending delivery`}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </SoftBox>

          {loader && (
            <Box className="centerspinner" style={{ height: 445, width: '100%' }}>
              <Spinner />
            </Box>
          )}
          {!loader && (
            <SoftBox style={{ height: 445, width: '100%' }} className="dat-grid-table-box">
              {errorComing && pageState.datRows.length === 0 ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : (
                <>
                  {pageState.loader && <Spinner />}
                  {!pageState.loader && (
                    <DataGrid
                      sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                      columns={columns}
                      rows={dataRows}
                      // rows={pageState.total}
                      getRowId={(row) => (row?.returnId !== '----' ? row?.returnId : row?.returnJobId)}
                      rowCount={pageState.total || 0}
                      // loading={pageState.loader}
                      pagination
                      page={pageState?.page}
                      pageSize={pageState?.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => {
                        dispatch(setFilters({ ...persistedFilters, page: newPage }));
                        setPageState((old) => ({ ...old, page: newPage }));
                      }}
                      onCellClick={(row) => navigateToDetailsPage(row)}
                      disableSelectionOnClick
                    />
                  )}
                </>
              )}
            </SoftBox>
          )}
        </SoftBox>
      ) : (
        <>
          {loader ? (
            <Box className="centerspinnerI">
              <Spinner />
            </Box>
          ) : !errorComing ? (
            <>
              <div className="purchase-bills-main-card">
                {dataRows?.map((purchase, index) => {
                  return <PurchaseReturnCard data={purchase} index={index} />;
                })}
                {showViewMore && (
                  <div className="view-more-listing-cards" onClick={() => handleNextListingPage(pageState?.page + 1)}>
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
            </>
          ) : (
            <NoDataFoundMob />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default PurchaseReturns;
