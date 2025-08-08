import AddIcon from '@mui/icons-material/Add';
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import Spinner from '../../../components/Spinner';
import { fetchExpressPurchaseList } from '../../../config/Services';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import BottomNavbar from '../../../examples/Navbars/BottomNavbarMob';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../Common/CommonFunction';
import NoDataFoundMob from '../Common/mobile-new-ui-components/no-data-found';
import Status from '../Common/Status';
import ExpressPurchaseFilter from './components/Filter/expressPurchaseFilter';
import './purchase-main.css';
import ExPCard from './components/exp-mobile-card';
import { useDebounce } from 'usehooks-ts';
import ViewMore from '../Common/mobile-new-ui-components/view-more';
import { useSelector } from 'react-redux';
import { getFilters, setFilters } from '../../../datamanagement/Filters/commonFilterSlice';
import { useDispatch } from 'react-redux';

const PurchaseExclusive = ({ mobileSearchedValue = '' }) => {
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getFilters);
  const [loader, setLoader] = useState(false);
  const isMobileDevice = isSmallScreen();
  const [errorComing, setErrorComing] = useState(false);
  const [onClear, setOnClear] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [totalPages, setTotalPage] = useState();
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: persistedFilters?.page || 0,
    pageSize: 8,
  });

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [searchorders, setsearchOrders] = useState(persistedFilters?.search || null);
  const debouncedExpSearchValue = useDebounce(searchorders || mobileSearchedValue, 500);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);

  const handleGo = () => {
    navigate('/purchase/express-grn/create-express-grn');
    localStorage.removeItem('epoNumber');
  };

  const handleCreate = () => {
    navigate('/purchase/express-grn/add-express-grn');
  };

  const handleordersearch = (e) => {
    const orderName = e.target.value;
    setsearchOrders(e.target.value);
  };

  // clear express purchases search input fn
  const handleClearOrderSearch = () => {
    setsearchOrders('');
    setOnClear(true);
  };

  const handleNavigatetoPage = (row) => {
    if (row.status !== 'DRAFT') {
      navigate(`/purchase/express-grn/details/${row.id}`);
    } else {
      localStorage.setItem('epoNumber', row?.id);
      navigate(`/purchase/express-grn/create-express-grn/${row.id}`);
      // navigate(`/purchase/express-grn/add-express-grn/${row.id}`);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Job ID',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'currentStatus',
      headerName: 'Status',
      minWidth: 180,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.status === 'DRAFT' ? (
              <div
              // style={{
              //   // width: '160px',
              //   // height: '25px',
              //   padding: '5px',
              //   backgroundColor: '#F6F6F6',
              //   borderRadius: '5px',
              //   textAlign: 'center',
              //   border: '1px solid #b773b7',
              //   color: '#b773b7',
              //   display: 'flex',
              //   justifyContent: 'space-around',
              //   alignItems: 'center',
              //   fontSize: '0.9em',
              // }}
              >
                {params?.row?.status && <Status label={params?.row?.status} />}
              </div>
            ) : (
              <div
              // className={`${
              //   params?.row?.status === 'CLOSE'
              //     ? 'close-exp-pur-status'
              //     : params?.row?.status === 'PO_CREATED' && 'created-exp-pur-status'
              // }`}
              // style={{
              //   // width: '160px',
              //   padding: '5px',
              //   // height: '25px',
              //   backgroundColor: '#F6F6F6',
              //   borderRadius: '5px',
              //   textAlign: 'center',
              //   border: '1px solid #0562FB',
              //   color: '#0562FB',
              //   display: 'flex',
              //   justifyContent: 'space-around',
              //   alignItems: 'center',
              //   fontSize: '0.9em',
              // }}
              >
                {params?.row?.status && <Status label={params?.row?.status} />}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      minWidth: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    // {
    //   field: 'vendorId',
    //   headerName: 'Vendor ID',
    //   minWidth: 100,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   flex: 0.75,
    // },
    {
      field: 'poID',
      headerName: 'PO ID',
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'inwardID',
      headerName: 'Inward ID',
      minWidth: 70,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'amount',
      headerName: 'Total Amount',
      type: 'number',
      minWidth: 70,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
    {
      field: 'createdAt',
      headerName: 'Last Modified',
      type: 'number',
      minWidth: 130,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 0.75,
    },
  ];

  const filterObject = {
    page: pageState.page - 1,
    size: pageState.pageSize,
    sourceOrgId: [orgId],
    searchInput: debouncedExpSearchValue,
    sourceLocId: [locId],
  };
 
  const selectedFilters = useMemo(() => {
    return persistedFilters
      ? { ...persistedFilters }
      : {
          status: [],
          startDate: '',
          endDate: ''
        };
  }, [persistedFilters]);

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];
  const isFirstRender = useRef(true);

  useEffect(() => {
    allExPOList();
  }, [selectedFilters]);

  // prevent running on initial render to avoid multiple API calls
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // set to false after first render
      return;
    }

    dispatch(setFilters({ ...persistedFilters, search: debouncedExpSearchValue, page: 0 }));
    setPageState((old) => ({ ...old, page: 0 }));
  }, [debouncedExpSearchValue]);

  const allExPOList = () => {
    if (debouncedExpSearchValue !== '' || onClear || filterApplied) {
      filterObject.page = 0;
    }
    if (isMobileDevice) setViewMoreLoader(true);
    else setLoader(true);
    setOnClear(false);
    setFilterApplied(false);
    const payload = {
      page: pageState?.page,
      size: pageState?.pageSize,
      sourceOrgId: [orgId],
      searchInput: debouncedExpSearchValue,
      sourceLocId: [locId],
      status: selectedFilters?.status?.value ? [selectedFilters?.status?.value] : [],
      from: selectedFilters?.startDate || '',
      to: selectedFilters?.endDate || '',
    };

    fetchExpressPurchaseList(payload)
      .then((res) => {
        if (res?.data?.code === 'ECONNRESET') {
          showSnackbar('Some error occured', 'error');
          setLoader(false);
          if (isMobileDevice) setViewMoreLoader(false);
          setErrorComing(true);
        } else {
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
            setLoader(false);
            if (isMobileDevice) setViewMoreLoader(false);
            setErrorComing(true);
          } else {
            dataArr = res?.data?.data || [];
            dataRow?.push(
              dataArr?.expressPurchaseOrderList?.map((row) => ({
                id: row?.epoNumber ? row?.epoNumber : '-----',
                vendorId: row?.vendorId ? row?.vendorId : '-----',
                poID: row?.poRefId ? row?.poRefId : '-----',
                inwardID: row?.inwardRefId ? row?.inwardRefId : '-----',
                amount: row?.grossAmount ? row?.grossAmount : '-----',
                createdAt: row?.createdOn ? dateFormatter(row?.createdOn) : '-----',
                status: row?.status ? row?.status : '-----',
                vendorName: row?.vendorName ? textFormatter(row?.vendorName) : '-----',
              })),
            );
            if (!isMobileDevice) {
              setTableRows(dataRow?.[0]);
            } else {
              setTableRows((prev) => [...prev, ...dataRow?.[0]]);
            }
            if (dataArr?.pageResults === dataArr?.totalResults) {
              setShowViewMore(false);
            } else {
              if (!showViewMore) {
                setShowViewMore(true);
              }
            }
            setViewMoreLoader(false);
            setLoader(false);
            setErrorComing(false);
            setPageState((old) => ({
              ...old,
              loader: false,
              datRows: dataRow[0] || [],
              total: dataArr?.totalResults || 0,
            }));
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setLoader(false);
        if (isMobileDevice) setViewMoreLoader(false);
        setErrorComing(true);
      });
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}

      {!isMobileDevice ? (
        <Box
          // className="table-css-fix-box-scroll-pi"
          className="search-bar-filter-and-table-container"
        >
          <SoftBox
            // className="list-div-heading"
            className="search-bar-filter-container"
            // sx={{
            //   display: 'flex',
            //   justifyContent: 'space-between',
            // }}
          >
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox sx={{ position: 'relative' }}>
                  <SoftInput
                    className="filter-soft-input-box"
                    placeholder="Search Express GRN"
                    value={searchorders}
                    onChange={(e) => handleordersearch(e)}
                    icon={{ component: 'search', direction: 'left' }}
                  />
                  {searchorders && <ClearSoftInput clearInput={handleClearOrderSearch} />}
                </SoftBox>
              </Grid>
              <Grid item>
                <SoftBox className="content-space-between">
                  <SoftButton
                    // className="vendor-add-btn"
                    onClick={handleGo}
                    variant="solidWhiteBackground"
                  >
                    <AddIcon />
                    New
                  </SoftButton>
                  &nbsp;&nbsp;
                  {/* <SoftButton
                    // className="vendor-add-btn"
                    onClick={handleCreate}
                    variant="solidWhiteBackground"
                  >
                    <AddIcon />
                    Craete
                  </SoftButton> */}
                  &nbsp;&nbsp;
                  {/* filter  */}
                  <ExpressPurchaseFilter
                    filterObject={selectedFilters}
                    setFilterApplied={setFilterApplied}
                    setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                    setPageState={setPageState}
                    // fn
                    // allExPOList={allExPOList}
                  />
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          {loader && (
            <Box className="centerspinner">
              <Spinner />
            </Box>
          )}
          {!loader && (
            <SoftBox
              py={0}
              px={0}
              style={{ height: 525, width: '100%' }}
              className="dat-grid-table-box"
              sx={{
                '& .super-app.Approved': {
                  color: '#69e86d',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Reject': {
                  color: '#df5231',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Create': {
                  color: '#888dec',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Assign': {
                  color: 'purple',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Deliver': {
                  color: '#E384FF',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Inwarded': {
                  color: 'Blue',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Partially': {
                  color: 'Purple',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
              }}
            >
              {errorComing ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : (
                <>
                  <DataGrid
                    rows={pageState?.datRows}
                    columns={columns}
                    className="data-grid-table-boxo"
                    pagination
                    page={pageState?.page}
                    pageSize={pageState?.pageSize}
                    rowCount={parseInt(pageState?.total)}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      setPageState((old) => ({ ...old, page: newPage }));
                      dispatch(setFilters({ ...persistedFilters, page: newPage }));
                    }}
                    onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                    getRowId={(row) => row?.id}
                    disableSelectionOnClick
                    onCellClick={(rows) => handleNavigatetoPage(rows?.row)}
                    sx={{ cursor: 'pointer', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
                  />
                </>
              )}
            </SoftBox>
          )}
        </Box>
      ) : (
        <>
          {loader ? (
            <Box className="centerspinnerI">
              <Spinner />
            </Box>
          ) : (
            <>
              {!errorComing ? (
                <>
                  {datRows?.map((purchase, index) => (
                    <ExPCard data={purchase} index={index} />
                  ))}
                  {showViewMore && (
                    <ViewMore
                      loading={viewMoreLoader}
                      handleNextFunction={() => {
                        // setPageState((old) => ({ ...old, page: pageState.page + 1 }))
                        dispatch(setFilters({ ...persistedFilters, page: pageState?.page + 1 }));
                        setPageState((old) => ({ ...old, page: pageState?.page + 1 }));
                      }}
                    />
                  )}
                </>
              ) : (
                <NoDataFoundMob />
              )}
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default PurchaseExclusive;
