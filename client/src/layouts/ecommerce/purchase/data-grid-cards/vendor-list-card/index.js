import './vendor-list-card.css';
const VendorListCard = ({ item }) => {
  return (
    <div className="vendor-list-card">
      <span className="main-vendor-title">{item?.preferredVendor}</span>
      <hr className="horizontal-line-app-ros" />
      <div className="width-100 stack-row-center-between">
        <div className="flex-colum-align-start">
          <span className="vendor-card-title">Product</span>
          <span className="vendor-card-value">{`${item?.noOfProducts} of products in this PI`}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="vendor-card-title">Total Value</span>
          <span className="vendor-card-value">{`₹${item?.amount?.toFixed(2)}`}</span>
        </div>
      </div>
    </div>
  );
};

export default VendorListCard;
