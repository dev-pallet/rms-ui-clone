import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import Spinner from '../../../components/Spinner';
import { getCreditNoteTransferLogs, getOverSoldProductsLists } from '../../../config/Services';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
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
import ViewMore from '../Common/mobile-new-ui-components/view-more';
import CreditNoteTransfer from '../vendor/components/vendor-details-page/credit-note-transfer-creation';
import CreditNoteTransferMobileCard from './components/mobile';
import './index.css';

export default function CreditNoteTransferListing({
  mobileSearchedValue,
  OpenCreditTransferModalMob,
  setOpenCreditTransferModalMob,
}) {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();

  const [searchParams, setSearchParams] = useSearchParams(); // For query parameters

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue || mobileSearchedValue, 500);

  //   const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed

  const [showViewMore, setShowViewMore] = useState(true);
  const [viewMoreLoader, setViewMoreLoder] = useState(false);
  // previous
  const [loadPrevious, setLoadPrevious] = useState(false);
  const [OpenCreditTransfer, setOpenCreditTransfer] = useState(OpenCreditTransferModalMob || false);

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

  const handleCreditNoteTransferModal = () => {
    setOpenCreditTransfer(false);
    setOpenCreditTransferModalMob && setOpenCreditTransferModalMob(false);
  };

  const columns = useMemo(() => {
    return [
      {
        field: 'transferLogId',
        headerName: 'Transfer Id',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 220,
        flex: 1,
      },
      {
        field: 'transferDate',
        headerName: 'Transfer Date',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 220,
        flex: 1,
      },
      {
        field: 'transferredCredits',
        headerName: 'Transferred Credits',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'sourceVendorId',
        headerName: 'Source Vendor Id',
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
        field: 'sourceVendorName',
        headerName: 'Source Vendor Name',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 180,
        flex: 1,
      },

      {
        field: 'destinationVendorId',
        headerName: 'Destination Vendor Id',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'destinationVendorName',
        headerName: 'Destination Vendor Name',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'transferredByName',
        headerName: 'Transferred By',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 120,
        flex: 1,
      },
    ];
  }, []);

  const fetchCreditNoteTranferLogs = async () => {
    const payload = {
      pageNo: pageState?.page,
      pageSize: 10,
      orgId: [orgId],
      searchBox: debouncedSearchValue || '',
    };

    try {
      setPageState((prev) => ({ ...prev, loading: true }));

      const response = await getCreditNoteTransferLogs(payload);

      if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message || 'Something went wrong', 'error');
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        setViewMoreLoder(false);
        return;
      }

      const dataArr = response?.data?.data?.data?.vendorCreditTransferLogEntityList || [];

      if (dataArr?.length === 0) {
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false }));
        setViewMoreLoder(false);
        return;
      }

      const showViewMoreButton = (payload?.pageNo + 1) * pageState?.pageSize < response?.data?.data?.totalResults;
      setShowViewMore(showViewMoreButton);

      const rowsData = dataArr?.map((row, index) => {
        return {
          id: index,
          transferLogId: row?.transferLogId || 'N/A',
          transferDate: row?.transferDate ? dateFormatter(row?.transferDate) : 'N/A',
          transferredCredits: row?.transferredCredits ?? 'N/A',
          sourceVendorId: row?.sourceVendor?.vendorId || 'N/A',
          sourceVendorName: row?.sourceVendor?.vendorName ? textFormatter(row?.sourceVendor?.vendorName) : 'N/A',
          destinationVendorId: row?.destinationVendor?.vendorId || 'N/A',
          destinationVendorName: row?.destinationVendor?.vendorName
            ? textFormatter(row?.destinationVendor?.vendorName)
            : 'N/A',
          transferredByName: row?.transferredByName || 'N/A',
        };
      });

      if (rowsData?.length > 0) {
        if (isMobileDevice) {
          if (loadPrevious) {
            setPageState((prev) => ({
              ...prev,
              dataRows: !debouncedSearchValue ? [...rowsData, ...prev?.dataRows] : rowsData,
            }));
            setLoadPrevious(false);
          } else {
            if (pageState?.page === 0) {
              setPageState((prev) => ({
                ...prev,
                dataRows: rowsData,
              }));
            } else {
              setPageState((prev) => ({
                ...prev,
                dataRows: !debouncedSearchValue ? [...prev?.dataRows, ...rowsData] : rowsData,
              }));
            }
          }
        } else {
          setPageState((prev) => ({
            ...prev,
            dataRows: rowsData,
          }));
        }
      }

      setPageState((prev) => ({
        ...prev,
        totalResults: response?.data?.data?.totalResults,
        totalPages: response?.data?.data?.totalPageNumber,
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
    fetchCreditNoteTranferLogs();
  }, [searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip the first execution
    }

    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', 0);
    setPageState((prev) => ({ ...prev, page: 0 }));

    if (debouncedSearchValue) {
      updatedSearchParams.set('query', debouncedSearchValue);
    } else {
      updatedSearchParams.delete('query');
    }

    setSearchParams(updatedSearchParams);
  }, [debouncedSearchValue]); // Run only when debounced value updates

  useEffect(() => {
    setSearchValue(mobileSearchedValue || '');
  }, [mobileSearchedValue]);

  useEffect(() => {
    setOpenCreditTransfer(OpenCreditTransferModalMob);
  }, [OpenCreditTransferModalMob]);

  return (
    <DashboardLayout>
      {OpenCreditTransfer && (
        <CreditNoteTransfer
          orgId={orgId}
          OpenCreditTransfer={OpenCreditTransfer}
          handleCreditNoteTransferModal={handleCreditNoteTransferModal}
          isMobileDevice={isMobileDevice}
          reloadFn={fetchCreditNoteTranferLogs}
        />
      )}
      {!isMobileDevice ? (
        <>
          <DashboardNavbar />
          <SoftBox className="search-bar-filter-and-table-container">
            <SoftBox className="search-bar-filter-container">
              <Grid container spacing={2} className="filter-product-list-cont">
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      placeholder="Search"
                      value={searchValue}
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchValue}
                    />
                    {searchValue !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                  </SoftBox>
                </Grid>
                <Grid item md={6.5} sm={4} xs={12}>
                  <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end !important' }}>
                    <SoftButton variant="solidWhiteBackground" onClick={() => setOpenCreditTransfer(true)}>
                      <AddIcon sx={{ mr: '5px' }} />
                      New
                    </SoftButton>
                  </SoftBox>
                </Grid>
              </Grid>
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
                      // rows={[]}
                      getRowId={(row) => row?.id}
                      rowCount={pageState?.totalResults}
                      loading={pageState?.loading}
                      pagination
                      page={pageState?.page}
                      pageSize={pageState?.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => handlePageChange(newPage)}
                      onPageSizeChange={(newPageSize) => {}}
                      onCellClick={(rows) => {}}
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
            <div className="pi-listing-card-main-div">
              {pageState?.page > 0 &&
              pageState?.dataRows?.length <= (pageState?.page + 1) * pageState?.pageSize &&
              !pageState?.loading ? (
                <div
                  className="content-left view-previous-btn"
                  onClick={() => {
                    setLoadPrevious(true);
                    handlePageChange(pageState?.page - 1);
                  }}
                >
                  Load Previous
                </div>
              ) : null}
              {pageState?.loading && !viewMoreLoader && (
                <SoftBox className="loader-div">
                  <Spinner />
                </SoftBox>
              )}
              {pageState?.dataRows?.length === 0 && !pageState?.loading ? (
                <NoDataFoundMob />
              ) : (
                <>
                  {pageState?.dataRows?.map((creditNote) => (
                    <CreditNoteTransferMobileCard data={creditNote} showSnackbar={showSnackbar} />
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
        </>
      )}
    </DashboardLayout>
  );
}
