import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

const StockBalanceDetails = () => {
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'poDate',
      headerName: 'PO Date',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'poNumber',
      headerName: 'PO Number',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'inwardNumber',
      headerName: 'Inward Number',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'inwardDate',
      headerName: 'Inward Date',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchaseQuantity',
      headerName: 'Purchase Quantity',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchaseValue',
      headerName: 'Purchase Value',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'unitCost',
      headerName: 'Unit Cost',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'billNo',
      headerName: 'Bill No.',
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
          Stock Balance
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

export default StockBalanceDetails;
