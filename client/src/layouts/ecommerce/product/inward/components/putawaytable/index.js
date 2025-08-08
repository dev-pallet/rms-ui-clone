import * as React from 'react';
import { CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { dateFormatter, isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import { getputAwaytable } from '../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import Box from '@mui/material/Box';
import MuiAlert from '@mui/material/Alert';
import PutAwayCardList from '../putAwayListCard';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../../../components/SoftBox';
import Spinner from '../../../../../../components/Spinner';
import Status from '../../../../Common/Status';
import clsx from 'clsx';
import moment from 'moment';

export const Putawaytable = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  //snackbar
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

  const columns = [
    {
      field: 'id',
      headerName: 'Session ID',
      minWidth: 100,
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
      minWidth: 100,
      flex: 1,
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          Open: params.value === 'OPEN',
          Reject: params.value === 'REJECTED',
          Create: params.value === 'CREATED',
          Assign: params.value === 'IN_TRANSIT',
          Complete: params.value === 'COMPLETED',
        });
      },
      renderCell: (cellValues) => {
        return (
        // <div
        //   className="maze-table-inward"
        //   style={{
        //     // old
        //     // padding: '5px',
        //     // // width: '125px',
        //     // // height: '20px',
        //     // backgroundColor: '#F6F6F6',
        //     // borderRadius: '5px',
        //     // textAlign: 'center',
        //     // border: '1px solid lightgreen',
        //     // fontSize: '0.6rem',
        //     // padding: '0.2rem',

        //     // new
        //     width: '100px',
        //     // height: '20px',
        //     padding: '2px 0px', 
        //     backgroundColor: '#F6F6F6',

          //     // backgroundColor: cellValues.value === 'STARTED' ? 'green' : '#DE350B',
          //     borderRadius: '4px',
          //     textAlign: 'center',
          //     border: cellValues.value === 'COMPLETED' ? '1px solid green' : '1px solid #DE350B',
          //     // border: '1px solid lightgreen',
          //   }}
          // >
          <div>
            {cellValues.value !=='' && <Status label={cellValues.value} />}
          </div>
          // </div>
        );
      },
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 70,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      minWidth: 300,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'putAwayTime',
      headerName: 'Last Modified',
      minWidth: 120,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    // {
    //   field: 'putAwayTime',
    //   headerName: 'Date',
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: 'left',
    //   align: 'left',
    //   headerClassName: 'datagrid-columns',
    //   cellClassName: 'datagrid-rows',
    // },
    // {
    //   field: 'inwardRequestNo',
    //   headerName: 'Request No',
    //   minWidth: 100,
    //   flex: 1,
    //   headerAlign: 'left',
    //   align: 'left',
    //   headerClassName: 'datagrid-columns',
    //   cellClassName: 'datagrid-rows',
    // },
    // {
    //   field: 'putAwayByName',
    //   headerName: 'Putaway By',
    //   minWidth: 180,
    //   flex: 1,
    //   headerAlign: 'left',
    //   align: 'left',
    //   headerClassName: 'datagrid-columns',
    //   cellClassName: 'datagrid-rows',
    // },
  ];

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  // const [datRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  let dataArr,
    dataRow = [];
  useEffect(() => {
    const payload = {
      pageNo: pageState.page - 1,
      pageSize: pageState.pageSize,
    };
    setLoader(true);
    getputAwaytable(orgId, locId, payload)
      .then((res) => {
        dataArr = res.data.data.object.data;
        showSnackbar(res.data.status, 'success');
        setLoader(false);
        dataRow.push(
          dataArr?.map((row) => ({
            id: row.sessionId ? row.sessionId : '---',
            status: row.putAwayStatus ? row.putAwayStatus : '---',
            putAwayTime: row.putAwayAt ? 
            // dateFormatter(new Date(row.putAwayAt).toISOString())
              moment(row.putAwayAt).format('D MMM, YYYY')
              : '---',
            inwardRequestNo: row.inwardRequestNumber ? row.inwardRequestNumber : '---',
            putAwayByName: row.putAwayByName ? row.putAwayByName : '---',
            vendorName: row.vendorName ? textFormatter(row.vendorName) : '---',
            location: locId,
          })),
        );
        setTotalPage(res?.data?.data?.object?.totalPage);
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: dataRow[0] || [],
          total: res.data.data.object.totalElements || 0,
        }));
        // console.log('respDataFinal', res);
        setLoader(false);
      })
      .catch((err) => {
        showSnackbar('No data Found', 'error');
        setLoader(false);
      });
  }, [pageState.page, pageState.pageSize]);

  const navigateToDetailsPage = (rows) => {
    const sessionId = rows.row.id;
    const poNumber = rows.row.inwardRequestNo;
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('poNum', poNumber);
    navigate('/products/putaway');
  };

  useEffect(() => {
    if (localStorage.getItem('poNumber')) {
      localStorage.removeItem('poNumber');
    }
    if (localStorage.getItem('sessionId')) {
      localStorage.removeItem('sessionId');
    }
  }, []);

  const isMobileDevice = isSmallScreen();
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState(10);

  const fetchMoreData = () => {
    const payload = {
      pageNo: infinitePageNo,
      pageSize: pageState.pageSize,
    };
    // setInfiniteLoader(true);
    getputAwaytable(orgId, locId, payload)
      .then((res) => {
        dataArr = res.data.data.object.data;
        setInfiniteLoader(false);
        dataRow.push(
          dataArr?.map((row) => ({
            id: row.sessionId ? row.sessionId : '---',
            status: row.putAwayStatus ? row.putAwayStatus : '---',
            putAwayTime: row.putAwayAt ? dateFormatter(row.putAwayAt) : '---',
            inwardRequestNo: row.inwardRequestNumber ? row.inwardRequestNumber : '---',
            putAwayByName: row.putAwayByName ? row.putAwayByName : '---',
            vendorName: row.vendorName ? textFormatter(row.vendorName) : '---',
          })),
        );
        // setTableRows(dataRow[0]);
        //
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: [...old.datRows, ...dataRow[0]] || [],
          total: res.data.data.object.totalElements || 0,
        }));
        setTotalPage(res.data.data.object.totalPage);
        setLoader(false);
      })
      .catch((err) => {
        showSnackbar('No data Found', 'error');
        setInfiniteLoader(false);
      });
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
              '& .super-app.Open': {
                color: 'orange',
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
              '& .super-app.Complete': {
                color: 'green',
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
                onCellClick={(rows) => navigateToDetailsPage(rows)}
                sx={{
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                }}
              />
            )}
          </Box>
          {isMobileDevice && (
            <SoftBox sx={{ paddingBottom: '10px' }}>
              {pageState.datRows.map((data) => (
                <PutAwayCardList data={data} />
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
