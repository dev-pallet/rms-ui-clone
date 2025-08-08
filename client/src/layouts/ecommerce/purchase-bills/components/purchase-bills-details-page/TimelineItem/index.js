import './timeline.css';
import Icon from '@mui/material/Icon';
import PropTypes from 'prop-types';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
// Timeline context
// Custom styles for the TimelineItem
import { timelineItem, timelineItemIcon } from 'examples/Timeline/TimelineItem/styles';
import { useState } from 'react';
import { vieworderspdf } from '../../../../../../config/Services';
import CircularProgress from '@mui/material/CircularProgress';

function TimelineItem({ logType, status, updatedOn, updatedBy, color, icon, docId }) {

  const [loader, setLoader] = useState(false);
  const at = localStorage.getItem('access_token');

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
      setLoader(false);
    } catch (err) {
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
    } catch (err) {
      setLoader(false);
    }
  };

  const handleSubmitFileRefund = async () => {
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
      // window.location.reload(true);
    } catch (err) {
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
          {logType} {status.toLowerCase()}
        </SoftTypography>
        <br />
        <SoftBox mt={0.5}>
          <SoftTypography variant="caption" fontWeight="medium" color="text">
            {updatedOn}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1.5}>
          {status ? (
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {status} {'by'} {updatedBy}
            </SoftTypography>
          ) : null}
        </SoftBox>

        {status.toLowerCase() === 'created' && docId !==null ? (
          <SoftBox pb={2} className="timelineitem-purchase-anchor" onClick={handleSubmitFile}>
            {loader ? (
              <SoftBox className="spin-box-load">
                <CircularProgress className="spin-to-win" />
              </SoftBox>
            ) : (
              <a className="down-p" id="a" target="_blank">
                View
              </a>
            )}
          </SoftBox>
        ) : null}

        {status.toLowerCase() === 'successful' && docId !==null ? (
          <SoftBox pb={2} className="timelineitem-purchase-anchor" onClick={handleSubmitFilepayment}>
            {loader ? (
              <SoftBox className="spin-box-load">
                <CircularProgress className="spin-to-win" />
              </SoftBox>
            ) : (
              <a className="down-p" id="a" target="_blank">
                View
              </a>
            )}
          </SoftBox>
        ) : null}

        {status.toLowerCase() === 'recorded' && docId !==null? (
          <SoftBox pb={2} className="timelineitem-purchase-anchor" onClick={handleSubmitFileRefund}>
            {loader ? (
              <SoftBox className="spin-box-load">
                <CircularProgress className="spin-to-win" />
              </SoftBox>
            ) : (
              <a className="down-p" id="a" target="_blank">
                View
              </a>
            )}
          </SoftBox>
        ) : null}
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
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark', 'light']),
  logType: PropTypes.string.isRequired,
  updatedOn: PropTypes.string.isRequired,
  updatedBy: PropTypes.string,
  status: PropTypes.string,
};

export default TimelineItem;
