import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { CircularProgress } from '@mui/material';
import { exportCouponReport } from '../../../../config/Services'; // main style file
import { useSnackbar } from '../../../../hooks/SnackbarProvider'; // theme css file
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SalesGradientLineChart from '../../../dashboard widgets/SalesGradient/salesGradient';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import CreateNewReportModal from './CreateNewReportModal';

const MarketingReportChart = () => {
  const showSnackbar = useSnackbar();
  const [open, setOpen] = useState(false);
  const locId = localStorage.getItem('locId');
  const [tabledata, setTabledata] = useState([]);
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleClick = (event) => {
    if (!fromdate && !todate) {
      showSnackbar('Select date range to export', 'error');
      setLoader(false);
    } else {
      onExport('excel');
      setLoader(true);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onExport = async (format) => {
    setLoader(true);
    const payload = {
      couponId: [''],
    };

    try {
      const res = await exportCouponReport(payload, locId, fromdate, todate);

      if (res?.data?.message === 'socket hang up') {
        showSnackbar('Something went wrong, please retry', 'error');
      } else if (res?.data?.data?.couponReportUrl) {
        window.open(res?.data?.data?.couponReportUrl, '_blank');
      } else {
        showSnackbar('No data found for export', 'error');
      }
    } catch (err) {
      showSnackbar('An error occurred during export', 'error');
    } finally {
      setLoader(false);
    }
  };
  const selectBoxArray = [];
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {open && (
        <CreateNewReportModal
          open={open}
          handleClose={handleClose}
          selectBoxArray={selectBoxArray}
          loader={loader}
          setFromdate={setFromdate}
          setTodate={setTodate}
          onExport={handleClick}
          // renderDateRange={renderDateRange}
        />
      )}
      <Container fixed>
        <Box className="search-bar-filter-and-table-container">
          <Box
            className="search-bar-filter-container"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <SoftTypography variant="h6" color="white">
              <strong>Coupon report</strong>
            </SoftTypography>
            <SoftButton size="small" onClick={handleOpen}>
              + Create new report
            </SoftButton>
          </Box>
          <SoftBox style={{ padding: '15px' }}>
            <SalesGradientLineChart />
          </SoftBox>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default MarketingReportChart;
