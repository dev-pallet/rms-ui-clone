import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Divider, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SoftInput from '../../../../../../components/SoftInput';
import Verified from '@mui/icons-material/Verified';

const PutAwayCard = ({
  product,
  storageIdChange,
  handleStorageIdVerification,
  verifyStorageLoader,
  verifyStorageIdItem,
  index,
  setsessionArr,
  handleCheckboxChange
}) => {
  const [cardOpen, setCardOpen] = useState(false);

  const cardOpenHandler = (e,product) => {
    setCardOpen(e.target.checked);
    handleCheckboxChange(product);
  };

  return (
    <Accordion className="mob-add-po-list-main-wrapper po-box-shadow">
      <AccordionSummary expanded={cardOpen} className={cardOpen ? 'open-card' : ''}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" width="100%">
          <Stack alignItems="flex-start">
            <Typography fontSize="16px" fontWeight={700} sx={{ color: '#344767 !important' }}>
              {product.itemName}
            </Typography>
            <Typography fontSize="14px">Gtin: {product.gtin}</Typography>
          </Stack>
          <Checkbox onChange={(e)=>cardOpenHandler(e,product)} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Last Inward</Typography>
            <Typography fontSize="14px" fontWeight={700}>
              {product.lastInward}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Batch Id</Typography>
            <Typography fontSize="14px" fontWeight={700}>
              {product.batchNumber || 'NA'}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '10px !important', width: '100% !important' }} />
        <Stack alignItems="center" sx={{ width: '100% !important' }}>
          <Typography className="typography-quality-form-card" fontSize="12px">
            Storage ID
          </Typography>
          <Stack direction="row" justifyContent="space-between" gap="10px" sx={{width: '100% !important'}}>
            <SoftInput
              className="mo-add-po-input"
              value={product.storageId !== null ? product.storageId : ''}
              onChange={(e) => storageIdChange(e, product, index)}
              sx={{ width: '100% !important' }}
            />
            {verifyStorageLoader && product.id == verifyStorageIdItem.id ? (
              <CircularProgress
                sx={{
                  marginTop: '0.5rem',
                }}
                size={20}
                color="info"
              />
            ) : product['isVerified'] == true ? (
              <Verified
                style={{
                  color: green[500],
                  marginTop: '0.5rem',
                }}
              />
            ) : (
              <RefreshIcon
                color="info"
                sx={{
                  marginTop: '0.5rem',
                  cursor: 'pointer',
                }}
                onClick={() => handleStorageIdVerification(product, product.id, index)}
              />
            )}
          </Stack>
        </Stack>
        <Stack alignItems="center" sx={{ width: '100% !important' }}>
          <Typography className="typography-quality-form-card" fontSize="12px">
            Storage Name
          </Typography>
          <SoftInput
            className="mo-add-po-input"
            value={product.storageName !== null ? product.storageName : ''}
            sx={{ width: '100% !important' }}
            disabled
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default PutAwayCard;
