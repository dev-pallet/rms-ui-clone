import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import vegImage from '../../../../../../../assets/images/veg.jpg';
import nonVegImage from '../../../../../../../assets/images/non-veg.jpg';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { generateBarcodeWithNum } from '../../../../../../../config/Services';

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

const ComboBasicDetails = ({ productDetails }) => {
  const [variants, setVariants] = useState(productDetails?.variants);
  const isMobileDevice = isSmallScreen();

  useEffect(() => {
    if (productDetails?.variants?.length > 0) {
      const updatedVariants = productDetails?.variants?.map((variant, index) => ({
        ...variant,
        barcodeImage: null,
      }));

      const variantPromises = updatedVariants?.map((variant) => {
        const payload = {
          gtin: [variant?.barcodes[0]],
        };

        const barcodePromise = generateBarcodeWithNum(variant?.barcodes[0] || 'NA').catch((err) => {
          showSnackbar(err?.response?.data?.message?.error || 'Error generating barcode', 'error');
          return { data: { data: { image: d_img } } };
        });

        return Promise.all([barcodePromise]);
      });

      Promise.all(variantPromises)
        .then((results) => {
          const updatedVariantsWithDetails = updatedVariants?.map((variant, idx) => {
            const barcodeResult = results[idx][0];

            return {
              ...variant,
              barcodeImage: barcodeResult ? `data:image/png;base64,${barcodeResult?.data?.data?.image || ''}` : d_img,
            };
          });
          setVariants(updatedVariantsWithDetails);
        })
        .catch((err) => {});
    }
  }, [productDetails]);

  const download = (image) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `${productDetails?.name}_barcode.png`;
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <SoftBox className="restaurant-product-info-box">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography className="product-new-details-name-typo" style={{ marginTop: isMobileDevice ? '0px' : '10px' }}>
            {productDetails?.name}
          </Typography>
        </div>
        <div className="restaurant-details-basic-box">
          <div className="flex-row-between-center">
            <div className="flex-row-center-start gap-10">
              <img
                src={productDetails?.attributes?.foodType === 'NON_VEG' ? nonVegImage : vegImage}
                alt={productDetails?.attributes?.foodType}
                width="20"
                height="20"
              />
              <Typography className="product-new-details-gst-typo">
                {productDetails?.attributes?.foodType === 'NON_VEG' ? 'Non-Vegetarian' : 'Vegetarian'}
              </Typography>
            </div>
          </div>
          <div>
            <Typography className="product-new-details-gst-typo">
              Item Availability:{' '}
              <span className="product-new-details-gst-typo-value">
                {productDetails?.itemAvailableStartTime || 'NA'} to {productDetails?.itemAvailableEndTime || 'NA'}
              </span>
            </Typography>
          </div>
        </div>

        <div className="products-new-details-variants-div product-new-details-overFlow">
          {variants?.map((item, index) => (
            <div className={`width-100 products-new-details-variants-box`} key={index}>
              <div className="flex-column-between-center gap-10 width-100">
                <div className="flex-row-between-center">
                  <div className="flex-row-start-center gap-10">
                    
                    <div className="products-new-details-variants-price">
                      <Typography className="products-new-details-variants-price-typo-value">
                        {item?.name ? item?.name : '-----'}
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
                <div className="flex-row-between-center">
                  <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">Short code</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.shortCode ? item?.shortCode : '-----'}
                    </Typography>
                  </div>
                   <div className="products-new-details-variants-price">
                    <Typography className="products-new-details-variants-price-typo-sm">UOM</Typography>
                    <Typography className="products-new-details-variants-price-typo-value">
                      {item?.weight && item?.weightUnit ? `${item.weight} ${item.weightUnit}` : '-----'}
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
                    <Typography className="products-new-details-variants-price-typo-value">-----</Typography>
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
      </SoftBox>
    </div>
  );
};

export default ComboBasicDetails;
