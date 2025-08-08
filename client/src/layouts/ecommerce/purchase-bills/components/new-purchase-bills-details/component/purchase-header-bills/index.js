// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './purchase-bills-header.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CircularProgress, Divider, Tooltip } from '@mui/material';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import { vieworderspdf } from '../../../../../../../config/Services';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SoftButton from '../../../../../../../components/SoftButton';
// import styled from '@emotion/styled';
// import Spinner from '../../../../../../../../components/Spinner';

const PurchaseBillHeaders = ({ billId, handleMenu, loader, billDetails, payNowFunc, invoiceRefNo }) => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const navigate = useNavigate();

  const additionalInfoArray = [
    { infoName: 'Inward Location', infoValue: 'inwardLocation' },
    { infoName: 'Inward Type', infoValue: 'inwardType' },
    { infoName: 'Approved by', infoValue: 'approvedBy' },
    { infoName: 'Po Number', infoValue: 'poNumber' },
    { infoName: 'Bill Date', infoValue: 'billDate' },
    { infoName: 'Due date', infoValue: 'dueDate' },
  ];

  const handlePurchaseIdCopy = () => {
    navigator.clipboard.writeText(billDetails?.invoiceRefNo);
    showSnackbar('Copied', 'success');
  };

  const [viewBillLoader, setViewBillLoader] = useState(false);
  const handleViewPdf = async (docId) => {
    if (docId === 'NA' || docId === null || docId === undefined) {
      return showSnackbar('No document found', 'error');
    }
    setViewBillLoader(true);
    const res = await vieworderspdf(docId);
    let blob;
    if (res?.headers?.['content-type'] === 'application/pdf') {
      blob = new Blob([res?.data], { type: 'application/pdf' });
    } else {
      blob = new Blob([res?.data], { type: 'image/png' });
    }
    const url = URL.createObjectURL(blob);
    setViewBillLoader(false);
    window.open(url, '_blank');
  };

  const navigateToPODetails = (idNumber) => {
    if (idNumber === 'NA' || idNumber === null || idNumber === undefined) {
      showSnackbar('PO number not available', 'error');
      return;
    }
    navigate(`/purchase/purchase-orders/details/${idNumber}`);
  };

  const navigateToPurchaseExpress = (grnId) => {
    if (grnId === 'NA' || grnId === null || grnId === undefined) {
      showSnackbar('Inward ID not available', 'error');
      return;
    }
    navigate(`/purchase/express-grn/details/${grnId}`);
  };
  return (
    <div className="purchDet-main-info-container component-bg-br-sh-p">
      <div className="purchDet-main-info-main-div">
        <div className="purchDet-main-info">
          <div className="title-menu-main-container-mobile">
            <div className="purchDet-id-main-conatiner">
              <h1 className="purchase-id">{`Bill number ${
                billDetails?.invoiceRefNo === '' ||
                billDetails?.invoiceRefNo === null ||
                billDetails?.invoiceRefNo === undefined
                  ? billId
                  : billDetails?.invoiceRefNo
              }`}</h1>
              <ContentCopyIcon className="copy-icon" sx={{ cursor: 'pointer' }} onClick={handlePurchaseIdCopy} />
              {/* {loader && <Spinner size={20} />} */}
            </div>
            <div className="menu-icon-div-mobile">
              <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
            </div>
          </div>
          <div
            className="purchDet-vendor-name"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '5px',
            }}
            onClick={() => navigateToPODetails(billDetails?.poNumber)}
          >
            <span className="purchDet-vendorName-value-title grn-poNumber">{`PO Number ${billDetails?.poNumber}`}</span>
            {/* <ContentCopyIcon className="copy-icon" sx={{ cursor: 'pointer' }}onClick={handlePurchaseIdCopy} /> */}
            {/* <span className="purchDet-vendorName-value-value">{billDetails?.poNumber}</span> */}
          </div>
          <div className="pallet-iq-generated">
            <span className="pallet-iq-generated-text">{`Added by ${billDetails?.createdBy}`}</span>
          </div>

          <div className="purchDet-vendor-name">
            <span className="purchDet-vendorName-value-title">Vendor Name</span>
            <span className="purchDet-vendorName-value-value">{billDetails?.vendorName}</span>
          </div>
        </div>
        {isMobileDevice && <Divider className="common-divider-mob" />}
        <div className="purchDet-main-tools">
          <div className="purchDet-main-aprroval-info">
            <div className="purchDet-estimated-value">
              <span className="purchDet-vendorName-value-title">Bill Value</span>
              <div className="value-view-bill-div">
                <span
                  className="estimated-value"
                  style={{
                    lineHeight: '1em',
                  }}
                >
                  ₹{billDetails?.billValue}
                </span>
                <span
                  className="view-payment-doc"
                  style={{
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleViewPdf(billDetails?.docId)}
                >
                  View Bill {viewBillLoader && <CircularProgress size={15} sx={{ color: '#0562fb !important' }} />}
                </span>
              </div>
            </div>
            <div className="purchDet-approval-info-details">
              {/* <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Expected Delivery</span>
                <span className="purchDet-vendorName-value-title">
                  {isPi
                    ? purchaseIndentDetails?.expectedDeliveryDate || 'NA'
                    : purchaseOrderDetails?.expectedDeliveryDate || 'NA'}
                </span>
              </div> */}
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Delivered on</span>
                <span className="purchDet-vendorName-value-title purchase-header-values">
                  {billDetails?.deliveredOn}
                </span>
                {/* <span className="purchDet-vendorName-value-title">{!isPi ? '' : purchaseIndentDetails?.assignedTo}</span> */}
              </div>
              {/* <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">
                  {!isPi ? 'Delivery days' : 'Approved By'}
                </span>
                <span className="purchDet-vendorName-value-title">
                  {!isPi ? purchaseOrderDetails?.deliveryDays || 'NA' : purchaseIndentDetails?.approvedBy || 'NA'}
                </span>
              </div> */}
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Delivery Location</span>
                <span className="purchDet-vendorName-value-title purchase-header-values">
                  {billDetails?.deliveryLocation?.length > 15 ? (
                    <Tooltip
                      title={
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          {billDetails?.deliveryLocation}
                        </div>
                      }
                    >
                      {billDetails?.deliveryLocation?.slice(0, 15) + '...'}
                    </Tooltip>
                  ) : (
                    billDetails?.deliveryLocation
                  )}
                </span>
              </div>
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Inward ID</span>
                <span
                  className="purchDet-vendorName-value-title purchase-header-values grn-poNumber"
                  onClick={() => navigateToPurchaseExpress(billDetails?.inwardId)}
                >
                  {billDetails?.inwardId}
                </span>
              </div>
              {permissions?.RETAIL_Purchase?.WRITE ||
              permissions?.WMS_Purchase?.WRITE ||
              permissions?.VMS_Purchase?.WRITE ? (
                <div className="pay-now-btn">
                  <SoftButton
                    variant="contained"
                    color="info"
                    onClick={payNowFunc}
                    sx={{
                      padding: '5px 2px 5px 2px !important',
                      minHeight: '0px !important',
                    }}
                  >
                    Pay Now
                  </SoftButton>
                </div>
              ) : null}
            </div>
          </div>
          <div className="menu-icon-div">
            <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
          </div>
        </div>
      </div>
      {isMobileDevice && <Divider className="common-divider-mob" />}
      <div className="additional-info-main-container">
        {additionalInfoArray.map((info) => {
          return (
            <div className="purchDet-header-additional-info">
              <span className="additionalInfo-title">{info?.infoName}</span>
              <span
                className="purchDet-vendorName-value-value second-tooltip-container"
                //   onClick={info?.infoValue === 'purchaseTerms' && handleSecondTooltipOpen}
              >
                {billDetails?.[info?.infoValue]?.length > 15 ? (
                  <Tooltip
                    title={
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        {billDetails?.[info?.infoValue]}
                      </div>
                    }
                  >
                    {billDetails?.[info?.infoValue]?.slice(0, 15) + '...'}
                  </Tooltip>
                ) : (
                  billDetails?.[info?.infoValue]
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseBillHeaders;
