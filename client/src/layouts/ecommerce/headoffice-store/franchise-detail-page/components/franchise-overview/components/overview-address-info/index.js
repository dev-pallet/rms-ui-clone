import { Typography } from '@mui/material';
import { city } from '../../../../../../softselect-Data/city';
import { country } from '../../../../../../softselect-Data/country';
import { state } from '../../../../../../softselect-Data/state';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../../components/SoftTypography';

const OverviewAddressInfo = () => {
  const [isEditing, setIsEditing] = useState(false);

  const editHandler = () => {
    setIsEditing(true);
  };

  const saveHandler = () => {
    setIsEditing(false);
  };
  const bussinessTypeArray = [
    { label: 'Proprietorship', value: 'Proprietorship' },
    { label: 'Paternship', value: 'paternship' },
    { label: 'Private Limited', value: 'private_limited' },
    { label: 'Public Limited', value: 'public_limted' },
    { label: 'LLP', value: 'llp' },
    { label: 'Trust', value: 'trust' },
    { label: 'Society', value: 'society' },
    { label: 'NGO', value: 'ngo' },
    { label: 'HUF', value: 'HUF' },
  ];
  return (
    <SoftBox className="details-item-wrrapper info-wrapper-frn-det">
      <SoftBox className="frn-det-info">
        <Typography mb={2}>Address Information</Typography>
        <SoftBox className="frn-det-info">
          <SaveIcon
            sx={{ color: 'red !important', marginRight: '10px !important', cursor: 'pointer' }}
            onClick={saveHandler}
          />
          <EditIcon sx={{ color: 'green !important', cursor: 'pointer' }} onClick={editHandler} />
        </SoftBox>
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Address 1</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Some Address Line 1</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Address 2</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Some Address Line 2</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Country</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">India</SoftTypography>
        ) : (
          <SoftSelect options={country} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">State</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Karnatka</SoftTypography>
        ) : (
          <SoftSelect options={state} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">City</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Bengaluru</SoftTypography>
        ) : (
          <SoftSelect options={city} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Pincode</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">432534</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default OverviewAddressInfo;
