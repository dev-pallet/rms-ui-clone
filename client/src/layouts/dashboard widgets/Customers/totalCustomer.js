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
import { getAllCustomerList, getTotalLocationCustomer, getTotalOrganizationCustomer } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useMediaQuery } from '@mui/material';
import { dateFormatter, isSmallScreen } from '../../ecommerce/Common/CommonFunction';

function CustomerMiniStatisticsCard({ bgColor, title, icon, direction, random, random1, orgId ,loaderDependency}) {
  const locId = localStorage.getItem('locId');
  const [customer, setCustomer] = useState('NA');
  const [endDate, setEndDate] = useState('NA');
  const [startDate, setStartDate] = useState('NA');
  const [currPathname, setCurrPathname] = useState('');
  const [YearlyCustomers, setYearCustomer] = useState('NA');
  const location = useLocation();

  useEffect(() => {
    if (orgId) {
      handleGetCustomer();
    }
  }, [orgId , loaderDependency]);

  const handleGetCustomer = () => {
    const currMonth = new Date().getMonth() + 1;
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const startDate = `${year}-${currMonth.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, currMonth, 0).getDate();
    const endDate = `${year}-${currMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

    setStartDate(dateFormatter(startDate));
    setEndDate(dateFormatter(endDate));
    const payload = {
      organizationId: orgId,
    };
    if (location.pathname !== '/AllOrg_loc') {
      payload.locationId = locId;
    }
    getAllCustomerList(payload)
      .then((res) => {
        if (location.pathname !== '/AllOrg_loc') {
          setCustomer(res?.data?.data?.locationId?.month || 'NA');
          setYearCustomer(res?.data?.data?.locationId?.year || 'NA');
        } else {
          setCustomer(res?.data?.data?.organizationId?.month || 'NA');
          setYearCustomer(res?.data?.data?.organizationId?.year || 'NA');
        }
      })
      .catch(() => {});
  };
  const isMobileDevice = isSmallScreen();

  return (
    <Card className={`${isMobileDevice ? 'po-box-shadow' : 'card-box-shadow'}`}>
      <SoftBox bgColor={bgColor} variant="gradient" height="105.5px" sx={{ borderRadius: '10px !important' }}>
        <SoftBox p={2} className="customer-padding">
          <Grid container alignItems="center">
            {direction === 'left' ? (
              <Grid item>
                <SoftBox
                  variant="gradient"
                  bgColor={bgColor === 'white' ? icon.color : 'white'}
                  color={bgColor === 'white' ? 'white' : 'dark'}
                  width="45px"
                  height="45px"
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
                <SoftBox style={{ display: 'flex' }}>
                  <Tooltip key="Monthly" title="Monthly" placement="top">
                    <SoftTypography
                      variant="h5"
                      fontWeight="bold"
                      color={bgColor === 'white' ? 'dark' : 'white'}
                      style={{ marginRight: '10px' }}
                    >
                      {customer}{' '}
                    </SoftTypography>
                  </Tooltip>
                  <Tooltip key="Yearly" title="Yearly" placement="top">
                    <SoftTypography variant="h5" fontWeight="bold" color={bgColor === 'white' ? 'dark' : 'white'}>
                      {' '}
                      / {YearlyCustomers}
                    </SoftTypography>
                  </Tooltip>
                </SoftBox>
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
            <br />
            <br />
            <SoftTypography variant="button" fontWeight="bold">
              {startDate} to {endDate}{' '}
            </SoftTypography>
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Setting default values for the props of CustomerMiniStatisticsCard
CustomerMiniStatisticsCard.defaultProps = {
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

// Typechecking props for the CustomerMiniStatisticsCard
CustomerMiniStatisticsCard.propTypes = {
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

export default CustomerMiniStatisticsCard;
