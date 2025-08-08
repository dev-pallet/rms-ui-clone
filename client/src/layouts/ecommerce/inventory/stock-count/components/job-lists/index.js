import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../../../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Grid, IconButton, Tooltip } from '@mui/material';
import { debounce } from 'lodash';
import { format, parseISO } from 'date-fns';
import { getAllOrgUsers, getStockCountJobLists } from '../../../../../../config/Services';
import {
  getStockCountFilters,
  getStockCountPage,
  getStockCountSearchValue,
  getStockCountUsersList,
  getStockCountUsersUidxList,
  setStockCountFilters,
  setStockCountPage,
  setStockCountSearchValue,
  setStockCountUsersList,
  setStockCountUsersUidxList,
} from '../../../../../../datamanagement/Filters/stockCountSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import Spinner from '../../../../../../components/Spinner';
import Status from '../../../../Common/Status';
import StockCountFilter from '../filter/StockCountFilter';
import MobileSearchBar from '../../../../Common/mobile-new-ui-components/mobile-searchbar';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';
import './index.css';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';
import ViewMore from '../../../../Common/mobile-new-ui-components/view-more';
import NoDataFoundMob from '../../../../Common/mobile-new-ui-components/no-data-found';

const formatDateFromISO = (date) => format(parseISO(date), 'PPP');

