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

import { useEffect, useState } from 'react';

// react-router-dom components
import { Navigate, useLocation } from 'react-router-dom';

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Soft UI Dashboard PRO React context
import { useSoftUIController, setLayout } from 'context';
import { getAppVersion } from '../../../config/Services';
import { useMediaQuery } from '@mui/material';

function DashboardLayout({ children, isDashBoard, isMobileDevice, isHidden = false }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const [responses, setResponses] = useState({});
  const [counter, setCounter] = useState(0);
  const [currPathname, setCurrPathname] = useState('');
  const location = useLocation();
  const MAX_CALLS = 3;

  useEffect(() => {
    setLayout(dispatch, 'dashboard');
  }, [pathname]);

  useEffect(() => {
    setCurrPathname(location.pathname);
    const pathname = location.pathname;
    const search = location.search;
    if (
      pathname !== '/sales/all-orders' &&
      !pathname.startsWith('/order/details/') &&
      !(pathname === '/sales/ros-app-sales-order' && search.includes('value=order'))
    ) {
      localStorage.removeItem('Order_Type');
    }
    // appVersionApi()
  }, []);

  // const appVersionApi = async () => {
  //   getAppVersion()
  //     .then((res) => {
  //       const newResponses = { ...responses, [res.data.data.key]: res.data.data };
  //       setResponses(newResponses.undefined);
  //     })
  //     .catch((err) => {});
  // };

  // useEffect(() => {
  //   const allSuccess = Object.values(responses).every((response) => response.status === 'SUCCESS');
  //   if (!allSuccess && counter < MAX_CALLS) {
  //     setCounter((prevCounter) => prevCounter + 1);
  //     setTimeout(appVersionApi, 1000);
  //   }
  // }, [responses]);

  const isMobile = useMediaQuery(`(max-width: 567px)`);

  if (isHidden) return children;

  return (
    <SoftBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        // p: 3,
        px: isDashBoard && isMobileDevice ? 0 : isMobile ? 0 : 3,
        pt: isDashBoard && isMobileDevice ? 0 : isMobile ? 0 : 0,
        position: 'relative',
        backgroundColor: '#fafafa !important',
        // overflowY:!isMobile &&  "auto",
        height: isMobileDevice ? '100% !important' : !isMobile ? `calc(100vh - 1rem) !important` : 'unset',
        // background: 'linear-gradient(to right, #fdfcff, #eeedf5)',
        [breakpoints.up('xl')]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(['margin-left', 'margin-right'], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </SoftBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
