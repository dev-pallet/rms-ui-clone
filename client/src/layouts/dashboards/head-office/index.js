import StoreIcon from '@mui/icons-material/Store';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import OrganisationCard from '../../dashboard widgets/headOfficeWidgets/organisation.js';
import SellersCard from '../../dashboard widgets/headOfficeWidgets/sellers';
import StoresCard from '../../dashboard widgets/headOfficeWidgets/stores';
import { default as SalesMiniStatisticsCard, default as YearlySalesMiniStatisticsCard } from '../../dashboard widgets/Sales/totalSales';
import SalesMiniStatisticsCardToday from '../../dashboard widgets/Sales/totalTodaySales';

const HeadOfficeDefault = () => {
  const usereName = localStorage.getItem('user_name') || '';
  const orgId = localStorage.getItem('orgId');
  const theme = useTheme();
  const isXLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox
        mb={3}
        p={1}
        sx={{
          width: '100% !important',
          zIndex: '10',
        }}
      >
        <SoftTypography
          // className="text-h1"
          // variant={window.innerWidth < '450' ? 'h6' : window.innerWidth < values.sm ? 'h4' : 'h3'}
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
          <p style={{ color: '#3b3c52', marginBottom: '0', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
            Welcome back ,
          </p>
          {/* <span role="img" aria-label="Waving Hand">
                👋
              </span>{' '} */}
          <p style={{ color: '#3b3c52', marginBottom: '0', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
            {usereName}
          </p>{' '}
        </SoftTypography>
      </SoftBox>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <OrganisationCard
            title={{ text: 'Organisation', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <StoresCard
            title={{ text: 'Stores', fontWeight: 'bold' }}
            // percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SellersCard
            title={{ text: 'Sellers', fontWeight: 'bold' }}
            // percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCardToday
            title={{ text: 'Today Sales', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCard
            title={{ text: 'Monthly Sales', fontWeight: 'bold' }}
            // percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <YearlySalesMiniStatisticsCard
            title={{ text: 'Yearly Sales', fontWeight: 'bold' }}
            // percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCardToday
            title={{ text: 'Loyalty Points', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCard
            title={{ text: 'Coupons', fontWeight: 'bold' }}
            // percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <SalesMiniStatisticsCard
            title={{ text: 'Offers', fontWeight: 'bold' }}
            // percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <StoreIcon /> }}
            orgId={orgId}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default HeadOfficeDefault;
