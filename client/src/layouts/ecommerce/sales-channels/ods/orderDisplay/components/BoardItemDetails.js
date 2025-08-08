import { Box, IconButton, Modal, Typography } from '@mui/material';
import { getsalesorderdetailsvalue } from '../../../../../../config/Services';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import BillDetails from './BillDetails';
import BoardItemActions from './BoardItemActions';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SkeletonLoader from './SkeletonLoader';
import ValidationModal from './ValidationModal/ValidationModal';
import breakpoints from 'assets/theme/base/breakpoints';
import moment from 'moment';

const convertToLocalDate = (time) => moment.utc(time).local().format('LL');
const convertToLocalTime = (time) => moment.utc(time).local().format('LT');

const isMobile = window.innerWidth < breakpoints.values.sm;

const style = {
  position: isMobile ? 'static' : 'absolute',
  top: '50%',
  left: '50%',
  width: isMobile ? '100%' : '50%',
  // maxWidth: 700,
  transform: isMobile ? 'none' : 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  border: '1px solid #999999',
  boxShadow: 24,
  p: 4,
  maxHeight: isMobile ? '100%' : '80%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '1rem',

  ...(isMobile && {
    height: '100%',
  }),
};

const BoardItemDetails = ({ item, handleClose }) => {
  const showSnackbar = useSnackbar();
  const [orderDetails, setOrderDetails] = useState({});
  const [validationModal, setValidationModal] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState('');

  const openModal = () => setValidationModal(true);

  const closeModal = () => setValidationModal(false);

  const orderQuery = useQuery(['order', validationModal], () => getsalesorderdetailsvalue(item?.orderId), {
    retry: 2,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      setOrderDetails(res?.data?.data);
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
      handleClose();
    },
  });

  const renderDeliverySlot = (order) => {
    if (!order?.startTime || !order?.endTime) {return 'Delivery Slot: N/A';}
    return (
      <div className="board-item-details-delivery-slot">
        <div>{`Delivery Slot: ${convertToLocalTime(order?.startTime)} - ${convertToLocalTime(order?.endTime)}`}</div>
        <div className="board-item-details-delivery-slot-date">({convertToLocalDate(order?.startTime)})</div>
      </div>
    );
  };

  return (
    <>
      <div className="board-item-details-title">
        <div className="board-header-box">
          <div className="board-header-icon">
            <ReceiptLongOutlinedIcon fontSize="small" />
          </div>
          <Typography variant="h5" className="board-header-title">
            Order Details
          </Typography>
        </div>
        <IconButton aria-label="close" size="small" onClick={handleClose}>
          <CloseIcon fontSize="medium" />
        </IconButton>
      </div>
      {orderQuery?.isLoading || orderQuery?.isFetching ? (
        <SkeletonLoader type="order-details" />
      ) : (
        <div className="board-item-details-content">
          <div className="board-item-details-left-box">
            <div className="board-item-details-left-info-container">
              <div className="board-item-details-left-info">
                <div>{`Order ID: ${item?.orderId || 'N/A'}`}</div>
                <div>{`Token: ${item?.token || 'N/A'}`}</div>
              </div>
              <div className="board-item-details-left-info">
                <div>{`Payment Method: ${item?.paymentMethod || 'N/A'}`}</div>
                {renderDeliverySlot(orderDetails.baseOrderResponse)}
              </div>
            </div>
            <BillDetails orderDetails={orderDetails} />
          </div>
          <div className="board-item-details-right-box">
            <Typography fontWeight="bold">Actions</Typography>
            <div className="board-item-details-actions">
              <BoardItemActions
                item={orderDetails.baseOrderResponse}
                isAssigned={orderDetails?.orderTokenDetails?.isAssigned}
                orderQuery={orderQuery}
                openModal={openModal}
                handleClose={handleClose}
                selectedPicker={selectedPicker}
                setSelectedPicker={setSelectedPicker}
              />
            </div>
          </div>
        </div>
      )}
      <Modal
        open={validationModal}
        onClose={closeModal}
        sx={{
          '& > .MuiBackdrop-root': {
            backdropFilter: 'blur(5px)',
          },
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ValidationModal
            orderId={item?.orderId}
            cartId={orderDetails?.baseOrderResponse?.cartId}
            closeModal={closeModal}
          />
        </Box>
      </Modal>
    </>
  );
};

export default BoardItemDetails;
