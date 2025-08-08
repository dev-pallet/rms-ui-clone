import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Grid } from '@mui/material';
import './all-org.css';

import Menu from '@mui/material/Menu';
import { alpha, styled } from '@mui/material/styles';
import breakpoints from 'assets/theme/base/breakpoints';
import { useEffect, useMemo, useState } from 'react';
import typography from '../../../assets/theme/base/typography';
import SoftBox from '../../../components/SoftBox';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from '../../../components/SoftTypography';
import {
  dashboardProfitDetails,
  fetchOrganisations,
  getDashboardSalesValues,
  getTotalPuchase,
} from '../../../config/Services';
import Footer from '../../../examples/Footer';
import PageLayout from '../../../examples/LayoutContainers/PageLayout';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import CouponDiscountMiniStatisticsCard from '../../dashboard widgets/coupon/totalDiscountValue';
import CustomerMiniStatisticsCard from '../../dashboard widgets/Customers/totalCustomer';
import ReconcillationMiniStatisticsCard from '../../dashboard widgets/GST Reconcillation/gstReconcillation';
import SalesDashboardCard from '../../dashboard widgets/Sales/SalesDashboardCard';
import ProfitsMiniStatisticsCard from '../../dashboard widgets/Sales/totalProfits';
import VendorMiniStatisticsCard from '../../dashboard widgets/Vendor/totalVendor';
import reportsBarChartData from '../../dashboards/default/data/reportsBarChartData';
import { isSmallScreen } from '../Common/CommonFunction';
import './all-org.css';
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

