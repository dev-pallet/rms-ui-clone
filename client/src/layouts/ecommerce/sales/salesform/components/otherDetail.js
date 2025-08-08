import { Box, Grid, IconButton, InputLabel, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import React from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';

const CustomOption = ({ data, ...props }) => {
  return <div style={{ height: '40px', lineHeight: '40px' }}>{data.label}</div>;
};

const SalesOrderOtherModal = ({
  openOtherModal,
  setOpenOtherModal,
  detailIndex,
  barcodeNum,
  batchNum,
  setBatchNum,
  expiryDate,
  setExpiryDate,
  itemDiscount,
  setItemDiscount,
  itemCess,
  setItemCess,
  cartId,
  itemDiscountType,
  setItemDiscountType,
  handleBatchChange,
}) => {
  const handleCloseModal = () => {
    setOpenOtherModal(false);
  };

  const discOption = [
    { value: '%', label: '%' },
    { value: 'Rs.', label: 'Rs.' },
  ];

  const cessArray = [
    { value: 0, label: '0 %' },
    { value: 1, label: '1 %' },
    { value: 3, label: '3 %' },
    { value: 5, label: '5 %' },
    { value: 12, label: '12 %' },
    { value: 15, label: '15 %' },
    { value: 17, label: '17 %' },
    { value: 21, label: '21 %' },
    { value: 22, label: '22 %' },
    { value: 36, label: '36 %' },
    { value: 60, label: '60 %' },
    { value: 61, label: '61 %' },
    { value: 65, label: '65 %' },
    { value: 71, label: '71 %' },
    { value: 72, label: '72 %' },
    { value: 89, label: '89 %' },
    { value: 96, label: '96 %' },
    { value: 142, label: '142 %' },
    { value: 160, label: '160 %' },
    { value: 204, label: '204 %' },
  ];

  return (
    <Modal
      open={openOtherModal}
      onClose={handleCloseModal}
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
          <IconButton edge="end" color="inherit" onClick={handleCloseModal} aria-label="close">
            <CancelIcon color="error" />
          </IconButton>
        </Box>
        <Grid container spacing={1} p={1} mt={-9}>
          <Grid item xs={12} md={12} ml={0.5} mt={2} p={2} className="create-pi-card">
            <SoftBox>
              <Grid container spacing={1} p={1}>
                <Grid item xs={12} md={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                    <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                      Cess
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    className="boom-soft-select"
                    menuShouldScrollIntoView={false}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999, position: 'absolute', width: '100%' }),
                      menu: (base) => ({ ...base, position: 'relative' }),
                    }}
                    options={cessArray}
                    isDisabled={cartId ? false : true}
                    value={cessArray?.find((option) => option.value === itemCess[detailIndex]) || ''}
                    onChange={(option) => {
                      const updatedDisc = [...itemCess];
                      updatedDisc[detailIndex] = option.value;
                      setItemCess(updatedDisc);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                    <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                      Discount
                    </InputLabel>
                  </SoftBox>
                  <SoftBox className="boom-box">
                    <SoftInput
                      type="number"
                      disabled={cartId ? false : true}
                      value={itemDiscount[detailIndex]}
                      onChange={(e) => {
                        const updatedDisc = [...itemDiscount];
                        updatedDisc[detailIndex] = e.target.value;
                        setItemDiscount(updatedDisc);
                      }}
                    />
                    <SoftBox className="boom-soft-box">
                      <SoftSelect
                        className="boom-soft-select"
                        isDisabled={cartId ? false : true}
                        value={discOption.find((option) => option.value === itemDiscountType[detailIndex]) || ''}
                        onChange={(option) => {
                          const updatedDiscType = [...itemDiscountType];
                          updatedDiscType[detailIndex] = option.value;
                          setItemDiscountType(updatedDiscType);
                        }}
                        options={discOption}
                      />
                    </SoftBox>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                    <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                      Batch No.
                    </InputLabel>
                  </SoftBox>
                  <SoftInput
                    type="text"
                    disabled={cartId ? false : true}
                    value={batchNum[detailIndex]}
                    onChange={(e) => {
                      handleBatchChange(e, detailIndex);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                    <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                      Expiry date
                    </InputLabel>
                  </SoftBox>
                  <SoftInput
                    type="date"
                    disabled={cartId ? false : true}
                    value={expiryDate[detailIndex]}
                    onChange={(e) => {
                      const updatedexpDate = [...expiryDate];
                      updatedexpDate[detailIndex] = e.target.value;
                      setExpiryDate(updatedexpDate);
                    }}
                  />
                </Grid>
              </Grid>
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SalesOrderOtherModal;
