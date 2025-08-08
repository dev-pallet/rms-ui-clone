import { Grid } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PersonIcon from '@mui/icons-material/Person';
import AnimatedStatisticsCard from '../../../../../../../../examples/Cards/StatisticsCards/AnimatedStatisticsCard';
import MiniStatisticsCard from '../../../../../../../../examples/Cards/StatisticsCards/MiniStatisticsCard';
import SoftBox from './../../../../../../../../components/SoftBox/index';

export const DashBoardcard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={4}>
        <SoftBox mb={3}>
          <AnimatedStatisticsCard
            title="PI Age"
            count={500}
            percentage={{
              color: 'dark',
              label: `Due in ${'5'} days`,
            }}
            action={{
              type: 'internal',
              route: '',
              label: 'In Progress',
            }}
          />
        </SoftBox>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <SoftBox mb={3}>
          <MiniStatisticsCard
            title={{ color: 'info', fontWeight: 'medium', text: 'Quotes Recieved' }}
            // count={quotesRecieved}
            // icon={{ color: 'dark', component: 'local_atm' }}
            icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
            direction="left"
          />
        </SoftBox>
        <SoftBox mb={3}>
          <MiniStatisticsCard
            title={{ color: 'info', fontWeight: 'medium', text: 'Assigned To' }}
            // count={resAssign}
            icon={{ color: 'dark', component: <PersonIcon /> }}
            direction="left"
          />
        </SoftBox>
        <SoftBox mb={3}>
          <MiniStatisticsCard
            title={{ color: 'info', fontWeight: 'medium', text: 'Shipment Method' }}
            // count={shippingMethod}
            icon={{ color: 'dark', component: 'public' }}
            direction="left"
          />
        </SoftBox>
        <MiniStatisticsCard
          title={{ color: 'info', fontWeight: 'medium', text: 'Vendors' }}
          //   count={povalue.vendors}
          icon={{ color: 'dark', component: 'emoji_events' }}
          direction="left"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <SoftBox mb={3}>
          <MiniStatisticsCard
            title={{ color: 'info', fontWeight: 'medium', text: "P.O's created" }}
            // count={povalue.posCreated}
            icon={{ color: 'dark', component: 'public' }}
            direction="left"
          />
        </SoftBox>
        <SoftBox mb={3}>
          <MiniStatisticsCard
            title={{ color: 'info', fontWeight: 'medium', text: 'Approved By' }}
            // count={newapprovedBy}
            icon={{ color: 'dark', component: <PersonIcon /> }}
            direction="left"
          />
        </SoftBox>
        <SoftBox mb={3}>
          <MiniStatisticsCard
            title={{ color: 'info', fontWeight: 'medium', text: 'Shipment Terms' }}
            // count={shippingTerms}
            icon={{ color: 'dark', component: 'public' }}
            direction="left"
          />
        </SoftBox>

        <MiniStatisticsCard
          title={{ color: 'info', fontWeight: 'medium', text: 'P.O value' }}
          //   count={povalue.poValue}
          icon={{ color: 'dark', component: 'storefront' }}
          direction="left"
        />
      </Grid>
    </Grid>
  );
};
