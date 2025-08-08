/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React example components
import Footer from 'examples/Footer';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
// import PieChart from "examples/Charts/PieChart";
import EnvConfig from 'config/EnvConfig';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Soft UI Dashboard PRO React base styles
import breakpoints from 'assets/theme/base/breakpoints';
import typography from 'assets/theme/base/typography';

// Data
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BottomNavigation, BottomNavigationAction, Stack, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import { alpha, styled } from '@mui/material/styles';
import { SplideSlide } from '@splidejs/react-splide';
import { useCookies } from 'react-cookie';
import BGImage from '../../../assets/images/dashboard-bg.png';
import BottomNavbar from '../../../examples/Navbars/BottomNavbarMob';
import MobileNavbar from '../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import usePullToRefresh from '../../../hooks/usePulltoRefresh';
import CartMetrics from '../../dashboard widgets/Cart Metrics/CartMetrics';
import CouponDiscountMiniStatisticsCard from '../../dashboard widgets/coupon/totalDiscountValue';
import CustomerMiniStatisticsCard from '../../dashboard widgets/Customers/totalCustomer';
import ReconcillationMiniStatisticsCard from '../../dashboard widgets/GST Reconcillation/gstReconcillation';
import PopularProducts from '../../dashboard widgets/PopularProduct/popularProduct';
import SlowMovingInventory from '../../dashboard widgets/PopularProduct/slowMovingInventory';
import AverageCartValue from '../../dashboard widgets/Sales/AverageCartValue';
import FillDashboardLayout from '../../dashboard widgets/Sales/FillDashboardLayout';
import SalesDashboardCard from '../../dashboard widgets/Sales/SalesDashboardCard';
import ProfitsMiniStatisticsCard from '../../dashboard widgets/Sales/totalProfits';
import StockOverviewValue from '../../dashboard widgets/StockOverview/StockOverviewValue';
import VendorMiniStatisticsCard from '../../dashboard widgets/Vendor/totalVendor';
import Chatbot from '../../ecommerce/apps-integration/Notification/Chats/Chatbot';
import { calculatePercentage, isSmallScreen } from '../../ecommerce/Common/CommonFunction';
import {
  createCommsOrg,
  dashboardProfitDetails,
  expressGrnMetricData,
  getAllIntrusionsData,
  getDashboardSalesValues,
  getOrderMetricsOperatorEffective,
  getTotalPuchase,
} from './../../../config/Services';
import SplideCommon from './components/common-tabs-carasoul';
import './dash.css';
import reportsBarChartData from './data/reportsBarChartData';
// import PaymentChannelWidget from '../../ecommerce/apps-integration/SalesOverView/PaymentChannelWidget';
// import SalesOverViewWidget from '../../ecommerce/apps-integration/SalesOverView/SalesOverViewWidget';

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

