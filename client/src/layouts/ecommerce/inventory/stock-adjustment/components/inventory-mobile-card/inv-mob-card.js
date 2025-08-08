import './inv-mob-card.css';
import { Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { productIdByBarcode } from '../../../../Common/CommonFunction';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';

const InvMobCard = ({
  tab1,
  setOpenModelInventoryAdjustment,
  productData,
  setInvProductInfo,
  setMobileDrawerInvAdjust,
  setMobileDrawerLocation,
}) => {

  const navigate = useNavigate();
  const onAdjustHandler = (productName, productGtin) => {
    setMobileDrawerInvAdjust(true);
    setInvProductInfo(() => ({
      name: productName,
      gtin: productGtin,
    }));
  };
  const [isFetching, setIsFetching] = useState(false);
  const showSnackbar = useSnackbar();
  const navigateToProductDetailsPage = async () => {
    // navigate('/products/all-products', {state: {gtin: productData?.gtin,scanned: true,isInventory: true}});
    try {
      if(isFetching) return;

      setIsFetching(true);
      const productId = await productIdByBarcode(productData?.gtin);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }else{
        showSnackbar('Product Not Found', 'error')
      }

      setIsFetching(false);
    } catch (error) {
      showSnackbar('Something Went Wrong', 'error');
      setIsFetching(false);
    }
  };

  return (
    <>
      {/* <SoftBox className="inv-main" sx={{ marginBottom: '20px' }}>
        <SoftBox className="inv-card-wrrapper po-box-shadow">
          <SoftBox className="inv-card-info-wrapper">
            <SoftBox
              className="inv-card-info-div"
              sx={{
                width: '100% !important',
              }}
              onClick={navigateToProductDetailsPage}
            >
              <SoftBox
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Stack>
                  <Typography variant="h7" fontWeight={600} fontSize={14}>
                    Name:{' '}
                    {productData?.product.length > 15
                      ? productData?.product.slice(0, 15) + '...'
                      : productData?.product}
                  </Typography>
                  <Typography variant="h7" fontSize={12}>
                    Gtin: {productData?.gtin}
                  </Typography>
                </Stack>
                <Typography
                  variant="h7"
                  fontSize={12}
                  className={`${
                    productData.status === 'AVAILABLE' ? 'product-status-available' : 'product-status-out-of-stock'
                  }`}
                  sx={{
                    display: !tab1 ? 'none' : 'block',
                  }}
                >
                  {productData?.status}
                </Typography>
              </SoftBox>
              <Divider className="divider" />
              <Stack direction="row" justifyContent="space-between">
                <Stack>
                  <Typography variant="h7" fontSize={12}>
                    Available
                  </Typography>
                  <Typography variant="h7" fontWeight={600} fontSize={14}>
                    {productData?.available}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    display: !tab1 ? 'none' : 'flex',
                  }}
                  alignItems="center"
                >
                  <Typography variant="h7" fontSize={12}>
                    Open Po
                  </Typography>
                  <Typography variant="h7" fontWeight={600} fontSize={14}>
                    {productData?.openPo[0]}
                  </Typography>
                </Stack>
                <Stack alignItems="flex-end">
                  <Typography variant="h7" fontSize={12}>
                    {'Incoming'}
                  </Typography>
                  <Typography variant="h7" fontWeight={600} fontSize={14}>
                    {productData?.incoming[0]}
                  </Typography>
                </Stack>
              </Stack>
            </SoftBox>
          </SoftBox>
          <Stack
            direction="row"
            spacing={1}
            className="inv-card-btn-div"
          >
            <SoftButton
              className="inv-card-btn adjust"
              color="info"
              onClick={() => onAdjustHandler(productData.product, productData.gtin)}
            >
              Adjust
            </SoftButton>
            <SoftButton
              className="inv-card-btn location"
              color="info"
              onClick={() => setMobileDrawerLocation(productData?.gtin)}
            >
              Location
            </SoftButton>
          </Stack>
        </SoftBox>
      </SoftBox> */}

      <div className="listing-card-bg-secondary">
        <div className="stack-row-center-between width-100" onClick={navigateToProductDetailsPage}>
          <div className="flex-colum-align-start">
            <span className="bill-card-value two-line-ellipsis">{productData?.product}</span>
            <span className="bill-card-label">Barcode: {productData?.gtin}</span>
          </div>
          <div className="flex-colum-align-end">
            <CommonStatus status={productData?.status}/>
          </div>
        </div>
        <hr className="horizontal-line-app-ros" />
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Available Units</span>
            <span className="bill-card-value">{productData?.available}</span>
          </div>
          <div className="flex-colum-align-center">
            <span className="bill-card-label">Open PO</span>
            <span className="bill-card-value">{productData?.openPo[0]}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Incoming</span>
            <span className="bill-card-value">{productData?.incoming[0]}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <CustomMobileButton title={'Adjust'} variant={'blue-D'} onClickFunction={() => onAdjustHandler(productData.product, productData.gtin)}/>
          <CustomMobileButton title={'Location'} variant={'blue-D'} onClickFunction={() => setMobileDrawerLocation(productData?.gtin)}/>
        </div>
      </div>
    </>
  );
};

export default InvMobCard;
