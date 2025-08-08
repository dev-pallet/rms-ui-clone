import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import './whatsappBusiness.css';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import { checkWhatsappBusinessConnect, getWhatsAppConnected } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Filter from '../../Common/Filter';
import Status from '../../Common/Status';
import { noDatagif } from '../../Common/CommonFunction';

const WhatsappBusOverview = () => {
  const contextType = localStorage.getItem('contextType');
  const [storeOnboarded, setStoreOnboarded] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const clientId = localStorage.getItem('clientId');
  const showSnackbar = useSnackbar();

  const fetchWhatsappConnect = async () => {
    try {
      await getWhatsAppConnected(clientId).then((res) => {
        if (res?.data?.data?.clientStatus === 'SUBSCRIBED') {
        } else if (res?.data?.data?.clientStatus === 'UNSUBSCRIBED') {
        }
      });
    } catch (error) {
      setOpenDialog(true);
      navigate('/notificationconnect');
    }
  };

  useEffect(() => {
    fetchWhatsappConnect();
  }, []);

  const columns = [
    {
      field: 'customerName',
      headerName: 'Customer Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'cartDate',
      headerName: 'Cart Date',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'orderId',
      headerName: 'Order Id',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'orderStatus',
      headerName: 'Order Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'orderDetails',
      headerName: 'Order Details',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'payStatus',
      headerName: 'Payment Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'fulfillment',
      headerName: 'Fulfillment',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
  ];

  const rows = [
    {
      customerName: 'Nitika',
      cartDate: '20 Dec, 2023',
      orderId: 'WB001',
      orderStatus: 'ACTIVE',
      orderDetails: 'NA',
      payStatus: 'COMPLETED',
      fulfillment: 'Completed',
    },
    {
      customerName: 'Aman',
      cartDate: '20 Dec, 2023',
      orderId: 'WB002',
      orderStatus: 'INACTIVE',
      orderDetails: 'NA',
      payStatus: 'COMPLETED',
      fulfillment: 'Completed',
    },
  ];

  const getStoreCatalogDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    try {
      checkWhatsappBusinessConnect(orgId, locId)
        .then((res) => {
          if (res?.data?.data?.status === 'ONBOARDING_REQUESTED') {
            setStoreOnboarded(true);
            localStorage.setItem('catalogId', res?.data?.data?.catalogId);
            showSnackbar('Store is already onboarded', 'warning');
          }
        })
        .catch((err) => {
          if (err?.message) {
            showSnackbar('Please onboard the Store', 'success');
          }
        });
    } catch (error) {
      showSnackbar('Please onboard the Store', 'error');
    }
  };

  useEffect(() => {
    getStoreCatalogDetails();
  }, []);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <Dialog open={openDialog} maxWidth="xs">
          <DialogTitle>Connect to Whatsapp</DialogTitle>
          <DialogContent>You are not connected to whatsapp. Please connect</DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/notificationconnect')}>Connect</Button>
          </DialogActions>
        </Dialog>
        <SoftBox style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Order Summary</SoftTypography>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* {!storeOnboarded && <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketing/whatsapp-commerce/catalog/details')}>
              Show Details
            </SoftButton>} */}
            <SoftButton
              className={!storeOnboarded ? 'vendor-add-btn' : 'vendor-third-btn'}
              onClick={() => navigate('/marketing/whatsapp-commerce/catalog')}
            >
              {!storeOnboarded ? 'Start process' : 'Finish process'}
            </SoftButton>
          </div>
        </SoftBox>
        <Grid container spacing={2} justifyContent="space-evenly" style={{ margin: '10px -20px' }}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #5E35B1, #039BE5)' }}
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: '40px', color: '#fff' }} />
                </div>
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'right',
                    }}
                  >
                    All Orders
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    0
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #F50057, #FF8A80)' }}
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: '40px', color: '#fff' }} />
                </div>
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'right',
                    }}
                  >
                    Orders Recieved
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    0
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #fb8c00, #FFCA29)' }}
                >
                  <CurrencyRupeeIcon sx={{ fontSize: '40px', color: '#fff' }} />
                </div>
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.8rem',
                      fontWeight: '200',
                      textAlign: 'right',
                    }}
                  >
                    Total Order Value
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    0
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Order Details</SoftTypography>
        </SoftBox>
        <SoftBox className="search-bar-filter-and-table-container">
          <SoftBox className="search-bar-filter-container">
            <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box className="all-products-filter-product" style={{ width: '350px' }}>
                <SoftInput
                  className="all-products-filter-soft-input-box"
                  placeholder="Search Orders"
                  icon={{ component: 'search', direction: 'left' }}
                />
              </Box>
              <Filter />
            </SoftBox>
          </SoftBox>
          <SoftBox>
            <Box sx={{ height: 525, width: '100%' }}>
              <DataGrid
                rows={rows ? rows : []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowId={(row) => row.orderId}
                components={{
                  NoRowsOverlay: () => (
                    <SoftBox className="No-data-text-box">
                      <SoftBox className="src-imgg-data">
                        <img className="src-dummy-img" src={noDatagif} />
                      </SoftBox>
                      <h3 className="no-data-text-I"> No transaction available</h3>
                    </SoftBox>
                  ),
                  NoResultsOverlay: () => (
                    <SoftBox className="No-data-text-box">
                      <SoftBox className="src-imgg-data">
                        <img className="src-dummy-img" src={noDatagif} />
                      </SoftBox>
                      <h3 className="no-data-text-I"> No transaction available</h3>
                    </SoftBox>
                  ),
                }}
              />
            </Box>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default WhatsappBusOverview;
