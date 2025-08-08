import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

const FoodCostAnalysis = () => {
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
      field: 'ingredients',
      headerName: 'Ingredients',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'unitsSold',
      headerName: 'Units Sold',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'inventoryValue',
      headerName: 'Inventory Value',
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
      field: 'wastage',
      headerName: 'Wastage',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'totalFoodCost',
      headerName: 'Total Food Cost',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'costPerUnit',
      headerName: 'Cost/Unit',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'variantion',
      headerName: 'Variant from target',
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
        <Typography className="products-new-details-pack-typo">Food Cost Analysis</Typography>
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

export default FoodCostAnalysis;
