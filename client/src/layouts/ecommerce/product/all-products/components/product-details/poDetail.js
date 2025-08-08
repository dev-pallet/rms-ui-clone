import { Box, Grid, Modal } from '@mui/material';
import { getvendorName } from '../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import React, { useEffect, useState } from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

const BatchPODetail = ({
  openPOModal,
  setOpenPOModal,
  setSelectedPONum,
  selectedPONum,
  setSelectedReqType,
  selectedReqType,
}) => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedPONum) {
      getvendorName(selectedPONum)
        .then((res) => {
          const response = res?.data?.data;
          setData(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedPONum]);

  const handleNavigate = () => {
    if (selectedReqType === 'PO') {
      navigate(`/purchase/purchase-orders/details/${selectedPONum}`);
    } else if (selectedPONum.includes('EXP')) {
      navigate(`/purchase/express-grn/details/${selectedPONum}`);
    }
  };

  return (
    <Modal
      open={openPOModal}
      onClose={() => setOpenPOModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
    >
      <Box
        className="pi-box-inventory"
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: '60vh',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Grid container spacing={1} p={1}>
          <Grid item xs={12} md={12}>
            <SoftTypography fontSize="13px" display="flex" gap="5px">
              <KeyboardDoubleArrowRightOutlinedIcon cursor='pointer'  onClick={handleNavigate} fontSize="small" color="info" />
              <span>  <b>{selectedReqType}:</b> {selectedPONum}{' '}</span>
            </SoftTypography>
            <SoftTypography fontSize="13px">
              <b>Created On:</b> {data?.formattedOrderedOn}{' '}
            </SoftTypography>
            <SoftTypography fontSize="13px">
              <b>Vendor Name:</b> {data?.vendorName}{' '}
            </SoftTypography>
            <SoftTypography fontSize="13px">
              <b>Amount:</b> Rs. {data?.grossAmount}{' '}
            </SoftTypography>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default BatchPODetail;
