import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../../../components/SoftBox';

const columns = [
  {
    field: 'id',
    headerName: 'Sr No.',
    headerAlign: 'center',
    minWidth: 70,
    flex: 1,
    headerStyle: { fontSize: '14px' }, // Adjust the font size as needed
    cellStyle: { fontSize: '12px' }, // Adjust the font size as needed
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'datagrid-columns',
    cellClassName: 'datagrid-rows',
  },
  {
    field: 'name',
    headerName: 'Customer name',
    headerAlign: 'center',
    headerStyle: { fontSize: '14px' }, // Adjust the font size as needed
    cellStyle: { fontSize: '12px' }, // Adjust the font size as needed
    minWidth: 180,
    flex: 1,
    align: 'center', // Center align the content
    headerClassName: 'datagrid-columns',
    cellClassName: 'datagrid-rows',
  },
  {
    field: 'customerId',
    headerName: 'Customer Id',
    headerAlign: 'center',
    type: 'number',
    headerStyle: { fontSize: '14px' }, // Adjust the font size as needed
    cellStyle: { fontSize: '12px' }, // Adjust the font size as needed
    minWidth: 150,
    flex: 1,
    align: 'center', // Center align the content
    headerClassName: 'datagrid-columns',
    cellClassName: 'datagrid-rows',
  },
  {
    field: 'location',
    headerName: 'Location',
    headerAlign: 'center',
    type: 'number',
    headerStyle: { fontSize: '14px' }, // Adjust the font size as needed
    cellStyle: { fontSize: '12px' }, // Adjust the font size as needed
    minWidth: 150,
    flex: 1,
    align: 'center', // Center align the content
    headerClassName: 'datagrid-columns',
    cellClassName: 'datagrid-rows',
  },
  {
    field: 'registrationDate',
    headerName: 'Registration Date',
    headerAlign: 'center',
    type: 'string',
    headerStyle: { fontSize: '14px' }, // Adjust the font size as needed
    cellStyle: { fontSize: '12px' }, // Adjust the font size as needed
    minWidth: 150,
    flex: 1,
    align: 'center', // Center align the content
    headerClassName: 'datagrid-columns',
    cellClassName: 'datagrid-rows',
  },
  {
    field: 'mobile',
    headerName: 'Mobile No.',
    headerAlign: 'center',
    headerStyle: { fontSize: '14px' }, // Adjust the font size as needed
    cellStyle: { fontSize: '12px' }, // Adjust the font size as needed
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    minWidth: 150,
    flex: 1,
    align: 'center', // Center align the content
    headerClassName: 'datagrid-columns',
    cellClassName: 'datagrid-rows',
  },
];
const OverviewCustomers = () => {
  const rows = [
    {
      id: 0,
      name: 'Customer 1',
      customerId: 'CUST0001',
      location: 'Mumbai',
      registrationDate: '20th OCT 2023',
      mobile: '9397238719',
    },
    {
      id: 1,
      name: 'Customer 2',
      customerId: 'CUST0002',
      location: 'Erode',
      registrationDate: '21th MAR 2023',
      mobile: '8456533355',
    },
    {
      id: 2,
      name: 'Customer 3',
      customerId: 'CUST0003',
      location: 'Salem',
      registrationDate: '22th AUG 2023',
      mobile: '7527257847',
    },
    {
      id: 4,
      name: 'Customer 4',
      customerId: 'CUST0004',
      location: 'Chennai',
      registrationDate: '24th NOV 2023',
      mobile: '67473466254',
    },
  ];

  return (
    <Stack width="100%" sx={{ backgroundColor: 'white !important', marginBottom: '10px' }}>
      <SoftBox className="store-datagrid-header overview-products"></SoftBox>
      <SoftBox sx={{ height: 525 }}>
        <DataGrid
          sx={{ cursor: 'pointer', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
          columns={columns}
          rows={rows}
          pagination
          pageSize={10}
          paginationMode="server"
          className="data-grid-table-boxo"
          // onRowClick={onClickRowHandler}
        />
      </SoftBox>
    </Stack>
  );
};

export default OverviewCustomers;
