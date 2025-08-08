import React, { useEffect, useMemo, useState } from 'react';

import { Card, Container, Grid, Paper, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Counter from './AnimateCounter';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import DefaultDoughnutChart from 'examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import EventIcon from '@mui/icons-material/Event';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';

import { END_DATE, START_DATE } from '../Common/date';
import {
  allPaymentMachines,
  getOverviewDataForPalletPay,
  paymentMethodsData,
  salesLeaderBoard,
  salesReports,
  salesReportsChart,
} from '../../../config/Services';
import { isSmallScreen } from '../Common/CommonFunction';
import CustomGradientLineChart from '../reports/components/CustomGradientLineChart';
import SalesGradientLineChart from '../../dashboard widgets/SalesGradient/salesGradient';
import moment from 'moment';


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const PalletPayDashboard = () => {
  const navigate = useNavigate();

  const contextType = localStorage.getItem('contextType');


  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterGraph, setFilterGraph] = useState('Weekly');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [monthWiseSalesReport, setMonthWiseSalesReport] = useState([]);
  const [salesToggle, setSalesToggle] = useState(true);
  const [salesValues, setSalesValues] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [prevsalesData, setPrevSalesData] = useState([]);
  const [prevsalesValues, setPrevSalesValues] = useState([]);
  const [monthlyLabels, setMonthlyLabels] = useState([]);
  const [palletPayOverviewData, setPalletPayOverviewData] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    if (filterGraph === 'Monthly' || filterGraph === 'MonthlyOrderValue') {
      const payload = {
        startDate: `${year}-${START_DATE}`,
        endDate: `${year + 1}-${END_DATE}`,
        orgId: orgId,
        locationId: locId,
      };
      const prevPayload = {
        startDate: `${year - 1}-${START_DATE}`,
        endDate: `${year}-${END_DATE}`,
        orgId: orgId,
        locationId: locId,
      };

      const months = [
        {
          name: 'January',
          month: 1,
        },
        {
          name: 'February',
          month: 2,
        },
        {
          name: 'March',
          month: 3,
        },
        {
          name: 'April',
          month: 4,
        },
        {
          name: 'May',
          month: 5,
        },
        {
          name: 'June',
          month: 6,
        },
        {
          name: 'July',
          month: 7,
        },
        {
          name: 'August',
          month: 8,
        },
        {
          name: 'September',
          month: 9,
        },
        {
          name: 'October',
          month: 10,
        },
        {
          name: 'November',
          month: 11,
        },
        {
          name: 'December',
          month: 12,
        },
      ];

      const currentMonth = new Date().getMonth();
      const resultdata = Array.from({ length: 6 }, (_, index) => {
        const monthIndex = (currentMonth - index + 12) % 12;
        return {
          name: months[monthIndex].name,
          month: monthIndex + 1,
        };
      }).reverse();
      const labels = Array.from({ length: 6 }, (_, index) => {
        const monthIndex = (currentMonth - index + 12) % 12;
        return months[monthIndex].name.slice(0, 3);
      }).reverse();

      setMonthlyLabels(labels);

      salesReportsChart(payload)
        .then((res) => {
          const matchedSales = [];
          const matchedSalesValue = [];
          resultdata.map((item, index) => {
            const matchedMonth = res?.data?.data?.salesReportOverTime?.salesReportOverMonthWiseList.find(
              (monthItem) => monthItem.month === item.month,
            );
            if (matchedMonth) {
              matchedSales[index] = matchedMonth.sales;
              matchedSalesValue[index] = matchedMonth.salesValue;
            } else {
              matchedSales[index] = 0;
              matchedSalesValue[index] = 0;
            }
          });

          setSalesData(matchedSales);
          setSalesValues(matchedSalesValue);
        })
        .catch((err) => {});
    }
  }, [filterGraph]);

  const currentDate = new Date();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  const formattedDate = currentDate.toLocaleString('en-US', options);

  const onSettings = () => {
    navigate('/pallet-pay/settings');
  };

  const handleActiveMachine = () => {
    navigate('/pallet-pay/paymentmachine');
  };
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [activeCount, SetActiveCount] = useState(0);
  const [data, setData] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ['No Data Available'],
    datasets: {
      label: 'Projects',
      backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
      data: [1],
    },
  });
  const [salesLeaderBoardData, setSalesLeaderBoard] = useState();

  useEffect(() => {
    const payload = {
      orgId: orgId,
      locId: locId,
    };
    allPaymentMachines(payload)
      .then((res) => {
        if (res?.data?.data?.data.machineId !== null) {
          const data = res?.data?.data?.data?.filter((obj) => obj.status === 'ACTIVE')?.length;
          SetActiveCount(data);
        }
      })
      .catch((err) => {});

    const payloadSales = {
      days: 60,
      orgId: orgId,
      locationId: locId,
    };

    salesReports(payloadSales)
      .then((res) => {
        setData(Math.round(res?.data?.data?.salesReportOverTime?.salesOverTimeValue));
      })
      .catch((err) => {});
  }, []);

  const handleStartDate = (date) => {
    // console.log('startDate: ' + date);
    const time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(time).toDate();
    const start = moment(stillUtc).local().format('YYYY-MM-DD');
    // console.log('startDate', start);
    setStartDate(start);
  };

  const handleEndDate = (date) => {
    const time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(time).toDate();
    const end = moment(stillUtc).local().format('YYYY-MM-DD');
    // console.log('endDate', end);
    setEndDate(end);
  };

  // const fetchSalesMonthwiseReport = async () => {
  //   const initialDate = '2023-01-01';
  //   const currentEndDate = moment(new Date()).format('YYYY-MM-DD');

  //   const payload = {
  //     startDate: startDate == null ? initialDate : startDate,
  //     endDate: endDate == null ? currentEndDate : endDate,
  //     orgId: orgId,
  //     locId: locId,
  //   };

  //   const months = [
  //     {
  //       name: 'January',
  //       month: 1,
  //     },
  //     {
  //       name: 'February',
  //       month: 2,
  //     },
  //     {
  //       name: 'March',
  //       month: 3,
  //     },
  //     {
  //       name: 'April',
  //       month: 4,
  //     },
  //     {
  //       name: 'May',
  //       month: 5,
  //     },
  //     {
  //       name: 'June',
  //       month: 6,
  //     },
  //     {
  //       name: 'July',
  //       month: 7,
  //     },
  //     {
  //       name: 'August',
  //       month: 8,
  //     },
  //     {
  //       name: 'September',
  //       month: 9,
  //     },
  //     {
  //       name: 'October',
  //       month: 10,
  //     },
  //     {
  //       name: 'November',
  //       month: 11,
  //     },
  //     {
  //       name: 'December',
  //       month: 12,
  //     },
  //   ];

  //   try {
  //     const response = await salesReportsChart(payload);
  //     console.log('responseForSalesReport', response);
  //     const result = response.data.data.salesReportOverTime.salesReportOverMonthWiseList;

  //     const filteredMonths = months.filter(
  //       (item) => item.month >= result[0].month && item.month <= result[result.length - 1].month,
  //     );
  //     // console.log("filteredMonths",filteredMonths)
  //     // console.log('finalData', result);

  //     const totalMonths = filteredMonths.map((item) => item.name);
  //     const salesData = result.map((item) => item.salesValue);

  //     const chartData = {
  //       labels: totalMonths,
  //       datasets: [
  //         {
  //           label: 'Sales Overview',
  //           color: 'info',
  //           data: salesData,
  //         },
  //       ],
  //     };
  //     setMonthWiseSalesReport(chartData);
  //     // console.log('chartData', chartData);
  //   } catch (e) {}
  // };

  // useEffect(() => {
  //   fetchSalesMonthwiseReport();
  // }, [startDate, endDate]);

  const handleTotalTransaction = () => {
    // console.log('transaction');
    navigate('/pallet-pay/transaction');
  };
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const payload = {
      startDate: currDate,
      endDate: currDate,
      orgId: orgId,
      locationId: locId,

      frequency: 'day',
    };
    salesLeaderBoard(payload)
      .then((res) => {
        setSalesLeaderBoard(res?.data?.data?.leaderBoard);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 7);
    const prevYear = previousDate.getFullYear();
    const prevMonth = (previousDate.getMonth() + 1).toString().padStart(2, '0');
    const prevDay = previousDate.getDate().toString().padStart(2, '0');
    const formattedPrevDate = `${prevYear}-${prevMonth}-${prevDay}`;
    const payload = {
      startDate: currDate,
      endDate: currDate,
      orgId: orgId,
      locationId: locId,
    };

    paymentMethodsData(payload)
      .then((res) => {
        if (
          res?.data?.data?.es === 0 &&
          res?.data?.data?.salesData !== undefined &&
          res?.data?.data?.orderResponseModel === undefined
        ) {
          const cardValue = res?.data?.data?.salesData?.cardOrders || 0;
          const cardOrderValue = res?.data?.data?.salesData?.cardOrdersValue || 0;
          const upiValue = res?.data?.data?.salesData?.upiOrders || 0;
          const upiOrderValue = res?.data?.data?.salesData?.upiOrdersValue || 0;
          const cashValue = res?.data?.data?.salesData?.cashOrders || 0;
          const cashOrderValue = res?.data?.data?.salesData?.cashOrdersValue || 0;
          setChartData({
            labels: ['UPI', 'Card'],

            datasets: {
              label: 'Projects',
              backgroundColors: ['darkblue', 'blue', 'green'],
              data: [upiValue, cardValue],
            },
          });
        }
      })
      .catch((err) => {});
  }, []);

  const fetchOverviewDataForPalletPay = async () => {
    const payload = {
      organizationId: orgId,
      locationId: locId,
    };
    try {
      const response = await getOverviewDataForPalletPay(payload);
      // console.log("respPallet",response)
      const result = response.data.data.data;
      // console.log('result', result);
      setPalletPayOverviewData(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOverviewDataForPalletPay();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (open) {
      setOpen(false);
    } else if (event.currentTarget) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const onExport = async (e) => {
    setFilterGraph(e);
    return;
  };

  const SaleschartData = useMemo(
    () => [
      {
        labels: monthlyLabels,
        label: 'This month',
        color: 'dark',
        data: filterGraph === 'MonthlyOrderValue' ? salesValues : salesData,
      },
    ],
    [salesValues, salesData],
  );
  const isMobileDevice = isSmallScreen();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container>
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftBox style={{ display: 'flex' }}>
            <SoftTypography
              style={{
                fontSize: '1.2rem',
                fontWeight: '500',
                fontFamily: 'Arial, Roboto, \'Open Sans\', Lato, Montserrat, sans-serif',
              }}
            >
              {formattedDate}
            </SoftTypography>
          </SoftBox>

          <SoftBox onClick={onSettings}>
            <SettingsIcon fontSize="medium" />
          </SoftBox>
        </SoftBox>

        <Grid container spacing={2} justifyContent="space-evenly" style={{ margin: '20px', marginLeft: '-20px' }}>
          <Grid item xs={12} sm={6} md={4} lg={3} onClick={handleActiveMachine}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px',
              }}
            >
              {/* <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              /> */}
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Active Payment machines
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                {/* <Counter value={activeCount} /> */}
                {palletPayOverviewData !== null && palletPayOverviewData.activePaymentMachine !== null
                  ? palletPayOverviewData.activePaymentMachine
                  : 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px', // Adjust the value as needed
              }}
            >
              {/* <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              /> */}
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Total Sales
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                {/* $73,248 */}
                ₹ <Counter value={data || 0} />
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px', // Adjust the value as needed
              }}
            >
              {/* <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              /> */}
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Transaction Charges
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                ₹
                {palletPayOverviewData !== null && palletPayOverviewData.transactionCharges !== null
                  ? palletPayOverviewData.transactionCharges.toFixed(2)
                  : 0}
                {/* ₹ <Counter value={23.11} /> */}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px', // Adjust the value as needed
              }}
            >
              {/* <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              /> */}
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Estimated Settlement
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                {/* ₹ <Counter value={34143.46} /> */}₹
                {palletPayOverviewData !== null && palletPayOverviewData.estimatedSettlement !== null
                  ? palletPayOverviewData.estimatedSettlement.toFixed(2)
                  : 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '5px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={handleTotalTransaction}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Total Transaction</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                {' '}
                {palletPayOverviewData !== null && palletPayOverviewData.totalTransaction !== null
                  ? palletPayOverviewData.totalTransaction
                  : 0}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Payment Success Rate</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                {' '}
                {palletPayOverviewData !== null && palletPayOverviewData.paymentSuccessRate !== null
                  ? palletPayOverviewData.paymentSuccessRate
                  : 0}{' '}
                %
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Failed Payments</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                {' '}
                {palletPayOverviewData !== null && palletPayOverviewData.failedPayments !== null
                  ? palletPayOverviewData.failedPayments
                  : 0}
              </div>
            </Paper>
          </Grid>

          {/* <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Refunds</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>NA</div>
            </Paper>
          </Grid> */}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
            <DefaultDoughnutChart
              title="Payment Methods"
              height="305px"
              chart={chartData}
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </Grid>

          {/* <Grid item xs={12} lg={7}>
            <GradientLineChart
              title=" Overview"
              description={
                <>
                  <SoftBox
                    className="date-filters"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.8rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <SoftBox className="start-date">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={['year', 'month', 'day']}
                          label="Start Date"
                          value={startDate}
                          onChange={(date) => {
                            handleStartDate(date.$d);
                          }}
                          sx={{
                            width: '100%',
                            '& .MuiInputLabel-formControl': {
                              fontSize: '0.8rem',
                              top: '-0.4rem',
                              color: '#344767',
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </SoftBox>
                    <SoftBox className="end-date">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={['year', 'month', 'day']}
                          label="End Date"
                          value={endDate}
                          onChange={(date) => {
                            handleEndDate(date.$d);
                          }}
                          sx={{
                            width: '100%',
                            '& .MuiInputLabel-formControl': {
                              fontSize: '0.8rem',
                              top: '-0.4rem',
                              color: '#344767',
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </SoftBox>
                  </SoftBox>

                  <SoftBox sx={{ position: 'absolute', top: 13, right: 10, flex: 1, zIndex: 10 }}>
                    <div>
                      <SoftBox
                        style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}
                        onClick={handleClick}
                      >
                        <FilterAltIcon />
                        <SoftTypography style={{ fontSize: '0.85rem' }}>Filter</SoftTypography>
                      </SoftBox>
                      <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                          'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={() => {
                            // SetexportValue("pdf");
                            handleClose();
                            onExport('Weekly');
                          }}
                          disableRipple
                        >
                          <EventIcon />
                          Weekly Orders
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            // SetexportValue("excel");
                            handleClose();
                            onExport('Monthly');
                          }}
                          disableRipple
                        >
                          <EventIcon />
                          Monthly Orders
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            // SetexportValue("excel");
                            handleClose();
                            onExport('WeeklyOrderValue');
                          }}
                          disableRipple
                        >
                          <EventIcon />
                          Weekly Order Value
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            // SetexportValue("excel");
                            handleClose();
                            onExport('MonthlyOrderValue');
                          }}
                          disableRipple
                        >
                          <EventIcon />
                          Monthly Order Value
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            onExport('ProfitTrend');
                          }}
                          disableRipple
                        >
                          <EventIcon />
                          Profit Trend
                        </MenuItem>
                      </StyledMenu>
                    </div>
                  </SoftBox>

                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={'15px'} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon sx={{}}>arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      4% more{' '}
                      <SoftTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                </>
              }
              // chart={gradientLineChartData}
              chart={monthWiseSalesReport}
            />
          </Grid> */}

          <Grid item xs={12} lg={7}>
            <SoftBox sx={{ padding: isMobileDevice && '10px' }}>
              <Card className={`${isMobileDevice && 'po-box-shadow'}`}>
                {/* <SoftBox sx={{ position: 'absolute', top: 16, left:150 ,flex: 1, zIndex: 10 }}>
              <SoftTypography variant="caption" fontWeight="medium" ml={1} mr={1}>
                            {salesToggle ? 'Hourly' : 'Weekly'}
                          </SoftTypography>
                          <Switch checked={salesToggle} onChange={() => setSalesToggle(!salesToggle)} />
              </SoftBox> */}

                <SoftBox sx={{ position: 'absolute', top: 13, right: 10, flex: 1, zIndex: 10 }}>
                  <div>
                    <SoftBox style={{ display: 'flex' }} onClick={handleClick}>
                      {/* <img
                  src="https://i.ibb.co/ssTSJ9x/move-layer-down.jpg"
                  alt=""
                  style={{ width: '17px', height: '17px' }}
                /> */}
                      <FilterAltIcon />
                      <SoftTypography style={{ fontSize: '0.85rem', marginInline: '10px' }}>Filter</SoftTypography>
                    </SoftBox>
                    <StyledMenu
                      id="demo-customized-menu"
                      MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      {/* <MenuItem
                        onClick={() => {
                          // SetexportValue("csv");
                          handleClose();
                          onExport('Hourly');
                        }}
                        disableRipple
                      >
                        <EventIcon />
                        Hourly
                      </MenuItem> */}
                      <MenuItem
                        onClick={() => {
                          // SetexportValue("pdf");
                          handleClose();
                          onExport('Weekly');
                        }}
                        disableRipple
                      >
                        <EventIcon />
                        Weekly Orders
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          // SetexportValue("excel");
                          handleClose();
                          onExport('Monthly');
                        }}
                        disableRipple
                      >
                        <EventIcon />
                        Monthly Orders
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          // SetexportValue("excel");
                          handleClose();
                          onExport('WeeklyOrderValue');
                        }}
                        disableRipple
                      >
                        <EventIcon />
                        Weekly Order Value
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          // SetexportValue("excel");
                          handleClose();
                          onExport('MonthlyOrderValue');
                        }}
                        disableRipple
                      >
                        <EventIcon />
                        Monthly Order Value
                      </MenuItem>
                    </StyledMenu>
                  </div>
                </SoftBox>
                {/* {filterGraph === 'Hourly' ? (
                  <SoftBox>
                    <VerticalBarChart
                      title="Sales Overview"
                      chart={{
                        labels: [
                          '7:00 AM',
                          '8:00 AM',
                          '9:00 AM',
                          '10:00 AM',
                          '11:00 AM',
                          '12:00 PM',
                          '1:00 PM',
                          '2:00 PM',
                          '3:00 PM',
                          '4:00 PM',
                          '5:00 PM',
                          '6:00 PM',
                          '7:00 PM',
                          '8:00 PM',
                          '9:00 PM',
                          '10:00 PM',
                        ],
                        datasets: [
                          {
                            label: 'Sales',
                            color: 'dark',
                            data: [30, 40, 290, 340, 200, 320, 380, 300, 350, 420, 450, 400, 390, 250, 180, 90],
                          },
                        ],
                      }}
                    />
                  </SoftBox>
                ) : null} */}

                {(filterGraph === 'Weekly' || filterGraph === 'WeeklyOrderValue') && (
                  <SalesGradientLineChart
                    title="Sales Overview"
                    orgId={orgId}
                    salesToggle={salesToggle}
                    filterGraph={filterGraph}
                    description={<SoftBox display="flex" alignItems="center"></SoftBox>}
                  />
                )}
                {(filterGraph === 'Monthly' || filterGraph === 'MonthlyOrderValue') && (
                  <SoftBox>
                    <SoftTypography style={{ fontSize: '0.95rem', margin: '15px', marginBottom: '-2px' }}>
                      Sales Overview
                    </SoftTypography>
                    <CustomGradientLineChart chartData={SaleschartData} />
                  </SoftBox>
                )}
              </Card>
            </SoftBox>
          </Grid>
        </Grid>
        <br />
      </Container>
    </DashboardLayout>
  );
};

export default PalletPayDashboard;
