import React from 'react';
import CommonId from '../../../../Common/mobile-new-ui-components/common-id';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';

const SalesOrderProductCard = ({ data, navigateToDetailsPage }) => {
  return (
    <div className="listing-card-bg-secondary" onClick={() => navigateToDetailsPage(data?.orderNumber)}>
      <div className="stack-row-center-between width-100">
        <CommonId text="Order Id: " id={data?.orderNumber} />
        <CommonId text="Invoice Id: " id={data?.invoiceId} />
      </div>
      {/* <span className="vendor-name-bills-list">{data?.vendorname}</span> */}
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
          <span className="bill-card-value"> {data?.totalItems}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Amount</span>
          <span className="bill-card-value">{data?.grandTotal}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Order Status</span>
          <span className="bill-card-value">
            {data?.orderStatus && data?.orderStatus !== '-----' ? <CommonStatus status={data?.orderStatus} /> : <>NA</>}
          </span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Payment status</span>
          <span className="bill-card-value">
            {data?.paymentStatus && data?.paymentStatus !== '-----' ? (
              <CommonStatus status={data?.paymentStatus} />
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

export default SalesOrderProductCard;
