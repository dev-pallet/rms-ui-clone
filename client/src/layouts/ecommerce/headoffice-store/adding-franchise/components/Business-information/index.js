import React, { memo, useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseBusinessInformation = memo(({ businessInformation, setBusinessInformation }) => {
  const [franchiseName, setFranchiseName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessPan, setBusinessPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [franchiseDesc, setFranchiseDesc] = useState('');

  useEffect(() => {
    setBusinessInformation((prev) => ({
      ...prev,
      franchiseName: franchiseName,
      displayName: displayName,
      businessType: businessType,
      businessPan: businessPan,
      gstin: gstin,
      franchiseDescription: franchiseDesc,
    }));
  }, [franchiseName, franchiseDesc, displayName, businessType, businessPan, gstin]);

  //softselect options
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
    <SoftBox className="details-item-wrrapper">
      <SoftTypography className="information-heading-ho">Business Information</SoftTypography>
      <SoftTypography className="soft-input-heading-ho">Franchise Name</SoftTypography>
      <SoftInput
        name="franchise_name"
        placeholder="Franchise Name..."
        onChange={(e) => setFranchiseName(e.target.value)}
      />
      <SoftTypography className="soft-input-heading-ho">Display Name</SoftTypography>
      <SoftInput placeholder="Display Name..." onChange={(e) => setDisplayName(e.target.value)} />
      <SoftTypography className="soft-input-heading-ho">Business Type</SoftTypography>
      <SoftSelect options={bussinessTypeArray} onChange={(option) => setBusinessType(option.label)} />
      <SoftTypography className="soft-input-heading-ho">Business PAN</SoftTypography>
      <SoftBox className="flex-div-ho">
        <SoftInput placeholder="Business PAN..." sx={{ width: '100%', flex: '1' }} />
        <SoftButton variant="contained" color="info">
          Verify
        </SoftButton>
      </SoftBox>
      <SoftTypography className="soft-input-heading-ho">GSTIN</SoftTypography>
      <SoftInput placeholder="GSTIN..." onChange={(e) => setGstin(e.target.value)} />
      <SoftTypography className="soft-input-heading-ho">Franchise Description</SoftTypography>
      <SoftInput placeholder="Franchise Description..." onChange={(e) => setFranchiseDesc(e.target.value)} />
    </SoftBox>
  );
});

export default FranchiseBusinessInformation;
