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

// react-router-dom components
import { useNavigate } from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import { userAccessLoc } from './../../../config/Services';

// Authentication layout components
import BasicLayout from 'layouts/authentication/components/BasicLayout';
// Images
// import curved9 from "assets/images/curved-images/curved9.jpg";
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import Snackbar from '@mui/material/Snackbar';
import logo from 'assets/images/curved-images/logo.png';
import { getUserDetails, userOtpVerification } from 'config/Services';
import Footer from 'layouts/authentication/components/Footer';
import * as React from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

// // style
import '.././sign-in/basic/forgot-password.css';
import { userVerification } from './../../../config/Services';

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

  const verifiedUser = (res, roles) => {
    let status = false;
    for (let i = 0; i < roles.length; i++) {
      if (res.data.data.contexts[roles[i]] != undefined) {
        if (res.data.data.contexts[roles[i]].meta.some((e) => e.type == 'WMS')) {
          status = true;
        }
      }
    }
    return status;
  };

  const verifyOtp = () => {
    //  navigate("/dashboards/evernest")
    const payload = {
      otp: otp,
    };
    if (!loadingUr) {
      setLoadingUr(true);
      setSuccessUr(false);
      userOtpVerification(payload)
        .then((response) => {
          setCookie('access_token', response.data.data.at, { path: '/' });
          setCookie('refresh_token', response.data.data.rt, { path: '/' });
          localStorage.setItem('access_token', response.data.data.at);
          getUserDetails()
            .then((res) => {
              const user_roles = res.data.data.roles;
              localStorage.setItem('user_roles', JSON.stringify(user_roles));
              localStorage.setItem('user_details',JSON.stringify(res.data.data));
              localStorage.setItem("user_name",res.data.data.firstName + " " + res.data.data.secondName)
              if (res.data.contexts != []) {
                localStorage.setItem('orgId', res.data.data.contexts['USER'].meta[0].org_id);
                localStorage.setItem('locId', res.data.data.contexts['USER'].meta[0].contextId);
                const userLocPayload = {
                  "uidx":res.data.data.uidx,
                  "org_id":res.data.data.contexts['USER'].meta[0].org_id,
              }
              userAccessLoc(userLocPayload).then((resp) => {
                  localStorage.setItem('locLen', resp.data.data.length);
                  if (verifiedUser(res, user_roles)) {
                    setLoadingUr(false);
                    setSuccessUr(true);
                    setrEsClr('success');
                    setErrorHandler('Successfully logged in');
                    setOpen(true);
                    setCookie('isAuth', true, { path: '/' });
                    setTimeout(() => {
                      let at = localStorage.getItem('access_token');
                      let locLen = localStorage.getItem('locLen');
                      // if (locLen === '1') {
                        navigate(`/dashboards/evernest/${at}`);
                      // } else {
                      //   navigate('/organization/locations');
                      // }
                    }, 500);
                  }
                });
              }
            })
            .catch((err) => {
              setrEsClr('error');
              setErrorHandler('You do not have authorization to access  WMS. Please go subscribe to access WMS');
              setCookie('isAuth', false, { path: '/' });
              setOpen(true);
              setLoadingUr(false);
              setSuccessUr(false);
            });
        })
        .catch((err) => {
          setrEsClr('error');
          setErrorHandler('Please enter a valid otp');
          setOpen(true);
          setLoadingUr(false);
          setSuccessUr(false);
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
    const payload = {
      mobile: mob_no,
    };
    userVerification(payload).then((response) => {
      setResend(false);
      setTimer(60);
      setErrorHandler(`Otp is resent successfully to +91 ${mob_no}`);
      setrEsClr('success');
      setOpen(true);
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
      <BasicLayout title="Welcome!" description="To Origin" image={logo} sx={{ width: '1rem', bgColor: 'red' }}>
        <Card>
          <SoftBox p={3} mb={1} textAlign="center">
            <SoftTypography variant="h5" fontWeight="medium">
              Sign In
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={2}></SoftBox>
          <SoftBox p={3}>
            <SoftBox component="form" role="form">
              <SoftTypography variant="h6" fontSize="14px" fontWeight="bold">
                Please enter the otp send to +91 {mobile}
              </SoftTypography>
              <SoftBox mb={2}>
                <SoftInput
                  type="number"
                  placeholder="Enter the otp here..."
                  value={otp}
                  onChange={handleOtp}
                  onKeyPress={(e) => keyHandler(e)}
                />
              </SoftBox>
              {resend ? (
                <SoftBox mb={2}>
                  <SoftTypography className="resend-otp-verify" onClick={() => handleResendOtp()}>
                    Resend Otp
                  </SoftTypography>
                </SoftBox>
              ) : (
                <SoftBox mb={2}>
                  <SoftTypography className="resend-otp-verify-timer">Resend in {timer} sec</SoftTypography>
                </SoftBox>
              )}
              {/* {resend?null:<Box  className="checkbox-otp-box">
                        //  <p className="get-text-I">Resend in {timer} sec</p>
                    </Box>}
                    // {resend?<Box  className="checkbox-otp-box" onClick={()=>handleResendOtp()}>
                         <p className="get-text-2">Resend otp</p> */}
              {/* </Box>:null} */}
              {/* <SoftBox display="flex" alignItems="center">
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp;&nbsp;Remember me
              </SoftTypography>
            </SoftBox> */}
              {/* <SoftBox mt={4} mb={1}>
              <SoftButton className="sign-in-button" disable={disable.toString()} variant="gradient" fullWidth onClick={()=>verifyOtp()}>
                Verify Otp
              </SoftButton>
            </SoftBox> */}
              <SoftBox sx={{ position: 'relative' }} mt={2} mb={5}>
                <Button
                  variant="contained"
                  // sx={buttonSx}
                  disabled={loadingUr}
                  onClick={() => verifyOtp()}
                  className="add-customer-pan-verify-i-otp"
                >
                  Verify Otp
                </Button>
                {loadingUr && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: grey[50],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '65px',
                      marginLeft: '-12px',
                    }}
                    // className="add-customer-progress-otp"
                  />
                )}
              </SoftBox>
            </SoftBox>
          </SoftBox>
          {/* <SoftBox px={3} pb={2}>
          <SoftTypography className="forgot-pass-head">Forgot password?<b className="forgot-password" onClick={()=>resetPassword()}>Click here to reset</b></SoftTypography>
        </SoftBox> */}
        </Card>
      </BasicLayout>
      <SoftBox>
        <Footer />
      </SoftBox>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={esClr} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </SoftBox>
  );
}
export default OtpVerify;
