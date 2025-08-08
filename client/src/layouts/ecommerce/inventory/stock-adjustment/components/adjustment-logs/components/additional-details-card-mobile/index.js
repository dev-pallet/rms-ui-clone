import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '@mui/material';
import React, { memo, useState } from 'react';
import CommonIcon from '../../../../../../Common/mobile-new-ui-components/common-icon-comp';
import { dateFormatter, textFormatter } from '../../../../../../Common/CommonFunction';

const AdditonalDetailsCardMobile = React.memo(
  ({ data, additionalData, additionalDataLoader, getStockAdjustmentAdditionalData }) => {
    const [displayAdditionalData, setDisplayAdditionalData] = useState(false);
    const [loader, setLoader] = useState(false);
    const [hasData, setHasData] = useState(false);

    const handleDisplayAdditionalData = () => {
      if (displayAdditionalData) {
        setHasData(false);
        setDisplayAdditionalData(false);
        return;
      }
      setLoader(true);
      setDisplayAdditionalData(true);
      if (!additionalDataLoader) {
        getStockAdjustmentAdditionalData({
          row: { barcode: data?.barcode, adjustmentId: data?.adjustmentId, batch: data?.batch },
        });
        setHasData(true);
        setTimeout(() => {
          setLoader(false);
        }, 300);
      }
    };

    return (
      <>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-value">Additional Details</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">
              <CommonIcon
                icon={<ChevronDownIcon />}
                iconOnClickFunction={(e) => {
                  handleDisplayAdditionalData();
                }}
              />
            </span>
          </div>
        </div>

        {loader && (
          <div className="circular-progress-div">
            <CircularProgress sx={{ color: '#0562fb !important' }} />
          </div>
        )}

        {!loader && hasData && (
          <div className="stock-count-details-card">
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-value">Adjustment Details</span>
              </div>
            </div>
            <hr className="horizontal-line-app-ros" />
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Initial Quantity</span>
                <span className="bill-card-value">{additionalData?.initialQuantity ?? 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Adjusted Quantity</span>
                <span className="bill-card-value">{additionalData?.adjustedQuantity ?? 'NA'}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Adjusted Value</span>
                <span className="bill-card-value">₹ {additionalData?.adjustedValue ?? 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Inventory Location</span>
                <span className="bill-card-value">{additionalData?.inventoryLocation || 'NA'}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Adjusted By</span>
                <span className="bill-card-value">{additionalData?.adjustedBy || 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Batch</span>
                <span className="bill-card-value">{additionalData?.batch || 'NA'}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Adjusted Reason</span>
                <span className="bill-card-value">{additionalData?.reason ? textFormatter(additionalData?.reason) : 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Adjustment Date</span>
                <span className="bill-card-value">{additionalData?.lastUpdated ? dateFormatter(additionalData?.lastUpdated) : 'NA'}</span>
              </div>
            </div>
            <hr className="horizontal-line-app-ros" />
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Source</span>
                <span className="bill-card-value">{additionalData?.source ? textFormatter(additionalData?.source) : 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Source Id</span>
                <span className="bill-card-value">{additionalData?.sourceId ?? 'NA'}</span>
              </div>
            </div>
            <div>
            <div className="flex-colum-align-start">
                <span className="bill-card-label">Stock In Hand</span>
                <span className="bill-card-value">{additionalData?.stockInHand ?? 'NA'}</span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default AdditonalDetailsCardMobile;
