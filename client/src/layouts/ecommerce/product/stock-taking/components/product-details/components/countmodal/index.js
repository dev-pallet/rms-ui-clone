import './index.css';
import { CircularProgress } from '@mui/material';
import { defaultImage } from '../../../../../../Common/linkConstants';
import { getReportItem as fetchReportItem } from '../../../../../../../../config/Services';
import { getReportItem, resetBatchState, setReportItem } from '../../../../../../../../datamanagement/stockTakingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import BatchList from './components/batchlist';
import Fade from '@mui/material/Fade';
import ItemCount from './components/itemCount';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Modal from '@mui/material/Modal';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../../components/SoftTypography';

export const CycleCountModal = ({ reportData, modalOpen, setModalOpen, refetchReportList }) => {
  const [showContent, setShowContent] = useState(false);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const storedReportItem = useSelector(getReportItem);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
    height: '100vh',
  };

  const { data: reportItem, isFetching: isFetchingReportItem } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!modalOpen,
    queryKey: ['reportItem'],
    queryFn: async () => {
      const payload = {
        gtin: reportData?.gtin,
        reportId: reportData?.reportId,
      };
      const response = await fetchReportItem(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        throw new Error(response?.data?.data?.message);
      }
      dispatch(setReportItem(response?.data?.data?.data));
      return response?.data?.data?.data;
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const handleBack = () => {
    if (showContent) {
      setShowContent(false);
    } else {
      setModalOpen(false);
      dispatch(resetBatchState());
      refetchReportList();
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalOpen}
      onClose={handleBack}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      className="cycle-count-modal"
    >
      <Fade in={modalOpen}>
        <SoftBox sx={style}>
          <KeyboardBackspaceIcon className="stock-taking-modal-back-btn" onClick={handleBack} />
          {isFetchingReportItem ? (
            <SoftBox className="stock-modal-loader-container">
              <CircularProgress size={40} className="circular-progress-loader" />
            </SoftBox>
          ) : (
            <>
              <SoftBox className="stock-counting-modal">
                <img src={defaultImage} alt="error" className="stock-item-image" />
                <SoftBox ml={1} className="stock-item-mian-box">
                  <SoftTypography variant="h4" className="stock-item-details">
                    {reportItem?.itemName}
                  </SoftTypography>
                  <SoftTypography variant="h4" className="stock-item-details">
                    Gtin: {reportItem?.gtin}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
              <SoftBox>
                {showContent ? (
                  <ItemCount handleBack={handleBack} setShowContent={setShowContent} />
                ) : (
                  <BatchList
                    handleBack={handleBack}
                    batchList={storedReportItem?.stReportBatchList}
                    setShowContent={setShowContent}
                  />
                )}
              </SoftBox>
            </>
          )}
        </SoftBox>
      </Fade>
    </Modal>
  );
};
