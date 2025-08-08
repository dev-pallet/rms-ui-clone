import { DataGrid } from '@mui/x-data-grid';
import { productsRejection } from '../../../../../../config/Services';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SoftBox from 'components/SoftBox';
import Spinner from 'components/Spinner/index';

import * as React from 'react';
import { CopyToClipBoard, textFormatter } from '../../../../Common/CommonFunction';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import moment from 'moment';

export const Rejectiontable = () => {
  const locId = localStorage.getItem('locId');

  const [loader, setLoader] = useState(false);
  const [dataRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [errorComing, setErrorComing] = useState(false);
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

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const columns = [
    {
      field: 'requestNumber',
      headerName: 'PO Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'center',
    //   cellClassName: 'datagrid-rows',
    //   align: 'center',
    //   width: 110,
    //   cellClassName: (params) => {
    //     if (params.value == null) {
    //       return '';
    //     }
    //     return clsx('super-app', {
    //       Approved: params.value === 'ACCEPTED',
    //       Reject: params.value === 'REJECTED',
    //       Create: params.value === 'CREATED',
    //       Assign: params.value === 'IN_TRANSIT',
    //     });
    //   },
    //   renderCell: (cellValues) => {
    //     return (
    //       <div
    //         className="maze-table-inward"
    //         style={{
    //           width: '120px',
    //           height: '20px',
    //           backgroundColor: '#F6F6F6',
    //           borderRadius: '5px',
    //           textAlign: 'center',
    //           border: '1px solid lightgreen',
    //         }}
    //       >
    //         {cellValues.value}
    //       </div>
    //     );
    //   },
    // },
    {
      field: 'gtin',
      headerName: 'Barcode',
      minWidth: 150,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      renderCell: (params) => {      
        return (
          <CopyToClipBoard params={params} />
        ); 
      }, 
    },
    {
      field: 'rejectedQuantity',
      headerName: 'Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    // {
    //   field: 'itemName',
    //   headerName: 'Item Name',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   minWidth: 150,
    //   flex: 1,
    // },
    {
      field: 'rejectionReason',
      headerName: 'Reason',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'sessionId',
      headerName: 'Session ID',
      minWidth: 60,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   minWidth: 60,
    //   flex: 1,
    //   headerAlign: 'left',
    //   align: 'left',
    //   headerClassName: 'datagrid-columns',
    //   cellClassName: 'datagrid-rows',
    // },
    {
      field: 'vendor',
      headerName: 'Vendor Name',
      minWidth: 200,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'rejectedOn',
      headerName: 'Last Modified',
      minWidth: 150,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    // {
    //   field: 'rejectedOn',
    //   headerName: 'Rejected On',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   minWidth: 150,
    //   flex: 1,
    // },
    // {
    //   field: 'rejectedByPerson',
    //   headerName: 'Rejected By Person',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   minWidth: 150,
    //   flex: 1,
    // },
  ];

  useEffect(() => {
    const payload = {
      pageNo: pageState.page - 1,
      pageSize: pageState.pageSize,
    };
    setLoader(true);
    productsRejection(locId, payload)
      .then((res) => {
        if (res.data.data.status == false) {
          setTimelineerror('success');
          setAlertmessage(res.data.data.message);
          setOpensnack(true);
          setLoader(false);
          setErrorComing(true);
        }
        if (res.data.data.status == true && res.data.data.object.data.length) {
          setAlertmessage(res.data.data.message);
          setTimelineerror('success');
          setOpensnack(true);
          setLoader(false);
          dataArr = res.data.data.object.data;
          dataRow.push(
            dataArr?.map((row) => ({
              gtin: row.gtin ? row.gtin : '---',
              sessionId: row.sessionId ? row.sessionId : '---',
              requestNumber: row.requestNumber ? row.requestNumber : '---',
              id: row.id ? row.id : '---',
              itemId: row.itemId ? row.itemId : '---',
              itemName: row.itemName ? textFormatter(row.itemName) : '---',
              rejectedQuantity: row.quantityRejected ? row.quantityRejected : '---',
              rejectionReason: row.rejectionReason ? textFormatter(row.rejectionReason) : '---',
              rejectedOn: row.rejectedOn ? moment(row.rejectedOn).format('D MMM, YYYY') : '---',
              rejectedByPerson: row.rejectedByPerson ? textFormatter(row.rejectedByPerson) : '---',
              vendor: textFormatter(row.vendor),
            })),
          );
          // setTableRows(dataRow[0]);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRow[0] || [],
            total: res.data.data.object.totalElements || 0,
          }));
        }
      })
      .catch((err) => {
        setAlertmessage('No Data Found');
        setTimelineerror('error');
        setOpensnack(true);
        setLoader(false);
      });
  }, [pageState.page, pageState.pageSize]);

  return (
    <>
      <SoftBox>
        <SoftBox>
          {loader && (
            <Box className="centerspinnerI">
              <Spinner />
            </Box>
          )}

          <SoftBox
            // py={1}
            style={{
              overflowX: 'auto',
            }}
          >
            {/* {errorComing ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img
                      className="src-dummy-img"
                      src="https://2.bp.blogspot.com/-SXNnmaKWILg/XoNVoMTrxgI/AAAAAAAAxnM/7TFptA1OMC8uk67JsG5PcwO_8fAuQTzkQCLcBGAsYHQ/s1600/giphy.gif"
                    />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : (
                <div style={{ height: 525, minWidth: '950px' }}>
                  {loader && <Spinner />}
                  {!loader && <DataGrid rows={rowData} columns={columns} rowsPerPageOptions={[10]} />}
                </div>
              )} */}
            {!loader && (
              <div style={{ height: 525, width: '100%' }}>
                <DataGrid
                  // rows={dataRows}
                  // columns={columns}
                  // pagination
                  // rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  rows={pageState.datRows}
                  columns={columns}
                  rowCount={parseInt(pageState.total)}
                  // loading={pageState.loader}
                  pagination
                  page={pageState.page - 1}
                  pageSize={pageState.pageSize}
                  paginationMode="server"
                  onPageChange={(newPage) => {
                    setPageState((old) => ({ ...old, page: newPage + 1 }));
                  }}
                  onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                  getRowId={(row) => row.itemId}
                  onCellClick={(rows) => console.log(rows.row)}
                  sx={{
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                  }}
                />
              </div>
            )}
          </SoftBox>
        </SoftBox>
        {/* </SoftBox> */}
      </SoftBox>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </>
  );
};
