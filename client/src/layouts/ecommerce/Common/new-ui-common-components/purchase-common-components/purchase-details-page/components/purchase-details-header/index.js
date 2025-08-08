import './purchase-details-header.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ClickAwayListener, Divider, Tooltip, tooltipClasses } from '@mui/material';
import { isSmallScreen } from '../../../../../CommonFunction';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Spinner from '../../../../../../../../components/Spinner';
import styled from '@emotion/styled';

const PurchaseDetailsHeader = ({
  isPi,
  isPo,
  purchaseIndentDetails,
  purchaseId,
  piType,
  handleMenu,
  handlePoMenu,
  purchaseOrderDetails,
  loader,
  createdBy,
}) => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const additionalInfoArray = [
    { infoName: 'Purchase Method', infoValue: 'purchaseMethod' },
    { infoName: 'Purchase Terms', infoValue: 'purchaseTerms' },
    { infoName: 'Returns & Replacement', infoValue: 'returnAndReplacement' },
    { infoName: 'Open Debit Notes', infoValue: 'openDebitNote' },
    { infoName: 'Available Credits', infoValue: 'vendorCreditNote' },
    { infoName: 'Open Returns', infoValue: 'openReturns' },
  ];

  const handlePurchaseIdCopy = () => {
    navigator.clipboard.writeText(purchaseId);
    showSnackbar('Copied', 'success');
  };

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = (e) => {
    setOpen(true);
  };

  const [openSecond, setOpenSecond] = useState(false);

  const handleSecondTooltipClose = () => {
    setOpenSecond(false);
  };

  const handleSecondTooltipOpen = (e) => {
    e.stopPropagation();
    setOpenSecond(true);
  };

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 450,
    },
  });

  const navigateToPiDetails = (idNumber) => {
    if (idNumber === 'NA' || idNumber === null || idNumber === undefined) {
      showSnackbar('PI number not available', 'error');
      return;
    }
    navigate(`/purchase/purchase-indent/details/${idNumber}`);
  };

  return (
    <div className="purchDet-main-info-container component-bg-br-sh-p">
      <div className="purchDet-main-info-main-div">
        <div className="purchDet-main-info">
          <div className="title-menu-main-container-mobile">
            <div className="purchDet-id-main-conatiner">
              <h1 className="purchase-id">{isPi ? `Indent number ${purchaseId}` : `Purchase Order ${purchaseId}`}</h1>
              <ContentCopyIcon className="copy-icon" sx={{ cursor: 'pointer' }} onClick={handlePurchaseIdCopy} />
              {loader && <Spinner size={20} />}
            </div>
            <div className="menu-icon-div-mobile">
              <MoreHorizRoundedIcon
                fontSize="large"
                className="copy-icon menu-icon"
                onClick={isPi ? handleMenu : handlePoMenu}
              />
            </div>
          </div>
          {isPo && (
            <div
              className="purchDet-id-main-conatiner"
              onClick={() => navigateToPiDetails(purchaseOrderDetails?.piNumber)}
            >
              {/* <AutoAwesomeIcon className="copy-icon" /> */}
              <span className="pallet-iq-generated-text  grn-poNumber">{`PI Number ${
                purchaseOrderDetails?.piNumber || 'NA'
              }`}</span>
              {/* <ContentCopyIcon className="copy-icon" sx={{ cursor: 'pointer' }}onClick={handlePurchaseIdCopy} /> */}
            </div>
          )}
          {!isMobileDevice && (
            <div className="pallet-iq-generated">
              {/* <AutoAwesomeIcon className="copy-icon" /> */}
              <span className="pallet-iq-generated-text">{`Created By ${createdBy}`}</span>
            </div>
          )}
          {(piType === 'VENDOR_SPECIFIC' || isPo) && (
            <div className="purchDet-vendor-name">
              <span className="purchDet-vendorName-value-title">Vendor Name</span>
              <span className="purchDet-vendorName-value-value">
                {isPi ? purchaseIndentDetails?.vendorName : purchaseOrderDetails?.vendorName}
              </span>
            </div>
          )}
        </div>
        {isMobileDevice && <Divider className="common-divider-mob" />}
        <div className="purchDet-main-tools">
          <div className="purchDet-main-aprroval-info">
            <div className="purchDet-estimated-value">
              <span className="purchDet-vendorName-value-title">Estimated Value</span>
              <span className="estimated-value">
                ₹{isPi ? purchaseIndentDetails?.estimatedCost : purchaseOrderDetails?.estimatedCost}
              </span>
            </div>
            <div className="purchDet-approval-info-details">
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Expected Delivery</span>
                <span className="purchDet-vendorName-value-title side-values-purchase-bold">
                  {isPi
                    ? purchaseIndentDetails?.expectedDeliveryDate || 'NA'
                    : purchaseOrderDetails?.expectedDeliveryDate || 'NA'}
                </span>
              </div>
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">
                  {!isPi ? 'Delivered on' : 'Assinged To'}
                </span>
                {!isPi ? (
                  <span className="purchDet-vendorName-value-title side-values-purchase-bold side-values-purchase-bold">
                    {purchaseOrderDetails?.deliveredOn}
                  </span>
                ) : (
                  <div>
                    {purchaseIndentDetails?.assignedTo?.slice(0, 1).map((item, index) => (
                      <ClickAwayListener onClickAway={handleTooltipClose}>
                        <Tooltip
                          onClose={isMobileDevice ? handleTooltipClose : undefined}
                          open={isMobileDevice ? open : undefined}
                          disableFocusListener={isMobileDevice}
                          disableHoverListener={isMobileDevice}
                          disableTouchListener={isMobileDevice}
                          title={
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                              }}
                            >
                              {purchaseIndentDetails?.assignedTo?.map((item, index) => (
                                <span className="purchDet-vendorName-value-title">{item?.name || 'NA'}</span>
                              ))}
                            </div>
                          }
                        >
                          <span
                            className="purchDet-vendorName-value-title side-values-purchase-bold"
                            style={{ cursor: 'pointer' }}
                            onClick={handleTooltipOpen}
                          >
                            {item?.name || 'NA'}
                          </span>
                        </Tooltip>
                      </ClickAwayListener>
                    ))}
                    <span className="purchDet-vendorName-value-title  side-values-purchase-bold">
                      {purchaseIndentDetails?.assignedTo?.length > 1 && <span>...</span>}
                    </span>
                  </div>
                )}

                {/* <span className="purchDet-vendorName-value-title">{!isPi ? '' : purchaseIndentDetails?.assignedTo}</span> */}
              </div>
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">
                  {!isPi ? 'Delivery days' : 'Approved By'}
                </span>
                <span className="purchDet-vendorName-value-title side-values-purchase-bold">
                  {!isPi ? purchaseOrderDetails?.deliveryDays || 'NA' : purchaseIndentDetails?.approvedBy || 'NA'}
                </span>
              </div>
              <div className="purchDet-approval-info-span-div">
                <span className="purchDet-vendorName-value-title approval-info-title">Delivery Location</span>
                <span className="purchDet-vendorName-value-title side-values-purchase-bold">
                  {isPi ? (
                    purchaseIndentDetails?.deliveryLocation?.length > 15 ? (
                      <Tooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        open={undefined}
                        onClose={undefined}
                        title={
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                            }}
                          >
                            {purchaseIndentDetails?.deliveryLocation}
                          </div>
                        }
                      >
                        {purchaseIndentDetails?.deliveryLocation?.slice(0, 15) + '...'}
                      </Tooltip>
                    ) : (
                      purchaseIndentDetails?.deliveryLocation
                    )
                  ) : purchaseOrderDetails?.deliveryLocation?.length > 15 ? (
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                      }}
                      open={undefined}
                      onClose={undefined}
                      title={
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          {purchaseOrderDetails?.deliveryLocation}
                        </div>
                      }
                    >
                      {purchaseOrderDetails?.deliveryLocation?.slice(0, 15) + '...'}
                    </Tooltip>
                  ) : (
                    purchaseOrderDetails?.deliveryLocation
                  )}
                </span>
              </div>
              {isPo && (
                <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Invoice Number</span>
                  <span className="purchDet-vendorName-value-title side-values-purchase-bold">
                    {purchaseOrderDetails?.invoiceRefNo?.length > 1 ? (
                      <Tooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        open={undefined}
                        onClose={undefined}
                        title={
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              gap: '5px',
                            }}
                          >
                            {purchaseOrderDetails?.invoiceRefNo?.map((item, index) => (
                              <span className="purchDet-vendorName-value-title">{item || 'NA'}</span>
                            ))}
                          </div>
                        }
                      >
                        {purchaseOrderDetails?.invoiceRefNo?.[0] + '...'}
                      </Tooltip>
                    ) : (
                      purchaseOrderDetails?.invoiceRefNo?.[0] || 'NA'
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="menu-icon-div">
            <MoreHorizRoundedIcon
              fontSize="large"
              className="copy-icon menu-icon"
              onClick={isPi ? handleMenu : handlePoMenu}
            />
          </div>
        </div>
      </div>
      {isMobileDevice && (piType === 'VENDOR_SPECIFIC' || isPo) && <Divider className="common-divider-mob" />}
      {(piType === 'VENDOR_SPECIFIC' || isPo) && (
        <div className="additional-info-main-container">
          {additionalInfoArray.map((info) => {
            const isPurchaseTerms = isPi
              ? purchaseIndentDetails?.purchaseTerms?.length > 15
                ? purchaseIndentDetails?.purchaseTerms?.split(',')
                : purchaseIndentDetails?.purchaseTerms
              : purchaseOrderDetails?.purchaseTerms?.length > 15
              ? purchaseOrderDetails?.purchaseTerms?.split(',')
              : purchaseOrderDetails?.purchaseTerms;
            return (
              <div className="purchDet-header-additional-info">
                <span className="additionalInfo-title">{info.infoName}</span>
                <span
                  className="purchDet-vendorName-value-value second-tooltip-container"
                  onClick={info?.infoValue === 'purchaseTerms' && handleSecondTooltipOpen}
                >
                  {isPi ? (
                    purchaseIndentDetails?.[info?.infoValue]?.length > 15 && info?.infoValue === 'purchaseTerms' ? (
                      <ClickAwayListener onClickAway={handleSecondTooltipClose}>
                        <Tooltip
                          PopperProps={{
                            disablePortal: true,
                          }}
                          open={isMobileDevice ? openSecond : undefined}
                          onClose={isMobileDevice ? handleSecondTooltipClose : undefined}
                          disableFocusListener={isMobileDevice}
                          disableHoverListener={isMobileDevice}
                          disableTouchListener={isMobileDevice}
                          title={
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                              }}
                            >
                              {isPurchaseTerms?.map((item, index) => (
                                <span className="purchDet-vendorName-value-title">{item}</span>
                              ))}
                            </div>
                          }
                        >
                          {purchaseIndentDetails?.[info?.infoValue].slice(0, 15) + '...'}
                        </Tooltip>
                      </ClickAwayListener>
                    ) : (
                      purchaseIndentDetails?.[info?.infoValue]
                    )
                  ) : purchaseOrderDetails?.[info?.infoValue]?.length > 15 && info?.infoValue === 'purchaseTerms' ? (
                    <CustomWidthTooltip
                      open={isMobileDevice ? openSecond : undefined}
                      onClose={isMobileDevice ? handleSecondTooltipClose : undefined}
                      title={
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          {isPurchaseTerms?.map((item, index) => (
                            <span className="purchDet-vendorName-value-title">{item}</span>
                          ))}
                        </div>
                      }
                    >
                      {purchaseOrderDetails?.[info?.infoValue].slice(0, 15) + '...'}
                    </CustomWidthTooltip>
                  ) : (
                    purchaseOrderDetails?.[info?.infoValue]
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PurchaseDetailsHeader;
