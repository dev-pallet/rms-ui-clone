import { updateCustomerBankDetails } from '../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import Card from '@mui/material/Card';
import React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';

const BankDetails = () => {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [editTog, setEditTog] = useState(false);
  const [bankData, setBankData] = useState('');
  const [kycId, setKycId] = useState('');

  const custData = useSelector((state) => state.customerBaseDetails);
  const custBaseData = custData?.customerBaseDetails[0];

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');

  const permissions = JSON.parse(localStorage.getItem('permissions'));

  useEffect(() => {
    if (custBaseData !== undefined) {
      const bankDetails = custBaseData['kyc'].kycDocumentList.find((item) => item.documentType === 'BANK_DETAILS');
      const { accountHolderName, bankAccountNumber, ifscCode, id } = bankDetails;
      setAccountHolderName(accountHolderName);
      setBankAccountNo(bankAccountNumber);
      setIfscCode(ifscCode);
      setKycId(id);
    }
  }, [custBaseData]);

  const cancelChanges = () => {
    const bankDetails = custBaseData['kyc'].kycDocumentList.find((item) => item.documentType === 'BANK_DETAILS');
    const { accountHolderName, bankAccountNumber, ifscCode, id } = bankDetails;
    setAccountHolderName(accountHolderName);
    setBankAccountNo(bankAccountNumber);
    setIfscCode(ifscCode);
    setKycId(id);
    setEditTog(false);
  };

  const updateBankDetails = () => {
    const payload = {
      kycDocumentId: kycId,
      accountHolderName: accountHolderName,
      bankAccountNumber: bankAccountNo,
      ifscCode: ifscCode,
      updatedBy: uidx,
    };

    updateCustomerBankDetails(payload)
      .then((response) => {})
      .catch((err) => {
        consol.log(err);
      });

    setEditTog(false);
  };

  return (
    <Card sx={{ overflow: 'visible' }}>
      <SoftBox pt={2} px={2} display="flex" justifyContent="space-between">
        <SoftTypography fontWeight="bold" fontSize="14px">
          Bank Details
        </SoftTypography>
        {editTog ? (
          <SoftBox>
            <SaveIcon color="success" style={{ cursor: 'pointer' }} onClick={() => updateBankDetails()} />
            <CancelIcon color="error" style={{ cursor: 'pointer' }} onClick={() => cancelChanges()} />
          </SoftBox>
        ) : (
          <SoftBox
            sx={{
              display:
                permissions?.RETAIL_Customers?.WRITE ||
                permissions?.WMS_Customers?.WRITE ||
                permissions?.VMS_Customers?.WRITE
                  ? 'block'
                  : 'none',
            }}
          >
            {/* <ModeEditIcon style={{ cursor: 'pointer' }} onClick={() => setEditTog(true)} /> */}
          </SoftBox>
        )}
      </SoftBox>

      <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Account Holder Name
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {accountHolderName}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Bank Account No.
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {bankAccountNo}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              IFSC
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {ifscCode}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
};

export default BankDetails;
