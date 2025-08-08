import React from 'react';
import CustomMobileButton from '../../../../../Common/mobile-new-ui-components/button';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ConvertPOtoCart = ({ ele }) => {
  const parseTotalItems = (totalItems) => {
    const [fulfilled, required] = totalItems.split('/').map(Number);
    return { fulfilled, required };
  };
  const { piNum } = useParams();
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const filterOpenHandler = () => {
    navigate(`/purchase/purchase-orders/create-purchase-order/${piNum}/${vendorId ? vendorId : ele?.id}`);
  };

  return (
    <div className="listing-card-bg-secondary">
      <span className="vendor-name-bills-list">{ele?.vendorName}</span>
      <hr className="horizontal-line-app-ros" />

      {/* Location and GST Section */}
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Required Product</span>
          <span className="bill-card-value">{ele?.totalItems ? parseTotalItems(ele.totalItems)?.required : 'N/A'}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Required Quantity</span>
          <span className="bill-card-value">{ele?.totalQuantity + 100}</span>
        </div>
      </div>

      {/* Fulfillment Section */}
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Fulfill Product</span>
          <span className="bill-card-value">
            {ele?.totalItems ? parseTotalItems(ele.totalItems)?.fulfilled : 'N/A'}
          </span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Fulfilled Quantity</span>
          <span className="bill-card-value">{ele?.totalQuantity}</span>
        </div>
      </div>

      <div className="stack-row-center-between width-100">
        <span className="bill-card-label">Total</span>
        <span className="bill-card-value">₹{ele?.amount}</span>
      </div>

      <CustomMobileButton
        variant="black-D"
        title="Create PO"
        justifyContent="space-between"
        width="100%"
        onClickFunction={filterOpenHandler}
        iconOnRight={
          <ArrowLongRightIcon
            style={{
              height: '1rem',
              width: '1rem',
            }}
          />
        }
      />
    </div>
  );
};

export default ConvertPOtoCart;
