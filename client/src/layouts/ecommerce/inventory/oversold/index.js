import { Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import { getOverSoldProductsLists, getOversoldSummary } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import {
  ClearSoftInput,
  CopyToClipBoard,
  formatNumber,
  isSmallScreen,
  noDatagif,
  productIdByBarcode,
  textFormatter,
} from '../../Common/CommonFunction';
import { CommonSubTabs } from '../../Common/mobile-new-ui-components/common-mobile-sub-tabs';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import OversoldFilter from './components/filter/OversoldFilter';
import OversoldMobileCard from './components/oversold-mobile-card';
import './index.css';
import NoDataFoundMob from '../../Common/mobile-new-ui-components/no-data-found';
import TableSummaryDiv from '../../Common/new-ui-common-components/table-summary-div/TableSummaryDiv';
import PurchaseAdditionalDetails from '../../purchase/ros-app-purchase/components/purchase-additional-details';

export default function OverSold() {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // For query parameters

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed

  const [selected, setSelected] = useState(searchParams.get('tab') || 'OVER_SOLD_TODAY');
  const [showViewMore, setShowViewMore] = useState(true);
  const [viewMoreLoader, setViewMoreLoder] = useState(false);
  //   table pagestate
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: Number(searchParams.get('page')) || 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 10,
  });
  const isFirstRender = useRef(true);
  const [isFetching, setIsFetching] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState({});
  const [summaryLoader, setSummaryLoader] = useState(false);

  const handleProductNavigation = async (barcode) => {
    try {
      if (isFetching) return;

      setIsFetching(true);
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      } else {
        showSnackbar('Product Not Found', 'error');
      }

      setIsFetching(false);
    } catch (error) {
      showSnackbar('Something went wrong', 'error');
      setIsFetching(false);
    }
  };

  const handleSearchValue = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  // clear search input fn
  const handleClearSearchInput = () => {
    setSearchValue('');
  };

  const handlePageChange = (page) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', page);
    setSearchParams(updatedSearchParams);
    setPageState((prev) => ({ ...prev, page: page }));
  };

  const summaryArray = useMemo(() => {
    return [
      {
        title: "Today's Oversold Value",
        value: (
          <>
            ₹ {formatNumber(analysisSummary?.dailyStockValue ?? 'N/A')} from{' '}
            {formatNumber(analysisSummary?.countDaily ?? 'N/A')} products
          </>
        ),
      },
      {
        title: 'Oversold Products In Last 30 Days',
        value: (
          <>
            {formatNumber(analysisSummary?.countMonthly ?? 'N/A')} products
          </>
        ),
      },
      {
        title: 'Overall Oversold Value',
        value: (
          <>
            ₹ {formatNumber(analysisSummary?.overallStockValue ?? 'N/A')} from{' '}
            {formatNumber(analysisSummary?.countOverall ?? 'N/A')} products
          </>
        ),
      },
    ];
  }, [analysisSummary]);

  const columns = useMemo(() => {
    return [
      {
        field: 'title',
        headerName: 'Title',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 220,
        flex: 1,
      },
      {
        field: 'barcode',
        headerName: 'Barcode',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 180,
        flex: 1,
        renderCell: (params) => {
          return <CopyToClipBoard params={params} />;
        },
      },
      {
        field: 'brand',
        headerName: 'Brand',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'category',
        headerName: 'Category',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'subCategory',
        headerName: 'Sub Category 1',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'level2Category',
        headerName: 'Sub Category 2',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'batch',
        headerName: 'Batch Id',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 120,
        flex: 1,
      },
      ...(selected === 'OVER_SOLD_TODAY'
        ? [
            {
              field: 'overSoldToday',
              headerName: 'Over Sold Today',
              headerClassName: 'datagrid-columns',
              headerAlign: 'left',
              cellClassName: 'datagrid-rows',
              align: 'left',
              minWidth: 150,
              flex: 1,
            },
          ]
        : []),
      ...(selected === 'OVERALL'
        ? [
            {
              field: 'overSoldQuantity',
              headerName: 'Over Sold Quantity',
              headerClassName: 'datagrid-columns',
              headerAlign: 'left',
              cellClassName: 'datagrid-rows',
              align: 'left',
              minWidth: 150,
              flex: 1,
            },
          ]
        : []),
      ...(selected !== 'OVER_SOLD_30_DAYS'
        ? [
            {
              field: 'negativeInventoryStockValue',
              headerName: 'Negative Inventory Stock Value',
              headerClassName: 'datagrid-columns',
              headerAlign: 'left',
              cellClassName: 'datagrid-rows',
              align: 'left',
              minWidth: 180,
              flex: 1,
            },
          ]
        : []),
    ];
  }, [selected]);

  const tabFilters = [
    { name: 'Today', value: 'OVER_SOLD_TODAY' },
    { name: 'Last 30 Days', value: 'OVER_SOLD_30_DAYS' },
    { name: 'Overall', value: 'OVERALL' },
  ];

  const handleSelectTab = (value) => {
    setSelected(value);
    setPageState((prev) => ({ ...prev, dataRows: [], page: 0 }));
    const updatedSearchParams = new URLSearchParams(searchParams);
    // remove if anything present in params
    updatedSearchParams.delete('startDate');
    updatedSearchParams.delete('endDate');
    // set page 0 and tab
    updatedSearchParams.set('page', 0);
    updatedSearchParams.set('tab', value);
    setSearchParams(updatedSearchParams);
  };

  const getOversoldSummaryData = async () => {
    try {
      setSummaryLoader(true);

      const payload = {
        locationId: [locId],
        orgId: [orgId],
      };

      const response = await getOversoldSummary(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message || 'Something went wrong', 'error');
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

  const fetchOverSoldProducts = async () => {
    try {
      setPageState((prev) => ({ ...prev, loading: true }));

      const payload = {
        pageNo: pageState?.page,
        pageSize: 10,
        locationId: [locId],
        orgId: [orgId],
        searchBox: debouncedSearchValue,
        overSoldTimeline: selected,
      };

      const response = await getOverSoldProductsLists(payload);

      if (response?.data?.status === 'ERROR') {
        showSnackbar(response?.data?.message || 'Something went wrong', 'error');
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        setViewMoreLoder(false);
        return;
      }

      const dataArr = response?.data?.data?.data?.data?.dailyOversoldResponsesList || [];

      if (dataArr?.length === 0) {
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        setViewMoreLoder(false);
        return;
      }

      const showViewMoreButton = (payload.pageNo + 1) * pageState?.pageSize < response?.data?.data?.data?.totalResults;
      setShowViewMore(showViewMoreButton);

      const rowsData = dataArr?.map((row, index) => {
        return {
          id: index,
          title: row?.itemName ? textFormatter(row?.itemName) : 'N/A',
          barcode: row?.gtin || 'N/A',
          brand: row?.brand ? textFormatter(row?.brand) : 'N/A',
          category: row?.category ? textFormatter(row?.category) : 'N/A',
          subCategory: row?.subCategory ? textFormatter(row?.subCategory) : 'N/A',
          level2Category: row?.level2Category ? textFormatter(row?.level2Category) : 'N/A',
          batch: row?.batchNo || 'N/A',
          availableUnits: row?.availableUnits ?? 'N/A',
          overSoldToday: row?.overSoldToday ?? 'N/A',
          overSoldQuantity: row?.overSoldQuantity ?? 'N/A',
          negativeInventoryStockValue: row?.negativeInventoryStockValue ?? 'N/A',
        };
      });

      if (rowsData?.length > 0) {
        if (isMobileDevice) {
          setPageState((prev) => ({
            ...prev,
            dataRows: !debouncedSearchValue ? [...prev?.dataRows, ...rowsData] : rowsData,
          }));
        } else {
          setPageState((prev) => ({
            ...prev,
            dataRows: rowsData,
          }));
        }
      }

      setPageState((prev) => ({
        ...prev,
        totalResults: response?.data?.data?.data?.totalResults,
        totalPages: response?.data?.data?.data?.totalPageNumber,
        loading: false,
      }));

      if (viewMoreLoader) {
        setViewMoreLoder(false);
      }
    } catch (err) {
      setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
      showSnackbar('Something went wrong', 'error');
      setViewMoreLoder(false);
    }
  };

  useEffect(() => {
    fetchOverSoldProducts();
  }, [searchParams]);

  // Update URL only after debounce delay
  useEffect(() => {
    if (isFirstRender.current) {
      getOversoldSummaryData();
      isFirstRender.current = false;
      return; // Skip the first execution
    }

    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', 0);
    setPageState((prev) => ({...prev, page: 0}));

    if (debouncedSearchValue) {
      updatedSearchParams.set('query', debouncedSearchValue);
    } else {
      updatedSearchParams.delete('query');
    }

    setSearchParams(updatedSearchParams);
  }, [debouncedSearchValue]); // Run only when debounced value updates

  return (
    <DashboardLayout>
      {!isMobileDevice && (
        <>
          <DashboardNavbar />
          <SoftBox className="content-left" sx={{ marginBottom: '10px' }}>
            <SoftTypography
              className={`stock-balance-tabs ${selected === 'OVER_SOLD_TODAY' && 'active-tab'}`}
              onClick={() => handleSelectTab('OVER_SOLD_TODAY')}
            >
              Today
            </SoftTypography>
            <SoftTypography
              className={`stock-balance-tabs ${selected === 'OVER_SOLD_30_DAYS' && 'active-tab'}`}
              onClick={() => handleSelectTab('OVER_SOLD_30_DAYS')}
            >
              Last 30 Days
            </SoftTypography>
            <SoftTypography
              className={`stock-balance-tabs ${selected === 'OVERALL' && 'active-tab'}`}
              onClick={() => handleSelectTab('OVERALL')}
            >
              Overall
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
                      placeholder="Search by product name or barcode"
                      value={searchValue}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchValue}
                    />
                    {searchValue !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                </Grid>
                <Grid item md={6.5} sm={4} xs={12}>
                  <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                    {/* <OversoldFilter searchParams={searchParams} setSearchParams={setSearchParams} /> */}
                  </SoftBox>
                </Grid>
              </Grid>

              {/* summary div  */}
              <TableSummaryDiv
                summaryHeading={'Oversold Summary'}
                summaryArray={analysisSummary !== undefined ? summaryArray : []}
                loader={summaryLoader}
                length={summaryArray?.length}
              />
            </SoftBox>
            {/* table */}
            <SoftBox
              className="dat-grid-table-box content-center"
              sx={{
                height: 525,
                width: '100%',
              }}
            >
              {pageState?.dataRows?.length === 0 && !pageState?.loading ? (
                <div className="No-data-text-box">
                  <div className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </div>
                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </div>
              ) : (
                <>
                  {pageState?.loading && (
                    <SoftBox className="loader-div">
                      <Spinner />
                    </SoftBox>
                  )}

                  {!pageState?.loading && pageState?.dataRows?.length > 0 && (
                    <DataGrid
                      sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                      columns={columns}
                      rows={pageState?.dataRows || []}
                      getRowId={(row) => row?.id}
                      rowCount={pageState?.totalResults}
                      loading={pageState?.loading}
                      pagination
                      page={pageState?.page}
                      pageSize={pageState?.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => handlePageChange(newPage)}
                      onPageSizeChange={(newPageSize) => {}}
                      onCellClick={(rows) => {
                        if (rows?.field !== 'barcode') {
                          handleProductNavigation(rows?.row?.barcode);
                        }
                      }}
                      disableSelectionOnClick
                    />
                  )}
                </>
              )}
            </SoftBox>
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
            <div>
              <OversoldFilter
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                isMobileDevice={isMobileDevice}
                pageState={pageState}
              />
            </div>
          </SoftBox>
          <SoftBox className="ros-app-purchase-component-main-div">
            <SoftBox>
              <CommonSubTabs
                selected={selected}
                handleSelectTab={handleSelectTab}
                filters={tabFilters}
                isMobileDevice={isMobileDevice}
              />

              <div className="pi-listing-card-main-div">
                {pageState?.loading && (
                  <SoftBox className="loader-div">
                    <Spinner />
                  </SoftBox>
                )}
                {pageState?.dataRows?.length === 0 && !pageState?.loading ? (
                  <NoDataFoundMob />
                ) : (
                  <>
                    {pageState?.dataRows?.map((product) => (
                      <OversoldMobileCard
                        data={product}
                        selected={selected}
                        showSnackbar={showSnackbar}
                        handleProductNavigation={handleProductNavigation}
                      />
                    ))}

                    {pageState?.dataRows?.length && showViewMore ? (
                      <ViewMore
                        loading={viewMoreLoader}
                        handleNextFunction={() => {
                          handlePageChange(pageState?.page + 1);
                          setViewMoreLoder(true);
                        }}
                      />
                    ) : null}
                  </>
                )}
              </div>
            </SoftBox>
          </SoftBox>
        </>
      )}
    </DashboardLayout>
  );
}
