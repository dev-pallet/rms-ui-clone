import { Autocomplete, Box, Checkbox, Grid, List, ListItem, TextField } from '@mui/material';
import { buttonStyles } from '../../../Common/buttonColor';
import { city as cityList } from '../../../softselect-Data/city';
import { countries } from '../../../new-location/components/countrydetails';
import {
  deleteRetailAddress,
  getAllRetailAddress,
  saveRetailNewAddress,
  updateRetailAddress,
} from '../../../../../config/Services';
import { states } from '../../../new-location/components/statedetails';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import Swal from 'sweetalert2';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';
import { noDatagif } from '../../../Common/CommonFunction';

const OrgAddressInfo = ({ handleTab }) => {
  sideNavUpdate();
  const showSnackbar = useSnackbar();
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const orgId = localStorage.getItem('orgId');
  const [loader, setLoader] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [msg, setMsg] = useState('');
  const [showedit, setShowedit] = useState(false);
  const [allAdresses, setAllAddress] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [isreadOnly, setIsreadOnly] = useState(true);

  const [newaddressLine1, setNewaddressLine1] = useState('');
  const [newaddressLine2, setNewaddressLine2] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newstate, setNewstate] = useState('');
  const [newcity, setNewcity] = useState('');
  const [newpincode, setNewpincode] = useState('');
  const [newpmobileNumber, setNewmobileNumber] = useState('');
  const [newaddressName, setNewaddressName] = useState('');
  const [cities, setCities] = useState([]);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    setLoader(true);
    retailAddress();
  }, []);

  useEffect(() => {
    const tabChangeFromSku = localStorage.getItem('add-vendor-product-portfolio');
    if (tabChangeFromSku) {
      handleTab(1);
    }
  }, []);

  const retailAddress = () => {
    getAllRetailAddress(orgId)
      .then((res) => {
        const newArray = res?.data?.data?.addresses.filter((item) => item.entityId === orgId);
        setAllAddress(newArray);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleNewAddress = () => {
    if (msg === 'Branch Not Found') {
      setNotFound(true);
    } else {
      setShowAddAddress(true);
    }
  };

  const handleBasicEdit = (item) => {
    setShowedit(true);
    setIsreadOnly(false);
    setEditedItem(item);
    setDefaultBilling(item.defaultBilling);
    setDefaultShipping(item.defaultShipping);
    setDefaultAddress(item.defaultAddress);
  };

  const handleBasicDelete = (item) => {
    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: 'button button-success',
        cancelButton: 'button button-error',
      },
      buttonsStyling: false,
    });
    newSwal
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          setLoader(true);
          const payload = {
            addressId: item.id,
            updatedBy: uidx,
          };
          deleteRetailAddress(payload)
            .then((res) => {
              showSnackbar('Deleted Successfully', 'success');
              retailAddress();
            })
            .catch((err) => {
              setLoader(false);
              Swal.fire({
                icon: 'error',
                title: 'Unable to delete address',
                showConfirmButton: true,
                confirmButtonText: 'OK',
              });
            });
        }
      });
  };

  const handleSaveAddress = () => {
    const payload = {
      entityId: orgId,
      entityType: 'RETAIL',
      addressLine1: newaddressLine1,
      addressLine2: newaddressLine2,
      country: newCountry,
      state: newstate,
      city: newcity,
      pincode: newpincode,
      latitude: latitude,
      longitude: longitude,
      defaultShipping: defaultShipping,
      defaultBilling: defaultBilling,
      defaultAddress: defaultAddress,
      createdBy: uidx,
      name: newaddressName,
      mobileNumber: newpmobileNumber,
    };
    if (newaddressName == '') {
      showSnackbar('Enter name', 'warning');
    } else if (newaddressLine1 == '') {
      showSnackbar('Enter Address', 'warning');
    } else if (newCountry == '') {
      showSnackbar('Enter Country', 'warning');
    } else if (newstate == '') {
      showSnackbar('Enter State', 'warning');
    } else if (newcity == '') {
      showSnackbar('Enter City', 'warning');
    } else if (newpincode == '') {
      showSnackbar('Enter pincode', 'warning');
    } else if (newpincode.length !== 6) {
      showSnackbar('Pincode should be of 6 digits', 'warning');
    } else if (newpmobileNumber == '') {
      showSnackbar('Enter mobile number', 'warning');
    } else if (newpmobileNumber.length !== 10) {
      showSnackbar('Mobile Number should be of 10 digits', 'warning');
    } else {
      setLoader(true);
      saveRetailNewAddress(payload)
        .then((res) => {
          if (res.data.data.message === 'ENTER_UNIQUE_ADDRESS_NAME') {
            showSnackbar('ENTER UNIQUE ADDRESS NAME', 'error');
          } else {
            setNewCountry('');
            setNewstate('');
            setNewcity('');
            handlecloseAddress();
            retailAddress();
            showSnackbar('Address added Successfully', 'success');
          }
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handlecloseAddress = () => {
    setShowAddAddress(false);
    setDefaultAddress(false);
    setDefaultShipping(false);
    setDefaultBilling(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value,
    });
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
      latitude: item.latitude,
      longitude: item.longitude,
      defaultShipping: defaultShipping,
      defaultBilling: defaultBilling,
      defaultAddress: defaultAddress,
      mobileNumber: item?.mobileNumber,
      updatedBy: uidx,
    };
    if (payload?.pincode?.length !== 6) {
      showSnackbar('Pincode should be of 6 digits', 'warning');
    } else if (payload?.mobileNumber?.length !== 10) {
      showSnackbar('Mobile Number should be of 10 digits', 'warning');
    } else {
      setLoader(true);
      updateRetailAddress(payload)
        .then((res) => {
          setLoader(false);
          if (res.data.data.message == 'ENTER_UNIQUE_ADDRESS_NAME') {
            showSnackbar('ENTER UNIQUE ADDRESS NAME', 'error');
          }
          if (res.data.data.message == 'ADDRESS_NOT_FOUND') {
            showSnackbar('ADDRESS NOT FOUND', 'error');
          } else if (res.data.data.message == 'Success') {
            handleclosebutton();
            retailAddress();
            showSnackbar('Updated Successfully', 'success');
          }
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handleclosebutton = () => {
    setShowedit(false);
    setDefaultAddress(false);
    setDefaultShipping(false);
    setDefaultBilling(false);
  };

  return (
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
                              <ListItem>Latitude</ListItem>
                              <ListItem>Longitude</ListItem>
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
                                name="latitude"
                                onChange={(e) => setLatitude(e.target.value)}
                              />
                              <br />
                              <div className="req">{'  '}*</div>
                            </SoftBox>
                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input-hover"
                                type="number"
                                name="longitude"
                                onChange={(e) => setLongitude(e.target.value)}
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
                                <SoftButton onClick={() => handleBasicDelete(item)} className="basic-font1 settingsBtn">
                                  Delete
                                </SoftButton>
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
                                  <ListItem>Latitude</ListItem>
                                  <ListItem>Longitude</ListItem>
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
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item?.addressLine1 || ''}
                                    name="addressLine1"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item?.addressLine2 || ''}
                                    name="addressLine2"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item?.country || ''}
                                    name="country"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item?.state || ''}
                                    name="state"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item?.city || ''}
                                    name="city"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="number"
                                    value={item?.pincode || ''}
                                    name="pincode"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="number"
                                    value={item?.latitude || ''}
                                    name="pincode"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="number"
                                    value={item?.longitude || ''}
                                    name="pincode"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="number"
                                    value={item?.mobileNumber || ''}
                                    name="mobileNumber"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <Checkbox disabled checked={item?.defaultBilling} />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <Checkbox disabled checked={item?.defaultShipping} />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <Checkbox disabled checked={item?.defaultAddress} />
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
                          <ListItem>Latitude</ListItem>
                          <ListItem>Longitude</ListItem>
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
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
                          />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput
                            className="Edit-box-input-hover"
                            type="number"
                            name="latitude"
                            value={editedItem?.latitude}
                            onChange={handleInputChange}
                            readOnly={isreadOnly}
                          />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput
                            className="Edit-box-input-hover"
                            type="number"
                            name="longitude"
                            value={editedItem?.longitude}
                            onChange={handleInputChange}
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
                          />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <Checkbox checked={defaultBilling} onChange={(e) => setDefaultBilling(e.target.checked)} />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <Checkbox checked={defaultShipping} onChange={(e) => setDefaultShipping(e.target.checked)} />
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
  );
};

export default OrgAddressInfo;
