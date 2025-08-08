import { ReceiptRefundIcon } from '@heroicons/react/24/outline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Checkbox } from '@mui/material';
import { textFormatter } from '../../../../../../Common/CommonFunction';
import CommonStatus from '../../../../../../Common/mobile-new-ui-components/status';
import BatchesList from '../batchesList';

export default function ProductCard({
  product,
  createdUidx,
  createdByName,
  fetchSessionProducts,
  handleSingleSelect,
  handleRecount,
  handleRecountLoader,
  handleProductNavigation
}) {
  return (
    <div className="stock-count-details-card">
      <div className="w-100 flex-colum-align-start gap-5px">
        <div className="content-space-between-align-top w-100">
          <span className="stock-count-details-card-title">
            {product?.title ? textFormatter(product?.title) : 'NA'}
          </span>
          <span className="content-space-between gap-5px">
            {product?.status === 'APPROVAL_PENDING' && !handleRecountLoader && (
              <ReceiptRefundIcon
                onClick={() => {
                  handleRecount({ productSessionId: product.productSessionId });
                }}
                className="stock-count-details-checkbox"
              />
            )}
            <Checkbox
              icon={<RadioButtonUncheckedIcon fontSize="1rem" />}
              checkedIcon={<RadioButtonCheckedIcon fontSize="1rem" />}
              className="stock-count-details-checkbox"
              checked={product.isChecked}
              onChange={() => handleSingleSelect(product)}
            />
          </span>
        </div>
        <div className="content-space-between w-100">
          <span className="bill-card-label">Code: {product?.barcode}</span>
          <CommonStatus status={product?.status === 'CREATED' ? textFormatter(product?.status) : product?.status} />
        </div>
        <div>
          <div className="flex-colum-align-start">
            <span className="view-details-app" onClick={() => {handleProductNavigation(product?.gtin)}}>View Product Details</span>
          </div>
        </div>
      </div>

      <div className="listing-card-bg-secondary">
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Expected qty</span>
            <span className="bill-card-value">{product?.expectedQuantity ?? 'NA'}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Observed qty</span>
            <span className="bill-card-value">{product?.primaryCount ?? 'NA'}</span>
          </div>
        </div>

        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Variance</span>
            <span className="bill-card-value">
              {product?.totalImsQuantity ? product?.variancePercent + '%' : 'N/A'}
            </span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Variance Value</span>
            <span className="bill-card-value">{product?.varianceValue ?? 'NA'}</span>
          </div>
        </div>
      </div>

      {/* batches list here  */}
      <BatchesList
        productSessionId={product?.productSessionId}
        createdUidx={createdUidx}
        createdByName={createdByName}
        fetchSessionProducts={fetchSessionProducts}
      />
    </div>
  );
}
