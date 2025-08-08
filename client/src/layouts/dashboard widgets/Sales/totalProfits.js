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

// Soft UI Dashboard PRO React components
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import { getProfitDetails, getTotalPuchase, getTotalSales, getTotalVendors } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { useMediaQuery } from '@material-ui/core';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
function ProfitsMiniStatisticsCard({ bgColor, title, icon, direction, random, random1, orgId, count = 0 ,loaderDependency , profitData}) {
  const locId = localStorage.getItem('locId');
  const [totalVendor, setTotalVendor] = useState('NA');
  const [marginData, setMarginData] = useState('NA');
  const [percentageColor, setPercentageColor] = useState('');

  const [currPathname, setCurrPathname] = useState('');
  const location = useLocation();

  const formatLargeNumber = (num) => {
    return num.toLocaleString('en-IN');
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

    // Usage: Call the functions to populate the payload
    const payload = {
      orgId: orgId,
    };
    if (location.pathname !== '/AllOrg_loc') {
      payload.locationId = locId;
    }
    // if (title?.text === "Today's Profits") {
    //   payload.frequency = 'day';
    //   payload.startDate = formatDate(today);
    //   payload.endDate = formatDate(today);
    // }
     if (title?.text === "Monthly Profits") {
      payload.frequency = 'month';
      payload.startDate = getStartOfMonth();
      payload.endDate = getEndOfMonth();
    }
    if (title?.text === "Monthly Profits") { 
      getProfitDetails(payload)
      .then((res) => {
        // setMarginData('₹ ' + formatLargeNumber(Math.round(res?.data?.data.marginData[0].netProfit)));
        if (title?.text === 'Monthly Profits') {
          localStorage.setItem('workingGst', res?.data?.data.marginData[0]?.workingGst);
          localStorage.setItem('inputTAX', res?.data?.data.marginData[0]?.inputTax);
          localStorage.setItem('outputTAX', res?.data?.data.marginData[0]?.outPutTax);
        }
      })
      .catch((err) => {});
    }


  }, [orgId , loaderDependency]);

  const handleMarginData = () => {
    if (title?.text === 'Monthly Profits') {
      setMarginData('₹ ' + formatLargeNumber(Math.round(profitData?.currentMonthNetProfit || 0)));
    } else if (title?.text === 'Yearly Profits') {
      setMarginData('₹ ' + formatLargeNumber(Math.round(profitData?.currentYearNetProfit || 0)));
    } else {
      setMarginData('₹ ' + formatLargeNumber(Math.round(profitData?.todayNetProfit || 0)));
    }
  };
  useEffect(() => {
   if (profitData?.currentMonthNetProfit  || profitData?.todayNetProfit || profitData?.currentYearNetProfit) {
    handleMarginData()
   } else {
    setMarginData("NA")
   }
  }, [profitData])
  
  const isMobileDevice = isSmallScreen();

  return (
    <Card
      className={`${isMobileDevice ? 'po-box-shadow' : 'card-box-shadow'}`}
      sx={{ borderRadius: '10px !important' }}
    >
      <SoftBox bgColor={bgColor} variant="gradient" height="105.5px" sx={{ borderRadius: '10px !important' }}>
        <SoftBox p={2}>
          <Grid container alignItems="center">
            {direction === 'left' ? (
              <Grid item>
                <SoftBox
                  variant="gradient"
                  style={{ background: 'linear-gradient(310deg, #0562FB,#375691)' }}
                  // bgColor={bgColor === 'white' ? icon.color : 'white'}
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
                  {marginData || "NA"}{' '}
                </SoftTypography>
                <SoftTypography variant="button" color={percentageColor} fontWeight="bold"></SoftTypography>
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
                    <InsertChartIcon />
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

// Setting default values for the props of VendorMiniStatisticsCard
ProfitsMiniStatisticsCard.defaultProps = {
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

// Typechecking props for the VendorMiniStatisticsCard
ProfitsMiniStatisticsCard.propTypes = {
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

export default ProfitsMiniStatisticsCard;
