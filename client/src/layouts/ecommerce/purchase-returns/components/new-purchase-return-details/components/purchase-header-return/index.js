import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { CircularProgress, Tooltip } from '@mui/material';
import Spinner from '../../../../../../../components/Spinner';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import './purchase-header.css';

const PurchaseReturnHeader = ({
  purchaseReturnId,
  data,
  additionalInfoArray,
  handleMenuOpen,
  downloadFile,
  viewDebitNoteLoader,
  returnLoader,
}) => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();

  const handlePurchaseIdCopy = () => {
    navigator.clipboard.writeText(purchaseReturnId);
    showSnackbar('Copied', 'success');
  };

  return (
    <div className="purchDet-main-info-container component-bg-br-sh-p">
      <div className="purchDet-main-info-main-div">
        <div className="purchDet-main-info">
          <div className="title-menu-main-container-mobile">
            <div className="purchDet-id-main-conatiner">
              <h1 className="purchase-id">{`Purchase Return ${purchaseReturnId}`}</h1>
              <ContentCopyIcon className="copy-icon" sx={{ cursor: 'pointer' }} onClick={handlePurchaseIdCopy} />
              {returnLoader && <Spinner size={20} />}
            </div>
            <div className="menu-icon-div-mobile">
              <MoreHorizRoundedIcon
                fontSize="large"
                className="copy-icon menu-icon"
                // onClick={isPi ? handleMenu : handlePoMenu}
              />
            </div>
          </div>
          {!isMobileDevice && (
            <div className="pallet-iq-generated">
              {/* <AutoAwesomeIcon className="copy-icon" /> */}
              <span className="pallet-iq-generated-text">Created by {data?.createdBy}</span>
            </div>
          )}
          <div className="purchDet-vendor-name">
            <span className="purchDet-vendorName-value-title">Vendor Name</span>
            <span className="purchDet-vendorName-value-value">{data?.vendorName || 'NA'}</span>
          </div>
        </div>
        <div className="purchDet-main-tools">
          <div className="purchDet-main-aprroval-info">
            <div className="purchDet-estimated-value">
              <span className="purchDet-vendorName-value-title">Return Value</span>
              <span className="estimated-value">₹{data?.returnValue || '0'}</span>
            </div>
            <div className="purchDet-approval-info-details">
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Expected Pickup</span>
                <span className="purchDet-vendorName-value-title">{data?.expectedPickUp || 'NA'}</span>
              </div>
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Return Mode</span>
                <span className="purchDet-vendorName-value-title">{data?.returnMode || 'NA'}</span>
              </div>
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Return Type</span>
                <span className="purchDet-vendorName-value-title">{data?.returnType || 'NA'}</span>
              </div>
              <div className="purchDet-approval-info-span-div view-debit-note-loader" onClick={downloadFile}>
                <span className="view-debit-note">View Debit Note</span>
                {viewDebitNoteLoader && <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />}
              </div>
            </div>
          </div>
          <div className="menu-icon-div">
            <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenuOpen} />
          </div>
        </div>
      </div>
      <div className="additional-info-main-container return-additional-info-div">
        {additionalInfoArray.map((info) => {
          return (
            <div className="purchDet-header-additional-info">
              <span className="additionalInfo-title">{info.infoName}</span>
              <span className="purchDet-vendorName-value-value second-tooltip-container">
                {data?.[info?.infoValue]?.length > 13 ? (
                  <Tooltip title={data?.[info?.infoValue]}>{data?.[info?.infoValue].slice(0, 13) + '...'}</Tooltip>
                ) : (
                  data?.[info?.infoValue] || 'NA'
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseReturnHeader;
