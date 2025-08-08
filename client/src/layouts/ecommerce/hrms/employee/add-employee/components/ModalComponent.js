import { Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SoftButton from '../../../../../../components/SoftButton';
import DefaultLogo from '../../../../../../assets/images/default-profile-logo.jpg';
import { Modal } from '@mui/material';

function ModalComponent({ photoUrl, open, handleImageUpload, handleClose, handleModalSave }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="retail-logo-select">
        <Box className="retail-logo-box">
          <Box className="cancel-icon-modal" onClick={handleClose}>
            <CancelIcon fontSize="medium" />
          </Box>
          <Box className="modal-preview-image">
            <Box className="input-file-box">
              <img src={photoUrl ? photoUrl : DefaultLogo} className="default-img-upload" />
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleImageUpload}
                className="input-file-upload"
                style={{ display: 'block', position: 'relative', left: '0rem' }}
              />
            </Box>
          </Box>
          <Box className="cancel-save-btn-modal">
            <SoftButton
              className="form-button-i"
              style={{ marginRight: '1rem', border: '1px solid rgb(28, 119, 255)' }}
              onClick={handleClose}
            >
              Cancel
            </SoftButton>
            <SoftButton className="form-button-submit-i" onClick={handleModalSave}>
              Save
            </SoftButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalComponent;
