import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useEffect, useState } from 'react';
import './common-flag-data-comp.css';
import { categoryColourValue, getTagDescriptionValue } from '../../CommonFunction';
import FlagCommonInfo from './flag-info';

const CommonFlagData = ({ data }) => {
  const [categoryType, setCategoryType] = useState('NA');
  const [flagColor, setFlagColor] = useState('');

  useEffect(() => {
    switch (data?.purchaseRecommendationFlag) {
      case 'GREY':
        setCategoryType('C');
        break;
      case 'GREEN':
        setCategoryType('A');
        break;
      case 'ORANGE':
        setCategoryType('B');
        break;
      case 'RED':
        setCategoryType('D');
        break;
      case 'NA':
        setCategoryType('NA');
        break;

      default:
        break;
    }
    setFlagColor(data?.purchaseRecommendationFlag);
  }, [data?.purchaseRecommendationFlag]);

  return (
    <Accordion
      disableGutters
      sx={{
        '&.MuiPaper-root': {
          boxShadow: 'none !important',
        },
        '&::before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        className="accordion-summary"
        sx={{
          backgroundColor: data?.purchaseRecommendationFlag === 'NA' ? 'black !important' : `${flagColor} !important`,
        }}
      >
        {`Flag Analysis`}
      </AccordionSummary>
      <AccordionDetails className="accordion-details-abc-analysis">
        <FlagCommonInfo data={data} />
      </AccordionDetails>
    </Accordion>
  );
};

export default CommonFlagData;
