import { updateVendorBankDetails } from '../../../../../../../config/Services';
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
  const [bankData, setBankData] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [editTog, setEditTog] = useState(false);

  const vendorData = useSelector((state) => state.vendorBaseDetails);
  const vendorBaseData = vendorData.vendorBaseDetails[0];

  // const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');

  const permissions = JSON.parse(localStorage.getItem('permissions'));

  useEffect(() => {
    if (vendorBaseData != undefined) {
      setBankData(vendorBaseData?.banks[0]);
      setBankName(vendorBaseData?.banks[0]?.bankName);
      setAccountHolderName(vendorBaseData?.banks[0].accountHolderName);
      setBankAccountNo(vendorBaseData?.banks[0].bankAccountNo);
      setIfscCode(vendorBaseData?.banks[0]?.ifscCode);
    }
  }, [vendorBaseData]);

  const cancelChanges = () => {
    setEditTog(false);
    setBankData(vendorBaseData?.banks[0]);
    setBankName(vendorBaseData?.banks[0]?.bankName);
    setAccountHolderName(vendorBaseData?.banks[0].accountHolderName);
    setBankAccountNo(vendorBaseData?.banks[0].bankAccountNo);
    setIfscCode(vendorBaseData?.banks[0]?.ifscCode);
  };

  const updateBankDetails = () => {
    const payload = {
      bankRefId: bankData.bankRefId,
      bankName: bankName,
      bankAccountNo: bankAccountNo,
      accountHolderName: accountHolderName,
      ifscCode: ifscCode,
      type: 'PRIMARY',
    };
    setEditTog(false);
    updateVendorBankDetails(payload).then((response) => {});
  };

  return (
    <Card sx={{ overflow: 'visible' }}>
      <SoftBox pt={1} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <SoftTypography fontWeight="bold" fontSize="14px">
          Bank Details
        </SoftTypography>
        {editTog ? (
          <SoftBox>
            <SaveIcon color="success" className="cursorPointer" onClick={() => updateBankDetails()} />
            <CancelIcon color="error" className="cursorPointer" onClick={() => cancelChanges()} />
          </SoftBox>
        ) : (
          <SoftBox
          // sx={{
          //   display:
          //     permissions?.RETAIL_Products?.WRITE ||
          //     permissions?.WMS_Products?.WRITE ||
          //     permissions?.VMS_Products?.WRITE
          //       ? 'block'
          //       : 'none',
          // }}
          >
            {/* <ModeEditIcon className='cursorPointer' onClick={() => setEditTog(true)} />{' '} */}
          </SoftBox>
        )}
      </SoftBox>

      <SoftBox px={2} lineHeight={1.25}>
        <SoftBox py={1} mb={0.5}>
          <SoftBox>
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Account Holder Name
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%">
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {accountHolderName}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox mb={0.5}>
          <SoftBox>
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Bank Account No.
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%">
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {bankAccountNo}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox mb={0.5}>
          <SoftBox width="50%">
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              IFSC
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%">
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {ifscCode}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox>
            <SoftTypography variant="caption" fontWeight="bold" color="text">
              Banking type
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" />
            </SoftBox>
          ) : (
            <SoftBox width="70%">
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Domestic
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
};

export default BankDetails;
