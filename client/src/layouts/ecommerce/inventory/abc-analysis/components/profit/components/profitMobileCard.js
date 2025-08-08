import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { productIdByBarcode } from '../../../../../Common/CommonFunction';

const ProfitMobileCard = memo(({ data }) => {
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const showSnackbar = useSnackbar();

  const handleProductNavigation = async (barcode) => {
    try {
      if(isFetching) return;

      setIsFetching(true);
      const productId = await productIdByBarcode(barcode);
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
    <div className="listing-card-bg-secondary" onClick={() => handleProductNavigation(data?.barcode)}>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-value two-line-ellipsis">{data?.title}</span>
          <span className="bill-card-label">Barcode: {data?.barcode}</span>
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Classification</span>
          <span className="bill-card-value">{data?.classification}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Sales</span>
          <span className="bill-card-value">₹ {data?.sales}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Profit</span>
          <span className="bill-card-value">₹ {data?.profit}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Sale Margin</span>
          <span className="bill-card-value">{data?.saleMargin}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Purchase Margin</span>
          <span className="bill-card-value">{data?.purchaseMargin}</span>
        </div>
      </div>
      <span className="view-details-app" onClick={() => handleProductNavigation(data?.barcode)}>
        View Details
      </span>
    </div>
  );
});

export default ProfitMobileCard;
