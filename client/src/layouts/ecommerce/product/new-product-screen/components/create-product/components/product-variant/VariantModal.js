import React from 'react';
import { Modal, Box, Typography, Button, InputLabel, Grid, Tooltip } from '@mui/material';
import SoftInput from '../../../../../../../../components/SoftInput';
import SoftButton from '../../../../../../../../components/SoftButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../../../components/SoftSelect';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '70vw',
  minWidth: '40vw',
  maxHeight: '450px',
  bgcolor: 'background.paper',
  //   border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 4,
  overflowY: 'scroll',
};

const VariantModal = ({ isOpen, onClose, handleInputChange, selectedIndex, productVariantArr }) => {
  const isAppSelected = productVariantArr?.[selectedIndex]?.salesChannel?.includes('TWINLEAVES_APP');

  const handleAddSecondaryWeighingUnit = (index) => {
    const updatedData = [...productVariantArr];
    const newWeighingUnit = { unit: '', option: { value: 'nos', label: 'each' } };
    updatedData[index].secondaryWeighingUnits = [
      ...(updatedData[index]?.secondaryWeighingUnits || []),
      newWeighingUnit,
    ];
    handleInputChange(index, 'secondaryWeighingUnits', updatedData[index]?.secondaryWeighingUnits);
  };

  const handleDeleteSecondarySpec = (index, specIndex) => {
    const updatedData = [...productVariantArr];
    updatedData[index]?.secondaryWeighingUnits.splice(specIndex, 1);
    handleInputChange(index, 'secondaryWeighingUnits', updatedData[index]?.secondaryWeighingUnits);
  };
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        '& > .MuiBackdrop-root': {
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <Box sx={style}>
        <Grid container spacing={2}>
          {productVariantArr?.[selectedIndex]?.weighingScale && (
            <>
              <Grid item xs={12}>
                <InputLabel className="inputLabel-style-head">Additional Weighing Specs & units</InputLabel>{' '}
              </Grid>
              {productVariantArr?.[selectedIndex]?.secondaryWeighingUnits?.map((spec, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <SoftBox mt={1.3} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <SoftBox className="boom-box">
                      <SoftInput
                        size="small"
                        className="boom-input"
                        value={spec.unit}
                        onChange={(e) => {
                          const updatedUnits = [...productVariantArr[selectedIndex].secondaryWeighingUnits];
                          updatedUnits[index] = { ...updatedUnits[index], unit: e.target.value };
                          handleInputChange(selectedIndex, 'secondaryWeighingUnits', updatedUnits);
                        }}
                        type="number"
                      />
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          size="small"
                          className="boom-soft-select"
                          value={spec.option}
                          onChange={(option) => {
                            const updatedUnits = [...productVariantArr[selectedIndex].secondaryWeighingUnits];
                            updatedUnits[index] = { ...updatedUnits[index], option };
                            handleInputChange(selectedIndex, 'secondaryWeighingUnits', updatedUnits);
                          }}
                          options={[
                            { value: 'nos', label: 'each' },
                            { value: 'Grams', label: 'gm' },
                            { value: 'Kilograms', label: 'kg' },
                            { value: 'Millilitres', label: 'ml' },
                            { value: 'Litres', label: 'ltr' },
                          ]}
                        />
                      </SoftBox>
                    </SoftBox>

                    <SoftBox>
                      <SoftTypography
                        onClick={() => handleDeleteSecondarySpec(selectedIndex, index)}
                        style={{
                          fontSize: '1.2rem',
                          top: '5px',
                          right: '10px',
                          color: 'red',
                          cursor: 'pointer',
                        }}
                      >
                        <DeleteOutlineIcon />
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  style={{ textTransform: 'none' }}
                  onClick={() => {
                    handleAddSecondaryWeighingUnit(selectedIndex);
                  }}
                >
                  + Add more
                </Button>
              </Grid>
            </>
          )}

          <Grid item xs={12} md={6}>
            <InputLabel className="inputLabel-style">Store Item Reference</InputLabel>
            <SoftInput
              size="small"
              type="text"
              value={productVariantArr?.[selectedIndex]?.referenceID}
              onChange={(e) => handleInputChange(selectedIndex, 'referenceID', e.target.value)}
            ></SoftInput>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel className="inputLabel-style">Carton Details</InputLabel>
            <div className="common-display-flex-1">
              <SoftInput
                size="small"
                value={productVariantArr?.[selectedIndex]?.cartonData}
                onChange={(event) => handleInputChange(selectedIndex, 'cartonData', event.target.value)}
              />
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>In a box</span>
            </div>
          </Grid>

          {productVariantArr?.[selectedIndex]?.salesChannel?.includes('IN_STORE') && (
            <>
              {' '}
              <Grid item xs={12}>
                <InputLabel className="inputLabel-style-head">In-store</InputLabel>{' '}
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel className="inputLabel-style">Min quantity</InputLabel>
                <SoftInput
                  size="small"
                  type="number"
                  value={productVariantArr?.[selectedIndex]?.storeMinQty}
                  onChange={(e) => handleInputChange(selectedIndex, 'storeMinQty', e.target.value)}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel className="inputLabel-style">Max quantity</InputLabel>
                <SoftInput
                  size="small"
                  type="number"
                  value={productVariantArr?.[selectedIndex]?.storeMaxQty}
                  onChange={(e) => handleInputChange(selectedIndex, 'storeMaxQty', e.target.value)}
                ></SoftInput>
              </Grid>
            </>
          )}

          {productVariantArr?.[selectedIndex]?.salesChannel?.includes('B2B_APP') && !isAppSelected && (
            <>
              {' '}
              <Grid item xs={12}>
                <InputLabel className="inputLabel-style-head">B2B App</InputLabel>{' '}
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel className="inputLabel-style">Min quantity</InputLabel>
                <SoftInput
                  size="small"
                  type="number"
                  value={productVariantArr?.[selectedIndex]?.b2cMinQty}
                  onChange={(e) => handleInputChange(selectedIndex, 'b2cMinQty', e.target.value)}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel className="inputLabel-style">Max quantity</InputLabel>
                <SoftInput
                  size="small"
                  type="number"
                  value={productVariantArr?.[selectedIndex]?.b2cMaxQty}
                  onChange={(e) => handleInputChange(selectedIndex, 'b2cMaxQty', e.target.value)}
                ></SoftInput>
              </Grid>
            </>
          )}
          {productVariantArr?.[selectedIndex]?.salesChannel?.includes('B2C_APP') && !isAppSelected && (
            <>
              {' '}
              <Grid item xs={12}>
                <InputLabel className="inputLabel-style-head">B2C App</InputLabel>{' '}
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel className="inputLabel-style">Min quantity</InputLabel>
                <SoftInput
                  size="small"
                  type="number"
                  value={productVariantArr?.[selectedIndex]?.b2bMinQty}
                  onChange={(e) => handleInputChange(selectedIndex, 'b2bMinQty', e.target.value)}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel className="inputLabel-style">Max quantity</InputLabel>
                <SoftInput
                  size="small"
                  type="number"
                  value={productVariantArr?.[selectedIndex]?.b2bMaxQty}
                  onChange={(e) => handleInputChange(selectedIndex, 'b2bMaxQty', e.target.value)}
                ></SoftInput>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default VariantModal;
