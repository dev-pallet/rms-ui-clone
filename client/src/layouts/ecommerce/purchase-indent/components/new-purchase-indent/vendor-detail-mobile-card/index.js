import { XCircleIcon } from '@heroicons/react/24/outline';
import CommonIcon from '../../../../Common/mobile-new-ui-components/common-icon-comp';
import './vendor-detail-card-mob.css';
import { textFormatter } from '../../../../Common/CommonFunction';
import MobileDrawerCommon from '../../../../Common/MobileDrawer';
import { useState } from 'react';
const VendorCardDetailsMob = ({ data, deselectVendor }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerContentType, setDrawerContentType] = useState('');
  const handleOpenDrawer = (type) => {
    setDrawerContentType(type);
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setDrawerContentType('');
    setOpenDrawer(false);
  };

  return (
    <>
      <div className="vendor-details-main-parent-div width-100">
        <span className="vendor-detail-title">Vendor Detail</span>
        <div className="vendor-detail-main-div width-100">
          <div className="width-100 stack-row-center-between">
            <span className="vendor-detail-vendorname">{textFormatter(data?.vendorName)}</span>
            {/* <CommonIcon icon={<XCircleIcon />} iconColor="red" iconOnClickFunction={deselectVendor} /> */}
          </div>
          <hr className="horizontal-line-app-ros" />
          <div className="width-100 stack-row-center-between">
            <div className="flex-colum-align-start">
              <span className="vendor-details-card-label">GST</span>
              <span className="vendor-details-card-value">{data?.gst}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="vendor-details-card-label">PAN</span>
              <span className="vendor-details-card-value">{data?.vendorPan}</span>
            </div>
          </div>
          <div className="flex-colum-align-start">
            <span className="vendor-details-card-label">Address</span>
            <span className="vendor-details-card-value-secondary">{data?.address || 'NA'}</span>
          </div>
        </div>
        <div className="vendor-details-pi-info-ros-app">
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start" onClick={() => handleOpenDrawer('purchaseTerms')}>
              <span className="vendor-details-card-label">Purchase terms</span>
              <span className="vendor-details-card-value">
                {data?.purchaseTerms?.length > 1 ? data?.purchaseTerms?.[0] + '...' : data?.purchaseTerms?.[0] || 'NA'}
              </span>
            </div>
            <div className="flex-colum-align-end" onClick={() => handleOpenDrawer('purchaseMethod')}>
              <span className="vendor-details-card-label" style={{ textAlign: 'end' }}>
                Purchase method
              </span>
              <span className="vendor-details-card-value">
                {data?.purchaseMethod?.length > 1
                  ? data?.purchaseMethod?.[0] + '...'
                  : data?.purchaseMethod?.[0] || 'NA'}
              </span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="vendor-details-card-label">Returns & replacement</span>
              <span className="vendor-details-card-value">{data?.returnAndReplacement}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="vendor-details-card-label">Open debit note</span>
              <span className="vendor-details-card-value">₹ {data?.vendorDebitNote}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="vendor-details-card-label">Available credits</span>
              <span className="vendor-details-card-value">₹ {data?.availableCredits}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="vendor-details-card-label">Open returns</span>
              <span className="vendor-details-card-value">₹ {data?.vendorReturn}</span>
            </div>
          </div>
        </div>
      </div>
      <MobileDrawerCommon drawerOpen={openDrawer} drawerClose={handleDrawerClose} anchor={'bottom'}>
        <div className="drawer-common-purchase-method">
          {drawerContentType === 'purchaseTerms'
            ? data?.purchaseTerms &&
              data?.purchaseTerms?.map((item) => <span className="purchase-terms-method-span">{item}</span>)
            : data?.purchaseMethod &&
              data?.purchaseMethod?.map((item) => <span className="purchase-terms-method-span">{item}</span>)}
        </div>
      </MobileDrawerCommon>
    </>
  );
};

export default VendorCardDetailsMob;