function Default() {
  const {
    isRefreshing,
    isLoading,
    loadingIndicator,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    loaderDependency,
  } = usePullToRefresh();
  const showSplitData = localStorage.getItem('Apps');

  const envSignupUrl = EnvConfig().signupUrl;
  const { values } = breakpoints;
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [progress, setProgress] = useState(16.66);
  const at = localStorage.getItem('access_token');
  const locId = localStorage.getItem('locId');
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const locName = localStorage.getItem('locName');
  const user_roles = localStorage.getItem('user_roles');
  const [isSuperAdmin, setIsSuperSdmin] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [currPathname, setCurrPathname] = useState('');
  const location = useLocation();
  const [salesToggle, setSalesToggle] = useState(false);
  const [monthlySales, setMonthlySales] = useState(false);
  const [filterGraph, setFilterGraph] = useState('Weekly');
  const [filterGraphPayment, setFilterGraphPayment] = useState('Weekly');
  const orgId = localStorage.getItem('orgId');
  const gstCollected = localStorage.getItem('gstCollected') || '0';
  const inputCredit = localStorage.getItem('inputCredit') || '0';
  const usereName = localStorage.getItem('user_name');
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPayment, setAnchorElPayment] = useState(null);
  const [Allmonths, SetAllMonths] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [prevsalesData, setPrevSalesData] = useState([]);
  const [prevsalesValues, setPrevSalesValues] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ['No Data Available'],
    datasets: {
      label: 'Projects',
      backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
      data: [1],
    },
  });
  const [salesdashboardData, setSalesdashboardData] = useState({});
  const [storeDashboardData, setStoreDashboardData] = useState({});
  const [appDashboardData, setAppDashboardData] = useState({});
  const [purchaseDashboardData, setPurchaseDashboardData] = useState({});
  const [profitData, setProfitData] = useState({});
  const [loyaltyRedeemPoints, setLoyltyRedeemPoints] = useState('NA');
  const [widgetUpdate, setWidgetUpdate] = useState(false);
  const [selectedWidgets, setselectedWidgets] = useState([
    "Today's Sale",
    'Monthly Sale',
    'Yearly Sale',
    "Today's Purchase",
    'Monthly Purchase',
    'Yearly Purchase',
    'Profits',
    'New Customers',
    'New Vendor',
    'Coupon Discount',
    'StockOverView',
    'GST',
    'Order Metrics',
    'Cart Metrics',
    'GRN Metrics',
  ]);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [showKYC, setShowKYC] = useState(true);
  const [cookies, setCookie] = useCookies(['user']);

  const fetchClientId = () => {
    const orgId = localStorage.getItem('orgId');
    const username = localStorage.getItem('user_name');
    const emailCc = localStorage.getItem('user_details');
    const obj = JSON.parse(emailCc);
    const orgType = localStorage.getItem('contextType');

    const payload = {
      orgRefId: orgId,
      orgName: orgId,
      orgType: orgType,
      orgPhoneNo: '',
      orgEmail: obj?.email,
      orgWhatsappNo: '',
      tenantId: obj?.tennatId,
      tenantType: '',
      workingHours: '',
      timeZone: '',
      createdBy: '',
      smsLimit: '10000',
      emailLimit: '20000',
      whatsappLimit: '30000',
    };
    const fetchData = async () => {
      try {
        createCommsOrg(payload).then((res) => {
          setClientId(res?.data?.data?.nmsConfigEntity?.clientId);
          setClientName(res?.data?.data?.nmsConfigEntity?.clientName);
        });
      } catch (error) {}
    };
    fetchData();
  };

  useEffect(() => {
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('clientName', clientName);
  }, [clientId, clientName]);

  // Load data from local storage on component mount
  useEffect(() => {
    const storedWidgets = JSON.parse(localStorage.getItem('selectedWidgets'));
    if (storedWidgets) {
      setselectedWidgets(storedWidgets);
    }
    if (isSuperAdmin) {
      fetchClientId();
      // getLoyalityRedeemValue()
    }
  }, [isSuperAdmin]);

  const [monthlyLabels, setMonthlyLabels] = useState([]);
  const onExport = async (e) => {
    setFilterGraph(e);
    return;
  };
  const onExportPayment = async (e) => {
    setFilterGraphPayment(e);
    return;
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (open) {
      setOpen(false);
    } else if (event.currentTarget) {
      setOpen(true);
    }
  };
  const handleClickPayment = (event) => {
    setAnchorElPayment(event.currentTarget);
    if (open) {
      setOpenPayment(false);
    } else if (event.currentTarget) {
      setOpenPayment(true);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  const handleClosePayment = () => {
    setAnchorElPayment(null);
    setOpenPayment(false);
  };

  useEffect(() => {
    setCurrPathname(location.pathname);
  }, []);

  useEffect(() => {
    if (user_roles?.includes('SUPER_ADMIN')) {
      setIsSuperSdmin(true);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const payload = {
      startDate: formatDate(today),
      endDate: formatDate(today),
      orgId: orgId,
      locationId: locId,
    };
    if (isSuperAdmin) {
      getDashboardSalesValues(payload)
        .then((res) => {
          setSalesdashboardData(res?.data?.data?.salesData || {});
        })
        .catch(() => {});
      dashboardProfitDetails(payload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            setProfitData(res?.data?.data?.profitData);
          } else {
            setProfitData({});
          }
        })
        .catch((err) => {});
    }
  }, [isSuperAdmin, loaderDependency]);

  const getStoreSalesData = (orderType) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const payload = {
      startDate: formatDate(today),
      endDate: formatDate(today),
      orgId: orgId,
      locationId: locId,
      orderType: orderType,
    };
    if (isSuperAdmin) {
      getDashboardSalesValues(payload)
        .then((res) => {
          if (orderType === 'POS_ORDER') {
            setStoreDashboardData(res?.data?.data?.salesData || {});
          } else if (orderType === 'B2C_ORDER') {
            setAppDashboardData(res?.data?.data?.salesData || {});
          }
        })
        .catch(() => {});
    }
  };
  useEffect(() => {
    if (showSplitData?.includes('Mobile App')) {
      getStoreSalesData('POS_ORDER');
      getStoreSalesData('B2C_ORDER');
    }
  }, [isSuperAdmin, loaderDependency, showSplitData]);

  useEffect(() => {
    !!orgId && totalPurchased();
  }, [orgId, isSuperAdmin, loaderDependency]);
  const totalPurchased = () => {
    const currMonth = new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const currYear = new Date().getFullYear().toString();
    const payload = {
      orgId: orgId,
      month: currMonth,
      year: currYear,
    };
    if (locId) {
      payload.orgLocId = locId;
    }
    if (isSuperAdmin) {
      getTotalPuchase(payload)
        .then((res) => {
          if (res?.data?.data?.es == '0') {
            setPurchaseDashboardData(res?.data?.data);
          }
        })
        .catch((err) => {
          // Write code for error messages if any
        });
    }
  };

  const filterOptions = [
    "Today's Sale",
    'Monthly Sale',
    'Yearly Sale',
    "Today's Purchase",
    'Monthly Purchase',
    'Yearly Purchase',
    'GST',
    'Profits',
    'New Customers',
    'New Vendor',
    'Coupon Discount',
  ];

  const handleBadgeClick = (widgetName) => {
    const filterData = selectedWidgets.filter((item) => item !== widgetName);
    setselectedWidgets(filterData);
  };

  const SaleschartData = useMemo(
    () => [
      {
        labels: monthlyLabels,
        label: 'Sales',
        color: 'dark',
        data: filterGraph === 'MonthlyOrderValue' ? salesValues : salesData,
      },
      {
        labels: monthlyLabels,
        label: 'prev data',
        color: 'warning',
        data: filterGraph === 'MonthlyOrderValue' ? prevsalesValues : prevsalesData,
      },
    ],
    [salesValues, salesData, prevsalesData, prevsalesValues],
  );

  const [orderData, setOrderData] = useState([]);
  const [allMetricsData, setAllMetricsData] = useState();
  const [grnMetricsData, setGrnMetricsData] = useState();
  const getData = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const payload = {
      locationId: locId,
      uidx: null,
      eventType: null,
      orgId: orgId,
      startDate: currDate,
    };

    try {
      getAllIntrusionsData(payload).then((res) => {
        if (res?.data?.message === 'Success') {
          setOrderData(res?.data?.count);
        } else if (res?.data?.message === 'No data found!') {
          setOrderData([]);
        }
      });
    } catch (error) {}
  };

  const getOrderMetricsData = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const payload = {
      organizationId: orgId,
      locationId: locId,
      uidx: null,
      startDate: currDate,
    };
    try {
      getOrderMetricsOperatorEffective(payload).then((res) => {
        if (res?.data?.message === 'Success') {
          setAllMetricsData(res?.data?.orderMetrics);
        } else if (res?.data?.message === 'No data found!') {
          setAllMetricsData();
        }
      });
    } catch (error) {
      showSnackbar('Cannot fetch data', 'error');
    }
  };

  const grnMetricData = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const payload = {
      organizationId: orgId,
      locationId: locId,
      uidx: null,
      startDate: currDate,
    };
    try {
      expressGrnMetricData(payload).then((res) => {
        if (res?.data?.message === 'Success') {
          setGrnMetricsData(res?.data?.epoMetrics);
        } else if (res?.data?.message === 'No data found!') {
          setGrnMetricsData();
        }
      });
    } catch (error) {
      showSnackbar('Cannot fetch data', 'error');
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      getData();
      getOrderMetricsData();
      grnMetricData();
    }
  }, [isSuperAdmin, loaderDependency]);

  const fetchEventCount = (eventType) => {
    const eventData = orderData?.find((data) => data.eventType === eventType);
    return eventData ? eventData.eventCount : 'NA';
  };

  //mobile functionality

  return (
    <DashboardLayout isDashBoard={true} isMobileDevice={isMobileDevice ? true : false}>
      <SoftBox>
        {chatBotOpen && (
          <SoftBox className="chatbot-box">
            <Chatbot chatBotOpen={chatBotOpen} />
          </SoftBox>
        )}
        {!isMobileDevice && <DashboardNavbar widgetSelection={true} />}
        <SoftBox py={isMobileDevice ? 0 : 3}>
          <Grid container>
            {!isMobileDevice && (
              <SoftBox
                mb={3}
                p={1}
                sx={{
                  width: '100% !important',
                  zIndex: '10',
                }}
              >
                <div>
                  <SoftTypography
                    // className="text-h1"
                    variant={window.innerWidth < '450' ? 'h6' : window.innerWidth < values.sm ? 'h4' : 'h3'}
                    // textTransform="capitalize"
                    fontWeight="medium"
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                      fontFamily: 'system-ui',
                      // textAlign: 'center',
                    }}
                  >
                    <span style={{ color: '#3b3c52', marginBottom: '0', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                      Welcome back ,
                    </span>
                    {/* <span role="img" aria-label="Waving Hand">
                👋
              </span>{' '} */}
                    <span style={{ color: '#3b3c52', marginBottom: '0', whiteSpace: 'nowrap' }}>{usereName + ' '}</span>{' '}
                    &nbsp;
                  </SoftTypography>
                </div>
              </SoftBox>
            )}
            {/* {isMobileDevice && (
              <SoftBox className="dashboard-main-div">
                <img className="dash-img" src={BGImage} alt="" />
                <SoftBox sx={{ width: '100% !important', zIndex: '4' }}>
                  <Stack
                    className="menu-hover-mob"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100% !important"
                    sx={{ zIndex: '3' }}
                  >
                    <MobileNavbar title={locName} />
                  </Stack>
                </SoftBox>
                <SoftBox>
                  <Stack justifyContent="flex-start" alignItems="flex-start">
                    <Typography fontSize="15px" mb="-10px" className="dash-typo">
                      Welcome Back,
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="flex-start" alignItems="center" gap="5px">
                    <Typography fontSize="26px" fontWeight={700} className="dash-typo" mb="-5px">
                      {usereName}
                    </Typography>
                  </Stack>
                </SoftBox>
              </SoftBox>
            )} */}

            {!isMobileDevice && isSuperAdmin && (
              <Grid item xs={12} lg={11}>
                {/* new dashboard */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">Sales Overview</SoftTypography>
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes("Today's Sale") && (
                      <SoftBox mb={3} style={{ width: '100%' }}>
                        <SalesDashboardCard
                          title={{ text: "Today's Sales", fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={salesdashboardData?.todaySales}
                          orders={salesdashboardData?.todayOrders}
                          icon={{ component: <CurrencyRupeeIcon /> }}
                          orgId={orgId}
                          type={"Today's"}
                          valueSplit={storeDashboardData?.todaySales}
                          ordersSplit={storeDashboardData?.todayOrders}
                          appValueSplit={appDashboardData?.todaySales}
                          appOrdersSplit={appDashboardData?.todayOrders}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Monthly Sale') && (
                      <SoftBox mb={3}>
                        <SalesDashboardCard
                          title={{ text: 'Monthly sales', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={salesdashboardData?.currentMonthSales}
                          orders={salesdashboardData?.currentMonthOrders}
                          icon={{ component: <CurrencyRupeeIcon /> }}
                          orgId={orgId}
                          type={'Monthly'}
                          valueSplit={storeDashboardData?.currentMonthSales}
                          ordersSplit={storeDashboardData?.currentMonthOrders}
                          appValueSplit={appDashboardData?.currentMonthSales}
                          appOrdersSplit={appDashboardData?.currentMonthOrders}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Yearly Sale') && (
                      <SoftBox mb={3}>
                        <SalesDashboardCard
                          title={{ text: 'Yearly sales', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={salesdashboardData?.currentYearSales}
                          orders={salesdashboardData?.currentYearOrders}
                          icon={{ component: <CurrencyRupeeIcon /> }}
                          orgId={orgId}
                          type={'Yearly'}
                          valueSplit={storeDashboardData?.currentYearSales}
                          ordersSplit={storeDashboardData?.currentYearOrders}
                          appValueSplit={appDashboardData?.currentYearSales}
                          appOrdersSplit={appDashboardData?.currentYearOrders}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  {/* line 2 */}
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('StockOverView') && (
                      <SoftBox mb={3}>
                        {/* Average Cart Value */}
                        <AverageCartValue
                          title={{ text: 'Average Cart Value', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          value={salesdashboardData?.currentMonthSales}
                          orders={salesdashboardData?.currentMonthOrders}
                          loaderDependency={loaderDependency}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <SoftBox mb={3}>
                      <FillDashboardLayout
                        title={{ text: 'Refunds', fontWeight: 'bold' }}
                        icon={{ color: 'info', component: 'LocalAtmIcon' }}
                        orgId={orgId}
                      />
                    </SoftBox>
                  </Grid>

                  <Grid item xs={4}>
                    {selectedWidgets?.includes('New Customers') && (
                      <SoftBox mb={3}>
                        <CustomerMiniStatisticsCard
                          title={{ text: 'New customers ', fontWeight: 'bold' }}
                          count=""
                          percentage={{ color: 'success', text: '+3%' }}
                          icon={{ color: 'info', component: 'person_add' }}
                          orgId={orgId}
                        />
                      </SoftBox>
                    )}
                  </Grid>

                  {/* purchase overview */}
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">Purchase Overview</SoftTypography>
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes("Today's Purchase") && (
                      <SoftBox mb={3}>
                        <SalesDashboardCard
                          title={{ text: "Today's purchase", fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={purchaseDashboardData?.currentDayPurchaseValue}
                          orders={purchaseDashboardData?.currentDayPurchaseCount}
                          icon={{ component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Monthly Purchase') && (
                      <SoftBox mb={3}>
                        {/* Monthly PURCHASE */}
                        <SalesDashboardCard
                          title={{ text: 'Monthly purchase', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={purchaseDashboardData?.totalPurchase}
                          orders={purchaseDashboardData?.monthlyPurchaseCount}
                          icon={{ component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Yearly Purchase') && (
                      <SoftBox mb={3}>
                        {/* TOTAL Yearly PURCHASE */}

                        <SalesDashboardCard
                          title={{ text: 'Yearly purchase', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={purchaseDashboardData?.yearlyPurchaseValue}
                          orders={purchaseDashboardData?.yearlyPurchaseCount}
                          icon={{ component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  {/* line 2 */}

                  <SplideCommon tables={true}>
                    <SplideSlide>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        {' '}
                        <Grid item xs={4}>
                          {selectedWidgets?.includes('New Vendor') && (
                            <SoftBox mb={3}>
                              {/* TOTAL VENDOR */}
                              <VendorMiniStatisticsCard
                                title={{ text: 'New vendors', fontWeight: 'bold' }}
                                percentage={{ color: 'error', text: '-3%' }}
                                icon={{ color: 'info', component: 'diversity_3' }}
                                orgId={orgId}
                              />
                            </SoftBox>
                          )}
                        </Grid>
                        <Grid item xs={4}>
                          <SoftBox mb={3}>
                            <FillDashboardLayout
                              title={{ text: 'Purchase Requests', fontWeight: 'bold' }}
                              icon={{ color: 'info', component: 'LocalAtmIcon' }}
                              orgId={orgId}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid item xs={4}>
                          <SoftBox mb={3}>
                            <FillDashboardLayout
                              title={{ text: 'Purchase Returns', fontWeight: 'bold' }}
                              icon={{ color: 'info', component: 'LocalAtmIcon' }}
                              orgId={orgId}
                            />
                          </SoftBox>
                        </Grid>
                      </div>
                    </SplideSlide>
                    <SplideSlide>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        {' '}
                        <Grid item xs={4}>
                          <SoftBox mb={3}>
                            <FillDashboardLayout
                              title={{ text: 'Outstanding Payments', fontWeight: 'bold' }}
                              icon={{ color: 'info', component: 'LocalAtmIcon' }}
                              orgId={orgId}
                              purchaseDashboardData={purchaseDashboardData}
                            />
                          </SoftBox>
                        </Grid>
                      </div>{' '}
                    </SplideSlide>
                  </SplideCommon>
                  {/* inventory overview */}
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">Inventory Overview</SoftTypography>
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('StockOverView') && (
                      <SoftBox mb={3}>
                        {/* Stock Overview */}
                        <StockOverviewValue
                          title={{ text: 'Stock Value', fontWeight: 'bold' }}
                          percentage={{ color: 'error', text: '-3%' }}
                          icon={{ color: 'info', component: 'diversity_3' }}
                          orgId={orgId}
                        />
                        {/* <StockOverViewData /> */}
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <SoftBox mb={3}>
                      <FillDashboardLayout
                        title={{ text: 'Product Expiry', fontWeight: 'bold' }}
                        icon={{ color: 'info', component: 'LocalAtmIcon' }}
                        orgId={orgId}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={4}>
                    <SoftBox mb={3}>
                      <FillDashboardLayout
                        title={{ text: 'Stock Updates', fontWeight: 'bold' }}
                        icon={{ color: 'info', component: 'LocalAtmIcon' }}
                        orgId={orgId}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12}></Grid>
                  {/* profit and loss */}
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">Profit & Loss</SoftTypography>
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Profits') && (
                      <SoftBox mb={3}>
                        {/* Monthly Profits */}
                        <ProfitsMiniStatisticsCard
                          title={{ text: "Today's Profits", fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          profitData={profitData}
                        />
                      </SoftBox>
                    )}
                  </Grid>

                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Profits') && (
                      <SoftBox mb={3}>
                        {/* Monthly Profits */}
                        <ProfitsMiniStatisticsCard
                          title={{ text: 'Monthly Profits', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          profitData={profitData}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Profits') && (
                      <SoftBox mb={3}>
                        {/* yearly Profits */}
                        <ProfitsMiniStatisticsCard
                          title={{ text: 'Yearly Profits', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          profitData={profitData}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  {/* line 2 */}
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Coupon Discount') && (
                      <SoftBox mb={3}>
                        {/* Coupon Discount Value */}
                        <CouponDiscountMiniStatisticsCard
                          title={{ text: 'Coupon Discounts', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <SoftBox mb={3}>
                      <FillDashboardLayout
                        title={{ text: 'Offers and Promotions', fontWeight: 'bold' }}
                        icon={{ color: 'info', component: 'LocalAtmIcon' }}
                        orgId={orgId}
                      />
                    </SoftBox>
                  </Grid>

                  {/* Gst */}
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">GST</SoftTypography>
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('GST') && (
                      <SoftBox mb={3}>
                        <ReconcillationMiniStatisticsCard
                          title={{ text: 'GST reconciliation', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'star' }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Input credit',
                            Value: `₹ ${inputCredit}`,
                            note: '(Tax paid on all purchase)',
                          }}
                          random1={{
                            title: 'Tax on Output',
                            Value: `₹ ${gstCollected}`,
                            note: ' (Tax collected from all sales)',
                          }}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">Operation Overview</SoftTypography>
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Order Metrics') && (
                      <SoftBox mb={3}>
                        <CartMetrics
                          title={{ text: 'Order Metrics', fontWeight: 'bold' }}
                          icon={{ component: 'shopping_basket' }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Order Edited',
                            value: fetchEventCount('ORDER_EDITED'),
                          }}
                          random1={{
                            title: 'Receipt Reprint',
                            value: fetchEventCount('ORDER_RECEIPT_REPRINT'),
                          }}
                          random2={{
                            title: 'Avg Order Time',
                            value: `${
                              allMetricsData?.averageOrderTime ? allMetricsData?.averageOrderTime + ' s' : 'NA'
                            }`,
                          }}
                          random3={{
                            title: 'Avg Item Time',
                            value: `${allMetricsData?.averageItemTime ? allMetricsData?.averageItemTime + ' s' : 'NA'}`,
                          }}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {selectedWidgets?.includes('Cart Metrics') && (
                      <SoftBox mb={3}>
                        <CartMetrics
                          title={{ text: 'Cart Metrics', fontWeight: 'bold' }}
                          icon={{ component: <ShoppingCartIcon /> }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Cart Deleted',
                            value: fetchEventCount('CART_DELETED'),
                          }}
                          random1={{
                            title: 'Cart Hold',
                            value: fetchEventCount('CART_HOLD'),
                          }}
                          random2={{
                            title: 'Cart Item Removed',
                            value: fetchEventCount('CART_ITEM_REMOVED'),
                          }}
                          random3={{
                            title: 'Barcode/ Manual',
                            value: `${allMetricsData?.barCodeSearchCount || 'NA'}/ ${
                              allMetricsData?.manualSearchCount || 'NA'
                            }`,
                            percent: calculatePercentage(
                              allMetricsData?.barCodeSearchCount,
                              allMetricsData?.barCodeSearchCount + allMetricsData?.manualSearchCount,
                            ),
                          }}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {/* GRN Metrics */}
                    {selectedWidgets?.includes('GRN Metrics') && (
                      <SoftBox mb={3}>
                        <CartMetrics
                          title={{ text: 'GRN Metrics', fontWeight: 'bold' }}
                          icon={{ component: 'shopping_basket' }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Total GRNs',
                            value: `${grnMetricsData?.totalEpos ? grnMetricsData?.totalEpos : 'NA'}`,
                          }}
                          random1={{
                            title: 'Total Items',
                            value: grnMetricsData?.totalItems ?? 'NA',
                          }}
                          random2={{
                            title: 'Total Time',
                            value: `${grnMetricsData?.totalTime ? grnMetricsData?.totalTime + ' ms' : 'NA'}`,
                          }}
                          random3={{
                            title: 'Avg Item Time',
                            value:
                              grnMetricsData?.averageItemTime != null ? `${grnMetricsData?.averageItemTime} ms` : 'NA',
                          }}
                        />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">Most popular products</SoftTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <PopularProducts orgId={orgId} displayCards={true} />
                  </Grid>
                  <Grid item xs={12}>
                    <SoftTypography className="DashboardCategory-Text">Non moving products</SoftTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <SlowMovingInventory orgId={orgId} displayCards={true} />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </SoftBox>

        {isSuperAdmin ? (
          <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {loadingIndicator}
            <>
              {isMobileDevice && (
                <SoftBox>
                  {/* SALES OVERVIEW */}
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={'Sales Overview'}>
                      <SplideSlide>
                        <SalesDashboardCard
                          title={{ text: "Today's Sales", fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={salesdashboardData?.todaySales}
                          orders={salesdashboardData?.todayOrders}
                          icon={{ component: <CurrencyRupeeIcon /> }}
                          orgId={orgId}
                          type={"Today's"}
                          valueSplit={storeDashboardData?.todaySales}
                          ordersSplit={storeDashboardData?.todayOrders}
                          appValueSplit={appDashboardData?.todaySales}
                          appOrdersSplit={appDashboardData?.todayOrders}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <SalesDashboardCard
                          title={{ text: 'Monthly sales', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={salesdashboardData?.currentMonthSales}
                          orders={salesdashboardData?.currentMonthOrders}
                          icon={{ component: <CurrencyRupeeIcon /> }}
                          orgId={orgId}
                          type={'Monthly'}
                          valueSplit={storeDashboardData?.currentMonthSales}
                          ordersSplit={storeDashboardData?.currentMonthOrders}
                          appValueSplit={appDashboardData?.currentMonthSales}
                          appOrdersSplit={appDashboardData?.currentMonthOrders}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <SalesDashboardCard
                          title={{ text: 'Yearly sales', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={salesdashboardData?.currentYearSales}
                          orders={salesdashboardData?.currentYearOrders}
                          icon={{ component: <CurrencyRupeeIcon /> }}
                          orgId={orgId}
                          type={'Yearly'}
                          valueSplit={storeDashboardData?.currentYearSales}
                          ordersSplit={storeDashboardData?.currentYearOrders}
                          appValueSplit={appDashboardData?.currentYearSales}
                          appOrdersSplit={appDashboardData?.currentYearOrders}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={''}>
                      <SplideSlide>
                        <AverageCartValue
                          title={{ text: 'Average Cart Value', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          value={salesdashboardData?.currentMonthSales}
                          orders={salesdashboardData?.currentMonthOrders}
                          loaderDependency={loaderDependency}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <FillDashboardLayout
                          title={{ text: 'Refunds', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <CustomerMiniStatisticsCard
                          title={{ text: 'New customers ', fontWeight: 'bold' }}
                          count=""
                          percentage={{ color: 'success', text: '+3%' }}
                          icon={{ color: 'info', component: 'person_add' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>

                  {/* PURCHASE OVERVIEW */}
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={'Purchase Overview'}>
                      <SplideSlide>
                        <SalesDashboardCard
                          title={{ text: "Today's purchase", fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={purchaseDashboardData?.currentDayPurchaseValue}
                          orders={purchaseDashboardData?.currentDayPurchaseCount}
                          icon={{ component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <SalesDashboardCard
                          title={{ text: 'Monthly purchase', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={purchaseDashboardData?.totalPurchase}
                          orders={purchaseDashboardData?.monthlyPurchaseCount}
                          icon={{ component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <SalesDashboardCard
                          title={{ text: 'Yearly purchase', fontWeight: 'bold' }}
                          percentage={{ color: 'success', text: '+12%' }}
                          // icon={{ color: 'info', component: 'paid' }}
                          value={purchaseDashboardData?.yearlyPurchaseValue}
                          orders={purchaseDashboardData?.yearlyPurchaseCount}
                          icon={{ component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={''}>
                      <SplideSlide>
                        <VendorMiniStatisticsCard
                          title={{ text: 'New vendors', fontWeight: 'bold' }}
                          percentage={{ color: 'error', text: '-3%' }}
                          icon={{ color: 'info', component: 'diversity_3' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <FillDashboardLayout
                          title={{ text: 'Purchase Requests', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <FillDashboardLayout
                          title={{ text: 'Purchase Returns', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <FillDashboardLayout
                          title={{ text: 'Outstanding Payments', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          purchaseDashboardData={purchaseDashboardData}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>

                  <SoftBox className="slider-main-div">
                    <SplideCommon title={'Inventory Overview'}>
                      <SplideSlide>
                        <StockOverviewValue
                          title={{ text: 'Stock Value', fontWeight: 'bold' }}
                          percentage={{ color: 'error', text: '-3%' }}
                          icon={{ color: 'info', component: 'diversity_3' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <FillDashboardLayout
                          title={{ text: 'Product Expiry', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <FillDashboardLayout
                          title={{ text: 'Stock Updates', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={'Profit & Loss'}>
                      <SplideSlide>
                        <ProfitsMiniStatisticsCard
                          title={{ text: "Today's Profits", fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          profitData={profitData}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <ProfitsMiniStatisticsCard
                          title={{ text: 'Monthly Profits', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          profitData={profitData}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <ProfitsMiniStatisticsCard
                          title={{ text: 'Yearly Profits', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          profitData={profitData}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={''}>
                      <SplideSlide>
                        <CouponDiscountMiniStatisticsCard
                          title={{ text: 'Coupon Discounts', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'shopping_basket' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <FillDashboardLayout
                          title={{ text: 'Offers and Promotions', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>
                  {/* GST OVERVIEW */}
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={'GST Overview'} single={true} showFilter={false}>
                      <SplideSlide>
                        <ReconcillationMiniStatisticsCard
                          title={{ text: 'GST reconciliation', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'star' }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Input credit',
                            Value: `₹ ${inputCredit}`,
                            note: '(Tax paid on all purchase)',
                          }}
                          random1={{
                            title: 'Tax on Output',
                            Value: `₹ ${gstCollected}`,
                            note: ' (Tax collected from all sales)',
                          }}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>

                  {/* ORDER METRICS OVERVIEW */}
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={'Order Metrics Overview'} showFilter={false}>
                      <SplideSlide>
                        <CartMetrics
                          title={{ text: 'Order Metrics', fontWeight: 'bold' }}
                          icon={{ component: 'shopping_basket' }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Order Edited',
                            value: fetchEventCount('ORDER_EDITED'),
                          }}
                          random1={{
                            title: 'Receipt Reprint',
                            value: fetchEventCount('ORDER_RECEIPT_REPRINT'),
                          }}
                          random2={{
                            title: 'Avg Order Time',
                            value: `${
                              allMetricsData?.averageOrderTime ? allMetricsData?.averageOrderTime + ' s' : 'NA'
                            }`,
                          }}
                          random3={{
                            title: 'Avg Item Time',
                            value: `${allMetricsData?.averageItemTime ? allMetricsData?.averageItemTime + ' s' : 'NA'}`,
                          }}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <CartMetrics
                          title={{ text: 'Cart Metrics', fontWeight: 'bold' }}
                          icon={{ component: <ShoppingCartIcon /> }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Cart Deleted',
                            value: fetchEventCount('CART_DELETED'),
                          }}
                          random1={{
                            title: 'Cart Hold',
                            value: fetchEventCount('CART_HOLD'),
                          }}
                          random2={{
                            title: 'Cart Item Removed',
                            value: fetchEventCount('CART_ITEM_REMOVED'),
                          }}
                          random3={{
                            title: 'Barcode/ Manual',
                            value: `${allMetricsData?.barCodeSearchCount || 'NA'}/ ${
                              allMetricsData?.manualSearchCount || 'NA'
                            }`,
                            percent: calculatePercentage(
                              allMetricsData?.barCodeSearchCount,
                              allMetricsData?.barCodeSearchCount + allMetricsData?.manualSearchCount,
                            ),
                          }}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <CartMetrics
                          title={{ text: 'GRN Metrics', fontWeight: 'bold' }}
                          icon={{ component: 'shopping_basket' }}
                          percentage={{ color: 'success' }}
                          random={{
                            title: 'Total GRNs',
                            value: `${grnMetricsData?.totalEpos ? grnMetricsData?.totalEpos : 'NA'}`,
                          }}
                          random1={{
                            title: 'Total Items',
                            value: grnMetricsData?.totalItems ?? 'NA',
                          }}
                          random2={{
                            title: 'Total Time',
                            value: `${grnMetricsData?.totalTime ? grnMetricsData?.totalTime + ' ms' : 'NA'}`,
                          }}
                          random3={{
                            title: 'Avg Item Time',
                            value:
                              grnMetricsData?.averageItemTime != null ? `${grnMetricsData?.averageItemTime} ms` : 'NA',
                          }}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>
                  {/* OTHERS OVERVIEW */}
                  <SoftBox className="slider-main-div">
                    <SplideCommon title={'Others'}>
                      <SplideSlide>
                        <ProfitsMiniStatisticsCard
                          title={{ text: 'Monthly Profits', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          loaderDependency={loaderDependency}
                          profitData={profitData}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <AverageCartValue
                          title={{ text: 'Average Cart Value', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'LocalAtmIcon' }}
                          orgId={orgId}
                          value={salesdashboardData?.currentMonthSales}
                          orders={salesdashboardData?.currentMonthOrders}
                          loaderDependency={loaderDependency}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <CouponDiscountMiniStatisticsCard
                          title={{ text: 'Coupon Discount Value', fontWeight: 'bold' }}
                          icon={{ color: 'info', component: 'shopping_basket' }}
                          orgId={orgId}
                          loaderDependency={loaderDependency}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <CustomerMiniStatisticsCard
                          title={{ text: 'New customers ', fontWeight: 'bold' }}
                          count="  85"
                          percentage={{ color: 'success', text: '+3%' }}
                          icon={{ color: 'info', component: 'person_add' }}
                          orgId={orgId}
                          loaderDependency={loaderDependency}
                        />
                      </SplideSlide>
                      <SplideSlide>
                        <VendorMiniStatisticsCard
                          title={{ text: 'New vendors', fontWeight: 'bold' }}
                          percentage={{ color: 'error', text: '-3%' }}
                          icon={{ color: 'info', component: 'diversity_3' }}
                          orgId={orgId}
                          loaderDependency={loaderDependency}
                        />
                      </SplideSlide>
                    </SplideCommon>
                  </SoftBox>
                </SoftBox>
              )}

              <Footer />
            </>
          </div>
        ) : (
          <>
            <div style={{ minHeight: '100vh', position: 'relative', marginTop: '10px' }}>
              <BottomNavigation
                sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#fafafa' }}
              >
                <BottomNavigationAction lbel="" icon={<Footer />} />
              </BottomNavigation>
            </div>
          </>
        )}
      </SoftBox>
      {/* {isMobileDevice && <BottomNavbar />} */}
    </DashboardLayout>
  );
}

export default Default;