export const JobLists = () => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getStockCountFilters);
  // const persistedFiltersAppliedCount = useSelector(getAllProductsFiltersCount);
  // const persistedFilterStateData = useSelector(getAllProductsFilterStateData);
  const persistedUsersList = useSelector(getStockCountUsersList);
  const persistedUsersUidxList = useSelector(getStockCountUsersUidxList);
  const persistedPage = useSelector(getStockCountPage);
  const persistedSearchValue = useSelector(getStockCountSearchValue);

  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const jobCreationStatus = localStorage.getItem('jobCreationStatus');
  const [rows, setRows] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const location = useLocation();
  const [searchText, setSearchText] = useState(persistedSearchValue || '');
  const [debouceSearch, setDebouceSearch] = useState(persistedSearchValue || '');

  const [usersList, setUsersList] = useState(persistedUsersList || []);
  const [uidxList, setUidxList] = useState(persistedUsersUidxList || []);
  const [isApplied, setIsApplied] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [showViewMore, setShowViewMore] = useState(false);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);

  // const [filters, setFilters] = useState({
  //   status: persistedFilters?.status?.value ? [persistedFilters?.status?.value] : [],
  //   startDate: persistedFilters?.startDate || '',
  //   endDate: persistedFilters?.endDate || '',
  //   assigneeUidx: persistedFilters?.assignee?.uidx ? [persistedFilters?.assignee?.uidx] : uidxList,
  // });

  const filterObjectMain = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          status: [],
          startDate: '',
          endDate: '',
          assigneeUidx: [],
        };
  }, [persistedFilters]);

  const [pageState, setPageState] = useState({
    loading: false,
    datRows: [],
    totalResults: 0,
    totalPages: 0,
    page: persistedPage,
    pageSize: 10,
  });

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 130,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'job_type',
      headerName: 'Job Type',
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 170,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => <Status label={params?.value} />,
    },
    {
      field: 'total_products',
      headerName: 'Total Products',
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
    },
    {
      field: 'due_date',
      headerName: 'Due Date',
      flex: 1,
      minWidth: 130,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'progress',
      headerName: 'Progress',
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => <span>{params?.value}%</span>,
      flex: 1,
    },
    {
      field: 'counter',
      headerName: 'Counter',
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Tooltip title={params?.value} placement="top">
          <IconButton>
            <AccountCircleIcon color="primary" sx={{ width: '1.5em', height: '1.5em' }} />
          </IconButton>
        </Tooltip>
      ),
      flex: 1,
    },
    {
      field: 'last_updated',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 180,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  const handleCreateNewJob = () => {
    navigate('/inventory/stock-count/create-new-job');
  };

  const handleScheduler = (id, sessionId, status, job_type) => {
    if (status === 'CREATION_IN_PROGRESS') {
      return showSnackbar('Creation In Progess', 'warning');
    }
    navigate(`/inventory/stock-count/stock-count-details/${id}/${sessionId}`, { state: { jobType: job_type } });
  };

  // const get all users list fn

  const getJobLists = async ({ pageNo, filterObject }) => {
    try {
      setPageState((prev) => ({ ...prev, loading: true, page: pageNo }));
      setIsApplied(false);

      const obj = filterObject
        ? filterObject
        : {
            status: filterObjectMain?.status?.value ? [filterObjectMain?.status?.value] : [],
            startDate: filterObjectMain?.startDate,
            endDate: filterObjectMain?.endDate,
            assigneeUidx: filterObjectMain?.assigneeUidx?.uidx ? [filterObjectMain?.assigneeUidx?.uidx] : uidxList,
          };

      const payload = {
        locationId: locId,
        jobTitle: searchText,
        pageNumber: pageNo,
        pageSize: pageState?.pageSize,
        ...obj,
      };

      const response = await getStockCountJobLists(payload);

      // console.log(response.data);
      if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setPageState((prev) => ({ ...prev, loading: false, totalResults: 0 }));
        setRows([]);
        setShowViewMore(false);
        setViewMoreLoader(false);
        return;
      }

      setPageState((prev) => ({ ...prev, loading: true, totalResults: response?.data?.data?.total }));
      const totalPages = Math.ceil(response?.data?.data?.total / pageState?.pageSize);

      // Check if we are on the last page
      if (response?.data?.data?.pageNumber >= totalPages - 1) {
        setShowViewMore(false); // Hide "View More" if on the last page
      } else {
        setShowViewMore(true); // Show "View More" if there are more pages
      }

      const data = response?.data?.data?.jobs;
      const rows = data?.map((item, index) => {
        return {
          id: index || 'NA',
          jobId: item?.jobId || 'NA',
          date: item?.date ? dateFormatter(item?.date) : 'NA',
          job_type: item?.jobType || 'NA',
          status: item?.status || 'NA',
          total_products: item?.totalProducts ?? 'NA',
          due_date: item?.dueDate || 'NA',
          // title: textFormatter(item?.title) || 'NA',
          title: item?.title || 'NA',
          progress: item?.progress ?? 'NA',
          counter: item?.assigneeDto?.assigneeName || 'NA',
          last_updated: format(parseISO(item?.updated), 'dd MMM yyyy - hh:mm a') || 'NA',
          sessionId: item?.sessionId || 'NA',
        };
      });
      if (isMobileDevice) {
        setRows((prev) => [...prev, ...rows]);
      } else {
        setRows(rows);
      }
      setPageState((prev) => ({ ...prev, loading: false }));
      setViewMoreLoader(false);
    } catch (err) {
      setRows([]);
      setPageState((prev) => ({ ...prev, loading: false, totalResults: 0, totalPages: 0, page: 0, pageSize: 10 }));
      showSnackbar(err?.message, 'error');
    }
  };
  const handleClearSearch = () => {
    setSearchText('');
    debouncedSearch('');
  };

  const debouncedSearch = useRef(
    debounce((value) => {
      dispatch(setStockCountSearchValue(value));
      setDebouceSearch(value);
    }, 1000),
  ).current;

  useEffect(() => {
    if (debouceSearch !== '') {
      return;
    }
    if (jobCreationStatus !== null) {
      showSnackbar(jobCreationStatus, 'success');
      localStorage.removeItem('jobCreationStatus');
    }
    if (persistedUsersUidxList?.length !== 0 || uidxList?.length !== 0) {
      getJobLists({ pageNo: persistedPage });
      return;
    } else {
      const getAllUsers = async () => {
        const getUsersDataPayload = {
          orgId: orgId,
          contextId: locId,
        };
        let user_lists = [];
        let usersUidxList = [];
        if (!locId) {
          showSnackbar(`No location found for ${orgId}`, 'error');
        } else {
          const res = await getAllOrgUsers(getUsersDataPayload);
          usersUidxList = res?.data?.data?.map((row) => row?.uidx);
          // console.log('uidx', usersUidxList);
          setUidxList(usersUidxList);
          dispatch(setStockCountUsersUidxList(usersUidxList));

          user_lists = res?.data?.data?.map((row) => ({
            label: textFormatter(row?.firstName + ' ' + row?.secondName),
            value: row?.firstName,
            name: row?.firstName + ' ' + row?.secondName,
            uidx: row?.uidx,
          }));
          setUsersList(user_lists);
          dispatch(setStockCountUsersList(user_lists));
        }
      };

      getAllUsers();
    }
  }, [usersList, filterObjectMain, debouceSearch]);

  useEffect(() => {
    if (debouceSearch !== '') {
      getJobLists({ pageNo: 0 });
    }
  }, [debouceSearch, filterObjectMain]);

  // for mobile 
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);

  const filters = useMemo(() => [
    { filterLabel: 'Status', filterValue: 'status' },
    { filterLabel: 'Start Date', filterValue: 'startDate' },
    { filterLabel: 'End Date', filterValue: 'endDate' },
    { filterLabel: 'Assignee', filterValue: 'assignee'}
  ],[]);

  const filterOptions = useMemo(() => ({
    status: [
      { value: 'CREATED', label: 'Created' },
      { value: 'INPROGRESS', label: 'In Progress' },
      { value: 'APPROVAL_PENDING', label: 'Approval Pending' },
      { value: 'COMPLETED', label: 'Completed' },
    ],
    startDate: [{ value: 'custom', label: 'Custom' }],
    endDate: [{ value: 'custom', label: 'Custom' }],
    assignee: persistedUsersList
  }), [persistedUsersList])

  const filter_CreateHandler = () => {
    let title = { 
      filter: true,
      create: false,
    };
    return title;
  };  

  const fetchMore = () => {
    setViewMoreLoader(true);
    getJobLists({ pageNo: pageState.page + 1 });
  }

  const settingProductSearchValue = (e) => {
    setRows([]);
    setSearchText(e.target.value);
    debouncedSearch(e.target.value);
  }

  const handleApplyFilter = () => {
    setRows([]);
    dispatch(
      setStockCountFilters({
        ...(selectedSubFilters?.status ? { status: selectedSubFilters?.status[0] } : {}),
        ...(selectedSubFilters?.startDate ? { startDate: selectedSubFilters?.startDate[0]?.value } : {}),
        ...(selectedSubFilters?.endDate ? { endDate: selectedSubFilters?.endDate[0]?.value } : {}),
        ...(selectedSubFilters?.assignee ? { assigneeUidx: selectedSubFilters?.assignee[0] } : {})
      })
    );
    setIsFilterOpened(false);
    setApplyFilter(false);

  };

  useEffect(() => {
    if (applyFilter) {
      handleApplyFilter();
    }
  }, [applyFilter]);  

  if(isMobileDevice){
    return (
      <SoftBox sx={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <SoftBox className="new-po-search-button-div">
          <MobileSearchBar
            // isScannerSearchbar={true}
            placeholder="Search Job"
            variant={'bg-secondary'}
            onChangeFunction={settingProductSearchValue}
            value={searchText}
            // scannerButtonFunction={openScanner}
          />
        </SoftBox>
        <MobileFilterComponent
          filters={filters}
          filterOptions={filterOptions}
          createButtonTitle={'Stock Count Job Lists'}
          // createButtonFunction={createButtonFunction}
          mainSelecetedFilter={mainSelecetedFilter}
          setMainSelectedFilter={setMainSelectedFilter}
          selectedSubFilters={selectedSubFilters}
          setSelectedSubFilters={setSelectedSubFilters}
          applyFilter={applyFilter}
          setApplyFilter={setApplyFilter}
          isFilterOpened={isFilterOpened}
          setIsFilterOpened={setIsFilterOpened}
          filterCreateExist={filter_CreateHandler()}
        />
        <div className="job-listing-main-div">
          <div className="stock-count-title-div">
            <span className="stock-count-title">Stock Count Listing</span>
          </div>
          <div className="job-list-card-main">
            {pageState?.loading && pageState?.page === 0 && (
              <SoftBox className="content-center" sx={{ width: '100%' }}>
                <CircularProgress size={30} color="info" />
              </SoftBox>
            )}

            {rows?.length > 0 &&
              rows?.map((job) => (
                <div
                  className="job-card"
                  onClick={() => handleScheduler(job?.jobId, job?.sessionId, job?.status, job?.job_type)}
                >
                  <div
                    className="stack-row-center-between width-100"
                    //  style={{ paddingBottom: '0.75rem' }}
                  >
                    <span className="vendor-name-bills-list">{job?.title}</span>
                    <span className="vendor-name-bills-list">
                      <CommonStatus status={job?.status === 'CREATED' ? textFormatter(job?.status) : job?.status} />
                    </span>
                  </div>

                  <hr className="horizontal-line-app-ros" />

                  <div className="stack-row-center-between width-100">
                    <div className="flex-colum-align-start">
                      <span className="bill-card-label">Job Type</span>
                      <span className="bill-card-value">{job?.job_type}</span>
                    </div>
                    <div className="flex-colum-align-end ">
                      <span className="bill-card-label">Total Products</span>
                      <span className="bill-card-value">{job?.total_products}</span>
                    </div>
                  </div>

                  <div className="stack-row-center-between width-100">
                    <div className="flex-colum-align-start">
                      <span className="bill-card-label">Assigned To</span>
                      <span className="bill-card-value">{job?.counter}</span>
                    </div>
                    <div className="flex-colum-align-end ">
                      <span className="bill-card-label">Progress</span>
                      <span className="bill-card-value">{job?.progress} %</span>
                    </div>
                  </div>

                  <div className="stack-row-center-between width-100">
                    <div className="flex-colum-align-start">
                      <span className="bill-card-label">Start Date</span>
                      <span className="bill-card-value">{job?.date}</span>
                    </div>   
                    <div className="flex-colum-align-end">
                      <span className="bill-card-label">Due Date</span>
                      <span className="bill-card-value">{job?.due_date}</span>
                    </div>                    
                  </div>
                </div>
              ))}

            {showViewMore && <ViewMore loading={viewMoreLoader} handleNextFunction={fetchMore} />}

            {rows?.length === 0 && !pageState?.loading ? <NoDataFoundMob /> : null}
          </div>
        </div>
      </SoftBox>
    );
  } 

  return (
    <SoftBox>
      <SoftBox className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container">
        <Grid container spacing={2} className="all-products-filter">
          <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
            <SoftBox className="all-products-filter-product" sx={{ position: 'relative' }}>
              <SoftInput
                className="all-products-filter-soft-input-box"
                placeholder="Search"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                icon={{ component: 'search', direction: 'left' }}
              />
              {(searchText !== '' || debouceSearch !== '') && <ClearSoftInput clearInput={handleClearSearch} />}
            </SoftBox>
          </Grid>
          <Grid item lg={6.5} md={6.5} sm={6} xs={12} justifyContent={'right'}>
            <SoftBox
              className="all-products-header-new-btn"
              display={'flex'}
              alignItems={'center'}
              justifyContent={'right'}
            >
              <Tooltip title="Refresh" placement="top">
                <IconButton onClick={() => getJobLists({ pageNo: 0 })} sx={{ marginRight: '15px' }}>
                  <RefreshIcon sx={{ color: 'white !important' }} />
                </IconButton>
              </Tooltip>
              <SoftButton
                sx={{
                  display: 'block',
                }}
                variant="solidWhiteBackground"
                onClick={handleCreateNewJob}
              >
                <AddIcon /> Job
              </SoftButton>
              {/* filter  */}
              {/* <StockCountJobListingFilter setFilters={setFilters} filters={filters} usersList={usersList} uidxList={uidxList} getJobLists={getJobLists}/> */}
              <StockCountFilter
                getJobLists={getJobLists}
                // setFilters={setFilters}
                setIsApplied={setIsApplied}
                setIsCleared={setIsCleared}
                filterObjectMain={filterObjectMain}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box" mb={2}>
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
          <DataGrid
            columns={columns}
            rows={rows || []}
            getRowId={(row) => row?.id}
            rowCount={parseInt(pageState?.totalResults)}
            // rowCount={0}
            loading={pageState.loading}
            editable={false}
            pagination
            paginationMode="server"
            page={pageState.page}
            pageSize={pageState.pageSize}
            rowsPerPageOptions={[]}
            onPageChange={(newPage) => {
              // setPageState((old) => ({ ...old, page: newPage }));
              getJobLists({ pageNo: newPage });
              dispatch(setStockCountPage(newPage));
            }}
            disableSelectionOnClick
            onCellClick={(row) =>
              handleScheduler(row?.row?.jobId, row?.row?.sessionId, row?.row?.status, row?.row?.job_type)
            }
            // onCellClick={(row) => handleScheduler(123)}
            components={{
              NoRowsOverlay: () => (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>
                  <h3 className="no-data-text-I"> No data available</h3>
                </SoftBox>
              ),
              NoResultsOverlay: () => (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>
                  <h3 className="no-data-text-I"> No data available</h3>
                </SoftBox>
              ),
            }}
          />
        )}
      </SoftBox>
    </SoftBox>
  );
};
