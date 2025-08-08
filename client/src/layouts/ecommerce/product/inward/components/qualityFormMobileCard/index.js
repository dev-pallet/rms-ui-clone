import './qualityFormMobileCard.css';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Divider, Stack, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import Verified from '@mui/icons-material/Verified';

const QualityFormCard = ({
  item,
  selectedData,
  setSelectedData,
  handleBatchIdCheck,
  handleBatchId,
  change,
  idx,
  inputDisable,
  verifyBatchLoader,
  itemVerifyBatch,
  setInputDisable,
  handleRejectionReason,
  checkRejectionReasonDisableOrNot,
}) => {
  const [openCardAccordion, setOpenCardAccordion] = useState(false);

  const cardOpenHandler = (e) => {
    setOpenCardAccordion(e.target.checked);
    if (e.target.checked) {
      setSelectedData((prev) => [...prev, item]);
      setInputDisable(false);
    } else {
      const newSelectedData = selectedData.filter((selectedItem) => selectedItem.itemName !== item.itemName);
      setSelectedData(newSelectedData);
    }
  };
  return (
    // <SoftBox className="main-wrapper-quality-form-card po-box-shadow">
    <Accordion
      className="mob-add-po-list-main-wrapper po-box-shadow"
      expanded={openCardAccordion}
      sx={{
        background: '!transparent !important',
        border: '0px !important',
      }}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        className={openCardAccordion ? 'open-card' : ''}
        sx={{
          borderRadius: '10px !important',
        }}
      >
        <Stack alignItems="center" direction="row" justifyContent="space-between" width="100%">
          <Typography fontSize="16px" fontWeight={700} sx={{color: '#344767 !important'}}>
            {item.itemName}
          </Typography>
          <Checkbox onChange={cardOpenHandler} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {/* <Divider sx={{ margin: '10px !important', width: '100%' }} /> */}
        <Stack direction="row" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="12px">Ordered</Typography>
            <Typography fontSize="14px" fontWeight={700}>
              {item.quantityOrdered}
            </Typography>
          </Stack>
          <Stack alignItems="center">
            <Typography fontSize="12px">Prev Inward</Typography>
            <Typography fontSize="14px" fontWeight={700}>
              {item.lastInward}
            </Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography fontSize="12px">Pending Order</Typography>
            <Typography fontSize="14px" fontWeight={700}>
              {item.quantityOutstanding}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '10px !important', width: '100%' }} />
        <Stack alignItems="center" direction="row" justifyContent="center" gap="10px">
          <Stack alignItems="center" sx={{ width: '100% !important' }}>
            <Typography fontSize="12px">Quantity</Typography>
            <SoftInput
              disabled={inputDisable}
              // className="wrapper-table-input"
              className="mo-add-po-input"
              type="number"
              placeholder="Enter Quantity"
              value={item.quantityReceived == 0 ? '' : item.quantityReceived}
              onChange={(e) => change('quantityReceived', e.target.value, item.id, idx)}
              readOnly={selectedData.includes(item) ? false : true}
              required
              sx={{ width: '100% !important' }}
              min="1"
            />
          </Stack>
          <Stack alignItems="center" sx={{ width: '100% !important' }}>
            <Typography fontSize="12px">Rejected Quantity</Typography>
            <SoftInput
              className="mo-add-po-input"
              sx={{ width: '100% !important' }}
              placeholder="Enter Rejected Quantity"
              disabled={inputDisable}
              type="number"
              onChange={(e) => change('quantityRejected', e.target.value, item.id, idx)}
              readOnly={selectedData.includes(item) ? false : true}
              required
              min="1"
            />
          </Stack>
        </Stack>
        <Stack alignItems="center" sx={{ width: '100% !important' }}>
          <Typography className="typography-quality-form-card">Rejected Reason</Typography>
          <SoftSelect
            className="soft-select-inward"
            options={[
              { value: 'DAMAGED_PACKET', label: 'DAMAGED_PACKET' },
              { value: 'POOR_QUALITY', label: 'POOR_QUALITY' },
              { value: 'USED_PRODUCT', label: 'USED_PRODUCT' },
              { value: 'MISSING_ITEM', label: 'MISSING_ITEM' },
              { value: 'LESS_QUANTITY', label: '	LESS_QUANTITY' },
            ]}
            onChange={(option) => handleRejectionReason(option, 'rejectionReason', item.id, idx)}
            isDisabled={checkRejectionReasonDisableOrNot(item, item.id)}
            menuPortalTarget={document.body}
          />
        </Stack>
        <Stack alignItems="center" direction="row" justifyContent="center" gap="10px">
          <Stack sx={{ width: '100% !important' }} alignItems="center">
            <Typography className="typography-quality-form-card">Batch ID</Typography>
            <SoftInput
              className="mo-add-po-input"
              sx={{ width: '100% !important' }}
              placeholder="Enter Batch"
              disabled={inputDisable}
              type="text"
              required
              onChange={(e) => handleBatchId('batchNumber', e.target.value, item.id, idx)}
              // readOnly={selectedData.includes(item) ? false : true}
              // readOnly={
              //   item['isVerified'] == true || !selectedData.includes(item) ? true : false
              // }
            />
          </Stack>
          <Stack>
            {verifyBatchLoader &&
            // && itemVerifyBatch !== null
            item.id == itemVerifyBatch.id ? (
              // <Spinner
              //   sx={{
              //     marginTop: '0.5rem',
              //   }}
              // />
                <CircularProgress
                  sx={{
                    marginTop: '20px',
                  }}
                  size={20}
                  color="info"
                />
              ) : // !verifyBatchLoader &&
            // && itemVerifyBatch == null
              item['isVerified'] == true ? (
                <Verified
                  style={{
                    color: green[500],
                    marginTop: '20px',
                  }}
                />
              ) : (
                <RefreshIcon
                  color="info"
                  sx={{
                    marginTop: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleBatchIdCheck(item, item.id, idx)}
                />
              )}
          </Stack>
          <Stack sx={{ width: '100% !important' }} alignItems="center">
            <Typography className="typography-quality-form-card">Expiry Date</Typography>
            <input
              // disabled={inputDisable}
              className="mo-add-po-input exp-date-inward"
              type="date"
              placeholder="Date"
              required
              onChange={(e) => change('expiryDetail', e.target.value, item.id)}
              //   readOnly={selectedData.includes(item) ? false : true}
              onBlur={(e) => e.target.blur()}
            />
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
    // </SoftBox>
  );
};

export default QualityFormCard;
