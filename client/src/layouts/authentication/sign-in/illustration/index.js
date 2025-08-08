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

// import { useEffect, useState } from 'react';

// // react-router-dom components
// import { useNavigate } from 'react-router-dom';

// // @mui material components

// // Soft UI Dashboard PRO React components
// import SoftBox from 'components/SoftBox';
// import SoftButton from 'components/SoftButton';
// import SoftInput from 'components/SoftInput';
// import SoftTypography from 'components/SoftTypography';

// // Authentication layout components
// import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

// // Image
// // import chat from '../../../../assets/gif/splash-screen-video.mp4';

// import { useMediaQuery } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';
// import CircularProgress from '@mui/material/CircularProgress';
// import Snackbar from '@mui/material/Snackbar';
// import palletGif from 'assets/gif/PalletSplashAnimation.gif';
// import EnvConfig from 'config/EnvConfig';
// import { getUserDetails, userVerification } from 'config/Services';
// import * as React from 'react';
// import { useCookies } from 'react-cookie';
// import { getAllUserOrgs, pinMobVerify, pinMobVerifyWithCaptch } from '../../../../config/Services';
// import { useSnackbar } from '../../../../hooks/SnackbarProvider';
// import ReCAPTCHA from 'react-google-recaptcha';
// import Cookies from 'js-cookie';
// import './illustration.css';

// function Illustration() {
//   const envSignupUrl = EnvConfig().signupUrl;
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();
//   const handleSetRememberMe = () => setRememberMe(!rememberMe);
//   const [open, setOpen] = useState(false);
//   const [vertical, setVertical] = useState('bottom');
//   const [horizontal, setHorizontal] = useState('right');
//   const [errorhandler, setErrorHandler] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [disable, setDisable] = useState(true);
//   const [esClr, setrEsClr] = useState('');
//   const [cookies, setCookie] = useCookies(['user']);
//   const [loadingUr, setLoadingUr] = useState(false);
//   const [successUr, setSuccessUr] = useState(false);
//   const [loadingAuth, setLoadingAuth] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const showSnackbar = useSnackbar();
//   const [isDevRelease, setDevRelease] = useState();
//   const isMobileDevice = useMediaQuery(`(max-width: 768px)`);
//   const [pin, setPin] = useState('');
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const [showCaptcha, setShowCaptcha] = useState(false);
//   const [retryPayload, setRetryPayload] = useState(null);
//   const [isLocked, setIsLocked] = useState(false);
//   const [lockUntilTime, setLockUntilTime] = useState(null);
//   const [countdown, setCountdown] = useState('');
//   const [countdownInterval, setCountdownInterval] = useState(null);

