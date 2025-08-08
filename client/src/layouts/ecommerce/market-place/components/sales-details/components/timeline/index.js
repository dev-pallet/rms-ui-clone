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
import PropTypes from 'prop-types';

// @mui material components
import Icon from '@mui/material/Icon';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Soft UI Dashboard PRO React example components

// Data
// import timelineData from "layouts/pages/projects/timeline/data/timelineData";
import { convertUtcToAsiaKolkata } from '../../../../../UTC-TimeChange';
import { timelineItem, timelineItemIcon } from '../../../../../../../examples/Timeline/TimelineItem/styles';
import { useState } from 'react';
import SoftTypography from '../../../../../../../components/SoftTypography';

const Timeline = ({ fulfilmentStatus, updateAt, updatedBy, color, icon }) => {
  const [loader, setLoader] = useState(false);
  const logType = 'Status';
  const updatedTime = new Date(updateAt).toLocaleString();

  return (
    <SoftBox position="relative" sx={(theme) => timelineItem(theme, { logType })}>
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

      <SoftBox ml={5.75} lineHeight={0} maxWidth="30rem">
        <SoftTypography variant="button" fontWeight="medium" color="dark">
          {logType} {'-'} {fulfilmentStatus}
        </SoftTypography>
        <br />
        <SoftBox mt={0.5}>
          <SoftTypography variant="caption" fontWeight="medium" color="text">
            {convertUtcToAsiaKolkata(updatedTime)}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1.5}>
          {fulfilmentStatus ? (
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {fulfilmentStatus} {'by'} {updatedBy}
            </SoftTypography>
          ) : null}
        </SoftBox>

      </SoftBox>
    </SoftBox>
  );
};

// Setting default values for the props of Timeline
Timeline.defaultProps = {
  color: 'info',
  badges: '',
};

// Typechecking props for the Timeline
Timeline.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark', 'light']),
  updatedAt: PropTypes.string.isRequired,
  updatedBy: PropTypes.string,
  fulfilmentStatus: PropTypes.string,
};

export default Timeline;
