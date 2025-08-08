// import { getReportIteupdateReportItemm } from '../../../../../../../../../../../../../../June/pallet-rms-ui/client/src/datamanagement/stockTakingSlice';
import { useState } from 'react';
import { useSnackbar } from '../../../../../../../../../../hooks/SnackbarProvider';
import { BatchCard } from '../batchcard';
import './index.css';

const BatchList = ({ handleBack, batchList, showContent, setShowContent, setBatchSessionId, setSelectedBatch, itemCount, batchSessionId, selectedBatch }) => {
  const showSnackbar = useSnackbar();
  const [isUpdatingReportItem, setIsUpdatingReportItem] = useState(false);

  return (
    <>
        {batchList?.map((batchItem, index) => (
          <BatchCard
            batchItem={batchItem}
            showContent={showContent}
            setShowContent={setShowContent}
            key={index}
            setBatchSessionId={setBatchSessionId}
            setSelectedBatch={setSelectedBatch}
            itemCount={batchItem?.batchSessionId === batchSessionId && itemCount}
            selectedBatch={selectedBatch}
          />
        ))}
    </>
  );
};

export default BatchList;
