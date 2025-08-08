import React from 'react';
import { Modal, Box, Typography, Card, CardContent, Checkbox } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '450px',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 4,
};

const cardContainerStyle = {
  overflowY: 'auto',
  maxHeight: '220px',
};

const BatchSelectionModal = ({
  open,
  handleClose,
  formData,
  batchDetails,
  selectedBatch,
  setSelectedBatch,
  batchSelection,
}) => {
  const showSnackBar = useSnackbar();

  const handleCheckboxChange = (batch) => {
    setSelectedBatch((prevSelected) => {
      const isSelected = Array.isArray(selectedBatch) && prevSelected?.some((b) => b?.batchNo === batch?.batchNo);
      if (isSelected) {
        return prevSelected?.filter((b) => b?.batchNo !== batch?.batchNo);
      } else {
        return [...prevSelected, { ...batch, gtin: formData?.productBarCode?.[formData?.currentIndex] }];
      }
    });
  };

  if (open && !batchSelection) {
    showSnackBar('Select batch selection method', 'warning');
    return null;
  }

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      sx={{
        '& > .MuiBackdrop-root': {
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <Box sx={style}>
        <Box sx={{ position: 'relative' }}>
          <Typography variant="h6" component="h2" style={{ fontWeight: 'bold' }}>
            Select Batches
          </Typography>
          <hr
            style={{
              color: 'blue',
              backgroundColor: 'lightgray',
              marginTop: '10px',
              marginBottom: '10px',
              height: '1px',
              border: 'none',
              opacity: '0.4',
            }}
          />
          <Typography
            variant="h6"
            component="h2"
            style={{ fontSize: '0.95rem !important', fontWeight: 'bold', opacity: '0.9' }}
          >
            Item Name: {formData?.selectedBundleProduct?.[formData?.currentIndex]?.name}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            style={{ fontSize: '0.95rem !important', fontWeight: 'bold', opacity: '0.9' }}
          >
            Gtin: {formData?.productBarCode?.[formData?.currentIndex]}
          </Typography>
          <div style={cardContainerStyle}>
            {batchDetails?.map((batch) => (
              <Card key={batch?.batchNo} sx={{ marginTop: '10px', width: '100%' }}>
                <CardContent style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                  <SoftBox>
                    <Checkbox
                      color="primary"
                      checked={
                        Array.isArray(selectedBatch) && selectedBatch?.some((b) => b?.batchNo === batch?.batchNo)
                      }
                      onChange={() => handleCheckboxChange(batch)}
                    />
                  </SoftBox>
                  <SoftBox>
                    <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                      <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>₹ {batch?.mrp}</span>₹
                      {batch?.sellingPrice}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                      Available Units: {batch?.availableUnits}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                      Batch No: {batch?.batchNo}
                    </Typography>
                  </SoftBox>
                </CardContent>
              </Card>
            ))}
          </div>
          <br />
          <SoftBox style={{ display: 'flex', flexDirection: 'row', gap: '10px', float: 'right' }}>
            <SoftButton color="info" onClick={handleClose}>
              Cancel
            </SoftButton>
            <SoftButton
              color="info"
              onClick={() => {
                handleClose();
              }}
            >
              Select
            </SoftButton>
          </SoftBox>
        </Box>
      </Box>
    </Modal>
  );
};

export default BatchSelectionModal;
