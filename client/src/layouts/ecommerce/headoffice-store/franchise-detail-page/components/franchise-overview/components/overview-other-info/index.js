import { Typography } from '@mui/material';
import { placeofsupply } from '../../../../../../vendor/components/vendor-details/data/placeofsupply';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../../components/SoftTypography';

const OverviewOtherInfo = () => {
  const [isEditing, setIsEditing] = useState(false);

  const editHandler = () => {
    setIsEditing(true);
  };

  const saveHandler = () => {
    setIsEditing(false);
  };

  const taxOptions = [
    { value: 'taxable', label: 'Taxable' },
    { value: 'tax exempt', label: 'Tax Exempt' },
  ];

  const gstOptions = [
    { value: 'rbr', label: 'Registered Business - Regular' },
    { value: 'rbc', label: 'Registered Business - Composition' },
    { value: 'urb', label: 'Unregistered Business' },
    { value: 'ovs', label: 'Overseas' },
    { value: 'sez', label: 'Special Economic Zone' },
  ];

  const currencies = [
    {
      value: 'India',
      label: 'INR',
    },
    {
      value: 'British Indian Ocean Territory',
      label: 'USD',
    },
    {
      value: 'Australia',
      label: 'EUR',
    },
    {
      value: 'England',
      label: 'GBP',
    },
  ];
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
        <SoftTypography className="frn-det-typo-main">GST Treatment</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Registered Business - Regular</SoftTypography>
        ) : (
          <SoftSelect options={gstOptions} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Place Of Supply</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Karnatka</SoftTypography>
        ) : (
          <SoftSelect options={placeofsupply} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Tax Preference</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Taxable</SoftTypography>
        ) : (
          <SoftSelect options={taxOptions} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Currency</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">INR</SoftTypography>
        ) : (
          <SoftSelect options={currencies} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default OverviewOtherInfo;