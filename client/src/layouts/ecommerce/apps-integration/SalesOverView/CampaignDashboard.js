import { Box, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import SoftTypography from '../../../../components/SoftTypography';

const CampaignDashboard = () => {
  const slowMovingInventoryColumns = [
    {
      field: 'campaignName',
      headerName: 'Campaign Name',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'channel',
      headerName: 'Platform',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'totalContacts',
      headerName: 'Reach',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'spend',
      headerName: 'Cost per result',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'campaignDate',
      headerName: 'Campaign Date',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
  ];

  const slowMovingInventoryData = [
    {
      id: 1,
      campaignName: '5% off on 500',
      channel: 'Whatsapp',
      totalContacts: '₹ 3000',
      spend: '₹ 4524.09',
      campaignDate: '02-11-2023',
    },
  ];
  return (
    <>
      <Card style={{ padding: '20px', backgroundColor: '#0562FB' }}>
        <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '400 !important', color: 'white' }}>
          Campaign Management
        </SoftTypography>
      </Card>
      <Card sx={{ marginTop: '15px', padding:'10px' }}>
        <Box sx={{ height: 250, width: '100%' }} className="dat-grid-table-box">
          <DataGrid
            rows={slowMovingInventoryData || []}
            columns={slowMovingInventoryColumns}
            pageSize={10}
            pagination
            disableSelectionOnClick
            getRowId={(row) => row.id}
            className="data-grid-table-boxo"
          />
        </Box>
      </Card>
    </>
  );
};

export default CampaignDashboard;
