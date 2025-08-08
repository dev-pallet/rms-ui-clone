import './index.css';
import { CircularProgress, Grid } from '@mui/material';
import {
  ClearSoftInput,
  isSmallScreen,
  noDatagif,
  productIdByBarcode,
  textFormatter,
} from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { StockBalanceTableSummaryDiv } from './components/stockBalanceCommon';
import { debounce } from 'lodash';
import { getStockBalanceLists, getStockBalanceSummaryData } from '../../../../config/Services';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import NoDataFound from '../../Common/No-Data-Found';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import VendorMobileCard from './components/vendorMobileCard';
import ProductMobileCard from './components/productMobileCard';
import CategoryMobileCard from './components/categoryMobileCard';
import BrandMobileCard from './components/brandMobileCard';
import { brandColumns, categoryColumns, productColumns, vendorColumns } from './components/columns';
import { useNavigate } from 'react-router-dom';
import {
  getPage,
  getPageTitle,
  getSearchValue,
  resetCommonReduxState,
  setPage,
  setPageTitle,
  setSearchValueFilter,
} from '../../../../datamanagement/Filters/commonFilterSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import MobileFilterComponent from '../../Common/mobile-new-ui-components/mobile-filter';
import { CommonSubTabs } from '../../Common/mobile-new-ui-components/common-mobile-sub-tabs';

