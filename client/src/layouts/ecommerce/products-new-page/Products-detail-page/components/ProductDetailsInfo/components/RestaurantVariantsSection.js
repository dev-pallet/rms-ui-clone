import React, { useState } from 'react';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { isSmallScreen } from '../../../../../Common/CommonFunction';

export const CopyToClipboardIcon = ({ textToCopy }) => {
  const [tooltipText, setTooltipText] = useState('Click to copy');

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setTooltipText('Copied!');
        setTimeout(() => {
          setTooltipText('Click to copy');
        }, 1500);
      })
      .catch((err) => {
        setTooltipText('Failed to copy');
      });
  };

  return (
    <Tooltip title={tooltipText} arrow>
      <IconButton onClick={copyToClipboard}>
        <ContentCopyIcon style={{ cursor: 'pointer', fontSize: '18px', color: '#0562FB' }} />
      </IconButton>
    </Tooltip>
  );
};

const RestaurantVariantsSection = ({
  productDetails,
  variants,
  handleRadioButtonChange,
  download,
  d_img,
  getWeightUnitLabel,
}) => {
  const isMobileDevice = isSmallScreen();

  return (
    <>
      {!isMobileDevice && (
        <div className="products-new-details-variants-div product-new-details-overFlow">
          {variants?.map((item, index) => (
            <div
              className={`width-100 products-new-details-variants-box ${item?.checked ? 'selected' : ''}`}
              key={index}
            >
              <div className="flex-column-between-center gap-10 width-100">
                <div className="flex-row-between-center">
                  <div className="flex-row-start-center gap-10">
                    <div style={{ marginTop: '20px' }}>
                      <input
                        type="radio"
                        id={`scheduleYes${index}`}
                        name="scheduleGroup"
                        value={item?.quantity}
                        className="dynamic-coupon-marginright-10"
                        checked={item?.checked}
                        onChange={() => handleRadioButtonChange(item, index)}
                      />
                      <label htmlFor={`scheduleYes${index}`} className="products-new-department-label-typo"></label>
                    </div>
                    {/* <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-value">
                    {item?.weight && item?.weightUnit
                      ? `${item.weight} ${getWeightUnitLabel(item.weightUnit)}`
                      : '-----'}
                  </Typography>
                </div> */}
                    <div className="products-new-details-variants-price">
                      <Typography className="products-new-details-variants-price-typo-value">
                        {item?.name ? `${item?.name}` : '-----'}
                      </Typography>
                    </div>
                  </div>
                  <div className="barcode-container">
                    {item?.barcodeImage && <CopyToClipboardIcon textToCopy={item?.barcodes?.[0]} fontSize="small" />}
                    <img
                      style={{
                        display: item?.barcodeImage ? 'block' : 'none',
                        objectFit: 'cover',
                        height: '60px',
                        marginRight: '2px',
                      }}
                      src={item?.barcodeImage ? item?.barcodeImage : d_img}
                      alt=""
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                      {item?.barcodeImage && (
                        <DownloadIcon onClick={() => download(item?.barcodeImage)} fontSize="small" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-row-between-center" onClick={() => handleRadioButtonChange(item, index)}>
                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">Short code</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.shortCode ? item?.shortCode : '-----'}
                    </Typography>
                  </div>
                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">UOM</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.weight && item?.weightUnit
                        ? `${item.weight} ${getWeightUnitLabel(item.weightUnit)}`
                        : '-----'}
                    </Typography>
                  </div>

                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">Prep Time</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.prepTime ? item?.prepTime : '-----'}
                    </Typography>
                  </div>
                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">Calories</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.calories ? item?.calories : '-----'}
                    </Typography>
                  </div>
                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">KDS</Typography>
                    <Typography className="products-new-details-variants-price-typo-value" style={{ color: 'green' }}>
                      {item?.sendToKds ? 'Yes' : 'No'}
                    </Typography>
                  </div>
                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">Prep Station</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.choosePrepStation?.displayName || '-----'}
                    </Typography>
                  </div>
                  {/* <div className="products-new-details-variants-price">
                <Typography className="products-new-details-variants-price-typo-sm">MRP</Typography>
                <Typography className="products-new-details-variants-price-typo-value">
                  {item?.inventorySync?.mrp ? item?.inventorySync?.mrp : '-----'}
                </Typography>
              </div> */}
                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">Tax Status</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.taxStatus ? item?.taxStatus : '-----'}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isMobileDevice && (
        <div className="products-new-details-variants-div product-new-details-overFlow">
          {variants?.map((item, index) => (
            <div
              className={`products-new-details-variants-box ${item?.checked ? 'selected' : ''}`}
              key={index}
              style={{ width: '100%' }}
            >
              <Grid container spacing={0.5}>
                <Grid item lg={0.5} style={{ width: '100%' }}>
                  <div className="stack-row-center-between gap-10" style={{ width: '100%' }}>
                    <div className="stack-row-center-start gap-10" style={{ width: '100%' }}>
                      <input
                        type="radio"
                        id={`scheduleYes${index}`}
                        name="scheduleGroup"
                        value={item?.quantity}
                        className="dynamic-coupon-marginright-10"
                        checked={item?.checked}
                        onChange={() => handleRadioButtonChange(item, index)}
                      />
                      <label htmlFor={`scheduleYes${index}`} className="products-new-department-label-typo"></label>
                      <div className="products-new-details-variants-price">
                        <Typography className="products-new-details-variants-price-typo-sm">Name</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {item?.name ? `${item?.name}` : '-----'}
                        </Typography>
                      </div>
                    </div>
                    <div className="barcode-container">
                      {item?.barcodeImage && <CopyToClipboardIcon textToCopy={item?.barcodes?.[0]} fontSize="small" />}
                      <img
                        style={{
                          display: item?.barcodeImage ? 'block' : 'none',
                          objectFit: 'cover',
                          height: '60px',
                          marginRight: '2px',
                        }}
                        src={item?.barcodeImage ? item?.barcodeImage : d_img}
                        alt=""
                      />
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                        {item?.barcodeImage && (
                          <DownloadIcon onClick={() => download(item?.barcodeImage)} fontSize="small" />
                        )}
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={8.5}>
                  <div
                    style={{ display: 'flex', gap: '10px', alignItems: 'end' }}
                    onClick={() => handleRadioButtonChange(item, index)}
                  >
                    <div className="products-new-details-variants-price">
                      <Typography className="products-new-details-variants-price-typo-sm">Short Code</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {item?.shortCode ? item?.shortCode : '-----'}
                      </Typography>
                    </div>
                    <div className="products-new-details-variants-price">
                      <Typography className="products-new-details-variants-price-typo-sm">UOM</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {item?.weight && item?.weightUnit
                          ? `${item.weight} ${getWeightUnitLabel(item.weightUnit)}`
                          : '-----'}
                      </Typography>
                    </div>
                    <div className="products-new-details-variants-price">
                      <Typography className="products-new-details-variants-price-typo-sm">Prep time</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {' '}
                        {item?.prepTime ? item?.prepTime : '-----'}
                      </Typography>
                    </div>
                    <div className="products-new-details-variants-price">
                      <Typography className="products-new-details-variants-price-typo-sm">Calories</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {item?.calories ? item?.calories : '-----'}
                      </Typography>
                    </div>
                    <div className="products-new-details-variants-price">
                      <Typography className="products-new-details-variants-price-typo-sm">KDS</Typography>
                      <Typography className="products-new-details-variants-price-typo-value">
                        {item?.sendToKds ? 'Yes' : 'No'}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RestaurantVariantsSection;
