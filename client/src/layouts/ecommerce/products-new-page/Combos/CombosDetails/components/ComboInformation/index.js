import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import { Grid, Tooltip, Typography } from '@mui/material';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import Spinner from '../../../../../../../components/Spinner';
import { generateBarcodeWithNum } from '../../../../../../../config/Services';
import { CopyToClipboardIcon } from '../ComboBasicDetails';
import DownloadIcon from '@mui/icons-material/Download';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ComboInformation = ({ productDetails }) => {
  const [bundleInfo, setBundleInfo] = useState({});
  const [barcodeLoader, setBarcodeLoader] = useState(false);
  const isMobileDevice = isSmallScreen();
  const [bundleBarcodeImage, setBundleBarcodeImage] = useState('');

  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  const download = (image) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `${productDetails?.name}_barcode.png`;
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    setBarcodeLoader(true);
    if (productDetails?.bundleBarcode) {
      generateBarcodeWithNum(productDetails?.bundleBarcode)
        .then((res) => {
          setBarcodeLoader(false);
          setBundleBarcodeImage(`data:image/png;base64,${res?.data?.data?.image || ''}`);
        })
        .catch((err) => {
          setBarcodeLoader(false);
        });
    }
  }, [productDetails]);

  return (
    <SoftBox>
      <Typography
        className="products-new-details-performance-sales-typo"
        style={{ color: '#0562FB', marginBottom: '0px' }}
      >
        Bundle Information
      </Typography>
      <SoftBox className="products-new-details-performance-sales-block-23">
        <SoftBox className="products-new-details-des-det-box">
          <Grid container spacing={2} style={{ justifyContent: 'center' }}>
            <Grid item lg={8} sm={12} md={6}>
              <div className={isMobileDevice ? 'mobile-device-bundle-info' : 'web-screen-bundle-info'}>
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">Offer Price</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">
                    ₹{productDetails?.bundlePrice || 'NA'}
                  </Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <div style={{ display: 'flex' }}>
                    <Typography className="products-new-details-variants-price-typo-sm">Total Quantity</Typography>
                    <Tooltip title={'This is the total number of items in a single bundle.'}>
                      <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
                    </Tooltip>
                  </div>
                  <Typography className="products-new-details-variants-price-typo-value">
                    {productDetails?.totalQuantity || 'NA'}
                  </Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <div style={{ display: 'flex' }}>
                    <Typography className="products-new-details-variants-price-typo-sm">Combo Quantity</Typography>
                    <Tooltip title={'This is the total number of bundles.'}>
                      <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
                    </Tooltip>
                  </div>
                  <Typography className="products-new-details-variants-price-typo-value">
                    {bundleInfo?.quantity}
                  </Typography>
                </div>
                <div className="products-new-details-variants-price">
                  <Typography className="products-new-details-variants-price-typo-sm">Combo Validity</Typography>
                  <Typography className="products-new-details-variants-price-typo-value">
                   {productDetails?.bundleValidity || 'NA'} days
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item lg={4} sm={12} md={6}>
              {barcodeLoader && <Spinner />}
              {!barcodeLoader && (
                <div className="barcode-container">
                  {productDetails?.bundleBarcode && (
                    <CopyToClipboardIcon textToCopy={productDetails?.bundleBarcode} fontSize="small" />
                  )}
                  <img
                    style={{
                      display: bundleBarcodeImage ? 'block' : 'none',
                      objectFit: 'cover',
                      height: '60px',
                      marginRight: '2px',
                    }}
                    src={bundleBarcodeImage ? bundleBarcodeImage : d_img}
                    alt=""
                  />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                    {bundleBarcodeImage && (
                      <DownloadIcon onClick={() => download(bundleBarcodeImage)} fontSize="small" />
                    )}
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        </SoftBox>
        <Typography className="products-new-details-variants-price-typo">Description</Typography>
        {/* <div style={{ fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: productDetails?.shortDescription !== "" ? productDetails?.shortDescription : productDetails?.description !== "" ? productDetails?.description : 'NA' }} /> */}
        <Typography className="products-new-details-variants-price-typo-value" style={{ marginTop: '10px' }}>
          {productDetails?.shortDescription !== '' && productDetails?.shortDescription !== null
            ? productDetails?.shortDescription
            : productDetails?.description !== '' && productDetails?.description !== null
            ? productDetails?.description
            : 'NA'}
        </Typography>

        <SoftBox className="products-new-details-des-det-box">
          <div className="products-new-details-performance-price">
            <Typography className="products-new-details-variants-price-typo">
              Product title in other language
            </Typography>
            {productDetails?.nativeLanguages && productDetails?.nativeLanguages?.length > 0 ? (
              productDetails?.nativeLanguages.map((item) => (
                <Typography
                  key={item?.language || item?.name}
                  className="products-new-details-variants-price-typo-value"
                >
                  {item?.language ? `${item?.language}: ${item?.name}` : 'Not available'}
                </Typography>
              ))
            ) : (
              <Typography className="products-new-details-variants-price-typo-value">Not available</Typography>
            )}
          </div>
        </SoftBox>

        <SoftBox className="products-new-details-des-det-box">
          <div className="products-new-details-performance-price">
            <Typography className="products-new-details-variants-price-typo">SEO tags</Typography>
            {productDetails?.tags && productDetails?.tags?.length > 0 && productDetails?.tags[0] !== '' ? (
              productDetails?.tags?.map((tag, index) => (
                <Typography className="products-new-details-variants-price-typo-value">{tag}</Typography>
              ))
            ) : (
              <Typography className="products-new-details-variants-price-typo-value">Not Available</Typography>
            )}
          </div>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
};

export default ComboInformation;
