const BillingAddress = ({ title, addressData }) => {
  return (
    <div
      className="component-bg-br-sh-p"
      style={{ maxHeight: '230px', overflowY: 'scroll', marginTop: '10px', width: '230px' }}
    >
      <div className="address-main-container" style={{ marginTop: '-10px' }}>
        <div style={{ marginTop: '-10px' }}>
          <span className="po-address-title">{title}</span>
        </div>
        <div className="address-line-container">
          <span className="po-address-font">Line 1: {addressData?.addressLine1 || ''}</span>
        </div>
        <div className="address-line-container">
          <span className="po-address-font">Line 2: {addressData?.addressLine2 || ''}</span>
        </div>
        <div className="address-line-container">
          <span className="po-address-font">City: {addressData?.city || ''}</span>
        </div>
        <div className="address-line-container">
          <span className="po-address-font">State: {addressData?.state || ''}</span>
        </div>
        <div className="address-line-container">
          <span className="po-address-font">Pincode: {addressData?.pinCode || ''}</span>
        </div>
        <div className="address-line-container">
          <span className="po-address-font">Country: {addressData?.country || ''}</span>
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
