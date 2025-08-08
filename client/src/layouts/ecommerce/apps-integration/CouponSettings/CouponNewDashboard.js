import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import { CouponDashboardApi, couponDashboardDetails, exportCouponUsage } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import Coupondetails from './Coupondetails';


// material-ui
import { styled, useTheme } from '@mui/material/styles';

// project imports
import MainCard from '../../../dashboard widgets/StockOverview/MainCard';

// assets
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SoftButton from '../../../../components/SoftButton';
import CreateCouponModal from './CreateCouponModal';

import DiscountIcon from '@mui/icons-material/Discount';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'rgb(30, 136, 229)',
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  minHeight: '8.5rem',
  justifyContent: 'center',
  alignItems: 'flex-start',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(210.04deg, rgb(144, 202, 249) -50.94%, rgba(144, 202, 249, 0) 83.49%)',
    borderRadius: '50%',
    top: -30,
    right: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)',
    borderRadius: '50%',
    top: -160,
    right: -130,
  },
}));

const CouponNewDashboard = () => {
  const theme = useTheme();
  const [couponData, setCouponData] = useState([]);
  const [cData, setCData] = useState({});
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [sChannel, setSChannel] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const payload = {
      orgId: orgId,
      orgLocId: locId,
    };
    CouponDashboardApi(payload)
      .then((res) => {
        setCouponData(res?.data?.data);
      })
      .catch((err) => {});
    const cPayload = {
      orgId: orgId,
      locationId: locId,
    };
    couponDashboardDetails(cPayload).then((response) => {
      setCData({
        totalDiscount: response?.data?.data?.totalDiscount,
        avgDiscountPerOrder: response?.data?.data?.totalDiscount,
        uniqueCustomers: response?.data?.data?.totalDiscount,
        repeatedCustomers: response?.data?.data?.totalDiscount,
        totalOrder: response?.data?.data?.totalDiscount,
        avgDiscountPerOrder: response?.data?.data?.avgDiscountPerOrder,
      });
      setSChannel(response?.data?.data?.discountChannels);
    });
  }, []);

  const handleUsageExport = async () => {
    const payload = {
      startDate: '',
      endDate: '',
      locationId: locId,
    };

    try {
      const response = await exportCouponUsage(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'CouponUsage.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <SoftBox>
          <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Usage</SoftTypography>
        </SoftBox>

        <SoftBox style={{ display: 'flex', gap: '20px' }}>
          <CreateCouponModal />
          <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/Coupons/types')}>
            Create Coupons
          </SoftButton>
        </SoftBox>
      </SoftBox>

      <Grid container spacing={2} justifyContent="space-evenly" style={{ margin: '10px -20px' }}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <div className="campaign-dashboard-card-box">
            <div className="campaign-dashboard-inner-box">
              <div
                className="campaign-dashboard-card-img"
                style={{ background: 'linear-gradient(60deg, #5E35B1, #039BE5)' }}
              >
                <ConfirmationNumberIcon sx={{ fontSize: '40px', color: '#fff' }} />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'right',
                  }}
                >
                  All Coupons
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  {Number(couponData?.activeCoupons) + Number(couponData?.expiredCoupon) || 0} coupons
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <div className="campaign-dashboard-card-box">
            <div className="campaign-dashboard-inner-box">
              <div
                className="campaign-dashboard-card-img"
                style={{ background: 'linear-gradient(60deg, #F50057, #FF8A80)' }}
              >
                <ConfirmationNumberIcon sx={{ fontSize: '40px', color: '#fff' }} />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'right',
                  }}
                >
                  Active Coupons
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  {couponData?.activeCoupons || 0} coupons
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <div className="campaign-dashboard-card-box">
            <div className="campaign-dashboard-inner-box">
              <div
                className="campaign-dashboard-card-img"
                style={{ background: 'linear-gradient(60deg, #fb8c00, #FFCA29)' }}
              >
                <ConfirmationNumberIcon sx={{ fontSize: '40px', color: '#fff' }} />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'right',
                  }}
                >
                  Expired Coupons
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  {couponData?.expiredCoupon || 0} coupons
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="space-evenly" style={{ margin: '10px -20px' }}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <div className="campaign-dashboard-card-box">
            <div className="campaign-dashboard-inner-box">
              <div
                className="campaign-dashboard-card-img"
                style={{ background: 'linear-gradient(60deg, #43A047, #FFEB3B)' }}
              >
                <DiscountIcon sx={{ fontSize: '40px', color: '#fff' }} />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'right',
                  }}
                >
                  Discount Amount
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  ₹ {Number(cData?.totalDiscount)} from {Number(cData?.totalOrder)} orders
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <div className="campaign-dashboard-card-box">
            <div className="campaign-dashboard-inner-box">
              <div
                className="campaign-dashboard-card-img"
                style={{ background: 'linear-gradient(60deg, #BF40BF, #CBC3E3)' }}
              >
                <PeopleIcon sx={{ fontSize: '40px', color: '#fff' }} />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'right',
                  }}
                >
                  New Customers
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  NA
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <div className="campaign-dashboard-card-box">
            <div className="campaign-dashboard-inner-box">
              <div
                className="campaign-dashboard-card-img"
                style={{ background: 'linear-gradient(60deg, #ff0000, #ff6347 )' }}
              >
                <PeopleIcon sx={{ fontSize: '40px', color: '#fff' }} />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '0.8rem',
                    fontWeight: '200',
                    textAlign: 'right',
                  }}
                >
                  Repeated Customers
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#214053',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  NA
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* coupon table  */}
      <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
        <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Coupons Details</SoftTypography>
      </SoftBox>
      <Coupondetails />
    </DashboardLayout>
  );
};

export default CouponNewDashboard;




