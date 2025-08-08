import '../setting.css';
import { Box, Button, Grid } from '@mui/material';
import { postCustomerOtherDetails } from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import OrganisationAddress from './address';
import OrganisationContacts from './contact';
import React, { useEffect, useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../components/Spinner';

const SettingRetail = (props) => {
  const mappedData = props.target;
  const showSnackbar = useSnackbar();

  const [loader, setloader] = useState(false);
  const [showedit, setShowedit] = useState(false);
  const [IsreadOnly, setIsreadOnly] = useState(true);
  const [image, setImage] = useState(mappedData.branchLogo);
  const [newBusinessName, setNewBusinessName] = useState(mappedData.businessName);
  const [newDisplayName, setNewDisplayName] = useState(mappedData.displayName);
  const [newBusinessType, setNewBusinessType] = useState(mappedData.businessType);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState(mappedData.website);
  const [fssaiNumber, setNewfssaiNumber] = useState(mappedData.fssaiNumber);
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  useEffect(() => {}, [mappedData]);

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
    setNewfssaiNumber('');
    // window.location.reload();
    setShowedit(false);
    setIsreadOnly(true);
  };

  const handleSave = () => {
    const payload = {
      logoUrl: image,
      logo: image,
      displayName: newDisplayName,
      retailType: newBusinessType,
      website: newWebsiteUrl,
      // gstTreatment: "string",
      retailId: mappedData.retailId,
      updatedBy: uidx,
      fssaiNumber: fssaiNumber,
    };
    if (fssaiNumber !==  null && fssaiNumber?.length !== 14 ) {
      showSnackbar('FSSAI Number should be of 14 digits', error);
    }else {
      postCustomerOtherDetails(payload)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.meesage,'error');
        });
      setShowedit(false);
      setIsreadOnly(true);
    }
  };

  return (
    <>
      <SoftBox>
        <SoftBox>
          <SoftBox>
            {loader ? (
              <Spinner />
            ) : (
              <> 
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} xl={12}>
                    {showedit ? (
                      <SoftBox className="add-customer-file-box">
                        <SoftBox className="add-file-inner-box">
                          <SoftTypography id="add-customer-file-head">Company logo</SoftTypography>
                          <Box display="flex" flexDirection="cloumn" justifyContent="space-between">
                            <SoftTypography className="upload-text">
                              Upload your profile pic here <br />{' '}
                              <b className="only-text"> Only image link is applicable.</b>
                              <SoftInput
                                type="text"
                                value={image}
                                id="my-file"
                                className="hidden"
                                onChange={onSelectFile}
                                style={inputStyle}
                              />
                            </SoftTypography>
                            {image && (
                              <SoftBox className="profile-box">
                                <img
                                  style={{ marginRight: '1rem' }}
                                  src={image ? image : mappedData.branchLogo}
                                  width="100"
                                  height="100"
                                />
                              </SoftBox>
                            )}
                          </Box>
                        </SoftBox>
                      </SoftBox>
                    ) : (
                      <SoftBox className="add-customer-file-box">
                        <SoftBox className="add-file-inner-box">
                          <SoftTypography id="add-customer-file-head">Company logo</SoftTypography>
                          <SoftBox className="profile-box">
                            {mappedData.branchLogo === null ? null : (
                              <img
                                style={{ marginRight: '1rem' }}
                                src={mappedData.branchLogo}
                                width="100"
                                height="100"
                              />
                            )}
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    )}
                  </Grid>
                </Grid>
                <SoftBox className="setting-main-cont">
                  <SoftBox className="setting-inner-main-cont1">
                    <SoftBox className="setting-inner-heading-cont">
                      <SoftTypography className="basic-font">Basic Information</SoftTypography>
                      {showedit ? (
                        <SoftBox className="coco-box">
                          {loader ? (
                            <SoftBox margin="auto">
                              <Spinner />
                            </SoftBox>
                          ) : (
                            <SoftBox className="coco-box">
                              <Button onClick={() => handleSave()} className="basic-font1">
                                Save
                              </Button>
                              <Button onClick={() => handleclosebutton()} className="basic-font1">
                                Cancel
                              </Button>
                            </SoftBox>
                          )}
                        </SoftBox>
                      ) : permissions?.RETAIL_Settings?.WRITE ||
                        permissions?.WMS_Settings?.WRITE ||
                        permissions?.VMS_Settings?.WRITE ? (
                          <Button onClick={() => handleInput()} className="basic-font1">
                          Edit
                          </Button>
                        ) : null}
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
                              <ListItem>Registration Date</ListItem>
                              <ListItem>PAN</ListItem>
                              <ListItem>Website</ListItem>
                              <ListItem>FSSAI Number</ListItem>
                            </List>
                          </SoftBox>
                        </Grid>
                      </Grid>
                      {showedit ? (
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont1">
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput className="Edit-box-input-hover" type="text" name="businessName" readOnly />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="displayName"
                                  onChange={(e) => setNewDisplayName(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="businessType"
                                  onChange={(e) => setNewBusinessType(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput className="Edit-box-input" type="text" name="businessCategory" readOnly />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput className="Edit-box-input" type="text" name="registrationDate" readOnly />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput className="Edit-box-input" type="text" name="pan" readOnly />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="website"
                                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="fssaiNumber"
                                  onChange={(e) => setNewfssaiNumber(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      ) : (
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
                                  value={mappedData?.registrationDate}
                                  name="registrationDate"
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={mappedData?.pan}
                                  name="pan"
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={mappedData?.website}
                                  name="website"
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={fssaiNumber}
                                  name="fssaiNumber"
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      )}
                    </SoftBox>
                  </SoftBox>

                  <OrganisationContacts
                  />
                  <br />
                  <OrganisationAddress
                  />
                </SoftBox>
              </>
            )}
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </>
  );
};

export default SettingRetail;
