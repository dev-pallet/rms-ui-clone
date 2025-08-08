import './index.css';
import { CircularProgress, Grid } from '@mui/material';
import { JobDetails } from './components/job-details/job-details';
import { SessionCard } from './components/sessioncard/index';
import { getAllStockSessions } from '../../../../config/Services';
import { isSmallScreen } from '../../Common/CommonFunction';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import BottomNavbar from '../../../../examples/Navbars/BottomNavbarMob';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import Swal from 'sweetalert2';

export const StockCountDetails = () => {
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = user_details && JSON.parse(user_details).uidx;
  const roles = localStorage.getItem('user_roles');
  const hasAccess = roles.includes('RETAIL_USER');

  const { data: sessionList, isLoading: sessionListLoading } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    queryKey: ['sessionList'],
    queryFn: async () => {
      const payload = {
        pageNo: 1,
        pageSize: 99,
        orgId,
        locId,
        uidx,
      };
      const response = await getAllStockSessions(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        throw new Error(response?.data?.data?.message);
      }
      return response?.data?.data?.data?.data;
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const handleProductCount = (sessionId) => {
    navigate(`/stock-taking/stock-items-list/${sessionId}`);
  };

  const checkAccess = () => {
    if (!hasAccess) {
      Swal.fire({
        icon: 'error',
        title: 'You do not have access to this page',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(-1);
      });
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  const renderSessionList = () => {
    if (sessionListLoading) {
      return (
        <SoftBox display="flex" alignItems="center" justifyContent="center" flex={1}>
          <CircularProgress size={40} className="circular-progress-loader" />
        </SoftBox>
      );
    }
    if (!sessionList?.length) {
      return (
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <SoftTypography
            variant="h4"
            fontSize="1.2rem"
            fontWeight="bold"
            sx={{
              textAlign: 'center',
            }}
          >
            No sessions available
          </SoftTypography>
        </Grid>
      );
    }
    return sessionList?.map((session, index) => (
      <Grid item lg={6} md={6} sm={12} xs={12} key={index}>
        <SessionCard sessionDetails={session} onClick={() => handleProductCount(session?.sessionId)} />
      </Grid>
    ));
  };

  return (
    <DashboardLayout>
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob" mb={2}>
          <MobileNavbar title={'Sessions'} />
        </SoftBox>
      )}
      {!isMobileDevice && <DashboardNavbar />}
      {hasAccess && isMobileDevice && (
        <SoftBox>
          <Grid container spacing={2}>
            {renderSessionList()}
          </Grid>
        </SoftBox>
      )}
      {hasAccess && !isMobileDevice && <JobDetails />}
      {isMobileDevice && <BottomNavbar />}
    </DashboardLayout>
  );
};
