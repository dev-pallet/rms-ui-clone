import { useEffect, useState } from 'react';
import './status-mobile.css';

const STATUS_COLORS = {
  CLOSED: { background: '#E90000', color: '#FEFEFE', statusValue: 'Closed' },
  CLOSE: { background: '#E90000', color: '#FEFEFE', statusValue: 'Closed' },
  Completed: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Completed' },
  Paid: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Paid' },
  Created: { background: '#D9F2FF', color: '#6B6B6B', statusValue: 'Created' },
  Cancelled: { background: '#E90000', color: '#FEFEFE', statusValue: 'Cancelled' },
  Pending: { background: '#FFE9E9', color: '#333', statusValue: 'Pending' },
  'Payment Pending': { background: '#FFE9E9', color: '#333', statusValue: 'Payment Pending' },
  'Payment Cancelled': { background: '#04AA6D', color: '#fff', statusValue: 'Payment Cancelled' },
  CREATED: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'In Process' },
  APPROVED: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Approved' },
  REJECTED: { background: '#FFE9E9', color: '#6B6B6B', statusValue: 'Rejected' },
  DRAFT: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Draft' },
  ACCEPTED: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Accepted' },
  INWARDED: { background: '#D9F2FF', color: '#6B6B6B', statusValue: 'Inwarded' },
  PARTIALLY_INWARDED: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Partially Inwarded' },
  PAID: { background: '#219647', color: '#FEFEFE', statusValue: 'Paid' },
  'Payment Initiated': { background: '#F2DEAC', color: '#6B6B6B', statusValue: 'Payment Initiated' },
  PARTIALLY_PAID: { background: '#F2DEAC', color: '#6B6B6B', statusValue: 'Partially Paid' },
  'Partially Paid': { background: '#F2DEAC', color: '#6B6B6B', statusValue: 'Partially Paid' },
  REPLACEMENT: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Replacement' },
  CREDIT_NOTE: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'In Process' },
  INPROGRESS: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'In Progress' },
  COMPLETED: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Completed' },
  APPROVAL_PENDING: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Approval Pending' },
  PENDING_APPROVAL: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Approval Pending' },
  CREATION_IN_PROGRESS: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Creation In Progress' },
  SHIPPED: {background: '#F2DEAC', color: '#6B6B6B', statusValue: 'Shipped' },
  RECEIVED: { background: '#219647', color: '#FEFEFE', statusValue: 'Received' },
  INWARD_SUCCESSFUL: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Inward Successful' },
  PENDING_APPROVAL_1: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Pending Approval 1' },
  PENDING_APPROVAL_2: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Pending Approval 2' },
  OUT_OF_STOCK: { background: '#E90000', color: '#FEFEFE', statusValue: 'Out Of Stock' },
  AVAILABLE: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Available' },
  WASTAGE: { background: '#E90000', color: '#FEFEFE', statusValue: 'Wastage' },
  SHRINKAGE: { background: '#E90000', color: '#FEFEFE', statusValue: 'Shrinkage' },
  THEFT: { background: '#E90000', color: '#FEFEFE', statusValue: 'Theft' },
  STORE_USE: { background: '#E8FFD8', color: '#6B6B6B', statusValue: 'Store Use' },
  DAMAGED: { background: '#E90000', color: '#FEFEFE', statusValue: 'Damaged' },
  EXPIRED: { background: '#E90000', color: '#FEFEFE', statusValue: 'Expired' },
  INWARD: { background: '#D9F2FF', color: '#6B6B6B', statusValue: 'Inward' },
  OTHERS: { background: '#FFF5B2', color: '#6B6B6B', statusValue: 'Others' }

  // ERROR: { background: '#f44336', color: '#fff', statusValue: 'Error' },
  // SUCCESS: { background: '#04AA6D', color: '#fff', statusValue: 'Success' },
  // WARNING: { background: '#f1c232', color: '#fff', statusValue: 'Warning' },
  // STARTED: { background: '#04AA6D', color: '#fff', statusValue: 'Started' },
  // SOLD: { background: '#f44336', color: '#fff', statusValue: 'Sold' },
  // PARTIALLY_RECEIVED: { background: '#f1c232', color: '#fff', statusValue: 'Partially Received' },
  // OPEN: { background: '#c27ba0', color: '#fff', statusValue: 'Open' },
  // RECEIVED: { background: '#04AA6D', color: '#fff', statusValue: 'Received' },
  // ESTIMATED: { background: '#6c8ebf', color: '#fff', statusValue: 'Estimated' },
  // SHIPPED: { background: '#ed7d31', color: '#fff', statusValue: 'Shipped' },
  // PAYMENT_PENDING: { background: '#f1c232', color: '#fff', statusValue: 'Payment Pending' },
  // PAYMENT_CANCELLED: { background: '#f44336', color: '#fff', statusValue: 'Payment Cancelled' },
  // PAYMENT_COMPLETED: { background: '#04AA6D', color: '#fff', statusValue: 'Payment Completed' },
  // DELIVERED: { background: '#04AA6D', color: '#fff', statusValue: 'Delivered' },
  // PENDING: { background: '#f1c232', color: '#fff', statusValue: 'Pending' },
  // PACKAGED: { background: '#dd7e6b', color: '#fff', statusValue: 'Packaged' },
  // IN_TRANSIT: { background: '#6c8ebf', color: '#fff', statusValue: 'In Transit' },
  // CANCELLED: { background: '#f44336', color: '#fff', statusValue: 'Cancelled' },
  // SETTLED: { background: '#04AA6D', color: '#fff', statusValue: 'Settled' },
  // INACTIVE: { background: '#ed7d31', color: '#fff', statusValue: 'Inactive' },
  // ACTIVE: { background: '#04AA6D', color: '#fff', statusValue: 'Active' },
  // EXPIRED: { background: '#f44336', color: '#fff', statusValue: 'Expired' },
  // CREATION_IN_PROGRESS: { background: '#f1c232', color: '#fff', statusValue: 'Creation In Progress' },
};

const CommonStatus = ({ status, statusValue }) => {
  const [statusColors, setStatusColors] = useState({
    background: '',
    color: '',
    statusValue: '',
  });

  useEffect(() => {
    if (status) {
      const colors = STATUS_COLORS[status] || {
        background: '#E90000',
        color: '#FEFEFE',
        statusValue: 'Unknown status',
      };
      setStatusColors(colors);
    }
  }, [status]);

  return (
    <span
      style={{
        background: statusColors?.background,
        color: statusColors?.color,
      }}
      className="mobile-status"
    >
      {statusColors?.statusValue}
    </span>
  );
};

export default CommonStatus;
