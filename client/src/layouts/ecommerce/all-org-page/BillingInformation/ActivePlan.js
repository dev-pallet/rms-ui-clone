import { Card, Container } from '@mui/material';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import './CancelSubscription.css';

const ActivePlan = ({ activePlanDetails }) => {
  const { billingCycle, netPrice, planName, startDate } = activePlanDetails;

  return (
    <Container className="plan-details-card" style={{ padding: '20px' }}>
      <SoftTypography style={{ marginBottom: '10px', color: '#a6a6a6', }}>Your active plan details</SoftTypography>
      <Card style={{ padding: '2rem', backgroundColor: '#fafafa', maxWidth: '25rem',  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px !important' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SoftTypography className="plan-name">Plan Name:</SoftTypography>
            <SoftTypography className="plan-subText">{planName}</SoftTypography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SoftTypography className="plan-start-date">Subscription Start Date:</SoftTypography>
            <SoftTypography className="plan-subText">{startDate}</SoftTypography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SoftTypography className="plan-billingCycle">
              {billingCycle === 'MONTHLY' ? 'Monthly Charge:' : 'Yearly Charge:'}
            </SoftTypography>
            <SoftTypography className="plan-subText">₹{netPrice}</SoftTypography>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default ActivePlan;
