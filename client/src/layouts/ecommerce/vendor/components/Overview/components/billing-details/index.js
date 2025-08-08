import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import SoftInput from 'components/SoftInput';
// Soft UI Dashboard PRO React components
import { city } from 'layouts/ecommerce/softselect-Data/city';
import { country } from 'layouts/ecommerce/softselect-Data/country';
import { saveVendorAdderess } from 'config/Services';
import { state } from 'layouts/ecommerce/softselect-Data/state';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
// styles
import './billing-details.css';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import * as React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { buttonStyles } from '../../../../../Common/buttonColor';
import { updateVendorAddress } from '../../../../../../../config/Services';

export const BillingDetails = ({ addressList1 }) => {
  const vendorData = useSelector((state) => state.vendorBaseDetails);
  const vendorBaseData = vendorData.vendorBaseDetails[0];

  const [openAlert, setOpenAlert] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [esClr, setesClr] = useState('');
  const [vertical, setVertical] = useState('bottom');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const [selectArray, setSelectArray] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditBilling({
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pinCode: '',
      phoneNo: '',
      addressType: '',
      type: '',
    });
    setOpen(false);
  };
  const [details, setDetails] = useState({
    country: '',
    state: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    pinCode: '',
    phoneNo: '',
    addressType: 'billing',
    type: 'SECONDARY',
  });

  const [editBilling, setEditBilling] = useState({
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pinCode: '',
    phoneNo: '',
    addressType: '',
    type: '',
  });

  const [editBillingId, setEditBillingId] = useState(null);

  const handleEditBillingAddress = (item) => {
    setEditBillingId(item.addressId);
    setEditBilling({
      addressId: item.addressId,
      addressLine1: item.addressLine1,
      addressLine2: item.addressLine2,
      country: {
        label: item.country,
        value: item.country,
      },
      state: {
        label: item.state,
        value: item.state,
      },
      city: {
        label: item.city,
        value: item.city,
      },
      pinCode: item.pinCode,
      phoneNo: item.phoneNo,
      addressType: item.addressType,
      type: item.type,
    });
    setOpen(true);
  };

  const handleModalForEditBilling = (e) => {
    const { name, value } = e.target;
    setEditBilling({ ...editBilling, [name]: value });
  };

  const handleEditCountryForBilling = (option) => {
    setEditBilling({ ...editBilling, country: option });
  };
  const handleEditStateForBilling = (option) => {
    setEditBilling({ ...editBilling, state: option });
  };
  const handleEditCityForBilling = (option) => {
    setEditBilling({ ...editBilling, city: option });
  };

  const handleCancelEdit = () => {
    setEditBillingId(null);
    setEditBilling({
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pinCode: '',
      phoneNo: '',
      addressType: '',
      type: '',
    });
    setOpen(false);
  };

  const validatePayloadForUpdateBillingAddress = (payload) => {
    if (payload.addressLine1 == '' || payload.addressLine1.length == 0) {
      setErrorHandler('Please enter address line 1');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.addressLine2 == '' || payload.addressLine2.length == 0) {
      setErrorHandler('Please enter address line 2');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.country == '' || payload.country.length == 0) {
      setErrorHandler('Please select country');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.state == '' || payload.state.length == 0) {
      setErrorHandler('Please select state');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.city == '' || payload.city.length == 0) {
      setErrorHandler('Please select city');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.pinCode == '' || payload.pinCode.length !== 6) {
      setErrorHandler('Pin code must be of 6 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }
    if (payload.phoneNo == '' || payload.phoneNo.length !== 10) {
      setErrorHandler('Please enter phone number and it should be of 10 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    return true;
  };

  const handleUpdateBillingAddress = () => {
    const payload = {
      addressId: editBillingId,
      country: editBilling.country.label,
      state: editBilling.state.label,
      city: editBilling.city.label,
      pinCode: editBilling.pinCode,
      phoneNo: editBilling.phoneNo,
      addressLine1: editBilling.addressLine1,
      addressLine2: editBilling.addressLine2,
      type: editBilling.type,
      addressType: editBilling.addressType,
    };
    //

    if (!validatePayloadForUpdateBillingAddress(payload)) {
      return;
    }

    updateVendorAddress(payload)
      .then((response) => {
        const responseAddressId = response.data.data.addressId;
        const newBillingAddress = [...selectArray];
        const billingIndex = newBillingAddress.findIndex((addr) => addr.addressId === responseAddressId);

        newBillingAddress[billingIndex] = response.data.data;
        setSelectArray(newBillingAddress);
        setOpen(false);
      })
      .catch((error) => {
        setOpen(false);
      });
  };

  const handleModal = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleCountryForBilling = (option) => {
    setDetails({ ...details, country: option.label });
  };
  const handleStateForBilling = (option) => {
    setDetails({ ...details, state: option.label });
  };
  const handleCityForBilling = (option) => {
    setDetails({ ...details, city: option.label });
  };

  const validatePayloadForNewAddress = (payload) => {
    if (payload.addressLine1 == '' || payload.addressLine1.length == 0) {
      setErrorHandler('Please enter address line 1');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.addressLine2 == '' || payload.addressLine2.length == 0) {
      setErrorHandler('Please enter address line 2');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.country == '' || payload.country.length == 0) {
      setErrorHandler('Please select country');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.state == '' || payload.state.length == 0) {
      setErrorHandler('Please select state');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.city == '' || payload.city.length == 0) {
      setErrorHandler('Please select city');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.pinCode == '' || payload.pinCode.length !== 6) {
      setErrorHandler('Pin code must be of 6 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }
    if (payload.phoneNo == '' || payload.phoneNo.length !== 10) {
      setErrorHandler('Please enter phone number and it should be of 10 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }
    return true;
  };

  const handleSave = () => {
    const payload = {
      details,
    };

    //

    if (!validatePayloadForNewAddress(payload.details)) {
      return;
    }

    saveVendorAdderess(vendorBaseData.vendorId, payload.details).then(function (response) {
      const newBillingAddress = response.data.data;
      setSelectArray((prev) => [...prev, newBillingAddress]);
    });
    setOpen(false);
  };

  const [selectArray1, setSelectArray1] = useState([]);
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => {
    setEditShipping({
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pinCode: '',
      phoneNo: '',
      addressType: '',
      type: '',
    });
    setOpen1(false);
  };

  const [details1, setDetails1] = useState({
    country: '',
    state: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    pinCode: '',
    phoneNo: '',
    addressType: 'shipping',
    type: 'SECONDARY',
  });

  const [editShipping, setEditShipping] = useState({
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pinCode: '',
    phoneNo: '',
    addressType: '',
    type: '',
  });

  const [editShippingId, setEditShippingId] = useState(null);

  const handleEditShippingAddress = (item) => {
    setEditShippingId(item.addressId);
    setEditShipping({
      addressId: item.addressId,
      addressLine1: item.addressLine1,
      addressLine2: item.addressLine2,
      country: {
        label: item.country,
        value: item.country,
      },
      state: {
        label: item.state,
        value: item.state,
      },
      city: {
        label: item.city,
        value: item.city,
      },
      pinCode: item.pinCode,
      phoneNo: item.phoneNo,
      addressType: item.addressType,
      type: item.type,
    });
    setOpen1(true);
  };

  const handleModalForEditShipping = (e) => {
    const { name, value } = e.target;
    setEditShipping({ ...editShipping, [name]: value });
  };

  const handleEditCountryForShipping = (option) => {
    setEditShipping({ ...editShipping, country: option });
  };
  const handleEditStateForShipping = (option) => {
    setEditShipping({ ...editShipping, state: option });
  };
  const handleEditCityForShipping = (option) => {
    setEditShipping({ ...editShipping, city: option });
  };

  const handleCancelEditShipping = () => {
    setEditShippingId(null);
    setEditShipping({
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pinCode: '',
      phoneNo: '',
      addressType: '',
      type: '',
    });
    setOpen1(false);
  };

  const validatePayloadForUpdateShippingAddress = (payload) => {
    if (payload.addressLine1 == '' || payload.addressLine1.length == 0) {
      setErrorHandler('Please enter address line 1');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.addressLine2 == '' || payload.addressLine2.length == 0) {
      setErrorHandler('Please enter address line 2');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.country == '' || payload.country.length == 0) {
      setErrorHandler('Please select country');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.state == '' || payload.state.length == 0) {
      setErrorHandler('Please select state');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    if (payload.city == '' || payload.city.length == 0) {
      setErrorHandler('Please select city');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }
    if (payload.pinCode == '' || payload.pinCode.length !== 6) {
      setErrorHandler('Pin code must be of 6 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }
    if (payload.phoneNo == '' || payload.phoneNo.length !== 10) {
      setErrorHandler('Please enter phone number and it should be of 10 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }
    return true;
  };

  const handleUpdateShippingAddress = () => {
    const payload = {
      addressId: editShippingId,
      country: editShipping.country.label,
      state: editShipping.state.label,
      city: editShipping.city.label,
      pinCode: editShipping.pinCode,
      phoneNo: editShipping.phoneNo,
      addressLine1: editShipping.addressLine1,
      addressLine2: editShipping.addressLine2,
      type: editShipping.type,
      addressType: editShipping.addressType,
    };
    //

    if (!validatePayloadForUpdateShippingAddress(payload)) {
      return;
    }

    updateVendorAddress(payload)
      .then((response) => {
        const responseAddressId = response.data.data.addressId;
        const newShippingAddress = [...selectArray1];
        const shippingIndex = newShippingAddress.findIndex((addr) => addr.addressId === responseAddressId);

        newShippingAddress[shippingIndex] = response.data.data;
        setSelectArray1(newShippingAddress);
        setOpen1(false);
      })
      .catch((error) => {
        setOpen1(false);
      });
  };

  const handleModal1 = (e) => {
    const { name, value } = e.target;
    setDetails1({ ...details1, [name]: value });
  };

  const handleCountryForShipping = (option) => {
    setDetails1({ ...details1, country: option.label });
  };
  const handleStateForShipping = (option) => {
    setDetails1({ ...details1, state: option.label });
  };
  const handleCityForShipping = (option) => {
    setDetails1({ ...details1, city: option.label });
  };

  const handleSave1 = () => {
    const payload = {
      details1,
    };

    if (!validatePayloadForNewAddress(payload.details1)) {
      return;
    }

    saveVendorAdderess(vendorBaseData.vendorId, payload.details1).then(function (response) {
      const newShippingAddress = response.data.data;
      setSelectArray1((prev) => [...prev, newShippingAddress]);
    });
    setOpen1(false);
  };

  useEffect(() => {
    if (selectArray?.length == 0 || selectArray1?.length == 0) {
      const billingAddress = [];
      const shippingAddress = [];
      for (let i = 0; i < addressList1.length; i++) {
        if (addressList1[i].addressType === 'billing') {
          billingAddress.push(addressList1[i]);
        } else if (addressList1[i].addressType === 'default') {
          billingAddress.push(addressList1[i]);
          shippingAddress.push(addressList1[i]);
        } else if (addressList1[i].addressType === 'shipping') {
          shippingAddress.push(addressList1[i]);
        }
      }
      setSelectArray(billingAddress);
      setSelectArray1(shippingAddress);
    }
  }, [addressList1]);

  return (
    <>
      <Card pt={2} px={2}>
        <SoftBox mt={3} pt={2} px={2}>
          <SoftTypography
            // variant="caption"
            fontWeight="bold"
            color="rgb(52,71,103)"
            // textTransform="uppercase"
            fontSize="14px"
          >
            Billing details
          </SoftTypography>
        </SoftBox>
        <SoftBox py={1} mb={0.25} px={2}>
          <SoftBox mt={0.25} display="flex" flexDirection="row-reverse">
            <SoftTypography
              variant="button"
              fontSize="0.8rem"
              fontWeight="regular"
              className="add-link-color-i cursorPointer"
              onClick={handleOpen}
            >
              Add New Address
            </SoftTypography>
          </SoftBox>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                Billing Address
              </SoftTypography>
            </AccordionSummary>
            <AccordionDetails>
              {selectArray.length
                ? selectArray.map((item) => (
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                    key={item.addressId}
                  >
                    <SoftTypography variant="button" fontWeight="regular" color="text" noWrap>
                      {item.addressLine1},{item.addressLine2},{item.country},{item.city}
                    </SoftTypography>
                    <Box>
                      <EditIcon
                        style={{ color: '#344767', cursor: 'pointer' }}
                        onClick={() => handleEditBillingAddress(item)}
                      />
                    </Box>
                  </Box>
                ))
                : null}
            </AccordionDetails>
          </Accordion>
          <Modal open={open} onClose={handleClose} className="billing-address-modal">
            {editBillingId !== null ? (
              <Box className="billing-address-container">
                {/* <SoftBox>
                Location Name
                <SoftInput name="location" onChange={handleModalForEditBilling}></SoftInput>
              </SoftBox> */}
                <SoftBox>
                  Address 1
                  <SoftInput
                    name="addressLine1"
                    value={editBilling.addressLine1}
                    onChange={handleModalForEditBilling}
                  ></SoftInput>
                </SoftBox>
                <SoftBox>
                  Address 2
                  <SoftInput
                    name="addressLine2"
                    value={editBilling.addressLine2}
                    onChange={handleModalForEditBilling}
                  ></SoftInput>
                </SoftBox>

                <SoftBox>
                  Country
                  <SoftSelect
                    value={editBilling.country}
                    options={country}
                    onChange={(option) => handleEditCountryForBilling(option)}
                  />
                </SoftBox>
                <SoftBox>
                  State
                  <SoftSelect
                    options={state}
                    value={editBilling.state}
                    onChange={(option) => handleEditStateForBilling(option)}
                  />
                </SoftBox>
                <SoftBox>
                  City
                  <SoftSelect
                    options={city}
                    value={editBilling.city}
                    onChange={(option) => handleEditCityForBilling(option)}
                  />
                </SoftBox>
                <SoftBox>
                  Pincode
                  <SoftInput
                    name="pinCode"
                    type="number"
                    value={editBilling.pinCode}
                    onChange={handleModalForEditBilling}
                  ></SoftInput>
                </SoftBox>
                <SoftBox>
                  Phone
                  <SoftInput
                    name="phoneNo"
                    type="number"
                    value={editBilling.phoneNo}
                    onChange={handleModalForEditBilling}
                  ></SoftInput>
                </SoftBox>
                <SoftBox className="billing-details-btn">
                  <SoftButton
                    // className="bills-details-cancel"
                    variant={buttonStyles.outlinedColor}
                    className="outlined-softbutton"
                    onClick={() => handleCancelEdit()}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton
                    // className="bills-details-save"
                    variant={buttonStyles.containedColor}
                    className="contained-softbutton"
                    onClick={() => handleUpdateBillingAddress()}
                  >
                    Update
                  </SoftButton>
                </SoftBox>
              </Box>
            ) : (
              <Box className="billing-address-container">
                {/* <SoftBox>
                Location Name
                <SoftInput name="location" onChange={handleModal}></SoftInput>
              </SoftBox> */}
                <SoftBox>
                  Address 1<SoftInput name="addressLine1" onChange={handleModal}></SoftInput>
                </SoftBox>
                <SoftBox>
                  Address 2<SoftInput name="addressLine2" onChange={handleModal}></SoftInput>
                </SoftBox>

                <SoftBox>
                  Country
                  <SoftSelect options={country} onChange={(option) => handleCountryForBilling(option)} />
                </SoftBox>
                <SoftBox>
                  State
                  <SoftSelect options={state} onChange={(option) => handleStateForBilling(option)} />
                </SoftBox>
                <SoftBox>
                  City
                  <SoftSelect options={city} onChange={(option) => handleCityForBilling(option)} />
                </SoftBox>
                <SoftBox>
                  Pincode
                  <SoftInput
                    name="pinCode"
                    type="number"
                    value={editBilling.pincode}
                    onChange={handleModal}
                  ></SoftInput>
                </SoftBox>
                <SoftBox>
                  Phone
                  <SoftInput name="phoneNo" type="number" onChange={handleModal}></SoftInput>
                </SoftBox>
                <SoftBox className="billing-details-btn">
                  <SoftButton
                    // className="bills-details-cancel"
                    variant={buttonStyles.outlinedColor}
                    className="outlined-softbutton"
                    onClick={() => handleClose()}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton
                    // className="bills-details-save"
                    variant={buttonStyles.containedColor}
                    className="contained-softbutton"
                    onClick={() => handleSave()}
                  >
                    Save
                  </SoftButton>
                </SoftBox>
              </Box>
            )}
          </Modal>
        </SoftBox>
        <SoftBox py={1} mb={0.25} pt={2} px={2}>
          <SoftBox mt={0.25} display="flex" flexDirection="row-reverse">
            <SoftTypography
              variant="button"
              fontSize="0.8rem"
              fontWeight="regular"
              className="add-link-color-i cursorPointer"
              onClick={handleOpen1}
            >
              Add New Address
            </SoftTypography>
          </SoftBox>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                Shipping Address
              </SoftTypography>
            </AccordionSummary>
            <AccordionDetails>
              {selectArray1.length
                ? selectArray1.map((item) => (
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                    key={item.addressId}
                  >
                    <SoftTypography variant="button" fontWeight="regular" color="text" noWrap>
                      {item.addressLine1},{item.addressLine2},{item.country},{item.city}
                    </SoftTypography>
                    <Box>
                      <EditIcon
                        style={{ color: '#344767', cursor: 'pointer' }}
                        onClick={() => handleEditShippingAddress(item)}
                      />
                    </Box>
                  </Box>
                ))
                : null}
            </AccordionDetails>
          </Accordion>
          <Modal open={open1} onClose={handleClose1} className="billing-address-modal">
            {editShippingId !== null ? (
              <Box className="billing-address-container">
                {/* <SoftBox>
                Enter Location Name
                <SoftInput name="country" onChange={handleModalForEditShipping}></SoftInput>
              </SoftBox> */}
                <SoftBox>
                  Address 1
                  <SoftInput
                    name="addressLine1"
                    value={editShipping.addressLine1}
                    onChange={handleModalForEditShipping}
                  ></SoftInput>
                </SoftBox>
                <SoftBox>
                  Address 2
                  <SoftInput
                    name="addressLine2"
                    value={editShipping.addressLine2}
                    onChange={handleModalForEditShipping}
                  ></SoftInput>
                </SoftBox>
                <SoftBox>
                  Country
                  <SoftSelect
                    options={country}
                    value={editShipping.country}
                    onChange={(option) => handleEditCountryForShipping(option)}
                  />
                </SoftBox>
                <SoftBox>
                  State
                  <SoftSelect
                    options={state}
                    value={editShipping.state}
                    onChange={(option) => handleEditStateForShipping(option)}
                  />
                </SoftBox>
                <SoftBox>
                  City
                  <SoftSelect
                    options={city}
                    value={editShipping.city}
                    onChange={(option) => handleEditCityForShipping(option)}
                  />
                </SoftBox>
                <SoftBox>
                  Pincode
                  <SoftInput
                    name="pinCode"
                    type="number"
                    value={editShipping.pinCode}
                    onChange={handleModalForEditShipping}
                  ></SoftInput>
                </SoftBox>
                <SoftBox>
                  Phone
                  <SoftInput
                    name="phoneNo"
                    type="number"
                    value={editShipping.phoneNo}
                    onChange={handleModalForEditShipping}
                  ></SoftInput>
                </SoftBox>
                <SoftBox className="billing-details-btn">
                  <SoftButton
                    // className="bills-details-cancel"
                    variant={buttonStyles.outlinedColor}
                    className="outlined-softbutton"
                    onClick={() => handleCancelEditShipping()}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton
                    // className="bills-details-save"
                    variant={buttonStyles.containedColor}
                    className="contained-softbutton"
                    onClick={() => handleUpdateShippingAddress()}
                  >
                    Update
                  </SoftButton>
                </SoftBox>
              </Box>
            ) : (
              <Box className="billing-address-container">
                {/* <SoftBox>
                Enter Location Name
                <SoftInput name="country" onChange={handleModal1}></SoftInput>
              </SoftBox> */}
                <SoftBox>
                  Address 1<SoftInput name="addressLine1" onChange={handleModal1}></SoftInput>
                </SoftBox>
                <SoftBox>
                  Address 2<SoftInput name="addressLine2" onChange={handleModal1}></SoftInput>
                </SoftBox>
                <SoftBox>
                  Country
                  <SoftSelect options={country} onChange={(option) => handleCountryForShipping(option)} />
                </SoftBox>
                <SoftBox>
                  State
                  <SoftSelect options={state} onChange={(option) => handleStateForShipping(option)} />
                </SoftBox>
                <SoftBox>
                  City
                  <SoftSelect options={city} onChange={(option) => handleCityForShipping(option)} />
                </SoftBox>
                <SoftBox>
                  Pincode
                  <SoftInput name="pinCode" type="number" onChange={handleModal1}></SoftInput>
                </SoftBox>
                <SoftBox>
                  Phone
                  <SoftInput name="phoneNo" type="number" onChange={handleModal1}></SoftInput>
                </SoftBox>
                <SoftBox className="billing-details-btn">
                  <SoftButton
                    // className="bills-details-cancel"
                    variant={buttonStyles.outlinedColor}
                    className="outlined-softbutton"
                    onClick={() => handleClose1()}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton
                    // className="bills-details-save"
                    variant={buttonStyles.containedColor}
                    className="contained-softbutton"
                    onClick={() => handleSave1()}
                  >
                    Save
                  </SoftButton>
                </SoftBox>
              </Box>
            )}
          </Modal>
        </SoftBox>
      </Card>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical, horizontal: 'left' }}
      >
        <Alert onClose={handleCloseAlert} severity={esClr} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </>
  );
};
