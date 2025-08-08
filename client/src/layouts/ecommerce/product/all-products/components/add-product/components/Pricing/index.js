/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Modal from '@mui/material/Modal';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';

// NewProduct page components
import './pricing.css';
import { Button, Checkbox } from '@mui/material';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import SoftSelect from 'components/SoftSelect';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

function Pricing({
  setReorderPoint,
  setReorderQuantity,
  setOpeningStack,
  setSpecification,
  setMrp,
  setSalePrice,
  setPurchasePrice,
  setUnits,
  units,
  mrp,
  isGen,
  setIsGen,
  unitOption,
  setUnitOption,
  setSpOption,
  spOption,
  purchasePrice,
  salePrice,
  reorderPoint,
  openingStack,
  batchNo,
  setBatchNo,
  expDate,
  setExpDate,
  reorderQuantity,
  reorderQuantityUnit,
  setReorderQuantityUnit,
  setMarginType,
  setMarginBased,
  setMarginValue,
  marginValue,
  marginBased,
  marginType,
  weighingScale,
  secWeighingCheckBox,
  setSecWeighingCheckBox,
  secondaryWeighingUnit,
  setSecondaryWeighingUnits,
  secondarySPOption,
  setSecondarySpOption,
  secWeighingCount,
  setSecWeighingCount
}) {
  let tempModalData = {};
  const [open, setOpen] = useState(false);




  const handleOpen = () => {
    tempModalData = {
      openingStack: openingStack,
      batchNo: batchNo,
      expDate: expDate,
    };
    setOpen(false);
  };
  const handleClose = () => {
    setOpeningStack('0');
    setBatchNo('');
    setExpDate('');
    setOpen(false);
  };

  const handleCloseSave = () => {
    if (!openingStack) {
      setOpeningStack('0');
    }
    setOpen(false);
  };

  const handleDeleteSecondarySpec = (index) => {
    const secondaryUnitsdata = [...secondaryWeighingUnit];
    const secondaryOptions = [...secondarySPOption];
    secondaryUnitsdata.splice(index, 1);
    secondaryOptions.splice(index, 1);
    setSecondarySpOption(secondaryOptions);
    setSecondaryWeighingUnits(secondaryUnitsdata);
    setSecWeighingCount(secWeighingCount - 1 || 0);
  };

  useEffect(() => {
    if (unitOption.label === 'Grams') {
      setSpOption({ value: 'Grams', label: 'gms' });
    } else if (unitOption.label === 'Kilograms') {
      setSpOption({ value: 'Kilograms', label: 'kg' });
    } else if (unitOption.label === 'Millilitres') {
      setSpOption({ value: 'Millilitres', label: 'ml' });
    } else if (unitOption.label === 'Litres') {
      setSpOption({ value: 'Litres', label: 'Litres' });
    } else {
      setSpOption({ value: 'each', label: 'each' });
    }
    if (weighingScale) {
      setMarginBased({ value: 'pp', label: 'Purchase Price' });
    }
  }, [unitOption]);

  const isMobileDevice = isSmallScreen();
  
  return (
    <Card sx={{ overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="bold">
          Specifications
        </SoftTypography>

        <SoftBox mt={1}>
          <Grid container spacing={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Grid item xs={12} sm={6} md={2}>
              <SoftBox mt={1.3}>
                <SoftBox mb={1}>
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Specifications
                  </InputLabel>
                </SoftBox>
                <SoftBox className="boom-box">
                  <SoftInput
                    className="boom-input"
                    disabled={isGen ? true : false}
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    type="number"
                  />
                  <SoftBox className="boom-soft-box">
                    <SoftSelect
                      className="boom-soft-select"
                      isDisabled={isGen ? true : false}
                      value={spOption}
                      defaultValue={{ value: 'each', label: 'each' }}
                      onChange={(option) => setSpOption(option)}
                      options={[
                        { value: 'Grams', label: 'gm' },
                        { value: 'Kilograms', label: 'kg' },
                        { value: 'Millilitres', label: 'ml' },
                        { value: 'Litres', label: 'ltr' },
                        { value: 'each', label: 'each' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>

            <Grid item xs={12} sm={6} md={1.5}>
              <SoftBox mt={1.3} mb={1} ml={0.5} lineHeight={0}>
                <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Opening Stock
                  </InputLabel>
                </SoftBox>
              </SoftBox>

              <SoftInput
                className="add-more-text"
                value={openingStack}
                fontSize={16}
                fontWeight="bold"
                type="number"
                onChange={(e) => setOpeningStack(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <SoftBox mt={1.3}>
                <SoftBox mb={1}>
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Margin Based on
                  </InputLabel>
                </SoftBox>
                <SoftBox className="boom-soft-box">
                  <SoftSelect
                    className="boom-soft-select"
                    value={marginBased}
                    defaultValue={{ value: 'pp', label: 'Purchase Price' }}
                    onChange={(option) => setMarginBased(option)}
                    options={[
                      { value: 'mrp', label: 'MRP' },
                      { value: 'pp', label: 'Purchase Price' },
                    ]}
                  />
                </SoftBox>
              </SoftBox>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <SoftBox mt={1.3}>
                <SoftBox mb={1} ml={1}>
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Margin</InputLabel>
                </SoftBox>
                <SoftBox className="boom-box">
                  <SoftInput
                    className="boom-input"
                    value={marginValue}
                    onChange={(e) => setMarginValue(e.target.value)}
                    type="number"
                  />
                  <SoftBox className="boom-soft-box">
                    <SoftSelect
                      className="boom-soft-select"
                      value={marginType}
                      defaultValue={{ value: '%', label: '%' }}
                      onChange={(option) => setMarginType(option)}
                      options={[
                        { value: '%', label: '%' },
                        { value: 'Rs', label: 'Rs' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>

            <Modal
              open={open}
              onClose={handleCloseSave}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <SoftBox sx={style}>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs={12} sm={4}>
                    <SoftBox mb={1} display="flex">
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Quantity
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput type="number" value={openingStack} onChange={(e) => setOpeningStack(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SoftBox mb={1} display="flex">
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Batch No
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput type="number" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SoftBox mb={1} display="flex">
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Expiry Date
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
                    {/* <SoftInput value={expDate} onChange={(e) => setExpDate(e.target.value)} /> */}
                  </Grid>
                </Grid>
                <SoftBox sx={{ float: 'right' }}>
                  <SoftButton style={{ marginRight: '1rem' }} onClick={handleClose}>
                    clear
                  </SoftButton>
                  <SoftButton variant="gradient" onClick={handleCloseSave} color="info">
                    save
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </Modal>

            <Grid item xs={12} sm={6} md={1.5}>
              <FormField
                type="number"
                label="reorder point"
                defaultValue="1"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <SoftBox mt={1.3}>
                <p className="spec-text">Reorder Quantity</p>
                <SoftBox className="boom-box">
                  <SoftInput
                    className="boom-input"
                    value={reorderQuantity}
                    onChange={(e) => setReorderQuantity(e.target.value)}
                    type="number"
                  />
                  <SoftBox className="boom-soft-box">
                    <SoftSelect
                      className="boom-soft-select"
                      defaultValue={{ value: 'each', label: 'each' }}
                      value={reorderQuantityUnit}
                      onChange={(option) => setReorderQuantityUnit(option)}
                      options={[
                        { value: 'Grams', label: 'gm' },
                        { value: 'Kilograms', label: 'kg' },
                        { value: 'Millilitres', label: 'ml' },
                        { value: 'Litres', label: 'ltr' },
                        { value: 'each', label: 'each' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>
          </Grid>
        </SoftBox>


        {weighingScale && (
          <SoftBox style={{ display: 'flex',flexDirection:'column', justifyContent:'flex-start', gap: '20px' }}>
            <SoftBox mt={1} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SoftBox style={{ marginTop: '5px' }}>
                <Checkbox
                  inputProps={{ 'aria-label': 'controlled' }}
                  checked={secWeighingCheckBox}
                  onClick={() => setSecWeighingCheckBox(event.target.checked)}
                />
              </SoftBox>
              <SoftBox>
                <InputLabel
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    color: '#344767',
                    marginTop: '18px',
                    marginBottom: '5px',
                  }}
                >
                          Additional Weighing Specs & units
                </InputLabel>
              </SoftBox>
            </SoftBox>

            {secWeighingCheckBox && (
              <>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {Array.from({ length: secWeighingCount }).map((e, index) => (
                    <Grid item xs={12} sm={6} md={2}>
                      <SoftBox mt={1.3}>
                        <SoftBox mb={1}>
                          <InputLabel
                            required
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                                    Specifications
                          </InputLabel>
                        </SoftBox>

                        <SoftBox style={{display:'flex' , alignItems:'center' , gap:'10px'}}>

                                

                          <SoftBox className="boom-box">
                            <SoftInput
                              className="boom-input"
                              value={secondaryWeighingUnit[index]}
                              // disabled={isGen ? true : false}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSecondaryWeighingUnits((prevUnits) => {
                                  const updatedUnits = [...prevUnits];
                                  updatedUnits[index] = newValue;
                                  return updatedUnits;
                                });
                              }}
                              type="number"
                            />
                            <SoftBox className="boom-soft-box">
                              <SoftSelect
                                className="boom-soft-select"
                                value={secondarySPOption[index]}
                                // isDisabled={isGen ? true : false}
                                defaultValue={{ value: 'each', label: 'each' }}
                                onChange={(option) => {
                                  const newValue = option;
                                  setSecondarySpOption((prevUnits) => {
                                    const updatedUnits = [...prevUnits];
                                    updatedUnits[index] = newValue;
                                    return updatedUnits;
                                  });
                                }}
                                options={[
                                  { value: 'Grams', label: 'gm' },
                                  { value: 'Kilograms', label: 'kg' },
                                  { value: 'Millilitres', label: 'ml' },
                                  { value: 'Litres', label: 'ltr' },
                                  { value: 'each', label: 'each' },
                                ]}
                              />
                            </SoftBox>
                          </SoftBox>
                          <SoftBox>
                            <SoftTypography
                              onClick={() => handleDeleteSecondarySpec(index)}
                              style={{
                                fontSize: '1.2rem',
                                top: '5px',
                                right: '10px',
                                color: 'red',
                              }}
                            >
                              <DeleteOutlineIcon />{' '}
                            </SoftTypography>
                          </SoftBox>
                        </SoftBox>


                      </SoftBox>
                    </Grid>
                  ))}
                </div>
                <SoftBox style={{ marginRight: 'auto' }}>
                  <Button
                    onClick={() => setSecWeighingCount(secWeighingCount + 1)}
                    className="add-more-text"
                    style={{ textTransform: 'none' }}
                  >
                            + Add More
                  </Button>
                </SoftBox>
              </>
            )}
          </SoftBox>
        )}
      </SoftBox>
    </Card>
  );
}

export default Pricing;
