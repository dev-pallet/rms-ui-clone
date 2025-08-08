import { useState } from 'react';
// react-router-dom components
import { useNavigate } from 'react-router-dom';
// @mui material components
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';
// Authentication layout components
import BasicLayout from 'layouts/authentication/components/BasicLayout';
// Images
// import curved9 from "assets/images/curved-images/curved9.jpg";
import logo from 'assets/images/curved-images/logo.png';
import Footer from 'layouts/authentication/components/Footer';
import { sendOtp } from 'config/Services';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useCookies } from 'react-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import './basic.css';
import { userVerification, getUserDetails } from 'config/Services';
import { useEffect } from 'react';
import Spinner from 'components/Spinner/index';
import palletGif from 'assets/gif/PalletSplashAnimation.gif';

function Basic() {
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

  const createOtp = () => {
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
          setCookie('access_token', response.data.data.at, { path: '/' });
          localStorage.setItem('access_token', response.data.data.at);
          sessionStorage.setItem('access_token', response.data.data.at);
          sessionStorage.setItem('mob_no', mobile);
          navigate(`sign-in/otp/${mobile}`);
        })
        .catch((err) => {
          setSuccessUr(false);
          setLoadingUr(false);
          setrEsClr('error');
          if (err.response.data.code == 401) {
            setErrorHandler('You are not a registered user.Please go register in tha pallet app');
          } else {
            setErrorHandler('Something went wrong');
          }
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
      createOtp();
    }
  };

  let access_token = localStorage.getItem('access_token');
  useEffect(() => {
    if (!loadingAuth) {
      setLoadingAuth(true);
      getUserDetails()
        .then((response) => {
          const user_roles = response.data.data.roles;
          if (verifiedUser(response, user_roles)) {
            setTimeout(() => {
              setLoadingAuth(false);
              navigate(`/dashboards/evernest/${access_token}`);
            }, 3000);
          }
          setLoadingAuth(false);
        })
        .catch((error) => {
          setTimeout(() => {
            setLoadingAuth(false);
          }, 3000);
        });
    }
  }, []);
  return (
    <SoftBox>
      {loadingAuth ? (
        <SoftBox className="pallet-img-gif-background">
          <img className="pallet-img-gif" src={palletGif} alt="" />
        </SoftBox>
      ) : (
        <>
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
                    Mobile Number
                  </SoftTypography>
                  <SoftBox mb={2}>
                    <SoftInput
                      type="number"
                      placeholder="Enter mobile number here..."
                      value={mobile}
                      onChange={handleMobile}
                      onKeyPress={(e) => keyHandler(e)}
                    />
                  </SoftBox>
                  <SoftBox sx={{ position: 'relative' }} mt={2} mb={5}>
                    <Button
                      variant="contained"
                      // sx={buttonSx}
                      disabled={loadingUr}
                      loading={loadingUr}
                      onClick={() => createOtp()}
                      className="add-customer-pan-verify-i-otp"
                    >
                      {loadingUr ? (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: grey[50],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '43px',
                            marginLeft: '-12px',
                          }}
                          // className="add-customer-progress-otp"
                        />
                      ) : (
                        <>Send Otp</>
                      )}
                    </Button>
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress />
                    </Box>

                    {loadingUr && (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: grey[50],
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '43px',
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
        </>
      )}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={successUr ? 'success' : 'error'} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </SoftBox>
  );
}
export default Basic;
