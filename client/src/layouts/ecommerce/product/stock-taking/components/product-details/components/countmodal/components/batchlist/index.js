import './index.css';
import { BatchCard } from '../batchcard';
import { CircularProgress } from '@mui/material';
import { getReportItem } from '../../../../../../../../../../datamanagement/stockTakingSlice';
import { updateReportItem as updateReportItemService } from '../../../../../../../../../../config/Services';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../../../../../../../../../hooks/SnackbarProvider';
import SoftBox from '../../../../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../../../../components/SoftTypography';

const BatchList = ({ handleBack, batchList, setShowContent }) => {
  const showSnackbar = useSnackbar();
  const storedReportItem = useSelector(getReportItem);

  const { mutate: updateReportItem, isLoading: isUpdatingReportItem } = useMutation({
    mutationFn: (payload) => updateReportItemService(payload),
    onSuccess: (response) => {
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Report Item updated successfully', 'success');
      handleBack();
    },
    onError: (error) => {
      showSnackbar(
        error?.response?.data?.message?.error || error?.response?.data?.message || 'Some error occured',
        'error',
      );
    },
  });

  const handleSave = () => {
    const payload = { ...storedReportItem };
    updateReportItem(payload);
  };

  return (
    <SoftBox>
      <SoftTypography variant="h4" className="stock-item-header">
        Available Batches
      </SoftTypography>
      <div className="batchlist-container">
        {batchList?.map((batchItem, index) => (
          <BatchCard batchItem={batchItem} setShowContent={setShowContent} key={index} />
        ))}
      </div>
      <SoftButton fullWidth className="batch-list-save-btn" onClick={handleSave}>
        {isUpdatingReportItem ? <CircularProgress size={20} color="inherit" /> : 'SUBMIT'}
      </SoftButton>
    </SoftBox>
  );
};

export default BatchList;
