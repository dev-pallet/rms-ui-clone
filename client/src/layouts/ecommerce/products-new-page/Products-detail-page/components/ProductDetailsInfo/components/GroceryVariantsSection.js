import React, { useState } from 'react';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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

const GroceryVariantsSection = ({ variants, handleRadioButtonChange, download, d_img, getWeightUnitLabel }) => {
  return (
    <div className="products-new-details-variants-div product-new-details-overFlow">
      {variants?.map((item, index) => (
        <div className={`products-new-details-variants-box ${item?.checked ? 'selected' : ''}`} key={index}>
          <Grid container spacing={0.5}>
            <Grid item lg={0.5}>
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
            </Grid>
            <Grid item lg={8.5}>
              <div
                style={{ display: 'flex', gap: '10px', alignItems: 'end' }}
                onClick={() => handleRadioButtonChange(item, index)}
              >
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">Specification</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">
                    {item?.weight && item?.weightUnit
                      ? `${item.weight} ${getWeightUnitLabel(item.weightUnit)}`
                      : '-----'}
                  </Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">Purchase Price</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">
                    {item?.purchasePrice}
                  </Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">Purchase Margin</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">
                    {item?.purchaseMargin}
                  </Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">MRP</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">{item?.mrp}</Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">Sale Price</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">{item?.salePrice}</Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">Stock In Hand</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">
                    {item?.availableQty}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item lg={3}>
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
                  {item?.barcodeImage && <DownloadIcon onClick={() => download(item?.barcodeImage)} fontSize="small" />}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default GroceryVariantsSection;
