import { Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../../components/SoftTypography';

const OverviewBInfo = () => {
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
        <Typography mb={2}>Business Details</Typography>
        <SoftBox className="frn-det-info">
          <SaveIcon
            sx={{ color: 'red !important', marginRight: '10px !important', cursor: 'pointer' }}
            onClick={saveHandler}
          />
          <EditIcon sx={{ color: 'green !important', cursor: 'pointer' }} onClick={editHandler} />
        </SoftBox>
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Franchise Name</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Some Franchise name</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Display Name</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Some Display name</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">PAN</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">JSOOEL3076N</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">GSTIN</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">JAHDFAS76898HJK</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Franchise Type</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Some Franchise name</SoftTypography>
        ) : (
          <SoftSelect options={bussinessTypeArray} sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
      <SoftBox className="frn-det-info">
        <SoftTypography className="frn-det-typo-main">Franchise Description</SoftTypography>
        {!isEditing ? (
          <SoftTypography className="frn-det-typo-secondary">Some Description</SoftTypography>
        ) : (
          <SoftInput sx={{ width: '250px !important' }} />
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default OverviewBInfo;
