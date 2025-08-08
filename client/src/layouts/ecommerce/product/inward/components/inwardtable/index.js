import * as React from 'react';
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getpoInwardDataTable } from '../../../../../../config/Services';
import { isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import Box from '@mui/material/Box';
import InwardListCard from '../inwardListCard';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../../../components/SoftBox';
import Spinner from '../../../../../../components/Spinner';
import Status from '../../../../Common/Status';
import clsx from 'clsx';
import moment from 'moment';

export const Inwardtable = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  //snackbar

  //material ui media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const columns = isMobile
    ? [
      {
        field: 'id',
        headerName: 'Inward Session Id',
        minWidth: 170,
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'datagrid-columns',
        cellClassName: 'datagrid-rows',
      },
      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
        minWidth: 170, 
        flex: 1,
        cellClassName: (params) => {
          if (params.value == null) {
            return '';
          }
          return clsx('super-app', {
            Approved: params.value === 'STARTED',
            Closed: params.value === 'CLOSED',
          });
        },
        renderCell: (cellValues) => {
          return (
          // <div
          //   className="maze-table-inward"
          //   style={{
          //     width: '70px',
          //     // height: '20px',
          //     padding: '2px 0px',
          //     backgroundColor: '#F6F6F6',

          //     // backgroundColor: cellValues.value === 'STARTED' ? 'green' : '#DE350B',
          //     borderRadius: '4px',
          //     textAlign: 'center',
          //     border: cellValues.value === 'STARTED' ? '1px solid green' : '1px solid #DE350B',
          //     // border: '1px solid lightgreen',
          //   }}
          // >
          //   {cellValues.value}
          // </div>
            <div>
              {/* {cellValues.value ==="STARTED" && <Chip label={cellValues.value} color="success" size='small' sx={{fontSize:"10px"}} />} */}
              {cellValues.value !=='' && <Status label={cellValues.value} />}
            </div>
          );
        },
      },
    ]
    : [
      {
        field: 'ponumber',
        headerName: 'PO Number',
        // minWidth: 170,
        minWidth: 100,
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        headerClassName: 'datagrid-columns',
        cellClassName: 'datagrid-rows',
      },
      {
        field: 'id',
        headerName: 'Session ID',
        // minWidth: 170,
        minWidth: 130,
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        headerClassName: 'datagrid-columns',
        cellClassName: 'datagrid-rows',
      },
      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        // minWidth: 170,
        minWidth: 180,
        flex: 1,
        cellClassName: (params) => {
          if (params.value == null) {
            return '';
          }
          return clsx('super-app', {
            Approved: params.value === 'STARTED',
            Closed: params.value === 'CLOSED',
          });
        },
        renderCell: (cellValues) => {
          return (
          // <div
          //   className="maze-table-inward"
          //   style={{
          //     // width: '120px',
          //     width: '70px',
          //     backgroundColor: '#F6F6F6',

          //     // height: '20px',
          //     padding: '2px 0px',
          //     // color: cellValues.value === 'STARTED' ? 'green' : '#DE350B',
          //     borderRadius: '4px',
          //     textAlign: 'center',
          //     border: cellValues.value === 'STARTED' ? '1px solid green' : '1px solid #DE350B',
          //     // border: '1px solid lightgreen',
          //   }}
          // >
          //   {cellValues.value}
          // </div>
            <div>
              {/* {cellValues.value ==="STARTED" && <Chip label={cellValues.value} color="success" size='small' sx={{fontSize:"10px"}} />} */}
              {cellValues.value !=='' && <Status label={cellValues.value} />}
            </div>
          );
        },
      },
      {
        field: 'location',
        headerName: 'Location',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'vendor',
        headerName: 'Vendor',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 170,
        flex: 1,
      },
      // {
      //   field: 'createdOn',
      //   headerName: 'Started At',
      //   headerClassName: 'datagrid-columns',
      //   headerAlign: 'left',
      //   cellClassName: 'datagrid-rows',
      //   align: 'left',
      //   // minWidth: 170,
      //   minWidth: 150,
      //   flex: 1,
      // },
      {
        field: 'endedOn',
        headerName: 'Ended On',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        minWidth: 180,
      },
    ];

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const [datRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  let dataArr,
    dataRow = [];

  useEffect(() => {
    const payload = {
      pageNo: pageState.page - 1,
      pageSize: pageState.pageSize,
    };
    setLoader(true);
    getpoInwardDataTable(locId, payload)
      .then((res) => {
        dataArr = res.data.data.object.data;
        showSnackbar(res.data.data.message, 'success');
        setLoader(false);
        dataRow.push(
          dataArr?.map((row) => ({
            id: row.sessionId ? row.sessionId : '------',
            status: row.sessionStatus ? row.sessionStatus : '------',
            createdOn: row.startedAt ? row.startedAt : '------',
            endedOn: row.endedAt ? moment(row.endedAt).format('D MMM, YYYY') : '-----',
            location: locId,
            ponumber: row.inwardRequestNumber ? row.inwardRequestNumber : '-----',
            vendor: row.vendorName ? textFormatter(row.vendorName) : '-----',
          })),
        );
        setTotalPage(res.data.data.object.totalPage);
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: dataRow[0] || [],
          total: res.data.data.object.totalElements || 0,
        }));
        setLoader(false);
      })
      .catch((err) => {
        showSnackbar('No data Found', 'error');
        setLoader(false);
        // setErrorImg(true);
      });
  }, [pageState.page, pageState.pageSize]);

  const navigateToDeatilsPage = (id) => {
    navigate(`/products/inwarddetails/${id}`);
  };

  //mobile responsivenss -----
  const isMobileDevice = isSmallScreen();
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState();

  const fetchMoreData = async () => {
    const payload = {
      pageNo: infinitePageNo,
      pageSize: pageState.pageSize,
    };
    // setInfiniteLoader(true);
    const res = await getpoInwardDataTable(locId, payload);
    dataArr = res.data.data.object.data;
    dataRow.push(
      dataArr?.map((row) => ({
        id: row.sessionId ? row.sessionId : '------',
        status: row.sessionStatus ? row.sessionStatus : '------',
        createdOn: row.startedAt ? row.startedAt : '------',
        endedOn: row.endedAt ? row.endedAt : '-----',
        ponumber: row.inwardRequestNumber ? row.inwardRequestNumber : '-----',
        vendor: row.vendorName ? textFormatter(row.vendorName) : '-----',
      })),
    );
    setTotalPage(res.data.data.object.totalPage);
    setInfiniteLoader(false);
    setPageState((old) => ({
      ...old,
      loader: false,
      datRows: [...old.datRows, ...dataRow[0]],
    }));
  };

  const handleScroll = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight &&
      infinitePageNo < totalPages
    ) {
      if (infinitePageNo === totalPages - 1) {
        setNoData(true);
      }
      setInfiniteLoader(true);
      setInfintiePageNo(infinitePageNo + 1);
      fetchMoreData();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [infinitePageNo, totalPages]);

  return (
    <>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      {loader && (
        <Box className="centerspinnerI">
          <Spinner />
        </Box>
      )}

      {!loader && (
        <>
          <Box
            className="dat-grid-table-box"
            style={{ height: isMobileDevice ? 0 : 525, width: '100%' }}
            sx={{
              '& .super-app.Approved': {
                // color: '#69e86d',
                color: 'green',
                fontSize: '0.7em',
                fontWeight: '600',
                margin: '0px auto 0px auto',
                padding: '5px',
              },
              '& .super-app.Closed': {
                // color: '#df5231',
                color: '#DE350B',
                fontSize: '0.7em',
                fontWeight: '600',
                margin: '0px auto 0px auto',
                padding: '5px',
              },
            }}
          >
            {!isMobileDevice && (
              <DataGrid
                rows={pageState.datRows}
                columns={columns}
                className="data-grid-table-boxo"
                pagination
                page={pageState.page - 1}
                pageSize={pageState.pageSize}
                rowCount={parseInt(pageState.total)}
                paginationMode="server"
                onPageChange={(newPage) => {
                  setPageState((old) => ({ ...old, page: newPage + 1 }));
                }}
                onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                getRowId={(row) => row.id}
                disableSelectionOnClick
                onCellClick={(rows) => navigateToDeatilsPage(rows.row['id'])}
                // navigate('/products/inwarddetails');
                sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
              />
            )}
          </Box>
          {isMobileDevice && (
            <SoftBox sx={{ paddingBottom: '10px' }}>
              {pageState.datRows.map((row) => (
                <InwardListCard data={row} />
              ))}
              <Box
                className="infinite-loader"
                sx={{
                  visibility: infiniteLoader ? 'visible' : 'hidden',
                  display: noData ? 'none' : 'flex',
                }}
              >
                <CircularProgress size={30} color="info" />
              </Box>
            </SoftBox>
          )}
        </>
      )}
    </>
  );
};
