import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import CommonIcon from '../../../../Common/mobile-new-ui-components/common-icon-comp';
import { CircularProgress } from '@mui/material';

export const ProductBatchListCard = React.memo(
  ({ productExpiryDetailsByBatch, data, getProductExpiryByBatchData, setProductTitle, getExpiryDay, batchLoader }) => {
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
      if (!batchLoader) {
        getProductExpiryByBatchData({ row: { barcode: data?.barcode } });
        setProductTitle(data?.title);
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
            <span className="bill-card-value">Show Batches</span>
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
                <span className="bill-card-value">Expiry Details - {data?.title} </span>
              </div>
            </div>

            {productExpiryDetailsByBatch?.map((el) => (
              <>
                <hr className="horizontal-line-app-ros" />
                <div className="stack-row-center-between width-100">
                  <div className="flex-colum-align-start">
                    <span className="bill-card-label">Batch Number</span>
                    <span className="bill-card-value">{el?.batchNo || 'NA'}</span>
                  </div>
                  <div className="flex-colum-align-center">
                    <span className="bill-card-label">Available Units</span>
                    <span className="bill-card-value">{el?.availableUnits ?? 'NA'}</span>
                  </div>
                  <div className="flex-colum-align-center">
                    <span className="bill-card-label">Expiry Days</span>
                    <span className="bill-card-value">{getExpiryDay(el?.expiry)}</span>
                  </div>
                </div>
              </>
            ))}
          </div>
        )}
      </>
    );
  },
);
