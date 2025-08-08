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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import SoftButton from "components/SoftButton"
import "./timeline.css"
// Timeline context
// Custom styles for the TimelineItem
import { timelineItem, timelineItemIcon } from "examples/Timeline/TimelineItem/styles";

function TimelineItem({ color, icon, title,title1, dateTime, description, badges,lastItem }) {
  return (
    <SoftBox position="relative" sx={(theme) => timelineItem(theme, { lastItem })}>
      <SoftBox
        bgColor="white"
        width="1.625rem"
        height="1.625rem"
        borderRadius="50%"
        position="absolute"
        top="3.25%"
        left="2px"
        zIndex={2}
      >
        <Icon sx={(theme) => timelineItemIcon(theme, { color })}>{icon}</Icon>
      </SoftBox>
      <SoftBox ml={5.75} pt={description ? 0.7 : 0.5} lineHeight={0} maxWidth="30rem">
        <SoftTypography variant="button" fontWeight="medium" color="dark">
          {title}
        </SoftTypography><br/>
        {title1 !==undefined ? <SoftTypography variant="button" fontWeight="medium" color="dark">
          {title1}
        </SoftTypography>:null}
        
        <SoftBox mt={0.5}>
          <SoftTypography
            variant="caption"
            fontWeight="medium"
            color="text"
          >
            {dateTime}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1.5}>
          {description ? (
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {description}
            </SoftTypography>
          ) : null}
        </SoftBox>
   {badges===""?null: <SoftBox pb={2}>
          <a className="timelineitem-purchase" sx={(theme) => timelineItemIcon(theme, { color })} href="https://drive.google.com/file/d/1yJKt1CL3bUE8jOt9ye0j6UmSGmzGtjlV/view?usp=share_link" target="_blank" rel="noreferrer">
            {badges}
          </a>
            </SoftBox>}

      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of TimelineItem
TimelineItem.defaultProps = {
  color: "info",
  badges: "",
  lastItem: false,
  description: "",
};

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  title1:PropTypes.string,
  dateTime: PropTypes.string.isRequired,
  description: PropTypes.string,
  badges: PropTypes.string,
  lastItem: PropTypes.bool,
};

export default TimelineItem;
