import './manage-store.css';
import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';

const column = [
  {
    field: 'franchiseName',
    headerName: 'Franchise Name',
    minWidth: 100,
    flex: 0.75,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'contact',
    headerName: 'Contact',
    minWidth: 100,
    flex: 0.75,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'organisation',
    headerName: 'Organisation',
    minWidth: 250,
    flex: 1,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'storeLocation',
    headerName: 'Store Location',
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    flex: 1,
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'pan',
    headerName: 'PAN',
    minWidth: 80,
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
const ManageStore = () => {
  const navigate =  useNavigate();
  const rows = [
    {id: 1,franchiseName: 'Mumbai Store 1', contact: 'Person 1',organisation: 'Niligiris North',storeLocation: 'Mumbai',   pan: 'HSPIWL3929H', gstNumber: '12A7890123456Z'},
    {id: 2,franchiseName: 'Mumbai Store 2', contact: 'Person 2',organisation: 'Niligiris North',storeLocation: 'Mumbai',   pan: 'HARFWL3929E', gstNumber: '13A7890123346Z'},
    {id: 3,franchiseName: 'Chennai Store 1',contact: 'Person 3', organisation: 'Niligiris South',storeLocation: 'Chennai', pan: 'UYFIWL3929O',   gstNumber: '14A7890167456Z'},
    {id: 4,franchiseName: 'Chennai Store 2',contact: 'Person 4', organisation: 'Niligiris South',storeLocation: 'Chennai', pan: 'HSMHGL3929L',   gstNumber: '15A78901763456Z'},
  ];

  const newHandler = () => {
    navigate('/stores/manage-store/add-new-store');
  };

  const onClickRowHandler = () => {
    navigate('/store/manage-store/franchise-details');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Stack width='100%' sx={{backgroundColor: 'white !important', marginBottom: '10px'}}>
        <SoftBox className="store-datagrid-header">
          <SoftButton variant="insideHeader" onClick={newHandler}>
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
            onRowClick={onClickRowHandler}
          />
        </SoftBox>
      </Stack>
    </DashboardLayout>
  );
};

export default ManageStore;
