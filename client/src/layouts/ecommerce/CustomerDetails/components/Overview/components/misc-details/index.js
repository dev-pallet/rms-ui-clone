// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard PRO React components
import './misc-detail.css';
import { currency } from 'layouts/ecommerce/vendor/components/vendor-details/data/currency';
import { placeofsupply } from 'layouts/ecommerce/vendor/components/vendor-details/data/placeofsupply';
import { postCustomerOtherDetails } from '../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from 'components/SoftBox';
import SoftSelect from 'components/SoftSelect/index';
import SoftTypography from 'components/SoftTypography';

export const MiscDetails = ({ setUpdateDetails, updateDetails }) => {
  const custData = useSelector((state) => state.customerBaseDetails);
  const custBaseData = custData.customerBaseDetails[0];

  const [editTog, setEditTog] = useState(false);
  const [currencyCustomer, setCurrencyCustomer] = useState('');
  const [gstTreatment, setGstTreatment] = useState('');
  const [supplyTo, setSupplyTo] = useState('');
  const [taxPreference, setTaxPreference] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [priceSlab, setPriceSlab] = useState('');


  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');


  const gstOptions = [
    { value: 'rbr', label: 'Registered Business - Regular' },
    { value: 'rbc', label: 'Registered Business - Composition' },
    { value: 'urb', label: 'Unregistered Business' },
    { value: 'ovs', label: 'Overseas' },
    { value: 'sez', label: 'Special Economic Zone' },
  ];

  const taxOptions = [
    { value: 'taxable', label: 'Taxable' },
    { value: 'tax exempt', label: 'Tax Exempt' },
  ];

  const priceOptions = [
    { value: 'Price Slab 1', label: 'Price Slab 1' },
    { value: 'Price Slab 2', label: 'Price Slab 2' },
    { value: 'Price Slab 3', label: 'Price Slab 3' },
    { value: 'Price Slab 4', label: 'Price Slab 4' },
    { value: 'Price Slab 5', label: 'Price Slab 5' },
  ];

  const paymentOptions = [
    { value: 'Due end of Month', label: 'Due end of Month' },
    { value: 'Net 45', label: 'Net 45' },
    { value: 'Due on receipt', label: 'Due on receipt' },
    { value: 'Due on receipt1', label: 'Due on receipt' },
    { value: 'Due on receipt2', label: 'Due on receipt' },
  ];

  const tranport_prefernce = [
    { value: 'own', label: 'Own' },
    { value: 'third_party', label: 'Third party' },
    { value: 'company', label: 'Company' },
  ];

  useEffect(() => {
    if (custBaseData !== undefined) {
      setCurrencyCustomer({
        value: custBaseData?.currency,
        label: custBaseData?.currency,
      });
      setGstTreatment({
        value: custBaseData?.gstTreatment,
        label: custBaseData?.gstTreatment,
      });
      setSupplyTo({
        value: custBaseData?.supplyTo,
        label: custBaseData?.supplyTo,
      });
      setTaxPreference({
        label: custBaseData?.taxPreference,
        value: custBaseData?.taxPreference,
      });
      setPaymentTerms({
        label: custBaseData?.paymentTerms,
        value: custBaseData?.paymentTerms,
      });
      setPriceSlab({
        label: custBaseData?.priceSlab,
        value: custBaseData?.priceSlab,
      });
    }
  }, [custBaseData]);

  const cancelChanges = () => {
    setEditTog(false);
    setCurrencyCustomer({
      label: custBaseData?.currency,
      value: custBaseData?.currency,
    });
    setGstTreatment({
      label: custBaseData?.gstTreatment,
      value: custBaseData?.gstTreatment,
    });
    setSupplyTo({
      label: custBaseData?.supplyTo,
      value: custBaseData?.supplyTo,
    });
    setTaxPreference({
      label: custBaseData?.taxPreference,
      value: custBaseData?.taxPreference,
    });
    setPaymentTerms({
      label: custBaseData?.paymentTerms,
      value: custBaseData?.paymentTerms,
    });
    setPriceSlab({
      label: custBaseData?.priceSlab,
      value: custBaseData?.priceSlab,
    });
  };

  const saveChangesCustomerOtherDetails = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const payload = {
      logoUrl: custBaseData.logo,
      displayName: custBaseData.displayName,
      customerName: custBaseData.customerName,
      retailType: custBaseData.retailType,
      description: custBaseData.description,
      website: custBaseData.website,
      gstTreatment: gstTreatment.label,
      supplyTo: supplyTo.label,
      taxPreference: taxPreference.label,
      currency: currencyCustomer.label,
      paymentTerms: paymentTerms.label,
      priceSlab: priceSlab.label,
      retailId: custBaseData.retailId,
      accessPortal: custBaseData.accessPortal,
      updatedBy: uidx,
    };

    postCustomerOtherDetails(payload)
      .then((response) => {
        setUpdateDetails(Boolean(!updateDetails));
      })
      .catch((error) => {
        setEditTog(false);
      });
    setEditTog(false);
  };

  return (
    <Card sx={{ overflow: 'visible' }}>
      <SoftBox mt={3} pt={2} px={2} display="flex" justifyContent="space-between">
        <SoftTypography
          variant="caption"
          fontWeight="bold"
          color="rgb(52,71,103)"
          textTransform="uppercase"
          fontSize="14px"
        >
          Other details
        </SoftTypography>
        {editTog ? (
          <SoftBox>
            <SaveIcon color="success" onClick={saveChangesCustomerOtherDetails} />
            <CancelIcon color="error" onClick={() => cancelChanges()} />
          </SoftBox>
        ) : (
          <SoftBox>
            <ModeEditIcon onClick={() => setEditTog(true)} />
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
              <SoftSelect
                value={currencyCustomer}
                options={currency}
                onChange={(option) => setCurrencyCustomer(option)}
              />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {currencyCustomer.label}
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
              Source of supply
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect options={placeofsupply} value={supplyTo} onChange={(option) => setSupplyTo(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {supplyTo.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Tax preference
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect options={taxOptions} value={taxPreference} onChange={(option) => setTaxPreference(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {taxPreference.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Price Slab
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect options={priceOptions} value={priceSlab} onChange={(option) => setPriceSlab(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {priceSlab.label}
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
              <SoftSelect
                options={paymentOptions}
                value={paymentTerms}
                onChange={(option) => setPaymentTerms(option)}
              />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {paymentTerms.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </Card>
  );
};
