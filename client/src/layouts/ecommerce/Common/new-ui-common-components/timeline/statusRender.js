import './timeline.css';
import { Box, CircularProgress, Menu, MenuItem, Modal } from '@mui/material';
import {
  deletepurchasequote,
  quoteApprovedpost,
  rejectQuoterequest,
  vieworderspdf,
} from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';

const CommonTimeLineStatus = ({
  statusName,
  userName,
  date,
  userDesc,
  icon,
  reason,
  dateTime,
  iconColor,
  index,
  length,
  view,
  logType,
  quoteId,
  purchaseId,
  timelineFunction,
  docId,
}) => {
  //quote functionality
  const showSnackbar = useSnackbar();
  const [anchorQuoteEl, setQuoteAnchorEl] = useState(null);
  const quoteOpen = Boolean(anchorQuoteEl);
  const [loader, setLoader] = useState(false);
  const userDetails = localStorage.getItem('user_details');
  const user_Name = localStorage.getItem('user_name');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};

  const handleQuoteMenu = (event) => {
    setQuoteAnchorEl(event.currentTarget);
  };
  const handleQuoteMenuClose = () => {
    setQuoteAnchorEl(null);
  };

  const [openModalAprrove, setOpenModalAprrove] = useState(false);
  const [openModalReject, setOpenModalReject] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const handleCloseModalApprove = () => setOpenModalAprrove(false);
  const handleCloseModalReject = () => setOpenModalReject(false);
  const handleCloseModalDelete = () => setOpenModalDelete(false);

  const handleQuoteApprove = () => {
    setOpenModalAprrove(true);
    setQuoteAnchorEl(null);
  };

  const handleSave = () => {
    setLoader(true);
    const payload = {
      quoteId: quoteId,
      status: 'APPROVED',
      comments: 'string',
      updatedByUser: user_Name,
      rejectedReason: 'string',
      deletedReason: 'string',
      piNumber: purchaseId,
    };
    quoteApprovedpost(payload)
      .then(async (res) => {
        showSnackbar('Quote Approved Successfully', 'success');
        await timelineFunction({ isPiPage: true, isPoPage: false });
        setLoader(false);
        handleCloseModalApprove();
        // window.location.reload(true);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setLoader(false);
        handleCloseModalApprove();
        // window.location.reload(true);
      });
  };
  const handleQuoteReject = () => {
    setOpenModalReject(true);
    setQuoteAnchorEl(null);
  };
  const handleQuoteDelete = () => {
    setOpenModalDelete(true);
    setQuoteAnchorEl(null);
  };

  const [reject, setRejection] = useState('');

  async function handleRejectsave() {
    setLoader(true);
    const payload = {
      quoteId: quoteId,
      status: 'REJECTED',
      comments: 'string',
      updatedByUser: user_Name,
      rejectedReason: reject,
      deletedReason: 'string',
      piNumber: purchaseId,
    };
    try {
      const result = await rejectQuoterequest(payload);
      await timelineFunction({ isPiPage: true, isPoPage: false });
      showSnackbar('Quote Rejected Successfully', 'success');
      setLoader(false);
      handleCloseModalReject();
      // window.location.reload(true);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setLoader(false);
      handleCloseModalReject();
      // window.location.reload(true);
    }
  }
  const [deleteReason, setDeleteReason] = useState('');

  async function handleDeleteSave() {
    setLoader(true);
    const payload = {
      quoteId: quoteId,
      reason: deleteReason,
      updatedBy: user_Name,
    };
    deletepurchasequote(payload)
      .then(async (res) => {
        setLoader(false);
        await timelineFunction({ isPiPage: true, isPoPage: false });
        showSnackbar('Quote Deleted Successfully', 'success');
        handleCloseModalDelete();
        // window.location.reload(true);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setLoader(false);
        handleCloseModalDelete();
        // window.location.reload(true);
      });
  }

  const [viewLoader, setViewLoader] = useState(false);
  const handleViewPdf = async (docId) => {
    if (logType === 'Quote') {
      return;
    }
    if (docId === 'NA' || docId === null || docId === undefined) {
      return showSnackbar('No document found', 'error');
    }
    setViewLoader(true);
    const res = await vieworderspdf(docId);
    let blob;
    if (res?.headers?.['content-type'] === 'application/pdf') {
      blob = new Blob([res?.data], { type: 'application/pdf' });
    } else {
      blob = new Blob([res?.data], { type: 'image/png' });
    }
    const url = URL.createObjectURL(blob);
    setViewLoader(false);
    window.open(url, '_blank');
  };
  return (
    <>
      <div className="timeline-main-container" key={index}>
        <div className="timeline-icon">
          <div className="time-icon-div" style={{ color: iconColor }}>
            {icon}
          </div>
        </div>
        {/* {index !== length - 1 && (
          <div className="side-line-timeline" style={{ height: view && logType === 'Quote' && '75px' }}></div>
        )} */}
        <div className="timeline-info">
          {logType === 'Quote' && view ? (
            <div className="quote-heading">
              <span className="timeline-name">{statusName}</span>
              <MoreHorizIcon onClick={handleQuoteMenu} sx={{ color: '#0562fb', cursor: 'pointer' }} />
            </div>
          ) : (
            <span className="timeline-name">{statusName}</span>
          )}
          {(logType === 'Quote' || logType?.includes('Payment') || logType?.includes('Bill')) && (view || docId) && (
            <a
              className="timeline-info-view"
              href={!logType?.includes('Payment') || !logType?.includes('Bill') ? view : null}
              target="_blank"
              onClick={() => handleViewPdf(docId)}
              rel="noreferrer"
            >
              {viewLoader ? <CircularProgress size={16} sx={{ color: '#0562fb !important' }} /> : 'View'}
            </a>
          )}
          <span className="timeline-info-userDesc">{userName}</span>
          <span className="timeline-info-date">{dateTime}</span>
          {reason && (
            <span className="timeline-info-date">
              <b>Reason- </b>
              {reason}
            </span>
          )}
        </div>
      </div>
      <Menu
        anchorEl={anchorQuoteEl}
        open={quoteOpen}
        onClose={handleQuoteMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleQuoteApprove}>Approve</MenuItem>
        <MenuItem onClick={handleQuoteReject}>Reject</MenuItem>
        <MenuItem onClick={handleQuoteDelete}>Delete</MenuItem>
      </Menu>
      <Modal
        open={openModalAprrove}
        onClose={handleCloseModalApprove}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="pi-approve-menu">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to approve this.
          </SoftTypography>
          <SoftBox className="pi-approve-btns-div">
            <SoftButton className="pi-approve-btn1" onClick={handleCloseModalApprove}>
              Cancel
            </SoftButton>
            <SoftButton className="pi-approve-btn" onClick={handleSave}>
              {loader ? <CircularProgress size={18} /> : 'Save'}
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>
      <Modal
        open={openModalReject}
        onClose={handleCloseModalReject}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="pi-approve-menu-1">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Quote once rejected cannot be revoked. Are you sure you want to reject?
          </SoftTypography>
          <SoftBox>
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
              fontSize="13px"
            >
              Reason
            </SoftTypography>
          </SoftBox>
          <SoftSelect
            defaultValue={{ value: '', label: '' }}
            onChange={(e) => setRejection(e.value)}
            options={[
              { value: 'Dummy Quote', label: 'Dummy Quote' },
              { value: 'Pricing', label: 'Pricing' },
              { value: 'Late Delivery', label: 'Late Delivery' },
              { value: 'Others', label: 'Others' },
            ]}
          />
          <SoftBox className="pi-approve-btns-div">
            <SoftButton className="pi-approve-btn1" onClick={handleCloseModalReject}>
              Cancel
            </SoftButton>
            <SoftButton className="pi-approve-btn" onClick={handleRejectsave}>
              {loader ? <CircularProgress size={18} /> : 'Save'}
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>
      <Modal
        open={openModalDelete}
        onClose={handleCloseModalDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="pi-approve-menu-1">
          <SoftTypography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this.
          </SoftTypography>
          <SoftBox>
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
              fontSize="13px"
            >
              Reason
            </SoftTypography>
          </SoftBox>
          <SoftSelect
            defaultValue={{ value: '', label: '' }}
            onChange={(e) => setDeleteReason(e.value)}
            options={[
              { value: 'Dummy Quote', label: 'Dummy Quote' },
              { value: 'Pricing', label: 'Pricing' },
              { value: 'Late Delivery', label: 'Late Delivery' },
              { value: 'Others', label: 'Others' },
            ]}
          />
          <SoftBox className="pi-approve-btns-div">
            <SoftButton className="pi-approve-btn1" onClick={handleCloseModalDelete}>
              Cancel
            </SoftButton>
            <SoftButton className="pi-approve-btn" onClick={handleDeleteSave}>
              {loader ? <CircularProgress size={18} /> : 'Save'}
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>
    </>
  );
};

export default CommonTimeLineStatus;
