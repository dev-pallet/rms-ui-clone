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
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import styled from '@emotion/styled';

// Soft UI Dashboard PRO React components
import { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import { useMediaQuery } from '@mui/material';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
import { getProfitDetails } from '../../../config/Services';
import { useParams } from 'react-router-dom';

function ReconcillationMiniStatisticsCard({
  bgColor,
  title,
  count = 0,
  percentage,
  icon,
  direction,
  random,
  random1,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // const gstCollected = localStorage.getItem('outputTAX') || '0';
  // const workingGst = localStorage.getItem('workingGst') || '0';
  // const inputCredit = localStorage.getItem('inputTAX') || '0';
  const [workingGst , setWorkingGst] = useState("NA")
  const [inputCredit , setInputCredit] = useState("NA")
  const [gstCollected , setGstCollected] = useState("NA")
  const locId = localStorage.getItem("locId")
  const orgId = localStorage.getItem("orgId")
  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  
useEffect(() => {
  const today = new Date();

  function getStartOfMonth() {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    return `${year}-${month}-01`;
  }

  // Create a function to get the end date of the current month in "YYYY-MM-DD" format
  function getEndOfMonth() {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();
    return `${year}-${month}-${lastDay}`;
  }
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
// const getEndPoint = useParams()
// console.log(getEndPoint)
  // Usage: Call the functions to populate the payload
  const payload = {
    orgId: orgId,
  };
  if (locId) {
    payload.locationId = locId;
  }
  if (title?.text === "Today's Profits") {
    payload.frequency = 'day';
    payload.startDate = formatDate(today);
    payload.endDate = formatDate(today);
  } else {
    payload.frequency = 'month';
    payload.startDate = getStartOfMonth();
    payload.endDate = getEndOfMonth();
  }
  if (location.pathname !== "/AllOrg_loc") {
    getProfitDetails(payload)
      .then((res) => {
       
          setGstCollected(res?.data?.data?.marginData[0]?.outPutTax || "0")
          setInputCredit(res?.data?.data?.marginData[0]?.inputTax || "0")
          setWorkingGst(res?.data?.data?.marginData[0]?.workingGst || "0")
        
      })
      .catch((err) => {});
  }
}, [])


  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
    }),
  );

  const isMobileDevice = isSmallScreen();

  return (
    <Card className={`${isMobileDevice ? 'po-box-shadow' : 'card-box-shadow'}`}>
      <SoftBox bgColor={bgColor} variant="gradient" sx={{ borderRadius: '10px !important' }}>
        <SoftBox p={2}>
          <Grid container alignItems="center">
            {direction === 'left' ? (
              <Grid item>
                <SoftBox
                  variant="gradient"
                  bgColor={bgColor === 'white' ? icon.color : 'white'}
                  color={bgColor === 'white' ? 'white' : 'dark'}
                  width="3rem"
                  height="3rem"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  <Icon fontSize="small" color="inherit">
                    {icon.component}
                  </Icon>
                </SoftBox>
              </Grid>
            ) : null}
            <Grid item xs={8}>
              <SoftBox ml={direction === 'left' ? 2 : 0} lineHeight={1}>
                <SoftTypography
                  variant="button"
                  color={bgColor === 'white' ? 'text' : 'white'}
                  opacity={bgColor === 'white' ? 1 : 0.7}
                  textTransform="capitalize"
                  fontWeight={title.fontWeight}
                >
                  {title.text}
                </SoftTypography>
                <SoftTypography variant="h5" fontWeight="bold" color={bgColor === 'white' ? 'dark' : 'white'}>
                  {workingGst || 'NA'}{' '}
                </SoftTypography>
                <SoftTypography variant="button" color={percentage.color} fontWeight="bold">
                  {percentage.text}
                </SoftTypography>
              </SoftBox>
            </Grid>

            {direction === 'right' && icon ? (
              <Grid item xs={4}>
                <SoftBox
                  variant="gradient"
                  style={{ background: '#0562FB' }}
                  // bgColor={bgColor === 'white' ? icon.color : 'white'}
                  color={bgColor === 'white' ? 'white' : 'dark'}
                  width="45px"
                  height="45px"
                  marginLeft="auto"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  <Icon fontSize="25px" color="inherit">
                    {icon.component}
                  </Icon>
                </SoftBox>
              </Grid>
            ) : null}

            {random ? (
              <Grid item>
                <SoftBox style={{ width: '250px !important' }}>
                  <SoftTypography
                    variant="button"
                    color="#979899"
                    opacity={bgColor === 'white' ? 1 : 0.7}
                    textTransform="capitalize"
                    fontWeight={title.fontWeight}
                  >
                    {random.title}
                  </SoftTypography>
                  {isHovered ? (
                    <LightTooltip title={inputCredit} style={{ cursor: 'pointer' }}>
                      <SoftTypography
                        variant="h5"
                        fontWeight="bold"
                        color={bgColor === 'white' ? 'dark' : 'white'}
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        onMouseEnter={handleHover}
                        onMouseLeave={handleHover}
                      >
                        {inputCredit}{' '}
                      </SoftTypography>
                    </LightTooltip>
                  ) : (
                    <SoftTypography
                      variant="h5"
                      fontWeight="bold"
                      color={bgColor === 'white' ? 'dark' : 'white'}
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      cursor="pointer"
                      onMouseEnter={handleHover}
                      onMouseLeave={handleHover}
                    >
                      {inputCredit}{' '}
                    </SoftTypography>
                  )}
                </SoftBox>
                <SoftTypography
                  variant="h6"
                  fontWeight="bold"
                  color={bgColor === 'white' ? 'text' : 'white'}
                  opacity={bgColor === 'white' ? 1 : 0.7}
                  fontSize="0.72rem"
                >
                  {random.note}{' '}
                </SoftTypography>
                <SoftBox style={{ width: '250px !important', marginTop: '5px' }}>
                  <SoftTypography
                    variant="button"
                    color="#979899"
                    opacity={bgColor === 'white' ? 1 : 0.7}
                    textTransform="capitalize"
                    fontWeight={title.fontWeight}
                  >
                    {random1.title}
                  </SoftTypography>
                  {isHovered ? (
                    <LightTooltip title={gstCollected} style={{ cursor: 'pointer' }}>
                      <SoftTypography
                        variant="h5"
                        fontWeight="bold"
                        color={bgColor === 'white' ? 'dark' : 'white'}
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        onMouseEnter={handleHover}
                        onMouseLeave={handleHover}
                      >
                        {gstCollected}{' '}
                      </SoftTypography>
                    </LightTooltip>
                  ) : (
                    <SoftTypography
                      variant="h5"
                      fontWeight="bold"
                      color={bgColor === 'white' ? 'dark' : 'white'}
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      cursor="pointer"
                      onMouseEnter={handleHover}
                      onMouseLeave={handleHover}
                    >
                      {gstCollected}{' '}
                    </SoftTypography>
                  )}
                </SoftBox>
                <SoftTypography
                  variant="h6"
                  fontWeight="bold"
                  color={bgColor === 'white' ? 'text' : 'white'}
                  opacity={bgColor === 'white' ? 1 : 0.7}
                  fontSize="0.72rem"
                >
                  {random1.note}{' '}
                </SoftTypography>
              </Grid>
            ) : null}
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Setting default values for the props of ReconcillationMiniStatisticsCard
ReconcillationMiniStatisticsCard.defaultProps = {
  bgColor: 'white',
  title: {
    fontWeight: 'medium',
    text: '',
  },
  percentage: {
    color: 'success',
    text: '',
  },
  direction: 'right',
};

// Typechecking props for the ReconcillationMiniStatisticsCard
ReconcillationMiniStatisticsCard.propTypes = {
  bgColor: PropTypes.oneOf(['white', 'primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
  title: PropTypes.PropTypes.shape({
    fontWeight: PropTypes.oneOf(['light', 'regular', 'medium', 'bold']),
    text: PropTypes.string,
  }),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark', 'white']),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
    component: PropTypes.node.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(['right', 'left']),
};

export default ReconcillationMiniStatisticsCard;
