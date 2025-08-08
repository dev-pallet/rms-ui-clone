import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Grid } from '@mui/material';
import { memo, useEffect, useMemo, useState } from 'react';
import FlagCommonInfo from '../../../../../Common/mobile-new-ui-components/common-flag-data-comp/flag-info';
import CommonIcon from '../../../../../Common/mobile-new-ui-components/common-icon-comp';
import './create-pi-quantity-card.css';
import { productIdByBarcode, textFormatter } from '../../../../../Common/CommonFunction';
import CustomMobileInput from '../../../../../Common/mobile-new-ui-components/common-input';

const CreatePiCard = memo(({ data, addProductsForPi, deletingProducts, isAddedProduct = false, loading }) => {
  const [categoryType, setCategoryType] = useState('NA');
  const [openAnalysis, setOpenAnalysis] = useState(false);
  const [analysisDataColor, setAnalysisDataColor] = useState('');
  const openAnalysisHandler = () => {
    setOpenAnalysis(!openAnalysis);
  };

  const finalPrice =
    data?.whProductsCapsWithMultipleBatch?.multipleBatchCreations?.[0]?.mrp || (data?.finalPrice ?? 'NA');
  const specification = data?.product?.weights_and_measures?.net_weight || data?.weights_and_measures?.net_weight || '';

  const inventorySellingUnit =
    data?.product?.weights_and_measures?.measurement_unit || data?.weights_and_measures?.measurement_unit || '';

  const flagData = useMemo(
    () => ({
      profitFlag: data?.productForeCastModel?.grossProfitCat || data?.profitFlag,
      salesFlag: data?.productForeCastModel?.salesCat || data?.salesFlag,
      inventoryFlag: data?.productForeCastModel?.inventoryCat || data?.inventoryFlag,
      salesPerWeek: data?.salesPerWeek,
      purchaseMargin: data?.purchaseMargin,
    }),
    [data],
  );

  useEffect(() => {
    switch (data?.flag || data?.purchaseRecommendationFlag || data?.productForeCastModel?.flag) {
      case 'GREY':
        setCategoryType('C');
        break;
      case 'GREEN':
        setCategoryType('A');
        break;
      case 'ORANGE':
        setCategoryType('B');
        break;
      case 'RED':
        setCategoryType('D');
        break;
      case 'NA':
        setCategoryType('NA');
        break;

      default:
        break;
    }
    setAnalysisDataColor(data?.flag || data?.purchaseRecommendationFlag || data?.productForeCastModel?.flag);
  }, [data?.flag, data?.purchaseRecommendationFlag, data?.productForeCastModel?.flag]);

  const handleProductNavigation = async (barcode) => {
    if (!isAddedProduct) {
      return;
    }
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <div className="pi-create-main-card-div">
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start" onClick={() => handleProductNavigation(data?.gtin || data?.itemCode)}>
          <span className="pi-create-card-title">
            {textFormatter(data?.name) || textFormatter(data?.productName) || textFormatter(data?.itemName) || 'NA'}
          </span>
          <span className="pi-create-card-value">Gtin: {data?.gtin || data?.itemCode || 'NA'}</span>
        </div>
        {deletingProducts && (
          <CommonIcon icon={<TrashIcon />} iconOnClickFunction={() => deletingProducts(isAddedProduct, data)} />
        )}
      </div>
      <Grid container spacing={1} sx={{ marginTop: '0px' }}>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <div className="flex-colum-align-start border-right">
            <span className="pi-create-info-title">Current Stock</span>
            <span className="pi-create-info-value">
              {data?.whProductsCapsWithMultipleBatch?.multipleBatchCreations?.[0]?.availableUnits ||
                data?.availableStock ||
                'NA'}
            </span>
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <div className="flex-colum-align-center border-right">
            <span className="pi-create-info-title">Avg. sales/week</span>
            <span className="pi-create-info-value">{data?.salesPerWeek || 'NA'}</span>
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <div
            className="abc-analysis-pi-create"
            style={{
              background: analysisDataColor || 'black',
            }}
            onClick={openAnalysisHandler}
          >
            {/* <span className="abc-analysis-title">Category {categoryType}</span> */}
            <span className="abc-analysis-title">Analysis</span>
            <CommonIcon icon={openAnalysis ? <ChevronUpIcon /> : <ChevronDownIcon />} iconColor="white" />
          </div>
        </Grid>
      </Grid>
      {openAnalysis && (
        <div className="pi-create-flag-data">
          <FlagCommonInfo data={flagData} />
        </div>
      )}
      <div className="stack-row-center-between width-100">
        <span className="pi-create-spec-mrp">
          ₹ {finalPrice} | {data?.spec || `${specification + inventorySellingUnit}` || 'NA'}
        </span>
        <div
          className="stack-row-center-between"
          style={{
            gap: '0.5rem',
          }}
        >
          <span className="pi-create-quantity">Quantity</span>
          <CustomMobileInput
            type="number"
            placeholder="0"
            inputStyles={{
              width: '50px',
            }}
            disabled={loading}
            value={data?.quantityOrdered}
            onChange={(e) => addProductsForPi(data, e.target.value, true, isAddedProduct)}
          />
        </div>
      </div>
    </div>
  );
});

export default CreatePiCard;
