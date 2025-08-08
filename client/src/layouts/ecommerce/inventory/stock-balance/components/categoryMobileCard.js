import { memo } from 'react';

const CategoryMobileCard = memo(({ data }) => {

  return (
    <div className="listing-card-bg-secondary">
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-value two-line-ellipsis">{data?.category}</span>
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Products Count</span>
          <span className="bill-card-value">{data?.products}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Wastage</span>
          <span className="bill-card-value">{data?.wastage}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Returns</span>
          <span className="bill-card-value">{data?.returns}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Incoming Orders</span>
          <span className="bill-card-value">{data?.incomingOrders}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Last Stock Update</span>
          <span className="bill-card-value">{data?.lastStockUpdate}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Stock Value</span>
          <span className="bill-card-value">₹ {data?.stockValue}</span>
        </div>
      </div>
    </div>
  );
});

export default CategoryMobileCard;
