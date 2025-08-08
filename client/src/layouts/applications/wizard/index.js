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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Wizard page components
import About from "layouts/applications/wizard/components/About";
import Account from "layouts/applications/wizard/components/Account";
import Address from "layouts/applications/wizard/components/Address";
import {useNavigate} from "react-router-dom";

function getSteps() {
  return ["Layout", "Components", "Hierarchy"];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return <About />;
    case 1:
      return <Account />;
    case 2:
      return <Address />;
    default:
      return null;
  }
}

function Wizard() {
  const navigate = useNavigate();

  const handlelayout = () =>{
    navigate("/setting/layout")
  }

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={3} pb={8}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            

            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Card>
              <SoftBox p={2}>
                <SoftBox>
                  {getStepContent(activeStep)}
                  <SoftBox mt={3} width="100%" display="flex" justifyContent="space-between">
                    {activeStep === 0 ? (
                      <SoftBox />
                    ) : (
                      <SoftButton variant="gradient" color="light" onClick={handleBack}>
                        back
                      </SoftButton>
                    )}

                    <SoftButton variant="gradient" color="dark" onClick={!isLastStep ? handleNext : undefined}>
                      {isLastStep ? 
                                  <SoftBox onClick={handlelayout} sx={{color:"#fff"}}>Save</SoftBox> :
                                  <SoftBox sx={{color:"#fff"}}>Next</SoftBox>}
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Wizard;
