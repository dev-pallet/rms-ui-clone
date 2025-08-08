import './index.css';
import { Card } from '@mui/material';
import { setSelectedBatch } from '../../../../../../../../../../datamanagement/stockTakingSlice';
import { useDispatch } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SoftTypography from '../../../../../../../../../../components/SoftTypography';

export const BatchCard = ({ batchItem, setShowContent }) => {
  const dispatch = useDispatch();
  const handleBatchSeletcted = () => {
    setShowContent(true);
    dispatch(setSelectedBatch(batchItem));
  };

  return (
    <Card className="batch-card-main-card" onClick={() => handleBatchSeletcted()}>
      <SoftTypography variant="h4" className="batch-card-text">
        Batch Id: {batchItem?.batchNo}
      </SoftTypography>
      {batchItem?.verified === 'Y' && <CheckCircleIcon color="success" />}
    </Card>
  );
};
