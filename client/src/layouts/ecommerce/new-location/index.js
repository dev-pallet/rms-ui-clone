import './new-location.css';
import * as React from 'react';
import { Grid } from '@mui/material';
import { city as cityList } from '../softselect-Data/city';
import { countries } from './components/countrydetails';
import {
  getOrgNameLogo,
  getUserDetails,
  postLocationData,
  updateContext,
  verifyOnlyGst,
} from './../../../config/Services';
import { states } from './components/statedetails';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import TextField from '@mui/material/TextField';
import WestIcon from '@mui/icons-material/West';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

const NewlocationWMS = () => {
  sideNavUpdate();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstIn, setGstIn] = useState('');
  const [adrsType, setAdrsType] = useState('');
  const [userId, setUserId] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [open, setOpen] = useState(false);
  const [errorHandler, setErrorHandler] = useState('');
  const [clrMsg, setClrMsg] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [loader, setloader] = useState(false);
  const [cities, setCities] = useState([]);

  const orgId = localStorage.getItem('orgId');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    getUserDetails().then((response) => {
      setUserId(response.data.data.uidx);
    });
  }, []);

  const AccountType = [
    { label: 'Savings Account', value: 'Savings Account' },
    { label: 'Basic Savings Bank Deposit Account', value: 'Basic Savings Bank Deposit Account' },
    { label: 'Current Account', value: 'Current Account' },
    { label: 'Salary Account', value: 'Salary Account' },
    { label: 'Fixed Deposit Account', value: 'Fixed Deposit Account' },
    { label: 'Recurring Deposit Account', value: 'Recurring Deposit Account' },
  ];

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
        getOrgNameLogo(orgId)
          .then((res2) => {
            compareNames(res1?.data?.data?.lgnm, res2?.data?.data?.orgBusinessName)
              ? (setErrorHandler('Successfully verified!'),
              setClrMsg('success'),
              setOpen(true),
              setloader(false),
              setIsVerified(true))
              : (setErrorHandler('Business names in PAN and GSTIN doesnt match'),
              setClrMsg('error'),
              setOpen(true),
              setloader(false));
          })
          .catch((err) => {
            setErrorHandler('Failed to fetch details from orgId');
            setClrMsg('error');
            setOpen(true);
            setloader(false);
          });
      })
      .catch((err) => {
        setErrorHandler('Failed to fetch details from GSTIN');
        setClrMsg('error');
        setOpen(true);
        setloader(false);
      });
  };
  const postLocation = () => {
    const payload = {
      userId: userId,
      orgId: orgId,
      locationName: name,
      gstin: gstIn,
      addressMap: [
        {
          addressDto: {
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            country: country.label,
            state: state.label,
            city: city.label,
            pincode: pincode,
            addressType: adrsType,
          },
        },
      ],
    };
    const emptyField = Object.values(payload.addressMap[0].addressDto).some((field) => field === '');
    const pincodeField = payload.addressMap[0].addressDto.pincode;
    if (emptyField) {
      setErrorHandler('Please fill in all the fields in the address.');
      setClrMsg('error');
      setOpen(true);
    } else if(pincodeField.length !== 6){
      setErrorHandler('Please enter 6 digit Pincode.');
      setClrMsg('error');
      setOpen(true);
    } else {
      postLocationData(payload).then((response) => {
        const updateLocationContext = {
          uidx: userId,
          type: 'self',
          action: 'add_context',
          payload: {
            roleId: 2,
            type: 'WMS',
            orgId: orgId,
            contextId: response.data.data.object,
          },
        };
        updateContext(updateLocationContext).then((response) => {
          // navigate('/setting/location');
          navigate('/setting-location');
        })
          .catch(() => {
          // navigate('/setting/location');
            navigate('/setting-location');
          });
      });
    }
  };

  const handleGo = () => {
    // navigate('/setting/location');
    navigate('/setting-location');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <SoftBox className="new-locations-box">
        <WestIcon className="west-icon" onClick={handleGo} />
        <SoftTypography className="add-location-text">Add location</SoftTypography>
      </SoftBox>

      <SoftBox className="details-location-cont-box">
        <SoftTypography className="det-text">Details</SoftTypography>
        <SoftTypography className="light-text">
          Give this location a short name to make it easy to identify. You’ll see this name in areas like orders and
          products.
        </SoftTypography>
      </SoftBox>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="location-address-box">
            <SoftTypography className="det-text">Location Name</SoftTypography>
            <SoftInput onChange={(e) => setName(e.target.value)} />
            <input type="checkbox" />
            <span className="light-text-I">
              Fulfill online orders from this location <br />{' '}
              <b className="inventory-text">Inventory at this location is not available for sale online.</b>{' '}
            </span>

            <Grid item xs={12} xl={12}>
              <SoftTypography className="country-text">Email</SoftTypography>
              <SoftInput type="email" onChange={(e) => setEmail(e.target.value)} />
            </Grid>

            <Grid sx={{ width: '100%' }} item xs={12} xl={12}>
              <SoftTypography className="country-text">GSTIN</SoftTypography>
              <div style={{ display: 'flex' }}>
                <SoftInput type="text" onChange={(e) => setGstIn(e.target.value)} />
                <SoftButton
                  className="verify-button"
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
          <SoftTypography className="add-res-text">Address</SoftTypography>
          <SoftBox className="location-address-box">
            <SoftTypography className="country-text">Country/region</SoftTypography>
            <SoftBox>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} xl={12}>
                  <Autocomplete
                    onChange={(event, value) => setCountry(value)}
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
            <SoftTypography className="country-text">Address line 1</SoftTypography>
            <SoftInput type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
            <SoftTypography className="country-text">Address line 2</SoftTypography>
            <SoftInput type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
            <SoftTypography className="country-text">Address Type</SoftTypography>
            <SoftInput type="text" onChange={(e) => setAdrsType(e.target.value)} />
            <SoftBox className="felx-box">
              <SoftBox className="flex-width">
                <SoftTypography className="country-text">State</SoftTypography>
                <Autocomplete
                  onChange={(event, value) => {
                    setState(value);
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
                <SoftTypography className="country-text">City</SoftTypography>
                <Autocomplete
                  onChange={(event, value) => setCity(value)}
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
                <SoftTypography className="country-text">Pincode</SoftTypography>
                <SoftInput type="number" value={pincode} onChange={(e) => setPincode(e.target.value)} />
              </SoftBox>
            </SoftBox>
          </SoftBox>
          <SoftButton className="save-button" disabled={!isVerified ? true : false} onClick={() => postLocation()}>
            Save
          </SoftButton>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={clrMsg} sx={{ width: '100%' }}>
          {errorHandler}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default NewlocationWMS;
