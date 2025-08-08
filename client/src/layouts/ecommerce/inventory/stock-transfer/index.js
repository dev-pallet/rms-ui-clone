import './index.css';
import { Box, CircularProgress, Grid } from '@mui/material';
import {
  ClearSoftInput,
  CopyToClipBoard,
  dateFormatter,
  formatNumber,
  isSmallScreen,
  noDatagif,
} from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { allStockTransfer, getStockTransferSummaryData } from '../../../../config/Services';
import { debounce } from 'lodash';
import {
  getFilters,
  getPage,
  getPageTitle,
  getSearchValue,
  resetCommonReduxState,
  setPage,
  setPageTitle,
  setSearchValueFilter,
} from '../../../../datamanagement/Filters/commonFilterSlice';
import { useDebounce } from 'usehooks-ts';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import CommonSearchBar from '../../Common/MobileSearchBar';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import NoDataFound from '../../Common/No-Data-Found';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import Status from '../../Common/Status';
import StockTransferFilter from './components/filter/StockTransferFilter';
import TableSummaryDiv from '../../Common/new-ui-common-components/table-summary-div/TableSummaryDiv';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import PurchaseAdditionalDetails from '../../purchase/ros-app-purchase/components/purchase-additional-details';
import TransferOutCard from './components/Transferout-mobile-card';

