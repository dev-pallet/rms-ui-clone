import './new-location.css';
import * as React from 'react';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import {
  addBranchAddressRetail,
  createBranchRetail,
  getCustomerDetails,
  getUserDetails,
  updateContext,
  verifyOnlyGst,
} from './../../../config/Services';
import { city as cityList } from '../softselect-Data/city';
import { countries } from './components/countrydetails';
import { states } from './components/statedetails';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MuiAlert from '@mui/material/Alert';
import SetInterval from '../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../components/Spinner';
import TextField from '@mui/material/TextField';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';
import { currencyCountryArray } from '../softselect-Data/currency';

const NewlocationRETAIL = () => {
  sideNavUpdate();
  const navigate = useNavigate();

  const [branchName, setBranchName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [branchLogo, setBranchLogo] = useState('');
  const [country, setCountry] = useState('');
  const [branchId, setBranchID] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gstIn, setGstIn] = useState('');
  const [adrsName, setAdrsName] = useState('');
  const [addressDetail, setAddressDetail] = useState({});
  const [userId, setUserId] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [open, setOpen] = useState(false);
  const [errorHandler, setErrorHandler] = useState('');
  const [clrMsg, setClrMsg] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [loader, setloader] = useState(false);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShippping, setDefaultShipping] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [cities, setCities] = useState([]);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;

  const [saveLoader, setSaveLoader] = useState(false);
  const [opensnack, setOpensnack] = useState(false);
  const [alertmessage, setAlertmessage] = useState('');
  const [timelinerror, setTimelineerror] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    setSaveLoader(false);
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleopensnack = () => {
    setOpensnack(true);
    setSaveLoader(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  useEffect(() => {
    getUserDetails().then((response) => {
      setUserId(response.data.data.uidx);
    });
  }, []);

  const compareNames = (orgName, businessName) => {
    return orgName === businessName;
  };

  const verifyGstIn = () => {
    if (!gstIn) {
      setErrorHandler('Please enter GSTIN');
      setClrMsg('warning');
      setOpen(true);
      return;
    }
    setloader(true);
    verifyOnlyGst(gstIn)
      .then((res1) => {
        getCustomerDetails(orgId)
          .then((res2) => {
            compareNames(res1?.data?.data?.lgnm, res2?.data?.data?.retail?.customerName)
              ? (setAlertmessage('Successfully verified'),
                setTimelineerror('success'),
                SetInterval(handleopensnack()),
                setloader(false),
                setIsVerified(true))
              : (setAlertmessage('Business names in PAN and GSTIN doesnt match'),
                setTimelineerror('error'),
                SetInterval(handleopensnack()),
                setloader(false));
          })
          .catch((err) => {
            setAlertmessage('Failed to fetch details from orgId'),
              setTimelineerror('error'),
              SetInterval(handleopensnack()),
              setloader(false);
          });
      })
      .catch((err) => {
        setAlertmessage('Failed to fetch details from GSTIN'),
          setTimelineerror('error'),
          SetInterval(handleopensnack()),
          setloader(false);
      });
  };

  const addbranch = () => {
    const payload1 = {
      retailId: orgId,
      name: branchName,
      createdBy: uidx,
      displayName: displayName,
      branchLogo: branchLogo,
      gst: gstIn,
    };
    if (branchName === '') {
      setAlertmessage('Please enter Location Name'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (displayName === '') {
      setAlertmessage('Please enter Display Name'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else {
      createBranchRetail(payload1)
        .then((res) => {
          setBranchID(res.data.data.branch.branchId);
          setSaveLoader(false);
          const updateLocationContext = {
            uidx: uidx,
            type: 'self',
            action: 'add_context',
            payload: {
              roleId: 2,
              type: 'RETAIL',
              orgId: orgId,
              contextId: res.data.data.branch.branchId,
            },
          };
          updateContext(updateLocationContext)
            .then((response) => {})
            .catch((err) => {
              if (err.response.data.message) {
                setAlertmessage(err.response.data.message);
              } else {
                setAlertmessage('Some error occured');
              }
              setTimelineerror('error'), SetInterval(handleopensnack()), setSaveLoader(false);
            });
          addAddress(res.data.data.branch.branchId);
        })
        .catch((err) => {
          setSaveLoader(false);
        });
    }
  };

  const addAddress = (id) => {
    const payload2 = {
      entityType: 'BRANCH',
      entityId: branchId === '' ? id : branchId,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      country: country,
      state: state,
      city: city,
      pincode: pincode,
      createdBy: uidx,
      mobileNumber: mobileNumber,
      defaultBilling: defaultBilling,
      defaultShipping: defaultShippping,
      defaultAddress: defaultAddress,
      name: adrsName,
    };
    if (adrsName == '') {
      setAlertmessage('Please enter Name for Address'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (addressLine1 == '') {
      setAlertmessage('Please enter Address'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (country == '') {
      setAlertmessage('Please enter Country Name'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (state == '') {
      setAlertmessage('Please enter State Name'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (city == '') {
      setAlertmessage('Please enter City Name'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (pincode == '') {
      setAlertmessage('Please enter Pincode'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (pincode.length !== 6) {
      setAlertmessage('Please enter 6 digit Pincode'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (mobileNumber == '') {
      setAlertmessage('Please enter Mobile Number'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else if (mobileNumber.length !== 10) {
      setAlertmessage('Please enter 10 digit Mobile Number'),
        setTimelineerror('warning'),
        SetInterval(handleopensnack()),
        setSaveLoader(false);
    } else {
      addBranchAddressRetail(payload2)
        .then((res) => {
          setAddressDetail(res.data.data.address);
          setSaveLoader(false);
          if (res.data.data.message == 'BRANCH_NOT_FOUND') {
            setAlertmessage('BRANCH NOT FOUND'),
              setTimelineerror('error'),
              SetInterval(handleopensnack()),
              setSaveLoader(false);
          } else {
            // navigate('/setting/location');
            navigate('/setting-location');
          }
        })
        .catch((err) => {
          setSaveLoader(false);
        });
    }
  };
  const postLocation = () => {
    setSaveLoader(true);
    if (branchId == '') {
      addbranch();
    } else {
      addAddress();
    }
  };

  const handleCancel = () => {
    if (branchId === '') {
      // navigate('/setting/location');
      navigate('/setting-location');
    } else {
      setAlertmessage('Edit Address Field');
      setTimelineerror('warning');
      SetInterval(handleopensnack());
    }
  };

  const handleGo = () => {
    // navigate('/setting/location');
    navigate('/setting-location');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      {/* <SoftBox className="new-locations-box">
        <WestIcon className="west-icon" onClick={handleGo} />
      </SoftBox> */}

      <SoftBox className="details-location-cont-box">
        <SoftTypography className="det-text">Details</SoftTypography>
        <SoftTypography className="light-text">
          Give this location a short name to make it easy to identify. You’ll see this name in areas like orders and
          products.
        </SoftTypography>
      </SoftBox>

      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox className="location-address-box">
              <SoftTypography className="det-text">Location Name</SoftTypography>
              <SoftInput onChange={(e) => setBranchName(e.target.value)} required />
              <input type="checkbox" />
              <span className="light-text-I">
                Fulfill online orders from this location <br />{' '}
                <b className="inventory-text">Inventory at this location is not available for sale online.</b>{' '}
              </span>

              <Grid item xs={12} xl={12}>
                <SoftTypography className="country-text">Display Name</SoftTypography>
                <SoftInput type="text" onChange={(e) => setDisplayName(e.target.value)} required />
              </Grid>
              <Grid item xs={12} xl={12}>
                <SoftTypography className="country-text">Branch Logo</SoftTypography>
                <SoftInput type="text" onChange={(e) => setBranchLogo(e.target.value)} />
                <span className="inventory-text">Only image link is applicable.</span>
              </Grid>

              <Grid sx={{ width: '100%' }} item xs={12} xl={12}>
                <SoftTypography className="country-text">GSTIN</SoftTypography>
                <div style={{ display: 'flex' }}>
                  <SoftInput type="text" onChange={(e) => setGstIn(e.target.value)} />
                  <SoftButton
                    className="verify-button "
                    disabled={!isVerified ? false : true}
                    onClick={() => verifyGstIn()}
                  >
                    {loader ? (
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
                </div>
              </Grid>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12} xl={12}>
            <SoftTypography className="add-res-text">Address </SoftTypography>
            <SoftBox className="location-address-box">
              <SoftTypography className="country-text">
                Name of address <span className="req2">{'  '}*</span>
              </SoftTypography>
              <SoftInput type="text" value={adrsName} onChange={(e) => setAdrsName(e.target.value)} />
              <SoftTypography className="country-text">
                Address line 1 <span className="req2">{'  '}*</span>
              </SoftTypography>
              <SoftInput type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
              <SoftTypography className="country-text">Address line 2</SoftTypography>
              <SoftInput type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
              <SoftTypography className="country-text">
                Country/region <span className="req2">{'  '}*</span>
              </SoftTypography>
              <SoftBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} xl={12}>
                    <Autocomplete
                      onChange={(event, value) => setCountry(value.label)}
                      disablePortal
                      id="combo-box-demo"
                      options={countries}
                      value={country}
                      freeSolo
                      // sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </SoftBox>
              <SoftBox className="felx-box">
                <SoftBox className="flex-width">
                  <SoftTypography className="country-text">
                    State <span className="req2">{'  '}*</span>
                  </SoftTypography>
                  <Autocomplete
                    onChange={(event, value) => {
                      setState(value.label);
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
                    id="combo-box-demo"
                    options={states}
                    value={state}
                    freeSolo
                    // sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </SoftBox>
                <SoftBox className="flex-width">
                  <SoftTypography className="country-text">
                    City <span className="req2">{'  '}*</span>
                  </SoftTypography>
                  <Autocomplete
                    onChange={(event, value) => setCity(value.label)}
                    disablePortal
                    id="combo-box-demo"
                    options={cities}
                    value={city}
                    freeSolo
                    // sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </SoftBox>
                <SoftBox className="flex-width">
                  <SoftTypography className="country-text">
                    Pincode <span className="req2">{'  '}*</span>
                  </SoftTypography>
                  <SoftInput type="number" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                </SoftBox>
              </SoftBox>
              <SoftTypography className="country-text">
                Mobile Number <span className="req2">{'  '}*</span>
              </SoftTypography>
              <SoftInput type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
              <Box ml={2} mt={2} display="flex" gap="20px">
                <FormControlLabel
                  required
                  control={<Checkbox onChange={(e) => setDefaultBilling(e.target.checked)} />}
                  label="Default Billing"
                />
                <FormControlLabel
                  required
                  control={<Checkbox onChange={(e) => setDefaultShipping(e.target.checked)} />}
                  label="Default Shipping"
                />
                <FormControlLabel
                  required
                  control={<Checkbox onChange={(e) => setDefaultAddress(e.target.checked)} />}
                  label="Default Address"
                />
              </Box>
            </SoftBox>
            <Box className="add-po-btns" mt={2}>
              <SoftButton className="vendor-second-btn" onClick={handleCancel}>
                Cancel
              </SoftButton>
              {saveLoader ? (
                <SoftBox className="save-loader-spin">
                  <Spinner />{' '}
                </SoftBox>
              ) : (
                <SoftButton
                  className="vendor-add-btn"
                  type="submit"
                  // disabled={!isVerified ? true : false}
                  onClick={postLocation}
                  style={{ marginLeft: '10px' }}
                >
                  Save
                </SoftButton>
              )}
            </Box>
            {/* <SoftButton className="save-button" type="submit"
              //   disabled={!isVerified? true:false} 
              onClick={() => postLocation()}>
                  Save
              </SoftButton> */}
          </Grid>

          {/* <Grid item xs={12} md={12} xl={12}>
            <Typography className="add-res-text">Billing Currency</Typography>
            <Box className="location-address-box">
              <Box style={{ gap: '20px', display: 'flex', alignItems: 'flex-start' }}>
                <Box className="flex-width">
                  <Typography className="country-text">
                    Primary Billing Currency <span className="req2">{'  '}*</span>
                  </Typography>
                  <Autocomplete
                    onChange={(event, value) => handlePrimaryBillingChange('currency', value.label)}
                    disablePortal
                    options={currencyCountryArray}
                    value={primaryBilling.currency}
                    freeSolo
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box className="flex-width">
                  <Typography className="country-text">
                    Country <span className="req2">{'  '}*</span>
                  </Typography>
                  <Autocomplete
                    onChange={(event, value) => handlePrimaryBillingChange('country', value.label)}
                    disablePortal
                    options={countries}
                    value={primaryBilling.country}
                    freeSolo
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Box>

              <Box ml={0} mt={2} display="flex" gap="20px">
                <input
                  type="checkbox"
                  value={addAdditionalBilling}
                  onChange={(e) => setAddAdditionalBilling(e.target.checked)}
                />
                <span className="light-text-I">Additional Billing Currency</span>
              </Box>

              {addAdditionalBilling && (
                <>
                  {additionalBillings.map((billing, index) => (
                    <Box
                      key={index}
                      style={{ gap: '20px', display: 'flex', alignItems: 'flex-start', marginTop: '10px' }}
                    >
                      <Box className="flex-width">
                        <Typography className="country-text">
                          Billing Currency <span className="req2">{'  '}*</span>
                        </Typography>
                        <Autocomplete
                          onChange={(event, value) => handleAdditionalBillingChange(index, 'currency', value.label)}
                          disablePortal
                          options={currencyCountryArray}
                          value={billing.currency}
                          freeSolo
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Box>
                      <Box className="flex-width">
                        <Typography className="country-text">
                          Country <span className="req2">{'  '}*</span>
                        </Typography>
                        <Autocomplete
                          onChange={(event, value) => handleAdditionalBillingChange(index, 'country', value.label)}
                          disablePortal
                          options={countries}
                          value={billing.country}
                          freeSolo
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Box>
                      {additionalBillings.length > 1 && (
                        <CloseIcon
                          onClick={() => handleCancel123(index)}
                          style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                        />
                      )}
                    </Box>
                  ))}
                  <Typography type="button" className="products-new-department-addmore-btn-2" onClick={handleAddMore}>
                    + Add more
                  </Typography>
                </>
              )}
            </Box>
          </Grid> */}
        </Grid>
      </form>
      {/* <Box className="add-po-btns" mt={2}>
        <SoftButton className="vendor-second-btn" onClick={handleCancel}>
          Cancel
        </SoftButton>
        {saveLoader ? (
          <SoftBox className="save-loader-spin">
            <Spinner />{' '}
          </SoftBox>
        ) : (
          <SoftButton
            className="vendor-add-btn"
            type="submit"
            // disabled={!isVerified ? true : false}
            onClick={postLocation}
            style={{ marginLeft: '10px' }}
          >
            Save
          </SoftButton>
        )}
      </Box> */}
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default NewlocationRETAIL;
