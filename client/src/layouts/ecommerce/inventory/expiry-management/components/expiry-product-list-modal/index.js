import { CircularProgress, Grid, Modal, Paper, TableContainer } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import { getExpiryProductsList } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../../../Common/buttonColor';
import { ClearSoftInput, CopyToClipBoardValue, isSmallScreen, noDatagif, productIdByBarcode, textFormatter } from '../../../../Common/CommonFunction';
import './index.css';
import ExpiryProductListMobileCard from './mobile';
import ViewMore from '../../../../Common/mobile-new-ui-components/view-more';
import SoftInput from '../../../../../../components/SoftInput';
import { useDebounce } from 'usehooks-ts';

export const ExpiryProductsListTable = ({
  modalStatus,
  handleModalStatusAndModalTitle,
  modalTitle,
  locId,
  orgId,
  tab,
}) => {
  const isMobileDevice = isSmallScreen();
  const [errorComing, setErrorComing] = useState(false);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed

  //   table pagestate
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 20,
  });

  //   modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    handleModalStatusAndModalTitle({ status: false });
  };

  useEffect(() => {
    if (modalStatus === true) {
      handleOpenModal();
    }
    if (modalStatus === false) {
      handleCloseModal();
    }
  }, [modalStatus]);

  const [loading, setLoading] = useState(false);

  const defaultHeaderRenderer = ({ label }) => <div style={{ fontSize: '14px' }}>{textFormatter(label)}</div>;

  const getExpiryProductLists = async ({ pageNo }) => {
    try {
      if(pageNo !== 0){
        setLoading(true);
      }
      setPageState((prev) => ({ ...prev, loading: true }));

      const payload = {
        pageNo: pageNo,
        pageSize: 10,
        locationId: [locId],
        orgId: [orgId],
        lastThirtyDaysExpiredProduct: tab == 1 ? true : false,
        todayExpiringProduct: tab == 2 ? true : false,
        nextSevenDaysExpiringProduct: tab == 3 ? true : false,
        nextFourteenDaysExpiringProduct: tab == 4 ? true : false,
        searchBox: debouncedSearchValue,
      };

      const response = await getExpiryProductsList(payload);

      if (response?.data?.data?.es) {
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        showSnackbar(response?.data?.data?.message, 'error');
        setLoading(false);
        return;
      }

      const dataArr = response?.data?.data?.data?.data?.response || [];

      if (dataArr?.length === 0) {
        setErrorComing(true);
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        setLoading(false);
        return;
      }

      const showViewMoreButton = (payload.pageNo + 1) * payload?.pageSize < response?.data?.data?.data?.totalResults;
      setShowViewMore(showViewMoreButton);

      const rowsData = dataArr?.map((row, index) => {
        return {
          id: index,
          itemName: row?.itemName ? textFormatter(row?.itemName) : 'NA',
          barcode: row?.gtin || 'NA',
          brandName: row?.brandName || 'NA',
          locationId: row?.locationId || '',
          stockValue: row?.stockValue ?? 'NA',
          availableUnits: row?.availableUnits ?? 'NA',
          expiry: row?.expiry ?? 'NA',
          expectedStockOut: row?.expectedStockOut ?? 'NA',
        };
      });

      if(pageNo == 0){
        setPageState((prev) => ({ ...prev, dataRows: rowsData }));
      }else{
        setPageState((prev) => ({ ...prev, dataRows: [...prev.dataRows, ...rowsData] }));
      }

      setPageState((prev) => ({
        ...prev,
        totalResults: response?.data?.data?.data?.totalResults,
        totalPages: response?.data?.data?.data?.totalPageNumber,
        loading: false,
      }));

      setErrorComing(false);
      setLoading(false);
    } catch (err) {
      setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
      setErrorComing(true);
      setLoading(false);
    }
  };

  const handleProductNavigation = async ({ event, index, rowData }) => {
    try {
      if (isFetching) return;

      setIsFetching(true);
      const productId = await productIdByBarcode(rowData?.barcode);
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

  // handle search 
  const handleSearchValue = (e) => {
    const value = e.target.value;
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setSearchValue(value);
  };

  // clear search input fn
  const handleClearSearchInput = () => {
    setPageState((prev) => ({ ...prev, dataRows: [] }));
    setSearchValue('');
  };

  const reportPageHandler = () => {
    const paths = {
      '1': '/reports/InventoryChart/ExpiredProductsInTheLast30Days',
      '2': '/reports/InventoryChart/ProductsExpiringToday',
      '3': '/reports/InventoryChart/ProductsExpiringInTheNext7Days',
      '4': '/reports/InventoryChart/ProductsExpiringInTheNext14Days',
    };
    if (paths[tab]) {
      navigate(paths[tab]);
    }
  };

  // Initial API call for the first page
  useEffect(() => {
    if (pageState.page === 0) {
      getExpiryProductLists({ pageNo: 0 });
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      getExpiryProductLists({ pageNo: 0 });
    }  
  }, [debouncedSearchValue]);

  return (
    <Modal
      open={openModal}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: isMobileDevice ? '16px' : '20px 20px 0px',
          overflow: 'hidden',
          height: isMobileDevice ? '100%' : '',
          outline: 'none',
        }}
        className={isMobileDevice ? 'expiry-products-list-modal-div-mobile ' : 'products-list-modal-div'}
      >
        <div className="stock-count-create-product-popup-heading">
          <SoftTypography fontSize="14px" fontWeight="bold" color="primary">
            Showing {pageState?.totalResults} {modalTitle}
          </SoftTypography>
        </div>
        {/* search box  */}
        <Grid container spacing={2} pt={1}>
          <Grid item lg={9} md={9} xs={12}>
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
          {!isMobileDevice && (
            <Grid item lg={3} md={3} xs={12}>
              <SoftButton className="contained-softbutton" onClick={reportPageHandler}>
                Go To Reports
              </SoftButton>
            </Grid>
          )}
        </Grid>

        <SoftBox height={!isMobileDevice ? '75%' : '78%'} sx={{ overflow: isMobileDevice && 'scroll' }} mt={2} mb={2}>
          {errorComing && pageState?.dataRows?.length === 0 ? (
            <SoftBox className="No-data-text-box content-center">
              <SoftBox className="src-imgg-data">
                <img className="src-dummy-img" src={noDatagif} />
              </SoftBox>
            </SoftBox>
          ) : (
            <>
              {!isMobileDevice && pageState?.dataRows?.length > 0 ? (
                <TableContainer style={{ height: '100%', width: '100%', postition: 'relative' }} component={Paper}>
                  <AutoSizer>
                    {({ height, width }) => (
                      <Table
                        className="expiry-products-list-table"
                        width={2000}
                        overflow={'scroll'}
                        height={height}
                        headerHeight={50}
                        rowHeight={40}
                        rowCount={pageState?.dataRows?.length}
                        rowGetter={({ index }) => pageState?.dataRows[index]}
                      >
                        <Column
                          width={70}
                          label="S.No"
                          dataKey="adjustmentId"
                          headerRenderer={defaultHeaderRenderer}
                          cellRenderer={({ rowIndex }) => <div>{rowIndex + 1}</div>}
                        />
                        <Column
                          width={350}
                          label="Product Name"
                          dataKey="itemName"
                          headerRenderer={defaultHeaderRenderer}
                          cellRenderer={({ cellData, rowData }) => (
                            <div onClick={() => handleProductNavigation({ rowData })}>{cellData}</div>
                          )}
                        />
                        <Column
                          width={200}
                          label="Barcode"
                          dataKey="barcode"
                          headerRenderer={defaultHeaderRenderer}
                          cellRenderer={({ cellData }) => (
                            <div className="content-space-between flex-gap">
                              <div>{cellData}</div>
                              <div>
                                <CopyToClipBoardValue params={cellData} paddingRight={'20px'} />
                              </div>
                            </div>
                          )}
                        />
                        <Column width={250} label="Brand" dataKey="brandName" headerRenderer={defaultHeaderRenderer} />
                        <Column
                          width={200}
                          label={tab != 1 ? 'Quantities Expiring' : 'Quantities Expired'}
                          dataKey="availableUnits"
                          headerRenderer={defaultHeaderRenderer}
                        />
                        <Column
                          width={150}
                          label="Stock Value"
                          dataKey="stockValue"
                          headerRenderer={defaultHeaderRenderer}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                </TableContainer>
              ) : null}
              {/* for mobile screen  */}
              {isMobileDevice && pageState?.dataRows?.length ? (
                <div className="ros-app-purchase-component-main-div">
                  <div className="pi-listing-card-main-div" style={{ paddingTop: '10px' }}>
                    {pageState?.dataRows?.map((data, index) => (
                      <ExpiryProductListMobileCard
                        index={index + 1}
                        data={data}
                        handleProductNavigation={handleProductNavigation}
                        tab={tab}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
          {loading === false && pageState.loading && pageState.page === 0 && (
            <SoftBox className="content-center" sx={{ width: '100%', marginTop: '30px' }}>
              <CircularProgress size={40} className="circular-progress-loader" />
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox className="content-space-between">
          {showViewMore && (
            <ViewMore
              loading={loading}
              handleNextFunction={() => {
                if (pageState.page < pageState.totalPages - 1) {
                  setPageState((prev) => ({ ...prev, page: prev.page + 1 }));
                  getExpiryProductLists({ pageNo: pageState.page + 1});
                }
              }}
            />
          )}
          <SoftButton
            variant={buttonStyles.primaryVariant}
            onClick={() => {
              handleCloseModal();
            }}
            color="error"
          >
            Close
          </SoftButton>
        </SoftBox>
      </div>
    </Modal>
  );
};
