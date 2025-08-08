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

import { useState } from 'react';

import chat from 'assets/images/illustrations/chat.png';
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

// react-router-dom components
import { useNavigate } from 'react-router-dom';

// @mui material components

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';

// Authentication layout components
// Images
// import curved9 from "assets/images/curved-images/curved9.jpg";
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { getUserDetails, userOtpVerification } from 'config/Services';
import * as React from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

// // style
import { useMediaQuery } from '@mui/material';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import '.././sign-in/basic/forgot-password.css';
import {
  getAllUserOrgs,
  getLocDetailByLongAndLat,
  userVerification
} from './../../../config/Services';

function OtpVerify() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [open, setOpen] = useState(false);
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [errorhandler, setErrorHandler] = useState('');
  const [esClr, setrEsClr] = useState('');
  const [loadingUr, setLoadingUr] = useState(false);
  const [successUr, setSuccessUr] = useState(false);
  const access_token = sessionStorage.getItem('access_token');
  const showSnackbar = useSnackbar()
  const isMobileDevice = useMediaQuery(`(max-width: 768px)`)

  const { mobile } = useParams();

  // const [mobile,setMobile] = useState("")
  const [disable, setDisable] = useState(true);
  const [otp, setOtp] = useState('');
  const [cookies, setCookie] = useCookies(['user']);

  const handleOtp = (e) => {
    let number = e.target.value;
    setOtp(e.target.value);
    if (number.length === 10) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  const [browser, setBrowser] = useState('');
  const [os, setOs] = useState('');
  const [device, setDevice] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    // OS
    const os = navigator.platform;
    setOs(os);

    // BROWSER
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Chrome')) {
      setBrowser('Google Chrome');
    } else if (userAgent.includes('Firefox')) {
      setBrowser('Mozilla Firefox');
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      setBrowser('Apple Safari');
    } else if (userAgent.includes('Edge')) {
      setBrowser('Microsoft Edge');
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      setBrowser('Opera');
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      setBrowser('Internet Explorer');
    } else {
      setBrowser('Other');
    }

    // DEVICE
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent)) {
      setDevice('Mobile');
    } else if (/Windows/i.test(navigator.userAgent)) {
      setDevice('Desktop');
    } else {
      setDevice('tablet');
    }
  }, []);

  useEffect(() => {
    // ADDRESS
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setLatitude(latitude);
      setLongitude(longitude);

      getLocDetailByLongAndLat(latitude, longitude)
        .then((res) => {
          if (res?.data?.address) {
            const city = res?.data?.address?.city || res?.data?.address?.village || res?.data?.address?.town;
            const state = res?.data?.address?.state;
            const country = res?.data?.address?.country;
            const postcode = res?.data?.address?.postcode;
            setCity(city);
            setState(state);
            setCountry(country);
            setPostcode(postcode);
          } else {
            // Handle error
          }
        })
        .catch((err) => {});
    });
  }, []);

  const verifyOtp = () => {
    const payload = {
      data: {
        otp: otp,
      },
      metaData: {
        os: os,
        latitude: latitude,
        browser: browser,
        city: city,
        state: state,
        country: country,
        postCode: postcode,
        longitude: longitude,
        device: device,
      },
    };
    // const payloadV2 = {
    //   otp: otp
    // }
    if (!loadingUr) {
      setLoadingUr(true);
      setSuccessUr(false);
      // userOtpVerification(payload){
      userOtpVerification(payload)
        .then((response) => {
          if (response?.data?.data?.status !== 'ERROR') {
          setCookie('access_token', response.data.data.at, { path: '/' });
          setCookie('refresh_token', response.data.data.rt, { path: '/' });
          localStorage.setItem('access_token', response.data.data.at);
          localStorage.setItem('refresh_token', response.data.data.rt);
            getUserDetails()
              .then((res) => {
                const user_roles = res.data.data.roles;
                localStorage.setItem('user_roles', JSON.stringify(user_roles));
                localStorage.setItem('user_details', JSON.stringify(res.data.data));
                localStorage.setItem('user_name', res.data.data.firstName + ' ' + res.data.data.secondName);
                if (res.data.data.contexts != []) {
                  const payload = {
                    uidx: res.data.data.uidx,
                  };
                  getAllUserOrgs(payload).then((res) => {
                    let at = localStorage.getItem('access_token');
                    if (Object.keys(res.data.data).length > 1) {
                      navigate('/AllOrg_loc');
                    } else if (Object.keys(res.data.data).length == 1) {
                      if (res.data.data.WMS.length > 1 || res.data.data.RETAIL.length > 1) {
                        navigate('/AllOrg_loc');
                      } else if (res.data.data.WMS.length == 1 || res.data.data.RETAIL.length == 1) {
                        navigate('/AllOrg_loc');
                      }
                    }
                  });
                }
              })
              .catch((err) => {
                showSnackbar(err?.response?.data?.message|| err?.message || 'Some error occured','error');
                setLoadingUr(false);
                setCookie('isAuth', false, { path: '/' });
              });
          }else{
            showSnackbar(response?.data?.data?.message || 'Some error occured','error');
            setLoadingUr(false);
          }
        })
        .catch((err) => {
          showSnackbar('Please enter a valid otp','error')
          setLoadingUr(false);
        });
    }
  };

  const [timer, setTimer] = useState(45);
  const [resend, setResend] = useState(false);

  const time = () => setTimer(timer - 1);

  useEffect(() => {
    if (timer <= 0) {
      setResend(true);
      return;
    }
    const id = setInterval(time, 1000);
    return () => clearInterval(id);
  }, [timer]);

  const mob_no = sessionStorage.getItem('mob_no');

  const handleResendOtp = () => {
    setSuccessUr(true);
    const payload = {
      mobile: mob_no,
    };
    userVerification(payload).then((response) => {
      setResend(false);
      setTimer(60);
      setErrorHandler(`Otp is resent successfully to +91 ${mob_no}`);
      setrEsClr('success');
      setOpen(true);
      setLoadingUr(false);
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const resetPassword = () => {
    navigate('/forgot-password');
  };

  const keyHandler = (e) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      verifyOtp();
    }
  };

  return (
    <SoftBox>
      <IllustrationLayout
        title="Sign In"
        description={`Please enter the OTP send to +91 ${mobile}`}
        //   description='Please enter the otp send to +91' + `${mobile}`
        illustration={{
          image: chat,
          title: '"Attention is the new currency"',
          description:
            'The more effortless the writing looks, the more effort the writer actually put into the process.',
        }}
      >
        <SoftBox component="form" role="form">
          <SoftBox mb={2}>
            <SoftInput
              type="number"
              placeholder="Enter OTP"
              size="large"
              value={otp}
              onChange={handleOtp}
              onKeyPress={(e) => keyHandler(e)}
              autoFocus
            />
          </SoftBox>

          {resend ? (
            <SoftBox mb={2}>
              <SoftTypography
                variant="button"
                color="info"
                fontWeight="regular"
                className="resend-otp-verify"
                onClick={() => handleResendOtp()}
              >
                Resend OTP
              </SoftTypography>
            </SoftBox>
          ) : (
            <SoftBox mb={2}>
              <SoftTypography variant="button" color="text" fontWeight="regular" className="resend-otp-verify-timer">
                Resend in {timer} sec
              </SoftTypography>
            </SoftBox>
          )}

          <SoftBox mb={1}>
            <SoftButton
              size="large"
              disabled={loadingUr}
              onClick={() => verifyOtp()}
              color="info"
              // className="add-customer-pan-verify-i-otp"
              fullWidth
            >
              {loadingUr ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: '#fff',
                  }}
                  // className="add-customer-progress-otp"
                />
              ) : (
                <>Verify OTP</>
              )}
            </SoftButton>
          </SoftBox>
          {/* <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up/illustration"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox> */}
          <div className="footer-container">
            <SoftTypography className="footer" variant="button" color="text" fontWeight="regular">
              © 2023 Pallet. All rights reserved.
            </SoftTypography>
          </div>
        </SoftBox>
        {/* <Footer /> */}
      </IllustrationLayout>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={successUr ? 'success' : 'error'} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </SoftBox>
  );
}
export default OtpVerify;
