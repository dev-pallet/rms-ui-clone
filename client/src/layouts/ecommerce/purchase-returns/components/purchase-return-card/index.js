import CommonId from '../../../Common/mobile-new-ui-components/common-id';
import CommonStatus from '../../../Common/mobile-new-ui-components/status';

const PurchaseReturnCard = ({ data, index }) => {
  return (
    <div className="listing-card-bg-secondary">
      <div className="stack-row-center-between width-100">
        <CommonId id={data?.returnId} />
        <CommonStatus status={data?.status} />
      </div>
      {/* <span className="vendor-name-bills-list">{data?.vendorname}</span>
      <hr className="horizontal-line-app-ros" /> */}
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Return value</span>
          <span className="bill-card-value">{data?.grandTotal}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Total item</span>
          <span className="bill-card-value">{data?.totalItems}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Created by</span>
          <span className="bill-card-value">
            {' '}
            {data?.userCreated?.length < 20 ? data?.userCreated : data?.userCreated?.substring(0, 20) + '...'}
          </span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Vendor name</span>
          <span className="bill-card-value">
            {data?.vendorName?.length < 13 ? data?.vendorName : data?.vendorName?.substring(0, 13) + '...'}
          </span>
        </div>
      </div>
      <span className="bill-due-date">{data?.createdOn}</span>
    </div>
  );
};

export default PurchaseReturnCard;
