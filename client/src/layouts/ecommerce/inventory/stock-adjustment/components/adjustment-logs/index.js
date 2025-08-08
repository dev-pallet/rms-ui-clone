import './index.css';
import { CircularProgress, Grid, Popover } from '@mui/material';
import {
  ClearSoftInput,
  CopyToClipBoard,
  dateFormatter,
  formatNumber,
  isSmallScreen,
  noDatagif,
  productIdByBarcode,
  textFormatter,
} from '../../../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { buttonStyles } from '../../../../Common/buttonColor';
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
} from '../../../../../../datamanagement/Filters/commonFilterSlice';
import {
  getStockAdjustmentData,
  getStockAdjustmentDetails,
  getStockAdjustmentSummary,
} from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import AdjustmentLogsMobileCard from './components/stock-adjustment-logs-mobile';
import CommonSearchBar from '../../../../Common/MobileSearchBar';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import StockAdjustmentLogsFilter from './components/filter';
import TableSummaryDiv from '../../../../Common/new-ui-common-components/table-summary-div/TableSummaryDiv';
import MobileSearchBar from '../../../../Common/mobile-new-ui-components/mobile-searchbar';
import ViewMore from '../../../../Common/mobile-new-ui-components/view-more';
import PurchaseAdditionalDetails from '../../../../purchase/ros-app-purchase/components/purchase-additional-details';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';
import dayjs from 'dayjs';

