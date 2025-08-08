import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import SoftInput from 'components/SoftInput';
// Soft UI Dashboard PRO React components
import { city } from 'layouts/ecommerce/softselect-Data/city';
import { country } from 'layouts/ecommerce/softselect-Data/country';
import { saveRetailNewAddress } from '../../../../../../../config/Services';
import { state } from 'layouts/ecommerce/softselect-Data/state';
import { updateRetailAddress } from '../../../../../../../config/Services';
import { useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';

// styles
import './billing-details.css';

import * as React from 'react';
import { buttonStyles } from '../../../../../Common/buttonColor';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { isSmallScreen } from '../../../../../Common/CommonFunction';

export const BillingDetails = ({ setUpdateDetails, updateDetails }) => {
  const custData = useSelector((state) => state?.customerBaseDetails);
  const custBaseData = custData?.customerBaseDetails[0];
  const customerType = JSON.parse(localStorage.getItem('customerType'));
  const isMobileDevice = isSmallScreen();

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

  const [defaultBillingAddress, setDefaultBillingAddress] = useState([]);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState([]);

  const [allAddressList, setAllAddressList] = useState('');

  const [openBilling, setOpenBilling] = useState(false);
  const handleOpen = () => setOpenBilling(true);
  const handleCloseBilling = () => {
    setEditBillingId(null);
    setEditBilling({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultShipping: '',
      defaultBilling: '',
      defaultAddress: '',
    });
    setOpenBilling(false);
  };

  const [openShipping, setOpenShipping] = useState(false);
  const handleOpen1 = () => setOpenShipping(true);
  const handleCloseShipping = () => {
    setEditShippingId(null);
    setEditShipping({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultBilling: '',
      defaultShipping: '',
      defaultAddress: '',
    });
    setOpenShipping(false);
  };

  const [openNew, setOpenNew] = useState(false);
  const handleOpenNew = () => setOpenNew(true);
  const handleCloseNew = () => {
    setNewAddress({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultShipping: '',
      defaultBilling: '',
      defaultAddress: '',
    });
    setOpenNew(false);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => {
    setEditAddressId(null);
    setEditAddress({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultShipping: '',
      defaultBilling: '',
      defaultAddress: '',
    });
    setOpenEdit(false);
  };

  const [openDefault, setOpenDefault] = useState(false);
  const handleOpenDefault = () => setOpenDefault(true);
  const handleCloseDefault = () => {
    setEditDefaultId(null);
    setEditDefaultAddress({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultBilling: '',
      defaultShipping: '',
      defaultAddress: '',
    });
    setOpenDefault(false);
  };

  //

  //

  //

  useEffect(() => {
    if (custBaseData !== undefined) {
      const defaultBilling = custBaseData?.addresses?.find((item) => item?.defaultBilling === true);

      const defaultShipping = custBaseData?.addresses?.find((item) => item?.defaultShipping == true);

      const defaultAdrs = custBaseData?.addresses?.find((item) => item?.defaultAddress == true);

      if (defaultBilling !== undefined) {
        setDefaultBillingAddress([defaultBilling]);
      }
      if (defaultShipping !== undefined) {
        setDefaultShippingAddress([defaultShipping]);
      }

      if (defaultAdrs !== undefined) {
        setDefaultAddress([defaultAdrs]);
      }

      if (defaultBilling == undefined) {
        setDefaultBillingAddress([]);
      }
      if (defaultShipping == undefined) {
        setDefaultShippingAddress([]);
      }
      if (defaultAdrs == undefined) {
        setDefaultAddress([]);
      }
      setAllAddressList(custBaseData?.addresses);
    }
  }, [custBaseData]);

  //
  //

  const [newAddress, setNewAddress] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobileNumber: '',
    defaultShipping: false,
    defaultBilling: false,
    defaultAddress: false,
  });

  const handleModalForNewAddress = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleCountryForNewAddress = (option) => {
    setNewAddress({ ...newAddress, country: option });
  };
  const handleStateForNewAddress = (option) => {
    setNewAddress({ ...newAddress, state: option });
  };
  const handleCityForNewAddress = (option) => {
    setNewAddress({ ...newAddress, city: option });
  };

  const handleCancelNewAddress = () => {
    setNewAddress({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultShipping: '',
      defaultBilling: '',
      defaultAddress: '',
    });
    setOpenNew(false);
  };

  const verifyPayload = (payload) => {
    if (payload?.mobileNumber == '' || payload?.mobileNumber?.length !== 10) {
      setErrorHandler('Please enter phone number and it should be of 10 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }
    if (payload?.pincode == '' || payload?.pincode?.length !== 6) {
      setErrorHandler('Pin code must be of 6 digits');
      setesClr('warning');
      setOpenAlert(true);
      return false;
    }

    return true;
  };

  const handleSaveNewAddress = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details)?.uidx;
    const payload = {
      name: newAddress?.name,
      entityId: custBaseData?.retailId,
      entityType: 'RETAIL',
      addressLine1: newAddress?.addressLine1,
      addressLine2: newAddress?.addressLine2,
      country: newAddress?.country?.label,
      state: newAddress?.state?.label,
      city: newAddress?.city?.label,
      pincode: newAddress?.pincode,
      mobileNumber: newAddress?.mobileNumber,
      defaultShipping: newAddress?.defaultShipping,
      defaultBilling: newAddress?.defaultBilling,
      defaultAddress: newAddress?.defaultAddress,
      createdBy: uidx,
    };

    if (!verifyPayload(payload)) {
      return;
    }

    saveRetailNewAddress(payload)
      .then((res) => {
        setOpenNew(false);
        setUpdateDetails(Boolean(!updateDetails));
      })
      .catch((err) => {});
  };

  const handleCheckBoxForDefaultAddressNewAddress = (e) => {
    setNewAddress({ ...newAddress, defaultAddress: e.target.checked });
  };

  const handleCheckBoxForDefaultBillingNewAddress = (e) => {
    setNewAddress({ ...newAddress, defaultBilling: e.target.checked });
  };

  const handleCheckBoxForDefaultShippingNewAddress = (e) => {
    setNewAddress({ ...newAddress, defaultShipping: e.target.checked });
  };

  const [editAddressId, setEditAddressId] = useState(null);
  const [editAddress, setEditAddress] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobileNumber: '',
    defaultShipping: '',
    defaultBilling: '',
  });

  const handleEditAddress = (item) => {
    setEditAddressId(item.id);
    setEditAddress({
      name: item.name,
      addressLine1: item?.addressLine1,
      addressLine2: item?.addressLine2,
      country: {
        label: item?.country,
        value: item?.country,
      },
      state: {
        label: item?.state,
        value: item?.state,
      },
      city: {
        label: item?.city,
        value: item?.city,
      },
      pincode: item?.pincode,
      mobileNumber: item?.mobileNumber,
      defaultBilling: item?.defaultBilling,
      defaultShipping: item?.defaultShipping,
      defaultAddress: item?.defaultAddress,
    });
    setOpenEdit(true);
  };

  const handleModalForEditAddress = (e) => {
    const { name, value } = e.target;
    setEditAddress({ ...editAddress, [name]: value });
  };

  const handleCountryForEditAddress = (option) => {
    setEditAddress({ ...editAddress, country: option });
  };
  const handleStateForEditAddress = (option) => {
    setEditAddress({ ...editAddress, state: option });
  };
  const handleCityForEditAddress = (option) => {
    setEditAddress({ ...editAddress, city: option });
  };

  const handleCancelForEditAddress = () => {
    setEditAddressId(null);
    setEditAddress({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultShipping: '',
      defaultBilling: '',
      defaultAddress: '',
    });
    setOpenEdit(false);
  };

  const handleCheckBoxDefaultAddressForEditAddress = (e) => {
    setEditAddress({ ...editAddress, defaultAddress: e.target.checked });
  };

  const handleCheckBoxBillingForEditAddress = (e) => {
    setEditAddress({ ...editAddress, defaultBilling: e.target.checked });
  };

  const handleCheckBoxShippingForEditAddress = (e) => {
    setEditAddress({ ...editAddress, defaultShipping: e.target.checked });
  };

  const handleSaveForEditAddress = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const payload = {
      name: editAddress?.name,
      addressId: editAddressId,
      addressLine1: editAddress?.addressLine1,
      addressLine2: editAddress?.addressLine2,
      country: editAddress?.country?.label,
      state: editAddress?.state?.label,
      city: editAddress?.city?.label,
      pincode: editAddress?.pincode,
      mobileNumber: editAddress?.mobileNumber,
      defaultShipping: editAddress?.defaultShipping,
      defaultBilling: editAddress?.defaultBilling,
      defaultAddress: editAddress?.defaultAddress,
      updatedBy: uidx,
    };

    if (!verifyPayload(payload)) {
      return;
    }

    updateRetailAddress(payload)
      .then((res) => {
        setOpenEdit(false);
        // setUpdateDetails(!updateDetails)
        setUpdateDetails(Boolean(!updateDetails));
      })
      .catch((err) => {});
  };

  const [editBilling, setEditBilling] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobileNumber: '',
    defaultBilling: '',
    defaultShipping: '',
    defaultAddress: '',
  });

  const [editBillingId, setEditBillingId] = useState(null);

  const handleEditBillingAddress = (item) => {
    setEditBillingId(item.id);
    setEditBilling({
      name: item.name,
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
      pincode: item.pincode,
      mobileNumber: item.mobileNumber,
      defaultBilling: item.defaultBilling,
      defaultShipping: item.defaultShipping,
      defaultAddress: item.defaultAddress,
    });
    setOpenBilling(true);
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

  const handleCancelEditBilling = () => {
    setEditBillingId(null);
    setEditBilling({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultShipping: '',
      defaultBilling: '',
      defaultAddress: '',
    });
    setOpenBilling(false);
  };

  const handleCheckBoxForDefaultAddress = (e) => {
    setEditBilling({ ...editBilling, defaultAddress: e.target.checked });
  };

  const handleCheckBoxForDefaultBilling = (e) => {
    setEditBilling({ ...editBilling, defaultBilling: e.target.checked });
  };

  const handleCheckBoxForDefaultShipping = (e) => {
    setEditBilling({ ...editBilling, defaultShipping: e.target.checked });
  };

  const handleUpdateBillingAddress = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const payload = {
      name: editBilling.name,
      addressId: editBillingId,
      addressLine1: editBilling.addressLine1,
      addressLine2: editBilling.addressLine2,
      country: editBilling.country.label,
      state: editBilling.state.label,
      city: editBilling.city.label,
      pincode: editBilling.pincode,
      mobileNumber: editBilling.mobileNumber,
      defaultShipping: editBilling.defaultShipping,
      defaultBilling: editBilling.defaultBilling,
      defaultAddress: editBilling.defaultAddress,
      updatedBy: uidx,
    };

    if (!verifyPayload(payload)) {
      return;
    }

    updateRetailAddress(payload)
      .then((res) => {
        setOpenBilling(false);
        // setUpdateDetails(!updateDetails)
        setUpdateDetails(Boolean(!updateDetails));
      })
      .catch((err) => {});
  };

  const [editShipping, setEditShipping] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobileNumber: '',
    defaultBilling: '',
    defaultShipping: '',
    defaultAddress: '',
  });

  const [editShippingId, setEditShippingId] = useState(null);

  const handleEditShippingAddress = (item) => {
    setEditShippingId(item.id);
    setEditShipping({
      name: item.name,
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
      pincode: item.pincode,
      mobileNumber: item.mobileNumber,
      defaultBilling: item.defaultBilling,
      defaultShipping: item.defaultShipping,
      defaultAddress: item.defaultAddress,
    });
    setOpenShipping(true);
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
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultBilling: '',
      defaultShipping: '',
      defaultAddress: '',
    });
    setOpenShipping(false);
  };

  const handleCheckBoxForEditDefaultAddress = (e) => {
    setEditShipping({ ...editShipping, defaultAddress: e.target.checked });
  };

  const handleCheckBoxForEditDefaultBilling = (e) => {
    setEditShipping({ ...editShipping, defaultBilling: e.target.checked });
  };

  const handleCheckBoxForEditDefaultShipping = (e) => {
    setEditShipping({ ...editShipping, defaultShipping: e.target.checked });
  };

  const handleUpdateShippingAddress = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const payload = {
      name: editShipping?.name,
      addressId: editShippingId,
      addressLine1: editShipping?.addressLine1,
      addressLine2: editShipping?.addressLine2,
      country: editShipping?.country?.label,
      state: editShipping?.state?.label,
      city: editShipping?.city?.label,
      pincode: editShipping?.pincode,
      mobileNumber: editShipping?.mobileNumber,
      defaultBilling: editShipping?.defaultBilling,
      defaultShipping: editShipping?.defaultShipping,
      defaultAddress: editShipping?.defaultAddress,
      updatedBy: uidx,
    };

    if (!verifyPayload(payload)) {
      return;
    }

    updateRetailAddress(payload)
      .then((res) => {
        setOpenShipping(false);
        // setUpdateDetails(!updateDetails)
        setUpdateDetails(Boolean(!updateDetails));
      })
      .catch((err) => {});
  };

  const [editDefaultAddress, setEditDefaultAddress] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobileNumber: '',
    defaultBilling: '',
    defaultShipping: '',
    defaultAddress: '',
  });

  const [editDefaultId, setEditDefaultId] = useState(null);

  const handleEditDefaultAddress = (item) => {
    setEditDefaultId(item.id);
    setEditDefaultAddress({
      name: item.name,
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
      pincode: item.pincode,
      mobileNumber: item.mobileNumber,
      defaultBilling: item.defaultBilling,
      defaultShipping: item.defaultShipping,
      defaultAddress: item.defaultAddress,
    });
    setOpenDefault(true);
  };

  const handleModalForEditDefault = (e) => {
    const { name, value } = e.target;
    setEditDefaultAddress({ ...editDefaultAddress, [name]: value });
  };

  const handleEditCountryForDefault = (option) => {
    setEditDefaultAddress({ ...editDefaultAddress, country: option });
  };
  const handleEditStateForDefault = (option) => {
    setEditDefaultAddress({ ...editDefaultAddress, state: option });
  };
  const handleEditCityForDefault = (option) => {
    setEditDefaultAddress({ ...editDefaultAddress, city: option });
  };

  const handleCancelEditDefault = () => {
    setEditDefaultId(null);
    setEditDefaultAddress({
      name: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      mobileNumber: '',
      defaultBilling: '',
      defaultShipping: '',
      defaultAddress: '',
    });
    setOpenDefault(false);
  };

  const handleCheckBoxForDefaultEditDefaultAddress = (e) => {
    setEditDefaultAddress({ ...editDefaultAddress, defaultAddress: e.target.checked });
  };

  const handleCheckBoxForDefaultEditDefaultBilling = (e) => {
    setEditDefaultAddress({ ...editDefaultAddress, defaultBilling: e.target.checked });
  };

  const handleCheckBoxForDefaultEditDefaultShipping = (e) => {
    setEditDefaultAddress({ ...editDefaultAddress, defaultShipping: e.target.checked });
  };

  const handleUpdateDefaultAddress = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details)?.uidx;
    const payload = {
      name: editDefaultAddress?.name,
      addressId: editDefaultId,
      addressLine1: editDefaultAddress?.addressLine1,
      addressLine2: editDefaultAddress?.addressLine2,
      country: editDefaultAddress?.country?.label,
      state: editDefaultAddress?.state?.label,
      city: editDefaultAddress?.city?.label,
      pincode: editDefaultAddress?.pincode,
      mobileNumber: editDefaultAddress?.mobileNumber,
      defaultBilling: editDefaultAddress?.defaultBilling,
      defaultShipping: editDefaultAddress?.defaultShipping,
      defaultAddress: editDefaultAddress?.defaultAddress,
      updatedBy: uidx,
    };

    if (!verifyPayload(payload)) {
      return;
    }

    updateRetailAddress(payload)
      .then((res) => {
        setOpenDefault(false);
        // setUpdateDetails(!updateDetails)

        setUpdateDetails(Boolean(!updateDetails));
      })
      .catch((err) => {});
  };

  //

  const AddressCard = ({ title, addressList }) => (
    <div className="listing-card-bg-secondary" style={{ gap: '0' }}>
      <div className="stack-column-start width-100">
        <div className="bill-card-value">{title}</div>
        <div className="flex-colum-align-start">
          {addressList?.length ? (
            addressList.map((item, index) => (
              <div
                key={index}
                className="bill-card-label"
                style={{
                  marginTop: '10px',
                  marginBottom: addressList.length > 1 ? '0.5rem' : '',
                }}
              >
                {item?.addressLine1}, {item?.addressLine2}, {item?.city}, {item?.country}
              </div>
            ))
          ) : (
            <>N/A</>
          )}
        </div>
      </div>
    </div>
  );  

  return (
    <>
      {isMobileDevice ?
      <div>
        <div className='stock-count-details-card'>
        <div className="stock-count-details-card-title">Address</div>
        {customerType?.value === 'org' && <AddressCard title="Default Address" addressList={defaultAddress} />}
        <AddressCard title="Billing Address" addressList={defaultBillingAddress} />
        <AddressCard title="Shipping Address" addressList={defaultShippingAddress} />
        <AddressCard title="All Address" addressList={allAddressList} />
        </div>
      </div>
      :
      <>
      <Card px={2}>
        <SoftBox px={2} py={2}>
          <SoftTypography variant="caption" fontWeight="bold" color="rgb(52,71,103)" fontSize="14px">
            Billing details
          </SoftTypography>

          <SoftBox py={1} mb={0.25}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                  Default Address
                </SoftTypography>
              </AccordionSummary>
              <AccordionDetails>
                {defaultAddress.length ? (
                  defaultAddress.map((item) => (
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <SoftTypography variant="button" fontWeight="regular" color="text" noWrap>
                        {item.addressLine1},{item.addressLine2},{item.city},{item.country}
                      </SoftTypography>
                      <Box>
                        {/* <EditIcon style={{ color: '#344767' }} onClick={() => handleEditDefaultAddress(item)} /> */}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                    Select default address from the address list
                  </SoftTypography>
                )}
              </AccordionDetails>
            </Accordion>
          </SoftBox>

          <SoftBox py={1} mb={0.25}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                  Billing Address
                </SoftTypography>
              </AccordionSummary>
              <AccordionDetails>
                {defaultBillingAddress?.length ? (
                  defaultBillingAddress?.map((item) => (
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <SoftTypography variant="button" fontWeight="regular" color="text" noWrap>
                        {item?.addressLine1},{item?.addressLine2},{item?.city},{item?.country}
                      </SoftTypography>
                      <Box>
                        {/* <EditIcon style={{ color: '#344767' }} onClick={() => handleEditBillingAddress(item)} /> */}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                    Select billing address from the address list
                  </SoftTypography>
                )}
              </AccordionDetails>
            </Accordion>
          </SoftBox>

          <SoftBox py={1} mb={0.25}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                  Shipping Address
                </SoftTypography>
              </AccordionSummary>
              <AccordionDetails>
                {defaultShippingAddress?.length ? (
                  defaultShippingAddress?.map((item) => (
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <SoftTypography variant="button" fontWeight="regular" color="text" noWrap>
                        {item?.addressLine1},{item?.addressLine2},{item?.city},{item?.country}
                      </SoftTypography>
                      <Box>
                        {/* <EditIcon style={{ color: '#344767' }} onClick={() => handleEditShippingAddress(item)} /> */}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                    Select shipping address from the address list
                  </SoftTypography>
                )}
              </AccordionDetails>
            </Accordion>
          </SoftBox>

          <SoftBox py={1} mb={0.25}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <SoftTypography variant="button" fontWeight="regular" color="rgb(52,71,103)">
                  All Addresses
                </SoftTypography>
              </AccordionSummary>
              <AccordionDetails>
                {allAddressList?.length
                  ? allAddressList?.map((item) => (
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <SoftTypography variant="button" fontWeight="regular" color="text" noWrap>
                          {item?.addressLine1},{item?.addressLine2},{item?.city},{item?.country}
                        </SoftTypography>
                        <Box>
                          {/* <EditIcon style={{ color: '#344767' }} onClick={() => handleEditAddress(item)} /> */}
                        </Box>
                      </Box>
                    ))
                  : null}
              </AccordionDetails>
            </Accordion>
          </SoftBox>

          <SoftBox mt={0.25} display="flex" flexDirection="row-reverse">
            {customerType?.label !== '' && customerType?.label !== 'pos' && (
              <SoftTypography
                // variant="button"
                component="label"
                variant="caption"
                fontWeight="bold"
                // fontWeight="regular"
                className="add-link-col colu add-more-text"
                sx={{ marginRight: '1rem' }}
                onClick={handleOpenNew}
              >
                + Add New Address
              </SoftTypography>
            )}
          </SoftBox>

          <Modal open={openBilling} onClose={handleCloseBilling} className="billing-address-modal">
            <Box className="billing-address-container">
              <SoftBox>
                Address Name
                <SoftInput name="name" value={editBilling.name} onChange={handleModalForEditBilling}></SoftInput>
              </SoftBox>
              <SoftBox>
                Mobile Number
                <SoftInput
                  name="mobileNumber"
                  type="number"
                  value={editBilling.mobileNumber}
                  onChange={handleModalForEditBilling}
                ></SoftInput>
              </SoftBox>
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
                  name="pincode"
                  type="number"
                  value={editBilling.pincode}
                  onChange={handleModalForEditBilling}
                ></SoftInput>
              </SoftBox>

              <Box className="default-shipping-billing">
                <Box className="default-address">
                  <Checkbox
                    size="small"
                    checked={editBilling.defaultAddress}
                    onChange={handleCheckBoxForDefaultAddress}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Address
                  </SoftTypography>
                </Box>
                <Box className="default-billing">
                  <Checkbox
                    size="small"
                    checked={editBilling.defaultBilling}
                    onChange={handleCheckBoxForDefaultBilling}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Billing
                  </SoftTypography>
                </Box>
                <Box className="default-shipping">
                  <Checkbox
                    size="small"
                    checked={editBilling.defaultShipping}
                    onChange={handleCheckBoxForDefaultShipping}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Shipping
                  </SoftTypography>
                </Box>
              </Box>

              <SoftBox className="billing-details-btn">
                <SoftButton
                  // className="bills-details-cancel"
                  variant={buttonStyles.outlinedColor}
                  className="outlined-softbutton"
                  onClick={() => handleCancelEditBilling()}
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
          </Modal>

          <Modal open={openShipping} onClose={handleCloseShipping} className="billing-address-modal">
            <Box className="billing-address-container">
              <SoftBox>
                Address Name
                <SoftInput name="name" value={editShipping.name} onChange={handleModalForEditShipping}></SoftInput>
              </SoftBox>
              <SoftBox>
                Mobile Number
                <SoftInput
                  name="mobileNumber"
                  type="number"
                  value={editShipping.mobileNumber}
                  onChange={handleModalForEditShipping}
                ></SoftInput>
              </SoftBox>
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
                  value={editShipping.country}
                  options={country}
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
                  name="pincode"
                  type="number"
                  value={editShipping.pincode}
                  onChange={handleModalForEditShipping}
                ></SoftInput>
              </SoftBox>

              <Box className="default-shipping-billing">
                <Box className="default-address">
                  <Checkbox
                    size="small"
                    checked={editShipping.defaultAddress}
                    onChange={handleCheckBoxForEditDefaultAddress}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Address
                  </SoftTypography>
                </Box>
                <Box className="default-billing">
                  <Checkbox
                    size="small"
                    checked={editShipping.defaultBilling}
                    onChange={handleCheckBoxForEditDefaultBilling}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Billing
                  </SoftTypography>
                </Box>
                <Box className="default-shipping">
                  <Checkbox
                    size="small"
                    checked={editShipping.defaultShipping}
                    onChange={handleCheckBoxForEditDefaultShipping}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Shipping
                  </SoftTypography>
                </Box>
              </Box>

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
          </Modal>

          <Modal open={openNew} onClose={handleCloseNew} className="billing-address-modal">
            <Box className="billing-address-container">
              <SoftBox>
                Address Name
                <SoftInput name="name" value={newAddress.name} onChange={handleModalForNewAddress}></SoftInput>
              </SoftBox>
              <SoftBox>
                Mobile Number
                <SoftInput
                  name="mobileNumber"
                  type="number"
                  value={newAddress.mobileNumber}
                  onChange={handleModalForNewAddress}
                ></SoftInput>
              </SoftBox>
              <SoftBox>
                Address 1
                <SoftInput
                  name="addressLine1"
                  value={newAddress.addressLine1}
                  onChange={handleModalForNewAddress}
                ></SoftInput>
              </SoftBox>
              <SoftBox>
                Address 2
                <SoftInput
                  name="addressLine2"
                  value={newAddress.addressLine2}
                  onChange={handleModalForNewAddress}
                ></SoftInput>
              </SoftBox>

              <SoftBox>
                Country
                <SoftSelect
                  value={newAddress.country}
                  options={country}
                  onChange={(option) => handleCountryForNewAddress(option)}
                />
              </SoftBox>
              <SoftBox>
                State
                <SoftSelect
                  options={state}
                  value={newAddress.state}
                  onChange={(option) => handleStateForNewAddress(option)}
                />
              </SoftBox>
              <SoftBox>
                City
                <SoftSelect
                  options={city}
                  value={newAddress.city}
                  onChange={(option) => handleCityForNewAddress(option)}
                />
              </SoftBox>
              <SoftBox>
                Pincode
                <SoftInput
                  name="pincode"
                  type="number"
                  value={newAddress.pincode}
                  onChange={handleModalForNewAddress}
                ></SoftInput>
              </SoftBox>

              <Box className="default-shipping-billing">
                <Box className="default-address">
                  <Checkbox size="small" onChange={handleCheckBoxForDefaultAddressNewAddress} />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Address
                  </SoftTypography>
                </Box>
                <Box className="default-billing">
                  <Checkbox size="small" onChange={handleCheckBoxForDefaultBillingNewAddress} />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Billing
                  </SoftTypography>
                </Box>
                <Box className="default-shipping">
                  <Checkbox size="small" onChange={handleCheckBoxForDefaultShippingNewAddress} />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Shipping
                  </SoftTypography>
                </Box>
              </Box>

              <SoftBox className="billing-details-btn">
                <SoftButton
                  // className="bills-details-cancel"
                  variant={buttonStyles.outlinedColor}
                  className="outlined-softbutton"
                  onClick={() => handleCancelNewAddress()}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  // className="bills-details-save"
                  variant={buttonStyles.containedColor}
                  className="contained-softbutton"
                  onClick={() => handleSaveNewAddress()}
                >
                  Save
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>

          <Modal open={openEdit} onClose={handleCloseEdit} className="billing-address-modal">
            <Box className="billing-address-container">
              <SoftBox>
                Address Name
                <SoftInput name="name" value={editAddress.name} onChange={handleModalForEditAddress}></SoftInput>
              </SoftBox>
              <SoftBox>
                Mobile Number
                <SoftInput
                  name="mobileNumber"
                  type="number"
                  value={editAddress.mobileNumber}
                  onChange={handleModalForEditAddress}
                ></SoftInput>
              </SoftBox>
              <SoftBox>
                Address 1
                <SoftInput
                  name="addressLine1"
                  value={editAddress.addressLine1}
                  onChange={handleModalForEditAddress}
                ></SoftInput>
              </SoftBox>
              <SoftBox>
                Address 2
                <SoftInput
                  name="addressLine2"
                  value={editAddress.addressLine2}
                  onChange={handleModalForEditAddress}
                ></SoftInput>
              </SoftBox>

              <SoftBox>
                Country
                <SoftSelect
                  value={editAddress.country}
                  options={country}
                  onChange={(option) => handleCountryForEditAddress(option)}
                />
              </SoftBox>
              <SoftBox>
                State
                <SoftSelect
                  options={state}
                  value={editAddress.state}
                  onChange={(option) => handleStateForEditAddress(option)}
                />
              </SoftBox>
              <SoftBox>
                City
                <SoftSelect
                  options={city}
                  value={editAddress.city}
                  onChange={(option) => handleCityForEditAddress(option)}
                />
              </SoftBox>
              <SoftBox>
                Pincode
                <SoftInput
                  name="pincode"
                  type="number"
                  value={editAddress.pincode}
                  onChange={handleModalForEditAddress}
                ></SoftInput>
              </SoftBox>

              <Box className="default-shipping-billing">
                <Box className="default-address">
                  <Checkbox
                    size="small"
                    checked={editAddress.defaultAddress}
                    onChange={handleCheckBoxDefaultAddressForEditAddress}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Address
                  </SoftTypography>
                </Box>
                <Box className="default-billing">
                  <Checkbox
                    size="small"
                    checked={editAddress.defaultBilling}
                    onChange={handleCheckBoxBillingForEditAddress}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Billing
                  </SoftTypography>
                </Box>
                <Box className="default-shipping">
                  <Checkbox
                    size="small"
                    checked={editAddress.defaultShipping}
                    onChange={handleCheckBoxShippingForEditAddress}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Shipping
                  </SoftTypography>
                </Box>
              </Box>

              <SoftBox className="billing-details-btn">
                <SoftButton
                  // className="bills-details-cancel"
                  variant={buttonStyles.outlinedColor}
                  className="outlined-softbutton"
                  onClick={() => handleCancelForEditAddress()}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  // className="bills-details-save"
                  variant={buttonStyles.containedColor}
                  className="contained-softbutton"
                  onClick={() => handleSaveForEditAddress()}
                >
                  Update
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>

          <Modal open={openDefault} onClose={handleCloseDefault} className="billing-address-modal">
            <Box className="billing-address-container">
              <SoftBox>
                Address Name
                <SoftInput name="name" value={editDefaultAddress.name} onChange={handleModalForEditDefault}></SoftInput>
              </SoftBox>
              <SoftBox>
                Mobile Number
                <SoftInput
                  name="mobileNumber"
                  type="number"
                  value={editDefaultAddress.mobileNumber}
                  onChange={handleModalForEditDefault}
                ></SoftInput>
              </SoftBox>
              <SoftBox>
                Address 1
                <SoftInput
                  name="addressLine1"
                  value={editDefaultAddress.addressLine1}
                  onChange={handleModalForEditDefault}
                ></SoftInput>
              </SoftBox>
              <SoftBox>
                Address 2
                <SoftInput
                  name="addressLine2"
                  value={editDefaultAddress.addressLine2}
                  onChange={handleModalForEditDefault}
                ></SoftInput>
              </SoftBox>

              <SoftBox>
                Country
                <SoftSelect
                  value={editDefaultAddress.country}
                  options={country}
                  onChange={(option) => handleEditCountryForDefault(option)}
                />
              </SoftBox>
              <SoftBox>
                State
                <SoftSelect
                  options={state}
                  value={editDefaultAddress.state}
                  onChange={(option) => handleEditStateForDefault(option)}
                />
              </SoftBox>
              <SoftBox>
                City
                <SoftSelect
                  options={city}
                  value={editDefaultAddress.city}
                  onChange={(option) => handleEditCityForDefault(option)}
                />
              </SoftBox>
              <SoftBox>
                Pincode
                <SoftInput
                  name="pincode"
                  type="number"
                  value={editDefaultAddress.pincode}
                  onChange={handleModalForEditDefault}
                ></SoftInput>
              </SoftBox>

              <Box className="default-shipping-billing">
                <Box className="default-address">
                  <Checkbox
                    size="small"
                    checked={editDefaultAddress.defaultAddress}
                    onChange={handleCheckBoxForDefaultEditDefaultAddress}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Address
                  </SoftTypography>
                </Box>
                <Box className="default-billing">
                  <Checkbox
                    size="small"
                    checked={editDefaultAddress.defaultBilling}
                    onChange={handleCheckBoxForDefaultEditDefaultBilling}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Billing
                  </SoftTypography>
                </Box>
                <Box className="default-shipping">
                  <Checkbox
                    size="small"
                    checked={editDefaultAddress.defaultShipping}
                    onChange={handleCheckBoxForDefaultEditDefaultShipping}
                  />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    Default Shipping
                  </SoftTypography>
                </Box>
              </Box>

              <SoftBox className="billing-details-btn">
                <SoftButton
                  // className="bills-details-cancel"
                  variant={buttonStyles.outlinedColor}
                  className="outlined-softbutton"
                  onClick={() => handleCancelEditDefault()}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  // className="bills-details-save"
                  variant={buttonStyles.containedColor}
                  className="contained-softbutton"
                  onClick={() => handleUpdateDefaultAddress()}
                >
                  Update
                </SoftButton>
              </SoftBox>
            </Box>
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
      }
    </>
  );
};
