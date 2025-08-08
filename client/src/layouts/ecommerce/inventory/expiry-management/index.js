import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, CircularProgress, Grid, Popover } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import { getProductExpiryByBatch, getProductsExpiryData, getProductsExpirySummary } from '../../../../config/Services';
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
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../Common/buttonColor';
import {
  ClearSoftInput,
  CopyToClipBoard,
  formatNumber,
  isSmallScreen,
  noDatagif,
  productIdByBarcode,
  textFormatter,
  truncateWord,
} from '../../Common/CommonFunction';
import CommonSearchBar from '../../Common/MobileSearchBar';
import TableSummaryDiv from '../../Common/new-ui-common-components/table-summary-div/TableSummaryDiv';
import NoDataFound from '../../Common/No-Data-Found';
import ExpiryMobileCard from './components/expiry-mobile-card';
import { ExpiryProductsListTable } from './components/expiry-product-list-modal';
import ExpiryManagementFilter from './components/filter';
import './index.css';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import PurchaseAdditionalDetails from '../../purchase/ros-app-purchase/components/purchase-additional-details';

export const ExpiryManagement = () => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const persistedPage = useSelector(getPage);
  const persistedSearchValue = useSelector(getSearchValue);
  const pageTitle = useSelector(getPageTitle);

  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const showSnackbar = useSnackbar();

  // <--- states
  const [infiniteLoader, setInfiniteLoader] = useState(false);

  //   const [loading, setLoading] = useState(false);
  const [errorComing, setErrorComing] = useState(false);

  const [searchValue, setSearchValue] = useState(persistedSearchValue || '');
  const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed

  const [analysisSummary, setAnalysisSummary] = useState({});
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [rows, setRows] = useState([]);
  const [productTitle, setProductTitle] = useState('');
  const [productExpiryDetailsByBatch, setProductExpiryDetailsByBatch] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  // Initial modal status is determined by checking if the 'modal' parameter is in the URL
  // const initialModalStatus = searchParams.get('modal') === 'true';
  const [modalStatus, setModalStatus] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [tab, setTab] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);

  // Update modalStatus based on the URL when component mounts
  useEffect(() => {
    const modalQueryParam = searchParams.get('modal');
    const tabQueryParam = searchParams.get('tab');
    let titleQueryParam = searchParams.get('title');

    if (modalQueryParam === 'true') {
      setModalStatus(true);
    }
    if (tabQueryParam) {
      setTab(tabQueryParam);
    }
    if (titleQueryParam) {
      // titleQueryParam = titleQueryParam.split("+").join(" ");
      setModalTitle(titleQueryParam);
    }
  }, [searchParams]);

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
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 10,
  });

  // states --->

  //  show product expiry by batch info modal expiry
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalBatchData, setOpenModalBatchData] = useState(false);

  const handleOpenModalBatchData = (event) => {
    setOpenModalBatchData(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseModalBatchData = () => {
    setOpenModalBatchData(false);
    setAnchorEl(null);
  };

  const handleModalStatusAndModalTitle = ({ status, title, tabNumber }) => {
    setModalStatus(status);
    setModalTitle(title || '');
    setTab(tabNumber || '');

    // if (status) {
    // Add modal=true to the URL
    // searchParams.set('modal', 'true');
    // setSearchParams(searchParams);
    // } else {
    //   // Remove modal from the URL
    //   searchParams.delete('modal');
    //   setSearchParams(searchParams);
    // }

    // Create a new instance of searchParams to modify both values
    const updatedSearchParams = new URLSearchParams(searchParams);

    if (status) {
      // Set both modal and page parameters
      updatedSearchParams.set('modal', 'true');
      updatedSearchParams.set('tab', tabNumber);
      updatedSearchParams.set('title', title);
    } else {
      // Remove 'modal' but keep 'page'
      updatedSearchParams.delete('modal');
      updatedSearchParams.delete('tab');
      updatedSearchParams.delete('title');
    }

    // Update the URL with both parameters
    setSearchParams(updatedSearchParams);
  };

  const columns = [
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
      field: 'batchId',
      headerName: 'Batch',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 80,
      flex: 1,
      renderCell: (params) => {
        return (
          <InfoOutlinedIcon
            color="primary"
            sx={{ width: '1.5em', height: '1.5em' }}
            onClick={(e) => {
              handleOpenModalBatchData(e);
              getProductExpiryByBatchData(params);
              setProductTitle(params?.row?.title);
            }}
          />
        );
      },
    },
    {
      field: 'stockValue',
      headerName: 'Stock Value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'availableUnits',
      headerName: 'Available Units',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'expiry',
      headerName: 'Expiry',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'expectedStockOut',
      headerName: 'Expected Stock Out',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
    },
  ];

  const summaryArray = [
    {
      title: 'Expired Value In Last 30 Days',
      value: (
        <>
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.expiredValue)} from `}
          <div
            onClick={() =>
              handleModalStatusAndModalTitle({
                status: true,
                title: 'Products Expired in Last 30 Days',
                tabNumber: '1',
              })
            }
            className="table-summary-clickable"
          >
            <u className="highlightText">{`${formatNumber(analysisSummary?.expiredStock)} products`}</u>
          </div>
        </>
      ),
    },
    {
      title: <SoftBox color="error">Expiring Today</SoftBox>,
      value: (
        <>
          {/* 6,894 from 33 products */}
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.stockCDate)} from `}
          <div
            onClick={() =>
              handleModalStatusAndModalTitle({ status: true, title: 'Products Expiring Today', tabNumber: '2' })
            }
            className="table-summary-clickable"
          >
            <u className="highlightText">{`${formatNumber(analysisSummary?.availableCDate)} products`}</u>
          </div>
        </>
      ),
    },
    {
      title: <SoftBox color="warning">Estimated Expiry Within 7 days</SoftBox>,
      value: (
        <>
          {/* 5,234 from 67 products */}
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.stock7Days)} from `}
          <div
            onClick={() =>
              handleModalStatusAndModalTitle({ status: true, title: 'Products Expiring Within 7 days', tabNumber: '3' })
            }
            className="table-summary-clickable"
          >
            <u className="highlightText">{`${formatNumber(analysisSummary?.available7Days)} products`}</u>
          </div>
        </>
      ),
    },
    {
      title: 'Estimated Expiry Within 14 days',
      value: (
        <>
          {/* 234 from 17 products */}
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.stock14Days)} from `}
          <div
            onClick={() =>
              handleModalStatusAndModalTitle({
                status: true,
                title: 'Products Expiring Within 14 days',
                tabNumber: '4',
              })
            }
            className="table-summary-clickable"
          >
            <u className="highlightText">{`${formatNumber(analysisSummary?.available14Days)} products`}</u>
          </div>
        </>
      ),
    },
  ];

  //   functions
  const handleSearchValue = (e) => {
    const value = e.target.value;
    setRows([]);
    setSearchValue(value);
    dispatch(setSearchValueFilter(value));
  };

  // clear search input fn
  const handleClearSearchInput = () => {
    setRows([]);
    setSearchValue('');
    dispatch(setSearchValueFilter(''));
  };

  const getExpirySummaryData = async () => {
    try {
      setSummaryLoader(true);

      const payload = {
        locationId: [locId],
        orgId: [orgId],
      };

      const response = await getProductsExpirySummary(payload);
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
      console.log(err);
    }
  };

  const getExpiryDay = (value) => {
    switch (value) {
      case 'Newly Added':
        return value;
      case 'Dead Stock':
        return value;
      case 1:
        return value + ' Day';
      case '1':
        return value + ' Day';
      case 0:
        return 'Today';
      case '0':
        return 'Today';
      case null:
        return 'NA';
      case undefined:
        return 'NA';
      default:
        return value + ' Days';
    }
  };

  const getProductsExpirationData = async ({ pageNo, filterObject }) => {
    try {
      if (isMobileDevice) {
        setInfiniteLoader(true);
      }
      setPageState((prev) => ({ ...prev, loading: true }));

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
        ...obj,
      };

      setPageState((prev) => ({ ...prev, page: pageNo }));

      const response = await getProductsExpiryData(payload);

      if (response?.data?.data?.es) {
        setErrorComing(true);
        setRows([]);
        setPageState((prev) => ({ ...prev, loading: false }));
        showSnackbar(response?.data?.data?.message, 'error');
        setInfiniteLoader(false);
        return;
      }

      const dataArr = response?.data?.data?.data?.data || [];

      if (dataArr?.length === 0) {
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, loading: false }));
        setInfiniteLoader(false);
        setRows([]);
        return;
      }

      const showViewMoreButton = (payload.pageNo + 1) * pageState?.pageSize < response?.data?.data?.data?.totalResults;
      setShowViewMore(showViewMoreButton);

      const rowsData = dataArr?.map((row, index) => {
        return {
          id: index,
          title: textFormatter(row?.itemName) || 'NA',
          barcode: row?.gtin || 'NA',
          brand: textFormatter(row?.brandName) || 'NA',
          batchId: row?.batchNo || 'NA', // this will be number of batches
          stockValue: row?.stockValue ?? 'NA',
          availableUnits: row?.availableUnits ?? 'NA',
          expiry: getExpiryDay(row?.expiry),
          expectedStockOut: getExpiryDay(row?.expectedStockOut),
        };
      });

      if(rowsData?.length > 0){
        if (isMobileDevice) {
          if(debouncedSearchValue !== "" || pageNo === 0){
            setRows(rowsData);
          }else{
            setRows((prev) => [...prev, ...rowsData]);
          }
        } else {
          setRows(rowsData);
        }
      }else {
        setErrorComing(true);
      }

      setPageState((prev) => ({
        ...prev,
        totalPages: response?.data?.data?.data?.totalPageNumber,
        totalResults: response?.data?.data?.data?.totalResults,
        loading: false,
      }));

      setInfiniteLoader(false);
      setErrorComing(false);
    } catch (err) {
      setRows([]);
      setErrorComing(true);
      setPageState((prev) => ({ ...prev, loading: false }));
      showSnackbar('Something went wrong', 'error');
      setInfiniteLoader(false);
      console.log(err);
    }
  };

  const [batchLoader, setBatchLoader] = useState(false);
  const getProductExpiryByBatchData = async (data) => {
    const { barcode } = data.row;
    try {
      setBatchLoader(true);
      const payload = {
        locationId: locId,
        orgId: orgId,
        gtin: barcode,
      };

      const response = await getProductExpiryByBatch(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setBatchLoader(false);
        return;
      }

      if (isMobileDevice) {
        setProductExpiryDetailsByBatch((prev) => ({ ...prev, [barcode]: response?.data?.data?.data }));
      } else {
        setProductExpiryDetailsByBatch(response?.data?.data?.data);
      }
      setBatchLoader(false);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
      setProductExpiryDetailsByBatch([]);
      setBatchLoader(false);
    }
  };

  const handleProductNavigation = async (barcode) => {
    try {
      if (isFetching) return;

      setIsFetching(true);
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`, { state: { overrideNavigateNull: true } });
      } else {
        showSnackbar('Product Not Found', 'error');
      }

      setIsFetching(false);
    } catch (error) {
      showSnackbar('Something Went Wrong', 'error');
      setIsFetching(false);
    }
  };

  const handleCellClick = (rows) => {
    const productId = rows?.row?.barcode;
    handleProductNavigation(productId);
  };

  useEffect(() => {
    if (pageTitle !== 'expiry-management') {
      dispatch(resetCommonReduxState());
      dispatch(setPageTitle('expiry-management'));
    }
    getExpirySummaryData();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (debouncedSearchValue !== '') {
        getProductsExpirationData({ pageNo: 0 });
      } else {
        getProductsExpirationData({ pageNo: persistedPage });
      }
    }
  }, [debouncedSearchValue, filterObjectMain, isInitialized]);

  return (
    <DashboardLayout>
      {!isMobileDevice ? (
        <>
          <DashboardNavbar />
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
                    <ExpiryManagementFilter filterObjectMain={filterObjectMain} showSnackbar={showSnackbar} />
                  </SoftBox>
                </Grid>
              </Grid>

              {/* summary div  */}
              <TableSummaryDiv
                summaryHeading={'Expiry Summary'}
                summaryArray={analysisSummary !== undefined ? summaryArray : []}
                loader={summaryLoader}
                length={4}
              />
            </SoftBox>
            {pageState.loading ? (
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
              <SoftBox
                className="dat-grid-table-box"
                sx={{
                  height: 525,
                  width: '100%',
                }}
              >
                {errorComing && rows.length === 0 ? (
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
                    {!pageState.loading && (
                      <DataGrid
                        sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                        columns={columns}
                        rows={rows}
                        getRowId={(row) => row?.id}
                        rowCount={pageState?.totalResults}
                        loading={pageState?.loading}
                        pagination
                        page={pageState?.page}
                        pageSize={pageState?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          //   setPageState((old) => ({ ...old, page: newPage }));
                          getProductsExpirationData({ pageNo: newPage });
                          dispatch(setPage(newPage));
                        }}
                        onPageSizeChange={(newPageSize) => {
                          setPageState((old) => ({ ...old, pageSize: newPageSize }));
                        }}
                        onCellClick={(rows) => {
                          // prevent redirecting to details page when the barcode/gtin column is clicked as it contains copy barcode option
                          if (rows.field !== 'barcode' && rows.field !== 'batchId') {
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
              <ExpiryManagementFilter
                filterObjectMain={filterObjectMain}
                showSnackbar={showSnackbar}
                isMobileDevice={isMobileDevice}
                pageState={pageState}
              />
            </div>
          </SoftBox>
          <SoftBox className="ros-app-purchase-component-main-div">
            <SoftBox>
              <SoftBox className="pi-listing-card-main-div" sx={{ marginTop: '10px' }}>
                {!errorComing ? (
                  <>
                    {rows?.map((product) => (
                      <ExpiryMobileCard
                        data={product}
                        getProductExpiryByBatchData={getProductExpiryByBatchData}
                        setProductTitle={setProductTitle}
                        handleOpenModalBatchData={handleOpenModalBatchData}
                        productExpiryDetailsByBatch={productExpiryDetailsByBatch}
                        getExpiryDay={getExpiryDay}
                        batchLoader={batchLoader}
                      />
                    ))}

                    {showViewMore && (
                      <ViewMore
                        loading={infiniteLoader}
                        handleNextFunction={() => getProductsExpirationData({ pageNo: pageState.page + 1 })}
                      />
                    )}
                    {!infiniteLoader && !rows?.length && <NoDataFound message={'No Products Found'} />}
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

      {/* modal to show product based on expiry  */}
      {modalStatus && (
        <ExpiryProductsListTable
          {...{ modalTitle, modalStatus, handleModalStatusAndModalTitle, pageState, setPageState, locId, orgId, tab }}
        />
      )}

      {/* modal  */}
      <Popover
        anchorEl={anchorEl}
        // anchorOrigin={{
        //   vertical: 'bottom',
        //   horizontal: 'left',
        // }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openModalBatchData}
        onClose={handleCloseModalBatchData}
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
            padding: '20px 20px 15px',
          }}
        >
          <SoftTypography fontSize="14px" fontWeight="bold">
            Expiry Details {productTitle ? ` - ${truncateWord(productTitle)}` : null}
          </SoftTypography>
          <SoftBox
            className="batch-info-modal"
            style={{ overflowY: productExpiryDetailsByBatch?.length && 'auto !important' }}
            mt={2}
            mb={2}
          >
            {productExpiryDetailsByBatch?.length ? (
              productExpiryDetailsByBatch?.map((data) => (
                <SoftBox className="batch-info-modal-inner-div">
                  <SoftBox>
                    <SoftTypography fontSize="14px">Batch Number</SoftTypography>
                    <SoftTypography fontSize="14px" color="primary">
                      {data?.batchNo || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography fontSize="14px">Available Units</SoftTypography>
                    <SoftTypography fontSize="14px">{data?.availableUnits ?? 'NA'}</SoftTypography>
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography fontSize="14px">Expiry Days</SoftTypography>
                    <SoftTypography fontSize="14px">{getExpiryDay(data?.expiry)}</SoftTypography>
                  </SoftBox>
                </SoftBox>
              ))
            ) : (
              <SoftBox className="no-data-found" height="100px !important">
                <SoftTypography fontSize="14px">No Data Found</SoftTypography>
              </SoftBox>
            )}
          </SoftBox>

          <SoftBox sx={{ marginBottom: '10px !important' }}>
            <SoftBox className="header-submit-box-i">
              <SoftButton
                onClick={handleCloseModalBatchData}
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
    </DashboardLayout>
  );
};
