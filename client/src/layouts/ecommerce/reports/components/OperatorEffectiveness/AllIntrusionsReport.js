import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FaceIcon from '@mui/icons-material/Face';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Box,
  Chip,
  Container,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SplideSlide } from '@splidejs/react-splide';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import {
  downloadBillingOperatorReport,
  downloadCashierOperatorReport,
  downloadLocationOperatorReport,
  downloadManualOperatorReport,
  downloadScanOperatorReport,
  getAllIntrusionsData,
  getAllOperatorsByOrgId,
  getOrderMetricsOperatorEffective,
} from '../../../../../config/Services';
import VerticalBarChart from '../../../../../examples/Charts/BarCharts/VerticalBarChart';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SplideCommon from '../../../../dashboards/default/components/common-tabs-carasoul';
import { isSmallScreen } from '../../../Common/CommonFunction';
import DatepickerReport from '../Datepickerreport';
import './OperatorReports.css';

const AllIntrusionsReport = () => {
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [cashierData, setCashierData] = useState([]);
  const navigate = useNavigate();
  const [openOperator, setOpenOperator] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedOperatorVal, setSelectedOperatorVal] = useState('');
  const [openDate, setOpenDate] = useState(false);
  const [allData, setAllData] = useState([]);
  const [allMetricsData, setAllMetricsData] = useState();

  const [anchorEl, setAnchorEl] = useState(null);

  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const getAllOperators = async () => {
    const orgId = localStorage.getItem('orgId');

    try {
      const res = await getAllOperatorsByOrgId(orgId);
      const data = res?.data?.data
        .filter((item) => item?.roles.includes('POS_USER'))
        .map(({ firstName, uidx }) => ({ label: firstName, value: uidx }));
      setCashierData(data);
    } catch (error) {}
  };

  useEffect(() => {
    getAllOperators();
  }, []);

  const getData = () => {
    const payload = {
      locationId: locId,
      uidx: selectedOperatorVal !== '' ? selectedOperatorVal : null,
      eventType: null,
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
    };

    try {
      getAllIntrusionsData(payload).then((res) => {
        if (res?.data?.message === 'Success') {
          setAllData(res?.data?.count);
        } else if (res?.data?.message === 'No data found!') {
          showSnackbar(res?.data?.message, 'success');
          setAllData([]);
        }
      });
    } catch (error) {
      showSnackbar('Cannot fetch data', 'error');
    }
  };

  const getOrderMetricsData = () => {
    const payload = {
      organizationId: orgId,
      locationId: locId,
      uidx: selectedOperatorVal !== '' ? selectedOperatorVal : null,
      startDate: fromdate,
      endDate: todate,
    };
    try {
      getOrderMetricsOperatorEffective(payload).then((res) => {
        if (res?.data?.message === 'Success') {
          setAllMetricsData(res?.data?.orderMetrics);
        } else if (res?.data?.message === 'No data found!') {
          showSnackbar(res?.data?.message, 'success');
          setAllMetricsData();
        }
      });
    } catch (error) {
      showSnackbar('Cannot fetch data', 'error');
    }
  };

  useEffect(() => {
    getData();
    getOrderMetricsData();
  }, [selectedOperatorVal, fromdate, todate]);

  const onCard = (reportId) => {
    navigate(`/reports/operator-effectiveness/${reportId}`);
  };

  const fetchEventCount = (eventType) => {
    const eventData = allData?.find((data) => data.eventType === eventType);
    return eventData ? eventData.eventCount : 'NA';
  };

  const allEvents = [
    {
      id: 1,
      eventType: 'Cart Deleted',
      data: fetchEventCount('CART_DELETED'),
      reportId: 'CART_DELETED',
      icon: <ShoppingCartIcon />,
      background: 'linear-gradient(60deg, rgb(94, 53, 177), rgb(3, 155, 229))',
    },
    {
      id: 2,
      eventType: 'Cart Hold',
      data: fetchEventCount('CART_HOLD'),
      reportId: 'CART_HOLD',
      icon: <ShoppingCartIcon />,
      background: 'linear-gradient(60deg, rgb(245, 0, 87), rgb(255, 138, 128))',
    },
    {
      id: 3,
      eventType: 'Cart Item Removed',
      data: fetchEventCount('CART_ITEM_REMOVED'),
      reportId: 'CART_ITEM_REMOVED',
      icon: <ShoppingCartIcon />,
      background: 'linear-gradient(60deg, rgb(251, 140, 0), rgb(255, 202, 41))',
    },
    {
      id: 4,
      eventType: 'Order Edited',
      data: fetchEventCount('ORDER_EDITED'),
      reportId: 'ORDER_EDITED',
      icon: <ShoppingCartIcon />,
      background: 'linear-gradient(60deg, rgb(67, 160, 71), rgb(255, 235, 59))',
    },
    {
      id: 5,
      eventType: 'Order Reciept Reprint',
      data: fetchEventCount('ORDER_RECEIPT_REPRINT'),
      reportId: 'ORDER_RECEIPT_REPRINT',
      icon: <ShoppingCartIcon />,
      background: 'linear-gradient(60deg, rgb(191, 64, 191), rgb(203, 195, 227))',
    },
    {
      id: 6,
      eventType: 'Loyalty Rewarded',
      data: fetchEventCount('LOYALTY_AWARDED'),
      reportId: 'LOYALTY_AWARDED',
      icon: <LocalOfferOutlinedIcon />,
      background: 'linear-gradient(60deg, rgb(255, 0, 0), rgb(255, 99, 71))',
    },
    {
      id: 7,
      eventType: 'Payment Mode Change',
      data: fetchEventCount('PAYMENT_MODE_CHANGE'),
      reportId: 'PAYMENT_MODE_CHANGE',
      icon: <CreditCardIcon />,
      background: 'linear-gradient(60deg, rgb(64, 224, 208), rgb(159, 226, 191))',
    },
    // {
    //   id: 8,
    //   eventType: 'Order Metrics',
    //   data: ['Total Orders: 12', 'Avg Order Time: 34', 'Total Time: 2hrs', "Manual Search Count: ", 'Barcode Search Count: '],
    //   reportId: '',
    //   icon: <IoStatsChart />,
    //   background: 'linear-gradient(60deg, rgb(255, 172, 28), rgb(255, 213, 128))',
    // },
  ];

  const handleLocationDownload = async () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      exportType: 'csv',
      uidx: selectedOperatorVal !== '' ? selectedOperatorVal : null,
    };

    try {
      const response = await downloadLocationOperatorReport(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'OperatorAnalysis(location).csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  const handleCashierDownload = async () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      exportType: 'csv',
      uidx: selectedOperatorVal !== '' ? selectedOperatorVal : null,
    };

    try {
      const response = await downloadCashierOperatorReport(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'OperatorAnalysis(cashier).csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  const handleManualDownload = async () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      exportType: 'csv',
      uidx: selectedOperatorVal !== '' ? selectedOperatorVal : null,
    };

    try {
      const response = await downloadManualOperatorReport(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'ManualItemSearch.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  const handleScanDownload = async () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      exportType: 'csv',
      uidx: selectedOperatorVal !== '' ? selectedOperatorVal : null,
    };

    try {
      const response = await downloadScanOperatorReport(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'ManualVsScan.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  const handleBillingDownload = async () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      exportType: 'csv',
      uidx: selectedOperatorVal !== '' ? selectedOperatorVal : null,
    };

    try {
      const response = await downloadBillingOperatorReport(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'BillingSpeed.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  const data = {
    labels: ['Operator-1', 'Operator-2', 'Operator-3', 'Operator-4', 'Operator-5'],
    datasets: [
      {
        label: 'Edit Orders',
        color: 'info',
        data: [5, 20, 30, 15, 10],
      },
      {
        label: 'Cart Delete',
        color: 'dark',
        data: [10, 30, 40, 20, 30],
      },
      {
        label: 'Items Delete',
        color: 'success',
        data: [1, 10, 32, 5, 23],
      },
    ],
  };

  const dataManager = {
    labels: ['Manager-1', 'Manager-2'],
    datasets: [
      {
        label: 'Edit Orders',
        color: 'info',
        data: [5, 20, 30, 15, 10],
      },
      {
        label: 'Cart Delete',
        color: 'dark',
        data: [10, 30, 40, 20, 30],
      },
      {
        label: 'Items Delete',
        color: 'success',
        data: [1, 10, 32, 5, 23],
      },
    ],
  };

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpenOperator(false);
    setOpenDate(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const anchor = 'bottom';
  const isMobileDevice = isSmallScreen();

  return (
    <div>
      <DashboardLayout isMobileDevice={isMobileDevice}>
        {!isMobileDevice && <DashboardNavbar prevLink={true} />}
        {isMobileDevice && (
          <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
            <MobileNavbar title={'Intrusions Reports'} prevLink={true} />
          </SoftBox>
        )}

        <Container fixed sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', paddingBottom: '15px ' }}>
          {!isMobileDevice && (
            <SoftBox className="search-bar-filter-container">
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SoftTypography sx={{ color: '#ffffff', fontSize: '16px' }}>Intrusion Reports</SoftTypography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                  <SoftSelect
                    placeholder="Select Operator"
                    insideHeader={true}
                    options={[{ label: 'All', value: '' }, ...cashierData]}
                    onChange={(option) => {
                      setSelectedOperator(option.label), setSelectedOperatorVal(option.value);
                    }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatepickerReport setFromdate={setFromdate} setTodate={setTodate} />
                  </LocalizationProvider>
                  <SaveAltIcon
                    sx={{
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                    fontSize="large"
                    onClick={(event) => handleClick(event)}
                  />
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={handleLocationDownload}>Location wise Reports</MenuItem>
                    <MenuItem onClick={handleCashierDownload}>Operator wise Reports</MenuItem>
                    <MenuItem onClick={handleManualDownload}>Manual Item Search Reports</MenuItem>
                    <MenuItem onClick={handleScanDownload}>Scan Vs Manual Reports</MenuItem>
                    <MenuItem onClick={handleBillingDownload}>Billing Speed Reports</MenuItem>
                  </Menu>
                </Box>
              </Box>
            </SoftBox>
          )}
          {isMobileDevice && (
            <SoftBox>
              <SplideCommon>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label={selectedOperator ? selectedOperator : 'Select Operator'}
                    onClick={() => setOpenOperator(true)}
                    icon={<FaceIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label="Select Date Range"
                    onClick={() => setOpenDate(true)}
                    icon={<DateRangeIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label="Location Wise Reports"
                    onClick={handleLocationDownload}
                    icon={<SaveAltIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label="Operator Wise Reports"
                    onClick={handleCashierDownload}
                    icon={<SaveAltIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label="Manual Item Search Reports"
                    onClick={handleManualDownload}
                    icon={<SaveAltIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label="Scan Vs Manual Reports"
                    onClick={handleScanDownload}
                    icon={<SaveAltIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label="Billing Speed Reports"
                    onClick={handleBillingDownload}
                    icon={<SaveAltIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
              </SplideCommon>

              <Drawer
                anchor={anchor}
                open={openOperator}
                onClose={toggleDrawer()}
                PaperProps={{
                  sx: {
                    width: '90%',
                    height: 'fit-content',
                  },
                }}
              >
                <Box
                  role="presentation"
                  onClick={toggleDrawer()}
                  onKeyDown={toggleDrawer()}
                  className="mob-res-filter-drawer-box"
                >
                  <List>
                    {[{ label: 'All', value: '' }, ...cashierData].map((item) => (
                      <ListItem
                        key={item.label}
                        onClick={() => {
                          setSelectedOperator(item.label), setSelectedOperatorVal(item.value);
                        }}
                      >
                        <ListItemText primary={item.label} />
                        <hr />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
              <Drawer
                anchor={anchor}
                open={openDate}
                onClose={toggleDrawer()}
                PaperProps={{
                  sx: {
                    width: '90%',
                    height: 'fit-content',
                  },
                }}
              >
                <Box role="presentation" className="mob-res-filter-drawer-box">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatepickerReport setFromdate={setFromdate} setTodate={setTodate} />
                  </LocalizationProvider>
                </Box>
              </Drawer>
            </SoftBox>
          )}

          <Box sx={{ padding: '15px' }}>
            <Grid container spacing={3}>
              {allEvents.map((item, idx) => {
                return (
                  <>
                    <Grid item lg={4} sm={12} md={12} xs={12} key={idx}>
                      <div className="operator-effectivesness-report-box" onClick={() => onCard(item?.reportId)}>
                        <div className="operator-effectiveness-box-img" style={{ background: item?.background }}>
                          {item?.icon}
                        </div>
                        <div className="operator-effectiveness-box-typo">
                          <Typography variant="subtitle2" className="operator-effectiveness-box-typo-1">
                            {item?.eventType}
                          </Typography>
                          <Typography variant="subtitle2" className="operator-effectiveness-box-typo-2">
                            {item?.data}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  </>
                );
              })}
              <Grid item lg={8} sm={12} md={12} xs={12}>
                <div
                  className="operator-effectivesness-report-box"
                  // onClick={() => onCard("ORDER_METRICS")}
                >
                  <div
                    className="operator-effectiveness-box-img"
                    style={{ background: 'linear-gradient(60deg, rgb(255, 172, 28), rgb(255, 213, 128))' }}
                  >
                    <BarChartOutlinedIcon />
                  </div>
                  <div className="operator-effectiveness-box-typo">
                    <Typography variant="subtitle2" className="operator-effectiveness-box-typo-1">
                      Order Metrics
                    </Typography>
                    <div className={!isMobileDevice ? 'op-eff-grid-view' : ''}>
                      <Typography variant="subtitle2" className="operator-effectiveness-box-typo-3">
                        Total Orders: {allMetricsData?.totalOrders || 'NA'}
                      </Typography>
                      <Typography variant="subtitle2" className="operator-effectiveness-box-typo-3">
                        Total Items: {allMetricsData?.totalItems || 'NA'}
                      </Typography>
                      <Typography variant="subtitle2" className="operator-effectiveness-box-typo-3">
                        Avg Order Time: {allMetricsData?.averageOrderTime || 'NA'}
                      </Typography>
                      <Typography variant="subtitle2" className="operator-effectiveness-box-typo-3">
                        Avg Item Time: {allMetricsData?.averageItemTime || 'NA'}
                      </Typography>
                      <Typography variant="subtitle2" className="operator-effectiveness-box-typo-3">
                        Manual Search Count: {allMetricsData?.manualSearchCount || 'NA'}
                      </Typography>
                      <Typography variant="subtitle2" className="operator-effectiveness-box-typo-3">
                        Barcode Search Count: {allMetricsData?.barCodeSearchCount || 'NA'}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ padding: '15px' }}>
            <Box style={{ width: '100%' }} className="dat-grid-table-box">
              <VerticalBarChart title="Most Intrusions (Operator)" chart={data} />
            </Box>
          </Box>

          <Box sx={{ padding: '15px' }}>
            <Box style={{ width: '100%' }} className="dat-grid-table-box">
              <VerticalBarChart title="Most Intrusions (Manager)" chart={dataManager} />
            </Box>
          </Box>
        </Container>
      </DashboardLayout>
    </div>
  );
};

export default AllIntrusionsReport;
