import { Divider, Grid, Stack } from '@mui/material';
import { isSmallScreen } from '../../../../../Common/CommonFunction';

const BillingDataRow = ({ label, value, isBold = false, hasDivider = false }) => {
  return (
    <Grid container>
      <Grid item lg={8} md={8} sm={8} xs={8}>
        <Stack alignItems={'flex-end'}>
          <span className={`card-small-title ${isBold ? 'bold' : ''}`}>{label}</span>
        </Stack>
      </Grid>
      <Grid item lg={4} md={4} sm={4} xs={4}>
        <Stack alignItems={'center'}>
          <span className={`card-small-title ${isBold ? 'bold' : ''}`}>{value}</span>
        </Stack>
        {hasDivider && <Divider className="common-divider-mob-cards" />}
      </Grid>
    </Grid>
  );
};

export default BillingDataRow;
