import './index.css';
import { CircularProgress, Grid } from '@mui/material';
import { SchedulerCard } from './components/scheduler-card';
import { getAllSchedulers } from '../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import PlaceholderCard from '../../../../../../examples/Cards/PlaceholderCard';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';

export const Scheduler = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const { data: schedulerList, isLoading: schedulerListLoading } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    queryKey: ['schedulerList'],
    queryFn: async () => {
      const payload = { page: 0, size: 99, orgId: orgId, locId: locId };
      const response = await getAllSchedulers(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        throw new Error(response?.data?.data?.message);
      }
      return response?.data?.data?.schedulerList;
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const handleCreateScheduler = () => {
    navigate('/stock-taking/create-stock-schedule');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox>
        <SoftTypography variant="h4" fontSize="1.2rem" fontWeight="bold">
          Cycle Count Schedule
        </SoftTypography>
        {schedulerListLoading ? (
          <SoftBox display="flex" alignItems="center" justifyContent="center">
            <CircularProgress size={40} className="circular-progress-loader" />
          </SoftBox>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <PlaceholderCard title={{ variant: 'h5', text: 'Create New' }} onClick={handleCreateScheduler} />
            </Grid>
            {schedulerList?.map((scheduler, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <SchedulerCard scheduler={scheduler} />
              </Grid>
            ))}
          </Grid>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};
