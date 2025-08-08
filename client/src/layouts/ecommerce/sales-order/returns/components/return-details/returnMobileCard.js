import { Divider, Stack, Typography } from '@mui/material';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';
import CommonId from '../../../../Common/mobile-new-ui-components/common-id';

const ReturnMobCard = ({ data }) => {
  return (
    <div className="listing-card-bg-secondary">
      <div className="stack-row-center-between width-100">
        <CommonId text="Return Id: " id={data?.returnId} />
        <CommonId text="Order Id: " id={data?.orderNumber} />
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Channel</span>
          <span className="bill-card-value">{data?.channel}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Customer</span>
          <span className="bill-card-value">{data?.customerName}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Items</span>
          <span className="bill-card-value"> {data?.quantity}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Amount</span>
          <span className="bill-card-value">{data?.amount}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Shipment Status</span>
          <span className="bill-card-value">
            {data?.shipmentStatus && data?.shipmentStatus !== '-----' ? (
              <CommonStatus status={data?.shipmentStatus} />
            ) : (
              <>NA</>
            )}
          </span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Return status</span>
          <span className="bill-card-value">
            {data?.returnStatus && data?.returnStatus !== '-----' ? (
              <CommonStatus status={data?.returnStatus} />
            ) : (
              <>NA</>
            )}
          </span>
        </div>
      </div>
      <span className="bill-due-date">{data?.createdDate}</span>
    </div>
  );
};

export default ReturnMobCard;
