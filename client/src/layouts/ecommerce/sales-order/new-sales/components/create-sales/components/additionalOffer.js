import { Box, Grid, IconButton, InputLabel, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../components/SoftSelect';

const SalesAdditionalOffer = ({
  openAdditonalModal,
  handleAdditionalModal,
  rowData,
  setRowData,
  handleInputChange,
  currIndex,
}) => {
  const handleDiscountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(inputValue) || inputValue === '') {
      handleInputChange(currIndex, 'discountPrice', e.target.value);
    }
  };

  const handleDiscountType = (option) => {
    if (rowData[currIndex]?.discountPrice !== 0) {
      handleInputChange(currIndex, 'discountType', option.value);
    }
  };

  const discountOption = [
    { value: 'RUPEES', label: 'Rs' },
    { value: 'PERCENTAGE', label: '%' },
  ];
  return (
    <Modal
      open={openAdditonalModal}
      onClose={handleAdditionalModal}
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
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          width: '50vw',
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            padding: '5px',
            marginRight: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton edge="end" color="inherit" onClick={handleAdditionalModal} aria-label="close">
            <CancelIcon color="error" />
          </IconButton>
        </Box>
        <Grid container spacing={1} p={1} mt={-9}>
          <Grid item xs={12} md={12} ml={0.5} mt={2} p={2} className="create-pi-card">
            <Grid container spacing={1} p={1} justifyContent={'space-around'}>
              <Grid item xs={12} md={6}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                  <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                    Discount price
                  </InputLabel>
                </SoftBox>
                {/* <SoftInput type="text" value={rowData[currIndex]?.discountPrice || 0} disabled />{' '} */}
                <SoftBox className="dis-count-box-1">
                  <SoftBox className="boom-box">
                    <SoftInput
                      className="boom-input"
                      value={rowData[currIndex]?.discountPrice || 0}
                      onChange={(e) => {
                        handleDiscountChange(e);
                      }}
                      type="number"
                    />
                    <SoftBox className="boom-soft-box">
                      <SoftSelect
                        className="boom-soft-select"
                        value={
                          discountOption?.find((option) => option.value === rowData[currIndex]?.discountType) ||
                          'RUPEES'
                        }
                        defaultValue={{ value: 'RUPEES', label: 'Rs' }}
                        onChange={(option) => handleDiscountType(option)}
                        options={discountOption}
                      />
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SalesAdditionalOffer;
