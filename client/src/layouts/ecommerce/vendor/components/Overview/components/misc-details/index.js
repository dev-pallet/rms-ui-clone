// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard PRO React components
import './misc-detail.css';
import { placeofsupply } from 'layouts/ecommerce/vendor/components/vendor-details/data/placeofsupply';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { vendorOtherDetailsEdit } from 'config/Services';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect/index';
import SoftTypography from 'components/SoftTypography';

export const MiscDetails = ({ vendorId, setUpdate, update }) => {
  const vendorData = useSelector((state) => state.vendorBaseDetails);
  const vendorBaseData = vendorData.vendorBaseDetails[0];

  const [editTog, setEditTog] = useState(false);

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

  const gstOptions = [
    { value: 'rbr', label: 'Registered Business - Regular' },
    { value: 'rbc', label: 'Registered Business - Composition' },
    { value: 'urb', label: 'Unregistered Business' },
    { value: 'ovs', label: 'Overseas' },
    { value: 'sez', label: 'Special Economic Zone' },
  ];

  const tranport_prefernce = [
    { value: 'own', label: 'Own' },
    { value: 'third_party', label: 'Third party' },
    { value: 'company', label: 'Company' },
  ];

  const payment_methods = [
    { label: 'Bank transfers', value: 'Bank transfers' },
    { value: 'cash', label: 'Cash' },
    { value: 'card/upi/netbanking', label: 'Card/UPI/Netbanking' },
    { value: 'cheque', label: 'Cheque' },
  ];

  const [gstTreatment, setGstTreatment] = useState('');
  const [pof, setPof] = useState('');
  const [currencyVl, setCurrencyVl] = useState('');
  const [gst, setGst] = useState('');
  const [tp, setTp] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [creditDays, setCreditDays] = useState('');
  const [pm, setPM] = useState('');
  const [website, setWebsite] = useState('');

  // const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');

  // const permissions = JSON.parse(localStorage.getItem('permissions'));

  useEffect(() => {
    if (vendorBaseData != undefined) {
      setGstTreatment({
        value: vendorBaseData?.vendorPreference?.gstTreatment,
        label: vendorBaseData?.vendorPreference?.gstTreatment,
      });
      setCurrencyVl({
        label: vendorBaseData?.vendorPreference?.currency,
        value: vendorBaseData?.vendorPreference?.currency,
      });
      setPof({
        value: vendorBaseData?.vendorPreference?.supplyPlace,
        label: vendorBaseData?.vendorPreference?.supplyPlace,
      });
      setGst(vendorBaseData?.kycDetails?.gst);
      //
      // setTp({ value: 'own', label: 'own' });
      setCreditLimit(vendorBaseData?.vendorPaymentTerms?.creditLimit);
      setCreditDays(vendorBaseData?.vendorPaymentTerms?.creditDays);
      setPM({
        label: vendorBaseData?.vendorPaymentTerms?.paymentOptions,
        value: vendorBaseData?.vendorPaymentTerms?.paymentOptions,
      });
      setWebsite(vendorBaseData?.website);
    }
  }, [vendorBaseData]);

  const cancelChanges = () => {
    setEditTog(false);
    setGstTreatment({
      label: vendorBaseData?.vendorPreference?.gstTreatment,
      value: vendorBaseData?.vendorPreference?.gstTreatment,
    });
    setCurrencyVl({
      label: vendorBaseData?.vendorPreference?.currency,
      value: vendorBaseData?.vendorPreference?.currency,
    });
    setPof({
      label: vendorBaseData?.vendorPreference?.supplyPlace,
      value: vendorBaseData?.vendorPreference?.supplyPlace,
    });
    setGst(vendorBaseData?.kycDetails?.gst);
    //
    // setTp({ value: 'own', label: 'own' });
    setCreditLimit(vendorBaseData?.vendorPaymentTerms?.creditLimit);
    setCreditDays(vendorBaseData?.vendorPaymentTerms?.creditDays);
    setPM({
      label: vendorBaseData?.vendorPaymentTerms?.paymentOptions,
      value: vendorBaseData?.vendorPaymentTerms?.paymentOptions,
    });
    setWebsite(vendorBaseData?.website);
  };

  const saveChangesVendorOtherDetails = () => {
    const payload = {
      currencyCode: currencyVl.label,
      website: website,
      gstTreatment: gstTreatment.label,
      sourceOfSupply: pof.label,
      transportPreference: tp.label,
      creditLimit: creditLimit,
      creditDays: creditDays,
      paymentOptions: pm.label,
      gstin: gst,
    };

    vendorOtherDetailsEdit(payload, vendorId).then((response) => {
      setUpdate(Boolean(!update));
    });
    setEditTog(false);
  };

  return (
    <Card sx={{ overflow: 'visible' }}>
      <SoftBox pt={2} px={2} display="flex" justifyContent="space-between">
        <SoftTypography fontWeight="bold" fontSize="14px">
          Other Details
        </SoftTypography>
        {editTog ? (
          <SoftBox>
            <SaveIcon color="success" className='cursorPointer' onClick={() => saveChangesVendorOtherDetails()} />
            <CancelIcon color="error" className='cursorPointer' onClick={() => cancelChanges()} />
          </SoftBox>
        ) : (
          <SoftBox>
            <ModeEditIcon className='cursorPointer' onClick={() => setEditTog(true)} />
          </SoftBox>
        )}
      </SoftBox>
      <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Currency Code
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect value={currencyVl} options={currencies} onChange={(option) => setCurrencyVl(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {currencyVl.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox flex="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Website
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox flex="50%">
              <SoftInput type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {website}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              GST Treatment
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect options={gstOptions} value={gstTreatment} onChange={(option) => setGstTreatment(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {gstTreatment.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              GSTIN
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox className="inc-input-boxo" width="50%">
              <SoftInput type="text" value={gst} onChange={(e) => setGst(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {gst}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Source of supply
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect options={placeofsupply} value={pof} onChange={(option) => setPof(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {pof.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        {/* <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Transport preference
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect options={tranport_prefernce} value={tp} onChange={(option) => setTp(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {tp.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox> */}
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Credit Limit
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox className="inc-input-boxo" width="50%">
              <SoftInput type="text" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {creditLimit}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Credit Days
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox className="inc-input-boxo" width="50%">
              <SoftInput type="text" value={creditDays} onChange={(e) => setCreditDays(e.target.value)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {creditDays}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Payment Terms
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect options={payment_methods} value={pm} onChange={(option) => setPM(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {pm.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
};
