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
import './timeline.css';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
// Timeline context
// Custom styles for the TimelineItem
import { timelineItem, timelineItemIcon } from 'examples/Timeline/TimelineItem/styles';
import { useState} from 'react';
import { vieworderspdf } from '../../../../../../config/Services';
import CircularProgress from '@mui/material/CircularProgress';

function TimelineItem({ logType, status, updatedOn, updatedBy, color, icon, docId }) {

  const [loader, setLoader] = useState(false);
  // const updatedAt = moment(updatedOn).utc().format('MM/DD/YYYY')
  
  const handleSubmitFile = async () => {
    setLoader(true);
    try {
      const response = await vieworderspdf(docId);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
      // window.location.reload(true)
      setLoader(false);
    }
    catch (err) {
      setLoader(false);
    }

  };

  const handleSubmitFilepayment = async () => {
    setLoader(true);
    try {
      const response = await vieworderspdf(docId);
      const blob = await response.blob();
      const link = document.getElementById('a');
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoader(false);
    }
    catch (err) {
      setLoader(false);
    }
  };



  const handleSubmitFileRefund = async() =>{
    setLoader(true);
    try {
      const response = await vieworderspdf(docId);
      const blob = await response.blob();
      const link = document.getElementById('a');
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
      // window.location.reload(true)
      setLoader(false);
    }
    catch (err) {
      setLoader(false);
    }
  };

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
          {logType}{' '}{status.toLowerCase()}
        </SoftTypography><br />
        <SoftBox mt={0.5}>
          <SoftTypography
            variant="caption"
            fontWeight="medium"
            color="text"
          >
            {updatedOn}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1.5}>
          {status ? (
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {status}{' '}{'by'}{' '}{updatedBy}
            </SoftTypography>
          ) : null}
        </SoftBox>
        {docId !== null && status.toLowerCase() === 'created' ? <SoftBox pb={2} onClick={handleSubmitFile} className="timelineitem-purchase-anchor">
          {loader ? <SoftBox className="spin-box-load"><CircularProgress className="spin-to-win" /></SoftBox> : <a id="a" className="down-p" target="_blank" rel="noreferrer">view </a>}
        </SoftBox> : null}

        {status.toLowerCase() === 'successful' ? <SoftBox pb={2} className="timelineitem-purchase-anchor" onClick={handleSubmitFilepayment}>
          {loader ? <SoftBox className="spin-box-load"><CircularProgress className="spin-to-win" /></SoftBox> : <a className="down-p" id="a" target="_blank">View</a>}
        </SoftBox> : null}

        {status.toLowerCase() === 'recorded' ? <SoftBox pb={2} className="timelineitem-purchase-anchor" onClick={handleSubmitFileRefund}>
          {loader ? <SoftBox className="spin-box-load"><CircularProgress className="spin-to-win"/></SoftBox> : <a className="down-p" id="a" target="_blank">View</a>} 
        </SoftBox> : null}

      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of TimelineItem
TimelineItem.defaultProps = {
  color: 'info',
  badges: '',
};

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'dark',
    'light',
  ]),
  logType: PropTypes.string.isRequired,
  updatedOn: PropTypes.string.isRequired,
  updatedBy: PropTypes.string,
  status: PropTypes.string
};

export default TimelineItem;
