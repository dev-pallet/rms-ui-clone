import './index.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Tooltip } from '@mui/material';
import { useState } from 'react';
import DeliverySlotsMonday from './day-wise/deliverySlotsMon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InstantDelivery from './instantDelivery';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';

const DeliveryTime = () => {
  const [expanded, setExpanded] = useState({
    instant: false,
    slotted: false,
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prevState) => ({
      ...prevState,
      [panel]: isExpanded,
    }));
  };

  return (
    <Box>
      <SoftBox className="vendors-filter-div">
        <div>
          <Accordion expanded={expanded.instant} onChange={handleChange('instant')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
              <SoftTypography fontSize="16px" fontWeight="bold">
              Delivery Schedule
              </SoftTypography>
            </AccordionSummary>
            <AccordionDetails>
              <InstantDelivery />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded.slotted} onChange={handleChange('slotted')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
              <SoftTypography fontSize="16px" fontWeight="bold">
                Delivery Slots
              </SoftTypography>
            </AccordionSummary>
            <AccordionDetails>
              <>
                <SoftBox display="flex" gap={2}>
                  <SoftTypography fontSize="16px" fontWeight="bold">
                    Set days and time slots
                  </SoftTypography>
                  <Tooltip title="These are the delivery time slots customers will choose from at checkout. You can add multiple time slots per day.">
                    <InfoOutlinedIcon fontSize="small" color={'info'} />
                  </Tooltip>
                </SoftBox>
                <DeliverySlotsMonday />
              </>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* <Grid container p={2}>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={-0.5}>
            <SoftTypography fontSize="16px" fontWeight="bold">
              Delivery Time
            </SoftTypography>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={selectedOptions.instantDelivery}
                    onChange={handleOptionChange}
                    name="instantDelivery"
                  />
                }
                label={<span style={{ fontSize: '0.75rem' }}>Instant Delivery</span>}
              />
              <span style={{ marginRight: '20px' }}></span>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={selectedOptions.deliverySlots}
                    onChange={handleOptionChange}
                    name="deliverySlots"
                  />
                }
                label={<span style={{ fontSize: '0.75rem' }}>Delivery Slots</span>}
              />
            </FormGroup>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            {selectedOptions.instantDelivery && <InstantDelivery />}
            {selectedOptions.deliverySlots && (
              <>
                <SoftBox display="flex" gap={2}>
                  <SoftTypography fontSize="16px" fontWeight="bold">
                    Set days and time slots
                  </SoftTypography>
                  <Tooltip title="These are the delivery time slots customers will choose from at checkout. You can add multiple time slots per day.">
                    <InfoOutlinedIcon fontSize="small" color={'info'} />
                  </Tooltip>
                </SoftBox>
                <DeliverySlotsMonday />
              </>
            )}
          </Grid>
        </Grid> */}
      </SoftBox>
    </Box>
  );
};

export default DeliveryTime;
