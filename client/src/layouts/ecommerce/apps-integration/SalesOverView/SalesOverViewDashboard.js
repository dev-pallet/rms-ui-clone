import './SalesDashboard.css';
import { Card, Grid, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { SplideSlide } from '@splidejs/react-splide';
import { isSmallScreen } from '../../Common/CommonFunction';
import AbcAnalasisChart from '../../../dashboard widgets/Inventory/AbcAnalasisChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import PaymentChannelWidget from './PaymentChannelWidget';
import PopularProducts from '../../../dashboard widgets/PopularProduct/popularProduct';
import React, { useState } from 'react';
import SalesByCategory from '../../../dashboard widgets/Sales/salesByCategory';
import SalesOverViewWidget from './SalesOverViewWidget';
import SlowMovingInventory from '../../../dashboard widgets/PopularProduct/slowMovingInventory';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import SplideCommon from '../../../dashboards/default/components/common-tabs-carasoul';
import StockByBrands from '../../../dashboard widgets/Inventory/StockByBrands';
import StockByCategory from '../../../dashboard widgets/Inventory/StockByCategory';

const SalesOverViewDashboard = () => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const isMobileDevice = isSmallScreen();
  const paperStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px', paddingInline: '20px' };
  const [salesChannelLabel, setSalesChannelLabel] = useState(['APP', 'POS', 'DIRECT']);
  const [salesChannelData, setSalesChannelData] = useState([5, 11, 12]);
  const [paymentChannelLabel, setPaymentChannelLabel] = useState(['UPI', 'CARD', 'CASH']);
  const [paymentChannelData, setPaymentChannelData] = useState([15, 20, 12]);
  const [filterGraph, setFilterGraph] = useState('Weekly');

  const [monthlyLabels, setMonthlyLabels] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [prevsalesData, setPrevSalesData] = useState([]);
  const [prevsalesValues, setPrevSalesValues] = useState([]);
  const [topTenSalesName, setTopTenSalesName] = useState([
    'Creative Tim',
    'Github',
    'Bootsnipp',
    'Dev.to',
    'Codeinwp',
    'Another Label 1',
    'Another Label 2',
    'Yet Another Label',
    'Random Label X',
    'Label Y',
  ]);
  const [topTenSales, setTopTenSales] = useState([5, 11, 12, 9, 15, 7, 14, 10, 18, 6]);
  const ordersData = [
    { cartValue: 100, month: 'September', numberOfOrders: 20 },
    { cartValue: 100, month: 'October', numberOfOrders: 30 },
    { cartValue: 200, month: 'September', numberOfOrders: 15 },
    { cartValue: 200, month: 'October', numberOfOrders: 25 },
    // Add more data as needed
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const cartValues = [...new Set(ordersData.map((order) => order.cartValue))];

  const dayStyle = {
    fontSize: '0.98rem',
    backgroundColor: '#78f0b0',
    paddingInline: '3px',
    borderRadius: '8px',
    width: '50px',
    textAlign: 'center',
  };

  const customerReportStyle = {
    fontSize: '0.98rem',
    backgroundColor: '#f7f7f7',
    paddingInline: '3px',
    borderRadius: '8px',
    width: '50%',
    textAlign: 'center',
  };

  const weeklyData = [
    { id: '1', day: 'Sun', weeklySales: '222,900', weeklyOrder: '377' },
    { id: '2', day: 'Mon', weeklySales: '129,424', weeklyOrder: '264' },
    { id: '3', day: 'Tue', weeklySales: '122,715', weeklyOrder: '377' },
    { id: '4', day: 'Wed', weeklySales: ' 131,942', weeklyOrder: '252' },
    { id: '5', day: 'Thurs', weeklySales: '136,167', weeklyOrder: '264' },
    { id: '6', day: 'Fri', weeklySales: '139,353', weeklyOrder: '268' },
    { id: '7', day: 'Sat', weeklySales: '167,952', weeklyOrder: '295' },
  ];

  const marketingReport = [
    { id: '1', name: 'CAC', number: '377' },
    { id: '2', name: 'Total Orders', number: '377' },
    { id: '3', name: '% Increase in Orders', number: '264' },
    { id: '4', name: 'Total Customers', number: '252' },
    { id: '5', name: 'Total New Customers', number: '268' },
    { id: '6', name: '% Increase in New Customers', number: '295' },
    { id: '7', name: 'Non- Returning Customers', number: '377' },
  ];

  const cartValueData = [
    { id: '1', range: '0-100', percentage: '40%', numOfOrder: '40', cartValue: '₹ 900,300' },
    { id: '2', range: '100-200', percentage: '15%', numOfOrder: '22', cartValue: '₹ 222,000' },
    { id: '3', range: '200-300', percentage: '3%', numOfOrder: '18', cartValue: '₹ 56,799' },
    { id: '4', range: '300-400', percentage: '4%', numOfOrder: '22', cartValue: '₹ 890,079' },
    { id: '5', range: '400-500', percentage: '15%', numOfOrder: '20', cartValue: '₹ 200,300' },
    { id: '6', range: '500-600', percentage: '6%', numOfOrder: '22', cartValue: '₹ 890,079' },
    { id: '7', range: '600-700', percentage: '5%', numOfOrder: '22', cartValue: '₹ 890,079' },
    { id: '8', range: '800-900', percentage: '3%', numOfOrder: '22', cartValue: '₹ 60,898' },
    { id: '9', range: '> 1000', percentage: '2%', numOfOrder: '12', cartValue: '₹ 50,079' },
  ];

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {!isMobileDevice && (
        <Card style={{ padding: '10px', backgroundColor: '#0562FB' }}>
          <SoftBox display="flex" justifyContent="space-between">
            <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '400 !important', color: 'white' }}>
              Sales overview
            </SoftTypography>
            <Card sx={{ padding: '10px', cursor: 'pointer' }} onClick={handleClick}>
              <FilterAltIcon />
            </Card>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <CalendarMonthIcon fontSize="small" />
                </ListItemIcon>
                Weekly
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <CalendarMonthIcon fontSize="small" />
                </ListItemIcon>
                Monthly
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <CalendarMonthIcon fontSize="small" />
                </ListItemIcon>
                Yearly
              </MenuItem>
            </Menu>
          </SoftBox>
        </Card>
      )}
      <br />
      <Grid container spacing={3}>
        {/* payment Channel */}
        <PaymentChannelWidget />
        <SalesByCategory />
      </Grid>

      <SalesOverViewWidget />
      {!isMobileDevice ? (
        <SplideCommon>
          <SplideSlide>
            <PopularProducts orgId={orgId} displayCards={true} />
          </SplideSlide>
          <SplideSlide>
            <SlowMovingInventory orgId={orgId} displayCards={true} />
          </SplideSlide>
        </SplideCommon>
      ) : (
        <>
          <PopularProducts orgId={orgId} />
          <SlowMovingInventory orgId={orgId} />
        </>
      )}
      {!isMobileDevice && (
        <Card style={{ padding: '10px', backgroundColor: '#0562FB', marginBottom: '10px' }}>
          <SoftBox display="flex" justifyContent="space-between">
            <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '400 !important', color: 'white' }}>
              Inventory overview
            </SoftTypography>
          </SoftBox>
        </Card>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AbcAnalasisChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <StockByBrands />
        </Grid>
        <Grid item xs={12}>
          <StockByCategory />
        </Grid>
      </Grid>
      <br />
      {/* <br />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Total sales'} count={0} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Total Profit'} count={0} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Profit Margin'} count={0} type={'%'} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Average Order Value'} count={0} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Total Orders'} count={0} type={' '} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Refunds'} count={0} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Discount'} count={0} type={' '} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Coupons'} count={0} type={' '} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title={'Offers'} count={0} type={' '} />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DefaultDoughnutChart
            title="Top Sales Channels"
            height="230px"
            chart={{
              labels: salesChannelLabel,
              datasets: {
                label: 'Projects',
                backgroundColors: ['darkblue', 'blue', 'green'],
                data: salesChannelData,
              },
            }}
            options={{
              plugins: {
                legend: {
                  position: 'right',
                },
                datalabels: {
                  color: 'blue',
                  labels: {
                    title: {
                      font: {
                        weight: 'bold',
                      },
                    },
                    value: {
                      color: 'green',
                    },
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DefaultDoughnutChart
            title="Top payment channels"
            height="230px"
            chart={{
              labels: paymentChannelLabel,
              datasets: {
                label: 'Projects',
                backgroundColors: ['darkblue', 'blue', 'green'],
                data: paymentChannelData,
              },
            }}
            options={{
              plugins: {
                legend: {
                  position: 'right',
                },
                datalabels: {
                  color: 'blue',
                  labels: {
                    title: {
                      font: {
                        weight: 'bold',
                      },
                    },
                    value: {
                      color: 'green',
                    },
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <Grid container spacing={3}>
              <Grid item xs={4} md={4}>
                <Card style={{ backgroundColor: '#e9f0e9', padding: '12px' }}>
                  <SoftTypography style={{ textAlign: 'center', fontSize: '1rem' }}>Weekdays</SoftTypography>
                </Card>
              </Grid>
              <Grid item xs={4} md={4}>
                <Card style={{ backgroundColor: '#e9f0e9', padding: '12px' }}>
                  <SoftTypography style={{ textAlign: 'center', fontSize: '1rem' }}>Avg. weekly sales</SoftTypography>
                </Card>
              </Grid>
              <Grid item xs={4} md={4}>
                <Card style={{ backgroundColor: '#e9f0e9', padding: '12px' }}>
                  <SoftTypography style={{ textAlign: 'center', fontSize: '1rem' }}> Avg. weekly order</SoftTypography>
                </Card>
              </Grid>
            </Grid>

            {weeklyData.map((ele) => {
              return (
                <Paper style={paperStyle} key={ele?.id}>
                  <SoftTypography style={dayStyle}>{ele?.day}</SoftTypography>
                  <SoftTypography style={{ fontSize: '0.98rem' }}>₹ {ele?.weeklySales || '0'}</SoftTypography>
                  <SoftTypography style={{ fontSize: '0.98rem' }}>{ele?.weeklyOrder || '0'}</SoftTypography>
                </Paper>
              );
            })}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Card style={{ backgroundColor: '#e9f0e9', padding: '12px' }}>
              <SoftTypography style={{ textAlign: 'center', fontSize: '1rem' }}>Marketing Report</SoftTypography>
            </Card>
            {marketingReport.map((ele) => {
              return (
                <Paper style={paperStyle} key={ele?.id}>
                  <SoftTypography style={customerReportStyle}>{ele?.name || ''}</SoftTypography>
                  <SoftTypography style={{ fontSize: '0.98rem' }}>{ele?.number || 0}</SoftTypography>
                </Paper>
              );
            })}
          </Card>
        </Grid>
      </Grid>
      <br />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card style={{ padding: '30px' }}>
            <SoftTypography style={{ fontSize: '1.2rem', marginInline: '25px', fontWeight: 'bold' }}>
              Top 10 Categories
            </SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ padding: '30px' }}>
            <SoftTypography style={{ fontSize: '1.2rem', marginInline: '25px', fontWeight: 'bold' }}>
              Top 10 Brands
            </SoftTypography>{' '}
          </Card>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DefaultDoughnutChart
            title="Top 10 Sales"
            height="250px"
            chart={{
              labels: topTenSalesName,
              datasets: {
                label: 'Projects',
                backgroundColors: ['info', 'dark', 'error', 'secondary', 'primary'],

                data: topTenSales,
              },
            }}
            options={{
              plugins: {
                legend: {
                  position: 'right',
                },
                datalabels: {
                  color: 'blue',
                  labels: {
                    title: {
                      font: {
                        weight: 'bold',
                      },
                    },
                    value: {
                      color: 'green',
                    },
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}></Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card style={{ padding: '10px' }}>
            <SoftTypography style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Orders by cart value for Current Month
            </SoftTypography>{' '}
            <table class="custom-table">
              <tbody>
                <tr class="header-row">
                  <th rowspan="2">
                    <strong>Break up of Orders by cart value</strong>
                  </th>
                </tr>
                <tr class="header-row">
                  <th>Percentage</th>
                  <th>No of Orders</th>
                  <th>Cart Value (₹)</th>
                </tr>
                {cartValueData.map((ele) => {
                  return (
                    <tr class="content-row" key={ele.id}>
                      <td>{ele.range}</td>
                      <td>{ele.percentage}</td>
                      <td>{ele.numOfOrder}</td>
                      <td>{ele.cartValue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </Grid>
      </Grid>
      <br />
      <CampaignDashboard />
      <br />
      <CouponPerfomance />
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DefaultLineChart
            title="Sales + Profit Trends"
            chart={{
              labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                {
                  label: 'Sales',
                  color: 'info',
                  data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                },
                {
                  label: 'Profit',
                  color: 'dark',
                  data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
                },
                {
                  label: 'profit margin',
                  color: 'primary',
                  data: [40, 80, 70, 90, 30, 90, 140, 130, 200],
                },
              ],
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <VerticalBarChart
            title="Top 10 Products by sales"
            chart={{
              labels: [
                'sweet-corn',
                'Vim bar FW',
                'GD Butter',
                'Mom’s Magic',
                'meera Anti-Dandruff Shampoo',
                'meera HairFall Shampoo',
                'Chikk Egg white',
              ],
              datasets: [
                {
                  label: 'Sales',
                  color: 'blue',
                  data: [1200, 600, 900, 600, 1110, 1300, 1000],
                },
                {
                  label: 'Profit',
                  color: 'green',
                  data: [250, 60, 120, 60, 200, 290, 130],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
      <br />
      <Card style={{ padding: '15px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card style={{ padding: '20px', backgroundColor: '#0562FB' }}>
              <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '400 !important', color: 'white' }}>
                Quarterly Report
              </SoftTypography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ padding: '15px', backgroundColor: '#fcfcfc' }}>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Jan</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Feb</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Mar</SoftTypography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ padding: '15px' }}>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Apr</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>May</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Jun</SoftTypography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ padding: '15px', backgroundColor: '#fcfcfc' }}>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Jul</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Aug</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Sep</SoftTypography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ padding: '15px' }}>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Oct</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Nov</SoftTypography>
              <SoftTypography style={{ fontSize: '0.9rem' }}>Dec</SoftTypography>
            </Card>
          </Grid>
        </Grid>
      </Card>
      <br /> */}
    </DashboardLayout>
  );
};

export default SalesOverViewDashboard;
