import { Divider, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Status from '../../../../Common/Status';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';
import { textFormatter } from '../../../../Common/CommonFunction';

const TransferOutCard = memo(({ data }) => {
  const navigate= useNavigate();
  return (
    <div className="listing-card-bg-secondary">
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-value two-line-ellipsis">{data?.transferId}</span>
          <span className="bill-card-label">{data?.date}</span>
        </div>
        <div className="flex-colum-align-end">
          <CommonStatus status={data?.status} />
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Origin</span>
          <span className="bill-card-value">{data?.origin ? textFormatter(data?.origin) : 'NA'}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Destination</span>
          <span className="bill-card-value">{data?.destination ? textFormatter(data?.destination) : 'NA'}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Total Value</span>
          <span className="bill-card-value">₹ {data?.transferValue}</span>
        </div>
      </div>
      <span
        className="view-details-app"
        onClick={() => {
          // for draft
          if (data?.status === 'DRAFT') {
            navigate(`/inventory/new-transfers/${data?.transferId}`);
          } else {
            // except draft
            navigate(`/inventory/stock-transfer-details/${data?.transferId}`);
          }
        }}
      >
        View Details
      </span>
    </div>
  );
});

export default TransferOutCard;
