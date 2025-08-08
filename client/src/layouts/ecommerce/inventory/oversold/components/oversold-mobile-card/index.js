export default function OversoldMobileCard({ data, selected, handleProductNavigation }) {
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
            <span className="bill-card-label">Category</span>
            <span className="bill-card-value">{data?.category}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Sub Category 1</span>
            <span className="bill-card-value">{data?.subCategory}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Sub Category 2</span>
            <span className="bill-card-value">{data?.level2Category}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Batch Id</span>
            <span className="bill-card-value">{data?.batch}</span>
          </div>
          {selected === 'OVER_SOLD_TODAY' && (
            <div className="flex-colum-align-end">
              <span className="bill-card-label">OverSold Today</span>
              <span className="bill-card-value">{data?.overSoldToday}</span>
            </div>
          )}
          {selected === 'OVERALL' && (
            <div className="flex-colum-align-end">
              <span className="bill-card-label">OverSold Quantity</span>
              <span className="bill-card-value">{data?.overSoldQuantity}</span>
            </div>
          )}
        </div>
        <div className="stack-row-center-between width-100">
          {selected !== 'OVER_SOLD_30_DAYS' && (
            <div className="flex-colum-align-start">
              <span className="bill-card-label">Negative Inventory Stock Value</span>
              <span className="bill-card-value">{data?.negativeInventoryStockValue}</span>
            </div>
          )}
        </div>
        <span className="view-details-app" onClick={() => handleProductNavigation(data?.barcode)}>
          View Details
        </span>
      </div>
    </>
  );
}
