import './manage-sellers.css';
import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';

const column = [
  {
    field: 'id',
    headerName: 'Seller ID',
    minWidth: 100,
    flex: 0.75,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'sellerName',
    headerName: 'Seller Name',
    minWidth: 100,
    flex: 0.75,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'sellerLocation',
    headerName: 'Location',
    minWidth: 250,
    flex: 1,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'sellerType',
    headerName: 'Seller Type',
    minWidth: 250,
    flex: 1,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'gstNumber',
    headerName: 'GST Number',
    minWidth: 80,
    flex: 1,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
];
const ManageSellers = () => {
  
  const rows = [
    {id: 'S00001',sellerName: 'Seller 1', sellerLocation: 'Chennai',sellerType: 'Primary',storeLocation: 'Chennai',gstNumber: '12A7890123456Z'},
    {id: 'S00002',sellerName: 'Seller 2', sellerLocation: 'Mumbai',sellerType: 'Primary',storeLocation: 'Mumbai',gstNumber: '13A7890123346Z'},
    {id: 'S00003',sellerName: 'Seller 3', sellerLocation: 'Chennai',sellerType: 'Primary',storeLocation: 'Chennai',gstNumber: '14A7890167456Z'},
    {id: 'S00004',sellerName: 'Seller 4', sellerLocation: 'Nagpur',sellerType: 'Primary',storeLocation: 'Nagpur',gstNumber: '15A78901763456Z'},
  ];
  const newHandler = () => {
    window.open('/purchase/add-vendor');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Stack width='100%' sx={{backgroundColor: 'white !important', marginBottom: '10px'}}>
        <SoftBox className="store-datagrid-header">
          <SoftButton variant="insideHeader" onClick={newHandler} >
            +New
          </SoftButton>
        </SoftBox>
        <SoftBox sx={{height: 525}}>
          <DataGrid
            sx={{ cursor: 'pointer', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
            columns={column}
            rows={rows}
            pagination
            pageSize={10}
            paginationMode="server"
            className="data-grid-table-boxo"
          />
        </SoftBox>
      </Stack>
    </DashboardLayout>
  );
};

export default ManageSellers;