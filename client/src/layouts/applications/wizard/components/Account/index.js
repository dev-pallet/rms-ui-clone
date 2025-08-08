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

import { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
// Soft UI Dashboard PRO React icons
import Settings from "examples/Icons/Settings";
import Cube from "examples/Icons/Cube";
import SpaceShip from "examples/Icons/SpaceShip";
import { getLayoutentities } from "../../../../../config/Services";

function Account() {

  const [building,setBuilding] = useState(false);
  const [entities,setEntities] = useState([]);

  const [productArray,setProductArray] = useState([]);



  const handleSetBuilding = (id) =>{
      setProductArray([...productArray, id])
      
}

  const customButtonStyles = ({
    functions: { pxToRem, rgba },
    borders: { borderWidth },
    palette: { transparent, dark, secondary },
  }) => ({
    width: pxToRem(150),
    height: pxToRem(120),
    borderWidth: borderWidth[2],
    mb: 1,
    ml: 0.5,

    "&.MuiButton-contained, &.MuiButton-contained:hover": {
      boxShadow: "none",
      border: `${borderWidth[2]} solid ${transparent.main}`,
    },

    "&:hover": {
      backgroundColor: `${transparent.main} !important`,
      border: `${borderWidth[2]} solid ${secondary.main} !important`,

      "& svg g": {
        fill: rgba(dark.main, 0.75),
      },
    },
  });

 useEffect(()=>{
  getLayoutentities().then((res)=>{
    setEntities(res.data);
  })
 },[])


  
 

  return (
    <SoftBox>
      <SoftBox width="80%" textAlign="center" mx="auto" mb={4}>
        
        <SoftTypography variant="body2" fontWeight="regular" color="text">
            Select Your Layout
        </SoftTypography>
      </SoftBox>
      <SoftBox mt={2}>
        <Grid container spacing={3} justifyContent="center">

        {/* multiple-box-slector */}
          {entities.map((e)=>{
            return (
              <Grid item xs={12} sm={3}>
              <SoftBox textAlign="center" key={e.id} > 
                <SoftButton
                  color="secondary"
                  variant={building ? "contained" : "outlined"}
                  onClick={()=>handleSetBuilding(e.id)}
                  id={e.id}
                  sx={customButtonStyles}
                >
                <SoftTypography variant="h6">{e.name}</SoftTypography>

                </SoftButton>
              </SoftBox>
            </Grid>
            )
          })}
         

        </Grid>
      </SoftBox>
    </SoftBox>
  );
}

export default Account;
