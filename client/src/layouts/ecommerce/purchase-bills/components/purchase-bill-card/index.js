import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonId from '../../../Common/mobile-new-ui-components/common-id';
import CommonStatus from '../../../Common/mobile-new-ui-components/status';
import './purchase-bills-card.css';

const PurchaseBillCard = ({ data, index }) => {
  const navigate = useNavigate(); 

  const handleCardClick = () => {
    navigate(`/purchase/purchase-bills/details/${data?.billNumber}`);
  };

  return (
    <div className="listing-card-bg-secondary" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="stack-row-center-between width-100">
        <CommonId id={data?.billNumber} />
        <CommonStatus status={data?.status} />
      </div>
      <span className="vendor-name-bills-list">{data?.vendorname}</span>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Invoice bill number</span>
          <span className="bill-card-value">{data?.invoiceBillNumber}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Bill Value</span>
          <span className="bill-card-value">{data?.amount}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Due Date</span>
          <span className="bill-card-value">{data?.duedate}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Outstanding Value</span>
          <span className="bill-card-value">{data?.balancedue}</span>
        </div>
      </div>
      <span className="bill-due-date">{data?.date}</span>
    </div>
  );
};

export default PurchaseBillCard;
