/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// Soft UI Dashboard PRO React components
import SoftBox from '../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../components/SoftTypography';

import '../../../../../product/all-products/components/product-details/components/ProductInfo/prod-inffo.css';
import { addItemsToSalesCart } from '../../../../../../../config/Services';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

export const ProductInfo = ({ datRows, price, gtin, gotoCart,cartQuant }) => {
  
  const [cartLoader, setCartLoader] = useState(false);
  const [addedtoCart, setAddtoCart] = useState(false);
  const [quantityChange, setQuantityChange] = useState('');
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const locId = localStorage.getItem('locId');
  const cartId = localStorage.getItem('cartId-MP');

  const handleNewCart = (gtin) => {
    setCartLoader(true);
    addItemsToSalesCart(cartId, gtin, locId)
      .then((res) => {
        setAddtoCart(true);
        setCartLoader(false);
        setAlertmessage('Product added to cart');
        setTimelineerror('success');
        setTimeout(() => {
          handleopensnack();
        }, 100);
      })
      .catch((error) => {
        setCartLoader(false);
      });
  };

  useEffect(() => {
  }, [addedtoCart]);

  return (
    <SoftBox>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <SoftBox mb={1}>
        <SoftBox className="prod-mini-box">
          <SoftTypography variant="h6" fontWeight="small" className="fruits-text">
            {datRows?.main_category}
            {datRows.category_level_1 && <KeyboardArrowRightIcon className="left-icon-fruits" />}
            {datRows?.category_level_1}
            {datRows.category_level_2 && <KeyboardArrowRightIcon />}
            {datRows?.category_level_2}
          </SoftTypography>
        </SoftBox>

        <SoftTypography variant="h3" fontWeight="bold">
          {datRows.name}
        </SoftTypography>

        <SoftTypography component="label" variant="caption" fontWeight="bold">
          {datRows?.weights_and_measures?.net_weight}
          {datRows?.weights_and_measures?.measurement_unit}
        </SoftTypography>
      </SoftBox>

      <SoftBox className="price-prod-box-flex">
        <SoftBox mt={1} className="first-price-box">
          <SoftTypography variant="h6" fontWeight="medium">
            Sale Price
          </SoftTypography>
          <SoftTypography variant="h5" fontWeight="medium">
            
            {price?.sellingPrice < price?.mrp && price?.comparePrice === 'Y' ? (
              <>
                <span className="mrp">₹{price?.mrp}</span>
                <span className="sell">₹{price?.sellingPrice}</span>
              </>
            ) : (
              <>
                <span className="sell">₹{price?.sellingPrice}</span>
              </>
            )}
          </SoftTypography>
        </SoftBox>

        {/* <SoftBox mt={1} className="first-price-box">
          <SoftTypography variant="h6" fontWeight="medium">
            Purchase Price
          </SoftTypography>
          <SoftTypography variant="h5" fontWeight="medium">
            ₹{price?.purchasePrice || 0}
          </SoftTypography>
        </SoftBox> */}
      </SoftBox>
      {/* 
      <SoftBox className="badge-box">
        <SoftBadge variant="contained" color="success" badgeContent="in stock" container />
        <SoftBadge variant="contained" color="warning" badgeContent="Non Returnable " container />
      </SoftBox> */}
      {permissions?.RETAIL_Marketplace?.WRITE || permissions?.WMS_Marketplace?.WRITE || permissions?.VMS_Marketplace?.WRITE
        ? <Box mt="20px" display="flex" gap="20px">
          <SoftButton className="add-btn" onClick={() => handleNewCart(gtin)}>
              Add to Cart{' '}
          </SoftButton>
        </Box>
        :null  
      }

      <SoftBox mt={3} mb={1} ml={0.5}>
        <SoftTypography variant="caption" fontWeight="bold">
          Description
        </SoftTypography>
      </SoftBox>
      <SoftBox component="ul" m={0} pl={4} mb={2}>
        {datRows?.derived_description == null 
          ?null
          :
          <SoftBox component="li" color="text" fontSize="1.25rem" lineHeight={1}>
            <SoftTypography variant="body2" color="text" verticalAlign="middle">
              {datRows?.derived_description}
            </SoftTypography>
          </SoftBox>
        }
        
        <SoftBox component="li" color="text" fontSize="1.25rem" lineHeight={1}>
          <SoftTypography variant="body2" color="text" verticalAlign="middle">
            {datRows.description}
          </SoftTypography>
        </SoftBox>
      </SoftBox>
      <SoftBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Manufacturer
              </SoftTypography>
            </SoftBox>
            <p className="hidden-input"> {datRows?.company_detail?.name}</p>
          </Grid>
        </Grid>
      </SoftBox>
    </SoftBox>
  );
};
ProductInfo.propTypes = {
  datRows: PropTypes.object,
};
