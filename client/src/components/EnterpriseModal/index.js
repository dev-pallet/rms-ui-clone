import React, { useState } from 'react';
import { Box, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SoftTypography from '../SoftTypography';
import SoftButton from '../SoftButton';

const EnterpriseModal = ({ enterpriseCheck }) => {
  const navigate = useNavigate();
  const contextType = localStorage.getItem('contextType');
  return (
    <Modal
      open={enterpriseCheck}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{
          width: '60vw',
          height: '50vh',
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          marginTop: '6rem',
          borderRadius: '1rem',
          overflow: 'auto',
          padding: '1rem',
          position: 'relative',
        }}
      >
        <Box className="enterprise-not-access">
          <SoftTypography className="billing-details-not-allowed-content">
            You don't have access to this.
          </SoftTypography>
          <SoftTypography className="billing-details-not-allowed-content">
            Please contact your Head office for further details.
          </SoftTypography>
          <SoftButton className="enterprise-not-access-btn" onClick={() => navigate(`/dashboards/${contextType}`)}>
            Back
          </SoftButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default EnterpriseModal;
