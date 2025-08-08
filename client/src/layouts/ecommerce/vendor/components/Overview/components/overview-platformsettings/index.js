/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard PRO React components
import '../other-details/other-details.css';
import * as React from 'react';
import { Button } from '@mui/material';
import { city } from 'layouts/ecommerce/softselect-Data/city';
import { country } from 'layouts/ecommerce/softselect-Data/country';
import { state } from 'layouts/ecommerce/softselect-Data/state';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { vendorInfoEdit } from 'config/Services';
import CancelIcon from '@mui/icons-material/Cancel';
import MuiAlert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput/index';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../../../components/Spinner';

function PlatformSettings({ vendorId, setUpdate, update }) {
  const navigate = useNavigate();
  const vendorData = useSelector((state) => state.vendorBaseDetails);
  const vendorBaseData = vendorData.vendorBaseDetails[0];

  const [loader, setLoader] = useState(false);
  const [editTog, setEditTog] = useState(false);
  const [contName, setContName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState([]);
  const [adrs, setAdrs] = useState('');
  const [countrySel, setCountrySel] = useState('');
  const [stateSel, setStateSel] = useState('');
  const [citySel, setCitySel] = useState('');
  const [cityArr, setCityArr] = useState([]);

  const [open, setOpen] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [esClr, setesClr] = useState('');
  const [vertical, setVertical] = useState('bottom');

  // const [vendorBaseData,setVendorBaseData] = useState([])

  const orgId = localStorage.getItem('orgId');
  // const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');

  // const permissions = JSON.parse(localStorage.getItem('permissions'));

  useEffect(() => {
    if (vendorBaseData !== undefined) {
      setContName(vendorBaseData?.contacts[0]?.contactName);
      setPhoneNum(vendorBaseData?.contacts[0]?.phoneNo);
      setEmail(vendorBaseData?.contacts[0]?.email);
      setAddress(vendorBaseData?.addressList);
      setAdrs(vendorBaseData?.address);
    }
  }, [vendorBaseData]);

  useEffect(() => {
    if (address.length != 0) {
      address.map((e) => {
        if (e.type == 'PRIMARY') {
          setCountrySel({ label: e.country, value: e.country });
          setStateSel({ label: e.state, value: e.state });
          setCitySel({ label: e.city, value: e.state });
          // setAdrs(e.addressLine1+". "+e.addressLine2)
        }
      });
    }
  }, [address]);

  const validatePayload = (payload) => {
    if (payload.phoneNo.length !== 10) {
      setErrorHandler('Please enter phone number and it should be of 10 digits');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    return true;
  };

  const postVendorInfo = () => {
    const payload = {
      contactName: contName,
      email: email,
      phoneNo: phoneNum,
      country: countrySel.label,
      state: stateSel.label,
      city: citySel.label,
      address: adrs,
    };
    // if(!loader){
    //   setLoader(true)

    if (!validatePayload(payload)) {
      return;
    }

    setEditTog(false);
    vendorInfoEdit(payload, vendorId).then((response) => {
      setLoader(false);
      setUpdate(Boolean(!update));
      // }
    });
  };
  const handleCountryChange = (option) => {
    setCountrySel(option);
    setStateSel('');
    setCitySel('');
  };

  const handleStateChange = (option) => {
    setStateSel(option);
    setCitySel('');
    // console.log(option.label)
    const selectedCities = city.filter((item) => item.value === option.label);
    setCityArr(selectedCities);
    // console.log(selectedCities);
  };

  const cancelChanges = () => {
    setEditTog(false);
    setContName(vendorBaseData?.contacts[0]?.contactName);
    setPhoneNum(vendorBaseData?.contacts[0]?.phoneNo);
    setEmail(vendorBaseData?.contacts[0]?.email);
    setCountrySel({ label: vendorBaseData?.addressList[0]?.country, value: vendorBaseData?.addressList[0]?.country });
    setStateSel({ label: vendorBaseData?.addressList[0]?.state, value: vendorBaseData?.addressList[0]?.state });
    setCitySel({ label: vendorBaseData?.addressList[0]?.city, value: vendorBaseData?.addressList[0]?.city });
    setAdrs(vendorBaseData?.address);
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

  return (
    <>
      <Card sx={{ overflow: 'visible' }}>
        <SoftBox pt={1.5} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography fontWeight="bold" fontSize="14px">
            Vendor information
          </SoftTypography>
          {editTog ? (
            <SoftBox display="flex" justifyContent="space-between">
              <SoftBox ml={2}>
                <SaveIcon color="success" className="cursorPointer" onClick={() => postVendorInfo()} />
              </SoftBox>
              <SoftBox>
                <CancelIcon color="error" className="cursorPointer" onClick={() => cancelChanges()} />
              </SoftBox>
            </SoftBox>
          ) : (
            <SoftBox>{/* <ModeEditIcon className="cursorPointer" onClick={() => setEditTog(true)} />{' '} */}</SoftBox>
          )}
        </SoftBox>
        {loader ? (
          <Spinner />
        ) : (
          <SoftBox px={2} lineHeight={1.25}>
            {/* <SoftTypography variant="caption" fontWeight="bold" fontSize="14px">
              Contact details
            </SoftTypography> */}
            <SoftBox mb={0.5}>
              <SoftBox width="50%">
                <SoftTypography variant="caption" fontWeight="bold" color="text">
                  Contact Name
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftInput type="text" value={contName} onChange={(e) => setContName(e.target.value)} />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {contName}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox mb={0.5}>
              <SoftBox width="50%">
                <SoftTypography variant="caption" fontWeight="bold" color="text">
                  Contact number
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftInput type="number" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {phoneNum}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox mb={0.5}>
              <SoftBox width="50%">
                <SoftTypography variant="caption" fontWeight="bold" color="text">
                  Email
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftInput type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </SoftBox>
              ) : (
                <SoftBox overflow="hidden">
                  <SoftTypography variant="button" fontWeight="regular" color="text" textDecoration="underline">
                    {email}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox mb={0.5}>
              <SoftBox width="50%">
                <SoftTypography variant="caption" fontWeight="bold" color="text">
                  Country
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  {/* <SoftInput type="text" value={country} onChange={(e)=>setCountry(e.target.value)}/> */}

                  <SoftSelect
                    style={{ marginRight: '0px' }}
                    value={countrySel}
                    options={country}
                    onChange={(option) => handleCountryChange(option)}
                  />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {countrySel.label}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox mb={0.5}>
              <SoftBox width="50%">
                <SoftTypography variant="caption" fontWeight="bold" color="text">
                  State
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  {/* <SoftInput type="text" value={state} onChange={(e)=>setState(e.target.value)}/> */}
                  <SoftSelect value={stateSel} options={state} onChange={(option) => handleStateChange(option)} />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {stateSel.label}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox mb={0.5}>
              <SoftBox width="50%">
                <SoftTypography variant="caption" fontWeight="bold" color="text">
                  City
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftSelect value={citySel} onChange={(option) => setCitySel(option)} options={cityArr} />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {citySel.label}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox mb={0.5}>
              <SoftBox width="50%">
                <SoftTypography variant="caption" fontWeight="bold" color="text">
                  Address
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftInput type="text" value={adrs} onChange={(e) => setAdrs(e.target.value)} />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {adrs}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox mb={0.5}>
              <Button
                className="vendorCardCount"
                style={{ fontWeight: 'none', textTransform: 'none' }}
                onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(adrs || '')}`, '_blank')}
              >
                View in maps
              </Button>
            </SoftBox>
          </SoftBox>
        )}
      </Card>
      <Snackbar
        open={open}
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
}

export default PlatformSettings;
