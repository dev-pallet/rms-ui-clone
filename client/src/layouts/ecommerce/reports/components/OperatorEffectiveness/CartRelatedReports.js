import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Box, Chip, Container, Drawer, Grid, Menu, MenuItem } from '@mui/material';
import { DateRangeIcon, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SplideSlide } from '@splidejs/react-splide';
import { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import { downloadCartDeleteHoldReport } from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SplideCommon from '../../../../dashboards/default/components/common-tabs-carasoul';
import { isSmallScreen } from '../../../Common/CommonFunction';
import DatepickerReport from '../Datepickerreport';

const CartRelatedReports = () => {
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [openDate, setOpenDate] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDate(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const anchor = 'bottom';
  const isMobileDevice = isSmallScreen();

  const handleCartDeleteDownload = async () => {
    let fromDate, toDate, start, end;

    if (fromdate) {
      fromDate = new Date(fromdate);
    } else {
      fromDate = new Date(); // Default to current date if fromdate is not provided
    }
    // Set to 1:30 AM UTC
    fromDate.setUTCHours(1, 30, 0, 0);

    if (todate) {
      toDate = new Date(todate);
    } else {
      toDate = new Date(); // Default to current date if todate is not provided
    }
    // Set to 4:30 PM UTC
    toDate.setUTCHours(16, 30, 0, 0);

    start = fromDate.toISOString();
    end = toDate.toISOString();

    const payload = {
      locationId: locId,
      startDate: start,
      endDate: end,
    };

    try {
      const response = await downloadCartDeleteHoldReport(payload);
      if (response?.data?.statusCode === 200 && response?.data?.url) {
        const link = document.createElement('a');
        link.href = response?.data?.url;
        link.download = 'CartDelete.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSnackbar('Report downloaded successfully', 'success');
      } else {
        showSnackbar('Failed to get the download URL', 'error');
      }
    } catch (error) {
      showSnackbar('Error downloading the report', 'error');
    }
  };

  return (
    <div>
      <DashboardLayout isMobileDevice={isMobileDevice}>
        {!isMobileDevice && <DashboardNavbar prevLink={true} />}
        {isMobileDevice && (
          <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
            <MobileNavbar title={'Cart Delete Report'} prevLink={true} />
          </SoftBox>
        )}
        <Container fixed sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', paddingBottom: '15px ' }}>
          {!isMobileDevice && (
            <SoftBox className="search-bar-filter-container">
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SoftTypography sx={{ color: '#ffffff', fontSize: '16px' }}>Cart Delete Report</SoftTypography>

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
                    <MenuItem onClick={handleCartDeleteDownload}>Cart Delete Reports</MenuItem>
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
                    label="Cart Delete Reports"
                    onClick={handleCartDeleteDownload}
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
            <Grid container spacing={3}></Grid>
          </Box>
        </Container>
      </DashboardLayout>
    </div>
  );
};

export default CartRelatedReports;
