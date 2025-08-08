import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

const Wastage = () => {
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchNo',
      headerName: 'Batch Number',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'wastageQuantity',
      headerName: 'Wastage Quantity',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'wastageValue',
      headerName: 'Wastage Value',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'approvedBy',
      headerName: 'Approved By',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  return (
    <Box style={{ marginTop: '1rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography className="products-new-details-pack-typo">
          Wastage
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          autoHeight
          sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );
};

export default Wastage;
