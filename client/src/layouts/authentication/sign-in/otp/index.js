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

import { useState } from "react";

// react-router-dom components
import {useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
// Images
// import curved9 from "assets/images/curved-images/curved9.jpg";
import logo from "assets/images/curved-images/logo.png"
import Footer from "layouts/authentication/components/Footer";
import { sendOtp } from "config/Services";


// style
// import "./forgot-password.css"
function VerifyOtpBasic() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate=useNavigate()
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [disable,setDisable] = useState(true)
  const [otp,setOtp] = useState("")


  //  }
const handleMobile=(e)=>{
  let otp = e.target.value;
  setOtp(e.target.value)
  if(number.length===10){
      setDisable(false)
  }else{
      setDisable(true)
  }
  
}

  const createOtp=()=>{
    //  navigate("/dashboards/evernest")
    const payload = {
      "mobile": mobile
     }
      if(mobile.length === 10){
       sendOtp(payload).then((response) =>{
          setOtp(false)
       })
          
      }
      else{
          alert("error");
      }

  }
  const resetPassword=()=>{
    navigate("/forgot-password")
  }
  return (
    <SoftBox>
    <BasicLayout
      title="Welcome!"
      description="To Origin"
      image={logo}
      sx={{width:"1rem",bgColor:"red"}}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Sign In
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={2}>
        </SoftBox>
        <SoftBox p={3}>
          <SoftBox component="form" role="form">
          <SoftTypography variant="h6" fontSize="14px" fontWeight="bold">Otp</SoftTypography>
            <SoftBox mb={2}>
              <SoftInput type="number" placeholder="Enter mobile number here..." value={mobile} onChange={handleMobile} />
            </SoftBox>
            {/* <SoftBox mb={2}>
              <SoftInput type="password" placeholder="Password" />
            </SoftBox> */}
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
            <SoftBox mt={4} mb={1}>
              <SoftButton className="vendor-add-btn" disable={disable.toString()} variant="gradient" fullWidth onClick={()=>verifyOtp()}>
                Verify Otp
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
        {/* <SoftBox px={3} pb={2}>
          <SoftTypography className="forgot-pass-head">Forgot password?<b className="forgot-password" onClick={()=>resetPassword()}>Click here to reset</b></SoftTypography>
        </SoftBox> */}
      </Card> 
   
    </BasicLayout> 
       <SoftBox>
           <Footer/>
       </SoftBox> 
     </SoftBox> 
  );
}
export default VerifyOtpBasic;