const Dashboardpage = () => {
  const { values } = breakpoints;
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const showSnackbar = useSnackbar();
  const [progress, setProgress] = useState(16.66);
  const [salesToggle, setSalesToggle] = useState(false);
  const user_roles = localStorage.getItem('user_roles');
  const [isSuperAdmin, setIsSuperSdmin] = useState(false);
  const [currPathname, setCurrPathname] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgOptions,setOrgOptions] = useState();
  const [orgId, setOrgId] = useState();
  const [storedResult, setStoredResult] = useState([]);
  const [filterGraph, setFilterGraph] = useState('Weekly');
  const [filterGraphPayment, setFilterGraphPayment] = useState('Weekly');
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [salesValues, setSalesValues] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [prevsalesData, setPrevSalesData] = useState([]);
  const [prevsalesValues, setPrevSalesValues] = useState([]);
  const [monthlyLabels, setMonthlyLabels] = useState([]);
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
  const [profitData , setProfitData] = useState({});

  const isMobileDevice = isSmallScreen();


  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPayment, setAnchorElPayment] = useState(null);

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

  //setting orgnames
  useEffect(() => {
    fetchOrganisations()
      .then((res) => {
        if (res?.data?.data?.status === 'ERROR') {
          localStorage.setItem('user_details', {});
          localStorage.setItem('user_roles', []);
          localStorage.setItem('user_name', '');
          showSnackbar(res?.data?.data?.message || 'Some Error Occured','error');
          return;
        }
        const userDetails = res?.data?.data?.userDetails;
        const orgIds = res?.data?.data?.orgIdList;
        const retails = res?.data?.data?.retails;
        localStorage.setItem('user_details', JSON.stringify(userDetails || {}));
        localStorage.setItem('user_roles', JSON.stringify(userDetails?.roles || []));
        const result = retails?.map((retail) => {
          return {
            label: retail?.displayName,
            value: retail?.retailId,
          };
        });
        setOrgOptions(result);
      })
      .catch((error) => {
        console.log({ error });
      });
  }, []);

  useEffect(() => {
    setCurrPathname(location.pathname);
    // setStoredResult(JSON.parse(localStorage.getItem('Orgnames')));
    if (localStorage.getItem('orgId')) {
      setOrgName(localStorage.getItem('orgName') || '');
      setOrgId(localStorage.getItem('orgId'));
    } else if (orgOptions?.length > 0) {
      setOrgName(orgOptions[0]?.label || '');
      setOrgId(orgOptions[0]?.value || '');
    }
  }, [orgOptions]);

  useEffect(() => {
    if (user_roles?.includes('SUPER_ADMIN')) {
      setIsSuperSdmin(true);
    }
  }, []);

  const gstCollected = localStorage.getItem('gstCollected') || '0';
  const inputCredit = localStorage.getItem('inputCredit') || '0';

  const transformText = (text) => {
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    return words.join(' ');
  };

  const transformedText = transformText(orgName);

  const onCategoryChange = (event) => {
    setOrgName(event.label);
    setOrgId(event.value);
  };

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
    };
    if (orgId) {
      getDashboardSalesValues(payload)
        .then((res) => {
          setSalesdashboardData(res?.data?.data?.salesData || {});
        })
        .catch(() => {});
      dashboardProfitDetails(payload).then((res) => {
        if (res?.data?.data?.es === 0) {
          setProfitData(res?.data?.data?.profitData);
        } else {
          setProfitData({});
        }
      }).catch((err) => {

      });
    }
  }, [orgId]);

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
      orderType: orderType,
    };
    getDashboardSalesValues(payload)
      .then((res) => {
        if (orderType === 'POS_ORDER') {
          setStoreDashboardData(res?.data?.data?.salesData || {});
        } else if (orderType === 'B2C_ORDER') {
          setAppDashboardData(res?.data?.data?.salesData || {});
        }
      })
      .catch(() => {});
  };
  useEffect(() => {
    if (orgId) {
      getStoreSalesData('POS_ORDER');
      getStoreSalesData('B2C_ORDER');
    }
  }, [orgId]);

  useEffect(() => {
    !!orgId && totalPurchased();
  }, [orgId]);
  const totalPurchased = () => {
    const currMonth = new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const currYear = new Date().getFullYear().toString();
    const payload = {
      orgId: orgId,
      month: currMonth,
      year: currYear,
    };
    getTotalPuchase(payload)
      .then((res) => {
        if (res?.data?.data?.es == '0') {
          setPurchaseDashboardData(res?.data?.data);
        }
      })
      .catch((err) => {
        // Write code for error messages if any
      });
  };
  //   useEffect(() => {
  //     const currentDate = new Date();
  //     const year = currentDate.getFullYear();
  //     const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  //     const day = currentDate.getDate().toString().padStart(2, '0');
  //     const currDate = `${year}-${month}-${day}`;

  //     let payload;
  //     if (filterGraphPayment === 'Yearly' || filterGraphPayment === 'YearlyOrderValue') {
  //       payload = {
  //         startDate: `${year}-${YEAR_START_DATE}`,
  //         endDate: `${year}-${YEAR_END_DATE}`,
  //         orgId: orgId,
  //       };
  //     } else {
  //       const previousDate = new Date(currentDate);
  //       previousDate.setDate(currentDate.getDate() - 6);
  //       const prevYear = previousDate.getFullYear();
  //       const prevMonth = (previousDate.getMonth() + 1).toString().padStart(2, '0');
  //       const prevDay = previousDate.getDate().toString().padStart(2, '0');
  //       const formattedPrevDate = `${prevYear}-${prevMonth}-${prevDay}`;
  //       payload = {
  //         startDate: formattedPrevDate,
  //         endDate: currDate,
  //         orgId: orgId,
  //       };
  //     }
  // if  (orgId) {
  //     paymentMethodsData(payload)
  //       .then((res) => {
  //         if (
  //           res?.data?.data?.es === 0 &&
  //           res?.data?.data?.salesData !== undefined &&
  //           res?.data?.data?.orderResponseModel === undefined
  //         ) {
  //           const cardValue = res?.data?.data?.salesData?.cardOrders || 0;
  //           const cardOrderValue = res?.data?.data?.salesData?.cardOrdersValue || 0;
  //           const upiValue = res?.data?.data?.salesData?.upiOrders || 0;
  //           const upiOrderValue = res?.data?.data?.salesData?.upiOrdersValue || 0;
  //           const cashValue = res?.data?.data?.salesData?.cashOrders || 0;
  //           const cashOrderValue = res?.data?.data?.salesData?.cashOrdersValue || 0;
  //           const splitValue = res?.data?.data?.salesData?.splitOrders || 0;
  //           const splitOrderValue = res?.data?.data?.salesData?.splitOrdersValue || 0;
  //           const sodexoValue = res?.data?.data?.salesData?.sodexoOrders || 0;
  //           const sodexoOrdersValue = res?.data?.data?.salesData?.sodexoOrdersValue || 0;
  //           if (filterGraphPayment === 'WeeklyOrderValue' || filterGraphPayment === 'YearlyOrderValue') {
  //             setChartData({
  //               labels: ['Cash', 'UPI', 'Card', 'Split' , 'Sodexo'],

  //               datasets: {
  //                 label: 'Projects',
  //                 backgroundColors: ['darkblue', 'blue', 'green' , "secondary" ,"success" ],
  //                 data: [cashOrderValue, upiOrderValue, cardOrderValue, splitOrderValue , sodexoOrdersValue],
  //               },
  //             });
  //           } else {
  //             setChartData({
  //               labels: ['Cash', 'UPI', 'Card', 'Split' , 'Sodexo'],
  //               datasets: {
  //                 label: 'Projects',
  //                 backgroundColors: ['darkblue', 'blue', 'green' , "secondary" , "success"],
  //                 data: [cashValue, upiValue, cardValue, splitValue , sodexoValue],
  //               },
  //             });
  //           }
  //         }
  //       })
  //       .catch((err) => {});
  //     }

  //   }, [filterGraphPayment , orgId]);

  //   useEffect(() => {
  //     const currentDate = new Date();
  //     const year = currentDate.getFullYear();
  //     if (filterGraph === 'Monthly' || filterGraph === 'MonthlyOrderValue') {
  //       let payload = {
  //         startDate: `${year}-${YEAR_START_DATE}`,
  //         endDate: `${year}-${YEAR_END_DATE}`,
  //         orgId: orgId,
  //       };
  //       let prevPayload = {
  //         startDate: `${year - 1}-${YEAR_START_DATE}`,
  //         endDate: `${year - 1}-${YEAR_END_DATE}`,
  //         orgId: orgId,
  //       };

  //       const months = [
  //         {
  //           name: 'January',
  //           month: 1,
  //         },
  //         {
  //           name: 'February',
  //           month: 2,
  //         },
  //         {
  //           name: 'March',
  //           month: 3,
  //         },
  //         {
  //           name: 'April',
  //           month: 4,
  //         },
  //         {
  //           name: 'May',
  //           month: 5,
  //         },
  //         {
  //           name: 'June',
  //           month: 6,
  //         },
  //         {
  //           name: 'July',
  //           month: 7,
  //         },
  //         {
  //           name: 'August',
  //           month: 8,
  //         },
  //         {
  //           name: 'September',
  //           month: 9,
  //         },
  //         {
  //           name: 'October',
  //           month: 10,
  //         },
  //         {
  //           name: 'November',
  //           month: 11,
  //         },
  //         {
  //           name: 'December',
  //           month: 12,
  //         },
  //       ];

  //       const currentMonth = new Date().getMonth();
  //       const resultdata = Array.from({ length: 6 }, (_, index) => {
  //         const monthIndex = (currentMonth - index + 12) % 12;
  //         return {
  //           name: months[monthIndex].name,
  //           month: monthIndex + 1,
  //         };
  //       }).reverse();
  //       const labels = Array.from({ length: 6 }, (_, index) => {
  //         const monthIndex = (currentMonth - index + 12) % 12;
  //         return months[monthIndex].name.slice(0, 3);
  //       }).reverse();

  //       setMonthlyLabels(labels);

  //       salesReportsChart(payload)
  //         .then((res) => {
  //           const matchedSales = [];
  //           const matchedSalesValue = [];
  //           resultdata.map((item, index) => {
  //             const matchedMonth = res?.data?.data?.salesReportOverTime?.salesReportOverMonthWiseList.find(
  //               (monthItem) => monthItem.month === item.month,
  //             );
  //             if (matchedMonth) {
  //               matchedSales[index] = matchedMonth.sales;
  //               matchedSalesValue[index] = matchedMonth.salesValue;
  //             } else {
  //               matchedSales[index] = 0;
  //               matchedSalesValue[index] = 0;
  //             }
  //           });

  //           setSalesData(matchedSales);
  //           setSalesValues(matchedSalesValue);
  //         })
  //         .catch((err) => {});

  //       salesReportsChart(prevPayload)
  //         .then((res) => {
  //           const matchedSales = [];
  //           const matchedSalesValue = [];
  //           resultdata.map((item, index) => {
  //             const matchedMonth = res?.data?.data?.salesReportOverTime?.salesReportOverMonthWiseList.find(
  //               (monthItem) => monthItem.month === item.month,
  //             );
  //             if (matchedMonth) {
  //               matchedSales[index] = matchedMonth.sales;
  //               matchedSalesValue[index] = matchedMonth.salesValue;
  //             } else {
  //               matchedSales[index] = 0;
  //               matchedSalesValue[index] = 0;
  //             }
  //           });

  //           setPrevSalesData(matchedSales);
  //           setPrevSalesValues(matchedSalesValue);
  //         })
  //         .catch((err) => {});
  //     }
  //   }, [filterGraph, orgId]);

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

  return (
    <PageLayout>
      <SoftBox py={isMobileDevice ? '80px' : 10} px={3}>
        <Grid container>
          <SoftBox p={1} width="100%">
            <div
              className="welcome-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Grid container className="dasboard-main-text">
                <SoftTypography
                  variant={window.innerWidth < values.sm ? 'h4' : 'h3'}
                  textTransform="capitalize"
                  fontWeight="bold"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      color: '#3b3c52',
                      marginInline: '0.5rem',
                      marginBottom: '0',
                      lineHeight: '1.2',
                      whiteSpace: 'normal',
                    }}
                  >
                    Welcome to {transformedText || ''}
                  </p>{' '}
                </SoftTypography>
                {currPathname === '/AllOrg_loc' ? (
                  <SoftBox className="dashboard-org-softselect">
                    <SoftSelect
                      options={orgOptions}
                      placeholder="Select Organization"
                      onChange={(e) => onCategoryChange(e)}
                      menuPortalTarget={document.body}
                    />
                  </SoftBox>
                ) : null}
              </Grid>
            </div>
          </SoftBox>
        </Grid>
        <Grid container>
          <Grid item xs={12} lg={9}>
      

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <SoftBox mb={3}>
                  {/* TODAY SALES */}
                  {/* <SalesMiniStatisticsCardToday
                    title={{ text: `Today's Sales`, fontWeight: 'bold' }}
                    percentage={{ color: 'success', text: '+12%' }}
                    icon={{ color: 'info', component: 'paid' }}
                    orgId={orgId}
                  /> */}
                  <SalesDashboardCard
                    title={{ text: 'Today\'s Sales', fontWeight: 'bold' }}
                    percentage={{ color: 'success', text: '+12%' }}
                    // icon={{ color: 'info', component: 'paid' }}
                    value={salesdashboardData?.todaySales}
                    orders={salesdashboardData?.todayOrders}
                    icon={{ component: <CurrencyRupeeIcon /> }}
                    orgId={orgId}
                    type={'Today\'s'}
                    valueSplit={storeDashboardData?.todaySales}
                    ordersSplit={storeDashboardData?.todayOrders}
                    appValueSplit={appDashboardData?.todaySales}
                    appOrdersSplit={appDashboardData?.todayOrders}
                  />
                </SoftBox>
                
                <SoftBox mb={3}>
                  {/* Todays Purchase */}
                  <SalesDashboardCard
                    title={{ text: 'Today\'s purchase', fontWeight: 'bold' }}
                    percentage={{ color: 'success', text: '+12%' }}
                    // icon={{ color: 'info', component: 'paid' }}
                    value={purchaseDashboardData?.currentDayPurchaseValue}
                    orders={purchaseDashboardData?.currentDayPurchaseCount}
                    icon={{ component: 'shopping_basket' }}
                    orgId={orgId}
                  />
                </SoftBox>

                <SoftBox mb={3}>
                  <ReconcillationMiniStatisticsCard
                    title={{ text: 'GST reconciliation', fontWeight: 'bold' }}
                    icon={{ color: 'info', component: 'star' }}
                    percentage={{ color: 'success' }}
                    random={{ title: 'Input credit', Value: `₹ ${inputCredit}`, note: '(Tax paid on all purchase)' }}
                    random1={{
                      title: 'Tax on Output',
                      Value: `₹ ${gstCollected}`,
                      note: ' (Tax collected from all sales)',
                    }}
                  />
                </SoftBox>

                <br />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SoftBox mb={3}>
                  {/* Monthly Sale */}
                  {/* <SalesMiniStatisticsCard
                    title={{ text: 'Monthly sales', fontWeight: 'bold' }}
                    percentage={{ color: 'success', text: '+12%' }}
                    icon={{ color: 'info', component: 'paid' }}
                    orgId={orgId}
                  /> */}
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
                <SoftBox mb={3}>
                  {/* Monthly Profits */}
                  <ProfitsMiniStatisticsCard
                    title={{ text: 'Monthly Profits', fontWeight: 'bold' }}
                    icon={{ color: 'info', component: 'shopping_basket' }}
                    orgId={orgId}
                    profitData={profitData}
                  />
                </SoftBox>

                <SoftBox mb={3}>
                  {/* Coupon Discount Value */}
                  <CouponDiscountMiniStatisticsCard
                    title={{ text: 'Coupon Discount Value', fontWeight: 'bold' }}
                    icon={{ color: 'info', component: 'shopping_basket' }}
                    orgId={orgId}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={12} sm={4}>
                <SoftBox mb={3}>
                  {/* Yearly Sale */}
                  {/* <YearlySalesMiniStatisticsCard
                    title={{ text: 'Yearly sales', fontWeight: 'bold' }}
                    percentage={{ color: 'success', text: '+12%' }}
                    icon={{ color: 'info', component: 'paid' }}
                    orgId={orgId}
                  /> */}
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
                <SoftBox mb={3}>
                  <CustomerMiniStatisticsCard
                    title={{ text: 'New customers ', fontWeight: 'bold' }}
                    count="  85"
                    percentage={{ color: 'success', text: '+3%' }}
                    icon={{ color: 'info', component: 'person_add' }}
                    orgId={orgId}
                  />
                </SoftBox>
                <SoftBox mb={3}>
                  {/* TOTAL VENDOR */}
                  <VendorMiniStatisticsCard
                    title={{ text: 'New vendors', fontWeight: 'bold' }}
                    percentage={{ color: 'error', text: '-3%' }}
                    icon={{ color: 'info', component: 'diversity_3' }}
                    orgId={orgId}
                  />
                </SoftBox>
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
            <Card>
