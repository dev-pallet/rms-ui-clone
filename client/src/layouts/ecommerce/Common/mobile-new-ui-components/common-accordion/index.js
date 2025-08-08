import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import './common-accordion.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomMobileButton from '../button';
import { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CommonAccordion = ({ title, backgroundColor, customFunction, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccordionChange = (event) => {
    if (customFunction) {
      const shouldOpen = customFunction();
      if (shouldOpen) {
        setIsExpanded(!isExpanded);
      } else {
        setIsExpanded(false);
      }
      return;
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Accordion
      disableGutters
      expanded={isExpanded}
      onChange={(e) => handleAccordionChange(e)} // <-- Move onChange here
      sx={{
        '&.MuiPaper-root': {
          boxShadow: 'none !important',
          width: '100%',
        },
        '&::before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary aria-controls="panel1-content" id="panel1-header" className="common-accordion-summary">
        <CustomMobileButton
          title={title}
          variant={backgroundColor}
          width="100%"
          iconOnRight={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          justifyContent={'space-between'}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0px !important' }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CommonAccordion;
