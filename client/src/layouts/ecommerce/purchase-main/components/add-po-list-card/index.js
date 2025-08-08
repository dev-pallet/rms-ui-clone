import './add-po-list-card.css';
import { Divider, Stack, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState } from 'react';
import SoftInput from '../../../../../components/SoftInput';

const AddPoListCard = ({
  key,
  product,
  setSelectedData,
  change,
  getAmountById,
  getTaxById,
  getPurchasePriceById,
  getPoOrderedById,
  taxWarning,
  selectedData,
}) => {
  const [openCard, setOpenCard] = useState(false);
  const [fieldWarning, setFieldWarning] = useState(true);

  const openingCardHandler = (e) => {
    setOpenCard(e.target.checked);
    if (e.target.checked) {
      setSelectedData((prev) => [...prev, product]);
    } else {
      const newSelectedData = selectedData.filter((item) => item.itemName !== product.itemName);
      setSelectedData(newSelectedData);
    }
  };

  useEffect(() => {
    if (getAmountById(product.itemNo)) {
      setFieldWarning(false);
    }
  }, [getAmountById(product.itemNo)]);

  return (
    <Accordion
      className="mob-add-po-list-main-wrapper"
      expanded={openCard}
      sx={{
        background: '!transparent !important',
        border: '0px !important',
      }}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        className={openCard ? 'open-card' : ''}
        sx={{
          borderRadius: '10px !important',
        }}
      >
        <Stack direction="row" justifyContent="space-between" className={'info-checkbox'}>
          <Typography fontSize="14px" fontWeight={700} color="#344767">
            {product.itemName}
          </Typography>
          <Checkbox onChange={openingCardHandler} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          background: '!transparent !important',
          border: '0px !important',
        }}
      >
        <Stack width="100%" direction="row" justifyContent="space-between">
          <Stack direction="row" justifyContent="space-between" width="100%">
            {/* <Stack alignItems="flex-start">
              <Typography fontSize="12px">Mrp</Typography>
              <Typography fontSize="14px" fontWeight={700}>
               {productUnitPrice}
              </Typography>
            </Stack> */}
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Pi Qty Left</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {product.quantityLeft}
              </Typography>
            </Stack>
          </Stack>
          <Stack alignItems="flex-end" width="100%">
            <Stack direction="row">
              <Typography fontSize="12px" mr={4} className={!taxWarning ? 'tax-not-applied' : 'tax-applied'}>
                Tax -{' '}
              </Typography>
              <Typography fontSize="12px" className={!taxWarning ? 'tax-not-applied' : 'tax-applied'}>
                {getTaxById(product.itemNo) || '0'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Typography fontSize="14px" mr={1}>
                Amount -{' '}
              </Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {getAmountById(product.itemNo) || '0'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Divider
          sx={{
            margin: '5px !important',
          }}
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap="10px" mt={2}>
          <Stack alignItems="center">
            <Typography fontSize="12px">Mrp</Typography>
            <SoftInput
              disabled={openCard ? false : true}
              placeholder="Mrp"
              className="mo-add-po-input"
              value={product.unitPrice}
              required
              onChange={(e) => change('unitPrice', e.target.value, product, key)}
            />
          </Stack>
          <Stack alignItems="center">
            <Typography fontSize="12px">Purchase Price</Typography>
            <SoftInput
              disabled={openCard ? false : true}
              placeholder="Purchase Price"
              className="mo-add-po-input"
              required
              value={getPurchasePriceById(product.itemNo)}
              onChange={(e) => change('purchasePrice', e.target.value, product, key)}
            />
          </Stack>
          <Stack alignItems="center">
            <Typography fontSize="12px">Quantity</Typography>
            <SoftInput
              disabled={openCard ? false : true}
              placeholder="Quantity"
              className="mo-add-po-input"
              required
              value={getPoOrderedById(product.itemNo)}
              onChange={(e) => change('poordered', e.target.value, product, key)}
            />
          </Stack>
        </Stack>
        {/* <Stack mt={1}>
          <SoftButton className="vendor-add-btn" color="info" width="100%">
            Get Amount
          </SoftButton>
        </Stack> */}
        {fieldWarning && (
          <Stack mt={2}>
            <Typography fontSize="10px" color="error">
              * Input Purchase Price & Quantity to get the amount
            </Typography>
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default AddPoListCard;
