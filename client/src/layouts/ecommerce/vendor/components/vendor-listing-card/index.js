import { useNavigate } from 'react-router-dom';
import './vendor-listing-card.css';

const VendorListingCard = ({ data }) => {
  const navigate = useNavigate();

  const detailsPageNavigation = () => {
    navigate(`/sellers/vendors/details/${data?.star}`);
  };
  return (
    <div className="listing-card-bg-secondary" onClick={detailsPageNavigation}>
      <span className="vendor-name-bills-list">{data?.vendorName}</span>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Location</span>
          <span className="bill-card-value">{data?.location}</span>
        </div>
        <div className="flex-colum-align-end ">
          <span className="bill-card-label">GST</span>
          <span className="bill-card-value">{data?.gstNumber}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Phone</span>
          <span className="bill-card-value">{data?.contactNumber}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Outstanding Value</span>
          <span className="bill-card-value">{data?.value || 'NA'}</span>
        </div>
      </div>
    </div>
  );
};

export default VendorListingCard;