export const StockTransfer = () => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const persistedPage = useSelector(getPage);
  const persistedSearchValue = useSelector(getSearchValue);
  const pageTitle = useSelector(getPageTitle);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  // <--- states
  const [loader, setLoader] = useState(false);
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const [dataRows, setTableRows] = useState([]);
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [searchNumber, setSearchNumber] = useState(persistedSearchValue || '');
  const [showViewMore, setShowViewMore] = useState(true);

  // const [debouceSearch, setDebouceSearch] = useState('');
  const debouncedSearchValue = useDebounce(searchNumber, 300);
  const [transferSummary, setTransferSummary] = useState({});

  const filterObjectMain = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          status: '',
          from: '',
          to: '',
        };
  }, [persistedFilters]);

  //   table pagestate
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    totalPages: 0,
    totalResults: 0,
    page: 0,
    pageSize: 10,
  });
  // --->

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'transferId',
      headerName: 'Transfer ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'stockValue',
      headerName: 'Stock Value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'origin',
      headerName: 'Origin',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'destination',
      headerName: 'Destination',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
  ];

  const summaryArray = useMemo(
    () => [
      {
        title: 'Stock Transfer Computation',
        value: (
          <>
            <CurrencyRupeeIcon />
            {/* 26,894 from 89 products within 30 days */}
            {`${formatNumber(transferSummary?.totalSTNValue)} from ${transferSummary?.stnCount || 'NA'} transfers`}
          </>
        ),
      },
      {
        title: 'Stocks Out',
        value: (
          <>
            <CurrencyRupeeIcon />
            {/* 26,894 from 89 products within 30 days */}
            {`${formatNumber(transferSummary?.outgoingStockValue)} from ${
              transferSummary?.outgoingStockCount || 'NA'
            } transfers`}
          </>
        ),
      },
      {
        title: 'Stocks In',
        value: (
          <>
            <CurrencyRupeeIcon />
            {/* 26,894 from 89 products within 30 days */}
            {`${formatNumber(transferSummary?.incomingStockValue)} from ${
              transferSummary?.incomingStockCount || 'NA'
            } transfers`}
          </>
        ),
      },
      {
        title: 'Pending Outward',
        value: (
          <>
            <CurrencyRupeeIcon />
            {/* 26,894 from 89 products within 30 days */}
            {`${formatNumber(transferSummary?.pendingOutward)} pending pickup`}
          </>
        ),
      },
      {
        title: 'Pending Inward',
        value: (
          <>
            <CurrencyRupeeIcon />
            {/* 26,894 from 89 products within 30 days */}
            {`${formatNumber(transferSummary?.pendingInward)} pending delivery`}
          </>
        ),
      },
    ],
    [transferSummary],
  );

  //   functions
  const handleSearchNumber = (e) => {
    const value = e.target.value;
    setSearchNumber(value);
    dispatch(setSearchValueFilter(value));
    // let orderName = e.target.value;
    // if (orderName?.length === 0) {
    //   setSearchNumber('');
    //   debouncedSearch('');
    // } else {
    //   setSearchNumber(e.target.value);
    //   debouncedSearch(e.target.value);
    // }
    // for outward - dest loc = null
    // for inward - source loc = null
  };

  // clear invoices search input fn
  const handleClearSearchInput = () => {
    setSearchNumber('');
    dispatch(setSearchValueFilter(''));
  };

  const handleNewTransfer = () => {
    setErrorComing(true);
    localStorage.setItem('newStockTransfer', true);
    navigate('/inventory/new-transfers');
  };

  const listAllStock = async ({ pageNo, filterObject }) => {
    try {
      if (isMobileDevice) {
        setInfiniteLoader(true);
      }

      setLoader(true);
      setPageState((prev) => ({ ...prev, page: pageNo, loader: true }));

      const obj = filterObject
        ? filterObject
        : {
            status: filterObjectMain?.status?.value ? [filterObjectMain?.status?.value] : [],
            from: filterObjectMain?.startDate || null,
            to: filterObjectMain?.endDate || null,
          };

      const payload = {
        page: pageNo,
        size: 10,
        searchInput: debouncedSearchValue,
        sourceOrgId: [orgId],
        // destinationLocId: [locId],
        // sourceLocId: [locId],
        sourceLocId:
          filterObjectMain?.transferType?.value === 'outward'
            ? [locId]
            : filterObjectMain?.transferType?.value === 'inward'
            ? null
            : [locId],
        destinationLocId:
          filterObjectMain?.transferType?.value === 'inward'
            ? [locId]
            : filterObjectMain?.transferType?.value === 'outward'
            ? null
            : [locId],
        // status: status || selectedStatus,
        // from: '2024-06-28',
        // to: '2024-06-28',
        ...obj,
      };

      const res = await allStockTransfer(payload);
      // console.log('stock transfer lists', res);
      if (res?.data?.data?.es === 0) {
        const data = res?.data?.data?.expressPurchaseOrderList;
        const rows = data?.map((row) => {
          return {
            destination: row?.destinationLocationName ? row?.destinationLocationName : 'NA',
            date: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
            transferId: row?.stnNumber ? row?.stnNumber : 'NA',
            transferValue: row?.grossAmount ?? 'NA',
            status: row?.status ? row?.status : 'NA',
            origin: row?.sourceLocationName ? row?.sourceLocationName : 'NA',
            type:
              row?.sourceLocationId === locId
                ? 'Outward'
                : row?.destinationLocationId === locId
                ? 'Inward'
                : 'External',
            stockValue: row?.grossAmount ?? 'NA',
            createdBy: row?.userCreated || 'NA',
          };
        });

        const showViewMoreButton = (payload.page + 1) * pageState?.pageSize < res?.data?.data?.totalResults;
        setShowViewMore(showViewMoreButton);

        if (isMobileDevice) {
          if (pageNo === 0) {
            setTableRows(rows);
          } else {
            setTableRows((prev) => [...prev, ...rows]);
          }
        } else {
          setTableRows(rows);
        }

        setPageState((prev) => ({
          ...prev,
          totalPages: res?.data?.data?.totalPage,
          totalResults: res?.data?.data?.totalResults,
          loader: false,
        }));
        setLoader(false);
        // showSnackbar('Success', 'success');
        setErrorComing(false);
        setInfiniteLoader(false);
      } else if (res?.data?.data?.es === 1) {
        showSnackbar(res?.data?.data?.message, 'error');
        setLoader(false);
        setErrorComing(true);
        setInfiniteLoader(false);
        setPageState((prev) => ({ ...prev, loader: false }));
      }
    } catch (err) {
      setLoader(false);
      setErrorComing(true);
      setTableRows([]);
      setInfiniteLoader(false);
      console.log(err);
      setPageState((prev) => ({ ...prev, loader: false }));
    }
  };

  const getSummaryData = async () => {
    try {
      setSummaryLoader(true);

      const response = await getStockTransferSummaryData(locId);
      // console.log('res', response.data.data);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setSummaryLoader(false);
        return;
      }

      setTransferSummary(response?.data?.data);
      setSummaryLoader(false);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
      setTransferSummary({});
      setSummaryLoader(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('newStockTransfer')) {
      localStorage.removeItem('newStockTransfer');
    }
    if (pageTitle !== 'stock-transfer') {
      dispatch(resetCommonReduxState());
      dispatch(setPageTitle('stock-transfer'));
    }

    getSummaryData();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (debouncedSearchValue !== '') {
        listAllStock({ pageNo: 0 });
      } else {
        listAllStock({ pageNo: persistedPage });
      }
    }
  }, [debouncedSearchValue, filterObjectMain, isInitialized]);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {/* {isMobileDevice && (
        <SoftBox>
          <SoftBox sx={{ position: 'relative', margin: '10px 0px' }}>
            <MobileSearchBar
              value={searchNumber}
              placeholder={'Search...'}
              isScannerSearchbar={false}
              onChangeFunction={handleSearchNumber}
            />
            <StockTransferFilter
              filterObjectMain={filterObjectMain}
              isMobileDevice={isMobileDevice}
              pageState={pageState}
            />
          </SoftBox>
        </SoftBox>
      )} */}
      {!isMobileDevice ? (
        <SoftBox className="search-bar-filter-and-table-container">
          <SoftBox className="search-bar-filter-container">
            <Grid container spacing={2} className="filter-product-list-cont">
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox sx={{ position: 'relative' }}>
                  <SoftInput
                    placeholder="Search by stock transfer ID"
                    value={searchNumber}
                    icon={{ component: 'search', direction: 'left' }}
                    onChange={handleSearchNumber}
                  />
                  {searchNumber !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                </SoftBox>
              </Grid>
              <Grid item md={6.5} sm={4} xs={12}>
                <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                  <SoftButton variant="solidWhiteBackground" onClick={handleNewTransfer}>
                    <AddIcon sx={{ mr: '5px' }} />
                    Transfer
                  </SoftButton>
                  <StockTransferFilter filterObjectMain={filterObjectMain} />
                </SoftBox>
              </Grid>
            </Grid>

            {/* summary div  */}
            <TableSummaryDiv
              summaryHeading={'Transfer Summary'}
              summaryArray={transferSummary !== undefined ? summaryArray : []}
              loader={summaryLoader}
              length={summaryArray.length}
            />
          </SoftBox>
          <SoftBox
            className="dat-grid-table-box"
            sx={{
              height: 400,
              width: '100%',
            }}
          >
            {errorComing && pageState.datRows.length === 0 ? (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>

                <h3 className="no-data-text-I">NO DATA FOUND</h3>
              </SoftBox>
            ) : (
              <>
                {loader ? (
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
                ) : (
                  <DataGrid
                    sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                    loading={pageState.loader}
                    rows={dataRows}
                    // sx={{ cursor: 'pointer' }}
                    className="data-grid-table-boxo"
                    // autoPageSize
                    disableSelectionOnClick
                    columns={columns}
                    page={pageState?.page}
                    getRowId={(row) => row?.transferId}
                    pagination
                    paginationMode="server"
                    rowCount={pageState?.totalResults}
                    pageSize={pageState?.pageSize}
                    // onCellClick={(rows) => navigate(`/products/transfers/${rows.id}`)}
                    onPageChange={(newPage) => {
                      // setPageState((old) => ({ ...old, page: newPage + 1 }));\
                      listAllStock({ pageNo: newPage });
                      dispatch(setPage(newPage));
                    }}
                    onPageSizeChange={(newPageSize) => {
                      setPageState((old) => ({ ...old, pageSize: newPageSize }));
                    }}
                    onCellClick={(rows) => {
                      // for draft
                      if (rows.field !== 'transferId' && rows.row.status === 'DRAFT') {
                        localStorage.removeItem('newStockTransfer');
                        // localStorage.setItem('stnNumber',rows.row.transferId);
                        navigate(`/inventory/new-transfers/${rows?.row?.transferId}`);
                      }
                      // except draft
                      if (rows.field !== 'transferId' && rows.row.status !== 'DRAFT') {
                        navigate(`/inventory/stock-transfer-details/${rows?.id}`);
                      }
                    }}
                  />
                )}
              </>
            )}
          </SoftBox>
        </SoftBox>
      ) : (
        <>
          <SoftBox>
            <PurchaseAdditionalDetails additionalDetailsArray ={summaryArray}/>
            <SoftBox sx={{ position: 'relative', margin: '10px 0px' }}>
              <MobileSearchBar
                value={searchNumber}
                placeholder={'Search...'}
                isScannerSearchbar={false}
                onChangeFunction={handleSearchNumber}
              />
            </SoftBox>
            <SoftBox>
              <StockTransferFilter
                filterObjectMain={filterObjectMain}
                isMobileDevice={isMobileDevice}
                pageState={pageState}
              />
            </SoftBox>
          </SoftBox>
          <SoftBox className="ros-app-purchase-component-main-div">
            <SoftBox>
              <SoftBox className="pi-listing-card-main-div" sx={{marginTop:" 10px"}}>
                {!errorComing ? (
                  <>
                    {dataRows.map((product) => (
                      <TransferOutCard data={product} />
                    ))}

                    {showViewMore && (
                      <ViewMore
                        loading={infiniteLoader}
                        handleNextFunction={() => listAllStock({ pageNo: pageState.page + 1 })}
                      />
                    )}
                    {!infiniteLoader && !dataRows?.length && <NoDataFound message={'No Products Found'} />}
                  </>
                ) : (
                  <SoftBox className="no-data-found">
                    <SoftTypography fontSize="14px">No Data Found</SoftTypography>
                  </SoftBox>
                )}
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </>
      )}
      <br />
    </DashboardLayout>
  );
};