export const StockAdjustmentLogs = ({
  editInventoryAdjustment,
  tabName,
  handleTabName,
  refreshInventoryAdjustmentPage,
  setRefreshInventoryAdjustmentPage,
}) => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const persistedPage = useSelector(getPage);
  const persistedSearchValue = useSelector(getSearchValue);
  const pageTitle = useSelector(getPageTitle);

  const isMobileDevice = isSmallScreen();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const showSnackbar = useSnackbar();

  // <--- states
  const [infiniteLoader, setInfiniteLoader] = useState(false);

  const [errorComing, setErrorComing] = useState(false);

  const [searchValue, setSearchValue] = useState(persistedSearchValue || '');
  const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed

  // const [mobileScreenTab, setMobileScreenTab] = useState(tabName);
  const [analysisSummary, setAnalysisSummary] = useState({});
  const [additionalData, setAdditionalData] = useState({});
  const [additionalDataLoader, setAdditionalDataLoader] = useState(false);
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  // const [isAdjusted, setIsAdjusted] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const filterObjectMain = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          vendorId: '',
          category: '',
          brand: '',
          startDate: '',
          endDate: '',
        };
  }, [persistedFilters]);

  //   table pagestate
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: persistedPage,
    totalResults: 0,
    totalPages: 0,
    pageSize: 10,
  });

  //  stock adjustment logs more info modal
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModalStockAdjustmentLogs, setOpenModalStockAdjustmentLogs] = useState(false);

  const handleOpenModalStockAdjustmentLogs = (event) => {
    setOpenModalStockAdjustmentLogs(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseModalStockAdjustmentLogs = () => {
    setOpenModalStockAdjustmentLogs(false);
    setAnchorEl(null);
  };
  // states --->

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'barcode',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'adjustedQuantity',
      headerName: 'Adjusted Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'adjustedValue',
      headerName: 'Adjusted Value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'stockInHand',
      headerName: 'Stock In Hand',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'batch',
      headerName: 'Batch',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
    },
    {
      field: '',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <InfoOutlinedIcon
          color="primary"
          sx={{ width: '1.5em', height: '1.5em' }}
          onClick={(e) => {
            handleOpenModalStockAdjustmentLogs(e);
            getStockAdjustmentAdditionalData(params);
          }}
        />
      ),
    },
  ];

  const summaryArray = [
    {
      title: 'Adjusted Value',
      value: (
        <>
          <CurrencyRupeeIcon />
          {/* 26,894 from 89 products within 30 days */}
          {`${formatNumber(analysisSummary?.totalAdjustedValue)} in last 30 days`}
        </>
      ),
    },
    {
      title: 'Expired Value',
      value: (
        <>
          {/* 6,894 from 33 products */}
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalExpiredValue)} from ${formatNumber(
            analysisSummary?.totalExpiredStock,
          )} products`}
        </>
      ),
    },
    {
      title: 'Manual Adjustments',
      value: (
        <>
          {/* 5,234 from 67 products */}
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalManualValue ?? NaN)} from ${formatNumber(
            analysisSummary?.totalManualStock,
          )} products`}
        </>
      ),
    },
    {
      title: 'Stock Count Adjustments',
      value: (
        <>
          {/* 234 from 17 products */}
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.stockCountValue)} from ${formatNumber(
            analysisSummary?.stockCount,
          )} products`}
        </>
      ),
    },

    {
      title: 'Wastage Value',
      value: (
        <>
          {/* 234 from 17 products */}
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalWastageValue)} from ${formatNumber(
            analysisSummary?.totalWastageStock,
          )} products`}
        </>
      ),
    },
  ];

  const handleSearchValue = (e) => {
    const value = e.target.value;
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setSearchValue(value);
    dispatch(setSearchValueFilter(value));
  };

  // clear search input fn
  const handleClearSearchInput = () => {
    setSearchValue('');
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    dispatch(setSearchValueFilter(''));
  };

  // get summary data
  const getStockAdjustmentSummaryData = async () => {
    try {
      setSummaryLoader(true);

      const payload = {
        locationId: [locId],
        orgId: [orgId],
        stockBalance: 'PRODUCT',
      };

      const response = await getStockAdjustmentSummary(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setSummaryLoader(false);
        return;
      }

      setAnalysisSummary(response?.data?.data?.data);
      setSummaryLoader(false);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
      setAnalysisSummary({});
      setSummaryLoader(false);
    }
  };

  // get adjusted stock details
  const getStockAdjustmentAdditionalData = async (data) => {
    const { barcode, adjustmentId, batch } = data.row;
    try {
      setAdditionalDataLoader(true);

      const payload = {
        locationId: locId,
        orgId: orgId,
        gtin: barcode,
        adjustmentId: adjustmentId,
        batchNo: batch,
      };

      const response = await getStockAdjustmentDetails(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setAdditionalData({});
        setAdditionalDataLoader(false);
        return;
      }

      if(isMobileDevice){
        setAdditionalData((prev) => ({ ...prev, [adjustmentId]: response?.data?.data?.data?.product[0] }));
      }else{
        setAdditionalData(response?.data?.data?.data?.product[0]);
      }
      setAdditionalDataLoader(false);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
      setAdditionalData({});
      setAdditionalDataLoader(false);
    }
  };

  // get all adjusted stocks list
  const getStockAdjustmentLists = async ({ pageNo, filterObject }) => {
    // category, vendor, brand, startDate, endDate
    try {
      if (isMobileDevice) {
        setInfiniteLoader(true);
      }

      setPageState((prev) => ({ ...prev, loading: true, page: pageNo }));

      const obj = filterObject
        ? filterObject
        : {
            vendorId: filterObjectMain?.vendor?.value || '',
            category: filterObjectMain?.category?.label || '',
            brand: filterObjectMain?.brand?.value || '',
            startDate: filterObjectMain?.startDate,
            endDate: filterObjectMain?.endDate,
          };

      const payload = {
        pageNo: pageNo,
        pageSize: pageState.pageSize,
        locationId: [locId],
        orgId: [orgId],
        searchBox: debouncedSearchValue,
        stockBalance: 'PRODUCT',
        ...obj,
      };

      const response = await getStockAdjustmentData(payload);

      if (response?.data?.data?.es) {
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        showSnackbar(response?.data?.data?.message, 'error');
        setInfiniteLoader(false);
        return;
      }

      const dataArr = response?.data?.data?.data?.data?.product || [];

      if (dataArr?.length === 0) {
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        setInfiniteLoader(false);
        return;
      }

      const showViewMoreButton =
      (payload.pageNo + 1) * pageState?.pageSize < response?.data?.data?.data?.totalResults;
      setShowViewMore(showViewMoreButton);

      const rowsData = dataArr?.map((row, index) => {
        return {
          id: index,
          title: row?.itemName ? textFormatter(row?.itemName) : 'NA',
          barcode: row?.barcode || 'NA',
          adjustedQuantity: row?.adjustedQuantity ?? 'NA',
          adjustedValue: row?.adjustedValue ?? 'NA',
          stockInHand: row?.stockInHand ?? 'NA',
          batch: row?.batch || 'NA',
          lastUpdated: row?.lastUpdated ? dayjs(row?.lastUpdated).format('DD MMM, YYYY') : 'NA',
          adjustmentId: row?.adjustmentId || 'NA',
        };
      });

      if (rowsData.length > 0) {
        if (isMobileDevice && pageNo !== 0) {
          setPageState((prev) => ({ ...prev, dataRows: [...prev.dataRows, ...rowsData] }));
        } else {
          setPageState((prev) => ({ ...prev, dataRows: rowsData }));
        }
      } else {
        setErrorComing(true);
        setInfiniteLoader(false);
        return;
      }

      setPageState((prev) => ({
        ...prev,
        totalResults: response?.data?.data?.data?.totalResults,
        totalPages: response?.data?.data?.data?.totalPageNumber,
        loading: false,
      }));

      setInfiniteLoader(false);
      setErrorComing(false);
    } catch (err) {
      setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
      setErrorComing(true);
      setInfiniteLoader(false);
    }
  };

  const handleProductNavigation = async (barcode) => {
    try {
      if(isFetching) return;

      setIsFetching(true);
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }else{
        showSnackbar('Product Not Found', 'error')
      }

      setIsFetching(false);
    } catch (error) {
      showSnackbar('Product Not Found', 'error');
      setIsFetching(false);
    }
  };  

  // summary and listing
  useEffect(() => {
    if (pageTitle !== 'stock-adjustment') {
      dispatch(resetCommonReduxState());
      dispatch(setPageTitle('stock-adjustment'));
    }
    getStockAdjustmentSummaryData();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (debouncedSearchValue !== '') {
        getStockAdjustmentLists({ pageNo: 0 });
      } else {
        getStockAdjustmentLists({ pageNo: persistedPage });
      }
    }
  }, [filterObjectMain, debouncedSearchValue, isInitialized]);

  // to refetch the inventory adjustment logs, after inventory adjustment
  useEffect(() => {
    if (refreshInventoryAdjustmentPage) {
      getStockAdjustmentLists({ pageNo: 0 });
      setRefreshInventoryAdjustmentPage(false);
    }
  }, [refreshInventoryAdjustmentPage]);

  return (
    <>
      {!isMobileDevice ? (
        <>
          <DashboardNavbar />
          <SoftBox className="search-bar-filter-and-table-container">
            <SoftBox className="search-bar-filter-container">
              <Grid container spacing={2} className="filter-product-list-cont">
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      placeholder="Search by title or gtin"
                      value={searchValue}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchValue}
                    />
                    {searchValue !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                </Grid>
                <Grid item md={6.5} sm={4} xs={12}>
                  <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                    {/* <AdjustInventory
                      setIsAdjusted={setIsAdjusted}
                      refreshInventoryAdjustmentPage={getStockAdjustmentLists}
                    /> */}
                    {editInventoryAdjustment}
                    <StockAdjustmentLogsFilter
                      showSnackbar={showSnackbar}
                      // filterFunction={getStockAdjustmentLists}
                      filterObjectMain={filterObjectMain}
                    />
                  </SoftBox>
                </Grid>
              </Grid>

              {/* summary div  */}
              <TableSummaryDiv
                summaryHeading={'Stock Adjustment'}
                summaryArray={analysisSummary !== undefined ? summaryArray : []}
                loader={summaryLoader}
                length={summaryArray?.length}
              />
            </SoftBox>
            {pageState?.loading ? (
              <SoftBox
                sx={{
                  height: '70vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </SoftBox>
            ) : (
              <SoftBox
                className="dat-grid-table-box"
                sx={{
                  height: 475,
                  width: '100%',
                }}
              >
                {errorComing && pageState?.dataRows?.length === 0 ? (
                  <SoftBox className="No-data-text-box">
                    <SoftBox className="src-imgg-data">
                      <img className="src-dummy-img" src={noDatagif} />
                    </SoftBox>

                    <h3 className="no-data-text-I">NO DATA FOUND</h3>
                  </SoftBox>
                ) : (
                  <>
                    {pageState?.loading && (
                      <SoftBox
                        sx={{
                          height: '70vh',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Spinner />
                      </SoftBox>
                    )}
                    {!pageState?.loading && (
                      <DataGrid
                        sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                        columns={columns}
                        rows={pageState?.dataRows}
                        getRowId={(row) => row?.id}
                        rowCount={pageState?.totalResults}
                        loading={pageState?.loading}
                        pagination
                        page={pageState?.page}
                        pageSize={pageState?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          // setPageState((old) => ({ ...old, page: newPage + 1 }));
                          getStockAdjustmentLists({ pageNo: newPage });
                          dispatch(setPage(newPage));
                          if (pageTitle === '') {
                            dispatch(setPageTitle('stock-adjustment'));
                          }
                        }}
                        onPageSizeChange={(newPageSize) => {
                          setPageState((old) => ({ ...old, pageSize: newPageSize }));
                        }}
                        disableSelectionOnClick
                        onCellDoubleClick={(rows) => {
                            handleProductNavigation(rows?.row?.barcode);
                        }}
                      />
                    )}
                  </>
                )}
              </SoftBox>
            )}
          </SoftBox>
        </>
      ) : (
        <>
          <SoftBox>
            <PurchaseAdditionalDetails additionalDetailsArray={summaryArray} />
            <SoftBox sx={{ position: 'relative', margin: '10px 0px' }}>
              <MobileSearchBar
                value={searchValue}
                placeholder={'Search...'}
                isScannerSearchbar={false}
                onChangeFunction={handleSearchValue}
              />
            </SoftBox>
            <SoftBox>
              <StockAdjustmentLogsFilter
                showSnackbar={showSnackbar}
                filterObjectMain={filterObjectMain}
                isMobileDevice={isMobileDevice}
                pageState={pageState}
              />
            </SoftBox>
          </SoftBox>
          <SoftBox className="ros-app-purchase-component-main-div">
            <SoftBox>
              <div style={{ display: 'flex', marginTop: '10px', width: '100%' }}>
                <div className="listing-order-name-main">
                  <CustomMobileButton
                    variant={tabName === 'logs' ? 'black-D' : 'black-S'}
                    title={'Logs'}
                    onClickFunction={() => {
                      handleTabName('logs');
                      handleClearSearchInput();
                    }}
                    flex={1}
                    justifyContent={'center'}
                  >
                    Logs
                  </CustomMobileButton>
                  <CustomMobileButton
                    variant={tabName === 'adjustment' ? 'black-D' : 'black-S'}
                    title={'Adjustment'}
                    onClickFunction={() => handleTabName('adjustment')}
                    flex={1}
                    justifyContent={'center'}
                  >
                    Adjustment
                  </CustomMobileButton>
                </div>
              </div>

              <SoftBox className="pi-listing-card-main-div">
                {!errorComing ? (
                  <>
                    {pageState?.dataRows?.map((item, index) => (
                      <AdjustmentLogsMobileCard
                        key={index}
                        data={item}
                        handleOpenModalStockAdjustmentLogs={handleOpenModalStockAdjustmentLogs}
                        getStockAdjustmentAdditionalData={getStockAdjustmentAdditionalData}
                        additionalData={additionalData}
                        additionalDataLoader={additionalDataLoader}
                      />
                    ))}

                    {showViewMore && (
                      <ViewMore
                        loading={infiniteLoader}
                        handleNextFunction={() => getStockAdjustmentLists({ pageNo: pageState.page + 1 })}
                      />
                    )}
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

      {/* modal  */}
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openModalStockAdjustmentLogs}
        onClose={handleCloseModalStockAdjustmentLogs}
        className="stock-adjustment-more-info"
      >
        <div
          initial={{ y: 100, x: 0 }}
          animate={{ y: 0, x: 0 }}
          transition={{
            type: 'linear',
          }}
          style={{
            backgroundColor: 'white',
            padding: '20px',
          }}
        >
          <SoftTypography fontSize="14px" fontWeight="bold">
            Adjustment Details
          </SoftTypography>
          <SoftBox className="logs-info-modal" mt={2} mb={2}>
            <SoftBox>
              <SoftTypography fontSize="14px">Initial Quantity</SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.initialQuantity ?? 'NA'}</SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Adjusted Quantity</SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.adjustedQuantity ?? 'NA'}</SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Adjusted Value</SoftTypography>
              <SoftTypography fontSize="14px">
                <CurrencyRupeeIcon /> {additionalData?.adjustedValue ?? 'NA'}
              </SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Inventory Location</SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.inventoryLocation || 'NA'}</SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Adjusted By</SoftTypography>
              <SoftTypography fontSize="14px" color="primary">
                {additionalData?.adjustedBy}
              </SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Batch</SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.batch || 'NA'}</SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Adjustment Reason</SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.reason ? textFormatter(additionalData?.reason) : 'NA'}</SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Adjustment Date</SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.lastUpdated ? dateFormatter(additionalData?.lastUpdated) : 'NA'}</SoftTypography>
            </SoftBox>
          </SoftBox>

          <SoftBox className="content-left" sx={{gap: '50px !important' }}>
            <SoftBox>
              <SoftTypography fontSize="14px" fontWeight="bold">
                Source
              </SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.source ? textFormatter(additionalData?.source) : 'NA'}</SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px" fontWeight="bold">
                Source Id
              </SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.sourceId || 'NA'}</SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px" fontWeight="bold">
                Stock In Hand
              </SoftTypography>
              <SoftTypography fontSize="14px">{additionalData?.stockInHand ?? 'NA'}</SoftTypography>
            </SoftBox>
          </SoftBox>

          <br />
          <SoftBox sx={{ marginBottom: '10px !important' }}>
            <SoftBox className="header-submit-box-i">
              <SoftButton
                onClick={handleCloseModalStockAdjustmentLogs}
                variant={buttonStyles.primaryVariant}
                className="vendor-add-btn contained-softbutton"
              >
                Close
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </div>
      </Popover>
      <br />
      {/* </DashboardLayout> */}
    </>
  );
};
