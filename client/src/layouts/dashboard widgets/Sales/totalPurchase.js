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
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

// Soft UI Dashboard PRO React components
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import { getTotalPuchase } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useMediaQuery } from '@mui/material';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
function TotalPruchaseMiniStatisticsCard({ bgColor, title, icon, direction, random, random1, orgId, count = 0 }) {
  const locId = localStorage.getItem('locId');
  const [totalPurchase, setTotalPurchase] = useState('NA');
  const [purchseCount, SetPurchaseCount] = useState('');
  const [comparedValue, setComparedValue] = useState('');
  const [comparedValueType, setComparedValueType] = useState('');
  const [percentageColor, setPercentageColor] = useState('');
  const [currPathname, setCurrPathname] = useState('');
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

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
    !!orgId && totalPurchased();
    setCurrPathname(location.pathname);
  }, [orgId]);
  const totalPurchased = () => {
    let currMonth = new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase();
    let currYear = new Date().getFullYear().toString();
    let payload = {
      orgId: orgId,
      month: currMonth,
      year: currYear,
    };
    if (currPathname !== '/AllOrg_loc') {
      payload.orgLocId = locId;
    }
    getTotalPuchase(payload)
      .then((res) => {
        if (res.data.data.es == '0') {
          if (res?.data?.data?.currentDayPurchaseCount !== '0') {
            setTotalPurchase(formatLargeNumber(Math.round(res?.data?.data?.currentDayPurchaseValue)));
            SetPurchaseCount(
              'from ' + formatLargeNumber(Math.round(res?.data?.data?.currentDayPurchaseCount)) + ' Purchase',
            );
          } else {
            setTotalPurchase(formatLargeNumber('NA'));
            SetPurchaseCount(formatLargeNumber('NA'));
          }
        }
        localStorage.setItem('inputCredit', formatLargeNumber(Math.round(res?.data?.data?.inputCredit)));
      })
      .catch((err) => {
        // Write code for error messages if any
        setTotalPurchase('NA');
        setComparedValueType('');
        setComparedValue('NA');
        SetPurchaseCount('NA');
        setPercentageColor('');
        localStorage.setItem('inputCredit', 'NA');
      });
  };

  const isMobileDevice = isSmallScreen();

  return (
    <Card className={`${isMobileDevice ? 'po-box-shadow' : 'card-box-shadow'}`}>
      <SoftBox bgColor={bgColor} variant="gradient" height="" sx={{ borderRadius: '10px !important' }}>
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
                <SoftTypography variant="button" fontWeight="bold">
                  {purchseCount}{' '}
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
                    <PaymentsIcon />
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

// Setting default values for the props of PruchaseMiniStatisticsCard
TotalPruchaseMiniStatisticsCard.defaultProps = {
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

// Typechecking props for the PruchaseMiniStatisticsCard
TotalPruchaseMiniStatisticsCard.propTypes = {
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

export default TotalPruchaseMiniStatisticsCard;
