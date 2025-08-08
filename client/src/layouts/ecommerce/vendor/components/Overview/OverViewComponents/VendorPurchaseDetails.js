import { PurchaseOrders } from '../../Purchases/data/purchase-orders/purchase-orders';
import React from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

const VendorPurchaseDetails = () => {
  return (
    <div style={{ padding: '15px' }}>
      <div>
        <SoftTypography fontWeight="bold" fontSize="14px" mb={0.5}>
          Purchase order
        </SoftTypography>

        <PurchaseOrders />
      </div>{' '}
    </div>
  );
};

export default VendorPurchaseDetails;