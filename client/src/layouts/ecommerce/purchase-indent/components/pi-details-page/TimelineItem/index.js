import './timeline.css';
import PropTypes from 'prop-types';
// @mui material components
import Icon from '@mui/material/Icon';
// Soft UI Dashboard PRO React components
import CircularProgress from '@mui/material/CircularProgress';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
// Timeline context
// Custom styles for the TimelineItem
import * as React from 'react';
import {
  deletepurchasequote,
  quoteApprovedpost,
  rejectQuoterequest,
} from '../../../../../../config/Services';
import { timelineItem, timelineItemIcon } from 'examples/Timeline/TimelineItem/styles';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MuiAlert from '@mui/material/Alert';
import SetInterval from '../../../../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';

function TimelineItem({
  logType,
  status,
  updatedOn,
  updatedBy,
  color,
  icon,
  view,
  quoteId,
  quoteURL,
  quoteAdded,
  setQuoteApproved,
  setQuoteRejected,
  setQuoteDeleted,
}) {
  //quote-status
  const [loader, setLoader] = useState(false);
  const updatedAt = new Date(updatedOn).toLocaleString();
  const { piNum } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const handleCloseModal1 = () => setOpenModal1(false);

  const handleApprove = () => {
    setOpenModal1(true);
    setAnchorEl(null);
  };

  const handleCloseModal2 = () => setOpenModal2(false);

  const handleReject = () => {
    setOpenModal2(true);
    setAnchorEl(null);
  };

  const handleCloseModal3 = () => setOpenModal3(false);

  const handleDelete = () => {
    setOpenModal3(true);
    setAnchorEl(null);
  };

  const user = localStorage.getItem('user_name');

  // snackbar alert
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  const handleSave = () => {
    setLoader(true);
    const payload = {
      quoteId: quoteId,
      status: 'APPROVED',
      comments: 'string',
      updatedByUser: object?.uidx,
      rejectedReason: 'string',
      deletedReason: 'string',
      piNumber: piNum,
    };
    quoteApprovedpost(payload)
      .then((res) => {
        setAlertmessage('Quote Approved');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        setLoader(false);
        setQuoteApproved(true);
        handleCloseModal1();
        // window.location.reload(true);
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        SetInterval(handleopensnack());
        setLoader(false);
        handleCloseModal1();

        // window.location.reload(true);
      });
  };

  const [reject, setRejection] = useState('');

  async function handleRejectsave() {
    setLoader(true);
    const payload = {
      quoteId: quoteId,
      status: 'REJECTED',
      comments: 'string',
      updatedByUser: object?.uidx,
      rejectedReason: reject,
      deletedReason: 'string',
      piNumber: piNum,
    };
    try {
      const result = await rejectQuoterequest(payload);
      setAlertmessage('Quote Rejected');
      setTimelineerror('success');
      SetInterval(handleopensnack());
      setQuoteRejected(true);
      setLoader(false);
      handleCloseModal2();
      // window.location.reload(true);
    } catch (err) {
      setAlertmessage(err.response.data.message);
      setTimelineerror('error');
      SetInterval(handleopensnack());
      setLoader(false);
      handleCloseModal2();
      // window.location.reload(true);
    }
  }

  const [deleteReason, setDeleteReason] = useState('');

  async function handleDeleteSave() {
    setLoader(true);
    const payload = {
      quoteId: quoteId,
      reason: deleteReason,
      updatedBy: object?.uidx,
    };
    deletepurchasequote(payload)
      .then((res) => {
        setAlertmessage('Quote deleted ');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        setLoader(false);
        setQuoteDeleted(true);
        handleCloseModal3();
        // window.location.reload(true);
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        SetInterval(handleopensnack());
        setLoader(false);
        handleCloseModal3();
        // window.location.reload(true);
      });
  }

  return (
    <>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      <SoftBox position="relative" sx={(theme) => timelineItem(theme, { logType })}>
        <SoftBox
          bgColor="white"
          width="1.625rem"
          height="1.625rem"
          borderRadius="50%"
          position="absolute"
          top="3.25%"
          left="2px"
          zIndex={2}
        >
          <Icon sx={(theme) => timelineItemIcon(theme, { color })}>{icon}</Icon>
        </SoftBox>
        <SoftBox ml={5.75} lineHeight={0} maxWidth="30rem">
          <SoftTypography variant="button" fontWeight="medium" color="dark">
            {logType} {quoteId !== null ? quoteId : ''} {status.toLowerCase()}
          </SoftTypography>
          <br />
          <SoftBox mt={0.5}>
            <SoftTypography variant="caption" fontWeight="medium" color="text">
              {updatedAt}
            </SoftTypography>
          </SoftBox>
          <SoftBox mt={2} mb={1.5}>
            {status ? (
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {status} {'by'} {updatedBy}
              </SoftTypography>
            ) : null}
          </SoftBox>

          {logType.toLowerCase() === 'quote' && status.toLowerCase() === 'created' ? (
            view !== null ? (
              <SoftBox pb={2} className="timelineitem-purchase-anchor">
                <a className="down-p" id="a" target="_blank" href={view} rel="noreferrer">
                  View
                </a>
              </SoftBox>
            ) : null
          ) : null}

          {logType.toLowerCase() === 'quote' && status.toLowerCase() === 'created' ? (
            <SoftBox className="more-icons-box-div">
              <MoreVertIcon onClick={handleMenu} />
              <Menu
                id="basic-menu"
                className="menu-box"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleApprove}>Approve</MenuItem>
                <MenuItem onClick={handleReject}>Reject</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </SoftBox>
          ) : (
            ''
          )}
        </SoftBox>

        <SoftBox>
          <Modal
            open={openModal1}
            onClose={handleCloseModal1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to approve this.
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div">
                <SoftButton className="pi-approve-btn1" onClick={handleCloseModal1}>
                  Cancel
                </SoftButton>
                <SoftButton className="pi-approve-btn" onClick={handleSave}>
                  {loader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </SoftBox>

        <SoftBox>
          <Modal
            open={openModal2}
            onClose={handleCloseModal2}
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
                <SoftButton className="pi-approve-btn1" onClick={handleCloseModal2}>
                  Cancel
                </SoftButton>
                <SoftButton className="pi-approve-btn" onClick={handleRejectsave}>
                  {loader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </SoftBox>
        <SoftBox>
          <Modal
            open={openModal3}
            onClose={handleCloseModal3}
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
                <SoftButton className="pi-approve-btn1" onClick={handleCloseModal3}>
                  Cancel
                </SoftButton>
                <SoftButton className="pi-approve-btn" onClick={handleDeleteSave}>
                  {loader ? <CircularProgress size={18} /> : 'Save'}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </SoftBox>
      </SoftBox>
    </>
  );
}

// Setting default values for the props of TimelineItem
TimelineItem.defaultProps = {
  color: 'info',
  badges: '',
};

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark', 'light']),
  logType: PropTypes.string.isRequired,
  updatedOn: PropTypes.string.isRequired,
  updatedBy: PropTypes.string,
  status: PropTypes.string,
};

export default TimelineItem;
