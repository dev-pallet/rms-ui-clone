import './setting.css';
import { Grid } from '@mui/material';
import {postCustomerOtherDetails } from '../../../config/Services';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../components/Spinner';

const SettingVendor = (props) => {
  const mappedData = props.target;

  const [loader, setloader] = useState(false);
  const [showedit, setShowedit] = useState(false);
  const [IsreadOnly, setIsreadOnly] = useState(true);
  const [successUr, setSuccessUr] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(mappedData.branchLogo);
  const [newBusinessName, setNewBusinessName] = useState(mappedData.businessName);
  const [newDisplayName, setNewDisplayName] = useState(mappedData.displayName);
  const [newBusinessType, setNewBusinessType] = useState(mappedData.businessType);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState(mappedData.website);
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  useEffect(() => {
    getMappedData();
  }, [mappedData]);

  const getMappedData = () => {
    setSuccessUr(true);
    setOpen(true);
    setloader(false);
    setErrorHandler('Success');
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const onSelectFile = (event) => {
    setImage(event.target.value);
  };
  const inputStyle = {
    fontSize: image ? '14px' : '16px',
  };
  const handleInput = () => {
    setShowedit(true);
    setIsreadOnly(false);

  };
  const handleclosebutton = () => {
    setShowedit(false);
    setIsreadOnly(true);
  };

  const handleSave = () => {
    const payload = {
      logoUrl: image,
      logo:image,
      displayName: newDisplayName,
      name: newBusinessName,
      retailType: newBusinessType,
      website: newWebsiteUrl,
      // gstTreatment: "string",
      retailId: mappedData.retailId,
      updatedBy:uidx,
    };
    postCustomerOtherDetails(payload).then((res) => {
      window.location.reload();
    })
      .catch((err) => {
        setSuccessUr(false);
      });
    setShowedit(false);
    setIsreadOnly(true);
  };

  return (
    <>
      <SoftBox>
        {loader ? (
          <Spinner />
        ) : (
          <>
            <SoftBox>
              <SoftBox>
                <SoftBox className="setting-main-cont">
                  <SoftBox className="setting-inner-main-cont1">
                    <SoftBox className="setting-inner-heading-cont">
                      <SoftTypography className="basic-font">Basic Information</SoftTypography>
                      {/* {showedit ? (
                            <SoftBox className="coco-box">
                              {loader ? (
                                <SoftBox margin="auto">
                                  <Spinner />
                                </SoftBox>
                              ) : (
                                <SoftBox className="coco-box">
                                  <Button
                                      onClick={() => handleSave()}
                                      className="basic-font1"
                                  >
                                    Save
                                  </Button>
                                  <Button onClick={() => handleclosebutton()} className="basic-font1">
                                    Cancel
                                  </Button>
                                </SoftBox>
                              )}
                            </SoftBox>
                          ) : (permissions?.RETAIL_Settings?.WRITE || permissions?.WMS_Settings?.WRITE || permissions?.VMS_Settings?.WRITE
                              ?
                              <Button onClick={() => handleInput()} className="basic-font1">
                                Edit
                              </Button>
                              :null
                          )} */}
                    </SoftBox>
                    <SoftBox className="setting-inner-body-cont">
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12} xl={12}>
                          <SoftBox className="setting-info-cont">
                            <List className="list-type-op">
                              <ListItem>Business Name</ListItem>
                              <ListItem>Display Name</ListItem>
                              <ListItem>Business Type</ListItem>
                              <ListItem>Business Category</ListItem>
                              <ListItem>Website</ListItem>
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
                                value={mappedData?.businessName}
                                name="businessName"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>
                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input"
                                type="text"
                                value={mappedData?.displayName}
                                name="displayName"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>

                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input"
                                type="text"
                                value={mappedData?.businessType}
                                name="businessType"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>

                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input"
                                type="text"
                                value={mappedData?.businessCategory}
                                name="businessCategory"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>

                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input"
                                type="text"
                                value={mappedData ?.website}
                                name="website"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </SoftBox>

                  {mappedData?.primaryContact
                    ?
                    <SoftBox className="setting-inner-main-cont2">
                      <SoftBox className="setting-inner-heading-cont">
                        <SoftTypography className="basic-font">Contact Information</SoftTypography>
                      </SoftBox>
                      <SoftBox className="setting-inner-body-cont">
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont">
                              <List className="list-type-op">
                                <ListItem>Contact Type</ListItem>
                                <ListItem>E-mail</ListItem>
                                <ListItem>Phone</ListItem>
                              </List>
                            </SoftBox>
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12} >
                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input"
                                type="text"
                                value={mappedData?.primaryContact?.type}
                                name="contactType"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>

                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input"
                                type="text"
                                value={mappedData?.primaryContact?.email}
                                name="email"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>

                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input"
                                type="number"
                                value={mappedData?.primaryContact?.phoneNo}
                                name="phoneNo"
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>
                          </Grid>
                                    
                        </Grid>
                      </SoftBox>
                    </SoftBox>
                    :null
                  }
                  { mappedData?.addressList?.length > 0 &&
                    mappedData?.addressList?.map((item) => {
                      return (
                        <SoftBox className="setting-inner-main-cont2">
                          <SoftBox className="setting-inner-heading-cont">
                            <SoftTypography className="basic-font">Address Information</SoftTypography>
                          </SoftBox>
                          <SoftBox className="setting-inner-body-cont">
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12}>
                                <SoftBox className="setting-info-cont">
                                  <List className="list-type-op">
                                    <ListItem>Address Line 1</ListItem>
                                    <ListItem>Address Line 1</ListItem>
                                    <ListItem>City</ListItem>
                                    <ListItem>State</ListItem>
                                    <ListItem>Country</ListItem>
                                    <ListItem>Pincode</ListItem>
                                    <ListItem>Address Type</ListItem>
                                    <ListItem>Type</ListItem>
                                  </List>
                                </SoftBox>
                              </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12} >

                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item.addressLine1}
                                    name="addressLine1"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>

                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item.addressLine2}
                                    name="addressLine2"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>

                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item.city}
                                    name="city"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item.state}
                                    name="state"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>

                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item.country}
                                    name="country"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="number"
                                    value={item.pincode}
                                    name="pincode"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item.addressType}
                                    name="addressType"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item.type}
                                    name="type"
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                              </Grid>
                                    
                            </Grid>
                          </SoftBox>
                        </SoftBox>
                      );
                    })
                  }
                
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </>
        )}
      </SoftBox>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={successUr ? 'success' : 'error'} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingVendor;
