import { Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';

const PreviewWorkflow = ({ setSelectedTab }) => {
  const handleStart = () => {
    const newTab = window.open('/marketing/whatsapp-business/workflow/preview', '_blank');
    newTab.focus();
  };

  return (
    <div>
      <SoftBox className="add-catalog-products-box">
        <Typography className="whatsapp-bus-process-typo">Preview</Typography>
        <Typography className="whatsapp-bus-process-typo-2">
          Well done! You have completed all the steps. Click to preview all the messages and workflow.
        </Typography>
        <SoftBox className="whatsapp-bus-button-box">
          <SoftButton className="vendor-add-btn" onClick={handleStart}>
            Preview
          </SoftButton>
          <SoftButton className="vendor-second-btn" onClick={() => setSelectedTab('Process')}>
            Next
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default PreviewWorkflow;
