import CallReceivedIcon from '@mui/icons-material/CallReceived';
import SouthIcon from '@mui/icons-material/South';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { Box, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';

const DynamicCouponDetails = () => {
  const navigate = useNavigate();

  const handleImageError = (event) => {
    event.target.src = 'https://i.imgur.com/dL4ScuP.png';
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox mb={2}>
          <SoftBox className="dynamic-coupon-journey-main-box" mb={2}>
            <Typography>Dynamic Coupon</Typography>
            <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/Coupons/dynamic/create')}>
              Create
            </SoftButton>
          </SoftBox>
          <hr />
          <SoftBox mt={2}>
            {/* <Typography className="single-journey-title">Tax Invoice</Typography> */}
            <Grid container spacing={2}>
              <Grid item lg={6}>
                <Typography className="single-journey-desc">
                  Dynamic coupons improve customer engagement and boost sales by creating unique, auto-generated codes
                  tailored to individual customers or segments. They're delivered via email, SMS, or on the invoice for
                  a personalized shopping experience, unlike static coupons with fixed codes and discounts.
                </Typography>
                <Typography className="single-journey-points-start">Advantages:</Typography>
                <ul>
                  <li className="single-journey-points">
                    Tailored discounts based on customer behavior and preferences.
                  </li>
                  <li className="single-journey-points">Compelling, targeted offers drive higher conversion rates.</li>
                  <li className="single-journey-points">Single-use, unique codes mitigate coupon abuse.</li>
                  <li className="single-journey-points">
                    Encourages people to come back and increases how much they spend over time.
                  </li>
                </ul>
              </Grid>
              <Grid item lg={6}>
                <SoftBox className="single-journey-part2-box">
                  <Typography className="single-journey-part2-header">You'll need</Typography>
                  <Typography className="single-journey-part2-point">Pallet Subscription</Typography>
                  <Typography className="single-journey-part2-header">Journey Objective</Typography>
                  <Typography className="single-journey-part2-point">
                    Boosts sales and customer lifetime value
                  </Typography>
                </SoftBox>
              </Grid>
            </Grid>
            <Typography className="single-journey-points-start">Steps to generate coupon</Typography>
          </SoftBox>

          <Box className="table-css-fix-box-scroll-vend-1" id="box-shadow-1">
            <SoftBox className="dynamic-coupon-condtions-box1">
              <Typography className="single-journey-title-2">Create Coupon</Typography>
              <div className="dynamic-criteria-box">
                <div className="dynamic-criteria-div">
                  <Typography className="single-journey-title-2">Coupon Issuance criteria</Typography>
                </div>
                <Typography className="single-journey-title-2-1">
                  Choose any of the 5 criterias, the customer will fulfill in their first purchase to get a dynamic
                  coupon.
                </Typography>
              </div>
              <Grid container spacing={2} mt="20px">
                <Grid item lg={2.3}>
                  <div className="dynamic-coupon-applying-criteria-div">
                    <img
                      className="dynamic-coupon-applying-criteria-div-img"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/inflation_11162949.png"
                      onError={handleImageError}
                    />
                    <Typography className="single-journey-desc">Cart Value</Typography>
                    <Typography className="single-journey-title-2-2">
                      Buy Items worth the minimum cart value.
                    </Typography>
                  </div>
                </Grid>
                <Grid item lg={2.3}>
                  <div className="dynamic-coupon-applying-criteria-div">
                    <img
                      className="dynamic-coupon-applying-criteria-div-img"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/pantry_12391059.png"
                      onError={handleImageError}
                    />
                    <Typography className="single-journey-desc">Product</Typography>
                    <Typography className="single-journey-title-2-2">Buy the particular product.</Typography>
                  </div>
                </Grid>
                <Grid item lg={2.3}>
                  <div className="dynamic-coupon-applying-criteria-div">
                    <img
                      className="dynamic-coupon-applying-criteria-div-img"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/food-basket_6104840.png"
                      onError={handleImageError}
                    />
                    <Typography className="single-journey-desc">Category</Typography>
                    <Typography className="single-journey-title-2-2">
                      Buy any item from the particular category.
                    </Typography>
                  </div>
                </Grid>
                <Grid item lg={2.3}>
                  <div className="dynamic-coupon-applying-criteria-div">
                    <img
                      className="dynamic-coupon-applying-criteria-div-img"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/brand-image_5334820.png"
                      onError={handleImageError}
                    />
                    <Typography className="single-journey-desc">Brand</Typography>
                    <Typography className="single-journey-title-2-2">
                      Buy any item from the particular brand.
                    </Typography>
                  </div>
                </Grid>
                <Grid item lg={2.3}>
                  <div className="dynamic-coupon-applying-criteria-div">
                    <img
                      className="dynamic-coupon-applying-criteria-div-img"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/factory_1064295.png"
                      onError={handleImageError}
                    />
                    <Typography className="single-journey-desc">Manufacturer</Typography>
                    <Typography className="single-journey-title-2-2">Buy any item from the manufacturer.</Typography>
                  </div>
                </Grid>
              </Grid>
              <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <SouthIcon sx={{ fontSize: '50px'}} />
              </SoftBox>
              <SoftBox className="dynamic-coupons-cond-div">
                <Typography className="single-journey-title-21">Dynamic Coupon is generated</Typography>
                <Typography className="single-journey-title-2-2">
                  (This coupon will be valid for certain days and the customer can use it in their next purchase)
                </Typography>
              </SoftBox>
              <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SouthIcon  sx={{ fontSize: '50px'}} />
              </SoftBox>
              <SoftBox className="dynamic-coupons-cond-div">
                <Typography className="single-journey-title-2">on next purchase</Typography>
              </SoftBox>
              <div className="dynamic-criteria-box">
                <div className="dynamic-criteria-div">
                  <Typography className="single-journey-title-2">Coupon Redeeming criteria</Typography>
                </div>
                <Typography className="single-journey-title-2-1">
                  Coupon redeeming criteria is those conditions the customer needs to fulfil to get the rewards of the
                  coupon.
                </Typography>
              </div>
              <SoftBox className="coupon-step4-alignment">
                <CallReceivedIcon sx={{ fontSize: '50px' }} />
                <SouthEastIcon sx={{ fontSize: '50px' }} />
              </SoftBox>
              <SoftBox className="coupon-step4-alignment-second">
                <div>
                  <Typography className="single-journey-title-21" mt="15px">
                    Yes
                  </Typography>
                  <Typography className="single-journey-title-2-2">
                    (Choose condition form above that customer will fulfil to redeem the coupon.)
                  </Typography>
                </div>
                <div>
                  <Typography className="single-journey-title-2">No</Typography>
                  <Typography className="single-journey-title-2-2">
                    (If no condition set, then the rewards of the the coupon will be given on the cart value.)
                  </Typography>
                </div>
              </SoftBox>
              <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SouthIcon  sx={{ fontSize: '50px'}} />
              </SoftBox>
              <div className="dynamic-criteria-box-2">
                <div className="dynamic-criteria-div">
                  <Typography className="single-journey-title-2">Discount</Typography>
                </div>
                <Typography className="single-journey-title-2-1">
                  Choose the rewards that the generated coupon will give to the customer.
                </Typography>
                <SoftBox className="dynamic-coupon-applying-criteria-box">
                  <div className="dynamic-coupon-applying-criteria-div1">
                    <img
                      className="dynamic-coupon-applying-criteria-div-img"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/price-cut_9725525.png"
                      onError={handleImageError}
                    />
                    <Typography className="single-journey-desc">Discount</Typography>
                  </div>
                  <div className="dynamic-coupon-applying-criteria-div1">
                    <img
                      className="dynamic-coupon-applying-criteria-div-img"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/bag_13759064.png"
                      onError={handleImageError}
                    />
                    <Typography className="single-journey-desc">Freebie</Typography>
                  </div>
                </SoftBox>
              </div>
            </SoftBox>
          </Box>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default DynamicCouponDetails;
