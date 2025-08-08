import { Divider, Stack, Typography } from '@mui/material';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';
import CommonId from '../../../../Common/mobile-new-ui-components/common-id';

const InvoiceMobCard = ({ data }) => {
  return (
    <div className="listing-card-bg-secondary">
      <div className="stack-row-center-between width-100">
        <CommonId text="Payment Id: " id={data?.paymentId} />
        <CommonId text="Order Id: " id={data?.orderID} />
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Channel</span>
          <span className="bill-card-value">{data?.channel}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Invoice Id</span>
          <span className="bill-card-value">{data?.invoiceId}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Payment Status</span>
          <span className="bill-card-value">
            {data?.paymentStatus && data?.paymentStatus !== '-----' ? (
              <CommonStatus status={data?.paymentStatus} />
            ) : (
              <>NA</>
            )}
          </span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Amount paid</span>
          <span className="bill-card-value">{data?.totalAmount}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Invoice date</span>
          <span className="bill-due-date">{data?.invoiceDate}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Payment mode</span>
          <span className="bill-card-value">{data?.paymentMode}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceMobCard;
