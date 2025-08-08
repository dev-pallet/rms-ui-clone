import React, { useState } from 'react';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../components/SoftBox';
import { Grid, Typography } from '@mui/material';
import './products-new-page.css';
import { useNavigate } from 'react-router-dom';
import ComingSoonAlert from './ComingSoonAlert';

const ProductsMainPage = () => {
  const navigate = useNavigate();
  const isRestaurant = localStorage.getItem('retailType') === 'RESTAURANT';

  const [openComingSoon, setOpenComingSoon] = useState(false);

  const handleOpenComingSoon = () => {
    setOpenComingSoon(true);
  };

  const handleCloseComingSoon = () => {
    setOpenComingSoon(false);
  };

  const onCard = (path, name) => {
    if (name === 'Pallet IQ') {
      handleOpenComingSoon();
      return;
    }
    if (name == 'Recipe') {
      handleOpenComingSoon();
      return;
    }
    navigate(`/products/${path}`);
  };

  const allWidgets = [
    {
      name: 'Pallet IQ',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20auto%20awesome.png',
      desc: 'Use Pallet IQ to autogenerate category, brands, department, products and more. Manage duplicates automatically.',
      adittional: '',
      path: '',
    },
    !isRestaurant && {
      name: 'Department',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20code%20branch%20(1).png',
      desc: 'Manage product departments for better reporting and product assortment',
      adittional: '17 active departments',
      path: 'department',
    },
    !isRestaurant && {
      name: 'Brand',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20fingerprint%20(1).png',
      desc: 'Manage all the brands and sub-brands sold in your stores across all locations.',
      adittional: '523 brands',
      path: 'brand',
    },
    isRestaurant && {
      name: 'Prep Station',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/share.png',
      desc: 'Manage preparation stations and connect them to kitchen operations.',
      adittional: 'Kitchen configured',
      path: 'prep-station',
    },
    {
      name: 'Tax',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20real%20estate%20agent%20(1).png',
      desc: 'Manage product sales tax for domestic and export sales',
      adittional: '',
      path: 'tax',
    },
    {
      name: 'Online Category',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20system%20security%20update%20good%20(1).png',
      desc: 'Get your store online ready with categories your customers easily understand and navigate',
      adittional: '12 Categories',
      path: 'online-category',
    },
    {
      name: 'Bulk Upload',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20cloud%20upload%20(1).png',
      desc: 'Upload products, brands and vendors and more in bulk to save time.',
      adittional: 'Last Updated',
      path: 'bulk-products',
    },
    {
      name: 'Assortment Mapping',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20cloud%20upload%20(1).png',
      desc: 'Manage products and brands you choose sell across stores and from your master product data.',
      adittional: 'Last Updated',
      path: 'assortment-mapping',
    },
    {
      name: 'Product Pricing',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20currency%20rupee%20(1).png',
      desc: 'Manage product selling price and margins in bulk and across all locations.',
      adittional: 'Last Updated',
      path: 'bulk-price-edit',
    },
    {
      name: 'Bulk Price Edit',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20currency%20rupee%20(1).png',
      desc: 'Manage product selling price in bulk by uploading a file',
      adittional: 'Last Updated',
      path: 'price-edit-upload',
    },
    {
      name: 'Recipe',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20outdoor%20grill%20(1).png',
      desc: 'Get your store online ready with categories your customers easily understand and navigate.',
      adittional: '132 recipes',
      path: 'recipe',
    },
    {
      name: 'Image Upload',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/share.png',
      desc: 'Upload Bulk photos and get the link created.',
      adittional: 'Last Updated',
      path: 'url-generator',
    },
  ]?.filter(Boolean);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox className="products-main-new-page-box">
          <Typography className="products-main-page-title">Product Master</Typography>
          <SoftBox className="products-main-widgets-box">
            <Grid container spacing={3}>
              {allWidgets.map((item, idx) => {
                return (
                  <Grid item lg={4} sm={12} md={12} xs={12} key={idx}>
                    <div className="products-main-widget-div" onClick={() => onCard(item?.path, item?.name)}>
                      <div className="products-main-widget-top">
                        <img src={item?.icon} className="products-main-widget-icon" alt={item?.name} />
                        <h2 className="products-main-widget-title">{item?.name}</h2>
                      </div>
                      <div>
                        <h3 className="products-main-widget-desc">{item?.desc}</h3>
                      </div>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
            <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default ProductsMainPage;
