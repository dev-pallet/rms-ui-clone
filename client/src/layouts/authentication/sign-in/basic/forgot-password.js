import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React example components
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "layouts/authentication/components/Footer";
import { useState } from "react";

// Soft UI Dashboard PRO React page layout routes


export const ForgotPassword=()=>{

    const [changebox,setChangebox] = useState(false);

    const handleotp = () =>{
        setChangebox(true);
    }


    return(
        <PageLayout background="light">
       
        <Grid container spacing={3} justifyContent="center" sx={{ minHeight: "75vh" }}>
          <Grid item xs={10} md={6} lg={4}>
            <SoftBox mt={32} mb={3} px={{ xs: 0, lg: 2 }}>
              <Card>
                <SoftBox pt={3} px={3} pb={1} textAlign="center">
                  <SoftTypography variant="h4" fontWeight="bold" textGradient>
                    Reset password
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text">
                    You will receive an e-mail in maximum 60 seconds
                  </SoftTypography>
                </SoftBox>
                <SoftBox p={3}>
                  <SoftBox component="form" role="form">
                    {changebox ?  <SoftBox mb={2}>
                      <SoftInput type="number" placeholder="OTP" />
                    </SoftBox> :<SoftBox mb={2}>
                      <SoftInput type="email" placeholder="Email" />
                    </SoftBox>}
                   
                    <SoftBox mt={5} mb={1}>
                      <SoftButton variant="gradient" color="dark" size="large" fullWidth onClick={handleotp}>
                        send
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Card>
            </SoftBox>
          </Grid>
        </Grid>
        <Footer />
      </PageLayout>
    )
}