import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useState } from 'react';
import SoftBox from '../../../../components/SoftBox';

const CreateCouponMainPage = () => {
  const [selectedTab, setSelectedTab] = useState('Static');
  const [openModalDynamic, setOpenModalDynamic] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox style={{ display: 'flex', gap: '50px' }}>
          <Typography className="tab-template">Static</Typography>
        </SoftBox>
        <SoftBox className="coupons-main-page-type-box">
          <div
            className="coupons-main-page-type-single"
            onClick={() => {
              navigate('/marketing/Coupons/static/details/cart');
              localStorage.setItem('couponType', 'Cart Value');
            }}
          >
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/INSTAGRAM%20POST%20(1).png"
              className="coupons-main-page-type-single-img"
            />
            <Typography className="coupons-main-page-single-typo">By Cart Value</Typography>
          </div>
          <div
            className="coupons-main-page-type-single"
            onClick={() => {
              navigate('/marketing/Coupons/static/details/product');
              localStorage.setItem('couponType', 'Product');
            }}
          >
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/composition-decorative-cosmetics-women.jpg"
              className="coupons-main-page-type-single-img"
            />
            <Typography className="coupons-main-page-single-typo">By Product</Typography>
          </div>

          <div
            className="coupons-main-page-type-single"
            onClick={() => {
              navigate('/marketing/Coupons/static/details/preapproved');
              localStorage.setItem('couponType', 'Preapproved');
            }}
          >
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/award_ribbon_check_mark_with_stars.jpg"
              className="coupons-main-page-type-single-img"
            />
            <Typography className="coupons-main-page-single-typo">Preapproved</Typography>
          </div>
        </SoftBox>
        <Typography className="tab-template" style={{ marginTop: '20px' }}>
          Dynamic
        </Typography>
        <SoftBox className="coupons-main-page-type-box">
          <div
            className="coupons-main-page-type-single"
            onClick={() => navigate('/marketing/Coupons/types/dynamic/details')}
          >
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/hand-holding-receipt-shopping-campaign.jpg"
              className="coupons-main-page-type-single-img"
            />
            <Typography className="coupons-main-page-single-typo" style={{ marginBottom: '20px' }}>
              Tax Invoice
            </Typography>
          </div>
          {/* <div className="coupons-main-page-type-single not-allowed">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/shopping-cart-miniature.jpg"
              className="coupons-main-page-type-single-img less-opacity"
            />
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/sl_120320_38530_07-removebg-preview.png"
              className="coming-soon-dynamic-img"
            />
            <Typography className="coupons-main-page-single-typo" style={{ marginBottom: '20px' }}>
              Abandoned Cart
            </Typography>
          </div>
          <div className="coupons-main-page-type-single not-allowed">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/beautiful-gift-voucher-with-hand.jpg"
              className="coupons-main-page-type-single-img less-opacity"
            />
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/sl_120320_38530_07-removebg-preview.png"
              className="coming-soon-dynamic-img"
            />
            <Typography className="coupons-main-page-single-typo" style={{ marginBottom: '20px' }}>
              Welcome
            </Typography>
          </div> */}
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default CreateCouponMainPage;
