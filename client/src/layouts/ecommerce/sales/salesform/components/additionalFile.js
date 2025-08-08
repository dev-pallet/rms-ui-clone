import '../salesfrom.css';
import {
  Grid,
  InputLabel,
  TextField,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useRef, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';

const AdditionalSalesFile = ({
  shipCheck,
  setShipCheck,
  labourCheck,
  setLabourCheck,
  count,
  setCount,
  unitPrice,
  setUnitPrice,
  description,
  setDesciption,
  additionQuant,
  setAdditionQuant,
  additionTax,
  setAdditionTax,
  additionAmount,
  setAdditionAmount,
}) => {
  const boxRef = useRef(null);
  const [productSelected, setProductSelected] = useState(Array(count).fill(false));
  const [desciptionOption, setDesciptionOption] = useState([
    { value: 'Labour charges', label: 'Labour charges' },
    { value: 'Delivery charges', label: 'Delivery charges' },
  ]);

  const handleDelete = (index) => {
    const updatedUnitPrice = [...unitPrice];
    updatedUnitPrice.splice(index, 1);
    setUnitPrice(updatedUnitPrice);

    if (description[index] === 'Labour charges') {
      setLabourCheck(false);
    } else if (description[index] === 'Delivery charges') {
      setShipCheck(false);
    }

    const newObj = { value: description[index], label: description[index] };
    setDesciptionOption([...desciptionOption, newObj]);

    const updatedDescription = [...description];
    updatedDescription.splice(index, 1);
    setDesciption(updatedDescription);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected.splice(index, 1);
    setProductSelected(updatedProductSelected);

    const updatedAdditionQuant = [...additionQuant];
    updatedAdditionQuant.splice(index, 1);
    setAdditionQuant(updatedAdditionQuant);

    const updatedAdditionTax = [...additionTax];
    updatedAdditionTax.splice(index, 1);
    setAdditionTax(updatedAdditionTax);

    const updatedAdditionAmount = [...additionAmount];
    updatedAdditionAmount.splice(index, 1);
    setAdditionAmount(updatedAdditionAmount);

    setCount((prev) => prev - 1);
  };

  const handleAddmore = () => {
    setCount(count + 1);
    setUnitPrice([...unitPrice, '']);
    setDesciption([...description, '']);
    setAdditionQuant([...additionQuant, '']);
    setAdditionTax([...additionTax, '']);
    setAdditionAmount([...additionAmount, '']);

    const targetScrollPosition = 10050;

    if (boxRef.current) {
      const scrollStep = (targetScrollPosition - boxRef.current.scrollTop) / 20;
      let currentScrollPosition = boxRef.current.scrollTop;

      const animateScroll = () => {
        if (Math.abs(currentScrollPosition - targetScrollPosition) <= Math.abs(scrollStep)) {
          boxRef.current.scrollTop = targetScrollPosition;
        } else {
          boxRef.current.scrollTop += scrollStep;
          currentScrollPosition += scrollStep;
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }
  };

  function removeObjectById(array, idToRemove) {
    return array.filter((obj) => obj.value !== idToRemove);
  }

  const handleDescription = (e, index) => {
    const newObj = removeObjectById(desciptionOption, e.value);
    setDesciptionOption(newObj);

    const updatedDescription = [...description];
    updatedDescription[index] = e.label;
    setDesciption(updatedDescription);

    if (e.label === 'Labour charges') {
      setLabourCheck(true);
    } else if (e.label === 'Delivery charges') {
      setShipCheck(true);
    }

    const updatedProductSelected = [...productSelected];
    updatedProductSelected[index] = true;
    setProductSelected(updatedProductSelected);
  };

  const handleChangeValues = (e, index) => {
    if (e.target.name === 'unitPrice') {
      const update = [...unitPrice];
      update[index] = e.target.value;
      setUnitPrice(update);
    } else if (e.target.name === 'quantity') {
      const update = [...additionQuant];
      update[index] = e.target.value;
      setAdditionQuant(update);
    } else if (e.target.name === 'tax') {
      const update = [...additionTax];
      update[index] = e.target.value;
      setAdditionTax(update);
    } else if (e.target.name === 'amount') {
      const update = [...additionAmount];
      update[index] = e.target.value;
      setAdditionAmount(update);
    }
  };
  return (
    <SoftBox mt={1}>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">Enter additonal details</SoftTypography>
      </SoftBox>
      <SoftBox
        ref={boxRef}
        style={{
          marginTop: '20px',
          maxHeight: '500px',
          overflowY: 'visible',
          overflowX: 'scroll',
        }}
      >
        {Array.from({ length: count }, (_, i) => count - i - 1).map((_, reversedIndex) => {
          const isProductSelected = productSelected[reversedIndex];
          return (
            <SoftBox mt={1} key={reversedIndex} style={{ minWidth: '900px' }}>
              <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid
                  item
                  xs={0.7}
                  sm={0.7}
                  md={0.7}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        S No.
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftInput readOnly={true} value={reversedIndex + 1} />
                  </SoftBox>
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Description
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox>
                    {isProductSelected || description[reversedIndex] ? (
                      <TextField
                        value={description[reversedIndex]}
                        readOnly={true}
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        options={desciptionOption}
                        onChange={(e) => handleDescription(e, reversedIndex)}
                      />
                    )}
                  </SoftBox>
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Unit Price
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="unitPrice"
                    disabled={description === '' || description[reversedIndex] === '' ? true : false}
                    value={unitPrice[reversedIndex]}
                    onChange={(e) => {
                      handleChangeValues(e, reversedIndex);
                    }}
                  />
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Quantity
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="quantity"
                    disabled={description === '' || description[reversedIndex] === '' ? true : false}
                    value={additionQuant[reversedIndex]}
                    onChange={(e) => {
                      handleChangeValues(e, reversedIndex);
                    }}
                  />
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Tax
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="tax"
                    disabled={description === '' || description[reversedIndex] === '' ? true : false}
                    value={additionTax[reversedIndex]}
                    onChange={(e) => {
                      handleChangeValues(e, reversedIndex);
                    }}
                  />
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Amount
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="amount"
                    disabled={description === '' || description[reversedIndex] === '' ? true : false}
                    value={additionAmount[reversedIndex]}
                    onChange={(e) => {
                      handleChangeValues(e, reversedIndex);
                    }}
                  />
                </Grid>
                <SoftBox
                  mt={reversedIndex === 0 ? '49px' : '10px'}
                  width="20px"
                  height="40px"
                  style={{ cursor: 'pointer' }}
                >
                  <CancelIcon onClick={() => handleDelete(reversedIndex)} fontSize="small" color="error" />
                </SoftBox>
              </Grid>
            </SoftBox>
          );
        })}
      </SoftBox>
      {desciptionOption.length > 0 && (
        <SoftTypography
          className="add-more-text"
          onClick={handleAddmore}
          component="label"
          variant="caption"
          fontWeight="bold"
        >
          + Add More Details
        </SoftTypography>
      )}
    </SoftBox>
  );
};

export default AdditionalSalesFile;
