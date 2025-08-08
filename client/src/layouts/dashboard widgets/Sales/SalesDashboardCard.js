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
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

// Soft UI Dashboard PRO React components
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
import './CardSplit.css';
function SalesDashboardCard({
  bgColor,
  title,
  icon,
  direction,
  random,
  random1,
  orgId,
  count = 0,
  value,
  orders,
  type,
  valueSplit,
  ordersSplit,
  appValueSplit,
  appOrdersSplit,
}) {
  const locId = localStorage.getItem('locId');
  const [totalPurchase, setTotalPurchase] = useState('NA');
  const [salesOverTime, setSalesOverTime] = useState('NA');
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

  const showSplitData = localStorage.getItem('Apps');
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
                      {value ? `₹ ${formatLargeNumber(Math.round(value))}` : 'NA'}
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
                    {value ? `₹ ${formatLargeNumber(Math.round(value))}` : 'NA'}
                  </SoftTypography>
                )}
                <SoftTypography variant="button" color={percentageColor} fontWeight="bold">
                  {comparedValueType}
                  {comparedValue}
                </SoftTypography>
                <SoftTypography
                  variant="button"
                  fontWeight="bold"
                  style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}
                >
                  {orders ? `from ${orders} order` : 'NA'}{' '}
                  {/* {salesOverTime !== 'NA' && (
                    <span style={{ paddingTop: '5px', marginLeft: '5px', display: 'flex', color: 'Green' }}>
                      <TrendingDownIcon fontSize='medium'  style={{color:"red"}}/> 
                      (12%)
                      <TrendingUpIcon fontSize="medium" style={{ color: 'Green' }} />
                    </span>
                  )} */}
                </SoftTypography>
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
                  <Icon fontSize="25px" color="inherit" style={{ fontFamily: type ? 'none' : 'Material Icons Round' }}>
                    {' '}
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

            {showSplitData?.includes('Mobile App') && type?.length > 0 ? (
              <>
                <Grid item xs={12}>
                  <hr style={{ borderColor: '#ede7e6', opacity: '0.15', margin: '5px 0px 5px 0px' }} />
                </Grid>
                <Grid item xs={12}>
                  <div className="CardAlignStyle">
                    <SoftTypography className="CardFontStyle">In Store </SoftTypography>
                    {/* <SoftTypography className="CardtypeStyle">{type}</SoftTypography> */}
                  </div>

                  <div className="CardAlignStyle splitOrder-Gradient">
                    <SoftTypography style={{ fontSize: '1.25rem', color: '#344767', fontWeight: '700' }}>
                      {valueSplit ? `₹ ${formatLargeNumber(Math.round(valueSplit))}` : 'NA'}
                    </SoftTypography>
                    <SoftTypography style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                      {ordersSplit ? `From ${ordersSplit} orders` : null}
                    </SoftTypography>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <SoftTypography className="CardFontStyle">App </SoftTypography>

                  <div className="CardAlignStyle splitOrder-Gradient">
                    <div>
                      <SoftTypography style={{ fontSize: '1.25rem', color: '#344767', fontWeight: '700' }}>
                        {appValueSplit ? `₹ ${formatLargeNumber(Math.round(appValueSplit))}` : 'NA'}
                      </SoftTypography>
                    </div>
                    <SoftTypography style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                      {appOrdersSplit ? `From ${appOrdersSplit} orders` : null}
                    </SoftTypography>
                  </div>
                  {/* {true ? (
            <div className="card-orderStatus">
              <div className="card-orderStaus-tag order-status-success"> 100</div>
              <div className="card-orderStaus-tag order-status-pending"> 40</div>
              <div className="card-orderStaus-tag order-status-failed"> 18</div>
            </div>
          ) : (
            <div></div>
          )} */}
                </Grid>
              </>
            ) : null}
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Setting default values for the props of SalesMiniStatisticsCard
SalesDashboardCard.defaultProps = {
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
SalesDashboardCard.propTypes = {
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

export default SalesDashboardCard;
