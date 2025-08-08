import './purchases.css';
import { Bill } from 'layouts/ecommerce/vendor/components/Purchases/data/bill/bill';
import { BillPayment } from 'layouts/ecommerce/vendor/components/Purchases/data/bill-payment/bill-payment';
import { PurchaseOrders } from 'layouts/ecommerce/vendor/components/Purchases/data/purchase-orders/purchase-orders';
import { PurchaseRecieves } from 'layouts/ecommerce/vendor/components/Purchases/data/purchase-recieves/purchase-recieves';
import { useParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import DebitNote from './data/vendor-debit-note';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

export const Purchases = () => {
  const { vendorId } = useParams();

  return (
    <SoftBox className="purchase-page-vendor" sx={{ marginBottom: '20px' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="ven-purch">Purchase Order</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <PurchaseOrders />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="ven-purch">Bills</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <Bill />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="ven-purch">Payments Made</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <BillPayment />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="ven-purch">Refunds</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <PurchaseRecieves />
        </AccordionDetails>
      </Accordion>

      {/* Vendor Debit Note */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <SoftTypography className="ven-purch">Debit Note</SoftTypography>
        </AccordionSummary>
        <AccordionDetails>
          <DebitNote />
        </AccordionDetails>
      </Accordion>
    </SoftBox>
  );
};
