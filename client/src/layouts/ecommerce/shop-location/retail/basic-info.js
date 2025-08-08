import '../shop-location.css';
import { Box, CircularProgress, Grid } from '@mui/material';
import { buttonStyles } from '../../Common/buttonColor';
import { convertUtcToAsiaKolkata } from '../../UTC-TimeChange';
import {
  getCustomerDetails,
  getRetailBranchDetails,
  updateBranchRetail,
  verifyOnlyGst,
} from '../../../../config/Services';
import { useParams } from 'react-router-dom';
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
import sideNavUpdate from 'components/Utility/sidenavupdate';
import { noDatagif } from '../../Common/CommonFunction';

const LocBasicDetail = ({ handleTab }) => {
  sideNavUpdate();

  const { locationId } = useParams();
  const [loader, setloader] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [msg, setMsg] = useState('');
  const [updated, setUpdated] = useState(false);
  const [logoImage, setLogoImage] = useState('');

  const orgId = localStorage.getItem('orgId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [displayName, setDisplayName] = useState(locationData?.displayName);
  const [branchType, setBranchType] = useState(locationData?.branchType);
  const [newstoreType, setNewstoreType] = useState(branchData?.storeType || '');
  const [newcategory, setNewcategory] = useState(branchData?.category || '');
  const [name, setName] = useState('');
  const [newposNos, setNewposNos] = useState(branchData?.posNos || '');
  const [newWorkingDays, setNewWorkingDays] = useState(branchData?.workingDays || '');
  const [newWorkingHours, setNewWorkingHours] = useState(branchData?.workingHours || '');
  const [newInStorePickup, setnewInStorePickup] = useState(branchData?.inStorePickup || '');
  const [delivery, setDelivery] = useState(branchData?.delivery || '');
  const [newDimension, setNewDimension] = useState(branchData?.delivery || '');
  const [newgst, setNewgst] = useState(branchData?.gst || '');
  const [newdescription, setNewdescription] = useState(locationData?.description || '');

  const [opensnack, setOpensnack] = useState(false);
  const [alertmessage, setAlertmessage] = useState('');
  const [timelinerror, setTimelineerror] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [gstLoader, setgstloader] = useState(false);

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
  const [locationData, setlocationData] = useState({});
  const [branchData, setbranchData] = useState({});

  const handleBasicEdit = () => {
    setShowedit(true);
    setIsreadOnly(false);
  };

  const handleclosebutton = () => {
    setShowedit(false);
    setIsreadOnly(true);
  };

  useEffect(() => {
    const tabChangeFromSku = localStorage.getItem('add-vendor-product-portfolio');
    if (tabChangeFromSku) {
      handleTab(1);
    }
  }, []);
  useEffect(() => {
    setloader(true);
    if (locationId) {
      allBranchDetails();
    }
  }, [updated]);

  const allBranchDetails = () => {
    try {
      getRetailBranchDetails(locationId).then((res) => {
        if (res.data.data.message === 'BRANCH_NOT_FOUND') {
          setloader(false);
          setAlertmessage('BRANCH NOT FOUND');
          setTimelineerror('error');
          SetInterval(handleopensnack());
          setNotFound(true);
          setMsg('Branch Not Found');
        } else {
          setlocationData(res.data.data?.branch);
          setbranchData(res.data.data.branch.branchDetails);
          setNewgst(res.data.data.branch.branchDetails.gst);
          setLogoImage(res.data.data?.branch.branchLogo);
          setloader(false);
        }
      });
    } catch (error) {
      allBranchDetails();
    }
  };

  const compareNames = (orgName, businessName) => {
    return orgName === businessName;
  };

  const verifyGstIn = () => {
    setgstloader(true);
    verifyOnlyGst(newgst)
      .then((res1) => {
        getCustomerDetails(orgId)
          .then((res2) => {
            compareNames(res1?.data?.data?.lgnm, res2?.data?.data?.retail?.customerName)
              ? (setAlertmessage('Successfully verified'),
                setTimelineerror('success'),
                SetInterval(handleopensnack()),
                setgstloader(false),
                setIsVerified(true))
              : (setAlertmessage('Business names in PAN and GSTIN doesnt match'),
                setTimelineerror('error'),
                SetInterval(handleopensnack()),
                setgstloader(false));
          })
          .catch((err) => {
            setAlertmessage(err.response.data.message),
              setTimelineerror('error'),
              SetInterval(handleopensnack()),
              setgstloader(false);
          });
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message),
          setTimelineerror('error'),
          SetInterval(handleopensnack()),
          setgstloader(false);
      });
  };

  const handleSave = () => {
    // verifyGstIn()
    const payload = {
      name: !name.length ? null : name,
      branchId: locationId,
      displayName: displayName,
      branchType: branchType,
      description: newdescription,
      dimensions: newDimension,
      storeType: newstoreType,
      category: newcategory,
      posNos: newposNos,
      workingDays: newWorkingDays,
      workingHours: newWorkingHours,
      inStorePickup: newInStorePickup,
      delivery: delivery,
      kycVerified: true,
      updatedBy: uidx,
    };
    if (isVerified) {
      payload.gst = newgst;
    }
    updateBranchRetail(payload).then((res) => {
      setUpdated(true);
      if (!isVerified) {
        setAlertmessage('GSTIN not verified');
        setTimelineerror('warning');
        SetInterval(handleopensnack());
      } else {
        setAlertmessage('Updated Successfully');
        setTimelineerror('success');
        SetInterval(handleopensnack());
      }
    });
    setShowedit(false);
    setIsreadOnly(true);
    // handleTab(1);
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
            <SoftBox>
              <SoftBox>
                {/* <Grid container spacing={3}>
                  <Grid item xs={12} md={12} xl={12}>
                      {showedit ? (
                              <SoftBox className="add-customer-file-box">
                              <SoftBox className="add-file-inner-box">
                                  <SoftTypography id="add-customer-file-head">Company logo</SoftTypography>
                                      <Box display="flex" flexDirection="cloumn" justifyContent="space-between">
                                          <SoftTypography className="upload-text">
                                              Upload your profile pic here <br />{' '}
                                              <b className="only-text"> Only image link is applicable.</b>
                                              <SoftInput type="url" value={image}  id="my-file" className="hidden" onChange={onSelectFile} style={inputStyle}/>
                                          </SoftTypography>
                                          {image &&(
                                                  <SoftBox className="profile-box">
                                                      <img
                                                      style={{ marginRight: '1rem' }}
                                                      src={image ? image : logoImage.branchLogo}
                                                      width="100"
                                                      height="100"
                                                      />
                                                  </SoftBox>
                                              )
                                          }
                                      </Box>
                              </SoftBox>
                              </SoftBox>
                          ) : (
                              <SoftBox className="add-customer-file-box">
                                  <SoftBox className="add-file-inner-box">
                                  <SoftTypography id="add-customer-file-head">Company logo</SoftTypography>
                                  <SoftBox className="profile-box">
                                      {logoImage === ''
                                          ? null
                                          :<img
                                              style={{ marginRight: '1rem' }}
                                              src={logoImage}
                                              width="100"
                                              height="100"
                                          />
                                      }
                                      
                                  </SoftBox>
                                  </SoftBox>
                              </SoftBox>
                          )
                      }
                  </Grid>
                  </Grid> */}
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
                              <SoftButton
                                variant={buttonStyles.outlinedColor}
                                onClick={() => handleclosebutton()}
                                className="basic-font1 outlined-softbutton"
                              >
                                Cancel
                              </SoftButton>
                              <SoftButton
                                variant={buttonStyles.primaryVariant}
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
                              <ListItem>Location Name</ListItem>
                              <ListItem>Display Name</ListItem>
                              <ListItem>GST</ListItem>
                              <ListItem>Branch Type</ListItem>
                              <ListItem>Description</ListItem>
                              <ListItem>Dimension</ListItem>
                              <ListItem>Status</ListItem>
                              <ListItem>Store Type</ListItem>
                              <ListItem>Category</ListItem>
                              <ListItem>POS Number</ListItem>
                              <ListItem>Working Days</ListItem>
                              <ListItem>Working Hours</ListItem>
                              <ListItem>In Store Pickup</ListItem>
                              <ListItem>Delivery</ListItem>
                              <ListItem>Created at</ListItem>
                            </List>
                          </SoftBox>
                        </Grid>
                      </Grid>
                      {showedit ? (
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont1">
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="name"
                                  // value={name == '' || !name.length ? locationData?.name : name}
                                  readOnly={false}
                                  onChange={(e) => setName(e.target.value)}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="displayName"
                                  onChange={(e) => setDisplayName(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="gst"
                                  onChange={(e) => setNewgst(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <SoftButton
                                  className="verify-button"
                                  disabled={!isVerified ? false : true}
                                  onClick={() => verifyGstIn()}
                                >
                                  {gstLoader ? (
                                    <CircularProgress
                                      size={18}
                                      sx={{
                                        color: '#fff',
                                      }}
                                    />
                                  ) : (
                                    <>Verify</>
                                  )}
                                </SoftButton>
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="locationName"
                                  onChange={(e) => setBranchType(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="description"
                                  onChange={(e) => setNewdescription(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="number"
                                  pattern="[0-9*]*"
                                  name="dimenion"
                                  onChange={(e) => setNewDimension(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  name="status"
                                  value={locationData?.branchStatus}
                                  readOnly
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="storeType"
                                  onChange={(e) => setNewstoreType(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="category"
                                  onChange={(e) => setNewcategory(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="number"
                                  name="posNos"
                                  onChange={(e) => setNewposNos(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="number"
                                  name="workingDays"
                                  onChange={(e) => setNewWorkingDays(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="number"
                                  name="workingHours"
                                  onChange={(e) => setNewWorkingHours(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="inStorePickup"
                                  onChange={(e) => setnewInStorePickup(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="delivery"
                                  onChange={(e) => setDelivery(e.target.value)}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={convertUtcToAsiaKolkata(locationData?.created)}
                                  name="createdAt"
                                  readOnly
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
                                  value={locationData?.name}
                                  name="locationName"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={locationData?.displayName}
                                  name="locationName"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.gst || ''}
                                  name="gst"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={locationData?.branchType}
                                  name="locationName"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={locationData?.description || ''}
                                  name="description"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData?.dimensions || ''}
                                  name="dimensions"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={locationData?.branchStatus}
                                  name="branchStatus"
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.storeType || ''}
                                  name="storeType"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.category || ''}
                                  name="category"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.posNos || ''}
                                  name="posNos"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.workingDays || ''}
                                  name="workingDays"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.workingHours || ''}
                                  name="workingHours"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.inStorePickup || ''}
                                  name="inStorePickup"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={branchData.delivery || ''}
                                  name="delivery"
                                  // onChange={handleChange1}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={convertUtcToAsiaKolkata(locationData?.created)}
                                  name="createdAt"
                                  // onChange={handleChange1}
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
                </SoftBox>
              </SoftBox>
            </SoftBox>
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

export default LocBasicDetail;
