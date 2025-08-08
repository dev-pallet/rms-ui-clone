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

// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';

// Soft UI Dashboard PRO React components
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { userTimeline } from '../../../../../../config/Services';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

function Sessions() {
  const actionButtonStyles = {
    '& .material-icons-round': {
      transform: 'translateX(0)',
      transition: 'all 200ms cubic-bezier(0.34,1.61,0.7,1.3)',
    },

    '&:hover .material-icons-round, &:focus .material-icons-round': {
      transform: 'translateX(4px)',
    },
  };

  const isMobilDevice = isSmallScreen();

  const [userData, setUserData] = useState([]);
  const [userLoginError, setUserLoginError] = useState('');

  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 2);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 1);

    function formatDate(date) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      const year = date.getFullYear() % 100;

      day = day.toString();
      month = month.toString();

      return month + '/' + day + '/' + year;
    }

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    const payload = {
      uidx: uidx,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    };

    userTimeline(payload)
      .then((res) => {
        if (res?.data?.data?.status === 'ERROR') {
          setUserLoginError(res?.data?.data?.message + ' for 2 days');
        } else if(res?.data?.data?.status === 'SUCCESS') {
          setUserData(res?.data?.data);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message === 'No Login activity available') {
          setUserLoginError(err?.response?.data?.message + ' for 2 days');
        } else {
          setUserLoginError(err?.response?.data?.message);
        }
      });
  }, []);

  function isExpiredAt(at_expiry) {
    const atExpiryDate = new Date(at_expiry);
    return new Date() > atExpiryDate;
  }
  function isExpiredRT(rt_expiry) {
    const rtExpiryDate = new Date(rt_expiry);
    return new Date() > rtExpiryDate;
  }

  return (
    <Card id="sessions" className={`${isMobilDevice && 'po-box-shadow'}`}>
      <SoftBox p={3} lineHeight={1}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5">Sessions</SoftTypography>
        </SoftBox>
        <SoftTypography variant="button" color="text" fontWeight="regular">
          This is a list of devices that have logged into your account.
          {/* Remove those that you do not recognize. */}
        </SoftTypography>
        {userLoginError !== '' && (
          <SoftBox mt={1}>
            <SoftTypography variant="button" color="text" fontWeight="regular">
              {userLoginError}
            </SoftTypography>
          </SoftBox>
        )}
      </SoftBox>
      <SoftBox pb={3} px={3} sx={{ overflow: 'auto' }}>
        {userData?.map((session, index) => (
          <SoftBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width={{ xs: 'max-content', sm: '100%' }}
            marginBottom="15px"
          >
            <SoftBox display="flex" alignItems="center">
              <SoftBox textAlign="center" color="text" px={{ xs: 0, md: 1.5 }} opacity={0.6}>
                <Icon fontSize="default">desktop_windows</Icon>
              </SoftBox>
              <SoftBox height="100%" ml={2} lineHeight={1.4} mr={2}>
                <SoftTypography display="block" variant="button" fontWeight="regular" color="text">
                  {session?.platform}
                </SoftTypography>
                <SoftTypography variant="caption" color="text">
                  {session?.issue_date ? `${session?.type} Time: ${session?.issue_date}` : ''}
                </SoftTypography>
              </SoftBox>
            </SoftBox>
            <SoftBox alignItems="center">
              <SoftBox display="flex" flexDirection="column" gap={1} mx={2} lineHeight={1}>
                <SoftTypography variant="caption" color={isExpiredAt(session.at_expiry) ? 'red' : 'text'}>
                  {session?.at_expiry ? `Expiry At: ${session?.at_expiry}` : ''}
                </SoftTypography>
                <SoftTypography variant="caption" color={isExpiredRT(session.rt_expiry) ? 'red' : 'text'}>
                  {session?.rt_expiry ? `Expiry Rt: ${session?.rt_expiry}` : ''}
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        ))}
      </SoftBox>
    </Card>
  );
}

export default Sessions;
