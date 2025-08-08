import React from 'react';
import Spinner from '../../../../../../components/Spinner';
import ImageSucess from '../../../../../../assets/gif/success-gif-yellow.gif';
const NofityVendorPurchaseOrder = ({ handleAskVendorNotifyMobile, saveLoader }) => {
  return (
    <div className="mob-notify-vendor-main">
      <div className="mob-notify-vendor-boxes">
        <img className="mob-notify-image" src={ImageSucess} />
        <p className="mob-notify-header">Purchase order created</p>
      </div>
      <div className="mob-notify-vendor-boxes-1">
        <div className="mob-notify-text">
          Do you want to share this with vendor now or afterward?
          {saveLoader && <Spinner size={20} />}
        </div>
        <div className="mob-notify-grp-btn">
          <button
            className="mob-notify-vendor-btn-now"
            disabled={saveLoader}
            onClick={() => handleAskVendorNotifyMobile(true)}
          >
            Share now
          </button>
          <button
            className="mob-notify-vendor-btn-later"
            disabled={saveLoader}
            onClick={() => handleAskVendorNotifyMobile(false)}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default NofityVendorPurchaseOrder;
