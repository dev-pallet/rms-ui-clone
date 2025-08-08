import StoreIcon from '@mui/icons-material/Store';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SalesMiniStatisticsCard from '../../../dashboard widgets/Sales/totalSales';
import SalesMiniStatisticsCardToday from '../../../dashboard widgets/Sales/totalTodaySales';
import YearlySalesMiniStatisticsCard from '../../../dashboard widgets/Sales/totalyearlySales';

const SellerOverview = () => {
  const usereName = localStorage.getItem('user_name') || '';
  const orgId = localStorage.getItem('orgId');
  const theme = useTheme();
  const isXLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCardToday
            title={{ text: 'Today Sales', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCard
            title={{ text: 'Monthly Sales', fontWeight: 'bold' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <YearlySalesMiniStatisticsCard
            title={{ text: 'Yearly Sales', fontWeight: 'bold' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCardToday
            title={{ text: 'Today\'s Purchase', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCard
            title={{ text: 'Monthly Purchase', fontWeight: 'bold' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <YearlySalesMiniStatisticsCard
            title={{ text: 'Yearly Purchase', fontWeight: 'bold' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <SalesMiniStatisticsCardToday
            title={{ text: 'Profits', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <SalesMiniStatisticsCard
            title={{ text: 'Coupons', fontWeight: 'bold' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default SellerOverview;
