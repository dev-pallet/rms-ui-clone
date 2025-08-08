import './inv-mob-card.css';
import { Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { productIdByBarcode } from '../../../../Common/CommonFunction';

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

  // const navigateToProductDetailsPage = () => {
  //   navigate('/products/all-products', {state: {gtin: productData?.gtin,scanned: true,isInventory: true}});
  // };

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
    <SoftBox className="inv-main">
      <SoftBox className="inv-card-wrrapper po-box-shadow">
        <SoftBox className="inv-card-info-wrapper">
          {/* <SoftBox
            className="inv-card-img-div"
            sx={{
              display: tab1 ? 'none !important' : 'flex',
            }}
          >
            <img src={!!productData?.image ? productData?.image : ''} alt="" className="inv-product-img" />
          </SoftBox> */}
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
                  {productData?.product.length > 15 ? productData?.product.slice(0, 15) + '...' : productData?.product}
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
            {/* <Stack direction="row" justifyContent="space-between">
            <Stack
              alignItems="flex-start"
            >
              <Typography variant="h7" fontSize={12} mr={0.2}>
                Batches:
              </Typography>
              <Typography variant="h7" fontWeight={600} fontSize={12}>
                {productData?.batchId}
              </Typography>
            </Stack>
            <Stack
              alignItems="flex-end"
            >
              <Typography variant="h7" fontSize={12} mr={0.2}>
                Last Adjusted:
              </Typography>
              <Typography variant="h7" fontWeight={600} fontSize={12}>
                {productData?.latestAdjustedBatchDate ? productData?.latestAdjustedBatchDate.slice(0,10) : 'NA'}
              </Typography>
            </Stack>
            </Stack>
            <Divider
              className="divider"
            /> */}
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
          // sx={{
          //   display: !tab1 ? 'none' : 'flex',
          // }}
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
      {/* <SoftBox className="nv-product-page-btn">
        <Typography variant="h7" fontSize={10} >
          View Product Details
        </Typography>
      </SoftBox> */}
    </SoftBox>
  );
};

export default InvMobCard;
