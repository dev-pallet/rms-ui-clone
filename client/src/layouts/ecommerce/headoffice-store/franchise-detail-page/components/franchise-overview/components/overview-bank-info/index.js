import { Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../../components/SoftTypography';

const OverviewBankInfo = () => {
  const [isEditing, setIsEditing] = useState(false);

  const editHandler = () => {
    setIsEditing(true);
  };

  const saveHandler = () => {
    setIsEditing(false);
  };

  return (
    <SoftBox className="details-item-wrrapper info-wrapper-frn-det">
      <SoftBox className="frn-det-info">
        <Typography mb={2}>Other Details</Typography>
        <SoftBox className="frn-det-info">
          <SaveIcon
            sx={{ color: 'red !important', marginRight: '10px !important', cursor: 'pointer' }}
            onClick={saveHandler}
          />
          <EditIcon sx={{ color: 'green !important', cursor: 'pointer' }} onClick={editHandler} />
        </SoftBox>
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Bank Acc</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">7236498510938475</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">IFSC</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">UTIB0898D</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default OverviewBankInfo;
