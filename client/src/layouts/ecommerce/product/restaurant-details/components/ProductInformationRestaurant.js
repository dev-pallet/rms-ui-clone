import React from 'react';
import SoftBox from '../../../../../components/SoftBox';
import { Typography } from '@mui/material';
import { isSmallScreen } from '../../../Common/CommonFunction';

const ProductInformationRestaurant = ({ productDetails, selectedVariant, recipeDetails }) => {
  const isMobileDevice = isSmallScreen();

  return (
    <SoftBox style={{ marginTop: isMobileDevice ? '12px' : '50px' }}>
      <Typography className="products-new-details-pack-typo">Product Information</Typography>
      <SoftBox className="products-new-details-performance-sales-block-23">
        <Typography className="products-new-details-variants-price-typo-2">Description</Typography>
        {/* <div style={{ fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: productDetails?.shortDescription !== "" ? productDetails?.shortDescription : productDetails?.description !== "" ? productDetails?.description : 'NA' }} /> */}
        <Typography className="products-new-details-variants-price-typo-value-2" style={{ marginTop: '10px' }}>
          {productDetails?.shortDescription !== '' && productDetails?.shortDescription !== null
            ? productDetails?.shortDescription
            : productDetails?.description !== '' && productDetails?.description !== null
            ? productDetails?.description
            : 'NA'}
        </Typography>

        <Typography className="products-new-details-variants-price-typo-2" style={{ marginTop: '12px' }}>
          Cooking and serving instructions
        </Typography>
        {/* <div style={{ fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: productDetails?.shortDescription !== "" ? productDetails?.shortDescription : productDetails?.description !== "" ? productDetails?.description : 'NA' }} /> */}
        {recipeDetails?.[0]?.instructions && recipeDetails?.[0]?.instructions?.length > 0 ? (
          recipeDetails?.[0]?.instructions?.map((item, index) => (
            <Typography
              key={index}
              className="products-new-details-variants-price-typo-value-2"
              style={{ marginTop: '10px' }}
            >
              {`${item?.priority}: ${item?.instruction}`}
            </Typography>
          ))
        ) : (
          <Typography className="products-new-details-variants-price-typo-value-2" style={{ marginTop: '10px' }}>
            NA
          </Typography>
        )}

        {/*  */}

        <SoftBox className={!isMobileDevice ? 'products-new-details-des-det-box' : 'products-new-details-box-mob'}>
          <div className="products-new-details-performance-price-1234">
            <Typography className="products-new-details-variants-price-typo-2">Category</Typography>
            <Typography className="products-new-details-variants-price-typo-value-2">
              {productDetails?.posCategories?.categoryLevel1 &&
              productDetails?.posCategories?.categoryLevel1?.length !== 0 &&
              productDetails?.posCategories?.categoryLevel1[0] !== null &&
              productDetails?.posCategories?.categoryLevel1[0] !== ''
                ? productDetails?.posCategories?.categoryLevel1
                : 'NA'}
            </Typography>
          </div>

          <div className="products-new-details-performance-price-1234">
            <Typography className="products-new-details-variants-price-typo-2">Class</Typography>
            <Typography className="products-new-details-variants-price-typo-value-2">
              {productDetails?.posCategories?.categoryLevel2 &&
              productDetails?.posCategories?.categoryLevel2?.length !== 0 &&
              productDetails?.posCategories?.categoryLevel2[0] !== null &&
              productDetails?.posCategories?.categoryLevel2[0] !== ''
                ? productDetails?.posCategories?.categoryLevel2
                : 'NA'}
            </Typography>
          </div>

          <div className="products-new-details-performance-price-1234">
            <Typography className="products-new-details-variants-price-typo-2">Returnable Item</Typography>
            <Typography className="products-new-details-variants-price-typo-value-2">
              {productDetails?.returnable === true ? 'Yes' : 'No'}
            </Typography>
          </div>

          <div className="products-new-details-performance-price-1234">
            <Typography className="products-new-details-variants-price-typo-2">Organic</Typography>
            <Typography className="products-new-details-variants-price-typo-value-2">
              {productDetails?.attributes?.regulatoryData?.organic === 'true' ? 'Yes' : 'No'}
            </Typography>
          </div>

          <div className="products-new-details-performance-price-1234">
            <Typography className="products-new-details-variants-price-typo-2">Allergens</Typography>
            <Typography className="products-new-details-variants-price-typo-value-2">
              {productDetails?.allergenItems?.length > 0 ? productDetails?.allergenItems?.join(', ') : 'NA'}
            </Typography>
          </div>

          <div className="products-new-details-performance-price-1234">
            <Typography className="products-new-details-variants-price-typo-2">Spice Level</Typography>
            <Typography className="products-new-details-variants-price-typo-value-2">
              {productDetails?.spiceLevels?.length > 0 ? productDetails?.spiceLevels?.join(', ') : 'NA'}
            </Typography>
          </div>
        </SoftBox>

        <SoftBox className="products-new-details-des-det-box">
          <div className="products-new-details-performance-price">
            <Typography className="products-new-details-variants-price-typo-2">
              Product title in other language
            </Typography>
            {productDetails?.nativeLanguages && productDetails?.nativeLanguages?.length > 0 ? (
              productDetails?.nativeLanguages.map((item) => (
                <Typography
                  key={item?.language || item?.name}
                  className="products-new-details-variants-price-typo-value-2"
                >
                  {item?.language ? `${item?.language}: ${item?.name}` : 'Not available'}
                </Typography>
              ))
            ) : (
              <Typography className="products-new-details-variants-price-typo-value-2">Not available</Typography>
            )}
          </div>
        </SoftBox>
        {productDetails?.tags && (
          <SoftBox className="products-new-details-des-det-box">
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo-2">SEO tags</Typography>
              {productDetails?.tags && productDetails?.tags?.length > 0 ? (
                productDetails?.tags?.map((tag, index) => (
                  <Typography className="products-new-details-variants-price-typo-value-2">{tag}</Typography>
                ))
              ) : (
                <Typography className="products-new-details-variants-price-typo-value-2">Not Available</Typography>
              )}
            </div>
          </SoftBox>
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default ProductInformationRestaurant;
