import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import GradientLineChart from '../../../../examples/Charts/LineCharts/GradientLineChart';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import Typography from '@material-ui/core/Typography';
// import Chart from './Chart'; // You'll need to create a Chart component for data visualization.
import { individualCoupon } from '../../../../config/Services';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
const CouponDashboard = () => {
  const classes = useStyles();
  const { CouponId } = useParams();
  const navigate = useNavigate();

  const [couponData, setCouponDetails] = useState([]);
  useEffect(() => {
    individualCoupon(CouponId)
      .then((res) => {
        setCouponDetails(res?.data?.data?.coupon);
      })
      .catch((err) => {});
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card style={{ padding: '20px', marginTop: '10px' }}>
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Coupon Dashboard </div>
          <div style={{ margin: '20px' }}>
            <SoftButton color="info" onClick={() => navigate(`/coupondetails/${CouponId}`)}>
              Edit
            </SoftButton>
          </div>
        </SoftBox>

        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography>Coupon Id</Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: 'ghostwhite', padding: '3px', borderRadius: '9px', fontSize: '1.2rem' }}
                >
                  {CouponId}
                </Typography>
              </Paper>
            </Grid>

            {/* Total Coupons Issued */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography>Total Coupons Issued</Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: 'ghostwhite', padding: '3px', borderRadius: '9px', fontSize: '1.2rem' }}
                >
                  {couponData?.maxTotalUsage || '---'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography>Total Redeemed</Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: 'ghostwhite', padding: '3px', borderRadius: '9px', fontSize: '1.2rem' }}
                >
                  20
                </Typography>
              </Paper>
            </Grid>

            {/* Coupons Remaining */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography>Coupons Remaining</Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: 'ghostwhite', padding: '3px', borderRadius: '9px', fontSize: '1.2rem' }}
                >
                  50
                </Typography>
              </Paper>
            </Grid>

            {/* Coupon Value */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography>Coupon Value</Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: 'ghostwhite', padding: '3px', borderRadius: '9px', fontSize: '1.2rem' }}
                >
                  ₹100
                </Typography>
              </Paper>
            </Grid>

            {/* Total Value Used */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography>Total Discount</Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: 'ghostwhite', padding: '3px', borderRadius: '9px', fontSize: '1.2rem' }}
                >
                  ₹2500
                </Typography>
              </Paper>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Typography >Discount Value</Typography>
            <Typography variant="h5" style={{backgroundColor:"ghostwhite" , padding:"3px" , borderRadius:"9px",fontSize:"1.2rem"}}>₹2500</Typography>
          </Paper>
        </Grid> */}

            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography>Validity</Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: 'ghostwhite', padding: '3px', borderRadius: '9px', fontSize: '1.2rem' }}
                >
                  -------
                </Typography>
              </Paper>
            </Grid>
            {/* Data Visualization */}
            <Grid item xs={12}>
              <GradientLineChart
                title="Coupon Usage Trend"
                chart={{
                  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  datasets: [
                    {
                      label: 'No of Coupons',
                      color: 'dark',
                      data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default CouponDashboard;
