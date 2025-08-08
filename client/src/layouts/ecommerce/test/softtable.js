import './softtable.css';
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreIcon from '@mui/icons-material/MoreVert';
import SoftBox from 'components/SoftBox';
import SoftSelect from 'components/SoftSelect';
import Toolbar from '@mui/material/Toolbar';

const columns = [
  {
    field: 'createdOn', headerName: 'Date',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    width: 120,
    resizable: false
  },
  {
    field: 'id',
    headerName: 'Order Number',
    width: 150,
    headerAlign: 'left',
    headerClassName: 'datagrid-columns',
    cellClassName: 'datagrid-rows',
    resizable: false

  },
  {
    field: 'purchaseOrderNo',
    headerName: 'Sales channels',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    width: 180
  },
  {
    field: 'paymentmethod',
    headerName: 'Customer Name',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    width: 150
  },
  {
    field: 'vendorname',
    headerName: 'Payment Status',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    cellclassName: 'sss-kskk',
    align: 'left',
    width: 150
  },
  {
    field: 'billnumber',
    headerName: 'Fulfilment status',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    width: 150
  },


  {
    field: 'balance',
    headerName: 'Delivery method',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    width: 150
  },
  {
    field: 'amount',
    headerName: 'Amount',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    width: 150
  },
];

const rows = [
  { id: '48525500', createdOn: '22/04/2022',purchaseOrderNo:'Pallet', paymentmethod: 'Rahul', billnumber: 'Fulfilled', balance: 'In-store', vendorname: 'Closed', amount: '70000' }
];

////

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
  

export default function Testcomp()  {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu  
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
         
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
          
        
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
  
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu 
       
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

        
      <SoftBox >
        <SoftSelect
          placeholder="Status"

          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
            { value: 'Created', label: 'Created' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Blacklisted', label: 'Blacklisted' }
          ]}
        />
      </SoftBox>
         
      <SoftSelect className="searc"
        placeholder="Delivery Location"

        options={[
          { value: 'ka', label: 'Karnataka' },
          { value: 'tn', label: 'Tamilnadu' },
          { value: 'kl', label: 'Kerala' },
          { value: 'ap', label: 'Andhra Pradesh' },
          { value: 'ts', label: 'Telengana' },
        ]}
      />
  
      <SoftBox className="pro">
        <SoftSelect
          placeholder="Product Name"
          options={[
            { value: 'Water', label: 'Water' },
            { value: 'Chips', label: 'Chips' },
            { value: 'Soap', label: 'Soap' },
            { value: 'Ac', label: 'Ac' },
            { value: 'tv', label: 'TV' },
          ]}
        />
      </SoftBox>
               
    </Menu>
     
  );
  
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ flexGrow: 10 }} >
        <AppBar position="static">
          <Toolbar>
      
          
            <Search className='searches'>
           
              <StyledInputBase
            
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            
           
            </Search>
    
  
            <Box sx={{ display: { xs: 'flex'} }} >
              <IconButton className='dots-p'
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
            <Button className='new'>New</Button>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        
      </Box>
      
   
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onCellDoubleClick={() => { navigate('/sales/all-orders/details'); }}
        />
      </Box>
    </DashboardLayout>
  );
    
  
}



