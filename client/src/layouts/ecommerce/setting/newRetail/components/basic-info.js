import { Box, Grid, List, ListItem } from '@mui/material';
import { buttonStyles } from '../../../Common/buttonColor';
import { getCustomerDetails, postCustomerOtherDetails, uploadRetailLogo } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';
import { noDatagif } from '../../../Common/CommonFunction';

const OrgBasicInfo = ({ handleTab }) => {
  sideNavUpdate();
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showedit, setShowedit] = useState(false);
  const [showImgedit, setShowImgedit] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [isreadOnly, setIsreadOnly] = useState(true);
  const [image, setImage] = useState(data?.logoUrl);
  const [newBusinessName, setNewBusinessName] = useState(data?.customerName);
  const [newDisplayName, setNewDisplayName] = useState(data?.displayName);
  const [newBusinessType, setNewBusinessType] = useState(data?.businessType);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState(data?.website);
  const [fssaiNumber, setNewfssaiNumber] = useState(data?.fssaiNumber || null);
  const [previewImg, setPreviewImg] = useState('');

  useEffect(() => {
    setLoader(true);
    getRetailDetails();
  }, []);

  useEffect(() => {
    const tabChangeFromSku = localStorage.getItem('add-vendor-product-portfolio');
    if (tabChangeFromSku) {
      handleTab(1);
    }
  }, []);

  const getRetailDetails = () => {
    getCustomerDetails(orgId)
      .then((res) => {
        setData(res?.data?.data?.retail);
        setLoader(false);
        setImageLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setImageLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleBasicEdit = () => {
    setShowedit(true);
    setIsreadOnly(false);
  };
  const handleImageEdit = () => {
    setShowImgedit(true);
  };
  const handlecloseImg = () => {
    setShowImgedit(false);
    setPreviewImg('');
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setImage(imageFile);
    const imageUrl = URL.createObjectURL(imageFile);
    setPreviewImg(imageUrl);
  };

  const handleSaveImage = () => {
    if (previewImg !== '') {
      const formData = new FormData();
      formData.append('file', image);
      let logoUrl = '';
      uploadRetailLogo(formData).then((response) => {
        logoUrl = response.data.data.fileUrl;
        const payload = {
          logoUrl: logoUrl,
          logo: logoUrl,
          displayName: data?.displayName,
          retailType: data?.retailType,
          website: data?.website,
          retailId: data?.retailId,
          updatedBy: uidx,
          fssaiNumber: data?.fssaiNumber,
        };
        if (fssaiNumber !== null && fssaiNumber?.length !== 14) {
          showSnackbar('FSSAI Number should be of 14 digits', 'error');
        } else {
          postCustomerOtherDetails(payload)
            .then((res) => {
              setImageLoader(true);
              getRetailDetails();
              handlecloseImg();
              window.location.reload();
            })
            .catch((err) => {
              setImageLoader(false);
              showSnackbar(err?.response?.data?.meesage || 'Some error occured', 'error');
            });
        }
      });
    } else {
      handlecloseImg();
    }
  };

  const handleSave = () => {
    const payload = {
      logoUrl: image,
      logo: image,
      displayName: newDisplayName,
      businessType: newBusinessType,
      website: newWebsiteUrl,
      retailId: data?.retailId,
      updatedBy: uidx,
      fssaiNumber: fssaiNumber,
      // name: newBusinessName,
    };
    if (fssaiNumber !== null && fssaiNumber?.length !== 14) {
      showSnackbar('FSSAI Number should be of 14 digits', 'error');
    } else {
      postCustomerOtherDetails(payload)
        .then((res) => {
          setLoader(true);
          getRetailDetails();
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.meesage || 'Some error occured', 'error');
        });
      setShowedit(false);
      setIsreadOnly(true);
    }
  };

  const handleclosebutton = () => {
    setShowedit(false);
    setIsreadOnly(true);
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
        <SoftBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} xl={12}>
              {showImgedit ? (
                <SoftBox className="add-customer-file-box">
                  <SoftBox className="add-file-inner-box" p={2}>
                    <SoftTypography id="add-customer-file-head">Company logo</SoftTypography>
                    {imageLoader ? (
                      <Spinner size={20} />
                    ) : (
                      <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start">
                        <SoftBox width="15%" display="flex" flexDirection="column" alignItems="center">
                          {previewImg === '' ? (
                            <SoftBox className="profile-box">
                              {data?.logoUrl === null ? null : (
                                <img style={{ marginRight: '1rem' }} src={data?.logo} width="100" height="100" />
                              )}
                            </SoftBox>
                          ) : (
                            <SoftBox className="profile-box">
                              <img style={{ marginRight: '1rem' }} src={previewImg} width="100" height="100" />
                            </SoftBox>
                          )}
                          <SoftBox>
                            <form className="profile-box-up">
                              <input
                                type="file"
                                name="file"
                                id="my-file"
                                className="hidden"
                                accept="image/png ,image/jpeg"
                                onChange={handleImageUpload}
                              />
                              <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                                <SoftTypography className="upload-text-I">
                                  Upload <FileUploadIcon />{' '}
                                </SoftTypography>
                              </label>
                            </form>
                          </SoftBox>
                        </SoftBox>
                        <SoftBox className="coco-box">
                          <SoftBox className="coco-box">
                            <SoftButton
                              variant={buttonStyles.outlinedColor}
                              onClick={() => handlecloseImg()}
                              className="basic-font1 outlined-softbutton"
                            >
                              Cancel
                            </SoftButton>
                            <SoftButton
                              variant={buttonStyles.containedColor}
                              disabled={imageLoader}
                              onClick={() => handleSaveImage()}
                              className="basic-font1 contained-softbutton"
                            >
                              Save
                            </SoftButton>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    )}
                  </SoftBox>
                </SoftBox>
              ) : (
                <>
                  <SoftBox className="add-customer-file-box">
                    <SoftBox className="add-file-inner-box">
                      <SoftTypography id="add-customer-file-head">Company logo</SoftTypography>
                      <SoftBox display="flex" justifyContent="space-between">
                        <SoftBox className="profile-box">
                          {data?.logoUrl === null ? null : (
                            <img style={{ marginRight: '1rem' }} src={data?.logo} width="100" height="100" />
                          )}
                        </SoftBox>
                        <SoftBox>
                          <SoftButton
                            sx={{ textTransform: 'capitalize' }}
                            onClick={() => handleImageEdit()}
                            className="basic-font1 settingsBtn"
                          >
                            Edit
                          </SoftButton>
                        </SoftBox>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </>
              )}
            </Grid>
          </Grid>
          <SoftBox className="setting-main-cont">
            <SoftBox className="setting-inner-main-cont1" p={2}>
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
                        <SoftButton
                          variant={buttonStyles.outlinedColor}
                          onClick={() => handleclosebutton()}
                          className="basic-font1 outlined-softbutton"
                        >
                          Cancel
                        </SoftButton>
                        <SoftButton
                          variant={buttonStyles.containedColor}
                          disabled={loader}
                          onClick={() => handleSave()}
                          className="basic-font1 contained-softbutton"
                        >
                          Save
                        </SoftButton>
                      </SoftBox>
                    )}
                  </SoftBox>
                ) : permissions?.RETAIL_Settings?.WRITE ||
                  permissions?.WMS_Settings?.WRITE ||
                  permissions?.VMS_Settings?.WRITE ? (
                  <SoftButton
                    sx={{ textTransform: 'capitalize' }}
                    onClick={() => handleBasicEdit()}
                    className="basic-font1 settingsBtn"
                  >
                    Edit
                  </SoftButton>
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
                        <ListItem>Retail Type</ListItem>
                        <ListItem>Registration Date</ListItem>
                        <ListItem>PAN</ListItem>
                        <ListItem>Website</ListItem>
                        <ListItem>FSSAI Number</ListItem>
                      </List>
                    </SoftBox>
                  </Grid>
                </Grid>
                {!showedit ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} xl={12}>
                      <SoftBox className="setting-info-cont1">
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.customerName} readOnly />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.displayName} readOnly />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.businessType} readOnly />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.retailType} readOnly />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.created} readOnly />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.panNumber} readOnly />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.website} readOnly />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={data?.fssaiNumber} readOnly />
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
                          <SoftInput className="Edit-box-input" type="text" name="customerName" readOnly />
                          <br />
                        </SoftBox>

                        {/* <SoftBox className="orgi-softbox-input">
                          <SoftInput
                            className="Edit-box-input-hover"
                            type="text"
                            name="displayName"
                            onChange={(e) => setNewBusinessName(e.target.value)}
                            readOnly={isreadOnly}
                          />
                          <br />
                        </SoftBox> */}
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput
                            className="Edit-box-input-hover"
                            type="text"
                            name="displayName"
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            readOnly={isreadOnly}
                          />
                          <br />
                        </SoftBox>

                        <SoftBox className="orgi-softbox-input">
                          <SoftInput
                            className="Edit-box-input-hover"
                            type="text"
                            name="businessType"
                            onChange={(e) => setNewBusinessType(e.target.value)}
                            readOnly={isreadOnly}
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
                            readOnly={isreadOnly}
                          />
                          <br />
                        </SoftBox>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput
                            className="Edit-box-input-hover"
                            type="text"
                            name="fssaiNumber"
                            onChange={(e) => setNewfssaiNumber(e.target.value)}
                            readOnly={isreadOnly}
                          />
                          <br />
                        </SoftBox>
                      </SoftBox>
                    </Grid>
                  </Grid>
                )}
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      )}
    </Box>
  );
};

export default OrgBasicInfo;
