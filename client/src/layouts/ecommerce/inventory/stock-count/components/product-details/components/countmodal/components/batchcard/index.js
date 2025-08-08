import { useDispatch } from 'react-redux';
import './index.css';
// import { setSelectedBatch } from '../../../../../../../../../../datamanagement/stockTakingSlice';

import { getBatchSessionDetails } from '../../../../../../../../../../config/Services';
import { useSnackbar } from '../../../../../../../../../../hooks/SnackbarProvider';
import { useEffect } from 'react';

export const BatchCard = ({ batchItem, showContent, setShowContent, setBatchSessionId, setSelectedBatch, itemCount, selectedBatch }) => {
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const batchSessionId = batchItem?.batchSessionId;
  const isVerified = batchItem?.status === 'COMPLETED' || batchItem?.status === 'APPROVAL_PENDING';

  const getBatchSessionDetailsFn = async () => {
    try {
      const response = await getBatchSessionDetails(batchSessionId);

      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      setSelectedBatch(response?.data?.data?.batchSession);
    } catch (err) {
      console.log(err);
    }
  };
  const handleBatchSeletcted = () => {
    getBatchSessionDetailsFn();
    setBatchSessionId(batchSessionId);
    setShowContent(true);
    // localStorage.setItem('batchSessionId', batchSessionId)
  };

  return (
    <div className={`listing-card-main-bg ${((batchItem?.userQuantity && batchItem?.expirationDate) || batchItem?.productNotFound) && 'count-completed'}`}
      onClick={() => {
        if(selectedBatch?.batchSessionId !== batchItem?.batchSessionId || !showContent){
          handleBatchSeletcted()
        }
      }}
    >
      <div className='stack-row-center-between width-100'>
        <div className='stack-row-center-between'>
          <span className='batch-card-title-mrp-label'>Batch ID: </span>
          <span className='bill-card-value space-5px'>{batchItem?.batchNumber || 'NA'}</span>
        </div>
        <div className='stack-row-center-between'>
          <span className='batch-card-title-mrp-label'>MRP: </span>
          <span className='bill-card-value space-5px'> ₹{batchItem?.mrp || 'NA'}</span>
        </div>
      </div>
      {itemCount}
  </div>
  );
};
