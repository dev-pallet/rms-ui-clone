import './index.css';
import { ABCAnalysisHeader, ABCAnalysisTabs, getABCAnalysisSummaryArray } from './components/abcAnalysisCommon';
import { CircularProgress, Grid } from '@mui/material';
import {
  ClearSoftInput,
  isSmallScreen,
  noDatagif,
  productIdByBarcode,
  textFormatter,
} from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { getABCAnalysisSummaryData, getDataAnalysisV2 } from '../../../../config/Services';
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
import { inventoryColumns, profitColumns, salesColumns } from './components/columns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import ABCAnalysisFilter from './components/filter';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import InventoryMobileCard from './components/inventory/components/inventoryMobileCard';
import NoDataFound from '../../Common/No-Data-Found';
import ProfitMobileCard from './components/profit/components/profitMobileCard';
import SalesMobileCard from './components/sales/components/salesMobileCard';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import TableSummaryDiv from '../../Common/new-ui-common-components/table-summary-div/TableSummaryDiv';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import PurchaseAdditionalDetails from '../../purchase/ros-app-purchase/components/purchase-additional-details';

export const ABCAnalysis = () => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const persistedPage = useSelector(getPage);
  const persistedSearchValue = useSelector(getSearchValue);
  const pageTitle = useSelector(getPageTitle);

  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  // <--- states
  const [analysisSummary, setAnalysisSummary] = useState({});
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [selected, setSelected] = useState(localStorage.getItem('analysisType') || 'inventory');
  const [searchValue, setSearchValue] = useState(persistedSearchValue || '');
  const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed
  const [isInitialized, setIsInitialized] = useState(false);

  const [errorComing, setErrorComing] = useState(false);
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);

  const filterObjectMain = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          categoryFilter: '',
        };
  }, [persistedFilters]);

  // table pagestate
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    totalResults: 0,
    totalPages: 0,
    page: 0,
    pageSize: 10,
  });

  // states --->

  // columns
  const inventoryColumn = inventoryColumns;
  const salesColumn = salesColumns;
  const profitColumn = profitColumns;

  // labels for options in select category filter
  const labelOptions = {
    inventory: ['Highest Consumption', 'Average Consumption', 'Lowest Consumption'],
    sales: ['Fast Movement', 'Average Movement', 'Low Movement'],
    profit: ['Highest Value', 'Average Value', 'Lowest Value'],
  };
  const categoryOptionsLabel = labelOptions[selected] || null;

  // summary array
  const summaryArray = getABCAnalysisSummaryArray({ tab: selected, analysisSummary: analysisSummary });

  //   functions
  const handleSelectTab = (value) => {
    setSelected(value);
    setPageState((prev) => ({ ...prev, dataRows: []}));
    dispatch(setPage(0));
    localStorage.setItem('analysisType', value);
  };

  const handleSearchValue = (e) => {
    const value = e.target.value;
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setSearchValue(value);
    dispatch(setSearchValueFilter(value));
  };

  // clear search input function
  const handleClearSearchInput = () => {
    setSearchValue('');
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    dispatch(setSearchValueFilter(''));
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
      showSnackbar('Something Went Wrong', 'error');
      setIsFetching(false);
    }
  };

  const handleCellClick = (rows) => {
    const productId = rows.row.barcode;
    handleProductNavigation(productId);
  };

  // get summary data
  const getAnalysisSummaryData = async () => {
    try {
      setSummaryLoader(true);

      const payload = {
        locationId: [locId],
        orgId: [orgId],
        inventoryAnalysis: selected === 'inventory',
        salesAnalysis: selected === 'sales',
        salesProfitAnalysis: selected === 'profit',
      };

      let response = await getABCAnalysisSummaryData(payload);
      response = response?.data?.data;

      if (response?.es) {
        showSnackbar(response?.message, 'error');
        setSummaryLoader(false);
        return;
      }

      setAnalysisSummary(response?.data);
      setSummaryLoader(false);
    } catch (err) {
      setAnalysisSummary({});
      setSummaryLoader(false);
      showSnackbar('Something went wrong', 'error');
    }
  };

  // get analysis data
  const getAnalysisData = async ({ pageNo, filterObject, selectedTab, searchVal }) => {
    try {
      if (isMobileDevice) {
        setInfiniteLoader(true);
      }
      let selectedTabName = selectedTab ? selectedTab : selected;

      setPageState((prev) => ({ ...prev, loading: true, page: pageNo }));

      const obj = filterObject
        ? filterObject
        : {
            categoryFilter: filterObjectMain?.category?.value || '',
          };

      const payload = {
        pageNo: pageNo,
        pageSize: pageState.pageSize,
        locationId: [locId],
        orgId: [orgId],
        searchBox: searchVal ? searchVal : debouncedSearchValue,
        inventoryAnalysis: selectedTabName === 'inventory' ? true : false,
        salesAnalysis: selectedTabName === 'sales' ? true : false,
        salesProfitAnalysis: selectedTabName === 'profit' ? true : false,
        ...obj,
      };

      const response = await getDataAnalysisV2(payload);

      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setInfiniteLoader(false);
        return;
      }

      const dataArr = response?.data?.data?.data?.data || [];

      if (dataArr?.length === 0 && !pageState?.dataRows?.length) {
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false, totalPages: 0, totalResults: 0 }));
        setInfiniteLoader(false);
        return;
      }

      let rowsData;

      if (selectedTabName === 'inventory') {
        rowsData = dataArr?.map((row, index) => {
          return {
            id: index,
            title: textFormatter(row?.itemName) || 'NA',
            barcode: row?.gtin || 'NA',
            classification: row?.inventoryAnalysis || 'NA',
            stockTurnover: row?.stockTurnOver ?? 'NA',
            purchasePerWeek: row?.purchasePerWeek ?? 'NA',
            salesPerWeek: row?.salesPerWeek ?? 'NA',
            stockInHand: row?.totalAvailableUnits ?? 'NA',
            // rating: row?.rating || 'NA',
            stockValue: row?.stockValue ?? 'NA',
          };
        });
      } else if (selectedTabName === 'sales') {
        rowsData = dataArr?.map((row, index) => {
          return {
            id: index,
            title: textFormatter(row?.itemName) || 'NA',
            barcode: row?.gtin || 'NA',
            classification: row?.salesAnalysis || 'NA',
            salePrice: row?.salesPrice ?? 'NA',
            netRevenue: row?.netRevenue ?? 'NA',
            salesPerMonth: row?.salesPerMonth ?? 'NA',
            stockInHand: row?.totalAvailableUnits ?? 'NA',
            // rating: row?.rating || 'NA',
            stockValue: row?.stockValue ?? 'NA',
          };
        });
      } else if (selectedTabName === 'profit') {
        rowsData = dataArr?.map((row, index) => {
          return {
            id: index,
            title: textFormatter(row?.itemName) || 'NA',
            barcode: row?.gtin || 'NA',
            classification: row?.salesProfitAnalysis || 'NA',
            sales: row?.sales ?? 'NA',
            profit: row?.profit ?? 'NA',
            saleMargin: row?.salesMargin ?? 'NA',
            purchaseMargin: row?.purchaseMargin ?? 'NA',
            // rating: row?.rating || 'NA',
            stockValue: row?.stockValue ?? 'NA',
          };
        });
      }

      const showViewMoreButton = (payload.pageNo + 1) * payload?.pageSize < response?.data?.data?.data?.totalResults;
      setShowViewMore(showViewMoreButton);

      if (rowsData.length > 0) {
        if (isMobileDevice && pageNo !== 0) {
          setPageState((prev) => ({ ...prev, dataRows: [...prev.dataRows, ...rowsData] }));
        } else {
          setPageState((prev) => ({ ...prev, dataRows: rowsData }));
        }
      } else {
        setErrorComing(true);
        setInfiniteLoader(false);
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
      console.log(err);
      setPageState((prev) => ({ ...prev, dataRows: [], loading: false, totalPages: 0, totalResults: 0 }));
      setErrorComing(true);
      setInfiniteLoader(false);
    }
  };

  const pageStateRef = useRef(pageState);
  const selectedRef = useRef(selected);

  // Update the refs when their corresponding state changes
  useEffect(() => {
    pageStateRef.current = pageState;
    selectedRef.current = selected;
  }, [pageState, selected]);

  // < -- for mobile screen - for fetching api when scrolled to bottom
  // const handleScroll = useCallback(
  //   debounce(() => {
  //     if (document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight) {
  //       const { page, totalPages, loading } = pageStateRef.current;
  //       if (page < totalPages - 1 && isMobileDevice && !loading) {
  //         getAnalysisData({ pageNo: page + 1, selectedTab: selectedRef.current  });  
  //       }
  //     }
  //   }, 200),
  //   [isMobileDevice, debouncedSearchValue],
  // );
  
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [handleScroll]);
  // -->

  useEffect(() => {
    if (pageTitle !== 'abc-analysis') {
      dispatch(resetCommonReduxState());
      dispatch(setPageTitle('abc-analysis'));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      getAnalysisSummaryData();

      if (debouncedSearchValue !== '') {
        getAnalysisData({ pageNo: 0 });
      } else {
        getAnalysisData({ pageNo: persistedPage });
      }
    }
  }, [selected, debouncedSearchValue, filterObjectMain, isInitialized]);

  return (
    <DashboardLayout>
      {!isMobileDevice && (
        <>
          <DashboardNavbar />
          <SoftBox className="content-left" sx={{ marginBottom: '10px' }}>
            <SoftTypography
              className={`abc-sub-heading-summary abc-analysis-tabs ${selected === 'inventory' && 'active-tab'}`}
              onClick={() => {
                handleSelectTab('inventory');
              }}
            >
              Inventory
            </SoftTypography>
            <SoftTypography
              className={`abc-sub-heading-summary abc-analysis-tabs ${selected === 'sales' && 'active-tab'}`}
              onClick={() => {
                handleSelectTab('sales');
              }}
            >
              Sales
            </SoftTypography>
            <SoftTypography
              className={`abc-sub-heading-summary abc-analysis-tabs ${selected === 'profit' && 'active-tab'}`}
              onClick={() => {
                handleSelectTab('profit');
              }}
            >
              Profit
            </SoftTypography>
          </SoftBox>
        </>
      )}

      {!isMobileDevice ? (
        <SoftBox className="search-bar-filter-and-table-container">
          <SoftBox className="search-bar-filter-container">
            <Grid container spacing={2} className="filter-product-list-cont">
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox sx={{ position: 'relative' }}>
                  <SoftInput
                    placeholder="Search by product or barcode"
                    value={searchValue}
                    icon={{ component: 'search', direction: 'left' }}
                    onChange={handleSearchValue}
                  />
                  {searchValue !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                </SoftBox>
              </Grid>
              <Grid item md={6.5} sm={4} xs={12}>
                <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                  <ABCAnalysisFilter
                    filterObjectMain={filterObjectMain}
                    // filterFunction={getAnalysisData}
                    // setSelectedCategory={setSelectedCategory}
                    categoryOptionsLabel={categoryOptionsLabel}
                    tab={selected}
                  />
                </SoftBox>
              </Grid>
            </Grid>

            <TableSummaryDiv
              summaryHeading={'Analysis Summary'}
              summaryArray={analysisSummary !== undefined ? summaryArray : []}
              loader={summaryLoader}
              length={summaryArray.length}
            />
          </SoftBox>
          {/* datagrid  */}
          {pageState.loading ? (
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
              {errorComing && pageState.dataRows.length === 0 ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : (
                <>
                  {pageState.loading && (
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
                  {!pageState.loading && (
                    <DataGrid
                      sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                      // columns={columns}
                      columns={
                        selected === 'inventory'
                          ? inventoryColumn
                          : selected === 'sales'
                          ? salesColumn
                          : selected === 'profit' && profitColumn
                      }
                      // rows={tableRows}
                      rows={pageState?.dataRows}
                      getRowId={(row) => row?.id}
                      rowCount={pageState?.totalResults}
                      loading={pageState?.loading}
                      pagination
                      page={pageState?.page}
                      pageSize={pageState.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => {
                        // setPageState((old) => ({ ...old, page: newPage }));
                        getAnalysisData({ pageNo: newPage });
                        dispatch(setPage(newPage));
                      }}
                      onPageSizeChange={(newPageSize) => {
                        setPageState((old) => ({ ...old, pageSize: newPageSize }));
                      }}
                      onCellClick={(rows) => {
                        // prevent redirecting to details page when the barcode/gtin column is clicked as it contains copy barcode option
                        if (rows.field !== 'barcode') {
                          handleCellClick(rows);
                        }
                      }}
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
          <SoftBox>
            <PurchaseAdditionalDetails additionalDetailsArray={summaryArray} />
            <ABCAnalysisHeader
              searchValue={searchValue}
              handleSearchValue={handleSearchValue}
              handleClearSearchInput={handleClearSearchInput}
              filter={
                <ABCAnalysisFilter
                  filterObjectMain={filterObjectMain}
                  categoryOptionsLabel={categoryOptionsLabel}
                  tab={selected}
                  isMobileDevice={isMobileDevice}
                  pageState={pageState}
                />
              }
            />
          </SoftBox>
          <SoftBox className="ros-app-purchase-component-main-div">
            <SoftBox>
              {/* show table based on the tabs selected  */}
              <ABCAnalysisTabs selected={selected} handleSelectTab={handleSelectTab} />
              <SoftBox className="pi-listing-card-main-div">
                {!errorComing ? (
                  <>
                    {/* show mobile card based on the tabs selected in mobile screen*/}
                    {(() => {
                      const componentMap = {
                        inventory: InventoryMobileCard,
                        sales: SalesMobileCard,
                        profit: ProfitMobileCard,
                      };

                      const SelectedComponent = componentMap[selected];

                      return pageState?.dataRows?.map((item, index) =>
                        SelectedComponent ? <SelectedComponent key={index} data={item} /> : null,
                      );
                    })()}

                    {showViewMore && (
                      <ViewMore
                        loading={infiniteLoader}
                        handleNextFunction={() => {
                          const { page, totalPages, loading } = pageStateRef.current;
                          getAnalysisData({ pageNo: page + 1, selectedTab: selectedRef.current });
                        }}
                      />
                    )}
                    {!infiniteLoader && !pageState?.dataRows?.length && <NoDataFound message={'No Products Found'} />}
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