//   useEffect(() => {
//     setCookie('isAuth', false, { path: '/' });
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (countdownInterval) {
//         clearInterval(countdownInterval);
//       }
//     };
//   }, [countdownInterval]);

//   const handleMobile = (e) => {
//     let number = e.target.value;
//     setMobile(e.target.value);
//     if (number.length === 10) {
//       setDisable(false);
//     } else {
//       setDisable(true);
//     }
//   };

//   const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//   });

//   const handleCloseAlert = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpen(false);
//   };

//   const createOtp = () => {
//     if (!mobile) return showSnackbar('Please enter mobile number', 'error');
//     const payload = {
//       mobile: mobile,
//     };
//     if (!loadingUr) {
//       setLoadingUr(true);
//       setSuccessUr(false);
//       userVerification(payload)
//         .then((response) => {
//           setLoadingUr(false);
//           setSuccessUr(true);
//           setrEsClr('success');
//           setErrorHandler('Otp sent successfully');
//           setCookie('access_token', response.data.data.at, { path: '/' });
//           localStorage.setItem('access_token', response.data.data.at);
//           sessionStorage.setItem('access_token', response.data.data.at);
//           sessionStorage.setItem('mob_no', mobile);
//           setOpen(true);
//           setTimeout(() => {
//             navigate(`sign-in/otp/${mobile}`);
//           }, 700);
//         })
//         .catch((err) => {
//           setSuccessUr(false);
//           setLoadingUr(false);
//           setrEsClr('error');
//           setErrorHandler(err?.response?.data?.message);
//           setOpen(true);
//         });
//     }
//   };

//   const resetPassword = () => {
//     navigate('/forgot-password');
//   };

//   const keyHandler = (e) => {
//     if (e.key == 'Enter') {
//       e.preventDefault();
//       if (!isMobileDevice) {
//         if (isDevRelease) {
//           handlePinLogin();
//         } else {
//           createOtp();
//         }
//       }
//     }
//   };

//   let access_token = localStorage.getItem('access_token');
//   let refresh_token = localStorage.getItem('refresh_token');
//   let contextType = localStorage.getItem('contextType');

//   useEffect(() => {
//     setVisible(true);
//     if (!loadingAuth && refresh_token) {
//       setLoadingAuth(true);
//       getUserDetails()
//         .then((response) => {
//           setTimeout(() => {
//             setLoadingAuth(false);
//             setVisible(false);
//             navigate(`/dashboards/${contextType}`);
//           }, 2000);
//         })
//         .catch((error) => {
//           setTimeout(() => {
//             setVisible(false);
//             setLoadingAuth(false);
//           }, 2000);
//         });
//     }
//   }, []);

//   const loginChangeHandler = (e) => {
//     const { name } = e.target;
//     if (name === 'pin') {
//       setDevRelease(true);
//     } else {
//       setDevRelease(false);
//       setCaptchaToken(null);
//       setShowCaptcha(false);
//       setRetryPayload(null);
//     }
//   };

//   // Function to start countdown timer
//   const startCountdown = (lockUntilTimestamp) => {
//     setLockUntilTime(lockUntilTimestamp);
//     setIsLocked(true);

//     // Save lock state in cookies (valid for 1 day or until manually removed)
//     Cookies.set('isLocked', 'true', { expires: 1 });
//     Cookies.set('lockUntilTime', lockUntilTimestamp, { expires: 1 });

//     // Clear any existing interval
//     if (countdownInterval) {
//       clearInterval(countdownInterval);
//     }

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const lockTime = new Date(lockUntilTimestamp).getTime();
//       const distance = lockTime - now;

//       if (distance > 0) {
//         const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//         setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
//       } else {
//         // Time expired, unlock the form
//         setIsLocked(false);
//         setLockUntilTime(null);
//         setCountdown('');
//         clearInterval(interval);
//         setCountdownInterval(null);

//         // Clear cookies on unlock
//         Cookies.remove('isLocked');
//         Cookies.remove('lockUntilTime');
//       }
//     }, 1000);

//     setCountdownInterval(interval);
//   };

//   // Function to stop countdown timer
//   const stopCountdown = () => {
//     if (countdownInterval) {
//       clearInterval(countdownInterval);
//       setCountdownInterval(null);
//     }
//     setIsLocked(false);
//     setLockUntilTime(null);
//     setCountdown('');
//   };

//   // Updated PIN Login function with countdown integration
//   const handlePinLogin = async () => {
//     if (!mobile) return showSnackbar('Please enter mobile number', 'error');
//     if (!pin) return showSnackbar('Please enter pin', 'error');
//     if (isLocked) return; // Prevent login if locked

//     const metaData = {
//       os: 'WEB',
//       latitude: '12.9716',
//       longitude: '77.5946',
//       browser: navigator.userAgent,
//       city: 'BENGALURU',
//       country: 'INDIA',
//       postCode: '560001',
//       device: window?.location?.hostname,
//     };
//     const payload = {
//       data: {
//         mobile,
//         primaryPassword: pin,
//         captchaToken: captchaToken || null,
//       },
//       metaData,
//     };

//     setLoadingUr(true);
//     await executePinLogin(payload);
//   };

//   const executePinLogin = async (payload) => {
//     try {
//       const response = await pinMobVerifyWithCaptch(payload);

//       if (response?.data?.status === 'ERROR') {
//         showSnackbar(response?.data?.message, 'error');
//         setLoadingUr(false);
//         return;
//       }

//       // Check if captcha is required in SUCCESS response
//       if (response?.data?.status === 'SUCCESS' && response?.data?.data?.requireCaptcha === true) {
//         setShowCaptcha(true);
//         setRetryPayload(payload);
//         setLoadingUr(false);

//         // Start countdown if lockUntil is present
//         if (response?.data?.data?.lockUntil) {
//           const lockUntil = response?.data?.data?.lockUntil;

//           setIsLocked(true);
//           setLockUntilTime(lockUntil);

//           // Store in cookies
//           Cookies.set('isLocked', 'true', { expires: 1 });
//           Cookies.set('lockUntilTime', lockUntil, { expires: 1 });

//           startCountdown(lockUntil);
//           const lockUntilIST = new Date(response?.data?.data?.lockUntil).toLocaleString('en-IN', {
//             timeZone: 'Asia/Kolkata',
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//           });
//           showSnackbar(`Your account has been locked until ${lockUntilIST}`, 'warning');
//         } else {
//           showSnackbar(response?.data?.data?.message, 'warning');
//         }
//         return;
//       }
//       stopCountdown();

//       const tokens = response?.data?.data?.data;
//       setCookie('access_token', tokens?.at, { path: '/' });
//       setCookie('refresh_token', tokens?.rt, { path: '/' });
//       localStorage.setItem('access_token', tokens?.at);
//       localStorage.setItem('refresh_token', tokens?.rt);

//       const userResponse = await getUserDetails();
//       const user_roles = userResponse?.data?.data?.roles;
//       localStorage.setItem('user_roles', JSON.stringify(user_roles));
//       localStorage.setItem('user_details', JSON.stringify(userResponse?.data?.data));
//       localStorage.setItem(
//         'user_name',
//         userResponse?.data?.data?.firstName + ' ' + userResponse?.data?.data?.secondName,
//       );

//       if (userResponse?.data?.data?.contexts != []) {
//         const orgPayload = {
//           uidx: userResponse?.data?.data?.uidx,
//         };
//         const orgResponse = await getAllUserOrgs(orgPayload);
//         setLoadingUr(false);
//         if (Object.keys(orgResponse?.data?.data).length > 1) {
//           navigate('/AllOrg_loc');
//         } else if (Object.keys(orgResponse?.data?.data).length == 1) {
//           if (orgResponse?.data?.data?.WMS?.length > 1 || orgResponse?.data?.data?.RETAIL?.length > 1) {
//             navigate('/AllOrg_loc');
//           } else if (orgResponse?.data?.data?.WMS?.length == 1 || orgResponse?.data?.data?.RETAIL?.length == 1) {
//             navigate('/AllOrg_loc');
//           }
//         }
//       }
//     } catch (error) {
//       setLoadingUr(false);
//       const msg = error?.response?.data?.message || 'Some Error Occurred';

//       // Show CAPTCHA only for PIN login when requireCaptcha is true in error response
//       if (error?.response?.data?.data?.requireCaptcha === true) {
//         setShowCaptcha(true);
//         setRetryPayload(payload);

//         // Start countdown if lockUntil is present
//         if (error?.response?.data?.data?.lockUntil) {
//           startCountdown(error?.response?.data?.data?.lockUntil);
//           const lockUntilIST = new Date(error?.response?.data?.data?.lockUntil).toLocaleString('en-IN', {
//             timeZone: 'Asia/Kolkata',
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//           });
//           showSnackbar(`Your account has been locked until ${lockUntilIST}`, 'warning');
//         } else {
//           showSnackbar(error?.response?.data?.data?.message, 'warning');
//         }
//       } else {
//         setErrorHandler(msg);
//         showSnackbar(msg, 'error');
//       }
//     }
//   };

//   useEffect(() => {
//     const cookieLocked = Cookies.get('isLocked');
//     const cookieLockUntil = Cookies.get('lockUntilTime');

//     if (cookieLocked === 'true' && cookieLockUntil) {
//       setIsLocked(true);
//       setLockUntilTime(cookieLockUntil);
//       startCountdown(cookieLockUntil);
//     }
//   }, []);

//   const clearLockState = () => {
//     setIsLocked(false);
//     setLockUntilTime(null);
//     setCountdown('');
//     if (countdownInterval) clearInterval(countdownInterval);

//     Cookies.remove('isLocked');
//     Cookies.remove('lockUntilTime');
//   };

//   useEffect(() => {
//     handleCaptchaRetry();
//   }, [captchaToken]);
//   // Updated useEffect with countdown integration
//   const handleCaptchaRetry = async () => {
//     if (captchaToken && retryPayload && !isLocked) {
//       const newPayload = {
//         data: {
//           mobile: retryPayload?.data?.mobile,
//           primaryPassword: pin, // Use latest pin state here
//           captchaToken,
//         },
//         metaData: retryPayload.metaData,
//       };

//       setShowCaptcha(false);
//       setRetryPayload(null);
//       setCaptchaToken(null);
//       setLoadingUr(true);

//       await pinMobVerifyWithCaptch(newPayload)
//         .then((res) => {
//           if (res?.data?.status === 'ERROR') {
//             showSnackbar(res?.data?.message, 'error');
//             setLoadingUr(false);
//             return;
//           }

//           // Check if captcha is still required in SUCCESS response for retry
//           if (res?.data?.status === 'SUCCESS' && res?.data?.data?.requireCaptcha === true) {
//             setShowCaptcha(true);
//             setRetryPayload(newPayload);
//             setLoadingUr(false);

//             // Start countdown if lockUntil is present
//             if (res?.data?.data?.lockUntil) {
//               startCountdown(res?.data?.data?.lockUntil);
//               const lockUntilIST = new Date(res?.data?.data?.lockUntil).toLocaleString('en-IN', {
//                 timeZone: 'Asia/Kolkata',
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit',
//                 hour: '2-digit',
//                 minute: '2-digit',
//               });
//               showSnackbar(`Your account has been locked until ${lockUntilIST}`, 'warning');
//             } else {
//               showSnackbar(res?.data?.data?.message, 'warning');
//             }
//             return;
//           }

//           // If retry is successful, stop any existing countdown
//           stopCountdown();

//           const tokens = res?.data?.data?.data;
//           setCookie('access_token', tokens?.at, { path: '/' });
//           setCookie('refresh_token', tokens?.rt, { path: '/' });
//           localStorage.setItem('access_token', tokens?.at);
//           localStorage.setItem('refresh_token', tokens?.rt);

//           getUserDetails()
//             .then((userRes) => {
//               const user_roles = userRes?.data?.data?.roles;
//               localStorage.setItem('user_roles', JSON.stringify(user_roles));
//               localStorage.setItem('user_details', JSON.stringify(userRes?.data?.data));
//               localStorage.setItem('user_name', userRes?.data?.data?.firstName + ' ' + userRes?.data?.data?.secondName);

//               if (userRes?.data?.data?.contexts != []) {
//                 const payload = {
//                   uidx: userRes?.data?.data?.uidx,
//                 };
//                 getAllUserOrgs(payload).then((orgRes) => {
//                   setLoadingUr(false);
//                   if (Object.keys(orgRes?.data?.data).length > 1) {
//                     navigate('/AllOrg_loc');
//                   } else if (Object.keys(orgRes?.data?.data).length == 1) {
//                     if (orgRes?.data?.data?.WMS?.length > 1 || orgRes?.data?.data?.RETAIL?.length > 1) {
//                       navigate('/AllOrg_loc');
//                     } else if (orgRes?.data?.data?.WMS?.length == 1 || orgRes?.data?.data?.RETAIL?.length == 1) {
//                       navigate('/AllOrg_loc');
//                     }
//                   }
//                 });
//               }
//             })
//             .catch(() => {
//               setLoadingUr(false);
//               showSnackbar(`You do not have authorization to access ${contextType}.`);
//               setCookie('isAuth', false, { path: '/' });
//             });
//         })
//         .catch((error) => {
//           setLoadingUr(false);
//           const msg = error?.response?.data?.message || 'Captcha retry failed. Please try again.';

//           // Check if captcha is still required in error response for retry
//           if (error?.response?.data?.data?.requireCaptcha === true) {
//             setShowCaptcha(true);
//             setRetryPayload(newPayload);

//             // Start countdown if lockUntil is present
//             if (error?.response?.data?.data?.lockUntil) {
//               startCountdown(error?.response?.data?.data?.lockUntil);
//               const lockUntilIST = new Date(error?.response?.data?.data?.lockUntil).toLocaleString('en-IN', {
//                 timeZone: 'Asia/Kolkata',
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit',
//                 hour: '2-digit',
//                 minute: '2-digit',
//               });
//               showSnackbar(`Your account has been locked until ${lockUntilIST}`, 'warning');
//             } else {
//               showSnackbar(error?.response?.data?.data?.message, 'warning');
//             }
//           } else {
//             showSnackbar(msg, 'error');
//           }
//         });
//     }
//   };

//   const handlePin = (e) => {
//     if (e.target.value.length > 4) return;
//     setPin(e.target.value);
//   };

//   return (
//     <SoftBox>
//       {loadingAuth ? (
//         <SoftBox
//           className={
//             visible ? 'message-banner animate pallet-img-gif-background' : 'message-banner pallet-img-gif-background'
//           }
//         >
//           <img className="pallet-img-gif" src={palletGif} alt="loading" />
//         </SoftBox>
//       ) : (
//         <IllustrationLayout
//           title="Sign in"
//           description="Enter your mobile number to sign in"
//           illustration={{
//             title: '"Attention is the new currency"',
//             description:
//               'The more effortless the writing looks, the more effort the writer actually put into the process.',
//           }}
//         >
//           <SoftBox component="form" role="form">
//             <SoftBox mb={2}>
//               <SoftInput
//                 type="number"
//                 placeholder="Mobile number"
//                 size="large"
//                 value={mobile}
//                 onChange={handleMobile}
//                 onKeyPress={(e) => keyHandler(e)}
//                 autoFocus
//                 disabled={isLocked}
//               />
//               {isDevRelease && (
//                 <SoftInput
//                   type="number"
//                   placeholder="Enter Pin"
//                   size="large"
//                   value={pin}
//                   onChange={handlePin}
//                   onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//                   autoFocus
//                   disabled={isLocked}
//                   sx={{
//                     marginTop: '10px !important',
//                   }}
//                 />
//               )}
//             </SoftBox>
//             {isLocked && countdown && (
//               <SoftBox mb={2} textAlign="center">
//                 <SoftTypography variant="body2" color="error" fontWeight="medium">
//                   Account locked. Try again in: {countdown}
//                 </SoftTypography>
//               </SoftBox>
//             )}
//             {showCaptcha && isDevRelease && !isLocked && (
//               <SoftBox mb={2} mt={1} textAlign="center">
//                 <ReCAPTCHA
//                   sitekey={process.env.REACT_APP_SITE_KEY}
//                   onChange={(token) => {
//                     setCaptchaToken(token);
//                   }}
//                 />
//               </SoftBox>
//             )}

//             <SoftBox mb={1}>
//               <SoftButton
//                 className="vendor-add-btn"
//                 size="large"
//                 disabled={loadingUr || isLocked}
//                 onClick={isDevRelease ? handlePinLogin : createOtp}
//                 fullWidth
//               >
//                 {loadingUr ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
//               </SoftButton>
//               <SoftBox className="login-change-btns-div" mt={2}>
//                 <SoftButton
//                   color="info"
//                   variant={`${isDevRelease ? 'contained' : 'outlined'}`}
//                   className="login-change-buttons"
//                   name="pin"
//                   onClick={loginChangeHandler}
//                   disabled={isLocked}
//                 >
//                   Pin Sign In
//                 </SoftButton>
//                 <SoftButton
//                   color="info"
//                   variant={`${!isDevRelease ? 'contained' : 'outlined'}`}
//                   className="login-change-buttons"
//                   name="otp"
//                   onClick={loginChangeHandler}
//                   disabled={isLocked}
//                 >
//                   Otp Sign In
//                 </SoftButton>
//               </SoftBox>
//             </SoftBox>
//             {!isMobileDevice && (
//               <SoftBox mt={3} textAlign="center">
//                 <SoftTypography variant="button" fontWeight="regular">
//                   Not registered yet?{' '}
//                   <SoftTypography variant="button" fontWeight="medium">
//                     <a target="_blank" href={`${envSignupUrl}signup`} signup className="create-acc-btn">
//                       Create an account
//                     </a>
//                   </SoftTypography>
//                 </SoftTypography>
//                 <div className="footer-container">
//                   <SoftTypography className="footer" variant="button" color="text" fontWeight="regular">
//                     © 2023 Pallet. All rights reserved.
//                   </SoftTypography>
//                 </div>
//               </SoftBox>
//             )}
//           </SoftBox>
//         </IllustrationLayout>
//       )}
//       <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
//         <Alert onClose={handleCloseAlert} severity={successUr ? 'success' : 'error'} sx={{ width: '100%' }}>
//           {errorhandler}
//         </Alert>
//       </Snackbar>
//     </SoftBox>
//   );
// }

// export default Illustration;

import { useEffect, useState } from 'react';

// react-router-dom components
import { useNavigate } from 'react-router-dom';

// @mui material components

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';

// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

// Image
// import chat from '../../../../assets/gif/splash-screen-video.mp4';

import { useMediaQuery } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import palletGif from 'assets/gif/PalletSplashAnimation.gif';
import EnvConfig from 'config/EnvConfig';
import { getUserDetails, userVerification } from 'config/Services';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { getAllUserOrgs, pinMobVerify } from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import './illustration.css';

function Illustration() {
  const envSignupUrl = EnvConfig().signupUrl;
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [open, setOpen] = useState(false);
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [errorhandler, setErrorHandler] = useState('');
  const [mobile, setMobile] = useState('');
  const [disable, setDisable] = useState(true);
  const [esClr, setrEsClr] = useState('');
  const [cookies, setCookie] = useCookies(['user']);
  const [loadingUr, setLoadingUr] = useState(false);
  const [successUr, setSuccessUr] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [visible, setVisible] = useState(false);
  const showSnackbar = useSnackbar();
  const [isDevRelease, setDevRelease] = useState();
  const isMobileDevice = useMediaQuery(`(max-width: 768px)`);
  const [pin, setPin] = useState('');

  useEffect(() => {
    setCookie('isAuth', false, { path: '/' });
  }, []);
  //  }

  const handleMobile = (e) => {
    let number = e.target.value;
    setMobile(e.target.value);
    if (number.length === 10) {
      setDisable(false);
    } else {
      setDisable(true);
    }
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
  const createOtp = () => {
    if (!mobile) return showSnackbar('Please enter mobile number', 'error');
    const payload = {
      mobile: mobile,
    };
    if (!loadingUr) {
      setLoadingUr(true);
      setSuccessUr(false);
      userVerification(payload)
        .then((response) => {
          setLoadingUr(false);
          setSuccessUr(true);
          setrEsClr('success');
          setErrorHandler('Otp sent successfully');
          setCookie('access_token', response.data.data.at, { path: '/' });
          localStorage.setItem('access_token', response.data.data.at);
          sessionStorage.setItem('access_token', response.data.data.at);
          sessionStorage.setItem('mob_no', mobile);
          setOpen(true);
          setTimeout(() => {
            navigate(`sign-in/otp/${mobile}`);
          }, 700);
        })
        .catch((err) => {
          setSuccessUr(false);
          setLoadingUr(false);
          setrEsClr('error');
          setErrorHandler(err?.response?.data?.message);
          setOpen(true);
        });
    }
  };
  const resetPassword = () => {
    navigate('/forgot-password');
  };

  const keyHandler = (e) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      if (!isMobileDevice) {
        createOtp();
      }
    }
  };

  let access_token = localStorage.getItem('access_token');
  let refresh_token = localStorage.getItem('refresh_token');
  let contextType = localStorage.getItem('contextType');
  useEffect(() => {
    setVisible(true);
    if (!loadingAuth && refresh_token) {
      setLoadingAuth(true);
      getUserDetails()
        .then((response) => {
          setTimeout(() => {
            setLoadingAuth(false);
            setVisible(false);
            navigate(`/dashboards/${contextType}`);
          }, 2000);
        })
        .catch((error) => {
          setTimeout(() => {
            setVisible(false);
            setLoadingAuth(false);
          }, 2000);
        });
    }
  }, []);

  // useEffect(() => {
  //   setDevRelease(isMobileDevice ? true : false);
  // }, [isMobileDevice]);

  const loginChangeHandler = (e) => {
    const { name } = e.target;
    if (name === 'pin') {
      setDevRelease(true);
    } else {
      setDevRelease(false);
    }
  };
  const handlePinLogin = () => {
    if (!mobile) return showSnackbar('Please enter mobile number', 'error');
    else if (!pin) return showSnackbar('Please enter pin', 'error');

    setLoadingUr(true);
    const payload = {
      mobile: mobile,
      primaryPassword: pin,
    };
    pinMobVerify(payload)
      .then((response) => {
        if (response?.data?.status == 'ERROR') {
          showSnackbar(response?.data?.message, 'error');
          setLoadingUr(false);
          return;
        }
        setCookie('access_token', response?.data?.data?.at, { path: '/' });
        setCookie('refresh_token', response?.data?.data?.rt, { path: '/' });
        localStorage.setItem('access_token', response?.data?.data?.at);
        localStorage.setItem('refresh_token', response?.data?.data?.rt);
        getUserDetails()
          .then((res) => {
            const user_roles = res?.data?.data?.roles;
            localStorage.setItem('user_roles', JSON.stringify(user_roles));
            localStorage.setItem('user_details', JSON.stringify(res?.data?.data));
            localStorage.setItem('user_name', res?.data?.data?.firstName + ' ' + res?.data?.data?.secondName);
            if (res?.data?.data?.contexts != []) {
              const payload = {
                uidx: res?.data?.data?.uidx,
              };
              getAllUserOrgs(payload).then((res) => {
                let at = localStorage.getItem('access_token');
                setLoadingUr(false);
                if (Object.keys(res?.data?.data).length > 1) {
                  navigate('/AllOrg_loc');
                } else if (Object.keys(res.data.data).length == 1) {
                  if (res?.data?.data?.WMS?.length > 1 || res?.data?.data?.RETAIL?.length > 1) {
                    navigate('/AllOrg_loc');
                  } else if (res?.data?.data?.WMS?.length == 1 || res?.data?.data?.RETAIL?.length == 1) {
                    navigate('/AllOrg_loc');
                  }
                }
              });
            }
          })
          .catch((err) => {
            setLoadingUr(false);
            showSnackbar(`You do not have authorization to access ${contextType}. Please go subscribe to access WMS`);
            setCookie('isAuth', false, { path: '/' });
          });
      })
      .catch((error) => {
        setLoadingUr(false);
        showSnackbar(error?.response?.data?.message || 'Some Error Occured', 'error');
      });
  };

  const handlePin = (e) => {
    if (e.target.value.length > 4) return;
    setPin(e.target.value);
  };

  return (
    <SoftBox>
      {loadingAuth ? (
        <SoftBox
          className={
            visible ? 'message-banner animate pallet-img-gif-background' : 'message-banner pallet-img-gif-background'
          }
        >
          <img className="pallet-img-gif" src={palletGif} alt="" />
        </SoftBox>
      ) : (
        <IllustrationLayout
          title="Sign in"
          description="Enter your mobile number to sign in"
          illustration={{
            // image: chat,
            title: '"Attention is the new currency"',
            description:
              'The more effortless the writing looks, the more effort the writer actually put into the process.',
          }}
        >
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <SoftInput
                type="number"
                placeholder="Mobile number"
                size="large"
                value={mobile}
                onChange={handleMobile}
                onKeyPress={(e) => keyHandler(e)}
                autoFocus
              />
              {isDevRelease && (
                <SoftInput
                  type="number"
                  placeholder="Enter Pin"
                  size="large"
                  value={pin}
                  onChange={handlePin}
                  onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                  autoFocus
                  sx={{
                    marginTop: '10px !important',
                  }}
                />
              )}
            </SoftBox>

            <SoftBox mb={1}>
              <SoftButton
                // color="#0562FB"
                className="vendor-add-btn"
                size="large"
                disabled={loadingUr}
                onClick={() => (!isDevRelease ? createOtp() : handlePinLogin())}
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
                ) : isDevRelease ? (
                  'Login'
                ) : (
                  'Send OTP'
                )}
              </SoftButton>
              <SoftBox className="login-change-btns-div" mt={2}>
                <SoftButton
                  color="info"
                  variant={`${isDevRelease ? 'contained' : 'outlined'}`}
                  className="login-change-buttons"
                  name="pin"
                  onClick={loginChangeHandler}
                >
                  Pin Sign In
                </SoftButton>
                <SoftButton
                  color="info"
                  variant={`${!isDevRelease ? 'contained' : 'outlined'}`}
                  className="login-change-buttons"
                  name="opt"
                  onClick={loginChangeHandler}
                >
                  Otp Sign In
                </SoftButton>
              </SoftBox>
            </SoftBox>
            {!isMobileDevice && (
              <SoftBox mt={3} textAlign="center">
                <SoftTypography variant="button" fontWeight="regular">
                  Not registered yet?{' '}
                  <SoftTypography variant="button" fontWeight="medium">
                    <a target="_blank" href={`${envSignupUrl}signup`} signup className="create-acc-btn">
                      Create an account
                    </a>
                  </SoftTypography>
                </SoftTypography>
                <div className="footer-container">
                  <SoftTypography className="footer" variant="button" color="text" fontWeight="regular">
                    © 2023 Pallet. All rights reserved.
                  </SoftTypography>
                </div>
              </SoftBox>
            )}
          </SoftBox>
        </IllustrationLayout>
      )}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={successUr ? 'success' : 'error'} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </SoftBox>
  );
}

export default Illustration;
