import CampaignIcon from '@mui/icons-material/Campaign';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import PercentIcon from '@mui/icons-material/Percent';
import { Box, Button, Chip, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { isSmallScreen, noDatagif } from '../../Common/CommonFunction';
import Filter from '../../Common/Filter';
import { ChipBoxHeading } from '../../Common/Filter Components/filterComponents';
import Status from '../../Common/Status';

const CampaignPage = () => {
  const navigate = useNavigate();
  const contextType = localStorage.getItem('contextType');

  const [selectedChannelFilter, setSelectedChannelFilter] = useState();
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    channel: 0,
  });

  const [selectedTab, setSelectedTab] = useState('Active');

  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);

  const showSnackbar = useSnackbar();

  const orgId = localStorage.getItem('orgId');
  const emailCc = localStorage.getItem('user_details');
  const obj = JSON.parse(emailCc);
  const orgType = localStorage.getItem('contextType');
  const isMobileDevice = isSmallScreen();

  const handleNavigationCreate = () => {
    navigate('/marketing/campaigns/type');
  };

  const columns = [
    {
      field: 'CampaignID',
      headerName: 'Campaign ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'CampaignType',
      headerName: 'Campaign Type',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'CampaignName',
      headerName: 'Campaign Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'Status',
      headerName: 'Status',
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
      field: 'CreatedON',
      headerName: 'Created On',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'Channel',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'OpenRate',
      headerName: 'Open Rate',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'ConversionRate',
      headerName: 'Conversion Rate',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'CAC',
      headerName: 'CAC',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 70,
      flex: 1,
    },
    {
      field: 'delete',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertRoundedIcon sx={{ fontSize: '14px' }} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorMarkupEl}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <Button
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    handleCloseOp();
                  }}
                >
                  Active
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  style={{
                    backgroundColor: '#7c86de',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    handleCloseOp();
                  }}
                >
                  Inactive
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  style={{
                    backgroundColor: '#ff0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    handleCloseOp();
                  }}
                >
                  Delete
                </Button>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const rows = [
    // {
    //   CampaignID: 'CAM001',
    //   CampaignType: 'Automated',
    //   CampaignName: 'Abandoned Cart',
    //   Status: 'ACTIVE',
    //   CreatedON: '12 Dec, 2023',
    //   Channel: 'Whatsapp',
    //   OpenRate: '90',
    //   ConversionRate: '20',
    //   CAC: '37',
    // },
  ];

  const allChannels = [
    {
      label: 'SMS',
      value: 'sms',
    },
    {
      label: 'Email',
      value: 'email',
    },
    {
      label: 'Whatsapp',
      value: 'whatsapp',
    },
    {
      label: 'Push Notifications',
      value: 'push',
    },
  ];

  const selectChannelFilter = (
    <>
      <SoftSelect
        placeholder="Select Channel"
        options={allChannels}
        onChange={(option) => {
          setSelectedChannelFilter(option);
          if (filterState['channel'] === 0) {
            setFiltersApplied((prev) => prev + 1);
            setFilterState({ ...filterState, channel: 1 });
          }
        }}
      />
    </>
  );

  const selectBoxArray = [selectChannelFilter];

  const removeSelectedCustomCampaignFilter = (filterType) => {
    switch (filterType) {
      case 'channel':
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, channel: 0 });
        setSelectedChannelFilter();
        break;
      default:
        return;
    }
  };

  const filterChipBoxes = (
    <>
      {filterState.channel === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Channel Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={selectedChannelFilter.label}
              onDelete={() => removeSelectedCustomCampaignFilter('channel')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Campaign Performance</SoftTypography>
          <SoftButton className="vendor-add-btn" onClick={handleNavigationCreate}>
            Create Campaign
          </SoftButton>
        </SoftBox>
        <Grid container spacing={2} style={{ margin: '10px -20px', padding: '10px' }}>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #5E35B1, #039BE5)' }}
                >
                  <CampaignIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    All Campaigns
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
                    0 campaigns
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #F50057, #FF8A80)' }}
                >
                  <CampaignIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    Active Campaigns
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
                    0 campaigns
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #fb8c00, #FFCA29)' }}
                >
                  <CampaignIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    Inactive Campaigns
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
                    0 campaigns
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #43A047, #FFEB3B)' }}
                >
                  <PercentIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    Average Conversion Rates
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
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #BF40BF, #CBC3E3)' }}
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
                    Revenue Generated
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
          <Grid item xs={12} sm={6} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #ff0000, #ff6347 )' }}
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
                    Average Customer Acquisition Cost
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
        {!isMobileDevice && (
          <>
            <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
              <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Campaign Details</SoftTypography>
            </SoftBox>
            <SoftBox className="search-bar-filter-and-table-container">
              <SoftBox className="search-bar-filter-container">
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px' }}>
                  <Typography
                    onClick={() => setSelectedTab('Active')}
                    className={selectedTab === 'Active' ? 'coupon-static-selected' : 'coupon-static'}
                  >
                    Active Campaigns
                  </Typography>

                  <Typography
                    onClick={() => setSelectedTab('Inactive')}
                    className={selectedTab === 'Inactive' ? 'coupon-static-selected' : 'coupon-static'}
                  >
                    Inactive Campaigns
                  </Typography>
                </div>
                <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <Box className="all-products-filter-product" style={{ width: '350px' }}>
                    <SoftInput
                      className="all-products-filter-soft-input-box"
                      placeholder="Search Campaigns"
                      icon={{ component: 'search', direction: 'left' }}
                    />
                  </Box>
                  <Filter
                    selectBoxArray={selectBoxArray}
                    filtersApplied={filtersApplied}
                    filterChipBoxes={filterChipBoxes}
                  />
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
                    getRowId={(row) => row.CampaignID}
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
          </>
        )}
      </DashboardLayout>
    </div>
  );
};

export default CampaignPage;
