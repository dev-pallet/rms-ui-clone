import { memo } from 'react';

const ProductMobileCard = memo(({ data, handleProductNavigation }) => {
  return (
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
          <span className="bill-card-label">UOM</span>
          <span className="bill-card-value">{data?.uom}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">MRP</span>
          <span className="bill-card-value">{data?.mrp}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Stock In Hand</span>
          <span className="bill-card-value">{data?.stockInHand}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Location</span>
          <span className="bill-card-value">{data?.location}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Batches</span>
          <span className="bill-card-value">{data?.batches}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Incoming</span>
          <span className="bill-card-value">{data?.incoming}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Stock Value</span>
          <span className="bill-card-value">₹ {data?.stockValue}</span>
        </div>
      </div>
      <span className="view-details-app" onClick={() => handleProductNavigation(data?.barcode)}>
        View Details
      </span>
    </div>
  );
});

export default ProductMobileCard;
