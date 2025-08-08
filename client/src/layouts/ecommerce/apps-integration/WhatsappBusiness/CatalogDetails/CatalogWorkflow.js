import { Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';

const CatalogWorkflow = () => {
  return (
    <div>
      <SoftBox className="catalog-details-workflow-main-box">
        <div className='catalog-details-workflow-div'>
          <div className="catalog-details-workflow-single-div">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/online-shop_313137.png"
              alt=""
              style={{ width: '80px', height: '80px' }}
            />
            <Typography className="catalog-details-workflow-steps-typo">Catalog</Typography>
          </div>
          <div className="catalog-details-workflow-single-div">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/map_854878.png"
              alt=""
              style={{ width: '80px', height: '80px' }}
            />
            <Typography className="catalog-details-workflow-steps-typo">Address</Typography>
          </div>
        </div>
        <div className='catalog-details-workflow-div'>
          <div className="catalog-details-workflow-single-div">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/payment_8072450.png"
              alt=""
              style={{ width: '80px', height: '80px' }}
            />
            <Typography className="catalog-details-workflow-steps-typo">Payment</Typography>
          </div>
          <div className="catalog-details-workflow-single-div">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/online-shopping_3501758.png"
              alt=""
              style={{ width: '80px', height: '80px' }}
            />
            <Typography className="catalog-details-workflow-steps-typo">Order Confirmation</Typography>
          </div>
          <div className="catalog-details-workflow-single-div">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/approved_2154353.png"
              alt=""
              style={{ width: '80px', height: '80px' }}
            />
            <Typography className="catalog-details-workflow-steps-typo">Delivery Status</Typography>
          </div>
        </div>
        <SoftBox className='catalog-details-button-box'>
          <SoftButton className="vendor-add-btn" disabled>Rearrange</SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default CatalogWorkflow;
