import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Chip, Container, Drawer, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { DateRangeIcon, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SplideSlide } from '@splidejs/react-splide';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';
import { expressGrnMetricData, expressGrnMetricDataDownload } from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import SplideCommon from '../../../../../dashboards/default/components/common-tabs-carasoul';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import DatepickerReport from '../../Datepickerreport';

const ExpressGRNReports = () => {
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [openDate, setOpenDate] = useState(false);
  const [allData, setAllData] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

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

  const getData = () => {
    const payload = {
      organizationId: orgId,
      locationId: locId,
      uidx: null,
      startDate: fromdate,
      endDate: todate,
    };

    try {
      expressGrnMetricData(payload).then((res) => {
        if (res?.data?.message === 'Success') {
          setAllData(res?.data?.epoMetrics);
        } else if (res?.data?.message === 'No data found!') {
          showSnackbar(res?.data?.message, 'success');
          setAllData([]);
        }
      });
    } catch (error) {
      showSnackbar('Cannot fetch data', 'error');
    }
  };

  useEffect(() => {
    getData();
  }, [fromdate, todate]);

  const fetchEventCount = (eventType) => {
    const eventData = allData ? allData[eventType] : null;
    return eventData != null ? eventData : 'NA';
  };

  const allEvents = [
    {
      id: 1,
      eventType: 'Total Items',
      data: fetchEventCount('totalItems'),
      icon: <ShoppingCartIcon />,
      background: 'linear-gradient(60deg, rgb(94, 53, 177), rgb(3, 155, 229))',
    },
    {
      id: 2,
      eventType: 'Total GRNs',
      data: fetchEventCount('totalEpos'),
      icon: <ShoppingCartIcon />,
      background: 'linear-gradient(60deg, rgb(245, 0, 87), rgb(255, 138, 128))',
    },
    {
      id: 3,
      eventType: 'Total Time',
      data: `${fetchEventCount('totalTime') !== 'NA' ? fetchEventCount('totalTime') + ' ms' : 'NA'}`,
      icon: <AccessTimeIcon />,
      background: 'linear-gradient(60deg, rgb(67, 160, 71), rgb(255, 235, 59))',
    },
    {
      id: 4,
      eventType: 'Average Item Time',
      data: `${fetchEventCount('averageItemTime') !== 'NA' ? fetchEventCount('averageItemTime') + ' ms' : 'NA'}`,
      icon: <BarChartIcon />,
      background: 'linear-gradient(60deg, rgb(251, 140, 0), rgb(255, 202, 41))',
    },
  ];

  const handleReportDownload = async () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      exportType: 'csv',
      uidx: null,
    };

    try {
      const response = await expressGrnMetricDataDownload(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'ExpressGRN(Metrics).csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  return (
    <div>
      <DashboardLayout>
        {!isMobileDevice && <DashboardNavbar prevLink={true} />}
        {isMobileDevice && (
          <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
            <MobileNavbar title={'GRN metrics Reports'} prevLink={true} />
          </SoftBox>
        )}
        <Container fixed sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', paddingBottom: '15px ' }}>
          {!isMobileDevice && (
            <SoftBox className="search-bar-filter-container">
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SoftTypography sx={{ color: '#ffffff', fontSize: '16px' }}>GRN metrics Reports</SoftTypography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatepickerReport setFromdate={setFromdate} setTodate={setTodate} />
                  </LocalizationProvider>
                  <SaveAltIcon
                    sx={{ color: '#fff', cursor: 'pointer' }}
                    fontSize="large"
                    onClick={(event) => handleClick(event)}
                  />
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={handleReportDownload}>GRN metrics Reports</MenuItem>
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
                    label="Select Date Range"
                    onClick={() => setOpenDate(true)}
                    icon={<DateRangeIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label="GRN metrics Reports"
                    onClick={handleReportDownload}
                    icon={<SaveAltIcon />}
                    variant="outlined"
                  />
                </SplideSlide>
              </SplideCommon>

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
                      <div className="operator-effectivesness-report-box">
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
            </Grid>
          </Box>
        </Container>
      </DashboardLayout>
    </div>
  );
};

export default ExpressGRNReports;
