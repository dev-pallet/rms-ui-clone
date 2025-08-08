import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PersonIcon from '@mui/icons-material/Person';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, CircularProgress, Modal } from '@mui/material';
import BOX from 'assets/icons/box.svg';
import breakpoints from 'assets/theme/base/breakpoints';
import moment from 'moment';
import { useState } from 'react';
import BoardItemDetails from './BoardItemDetails';

const ArrowIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15">
    <path
      fill="#fff"
      d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"
    ></path>
  </svg>
);

const isMobile = window.innerWidth < breakpoints.values.sm;

const style = {
  position: isMobile ? 'static' : 'absolute',
  top: '50%',
  left: '50%',
  width: isMobile ? '100%' : '90%',
  // maxWidth: 700,
  transform: isMobile ? 'none' : 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  border: '1px solid #999999',
  boxShadow: 24,
  p: 4,
  maxHeight: '100%',
  overflowY: 'auto',

  ...(isMobile && {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }),
};

const convertTime = (time) => moment.utc(time).local().format('DD/MM/YY, LT');

const BoardItem = ({ item, isLoading, setShouldRefresh }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => {
    setOpenModal(true);
    setShouldRefresh(false);
  };
  const handleClose = () => {
    setOpenModal(false);
    setShouldRefresh(true);
  };

  return (
    <div className="ods-board-item-box">
      {/* <button>Open Modal</button> */}
      {isLoading && (
        <div className="board-loader">
          <CircularProgress size={26} thickness={5} color="inherit" />
        </div>
      )}
      <div className="ods-board-item-title">
        <div className="ods-board-item-order-id-box">
          <div>#{item?.orderId}</div>
          {item?.whatsapp && <WhatsAppIcon sx={{ color: '#25D366' }} fontSize="medium" />}
        </div>
        <div className="ods-board-item-count">
          <img src={BOX} alt="box-icon" style={{ height: '20px' }} />
          {/* <LuPackage fontSize="18px" /> */}
          <div>{`${item?.numberOfLineItems}`}</div>
        </div>
      </div>
      <div className="ods-board-item-content">
        <div className="ods-board-item-customer-name-box">
          <div className="ods-board-item-customer-name">
            <PersonIcon fontSize="14px" />
            <div>{item?.customerName}</div>
          </div>
          <div className="ods-board-item-token">#{item?.token}</div>
        </div>
      </div>
      <div className="ods-board-item-footer">
        <div className="ods-board-item-time">
          <AccessTimeFilledIcon fontSize="14px" />
          <div>{convertTime(item?.createdAt)}</div>
        </div>
      </div>
      <div className={`ods-board-item-status ${item?.isAssigned && 'ods-board-item-status-assigned'}`}>
        {item?.isAssigned ? 'Assigned' : 'Not assigned'}
      </div>
      <div className="card__arrow" onClick={handleOpen}>
        {ArrowIcon}
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <BoardItemDetails item={item} handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
};

export default BoardItem;
