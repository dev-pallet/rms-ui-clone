import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../components/SoftTypography';

const RecentFulfillment = () => {
  const columnFulfilment = [
    {
      field: 'orderNo',
      headerName: 'Order No',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 130,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'deliveryLoc',
      headerName: 'Delivery location',
      minWidth: 130,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'customer',
      headerName: 'Customer',
      minWidth: 130,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const rowFulfilment = [
    {
      id: '08000',
      orderNo: '2352',
      date: '23/04/2022',
      deliveryLoc: 'Erode',
      customer: 'Nikita',
      amount: '9879',
      status: 'Delivered',
    },
  ];
  
  return (
    <div>
      <SoftBox pt={3} px={1}>
        <SoftTypography variant="h6" fontWeight="medium">
          Recent fulfillment
        </SoftTypography>
      </SoftBox>
      <SoftBox py={1}>
        <SoftBox className="softbox-box-shadow">
          <Box sx={{ height: 300, width: '100%' }}>
            <DataGrid
              rows={rowFulfilment}
              columns={columnFulfilment}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // checkboxSelection
              disableSelectionOnClick
              // onCellDoubleClick={() => { navigate("/sales/all-orders/details") }}
            />
          </Box>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default RecentFulfillment;
