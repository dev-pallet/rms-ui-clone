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
import { getTotalPuchase, getTotalSales, getTotalVendors } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';

function VendorMiniStatisticsCard({ bgColor, title, icon, direction, random, random1, orgId, count = 0, loaderDependency }) {
  const locId = localStorage.getItem('locId');
  const [totalVendor, setTotalVendor] = useState('NA');
  const [comparedValue, setComparedValue] = useState('');
  const [comparedValueType, setComparedValueType] = useState('');
  const [percentageColor, setPercentageColor] = useState('');

  const [currPathname, setCurrPathname] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (orgId) {
      totalVendors();
    }
    setCurrPathname(location.pathname);
  }, [orgId ,loaderDependency]);
  const totalVendors = () => {
    let currMonth = new Date().getMonth() + 1;
    let currYear = new Date().getFullYear().toString();
    getTotalVendors(currMonth, currYear, orgId)
      .then((res) => {
        if (res.data.data.status === true) {
          setTotalVendor(res?.data?.data?.total);
        } else {
          setTotalVendor(res?.data?.data?.total);
        }
      })
      .catch((err) => {
        // Write code for error messages if any
        setTotalVendor('NA');
      });
  };

  const isMobileDevice = isSmallScreen();
  return (
    <Card className={`${isMobileDevice ? 'po-box-shadow' : 'card-box-shadow'}`}>
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
                  {totalVendor}{' '}
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

// Setting default values for the props of VendorMiniStatisticsCard
VendorMiniStatisticsCard.defaultProps = {
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
VendorMiniStatisticsCard.propTypes = {
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

export default VendorMiniStatisticsCard;
