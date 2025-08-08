import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

const SalesChannelDetails = ({ selectedVariant }) => {
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'channel',
      headerName: 'Channel',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'salesMargin',
      headerName: 'Sales Margin',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'estimatedProfit',
      headerName: 'Estimated Profit',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'availableSince',
      headerName: 'Available Since',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  useEffect(() => {
    const salesChannelData =
      selectedVariant?.externalSalesChannels?.map((channel, idx) => ({
        id: idx,
        channel: channel?.salesChannelName
          ?.toLowerCase()
          ?.replace(/_/g, ' ')
          ?.replace(/\b\w/g, (c) => c.toUpperCase()),
        salePrice: channel?.salePrice || 0,
        salesMargin: `${channel?.marginPercentage?.toFixed(2)}%` || 0,
        estimatedProfit: channel?.profit || 0,
        availableSince: channel?.availableSince || 'NA',
        lastUpdated: channel?.lastUpdated || 'NA',
      })) || [];

    setRows(salesChannelData);
  }, [selectedVariant]);

  return (
    <Box style={{ marginTop: '1rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography variant="h6" fontWeight="bold">
          Sales Channels
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

export default SalesChannelDetails;
