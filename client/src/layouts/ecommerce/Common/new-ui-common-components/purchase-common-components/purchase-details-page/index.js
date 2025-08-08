import './purchase-details-page.css';
import { CopyToClipBoardValue, isSmallScreen } from '../../../CommonFunction';
import { memo, useMemo } from 'react';
import AdditionalDetails from '../../additional-details';
import CommonTimeLine from '../../timeline';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import PurchaseDetailsHeader from './components/purchase-details-header';
import CustomMobileButton from '../../../mobile-new-ui-components/button';
import { ArrowDownTrayIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import CommonId from '../../../mobile-new-ui-components/common-id';
import CommonIcon from '../../../mobile-new-ui-components/common-icon-comp';
import { useNavigate } from 'react-router-dom';
import CommonStatus from '../../../mobile-new-ui-components/status';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const NewPurchaseDetailsPage = memo(
  ({
    children,
    isPi,
    isPo,
    purchaseIndentDetails,
    purchaseId,
    additionalDetails,
    timelineArray,
    piType,
    handleMenu,
    timelineLoader,
    handlePoMenu,
    purchaseOrderDetails,
    timelineFunction,
    loader,
    addressDetails,
    createdBy,
    handlePiApprove,
    handlePiDecline,
    isRelatedPoCreated,
    handleClickpdfPi,
    pdfDownloaderLoader,
    convertPo,
    handleClickpdfPo,
    isPoInwarded,
  }) => {
    const isMobileDevice = isSmallScreen();
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    const array = useMemo(
      () => [
        {
          tabName: 'Purchase Value',
          tabValue: 'purchaseValue',
          tabDescription: `${additionalDetails?.purchaseDescValue || 'NA'}% difference`,
          tabIcon: '',
        },
        {
          tabName: 'Fill Rate',
          tabValue: 'fillRate',
          tabDescription: `${additionalDetails?.fillRateFrom || '0'} products`,
          tabIcon: '',
        },
        { tabName: 'Vendors', tabValue: 'vendors', tabDescription: '', tabIcon: '' },
        { tabName: 'Purchase Orders', tabValue: 'poCreated', tabDescription: '', tabIcon: '' },
        { tabName: 'Quotes Received', tabValue: 'quoteReceived', tabDescription: '', tabIcon: '' },
        {
          tabName: 'Procurement Cycle',
          tabValue: 'procurementCycle',
          tabDescription: `from ${additionalDetails?.shipmentCount} shipment`,
          tabIcon: '',
        },
      ],
      [additionalDetails],
    );

    const poArray = useMemo(
      () => [
        {
          tabName: 'Purchase Value',
          tabValue: 'poValue',
          tabDescription: `${additionalDetails?.poDescValue || 'NA'}% difference`,
          tabIcon: '',
        },
        {
          tabName: 'Fill Rate',
          tabValue: 'fillRate',
          tabDescription: `${additionalDetails?.fillRateFrom || '0'} products`,
          tabIcon: '',
        },
        {
          tabName: 'Purchase Offers',
          tabValue: 'purchaseOffers',
          tabDescription: `on ${additionalDetails?.purchaseOfferValue || '0'} products`,
          tabIcon: '',
        },
        {
          tabName: 'Purchase Bills',
          tabValue: 'purchaseBills',
          tabDescription: `due on ${additionalDetails?.purchaseBillDueDate || 'NA'}`,
          // tabIcon: <DownloadIcon />,
          tabIcon: '',
        },
        {
          tabName: 'Payment Made',
          tabValue: 'paymentMadeValue',
          tabDescription: `${additionalDetails?.paymentPendingPercentage || '0'} pending`,
          // tabIcon: <DownloadIcon />,
          tabIcon: '',
        },
        {
          tabName: 'Additional expense',
          tabValue: 'additionalExpense',
          tabDescription: `from ${additionalDetails?.additionalExpenseValue || '0'} bill`,
          tabIcon: '',
        },
      ],
      [additionalDetails],
    );

    const handleEdit = () => {
      navigate(`/purchase/purchase-indent/create-purchase-indent/${purchaseId}`);
    };

    const handleEditPo = () => {
      navigate(`/purchase/purchase-orders/create-purchase-order/${purchaseId}`);
    };

    const convertToGrn = () => {
      navigate('/upcoming-feature');
    };

    const handlePurchaseIdCopy = () => {
      navigator.clipboard.writeText(purchaseId);
      showSnackbar('Copied', 'success');
    };

    return (
      <DashboardLayout>
        {!isMobileDevice && <DashboardNavbar prevLink={true} />}
        <div className="purchase-details-main-div purchase-details-all-flex">
          {!isMobileDevice ? (
            <PurchaseDetailsHeader
              isPi={isPi}
              isPo={isPo}
              purchaseIndentDetails={purchaseIndentDetails}
              purchaseOrderDetails={purchaseOrderDetails}
              purchaseId={purchaseId}
              piType={piType}
              handleMenu={handleMenu}
              handlePoMenu={handlePoMenu}
              loader={loader}
              createdBy={createdBy}
            />
          ) : (
            <div className="purchase-details-action-buttons-main-div purchase-details-all-flex">
              {isPo ? (
                <>
                  <div className="stack-row-center-between width-100 purchase-action-button-tools">
                    <div className="stack-row-center-between action-btn-purchase-ros-app">
                      <CustomMobileButton title="Convert to GRN" variant="blue-D" onClickFunction={convertToGrn} />
                      <CommonId id={purchaseOrderDetails?.status} />
                    </div>
                    <div className="stack-row-center-between action-btn-purchase-ros-app-icons">
                      {!isPoInwarded && purchaseOrderDetails?.status === 'ACCEPTED' && (
                        <CommonIcon icon={<PencilIcon />} iconOnClickFunction={handleEditPo} />
                      )}
                      <CommonIcon
                        icon={<ArrowDownTrayIcon />}
                        iconOnClickFunction={handleClickpdfPo}
                        loading={pdfDownloaderLoader}
                      />
                      <CommonIcon icon={<EllipsisVerticalIcon />} iconOnClickFunction={handlePoMenu} />
                    </div>
                  </div>
                  <div className="purchase-order-main-div-ros-app">
                    <div className="stack-row-center-between width-100">
                      <div className="flex-colum-align-start">
                        <span className="purchase-id-title">{purchaseOrderDetails?.vendorName}</span>
                        <span className="purchase-id-value">Vendor Name</span>
                      </div>
                      <div className="flex-colum-align-end">
                        <span className="purchase-id-title">₹ {purchaseOrderDetails?.estimatedCost}</span>
                        <span className="purchase-id-value">Purchase value</span>
                      </div>
                    </div>
                    <div className="stack-row-center-between width-100">
                      <div className="flex-colum-align-start">
                        <div className="stack-row-center-start">
                          <span className="purchase-id-title">{purchaseId}</span>
                          <ContentCopyIcon
                            className="copy-icon"
                            sx={{ cursor: 'pointer' }}
                            onClick={handlePurchaseIdCopy}
                          />
                        </div>
                        <span className="purchase-id-value">Purchase Order</span>
                      </div>
                      <div className="flex-colum-align-end">
                        <span className="purchase-id-title">{purchaseOrderDetails?.piNumber}</span>
                        <span className="purchase-id-value">Purchase Indent</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="stack-row-center-between width-100 purchase-action-button-tools">
                    <div className="stack-row-center-between action-btn-purchase-ros-app">
                      {purchaseIndentDetails?.piStatus === 'CREATED' ? (
                        <>
                          <CustomMobileButton title="Approve" variant="blue-D" onClickFunction={handlePiApprove} />
                          <CustomMobileButton title="Decline" variant="black-S" onClickFunction={handlePiDecline} />
                        </>
                      ) : purchaseIndentDetails?.piStatus === 'APPROVED' ? (
                        <CustomMobileButton title="Convert to PO" variant={'blur-D'} onClickFunction={convertPo} />
                      ) : (
                        purchaseIndentDetails?.piStatus === 'REJECTED' && (
                          <>
                            <CommonStatus status={purchaseIndentDetails?.piStatus} />
                          </>
                        )
                      )}
                    </div>
                    <div className="stack-row-center-between action-btn-purchase-ros-app-icons">
                      {!isRelatedPoCreated && purchaseIndentDetails?.piStatus !== 'REJECTED' && (
                        <CommonIcon icon={<PencilIcon />} iconOnClickFunction={handleEdit} />
                      )}
                      <CommonIcon
                        icon={<ArrowDownTrayIcon />}
                        iconOnClickFunction={handleClickpdfPi}
                        loading={pdfDownloaderLoader}
                      />
                      {/* <CommonIcon icon={<TrashIcon />} /> */}
                    </div>
                  </div>
                  <div className="stack-row-center-between width-100">
                    <div className="flex-colum-align-start">
                      <div className="stack-row-center-start">
                        <span className="purchase-id-title">{purchaseId}</span>
                        <ContentCopyIcon
                          className="copy-icon"
                          sx={{ cursor: 'pointer' }}
                          onClick={handlePurchaseIdCopy}
                        />
                      </div>
                      <span className="purchase-id-value">Indent Number</span>
                    </div>
                    <div className="flex-colum-align-end">
                      <span className="purchase-id-title">₹ {purchaseIndentDetails?.estimatedCost}</span>
                      <span className="purchase-id-value">Purchase value</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <AdditionalDetails
            additionalDetailsArray={isPi ? array : isPo && poArray}
            additionalDetails={additionalDetails}
          />
          <div className="indent-details-main-container">
            {!isMobileDevice && (
              <span className="purch-det-heading-title">{isPi ? 'Indent Timeline' : isPo && 'PO Timeline'}</span>
            )}
            <div className="indent-details-main-div">
              {!isMobileDevice && (
                <div className="purchase-details-timeline component-bg-br-sh-p">
                  <CommonTimeLine
                    timelineArray={timelineArray}
                    timelineLoader={timelineLoader}
                    purchaseId={purchaseId}
                    timelineFunction={timelineFunction}
                  />
                </div>
              )}
              <div
                className="purchase-details-data purchase-details-all-flex"
                style={{
                  marginTop: ((piType !== 'VENDOR_SPECIFIC' && !isPo) || !addressDetails) && !isMobileDevice && '-50px',
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  },
);

export default NewPurchaseDetailsPage;