export const StockBalance = () => {
  const dispatch = useDispatch();
  const persistedPage = useSelector(getPage);
  const persistedSearchValue = useSelector(getSearchValue);
  const pageTitle = useSelector(getPageTitle);

  const isMobileDevice = isSmallScreen();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const locName = localStorage.getItem('locName');
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  // <--- states
  const [errorComing, setErrorComing] = useState(false);
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [selected, setSelected] = useState(localStorage.getItem('stockBalanceType') || 'product');

  const [searchValue, setSearchValue] = useState(persistedSearchValue || '');
  const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed

  const [analysisSummary, setAnalysisSummary] = useState({});
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTabChanged, setIsTabChanged] = useState(false);
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);

  //   table pagestate
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    totalPages: 0,
    totalResults: 0,
    page: 0,
    pageSize: 10,
  });

  // states --->

  // columns
  const productColumn = productColumns;
  const vendorColumn = vendorColumns;
  const categoryColumn = categoryColumns;
  const brandColumn = brandColumns;

  const tabFilters = [
    { name: 'Product', value: 'product' },
    { name: 'Vendor', value: 'vendor' },
    { name: 'Category', value: 'category' },
    { name: 'Brand', value: 'brand' },
  ];

  const handleSelectTab = (value) => {
    setIsTabChanged(true);
    setSelected(value);
    handleSearchValue({ target: { value: '' } });
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    dispatch(setPage(0));
    localStorage.setItem('stockBalanceType', value);
  };

  //   functions
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
    setIsSearchCleared(true);
  };

  const getStockBalanceSummary = async () => {
    try {
      setSummaryLoader(true);

      const payload = {
        locationId: [locId],
        orgId: [orgId],
        stockBalance: selected.toUpperCase(), // product, vendor, category, brand
      };

      const response = await getStockBalanceSummaryData(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setAnalysisSummary({});
        setSummaryLoader(false);
        return;
      }

      setAnalysisSummary(response?.data?.data?.data?.[selected]);
      setSummaryLoader(false);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
      setAnalysisSummary({});
      setSummaryLoader(false);
      console.log(err);
    }
  };

  const getStockBalance = async ({ pageNo, selectedTab, searchVal }) => {
    try {
      if (isMobileDevice) {
        setInfiniteLoader(true);
      }
      let selectedTabName = selectedTab ? selectedTab : selected;

      setPageState((prev) => ({ ...prev, loading: true, page: pageNo }));

      const payload = {
        pageNo: pageNo,
        pageSize: pageState.pageSize,
        locationId: [locId],
        orgId: [orgId],
        searchBox: searchVal !== undefined ? searchVal : debouncedSearchValue,
        stockBalance: selectedTabName.toUpperCase(), // product, vendor, category, brand
      };

      const response = await getStockBalanceLists(payload);

      if (response?.data?.data?.es) {
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false, totalPages: 0, totalResults: 0 }));
        showSnackbar(response?.data?.data?.message, 'error');
        setInfiniteLoader(false);
        return;
      }

      let dataArr = response?.data?.data?.data?.data?.[selectedTabName] || [];

      if (dataArr?.length === 0) {
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false, totalPages: 0, totalResults: 0 }));
        setInfiniteLoader(false);
        return;
      }

      const showViewMoreButton =
      (payload.pageNo + 1) * pageState?.pageSize < response?.data?.data?.data?.totalResults;
      setShowViewMore(showViewMoreButton);

      let rowsData;

      if (selectedTabName === 'product') {
        rowsData = dataArr?.map((row, index) => {
          return {
            id: index,
            title: row?.itemName ? textFormatter(row?.itemName) : 'NA',
            barcode: row?.gtin || 'NA',
            uom: row?.weightUOM ? textFormatter(row?.weightUOM) : 'NA',
            mrp: row?.mrp ?? 'NA',
            stockInHand: row?.availableUnits ?? 'NA',
            location: locName ? textFormatter(locName) : 'NA',
            batches: row?.batch ?? 'NA',
            incoming: row?.incoming ?? 'NA',
            stockValue: row?.stockValue ?? 'NA',
          };
        });
      } else if (selectedTabName === 'vendor') {
        rowsData = dataArr?.map((row, index) => {
          return {
            id: index,
            vendor: row?.vendorName ? textFormatter(row?.vendorName) : 'NA',
            vendorId: row?.vendorId || 'NA',
            brands: row?.brand ?? 'NA',
            location: locName ? textFormatter(locName) : 'NA',
            products: row?.availableUnits ?? 'NA',
            lastPurchase: row?.inwardedOn ?? 'NA',
            incomingOrders: row?.incoming ?? 'NA',
            stockValue: row?.stockValue ?? 'NA',
          };
        });
      } else if (selectedTabName === 'category') {
        rowsData = dataArr?.map((row, index) => {
          return {
            id: index,
            category: row?.category ? textFormatter(row?.category) : 'NA',
            products: row?.availableUnits ?? 'NA',
            wastage: row?.wastage ?? 'NA',
            returns: row?.returns ?? 'NA',
            incomingOrders: row?.incoming ?? 'NA',
            lastStockUpdate: row?.inwardedOn ?? 'NA',
            stockValue: row?.stockValue ?? 'NA',
          };
        });
      } else if (selectedTabName === 'brand') {
        rowsData = dataArr?.map((row, index) => {
          return {
            id: index,
            brand: row?.brand ? textFormatter(row?.brand) : 'NA',
            products: row?.availableUnits ?? 'NA',
            wastage: row?.wastage ?? 'NA',
            returns: row?.returns ?? 'NA',
            incomingOrders: row?.incoming ?? 'NA',
            lastStockUpdate: row?.inwardedOn ?? 'NA',
            stockValue: row?.stockValue ?? 'NA',
          };
        });
      }

      if (rowsData.length > 0) {
        if (isMobileDevice) {
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

  // Update the refs when the state changes
  useEffect(() => {
    pageStateRef.current = pageState;
    selectedRef.current = selected;
  }, [pageState, selected]);

  useEffect(() => {
    if (pageTitle !== 'stock-balance') {
      dispatch(resetCommonReduxState());
      dispatch(setPageTitle('stock-balance'));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      getStockBalanceSummary();
      getStockBalance({ pageNo: persistedPage, searchVal: '' });
    }
  }, [selected]);

  useEffect(() => {
    if (isInitialized) {
      // if tab is changed
      if (isTabChanged && debouncedSearchValue === '') {
        if (isSearchCleared) {
          setIsSearchCleared(false);
        } else {
          setIsTabChanged(false);
          return;
        }
      }

      getStockBalanceSummary();
      if (debouncedSearchValue !== '') {
        getStockBalance({ pageNo: 0 });
      } else {
        getStockBalance({ pageNo: persistedPage });
      }
    }
  }, [debouncedSearchValue, isInitialized]);

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

  return (
    <DashboardLayout>
      {!isMobileDevice && (
        <>
          <DashboardNavbar />
          <SoftBox className="content-left" sx={{ marginBottom: '10px' }}>
            <SoftTypography
              className={`stock-balance-tabs ${selected === 'product' && 'active-tab'}`}
              onClick={() => handleSelectTab('product')}
            >
              By Product
            </SoftTypography>
            <SoftTypography
              className={`stock-balance-tabs ${selected === 'vendor' && 'active-tab'}`}
              onClick={() => handleSelectTab('vendor')}
            >
              By Vendor
            </SoftTypography>
            <SoftTypography
              className={`stock-balance-tabs ${selected === 'category' && 'active-tab'}`}
              onClick={() => handleSelectTab('category')}
            >
              By Category
            </SoftTypography>
            <SoftTypography
              className={`stock-balance-tabs ${selected === 'brand' && 'active-tab'}`}
              onClick={() => handleSelectTab('brand')}
            >
              By Brand
            </SoftTypography>
          </SoftBox>
        </>
      )}

      {!isMobileDevice ? (
        <>
          <SoftBox className="search-bar-filter-and-table-container">
            <SoftBox className="search-bar-filter-container">
              <Grid container spacing={2} className="filter-product-list-cont">
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      placeholder="Search by title or barcode"
                      value={searchValue}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchValue}
                    />
                    {searchValue !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                </Grid>
                <Grid item md={6.5} sm={4} xs={12}>
                  <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                    {/* <Filter /> */}
                  </SoftBox>
                </Grid>
              </Grid>

              {/* summary div  */}
              <StockBalanceTableSummaryDiv
                summaryLoader={summaryLoader}
                analysisSummary={analysisSummary}
                lastUpdatedOn={analysisSummary?.created || null}
              />
            </SoftBox>
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
                    )}
                    {/* show table based on the tabs selected */}
                    {!pageState.loading && (
                      <DataGrid
                        sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                        columns={
                          selected === 'product'
                            ? productColumn
                            : selected === 'vendor'
                            ? vendorColumn
                            : selected === 'category'
                            ? categoryColumn
                            : selected === 'brand' && brandColumn
                        }
                        rows={pageState.dataRows}
                        getRowId={(row) => row?.id}
                        rowCount={pageState?.totalResults}
                        loading={pageState?.loading}
                        pagination
                        page={pageState?.page}
                        pageSize={pageState.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          // setPageState((old) => ({ ...old, page: newPage + 1 }));
                          getStockBalance({ pageNo: newPage });
                          dispatch(setPage(newPage));
                        }}
                        onPageSizeChange={(newPageSize) => {
                          setPageState((old) => ({ ...old, pageSize: newPageSize }));
                        }}
                        disableSelectionOnClick
                        onCellDoubleClick={(rows) => {
                          if (selected === 'product' && rows.field !== 'barcode') {
                            handleProductNavigation(rows?.row?.barcode);
                          }
                          if (selected === 'vendor') {
                            navigate(`/sellers/vendors/details/${rows?.row?.vendorId}`);
                          }
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
            <StockBalanceTableSummaryDiv
              summaryLoader={summaryLoader}
              analysisSummary={analysisSummary}
              lastUpdatedOn={analysisSummary?.created || null}
              isMobileDevice={isMobileDevice}
            />
            <SoftBox sx={{ position: 'relative', margin: '10px 0px' }}>
              <MobileSearchBar
                value={searchValue}
                placeholder={'Search...'}
                isScannerSearchbar={false}
                onChangeFunction={handleSearchValue}
              />
            </SoftBox>
            <div>
              <MobileFilterComponent createButtonTitle={'Stock Balance'} />
            </div>
          </SoftBox>
          <SoftBox className="ros-app-purchase-component-main-div">
            <SoftBox>
              <CommonSubTabs
                selected={selected}
                handleSelectTab={handleSelectTab}
                isMobileDevice={isMobileDevice}
                filters={tabFilters}
              />
              <SoftBox className="pi-listing-card-main-div">
                {!errorComing ? (
                  <>
                    {/* show mobile card based on the tabs selected in mobile screen*/}
                    {(() => {
                      const componentMap = {
                        product: ProductMobileCard,
                        vendor: VendorMobileCard,
                        category: CategoryMobileCard,
                        brand: BrandMobileCard,
                      };

                      const SelectedComponent = componentMap[selected];

                      return pageState?.dataRows?.map((item, index) =>
                        SelectedComponent ? (
                          <SelectedComponent
                            key={index}
                            data={item}
                            handleProductNavigation={handleProductNavigation}
                          />
                        ) : null,
                      );
                    })()}

                    {showViewMore && (
                      <ViewMore
                        loading={infiniteLoader}
                        handleNextFunction={() => {
                          const { page, totalPages, loading } = pageStateRef.current;
                          getStockBalance({ pageNo: page + 1, selectedTab: selectedRef.current });
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
