import '../shop-location.css';
import { Box, Button, Checkbox, Grid } from '@mui/material';
import {
  addBranchAddressRetail,
  deleteBrandAddress,
  getBranchAllAdresses,
  updateBranchAddressRetail,
} from '../../../../config/Services';
import { buttonStyles } from '../../Common/buttonColor';
import { city as cityList } from '../../softselect-Data/city';
import { countries } from '../../new-location/components/countrydetails';
import { states } from '../../new-location/components/statedetails';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import SetInterval from '../../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import TextField from '@mui/material/TextField';
import sideNavUpdate from 'components/Utility/sidenavupdate';
import { noDatagif } from '../../Common/CommonFunction';

const LocContactDetail = ({ handleTab }) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  sideNavUpdate();

  const { locationId } = useParams();
  const [open, setOpen] = useState(false);
  const [loader, setloader] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [msg, setMsg] = useState('');
  const [editLoader, setEditLoader] = useState(false);
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [errorhandler, setErrorHandler] = useState('');
  const [successUr, setSuccessUr] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const mobileNumber = JSON.parse(user_details).mobileNumber;

  const [newaddressLine1, setNewaddressLine1] = useState('');
  const [newaddressLine2, setNewaddressLine2] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newstate, setNewstate] = useState('');
  const [newcity, setNewcity] = useState('');
  const [newpincode, setNewpincode] = useState('');
  const [newpmobileNumber, setNewmobileNumber] = useState('');
  const [newaddressName, setNewaddressName] = useState('');
  const [newpriority, setNewpriority] = useState('');
  const [cities, setCities] = useState([]);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(false);

  const [opensnack, setOpensnack] = useState(false);
  const [alertmessage, setAlertmessage] = useState('');
  const [timelinerror, setTimelineerror] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const [IsreadOnly, setIsreadOnly] = useState(true);
  const [showedit, setShowedit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [allAdresses, setAllAddress] = useState([]);
  const [editedItem, setEditedItem] = useState(null);

  const handleBasicEdit = (item) => {
    setShowedit(true);
    setIsreadOnly(false);
    setEditedItem(item);
    setDefaultBilling(item.defaultBilling);
    setDefaultShipping(item.defaultShipping);
    setDefaultAddress(item.defaultAddress);
  };

  const handleBasicDelete = (item) => {
    setUpdated(true);
    const payload = {
      addressId: item.id,
      updatedBy: uidx,
    };
    deleteBrandAddress(payload)
      .then((res) => {
        setUpdated(false);
        setAlertmessage('Deleted Successfully');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        allBranchDetails();
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('success');
        SetInterval(handleopensnack());
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value,
    });
  };

  const handleclosebutton = () => {
    setShowedit(false);
  };

  const handleUpdate = (item) => {
    const payload = {
      addressId: parseInt(item.id),
      name: item?.name,
      addressLine1: item?.addressLine1,
      addressLine2: item?.addressLine2,
      country: item?.country,
      state: item?.state,
      city: item?.city,
      pincode: item?.pincode,
      defaultShipping: defaultShipping,
      defaultBilling: defaultBilling,
      defaultAddress: defaultAddress,
      mobileNumber: item?.mobileNumber,
      updatedBy: uidx,
    };
    if (payload?.pincode?.length !== 6) {
      setAlertmessage('Pincode should be of 6 digits');
      setTimelineerror('error');
      SetInterval(handleopensnack());
    } else if (payload?.mobileNumber?.length !== 10) {
      setAlertmessage('Mobile Number should be of 10 digits');
      setTimelineerror('error');
      SetInterval(handleopensnack());
    } else {
      updateBranchAddressRetail(payload)
        .then((res) => {
          if (res.data.data.message == 'ENTER_UNIQUE_ADDRESS_NAME') {
            setAlertmessage('ENTER UNIQUE ADDRESS NAME');
            setTimelineerror('error');
            SetInterval(handleopensnack());
          }
          if (res.data.data.message == 'ADDRESS_NOT_FOUND') {
            setAlertmessage('ADDRESS NOT FOUND');
            setTimelineerror('error');
            SetInterval(handleopensnack());
            setEditedItem(null);
            setShowedit(false);
          } else if (res.data.data.message == 'Success') {
            setAlertmessage('Updated Successfully');
            setTimelineerror('success');
            SetInterval(handleopensnack());
            setEditedItem(null);
            setShowedit(false);
            allBranchDetails();
          }
        })
        .catch((err) => {
          setAlertmessage(err.response.data.message);
          setTimelineerror('error');
          SetInterval(handleopensnack());
        });
    }
  };

  useEffect(() => {
    const tabChangeFromSku = localStorage.getItem('add-vendor-product-portfolio');
    if (tabChangeFromSku) {
      handleTab(1);
    }
  }, []);

  useEffect(() => {
    if (locationId) {
      allBranchDetails();
    }
  }, []);

  const allBranchDetails = () => {
    setloader(true);
    try {
      getBranchAllAdresses(locationId).then((res) => {
        if (res.data.data.message === 'BRANCH_NOT_FOUND') {
          setAlertmessage('Branch Not Found');
          setTimelineerror('error');
          SetInterval(handleopensnack());
          setloader(false);
          setNotFound(true);
          setMsg('Branch Not Found');
        } else if (res.data.data.message === 'ADDRESS_NOT_FOUND') {
          setAlertmessage('Address Not Found');
          setTimelineerror('error');
          SetInterval(handleopensnack());
          setloader(false);
          setMsg('Address Not Found');
        } else {
          setAllAddress(res.data.data.addresses);
          setAlertmessage('Address Found Successfully');
          setTimelineerror('success');
          SetInterval(handleopensnack());
          setloader(false);
        }
      });
    } catch (error) {
      allBranchDetails();
    }
  };

  const handleNewAddress = () => {
    if (msg === 'Branch Not Found') {
      setNotFound(true);
    } else {
      setShowAddAddress(true);
    }
  };

  const handleSaveAddress = () => {
    const payload = {
      entityId: locationId,
      entityType: 'BRANCH',
      addressLine1: newaddressLine1,
      addressLine2: newaddressLine2,
      country: newCountry,
      state: newstate,
      city: newcity,
      pincode: newpincode,
      name: newaddressName,
      createdBy: uidx,
      defaultShipping: defaultShipping,
      defaultBilling: defaultBilling,
      defaultAddress: defaultAddress,
      mobileNumber: newpmobileNumber,
    };
    if (newaddressName == '') {
      setAlertmessage('Enter name');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newaddressLine1 == '') {
      setAlertmessage('Enter Address');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newCountry == '') {
      setAlertmessage('Enter Country');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newstate == '') {
      setAlertmessage('Enter State');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newcity == '') {
      setAlertmessage('Enter City');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newpincode == '') {
      setAlertmessage('Enter pincode');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newpincode.length !== 6) {
      setAlertmessage('Pincode should be of 6 digits');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newpmobileNumber == '') {
      setAlertmessage('Enter mobile number');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else if (newpmobileNumber.length !== 10) {
      setAlertmessage('Mobile Number should be of 10 digits');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    } else {
      addBranchAddressRetail(payload).then((res) => {
        if (res.data.data.message === 'ENTER_UNIQUE_ADDRESS_NAME') {
          setAlertmessage('ENTER UNIQUE ADDRESS NAME');
          setTimelineerror('error');
          SetInterval(handleopensnack());
        } else {
          setAlertmessage('Address added Successfully');
          setTimelineerror('success');
          SetInterval(handleopensnack());
          setNewCountry('');
          setNewstate('');
          setNewcity('');
          setShowAddAddress(false);
          allBranchDetails();
        }
      });
    }
  };

  const handlecloseAddress = () => {
    setShowAddAddress(false);
  };

  return (
    <>
      <Box mt={2}>
        {notFound ? (
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox className="src-imgg-data">
              <img className="src-dummy-img" src={noDatagif} />
            </SoftBox>
            <SoftBox className="loc-not-found">
              <SoftTypography variant="h5">{msg}</SoftTypography>
            </SoftBox>
          </Grid>
        ) : loader ? (
          <Spinner />
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} xl={12}>
                {showAddAddress ? (
                  <SoftBox className="setting-main-cont">
                    <SoftBox className="setting-inner-main-cont1">
                      <SoftBox className="setting-inner-heading-cont">
                        <SoftTypography className="basic-font">New Address</SoftTypography>

                        <SoftBox className="coco-box">
                          {loader ? (
                            <SoftBox margin="auto">
                              <Spinner />
                            </SoftBox>
                          ) : (
                            <SoftBox className="coco-box">
                              <SoftButton
                                variant={buttonStyles.outlinedColor}
                                onClick={() => handlecloseAddress()}
                                className="basic-font1 outlined-softbutton"
                              >
                                Cancel
                              </SoftButton>
                              <SoftButton
                                variant={buttonStyles.primaryVariant}
                                onClick={() => handleSaveAddress()}
                                className="basic-font1 contained-softbutton"
                              >
                                Save
                              </SoftButton>
                            </SoftBox>
                          )}
                        </SoftBox>
                      </SoftBox>
                      <SoftBox className="setting-inner-body-cont">
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont">
                              <List className="list-type-op">
                                <ListItem>Name of Address </ListItem>
                                <ListItem>Address Line 1</ListItem>
                                <ListItem>Address Line 2</ListItem>
                                <ListItem>Country</ListItem>
                                <ListItem>State</ListItem>
                                <ListItem>City</ListItem>
                                <ListItem>Pincode</ListItem>
                                <ListItem>Mobile Number</ListItem>
                                <ListItem>Default Billing</ListItem>
                                <ListItem>Default Shipping</ListItem>
                                <ListItem>Default Address</ListItem>
                              </List>
                            </SoftBox>
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont1">
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="addressType"
                                  onChange={(e) => setNewaddressName(e.target.value)}
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="addressLine1"
                                  onChange={(e) => setNewaddressLine1(e.target.value)}
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="addressLine2"
                                  onChange={(e) => setNewaddressLine2(e.target.value)}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <Autocomplete
                                  onChange={(event, value) => setNewCountry(value.label)}
                                  disablePortal
                                  id="Edit-box-input-hover"
                                  options={countries}
                                  value={newCountry}
                                  freeSolo
                                  fullWidth
                                  // sx={{ width: 300 }}
                                  renderInput={(params) => <TextField {...params} />}
                                  required
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <Autocomplete
                                  onChange={(event, value) => {
                                    setNewstate(value.label);
                                    if (value) {
                                      const tempCities = [...cityList].filter((city) => {
                                        return city.value === value.label;
                                      });
                                      setCities(tempCities);
                                    } else {
                                      setCities([]);
                                    }
                                  }}
                                  disablePortal
                                  id="Edit-box-input-hover"
                                  options={states}
                                  value={newstate}
                                  freeSolo
                                  fullWidth
                                  // sx={{ width: 300 }}
                                  renderInput={(params) => <TextField {...params} />}
                                  required
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <Autocomplete
                                  onChange={(event, value) => setNewcity(value.label)}
                                  disablePortal
                                  id="Edit-box-input-hover"
                                  options={cities}
                                  value={newcity}
                                  freeSolo
                                  fullWidth
                                  // sx={{ width: 300 }}
                                  renderInput={(params) => <TextField {...params} />}
                                  required
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="number"
                                  name="pincode"
                                  onChange={(e) => setNewpincode(e.target.value)}
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="number"
                                  name="mobileNumber"
                                  onChange={(e) => setNewmobileNumber(e.target.value)}
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <Checkbox onChange={(e) => setDefaultBilling(e.target.checked)} />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <Checkbox onChange={(e) => setDefaultShipping(e.target.checked)} />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <Checkbox onChange={(e) => setDefaultAddress(e.target.checked)} />
                                <br />
                              </SoftBox>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                ) : permissions?.RETAIL_Settings?.WRITE ||
                  permissions?.WMS_Settings?.WRITE ||
                  permissions?.VMS_Settings?.WRITE ? (
                  <SoftBox className="add-customer-file-box">
                    <SoftBox className="add-file-inner-box">
                      <SoftButton
                        variant={buttonStyles.primaryVariant}
                        className="basic-font1 contained-softbutton"
                        onClick={handleNewAddress}
                      >
                        <AddIcon /> Add New Address
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                ) : null}
              </Grid>
            </Grid>
            {showAddAddress || showedit ? null : loader ? (
              <Spinner />
            ) : (
              <Box>
                {allAdresses.map((item) => (
                  <SoftBox key={item.id}>
                    <SoftBox>
                      <SoftBox className="setting-main-cont">
                        <SoftBox className="setting-inner-main-cont1">
                          <SoftBox className="setting-inner-heading-cont">
                            <SoftTypography className="basic-font">Address Information</SoftTypography>
                            {permissions?.RETAIL_Settings?.WRITE ||
                            permissions?.WMS_Settings?.WRITE ||
                            permissions?.VMS_Settings?.WRITE ? (
                              <Box display="flex">
                                <SoftButton onClick={() => handleBasicEdit(item)} className="basic-font1 settingsBtn">
                                  Edit
                                </SoftButton>
                                {allAdresses?.length > 1 && (
                                  <Button onClick={() => handleBasicDelete(item)} className="basic-font1">
                                    Delete
                                  </Button>
                                )}
                              </Box>
                            ) : null}
                          </SoftBox>
                          <SoftBox className="setting-inner-body-cont">
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12}>
                                <SoftBox className="setting-info-cont">
                                  <List className="list-type-op">
                                    <ListItem>Name</ListItem>
                                    <ListItem>Address Line 1</ListItem>
                                    <ListItem>Address Line 2</ListItem>
                                    <ListItem>Country</ListItem>
                                    <ListItem>State</ListItem>
                                    <ListItem>City</ListItem>
                                    <ListItem>Pincode</ListItem>
                                    <ListItem>Mobile Number</ListItem>
                                    <ListItem>Default Billing</ListItem>
                                    <ListItem>Default Shipping</ListItem>
                                    <ListItem>Default Address</ListItem>
                                  </List>
                                </SoftBox>
                              </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12}>
                                <SoftBox className="setting-info-cont1">
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item.name || ''}
                                      name="name"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item?.addressLine1 || ''}
                                      name="addressLine1"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item?.addressLine2 || ''}
                                      name="addressLine2"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item?.country || ''}
                                      name="country"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item?.state || ''}
                                      name="state"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item?.city || ''}
                                      name="city"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="number"
                                      value={item?.pincode || ''}
                                      name="pincode"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="number"
                                      value={item?.mobileNumber || ''}
                                      name="mobileNumber"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    {item?.defaultBilling === true ? (
                                      <Checkbox disabled checked />
                                    ) : (
                                      <Checkbox disabled />
                                    )}
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    {item?.defaultShipping === true ? (
                                      <Checkbox disabled checked />
                                    ) : (
                                      <Checkbox disabled />
                                    )}
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    {item?.defaultAddress === true ? (
                                      <Checkbox disabled checked />
                                    ) : (
                                      <Checkbox disabled />
                                    )}
                                    <br />
                                  </SoftBox>
                                </SoftBox>
                              </Grid>
                            </Grid>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                ))}
              </Box>
            )}

            {showedit && editedItem ? (
              <SoftBox className="setting-main-cont">
                <SoftBox className="setting-inner-main-cont1">
                  <SoftBox className="setting-inner-heading-cont">
                    <SoftTypography className="basic-font">Edit Address</SoftTypography>

                    <SoftBox className="coco-box">
                      {loader ? (
                        <SoftBox margin="auto">
                          <Spinner />
                        </SoftBox>
                      ) : (
                        <SoftBox className="coco-box">
                          <SoftButton
                            variant={buttonStyles.outlinedColor}
                            onClick={() => handleclosebutton()}
                            className="basic-font1 outlined-softbutton"
                          >
                            Cancel
                          </SoftButton>
                          <SoftButton
                            variant={buttonStyles.primaryVariant}
                            onClick={() => handleUpdate(editedItem)}
                            className="basic-font1 contained-softbutton"
                          >
                            Save
                          </SoftButton>
                        </SoftBox>
                      )}
                    </SoftBox>
                  </SoftBox>
                  <SoftBox className="setting-inner-body-cont">
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} xl={12}>
                        <SoftBox className="setting-info-cont">
                          <List className="list-type-op">
                            <ListItem>Name of Address</ListItem>
                            <ListItem>Address Line 1</ListItem>
                            <ListItem>Address Line 2</ListItem>
                            <ListItem>Country</ListItem>
                            <ListItem>State</ListItem>
                            <ListItem>City</ListItem>
                            <ListItem>Pincode</ListItem>
                            <ListItem>Mobile Number</ListItem>
                            <ListItem>Default Billing</ListItem>
                            <ListItem>Default Shipping</ListItem>
                            <ListItem>Default Address</ListItem>
                          </List>
                        </SoftBox>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} xl={12}>
                        <SoftBox className="setting-info-cont1">
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="text"
                              name="name"
                              value={editedItem.name}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="text"
                              name="addressLine1"
                              value={editedItem.addressLine1}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="text"
                              name="addressLine2"
                              value={editedItem.addressLine2}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="text"
                              name="country"
                              value={editedItem.country}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="text"
                              name="state"
                              value={editedItem.state}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="text"
                              name="city"
                              value={editedItem.city}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="number"
                              name="pincode"
                              value={editedItem.pincode}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <SoftInput
                              className="Edit-box-input-hover"
                              type="number"
                              name="mobileNumber"
                              value={editedItem.mobileNumber}
                              onChange={handleInputChange}
                              readOnly={IsreadOnly}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <Checkbox checked={defaultBilling} onChange={(e) => setDefaultBilling(e.target.checked)} />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <Checkbox
                              checked={defaultShipping}
                              onChange={(e) => setDefaultShipping(e.target.checked)}
                            />
                            <br />
                          </SoftBox>
                          <SoftBox className="orgi-softbox-input">
                            <Checkbox checked={defaultAddress} onChange={(e) => setDefaultAddress(e.target.checked)} />
                            <br />
                          </SoftBox>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            ) : null}
          </>
        )}
      </Box>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LocContactDetail;
