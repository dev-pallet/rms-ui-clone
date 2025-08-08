import React from 'react';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';
import CommonIcon from '../../../../Common/mobile-new-ui-components/common-icon-comp';
import { ArrowDownTrayIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { OtherDetailRow } from './components/additionalData';
import AdditionalDetails from '../../../../Common/new-ui-common-components/additional-details';
import SoftTypography from '../../../../../../components/SoftTypography';
import CommonMobileAddressDetail from '../../../../Common/mobile-new-ui-components/common-address-detaill';
import CommonAccordion from '../../../../Common/mobile-new-ui-components/common-accordion';
import CommonTimeLine from '../../../../Common/new-ui-common-components/timeline';
import { convertUTCtoIST, productIdByBarcode, textFormatter } from '../../../../Common/CommonFunction';
import CommentComponent from '../../../../Common/new-ui-common-components/comment-component';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Spinner from '../../../../../../components/Spinner';
import { Divider, Grid, Stack, Tooltip } from '@mui/material';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { useNavigate } from 'react-router-dom';
import BillingDataRow from './components/billingData';
import BillingListMobile from '../../../../Common/mobile-new-ui-components/MobileBilling';

const OrderMobileDetailsPage = ({
  loader,
  orderId,
  allData,
  handlePayment,
  handleStatusChange,
  handleInvoiceDownload,
  fileLoader,
  deliveredLoader,
  handlePurchaseIdCopy,
  additionalDetailsArray,
  orderDate,
  salesChannel,
  formatDate,
  posArray,
  array,
  infoDetails,
  metricsData,
  addressDetails,
  timelineArray,
  timelineLoader,
  timelineFunction,
  gridChipArray,
  gridChipOnClick,
  gridSelectedValue,
  currentData,
  comments,
  handleAddComment,
  handleCreateComment,
  commentLoader,
  getCommentsLoader,
  createdComment,
  renderFunction,
  billingDataRowsB2C,
  billingDataRowsOrder,
  billingDataRowsReturn,
}) => {
  const navigate = useNavigate();
  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <div className="purchase-details-action-buttons-main-div purchase-details-all-flex" style={{ padding: '10px' }}>
      <div className="stack-row-center-between width-100 purchase-action-button-tools">
        <div className="stack-row-center-between action-btn-purchase-ros-app">
          <CustomMobileButton title="Payment" variant="blue-D" onClickFunction={handlePayment} />

          {(() => {
            const statusMap = {
              CREATED: {
                title: 'Package',
                variant: 'orange-S',
                onClick: () => handleStatusChange('PACKAGED'),
              },
              IN_TRANSIT: {
                title: 'Deliver',
                variant: 'green-D',
                onClick: () => handleStatusChange('DELIVERED'),
              },
              PACKAGED: {
                title: 'In-transit',
                variant: 'yellow-solid',
                onClick: () => handleStatusChange('IN_TRANSIT'),
              },
            };

            const fulfilmentStatus = allData?.baseOrderResponse?.fulfilmentStatus;

            // Only return button if fulfilmentStatus is in statusMap
            if (!statusMap[fulfilmentStatus]) return null;

            const { title, variant, onClick } = statusMap[fulfilmentStatus];

            return (
              <CustomMobileButton title={title} variant={variant} onClickFunction={onClick} loading={deliveredLoader} />
            );
          })()}

          {loader && <Spinner size={20} />}
        </div>

        <div className="stack-row-center-between action-btn-purchase-ros-app-icons">
          {/* {salesChannel === 'DIRECT' && <CommonIcon icon={<PencilIcon />} iconOnClickFunction={handleEdit} />} */}
          {allData?.baseOrderResponse?.invoiceId && (
            <CommonIcon icon={<ArrowDownTrayIcon />} iconOnClickFunction={handleInvoiceDownload} loading={fileLoader} />
          )}
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <div className="stack-row-center-between action-btn-purchase-ros-app-icons">
            <span className="purchase-id-title">{orderId}</span>
            <CommonIcon icon={<ContentCopyIcon />} iconOnClickFunction={handlePurchaseIdCopy} />
          </div>
          <span className="purchase-id-value">Order ID</span>
        </div>
        <div className="flex-colum-align-end">
          <div className="stack-row-center-between action-btn-purchase-ros-app-icons">
            <span className="purchase-id-title">{allData?.baseOrderResponse?.invoiceId ?? 'NA'}</span>
          </div>
          <span className="purchase-id-value">Invoice ID</span>
        </div>
      </div>
      <div className="sales-order-additional-details">
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="purchase-id-value">Order value</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="purchase-id-title">₹{allData?.orderBillingDetails?.grandTotal || 'NA'}</span>
          </div>
        </div>

        <hr className="horizontal-line-app-ros" />

        <OtherDetailRow
          labelLeft="Created by"
          valueLeft={allData?.baseOrderResponse?.createdBy}
          labelRight="Customer"
          valueRight={allData?.baseOrderResponse?.customerName || 'WALK-IN'}
        />

        <div className="header-mian-grid-layout">
          {additionalDetailsArray?.map((info, index) => {
            if (info.infoName === 'Cancelled reason') {
              return;
            }
            return (
              <div key={index} className={index % 2 !== 0 ? 'flex-colum-align-end' : 'flex-colum-align-start'}>
                <span className="additional-name">{info?.infoName}</span>
                <span className="additional-value">{info?.infoValue}</span>
              </div>
            );
          })}
        </div>

        <OtherDetailRow
          labelLeft="Order date"
          valueLeft={orderDate?.date}
          labelRight={salesChannel === 'POS_ORDER' ? 'Order time' : 'Fulfillment time'}
          valueRight={salesChannel === 'POS_ORDER' ? orderDate?.time : allData?.baseOrderResponse?.fulfilmentTime}
        />

        <OtherDetailRow
          labelLeft="Shipment date"
          valueLeft={
            allData?.baseOrderResponse?.shipmentDate ? formatDate(allData?.baseOrderResponse?.shipmentDate) : 'NA'
          }
          labelRight="Payment status"
          valueRight={textFormatter(allData?.baseOrderResponse?.paymentStatus)}
          colorRight={allData?.baseOrderResponse?.paymentStatus === 'COMPLETED' ? '#0B742C' : '#ff9500'}
        />
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="additional-name">Order status</span>
            <span
              className="additional-value"
              style={{
                color: `${allData?.baseOrderResponse?.fulfilmentStatus === 'DELIVERED' ? '#0B742C' : '#ff9500'}`,
              }}
            >
              {textFormatter(allData?.baseOrderResponse?.fulfilmentStatus) ?? 'NA'}
            </span>
          </div>
          {allData?.baseOrderResponse?.cancelReason && (
            <div className="flex-colum-align-end">
              <div className="stack-row-center-between action-btn-purchase-ros-app-icons">
                <span className="additional-name">Cancel Reason</span>
              </div>
              <span className="additional-value">{allData?.baseOrderResponse?.cancelReason ?? 'NA'}</span>
            </div>
          )}
        </div>
      </div>

      <AdditionalDetails
        additionalDetailsArray={salesChannel === 'POS_ORDER' ? posArray : array}
        additionalDetails={infoDetails}
      />
      {salesChannel === 'POS_ORDER' ? (
        <>
          <div className="sales-order-additional-details">
            <div className="additional-value">Cart metrics</div>
            <div className="card-metrics-main-box">
              {metricsData?.map((metric) => {
                return (
                  <div className="card-metrics-item-box">
                    <div className="additional-name">{metric.value}</div>
                    <div className="additional-value">{metric.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sales-order-additional-details">
            <div className="additional-value">Cart Search Items</div>
            <div className="card-metrics-main-box">
              {allData?.cartMetrics?.cartSearchedItems ? (
                allData?.cartMetrics?.cartSearchedItems?.map((metric) => {
                  return (
                    <div className="card-metrics-item-box">
                      <div className="additional-name">{item.label}</div>
                    </div>
                  );
                })
              ) : (
                <SoftTypography fontSize="14px">No item found</SoftTypography>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mob-vendor-address">
          <p className="mob-address-heading">Address</p>
          {addressDetails?.billingAddress && (
            <>
              <CommonMobileAddressDetail
                heading="Billing address"
                address={allData?.addressEntityModel?.billingAddress}
                includeFields={['name', 'addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
              />
            </>
          )}
          {addressDetails?.shippingAddress && (
            <>
              <CommonMobileAddressDetail
                heading="Shipping address"
                address={allData?.addressEntityModel?.shippingAddress}
                includeFields={['name', 'addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
              />
            </>
          )}
        </div>
      )}
      <CommonAccordion title={'Order Timeline'} backgroundColor={'black'}>
        <CommonTimeLine
          timelineArray={timelineArray}
          timelineLoader={timelineLoader}
          purchaseId={orderId}
          timelineFunction={timelineFunction}
        />
      </CommonAccordion>
      <div className="listing-order-name-main">
        {gridChipArray?.map((item) => {
          return (
            <>
              {item.toShow && (
                <CustomMobileButton
                  key={item.chipValue}
                  variant={gridSelectedValue === item.chipValue ? 'black-D' : 'black-S'}
                  title={item.chipName}
                  onClickFunction={() => gridChipOnClick(item.chipValue)}
                  flex={1}
                  justifyContent={'center'}
                  minWidth={'max-content'}
                >
                  {item.chipName}
                </CustomMobileButton>
              )}
            </>
          );
        })}
      </div>
      <div className="mob-vendor-address" style={{ marginTop: '-10px' }}>
        <div className="selected-grid-title">{textFormatter(gridSelectedValue)}</div>
        <div
          className="indent-details-mob-card-main-container"
          style={{ height: currentData?.length <= 1 ? 'auto' : '400px', padding: '0px' }}
        >
          {currentData?.length ? (
            currentData?.map((data, index) => renderFunction(data, index, handleProductNavigation))
          ) : (
            <div className="no-data-purchase">
              <span>No {gridSelectedValue.replace('_', ' ')} found</span>
            </div>
          )}
        </div>
      </div>

      {gridSelectedValue === 'order_details' ? (
        <>
          {allData?.orderBillingDetails?.payments?.length > 0 && (
            <div className="mob-vendor-address">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '10px',
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: '0',
                }}
              >
                <div className="selected-grid-title">Transaction history</div>
                <div
                  className="indent-details-mob-card-main-container"
                  style={{
                    height: allData?.orderBillingDetails?.payments?.length <= 1 ? 'auto' : '200px',
                    width: '100%',
                    margin: 'auto',
                    padding: '0px',
                  }}
                >
                  {allData?.orderBillingDetails?.payments?.length
                    ? allData?.orderBillingDetails?.payments?.map((data, index) => {
                        return (
                          <div className="card-purchase-main-div">
                            <div className="card-main-component pi-item-card-main-component" key={index}>
                              <div className="indent-details-info-div width-100">
                                <div className="stack-row-center-between width-100">
                                  <div className="flex-colum-align-start">
                                    <span className="card-sub-title">Transaction ID:</span>
                                  </div>
                                  <div className="flex-colum-align-end">
                                    <span className="card-title">{data?.paymentId || 'NA'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="stack-row-center-between width-100">
                                <div className="flex-colum-align-start">
                                  <span className="card-title"> {data?.paymentMethod || 0}</span>
                                  <span className="card-sub-title">Payment method</span>
                                  {/* {data?.paymentMethod === 'CASH' ? (
                                  <CurrencyRupeeRoundedIcon
                                    className="transaction-visa-icon-order"
                                    style={{ marginLeft: '-5px' }}
                                  />
                                ) : (
                                  <CreditCardOutlinedIcon
                                    className="transaction-visa-icon-order"
                                    style={{ marginLeft: '-5px' }}
                                  />
                                )} */}
                                </div>
                                <div className="flex-colum-align-end">
                                  <span
                                    className={
                                      data?.paymentStatus === 'COMPLETED'
                                        ? 'transaction-success-order'
                                        : 'transaction-failed-order'
                                    }
                                  >
                                    {data?.paymentStatus === 'COMPLETED' ? 'Success' : data?.paymentStatus}
                                  </span>
                                  <span className="card-sub-title">Status</span>
                                </div>
                              </div>
                              <div className="stack-row-center-between width-100">
                                <div className="flex-colum-align-start">
                                  <span className="card-title">₹ {data?.amountPaid || 0}</span>
                                  <span className="card-sub-title">Amount</span>
                                </div>
                                <div className="flex-colum-align-end">
                                  <span className="card-title">{convertUTCtoIST(data?.paymentDate) ?? 'NA'}</span>
                                  <span className="card-sub-title">Payment Date</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          )}

          <div className="mob-vendor-address">
            {salesChannel === 'B2C_ORDER' ? (
              <BillingListMobile billingList={billingDataRowsB2C} />
            ) : (
              <BillingListMobile billingList={billingDataRowsOrder} />
            )}
          </div>
        </>
      ) : gridSelectedValue === 'returns' && allData?.returnDetails?.refund?.length > 0 ? (
        <>
          {allData?.orderBillingDetails?.payments?.length > 0 && (
            <div className="mob-vendor-address">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '10px',
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: '0',
                }}
              >
                <div className="selected-grid-title">Transaction history</div>

                <div
                  className="indent-details-mob-card-main-container"
                  style={{
                    height: allData?.returnDetails?.refund?.length <= 1 ? 'auto' : '200px',
                    width: '100%',
                    margin: 'auto',
                    padding: '0',
                  }}
                >
                  {allData?.returnDetails?.refund?.length
                    ? allData?.returnDetails?.refund?.map((data, index) => {
                        return (
                          <div className="card-purchase-main-div">
                            <div className="card-main-component pi-item-card-main-component" key={index}>
                              <div className="indent-details-info-div width-100">
                                <div className="stack-row-center-between width-100">
                                  <div className="flex-colum-align-start">
                                    <span className="card-sub-title">Transaction ID:</span>
                                  </div>
                                  <div className="flex-colum-align-end">
                                    <span className="card-title">{data?.transactionCode || 'NA'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="stack-row-center-between width-100">
                                <div className="flex-colum-align-start">
                                  <span className="card-title"> {data?.refundMode || 0}</span>
                                  <span className="card-sub-title">Refund mode</span>
                                  {/* {data?.refundMode === 'CASH' ? (
                                  <CurrencyRupeeRoundedIcon
                                    className="transaction-visa-icon-order"
                                    style={{ marginLeft: '-5px' }}
                                  />
                                ) : (
                                  <CreditCardOutlinedIcon
                                    className="transaction-visa-icon-order"
                                    style={{ marginLeft: '-5px' }}
                                  />
                                )} */}
                                </div>
                                <div className="flex-colum-align-end">
                                  <span
                                    className={
                                      data?.status === 'COMPLETED'
                                        ? 'transaction-success-order'
                                        : 'transaction-failed-order'
                                    }
                                  >
                                    {data?.status === 'COMPLETED' ? 'Success' : data?.status}
                                  </span>
                                  <span className="card-sub-title">Status</span>
                                </div>
                              </div>
                              <div className="stack-row-center-between width-100">
                                <div className="flex-colum-align-start">
                                  <span className="card-title">₹ {data?.refundAmount || 0}</span>
                                  <span className="card-sub-title">Amount</span>
                                </div>
                                <div className="flex-colum-align-end">
                                  <span className="card-title">{convertUTCtoIST(data?.createdDate) ?? 'NA'}</span>
                                  <span className="card-sub-title">Payment Date</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          )}
          <div className="mob-vendor-address">
            <BillingListMobile billingList={billingDataRowsReturn} />
          </div>
        </>
      ) : null}
      <div
        style={{
          paddingTop: '10px',
          width: '100%',
        }}
      >
        <CommentComponent
          commentData={comments}
          addCommentFunction={handleAddComment}
          handleSend={handleCreateComment}
          loader={commentLoader}
          getCommentsLoader={getCommentsLoader}
          createdComment={createdComment}
        />
      </div>
    </div>
  );
};

export default OrderMobileDetailsPage;
