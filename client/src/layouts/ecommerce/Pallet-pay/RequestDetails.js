import { Card, Grid, Skeleton } from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import TimelineItem from 'examples/Timeline/TimelineItem';
import TimelineList from 'examples/Timeline/TimelineList';
const RequestDetails = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox style={{ borderBottom: '1px solid lightgray', marginBottom: '10px' }}>
        <SoftTypography style={{ fontWeight: 'bold', fontSize: '1rem' }}>Detailed Request</SoftTypography>
      </SoftBox>

      <Grid container spacing={3}>
        <Grid item md={6}>
          <TimelineList title="Timeline">
            <TimelineItem
              color="success"
              icon="notifications"
              title="$2400 Design changes"
              dateTime="22 DEC 7:20 PM"
              description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
              badges={['Machine Requested']}
            />
            <TimelineItem
              color="error"
              icon="inventory_2"
              title="New order #1832412"
              dateTime="21 DEC 11 PM"
              description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
              badges={['order', '#1832412']}
            />
            <TimelineItem
              icon="shopping_cart"
              title="Server payments for April"
              dateTime="21 DEC 9:34 PM"
              description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
              badges={['server', 'payments']}
              lastItem
            />
          </TimelineList>
        </Grid>

        <Grid item md={6} spacing={3}>
          <Card style={{ padding: '20px' }}>
            <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SoftTypography style={{ fontSize: '1rem' }}>Machine Name : </SoftTypography>
              <SoftTypography style={{ fontSize: '1rem' }}>____________________</SoftTypography>
            </SoftBox>
            <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SoftTypography style={{ fontSize: '1rem' }}>Type :</SoftTypography>
              <SoftTypography style={{ fontSize: '1rem' }}>____________________</SoftTypography>
            </SoftBox>
            
          </Card>

          <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '20px' }}>
            <Card style={{ width: '50%', paddingInline: '15px' ,border: '1px solid lightgray' }}>
              <SoftTypography style={{ fontSize: '1rem' }}>Billing Information :</SoftTypography>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <br />
            </Card>

            <Card style={{ width: '50%', paddingInline: '15px' ,border: '1px solid lightgray' }}>
              <SoftTypography style={{ fontSize: '1rem' }}>Shipping Information :</SoftTypography>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <br />
            </Card>
          </SoftBox>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default RequestDetails;
