import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../../components/SoftTypography';

const OverviewPurchases = () => {
  return (
    <SoftBox sx={{ marginTop: '30px',marginBottom: '30px' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography  className="frn-det-typo-main">Purchase Orders</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <SoftTypography>
            No Data Found
          </SoftTypography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="frn-det-typo-main">Bills</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <SoftTypography>
            No Data Found
          </SoftTypography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="frn-det-typo-main">Purchase Made</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <SoftTypography>
            No Data Found
          </SoftTypography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="frn-det-typo-main">Refund</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <SoftTypography>
            No Data Found
          </SoftTypography>
        </AccordionDetails>
      </Accordion>
    </SoftBox>
  );
};

export default OverviewPurchases;
