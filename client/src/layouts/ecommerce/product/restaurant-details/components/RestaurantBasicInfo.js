import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import { Typography } from '@mui/material';
import { isSmallScreen } from '../../../Common/CommonFunction';
import '../restaurantDetails.css';
import vegImage from '../../../../../assets/images/veg.jpg';
import nonVegImage from '../../../../../assets/images/non-veg.jpg';
import RestaurantVariantsSection from '../../../products-new-page/Products-detail-page/components/ProductDetailsInfo/components/RestaurantVariantsSection';
import { generateBarcodeWithNum } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

const RestaurantBasicInfo = ({
  productDetails,
  setSelectedVariantBarcode,
  selectedVariantBarcode,
  handleGtinChange,
  selectedVariant,
  setSelectedVariant,
  pricingDetail,
  reloadBatchDetails,
  type,
}) => {
  const isRestaurant = type === 'RESTAURANT';
  const [variants, setVariants] = useState([]);
  const showSnackbar = useSnackbar();

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const productTypeTags = {
    RAW: { label: 'Raw Material', color: '#FFA500' },
    CONSUMABLE: { label: 'Consumables', color: '#8B4513' },
    ADD_ON: { label: 'Add-ons', color: '#32CD32' },
    MENU: { label: 'Finished Product', color: '#FFD700' },
    PREP: { label: 'Prep Item', color: '#1E90FF' },
  };
  const productType = productDetails?.productTypes?.[0];
  const tag = productTypeTags?.[productType];

  const isMobileDevice = isSmallScreen();

  useEffect(() => {
    if (productDetails?.variants?.length > 0) {
      const updatedVariants = productDetails?.variants?.map((variant, index) => ({
        ...variant,
        checked: index === 0,
        barcodeImage: null,
        mrp: '-----',
      }));

      const variantPromises = updatedVariants?.map((variant) => {
        const payload = {
          gtin: [variant.barcodes[0]],
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
          setSelectedVariant(updatedVariantsWithDetails[0]);
          setSelectedVariantBarcode(updatedVariantsWithDetails[0]?.barcodes[0] || 'NA');
          handleGtinChange(updatedVariantsWithDetails[0]?.barcodes[0] || 'NA');
        })
        .catch((err) => {});
    }
  }, [productDetails]);

  const handleRadioButtonChange = (item, index) => {
    const updatedVariants = variants.map((variant, i) => ({
      ...variant,
      checked: i === index,
    }));
    setVariants(updatedVariants);
    // Set the selected variant's barcode
    setSelectedVariant(item);
    setSelectedVariantBarcode(item.barcodes[0] || 'NA');
    handleGtinChange(item.barcodes[0] || 'NA');
  };

  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  const download = (image) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `${productDetails?.name}_barcode.png`;
    document.body.appendChild(link);
    link.click();
  };

  const uomArr = [
    { value: 'nos', label: 'each' },
    { value: 'Grams', label: 'gm' },
    { value: 'Kilograms', label: 'kg' },
    { value: 'Millilitres', label: 'ml' },
    { value: 'Litres', label: 'ltr' },
  ];

  const getWeightUnitLabel = (weightUnitValue) => {
    const uom = uomArr.find((unit) => unit.value === weightUnitValue);
    return uom ? uom.label : weightUnitValue;
  };

  return (
    <div>
      <SoftBox className="restaurant-product-info-box">
        {!isRestaurant && (
          <Typography className="product-new-details-brand-typo">
            {productDetails?.companyDetail?.brand || 'NA'} - {productDetails?.companyDetail?.subBrand || 'NA'}
          </Typography>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography className="product-new-details-name-typo" style={{ marginTop: isMobileDevice ? '0px' : '10px' }}>
            {productDetails?.name}
          </Typography>
          {tag && isRestaurant && (
            <div
              style={{
                backgroundColor: tag?.color,
                padding: '4px 10px',
                borderRadius: '5px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              {tag?.label}
            </div>
          )}
        </div>
        <div className="restaurant-details-basic-box">
          <div className="flex-row-between-center">
            <div className="flex-row-start-center gap-10">
              {Object.entries(productDetails?.taxReference?.metadata || {}).map(([key, value]) => (
                <Typography key={key} className="product-new-details-gst-typo">
                  {key === 'hsnCode' ? 'HSN Code' : key.toUpperCase()}:{' '}
                  <span className="product-new-details-gst-typo-value">
                    {key === 'hsnCode' ? value : value || 0} {key === 'hsnCode' ? '' : '%'}
                  </span>
                </Typography>
              ))}
              {!productDetails?.taxReference?.metadata?.gst && productDetails?.taxReference?.taxType === 'GST' && (
                <Typography className="product-new-details-gst-typo">
                  GST:{' '}
                  <span className="product-new-details-gst-typo-value">
                    {productDetails?.taxReference?.taxRate || 0}%
                  </span>
                </Typography>
              )}
            </div>
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

        <RestaurantVariantsSection
          productDetails={productDetails}
          variants={variants}
          handleRadioButtonChange={handleRadioButtonChange}
          download={download}
          d_img={d_img}
          getWeightUnitLabel={getWeightUnitLabel}
        />
      </SoftBox>
    </div>
  );
};

export default RestaurantBasicInfo;
