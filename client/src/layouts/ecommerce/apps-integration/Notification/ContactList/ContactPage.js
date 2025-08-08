import PeopleIcon from '@mui/icons-material/People';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import PercentIcon from '@mui/icons-material/Percent';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import GradientLineChart from '../../../../../examples/Charts/LineCharts/GradientLineChart';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { isSmallScreen, noDatagif } from '../../../Common/CommonFunction';

const ContactPage = () => {
  const contextType = localStorage.getItem('contextType');

  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const [newVsRepCustData, setNewVsRepCustData] = useState('');
  const [newVsRepCustTitle, setNewVsRepCustTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [renderKey, setRenderKey] = useState(0);
  const [endDate1, setEndDate1] = useState('');
  const [startDate1, setStartDate1] = useState('');
  const columns = [
    {
      field: 'locationId',
      headerName: 'Location ID',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'locationName',
      headerName: 'Location Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'totalCustomers',
      headerName: 'Total Customers',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'newCustomers',
      headerName: 'New Customers',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'repeatCustomers',
      headerName: 'Repeat Customers',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'lcr',
      headerName: 'Loyal Customer Rate',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'clv',
      headerName: 'Customer Lifetime Value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const selectOptions = [
    {
      label: 'All Contacts',
      value: 'All',
    },
    {
      label: 'Segmenatation',
      value: 'segmentation',
    },
  ];

  const handleNavigate = (option) => {
    if (option.value === 'All') {
      navigate('/contact/add');
    } else if (option.value === 'segmentation') {
    }
  };

  const gradientChartData30 = {
    labels: ['0-5', '6-10', '10-15', '16-20', '21-25', '26-30'],
    datasets: [
      {
        label: 'New Customers',
        color: 'info',
        data: [5, 20, 30, 15, 10, 3],
      },
      {
        label: 'Repeat Customers',
        color: 'dark',
        data: [10, 30, 40, 20, 30, 4],
      },
    ],
  };

  const gradientChartData7 = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'New Customers',
        color: 'info',
        data: [5, 10, 2, 3, 5, 6, 9],
      },
      {
        label: 'Repeat Customers',
        color: 'dark',
        data: [10, 12, 3, 5, 5, 9, 8],
      },
    ],
  };
  const gradientChartDataMonth = {
    labels: ['0-5', '6-10', '10-15', '16-20', '21-25', '26-30'],
    datasets: [
      {
        label: 'New Customers',
        color: 'info',
        data: [5, 40, 80, 15, 1, 3],
      },
      {
        label: 'Repeat Customers',
        color: 'dark',
        data: [1, 30, 50, 12, 3, 4],
      },
    ],
  };
  const gradientChartData6Month = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'New Customers',
        color: 'info',
        data: [5, 4, 20, 5, 12, 45],
      },
      {
        label: 'Repeat Customers',
        color: 'dark',
        data: [1, 3, 80, 21, 4, 50],
      },
    ],
  };

  const rows = [
    // {
    //   id: 1,
    //   list: 'List 1',
    //   NumberofContacts: '2390',
    //   lastUpdated: '23 Nov, 2023',
    //   createdON: '23 Nov, 2023',
    // },
  ];

  const appAudienceData = [
    {
      title: 'Total Customers',
      value: 'NA',
      icon: <PeopleIcon />,
      backgroundColor: 'linear-gradient(60deg, #5E35B1, #039BE5)',
    },
    {
      title: 'New Customers',
      value: 'NA',
      icon: <PeopleIcon />,
      backgroundColor: 'linear-gradient(60deg, #F50057, #FF8A80)',
    },
    {
      title: 'Repeat Customers',
      value: 'NA',
      icon: <PeopleIcon />,
      backgroundColor: 'linear-gradient(60deg, #fb8c00, #FFCA29)',
    },
    {
      title: 'Loyal Customer Rate',
      value: 'NA',
      icon: <PercentIcon />,
      backgroundColor: 'linear-gradient(60deg, #43A047, #FFEB3B)',
    },
    {
      title: 'Customer Lifetime Value',
      value: 'NA',
      icon: <PeopleIcon />,
      backgroundColor: 'linear-gradient(60deg, #BF40BF, #CBC3E3)',
    },
    {
      title: 'Customer Churn',
      value: 'NA',
      icon: <PercentIcon />,
      backgroundColor: 'linear-gradient(60deg, #ff0000, #ff6347 )',
    },
    {
      title: 'Revenue Churn',
      value: 'NA',
      icon: <PercentIcon />,
      backgroundColor: 'linear-gradient(60deg, #FFAC1C, #FFD580 )',
    },
    {
      title: 'Customer Retention Rate',
      value: 'NA',
      icon: <PercentIcon />,
      backgroundColor: 'linear-gradient(60deg, #40E0D0, #9FE2BF )',
    },
  ];

  const DateOptions = [
    {
      label: 'Last 7 days',
      value: '7days',
    },
    {
      label: 'Last 30 days',
      value: '30days',
    },
    {
      label: 'This month',
      value: 'month',
    },
    {
      label: 'Last 6 months',
      value: '6months',
    },
    {
      label: 'Custom Range',
      value: 'custom',
    },
  ];

  const handlefilterDate = (option) => {
    setNewVsRepCustData(option.value);
    setNewVsRepCustTitle(option.label);
  };

  const spentOptions = [
    {
      label: 'Total',
      value: 'total',
    },
    {
      label: 'App',
      value: 'app',
    },
    {
      label: 'All Stores',
      value: 'stores',
    },
  ];

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        {/* <Box
          className="search-bar-filter-and-table-container"
          style={
            {
              // boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
              // position: 'relative',
            }
          }
        >
          <SoftBox
            className="header-bulk-price-edit search-bar-filter-container"
            sx={{
              padding: '15px',
              bgcolor: 'var(--search-bar-filter-container-bg)',
              display: 'flex',
              justifyContent: 'flex-end !important',
            }}
            // variant="gradient"
            // bgColor="info"
          >
            <SoftButton
              className="vendor-add-btn"
              sx={{
                backgroundColor: '#0562FB !important',
                color: '#ffffff !important',
                border: '2px solid #ffffff !important',
              }}
              onClick={() => navigate('/contact/add')}
            >
              <AddIcon />
              List
            </SoftButton>
          </SoftBox>
          <SoftBox py={0} px={0}>
            <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
              <DataGrid columns={columns} rows={rows} pagination />
            </SoftBox>
          </SoftBox>
        </Box> */}
        <SoftBox style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Audience Snapshot</SoftTypography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/contacts/all-contacts')}>
              All Contacts
            </SoftButton>
          </div>
        </SoftBox>
        <Grid container spacing={2} style={{ ml: '10px -20px', padding: '10px' }}>
          <Grid item xs={12} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #5E35B1, #039BE5)' }}
                >
                  <PeopleIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    Total Customers
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.6rem',
                      fontWeight: '200',
                      textAlign: 'right',
                    }}
                  >
                    (All Locations)
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
                    NA
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #F50057, #FF8A80)' }}
                >
                  <PeopleIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    New Customers
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.6rem',
                      fontWeight: '200',
                      textAlign: 'right',
                    }}
                  >
                    (All Locations)
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
                    NA
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #fb8c00, #FFCA29)' }}
                >
                  <PeopleIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    Repeat Customers
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#214053',
                      fontSize: '0.6rem',
                      fontWeight: '200',
                      textAlign: 'right',
                    }}
                  >
                    (All Locations)
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
                    NA
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <SoftBox
          className="returning-customer"
          flexDirection={isMobileDevice ? 'column' : 'row'}
          alignItems={isMobileDevice ? 'stretch' : 'center'}
        >
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>New vs Returning Customer</SoftTypography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <SoftSelect
              placeholder="Last 30 Days"
              options={DateOptions}
              onChange={(option) => handlefilterDate(option)}
            />
          </div>
        </SoftBox>
        {newVsRepCustData === 'custom' && (
          <SoftBox className="market-contact-custom">
            <div>
              <Typography className="coupon-filter-box2-typo-head">Start Date</Typography>
              <SoftBox>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    key={renderKey}
                    {...(startDate && {
                      value: dayjs(startDate),
                    })}
                    views={['year', 'month', 'day']}
                    format="DD-MM-YYYY"
                    onChange={(date) => setStartDate(format(date.$d, 'yyyy-MM-dd'))}
                  />
                </LocalizationProvider>
              </SoftBox>
            </div>
            <div>
              <Typography className="coupon-filter-box2-typo-head">End Date</Typography>
              <SoftBox>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    key={renderKey}
                    {...(endDate && {
                      value: dayjs(endDate),
                    })}
                    views={['year', 'month', 'day']}
                    format="DD-MM-YYYY"
                    onChange={(date) => setEndDate(format(date.$d, 'yyyy-MM-dd'))}
                  />
                </LocalizationProvider>
              </SoftBox>
            </div>
          </SoftBox>
        )}
        <SoftBox>
          <GradientLineChart
            title={`New Customers (${newVsRepCustTitle !== '' ? newVsRepCustTitle : 'Last 30 days'})`}
            chart={
              newVsRepCustData === '30days'
                ? gradientChartData30
                : newVsRepCustData === '7days'
                ? gradientChartData7
                : newVsRepCustData === 'month'
                ? gradientChartDataMonth
                : newVsRepCustData === '6months'
                ? gradientChartData6Month
                : gradientChartData30
            }
          />
        </SoftBox>
        {!isMobileDevice && (
          <>
            <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
              <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Location Wise Audience Report
              </SoftTypography>
            </SoftBox>
            <SoftBox className="search-bar-filter-and-table-container">
              <SoftBox className="search-bar-filter-container">
                <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box className="all-products-filter-product" style={{ width: '350px' }}>
                    <SoftInput
                      className="all-products-filter-soft-input-box"
                      placeholder="Search Audience"
                      icon={{ component: 'search', direction: 'left' }}
                    />
                  </Box>
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
                          <h3 className="no-data-text-I"> No Data available</h3>
                        </SoftBox>
                      ),
                      NoResultsOverlay: () => (
                        <SoftBox className="No-data-text-box">
                          <SoftBox className="src-imgg-data">
                            <img className="src-dummy-img" src={noDatagif} />
                          </SoftBox>
                          <h3 className="no-data-text-I"> No Data available</h3>
                        </SoftBox>
                      ),
                    }}
                  />
                </Box>
              </SoftBox>
            </SoftBox>
          </>
        )}

        <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>App Audience Report</SoftTypography>
        </SoftBox>
        {/* <SoftBox className="audience-dashboard-part4-box"> */}
        <Grid container spacing={2} style={{ margin: '10px -20px', padding: '10px' }}>
          {appAudienceData.map((item, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} ml={isMobileDevice ? '5px' : '0px'}>
                <div
                  className="audience-dashboard-part4-inner"
                  key={index}
                  style={{
                    background: item.backgroundColor,
                    color: '#FFF',
                  }}
                >
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#fff',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: '200',
                        textAlign: 'left',
                      }}
                    >
                      {item.title}
                    </Typography>
                  </div>
                  <div style={{ fontSize: '30px' }}>{item.icon}</div>
                </div>
              </Grid>
            );
          })}
        </Grid>
        {/* </SoftBox> */}
        <SoftBox
          className="returning-customer"
          flexDirection={isMobileDevice ? 'column' : 'row'}
          alignItems={isMobileDevice ? 'stretch' : 'center'}
        >
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>
            Average spend by repeat customer{' '}
          </SoftTypography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <SoftSelect
              placeholder="Last 30 Days"
              options={DateOptions}
              onChange={(option) => handlefilterDate(option)}
            />
            <SoftSelect placeholder="Total" options={spentOptions} />
          </div>
        </SoftBox>
        {newVsRepCustData === 'custom' && (
          <SoftBox
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px',
              gap: '20px',
            }}
          >
            <div>
              <Typography className="coupon-filter-box2-typo-head">Start Date</Typography>
              <SoftBox>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    key={renderKey}
                    {...(startDate1 && {
                      value: dayjs(startDate1),
                    })}
                    views={['year', 'month', 'day']}
                    format="DD-MM-YYYY"
                    onChange={(date) => setStartDate1(format(date.$d, 'yyyy-MM-dd'))}
                  />
                </LocalizationProvider>
              </SoftBox>
            </div>
            <div>
              <Typography className="coupon-filter-box2-typo-head">End Date</Typography>
              <SoftBox>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    key={renderKey}
                    {...(endDate1 && {
                      value: dayjs(endDate1),
                    })}
                    views={['year', 'month', 'day']}
                    format="DD-MM-YYYY"
                    onChange={(date) => setEndDate1(format(date.$d, 'yyyy-MM-dd'))}
                  />
                </LocalizationProvider>
              </SoftBox>
            </div>
          </SoftBox>
        )}
        <SoftBox>
          <GradientLineChart
            title={`Average Spent (${newVsRepCustTitle !== '' ? newVsRepCustTitle : 'Last 30 days'})`}
            chart={
              newVsRepCustData === '30days'
                ? gradientChartData30
                : newVsRepCustData === '7days'
                ? gradientChartData7
                : newVsRepCustData === 'month'
                ? gradientChartDataMonth
                : newVsRepCustData === '6months'
                ? gradientChartData6Month
                : gradientChartData30
            }
          />
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default ContactPage;
