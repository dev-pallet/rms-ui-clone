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

// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

function ProfileInfoCard({outstanding_payables,unused_credit,payment_due, action }) {

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" px={2}> 
        <SoftBox display="flex">
          <SoftBox sx={{borderRight:"1px solid"}} pr={2} mr={2}>
          <SoftTypography sx={{fontSize:"30px", fontWeight:"400"}}>Outstanding Payables</SoftTypography>
          <SoftTypography sx={{color:"rgb(235,168,90)", fontSize:"25px"}}>₹ {outstanding_payables}</SoftTypography>
          </SoftBox>
        <SoftBox>
        <SoftBox display="flex">
          <SoftTypography>Unused Credit :</SoftTypography>
          <SoftTypography>₹ {unused_credit}</SoftTypography>
          </SoftBox>
        <SoftBox display="flex">
        <SoftTypography>Payment Due Period :</SoftTypography>
          <SoftTypography>₹ {payment_due}</SoftTypography>
        </SoftBox>
      </SoftBox>
      </SoftBox>
        <SoftTypography component={Link} to={action.route} variant="body2" color="secondary" p={2}>
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </SoftTypography>
      
      </SoftBox>
     
    </Card>
  );
}

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  outstanding_payables: PropTypes.string.isRequired,
  unused_credit:PropTypes.string.isRequired,
  payment_due:PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileInfoCard;