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
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import { getTotalPuchase, getTotalSales } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NorthIcon from '@mui/icons-material/North';
import { useMediaQuery } from '@mui/material';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
function SellersCard({ bgColor, title, icon, direction, random, random1, orgId, count = 0 }) {
  const locId = localStorage.getItem('locId');
  const [totalPurchase, setTotalPurchase] = useState('10');
  const [salesOverTime, setSalesOverTime] = useState('NA');
  const [comparedValue, setComparedValue] = useState('');
  const [comparedValueType, setComparedValueType] = useState('');
  const [percentageColor, setPercentageColor] = useState('');

  const [currPathname, setCurrPathname] = useState('');
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const hoAdminValue = localStorage.getItem('isHeadOffice');
  const [isHoAdmin, setIsHoAdmin] = useState(false);

  useEffect(() => {
    if (hoAdminValue === 'true') {
      setIsHoAdmin(true);
    } else {
      setIsHoAdmin(false);
    }
  });

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

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

  const formatLargeNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  useEffect(() => {
    if (!isHoAdmin) {
      totalSales();
    }
    setCurrPathname(location.pathname);
  }, [orgId]);
  const totalSales = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    let payload = {
      orgId: orgId,
      startDate: formatDate(startDate),
    };
    if (currPathname !== '/AllOrg_loc') {
      payload.locationId = locId;
    }
    // getTotalSales(payload)
    //   .then((res) => {
    //     setTotalPurchase('₹ ' + formatLargeNumber(Math.round(res?.data?.data?.salesReportOverTime.salesOverTimeValue)));
    //     if (res?.data?.data?.salesReportOverTime?.salesOverTime !== null) {
    //       setSalesOverTime('from ' + res?.data?.data?.salesReportOverTime?.salesOverTime + ' order');
    //     } else {
    //       setSalesOverTime('10');
    //     }
    //     if (res?.data?.data?.salesReportOverTime?.gstCollected !== null) {
    //       localStorage.setItem(
    //         'gstCollected',
    //         formatLargeNumber(Math.round(res?.data?.data?.salesReportOverTime.gstCollected)),
    //       );
    //     } else {
    //       localStorage.setItem('10');
    //     }
    //   })
    //   .catch((err) => {
    //     setTotalPurchase('10');
    //     localStorage.setItem('gstCollected', '10');
    //     setSalesOverTime('10');
    //   });
  };
  const isMobileDevice = isSmallScreen();

  return (
    <Card className={`${isMobileDevice && 'po-box-shadow'}`}>
      <SoftBox bgColor={bgColor} variant="gradient" height="80.5px" sx={{ borderRadius: '10px !important' }}>
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
                  style={{ display: 'flex' }}
                >
                  {title.text}
                </SoftTypography>
                {isHovered ? (
                  <LightTooltip title={totalPurchase} style={{ cursor: 'pointer' }}>
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
                      {totalPurchase}{' '}
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
                    {totalPurchase}{' '}
                  </SoftTypography>
                )}
                {/* <SoftTypography variant="button" color={percentageColor} fontWeight="bold">
                  {comparedValueType}
                  {comparedValue}
                </SoftTypography>
                <SoftTypography
                  variant="button"
                  fontWeight="bold"
                  style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}
                >
                  {salesOverTime}{' '}
                  {/* {salesOverTime !== 'NA' && (
                    <span style={{ paddingTop: '5px', marginLeft: '5px', display: 'flex', color: 'Green' }}>
                      <TrendingDownIcon fontSize='medium'  style={{color:"red"}}/> 
                      (12%)
                      <TrendingUpIcon fontSize="medium" style={{ color: 'Green' }} />
                    </span>
                  )} 
                </SoftTypography> */}
              </SoftBox>
            </Grid>

            {direction === 'right' && icon ? (
              <Grid item xs={4}>
                <SoftBox
                  variant="gradient"
                  style={{ background: '#0562FB' }}
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
              <Grid item style={{ marginTop: '7px' }}>
                <SoftBox style={{ display: 'flex', justifyContent: 'space-between', width: '250px !important' }}>
                  <SoftTypography
                    variant="button"
                    color="#979899"
                    opacity={bgColor === 'white' ? 1 : 0.7}
                    textTransform="capitalize"
                    fontWeight={title.fontWeight}
                  >
                    {random.title}
                  </SoftTypography>
                  <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    color={bgColor === 'white' ? 'dark' : 'white'}
                    style={{ marginLeft: '30px' }}
                  >
                    {random.Value}{' '}
                  </SoftTypography>
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
                <SoftBox
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '250px !important',
                    marginTop: '5px',
                  }}
                >
                  <SoftTypography
                    variant="button"
                    color="#979899"
                    opacity={bgColor === 'white' ? 1 : 0.7}
                    textTransform="capitalize"
                    fontWeight={title.fontWeight}
                  >
                    {random1.title}
                  </SoftTypography>
                  <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    color={bgColor === 'white' ? 'dark' : 'white'}
                    style={{ marginLeft: '30px' }}
                  >
                    {random1.Value}{' '}
                  </SoftTypography>
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

// Setting default values for the props of SalesMiniStatisticsCard
SellersCard.defaultProps = {
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

// Typechecking props for the SalesMiniStatisticsCard
SellersCard.propTypes = {
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

export default SellersCard;
