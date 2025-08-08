import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorMobileCard = memo(({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="listing-card-bg-secondary" onClick={() => navigate(`/sellers/vendors/details/${data?.vendorId}`)}>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-value two-line-ellipsis">{data?.vendor}</span>
          <span className="bill-card-label">Brand: {data?.brands}</span>
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Location</span>
          <span className="bill-card-value">{data?.location}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Products</span>
          <span className="bill-card-value">{data?.products}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Last Purchase</span>
          <span className="bill-card-value">{data?.lastPurchase}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Incoming Orders</span>
          <span className="bill-card-value">{data?.incomingOrders}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Stock Value</span>
          <span className="bill-card-value">₹ {data?.stockValue}</span>
        </div>
      </div>
      <span className="view-details-app" onClick={() => navigate(`/sellers/vendors/details/${data?.vendorId}`)}>
        View Details
      </span>
    </div>
  );
});

export default VendorMobileCard;
