import CommonId from '../../../../../Common/mobile-new-ui-components/common-id';
import CommonStatus from '../../../../../Common/mobile-new-ui-components/status';

export default function RepackingMobileCard({ data }) {
  return (
    <div className="listing-card-bg-secondary">
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <CommonId id={data?.id} />
        </div>
        <div className="flex-colum-align-start">
          <CommonStatus status={data?.reason} />
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Primary GTIN</span>
          <span className="bill-card-value">{data?.primaryGtin}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Batch Number</span>
          <span className="bill-card-value">{data?.batchNo}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Quantity Consumed</span>
          <span className="bill-card-value">{data?.quantityConsume}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Wastage</span>
          <span className="bill-card-value">{data?.wastage}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Created On</span>
          <span className="bill-card-value">{data?.createdOn}</span>
        </div>
      </div>
    </div>
  );
}
