import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { productIdByBarcode } from '../../../../Common/CommonFunction';
import { ProductBatchListCard } from '../batch-card-mobile';

const ExpiryMobileCard = memo(
  ({
    data,
    getProductExpiryByBatchData,
    handleOpenModalBatchData,
    setProductTitle,
    productExpiryDetailsByBatch,
    getExpiryDay,
    batchLoader,
  }) => {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);
    const showSnackbar = useSnackbar();

    const handleProductNavigation = async (barcode) => {
      try {
        if (isFetching) return;

        setIsFetching(true);
        const productId = await productIdByBarcode(barcode);
        if (productId) {
          navigate(`/products/product/details/${productId}`);
        } else {
          showSnackbar('Product Not Found', 'error');
        }

        setIsFetching(false);
      } catch (error) {
        showSnackbar('Something went wrong', 'error');
        setIsFetching(false);
      }
    };

    return (
      <>
        <div className="listing-card-bg-secondary">
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-value two-line-ellipsis">{data?.title}</span>
              <span className="bill-card-label">Barcode: {data?.barcode}</span>
            </div>
          </div>
          <hr className="horizontal-line-app-ros" />
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-label">Brand</span>
              <span className="bill-card-value">{data?.brand}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="bill-card-label">Available Units</span>
              <span className="bill-card-value">{data?.availableUnits}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-label">Stock Value</span>
              <span className="bill-card-value">₹ {data?.stockValue}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="bill-card-label">Expiry In</span>
              <span className="bill-card-value">{data?.expiry}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-label">Expected StockOut</span>
              <span className="bill-card-value">{data?.expectedStockOut}</span>
            </div>
          </div>
          <span className="view-details-app" onClick={() => handleProductNavigation(data?.barcode)}>
            View Details
          </span>

          <ProductBatchListCard
            productExpiryDetailsByBatch={productExpiryDetailsByBatch[data?.barcode]}
            data={data}
            getProductExpiryByBatchData={getProductExpiryByBatchData}
            setProductTitle={setProductTitle}
            getExpiryDay={getExpiryDay}
            batchLoader={batchLoader}
          />
        </div>
      </>
    );
  },
);

export default ExpiryMobileCard;
