import * as React from 'react';
import { Card, CardContent, Radio } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../../components/SoftButton';
import Typography from '@mui/material/Typography';

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

export default function InventoyBatcheswithgtin({
  handleClose,
  handleOpen,
  open,
  setOpen,
  batchData,
  selectedproduct,
}) {
  const [selectedBatch, setSelectedBatch] = React.useState([]);

  const handleRadioChange = (batchId) => {
    setSelectedBatch(batchId);
  };


  const batchDetails = batchData?.map((item) => ({
    mrp: item.mrp,
    sellingPrice: item?.sellingPrice,
    availableUnits: item?.availableUnits,
    batchNo: item?.batchNo,
  }));

  return (
    <div>
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
              Item Name: {selectedproduct?.label}
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              style={{ fontSize: '0.95rem !important', fontWeight: 'bold', opacity: '0.9' }}
            >
              Gtin: {selectedproduct?.gtin}
            </Typography>
            <div style={cardContainerStyle}>
              {batchDetails?.map((batch) => (
                <Card key={batch.batchNo} sx={{ marginTop: '10px', width: '100%' }}>
                  <CardContent style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                    <SoftBox>
                      <Radio
                        color="primary"
                        checked={selectedBatch === batch.batchNo}
                        onChange={() => handleRadioChange(batch.batchNo)}
                      />
                    </SoftBox>
                    <SoftBox>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>₹ {batch.mrp}</span>₹
                        {batch.sellingPrice}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                Available Units: {batch.availableUnits}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                Batch No: {batch.batchNo}
                      </Typography>
                    </SoftBox>
                  </CardContent>
                </Card>
              ))}
            </div>
            <br />
            <SoftBox
              style={{  display: 'flex', flexDirection: 'row', gap: '10px' , float :'right' }}
            >
              <SoftButton color="info" onClick={handleClose}>
                Cancel
              </SoftButton>
              <SoftButton color="info" onClick={handleClose}>
                Select
              </SoftButton>
            </SoftBox>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
