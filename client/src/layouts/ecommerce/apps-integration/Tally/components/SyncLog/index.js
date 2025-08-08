import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import Spinner from '../../../../../../components/Spinner';
import { noDatagif } from '../../../../Common/CommonFunction';

const SyncLogTable = ({ errorComing, syncLogLoader, pageState, setPageState }) => {
  const logColumns = [
    {
      headerName: 'Synced on',
      field: 'syncedOn',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Sync type',
      field: 'type',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Import Type',
      field: 'importType',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Created',
      field: 'created',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Altered',
      field: 'altered',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Deleted',
      field: 'deleted',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Combined',
      field: 'combined',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Ignored',
      field: 'ignored',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Errors',
      field: 'errors',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    // {
    //   headerName: 'Line Errors',
    //   field: 'lineErrors',
    //   type: 'number',
    //   minWidth: 140,
    //   editable: false,
    //   cellClassName: 'datagrid-rows',
    //   headerClassName: 'datagrid-columns',
    //   align: 'center',
    //   headerAlign: 'center',
    //   flex: 1,
    // },
    {
      headerName: 'Sync time from',
      field: 'syncTimeFrom',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Sync time to',
      field: 'syncTimeTo',
      type: 'number',
      minWidth: 140,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
  ];

  return (
    <Box className="sync-log-table">
      {errorComing ? (
        <SoftBox className="No-data-text-box">
          <SoftBox className="src-imgg-data">
            <img className="src-dummy-img" src={noDatagif} />
          </SoftBox>

          <h3 className="no-data-text-I">NO DATA FOUND</h3>
        </SoftBox>
      ) : (
        <div style={{ height: 525, width: '100%' }} className="datagrid-container">
          {syncLogLoader && (
            <SoftBox
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spinner />
            </SoftBox>
          )}
          {!syncLogLoader && (
            <DataGrid
              columns={logColumns}
              rows={pageState.datRows || []}
              rowCount={parseInt(pageState.total)}
              loading={pageState.loader}
              pageCount
              pagination
              page={pageState.page - 1}
              pageSize={pageState.pageSize}
              paginationMode="server"
              onPageChange={(newPage) => {
                setPageState((old) => ({ ...old, page: newPage + 1 }));
              }}
              onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
              getRowId={(row) => row.id}
              //   onCellClick={(rows) => handleRowDetails(rows)}
            />
          )}
        </div>
      )}
    </Box>
  );
};

export default SyncLogTable;