<SoftBox sx={{ position: 'absolute', top: 13, right: 10, flex: 1, zIndex: 10 }}>
                      <div>
                        <SoftBox style={{ display: 'flex' }} onClick={handleClickPayment}>
                     
                          <FilterAltIcon />
                          <SoftTypography style={{ fontSize: '0.85rem', marginInline: '10px' }}>Filter</SoftTypography>
                        </SoftBox>
                        <StyledMenu
                          id="demo-customized-menu"
                          MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                          }}
                          anchorEl={anchorElPayment}
                          open={openPayment}
                          onClose={handleClosePayment}
                        >
                        
                          <MenuItem
                            onClick={() => {
                              // SetexportValue("pdf");
                              handleClosePayment();
                              onExportPayment('Weekly');
                            }}
                            disableRipple
                          >
                            <EventIcon />
                            Weekly Orders
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClosePayment();
                              onExportPayment('Yearly');
                            }}
                            disableRipple
                          >
                            <EventIcon />
                            Yearly Orders
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClosePayment();
                              onExportPayment('WeeklyOrderValue');
                            }}
                            disableRipple
                          >
                            <EventIcon />
                            Weekly Order Value
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClosePayment();
                              onExportPayment('YearlyOrderValue');
                            }}
                            disableRipple
                          >
                            <EventIcon />
                            Yearly Order Value
                          </MenuItem>
                        </StyledMenu>
                      </div>
                    </SoftBox>
              <PieChart
                title="Payment channels"
                height="305px"
                chart={chartData}
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
                 </Card>
            </Grid>
            <SalesByCategory dashBoardOrg={orgId}/>
        
          </Grid> */}
        </Grid>
        <br />
        {/* <Card>
                <SoftBox sx={{ position: 'absolute', top: 13, right: 10, flex: 1, zIndex: 10 }}>
         
                  <div>
                    <SoftBox style={{ display: 'flex' }} onClick={handleClick}>
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

                      <MenuItem
                        onClick={() => {
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

                {filterGraph === 'ProfitTrend' && (
                  <SoftBox>
                    <ProfitsChart orgIdb={orgId} />
                  </SoftBox>
                )}
                {(filterGraph === 'Weekly' || filterGraph === 'WeeklyOrderValue') && (
                  <SalesGradientLineChart
                    title="Sales Overview"
                    orgId={orgId}
                    salesToggle={salesToggle}
                    filterGraph={filterGraph}
                    description={
                      <SoftBox display="flex" alignItems="center">

                      </SoftBox>
                    }
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
              </Card> */}
      </SoftBox>

      {/* <SoftBox style={{ padding: '20px' }}>
        <PopularProducts orgId={orgId} />
      </SoftBox> */}

      <Footer />
    </PageLayout>
  );
};

export default Dashboardpage;
