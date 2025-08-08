import { Box, Card, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

function EmployeeBankDetails({ bankDetails }) {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankingType, setBankingType] = useState('');

  useEffect(() => {
    setAccountName(bankDetails.accountName);
    setAccountNumber(bankDetails.accountNumber);
    setBankName(bankDetails.bankName);
    setIfscCode(bankDetails.ifscCode);
    setBankingType(bankDetails.bankingType);
  }, [bankDetails]);

  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100% ',
        marginTop: '20px',
        boxShadow:
          'rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px;',
        borderRadius: '1.5rem',
        padding: '20px',
      }}
    >
      <InputLabel sx={{ fontWeight: 'bold' }}>Bank details </InputLabel>
      <Box sx={{ marginTop: '10px' }}>
        <Box sx={{ padding: '10px 0' }}>
          <SoftTypography className="hrms-employee-title">Account name</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{accountName || 'N/A'}</SoftTypography>
        </Box>
        <Box sx={{ padding: '10px 0 ' }}>
          <SoftTypography className="hrms-employee-title">Bank name</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{bankName || 'N/A'}</SoftTypography>
        </Box>
        <Box sx={{ padding: '10px 0' }}>
          <SoftTypography className="hrms-employee-title">Account number</SoftTypography>
          <SoftTypography className="hrms-employee-title-info">{accountNumber || 'N/A'}</SoftTypography>
        </Box>
        <Box sx={{ padding: '10px 0' }}>
          <SoftTypography className="hrms-employee-title">IFSC code</SoftTypography>
          <SoftTypography sx={{ maxWidth: '70%' }} className="hrms-employee-title-info">
            {ifscCode || 'N/A'}
          </SoftTypography>
        </Box>
        <Box sx={{ padding: '10px 0' }}>
          <SoftTypography className="hrms-employee-title">Banking type</SoftTypography>
          <SoftTypography sx={{ maxWidth: '70%' }} className="hrms-employee-title-info">
            {bankingType || 'N/A'}
          </SoftTypography>
        </Box>
      </Box>
    </Card>
  );
}

export default EmployeeBankDetails;
