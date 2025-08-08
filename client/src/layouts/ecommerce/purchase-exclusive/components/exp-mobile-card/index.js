import CommonId from '../../../Common/mobile-new-ui-components/common-id';
import CommonStatus from '../../../Common/mobile-new-ui-components/status';

const ExPCard = ({ data, index }) => {
  return (
    <div className="listing-card-bg-secondary" style={{marginBottom: '5px'}}>
      <div className="stack-row-center-between width-100">
        <CommonId id={data?.id} />
        <CommonStatus status={data?.status} />
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Vendor</span>
          <span className="bill-card-value">{data?.vendorName.slice(0, 15) + '...'}</span>
        </div>
        <div className="flex-colum-align-start">
          <span className="bill-card-label">PO ID</span>
          <span className="bill-card-value">{data?.poID}</span>
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Inward ID</span>
          <span className="bill-card-value">{data?.inwardID}</span>
        </div>
        <div className="flex-colum-align-center">
          <span className="bill-card-label">Total amount</span>
          <span className="bill-card-value">{data?.amount}</span>
        </div>
        <div className="flex-colum-align-center">
          <span className="bill-card-label">Last Modified</span>
          <span className="bill-card-value">{data?.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default ExPCard;
