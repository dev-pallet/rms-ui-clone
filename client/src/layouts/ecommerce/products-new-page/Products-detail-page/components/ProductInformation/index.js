import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { Grid, Typography } from '@mui/material';
import './product-information.css';
import { isSmallScreen } from '../../../../Common/CommonFunction';

const ProductInformation = ({ productDetails, selectedVariant }) => {
  const isMobileDevice = isSmallScreen();
  const getValueAfterLastUnderscore = (str) => {
    if (str) {
      const parts = str.split('_');
      return parts.length > 1 ? parts[parts.length - 1] : null;
    } else {
      return null;
    }
  };
  return (
    <div>
      {((selectedVariant?.weightsAndMeasures?.length !== 0 && selectedVariant?.needsWeighingScaleIntegration) ||
        selectedVariant?.minPosOrderQuantity ||
        selectedVariant?.maxPosOrderQuantity ||
        selectedVariant?.minB2BOrderQuantity ||
        selectedVariant?.maxB2BOrderQuantity ||
        selectedVariant?.minB2COrderQuantity ||
        selectedVariant?.maxB2COrderQuantity) && (
        <SoftBox>
          <Typography className="products-new-details-pack-typo">Variant Information</Typography>
          <SoftBox className="products-new-details-performance-sales-block-23">
            {selectedVariant?.weightsAndMeasures?.length !== 0 && selectedVariant?.needsWeighingScaleIntegration && (
              <SoftBox className="products-new-details-des-det-box">
                <div className="products-new-details-performance-price">
                  <Typography className="products-new-details-variants-price-typo-2">
                    Secondary Specifications
                  </Typography>
                  <Typography className="products-new-details-variants-price-typo-value-2">
                    {selectedVariant?.weightsAndMeasures
                      ?.filter((item) => item?.metadata?.type === 'SECONDARY')
                      ?.map((item) => `${item?.netWeight} ${item?.measurementUnit?.toLowerCase()}`)
                      ?.join(', ') || 'NA'}{' '}
                  </Typography>
                </div>
              </SoftBox>
            )}
            <div style={{ display: 'flex', gap: isMobileDevice ? '10px' : '30px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                {selectedVariant?.minPosOrderQuantity && (
                  <SoftBox className="products-new-details-des-det-box">
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo-2">Min Pos Quantity</Typography>
                      <Typography className="products-new-details-variants-price-typo-value-2">
                        {selectedVariant?.minPosOrderQuantity}
                      </Typography>
                    </div>
                  </SoftBox>
                )}
                {selectedVariant?.maxPosOrderQuantity && (
                  <SoftBox className="products-new-details-des-det-box">
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo-2">Max Pos Quantity</Typography>
                      <Typography className="products-new-details-variants-price-typo-value-2">
                        {selectedVariant?.maxPosOrderQuantity || 'NA'}
                      </Typography>
                    </div>
                  </SoftBox>
                )}
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                {selectedVariant?.minB2BOrderQuantity && (
                  <SoftBox className="products-new-details-des-det-box">
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo-2">
                        Min B2B App Quantity
                      </Typography>
                      <Typography className="products-new-details-variants-price-typo-value-2">
                        {selectedVariant?.minB2BOrderQuantity}
                      </Typography>
                    </div>
                  </SoftBox>
                )}
                {selectedVariant?.maxB2BOrderQuantity && (
                  <SoftBox className="products-new-details-des-det-box">
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo-2">
                        Max B2B App Quantity
                      </Typography>
                      <Typography className="products-new-details-variants-price-typo-value-2">
                        {selectedVariant?.maxB2BOrderQuantity || 'NA'}
                      </Typography>
                    </div>
                  </SoftBox>
                )}
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                {selectedVariant?.minB2COrderQuantity && (
                  <SoftBox className="products-new-details-des-det-box">
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo-2">
                        Min B2C App Quantity
                      </Typography>
                      <Typography className="products-new-details-variants-price-typo-value-2">
                        {selectedVariant?.minB2COrderQuantity || 'NA'}
                      </Typography>
                    </div>
                  </SoftBox>
                )}
                {selectedVariant?.maxB2BOrderQuantity && (
                  <SoftBox className="products-new-details-des-det-box">
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo-2">
                        Max B2C App Quantity
                      </Typography>
                      <Typography className="products-new-details-variants-price-typo-value-2">
                        {selectedVariant?.maxB2COrderQuantity || 'NA'}
                      </Typography>
                    </div>
                  </SoftBox>
                )}
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                {selectedVariant?.storeReference && (
                  <SoftBox className="products-new-details-des-det-box">
                    <div className="products-new-details-performance-price">
                      <Typography className="products-new-details-variants-price-typo-2">
                        Short Code
                      </Typography>
                      <Typography className="products-new-details-variants-price-typo-value-2">
                        {selectedVariant?.storeReference || 'NA'}
                      </Typography>
                    </div>
                  </SoftBox>
                )}
              </div>
            </div>
          </SoftBox>
        </SoftBox>
      )}
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
              <Typography className="products-new-details-variants-price-typo-2">Sub - class</Typography>
              <Typography className="products-new-details-variants-price-typo-value-2">
                {productDetails?.posCategories?.categoryLevel3 &&
                productDetails?.posCategories?.categoryLevel3?.length !== 0 &&
                productDetails?.posCategories?.categoryLevel3[0] !== null &&
                productDetails?.posCategories?.categoryLevel3[0] !== ''
                  ? productDetails?.posCategories?.categoryLevel3
                  : 'NA'}
              </Typography>
            </div>

            <div className="products-new-details-performance-price-1234">
              <Typography className="products-new-details-variants-price-typo-2">Department</Typography>
              <Typography className="products-new-details-variants-price-typo-value-2">
                {productDetails?.posCategories?.departmentName &&
                productDetails?.posCategories?.departmentName?.length !== 0 &&
                productDetails?.posCategories?.departmentName[0] !== null
                  ? productDetails?.posCategories?.departmentName
                  : 'NA'}
              </Typography>
            </div>

            <div className="products-new-details-performance-price-1234">
              <Typography className="products-new-details-variants-price-typo-2">Sub - department</Typography>
              <Typography className="products-new-details-variants-price-typo-value-2">
                {productDetails?.posCategories?.subDepartmentName &&
                productDetails?.posCategories?.subDepartmentName?.length !== 0 &&
                productDetails?.posCategories?.subDepartmentName[0] !== null
                  ? productDetails?.posCategories?.subDepartmentName
                  : 'NA'}
              </Typography>
            </div>

            <div className="products-new-details-performance-price-1234">
              <Typography className="products-new-details-variants-price-typo-2">Line of business</Typography>
              <Typography className="products-new-details-variants-price-typo-value-2">
                {productDetails?.posCategories?.lobName &&
                productDetails?.posCategories?.lobName?.length !== 0 &&
                productDetails?.posCategories?.lobName[0] !== null
                  ? productDetails?.posCategories?.lobName
                  : 'NA'}
              </Typography>
            </div>
          </SoftBox>

          <SoftBox className="products-new-details-des-det-box">
            <div className="products-new-details-performance-price">
              <Typography className="products-new-details-variants-price-typo-2">Manufactured by</Typography>
              <Typography className="products-new-details-variants-price-typo-value-2">
                {productDetails?.companyDetail?.manufacturer ?? productDetails?.companyDetail?.manufacturerName ?? 'NA'}
              </Typography>
            </div>
          </SoftBox>

          <SoftBox className="products-new-details-performance-price">
            <Typography className="products-new-details-variants-price-typo-2">Brand marketing company</Typography>
            <div className="products-new-details-des-det-box" style={{ width: '60%', marginTop: '5px' }}>
              <Typography className="products-new-details-variants-price-typo-value-2">
                {productDetails?.companyDetail?.brand || 'NA'}
              </Typography>
              <Typography className="products-new-details-variants-price-typo-value-2">
                {productDetails?.companyDetail?.subBrand || 'NA'}
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
    </div>
  );
};

export default ProductInformation;
