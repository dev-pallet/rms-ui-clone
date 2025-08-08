import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Card, Grid, Menu, MenuItem, Typography } from '@mui/material';
import './index.css';

import PercentIcon from '@mui/icons-material/Percent';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import { listAllOfferAndPromo } from '../../../config/Services';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { isSmallScreen } from '../Common/CommonFunction';
import ListingAllOffer from './components/list-all/listingAllOffer';

const OfferAndPromoList = () => {
  const contextType = localStorage.getItem('contextType');

  const isMobileDevice = isSmallScreen();
  const [totalOffers, setTotalOffers] = useState(0);
  const [activeOffers, setActiveOffers] = useState(0);
  const [inActiveOffers, setInActiveOffers] = useState(0);
  const showSnackbar = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItem = () => {
    handleClose();
    navigate('/marketting/offers-promotions/create/by-item');
  };

  const handleCategory = () => {
    handleClose();
    navigate('/marketting/offers-promotions/create/by-category');
  };
  const handleCartValue = () => {
    handleClose();
    navigate('/marketting/offers-promotions/create/by-cart-value');
  };

  useEffect(() => {
    const payload = {};
    listAllOfferAndPromo(payload)
      .then((res) => {
        const response = res?.data?.data;
        if (response?.es) {
          showSnackbar(response?.message, 'error');
          return;
        }
        setTotalOffers(response?.data?.resultQuantity);
        const activeArray = response?.data?.object?.filter((item) => item.offerStatus === 'ACTIVE');
        const inActiveArray = response?.data?.object?.filter((item) => item.offerStatus === 'INACTIVE');
        if (activeArray.length > 0) {
          setActiveOffers(activeArray.length);
        }
        if (inActiveArray.length > 0) {
          setInActiveOffers(inActiveArray.length);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="offerMaindiv">
        <SoftBox
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <SoftBox width="100%">
            <SoftBox
              display="flex"
              flexDirection={isMobileDevice ? 'column' : 'row'}
              justifyContent="space-between"
              alignItems={isMobileDevice ? 'stretch' : 'center'}
            >
              <SoftTypography variant="h5" fontWieght="bold">
                Offers and Promotions
              </SoftTypography>
              <SoftButton color="info" onClick={handleClick}>
                {' '}
                + Create Offers
              </SoftButton>
            </SoftBox>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleItem}>By Item</MenuItem>
              <MenuItem onClick={handleCategory}>By Category/ Brand</MenuItem>
              <MenuItem onClick={handleCartValue}>By Cart Value</MenuItem>
            </Menu>
            <SoftTypography variant="h6">Boost sales by giving customers special offers and discounts</SoftTypography>
          </SoftBox>

          <SoftBox>
            {/* <SoftButton color="info" onClick={handleUsageExport}>
                <GiCloudDownload style={{ marginRight: '5px' }} /> Export
            </SoftButton> */}
            {/* <CreateCouponModal/> */}
          </SoftBox>
        </SoftBox>
        <Grid container spacing={2} style={{ margin: '10px -20px', padding: '10px' }}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
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
                    Total Offers
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
                    {totalOffers || 0}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
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
                    Active Offers
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
                    {activeOffers || 0}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
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
                    Inactive Offers
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
                    {inActiveOffers || 0}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
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
                    Expired Offers
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
                    0
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #43A047, #FFEB3B)' }}
                >
                  <PercentIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    Conversion Rates
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
                    0
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <div className="campaign-dashboard-card-box">
              <div className="campaign-dashboard-inner-box">
                <div
                  className="campaign-dashboard-card-img"
                  style={{ background: 'linear-gradient(60deg, #BF40BF, #CBC3E3)' }}
                >
                  <CurrencyRupeeIcon sx={{ fontSize: '40px', color: '#fff' }} />
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
                    Revenue Generated
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
                    0
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        {!isMobileDevice && (
          <>
            <SoftBox style={{ marginTop: '20px', marginBottom: '20px' }}>
              <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Offers Details</SoftTypography>
            </SoftBox>
            <ListingAllOffer />
          </>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default OfferAndPromoList;
