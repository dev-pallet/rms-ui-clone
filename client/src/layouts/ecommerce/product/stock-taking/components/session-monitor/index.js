import './index.css';
import { CircularProgress, Grid } from '@mui/material';
import { SessionCard } from '../sessioncard';
import { getAllStockSessionsById } from '../../../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';

export const StockSessionMonitor = () => {
  const { id } = useParams();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const handleSessionMonitor = (sessionId) => {
    navigate(`/stock-taking/session-monitor/dashboard/${sessionId}`);
  };

  const { data: sessionList, isLoading: sessionListLoading } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    queryKey: ['sessionListById'],
    queryFn: async () => {
      const payload = {
        pageNo: 1,
        pageSize: 99,
        jobId: id,
      };
      const response = await getAllStockSessionsById(payload);
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
        <div className="no-session-available">
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
        </div>
      );
    }
    return sessionList?.map((session, index) => (
      <Grid item lg={6} md={6} sm={12} xs={12} key={index}>
        <SessionCard sessionDetails={session} onClick={() => handleSessionMonitor(session?.sessionId)} />
      </Grid>
    ));
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
        Sessions
      </SoftTypography>
      <Grid container spacing={3}>
        {renderSessionList()}
      </Grid>
    </DashboardLayout>
  );
};
