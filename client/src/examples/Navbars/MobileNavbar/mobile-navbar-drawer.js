import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Chip, Drawer, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import { getCustomerDetails, getLocDetailByLongAndLat, userLogOut } from '../../../config/Services';
import InventoryIcon from '@mui/icons-material/Inventory';
import './mobile-navbar.css';


import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSnackbar } from '../../../hooks/SnackbarProvider';

import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaymentsIcon from '@mui/icons-material/Payments';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SoapIcon from '@mui/icons-material/Soap';
import NavbarRouteCards from './navbar-route-card';
import { clearCookie, isSmallScreen } from '../../../layouts/ecommerce/Common/CommonFunction';
import SoftTypography from '../../../components/SoftTypography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

const MobileNavbar = ({ title, prevLink, stockCount = {}, isNavigateNull, overrideNavigateNull }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openRoute, setOpenRoute] = useState({
    Home: false,
    Inward: false,
    Inventory: false,
    'Purchase Indent': false,
    'Purchase Order': false,
  });
  const [pathname, setPathname] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const navigation = useNavigate();
  const location = useLocation();
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const userName = localStorage.getItem('user_name');
  const orgName = localStorage.getItem('orgName');
  const contextType = localStorage.getItem('contextType');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isHoAdmin, setIsHoAdmin] = useState(false);
  const user_roles = localStorage.getItem('user_roles');
  const { scannedCount = 0, totalCount = 0 } = stockCount;

  useEffect(() => {
    setPathname(location.pathname);
    if (user_roles?.includes('SUPER_ADMIN')) {
      setIsSuperAdmin(true);
    }
    if (user_roles?.includes('HO_ADMIN')) {
      setIsHoAdmin(true);
    }
  }, []);

  const organisationRoute = {
    label: 'Organisation',
    key: 'organisation',
    route: '',
    subMenu: [
      {
        ...(isSuperAdmin
          ? {
              label: 'Dashboard',
              route: '/AllOrg_loc',
              tabValue: 0,
            }
          : null),
      },
      {
        label: 'Locations',
        route: '/AllOrg_loc',
        tabValue: 1,
      },
      {
        ...(isHoAdmin
          ? {
              label: 'Head Office',
              route: '/AllOrg_loc',
              tabValue: 2,
            }
          : null),
      },
      {
        ...(isHoAdmin
          ? {
              label: 'Sellers',
              route: '/AllOrg_loc',
              tabValue: 3,
            }
          : null),
      },
    ],
    icon: <LocationOnIcon />,
  };

  const routes = [
    {
      label: 'Home',
      route: `/dashboards/RETAIL`,
      key: `dashboards`,
      subMenu: [],
      icon: <HomeIcon />,
    },
    {
      label: 'Products',
      key: 'products',
      route: '',
      subMenu: [
        {
          label: 'All Products',
          route: `/products/all-products`,
        },
        {
          label: 'Inward',
          route: `/inventory/inward`,
        },
        {
          label: 'Inventory',
          route: `/inventory/inventory`,
        },
        // {
        //   label: 'Stock Transers',
        //   route: `/products/transfers`,
        // },
      ],
      icon: <LocalOfferIcon />,
    },
    {
      label: 'Inventory',
      key: 'inventory',
      route: '',
      subMenu: [
        {
          label: 'Stock Count',
          route: `/inventory/stock-count`,
        },
        {
          label: 'Stock Balance',
          route: `/inventory/stock-balance`,
        },
        {
          label: 'Adjustments',
          route: `/inventory/stock-adjustment`,
        },
        {
          label: 'Stock Transfer',
          route: `/inventory/stock-transfer`,
        },
        {
          label: 'Expiry Management',
          route: `/inventory/expiry-management`,
        },
        {
          label: 'ABC Analysis',
          route: `/inventory/abc-analysis`,
        },
      ],
      icon: <InventoryIcon />,
    },
    {
      label: 'Purchase',
      key: 'purchase',
      route: '',
      subMenu: [
        {
          label: 'Vendors',
          route: `/purchase/vendors`,
        },
        {
          label: 'Purchase Indent',
          route: `/purchase/purchase-indent`,
        },
        {
          label: 'Purchase Order',
          route: `/purchase/purchase-orders`,
        },
        {
          label: 'Express Purchase',
          route: `/purchase/express-grn`,
        },
        {
          label: 'Bills',
          route: `/purchase/purchase-bills`,
        },
      ],
      icon: <ShoppingBagIcon />,
    },
    {
      label: 'Sales Order',
      key: 'sales',
      route: '',
      subMenu: [
        {
          label: 'All Orders',
          route: `/sales/all-orders`,
        },
        {
          label: 'Payments',
          route: `/sales/payments`,
        },
        {
          label: 'Payment Received',
          route: `/sales/payments-recieved`,
        },
        {
          label: 'Returns',
          route: `/sales/returns`,
        },
      ],
      icon: <SoapIcon />,
    },
    {
      label: 'Sales Channel',
      key: 'sales_channels',
      route: '',
      subMenu: [
        {
          label: 'Overview',
          route: '/sales_channels/overview',
        },
        {
          label: 'ODS',
          route: '/sales_channels/ods',
        },
        {
          label: 'POS',
          route: '/sales_channels/pos',
        },
      ],
      icon: <PaymentsIcon />,
    },
    {
      label: 'Log Out',
      route: '',
      subMenu: [],
      icon: <LogoutIcon />,
    },
  ];

  //opening route accordion

  //this state is maintained so that it is compared with the route to open only that accordion
  const [expandedRoute, setExpandedRoute] = useState(null);

  const handleOpen = (routeLabel) => {
    const newOpenRoute = { ...openRoute };
    //for routes which do not have submenu
    let findObject;

    if (routeLabel !== 'Organisation') {
      findObject = routes.find((route) => route.label === routeLabel);
    } else {
      findObject = organisationRoute;
    }

    if (routeLabel === 'Log Out') {
      handleLogout();
    } else if (findObject.subMenu.length === 0) {
      navigation(findObject.route);
    } else {
      if (openRoute[routeLabel]) {
        // If the currently opened route is clicked again, closing it
        newOpenRoute[routeLabel] = false;
        setExpandedRoute(null);
      } else {
        // If a different route is clicked, closing other routes and opening the new one
        Object.keys(newOpenRoute).forEach((key) => {
          newOpenRoute[key] = false;
        });
        newOpenRoute[routeLabel] = true;
        setExpandedRoute(routeLabel);
      }
      setOpenRoute(newOpenRoute); //updating the objext of the accordion
    }
  };

  const orgId = localStorage.getItem('orgId');
  const openMobileNavbar = () => {
    setOpenDrawer(true);
  };
  const mobileNavbarCloseHandler = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    getCustomerDetails(orgId).then((res) => {
      setLogoUrl(res?.data?.data?.retail?.logo);
    });
  }, []);

  const navigationHandler = (route) => {
    navigation(route);
  };

  //logout functionlaity
  const [logoutLoader, setLogoutLoader] = useState(false);
  const logoutPopup = (payload) => {
    const newSwal = Swal.mixin({
      customClass: {
        // confirmButton: 'button button-success',
        // cancelButton: 'button button-error',
        cancelButton: 'logout-cancel-btn',
        confirmButton: 'logout-success-btn',
      },
      buttonsStyling: false,
    });
    newSwal
      .fire({
        title: 'Are you sure you want to logout?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Logout',
      })
      .then((result) => {
        if (result.isConfirmed) {
          // userLogOut(payload)
          userLogOut(payload)
            .then((res) => {
              Swal.fire({
                icon: 'success',
                title: 'Successfully Logged out',
                showConfirmButton: true,
                confirmButtonText: 'OK',
              }).then(() => {
                setLogoutLoader(false);
                localStorage.clear();
                clearCookie('access_token');
                clearCookie('refresh_token');
                navigation('/');
              });
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UnAuthorized Token' || err?.response?.data?.code === 401) {
                Swal.fire({
                  icon: 'success',
                  title: 'Successfully Logged out',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                }).then(() => {
                  setLogoutLoader(false);
                  localStorage.clear();
                  clearCookie('access_token');
                  clearCookie('refresh_token');
                  navigation('/');
                });
              } else {
                setLogoutLoader(false);
                Swal.fire({
                  icon: 'error',
                  title: 'Unable to Logout',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                });
              }
            });
        } else {
          setLogoutLoader(false);
        }
      })
      .catch((error) => {
        showSnackbar('Error in logging out', 'error');
      });
  };

  const handleLogout = async () => {
    let os = navigator.platform;
    let browser;
    let device;
    let latitude;
    let longitude;

    // BROWSER
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Chrome')) {
      browser = 'Google Chrome';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Mozilla Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Apple Safari';
    } else if (userAgent.includes('Edge')) {
      browser = 'Microsoft Edge';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      browser = 'Opera';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      browser = 'Internet Explorer';
    } else {
      browser = 'Other';
    }

    // DEVICE
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent)) {
      device = 'Mobile';
    } else if (/Windows/i.test(navigator.userAgent)) {
      device = 'Desktop';
    } else {
      device = 'tablet';
    }

    let payload = {
      metaData: {
        os: os,
        latitude: '',
        browser: browser,
        city: '',
        state: '',
        country: '',
        postCode: '',
        longitude: '',
        device: device,
      },
    };
    setLogoutLoader(true);
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        const res = await getLocDetailByLongAndLat(latitude, longitude);

        if (res) {
          const { city, state, country, postcode } = res?.data?.address;
          payload.metaData.city = city;
          payload.metaData.state = state;
          payload.metaData.country = country;
          payload.metaData.postCode = postcode;
          payload.metaData.latitude = latitude;
          payload.metaData.longitude = longitude;
        }

        logoutPopup(payload);
      },
      function (error) {
        logoutPopup(payload);
      },
    );
  };

  const prevNavigateFunction = () => {
    if (isNavigateNull && overrideNavigateNull === false) {
      navigation('/products/all-products', { state: null });
    } else {
      navigation(-1);
    }
  };

  return (
    <>
      <SoftBox
        className="heading-nav-div"
        sx={{ alignItems: pathname.match(/^\/stock-taking\/stock-items-list\/(.+)$/) && 'flex-start !important' }}
      >
        {prevLink && (
          <ArrowBackIosRoundedIcon sx={{ color: 'white !important' }} onClick={() => prevNavigateFunction()} />
        )}
        <SoftBox>
          <Typography
            fontSize="18px"
            sx={{
              color: isMobileDevice ? 'white !important' : '#344767 !important',
              zIndex: '99',
            }}
          >
            {title}
          </Typography>
          {pathname.match(/^\/stock-taking\/stock-items-list\/(.+)$/) && (
            <SoftBox className="stock-count-top-nav">
              <SoftTypography variant="h4" className="stock-started-count-text">
                Items counted :{' '}
                <Chip label={`${scannedCount}/${totalCount}`} className="stock-taking-chip" variant="outlined" />
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>

        <Avatar src={logoUrl} onClick={openMobileNavbar} className="navbar-avatar" />
      </SoftBox>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={mobileNavbarCloseHandler}
        className="mobile-navbar-drawer"
        PaperProps={{
          sx: {
            width: '100%',
            height: '100vh',
            height: '100dvh',
            margin: '0px !important',
            borderRadius: '0px !important',
            backgroundColor: ' #f7f7ff !important',
            overflowY: 'scroll',
          },
        }}
      >
        {/* <SoftBox className="drawer-main-div-mob"> */}
        <SoftButton onClick={mobileNavbarCloseHandler} className="back-icon-button">
          <ArrowBackIosNewIcon className="back-icon-navbar" />
        </SoftButton>
        <SoftBox className="acc-info-main-div po-box-shadow">
          <SoftBox className="acc-info-desc">
            <Typography fontSize="22px" fontWeight="bold">
              {userName}
            </Typography>
            <Typography fontSize="16px" fontWeight={400} sx={{ whiteSpace: 'normal' }}>
              {orgName}
            </Typography>
            <SoftBox className="view-prof-main-div" onClick={() => navigation('/profile')}>
              <Typography fontSize="12px" fontWeight={400} className="view-profile-acc-info">
                View Profile{' '}
              </Typography>
              <ArrowRightIcon sx={{ color: 'red !important', height: '15px', width: '15px' }} />
            </SoftBox>
          </SoftBox>
          <SoftBox className="acc-info-image">
            <Avatar src={logoUrl} sx={{ width: 80, height: 80 }} className="avatar-img-acc-info" />
          </SoftBox>
        </SoftBox>
        <SoftBox className="main-navigation-div-mob">
          {/* <SoftBox className="navigation-min-tab-div bg-color-mob po-box-shadow">
            <NavbarRouteCards
              route={organisationRoute}
              routes={[organisationRoute]}
              index={0}
              handleOpen={handleOpen}
              navigation={navigation}
              pathname={pathname}
              expandedRoute={expandedRoute}
              // logoutLoader={logoutLoader}
            />
          </SoftBox> */}
          <SoftBox className="navigation-tabs-static">
            <SoftBox
              className="static-tab po-box-shadow"
              onClick={() => navigation('/AllOrg_loc', { state: { tab: 'tab_1' } })}
            >
              <DashboardIcon />
              <Typography fontSize="16px">Organisation</Typography>
            </SoftBox>
            <SoftBox
              className="static-tab po-box-shadow"
              onClick={() => navigation('/AllOrg_loc', { state: { tab: 'tab_2' } })}
            >
              <LocationOnRoundedIcon />
              <Typography fontSize="16px">Stores</Typography>
            </SoftBox>
            <SoftBox className="static-tab po-box-shadow">
              <QuestionAnswerIcon />
              <Typography fontSize="16px">Support</Typography>
            </SoftBox>
          </SoftBox>
          <SoftBox className="navigation-min-tab-div bg-color-mob po-box-shadow">
            {routes.map((route, index) => (
              <NavbarRouteCards
                route={route}
                routes={routes}
                index={index}
                handleOpen={handleOpen}
                navigation={navigation}
                pathname={pathname}
                expandedRoute={expandedRoute}
                logoutLoader={logoutLoader}
              />
            ))}
          </SoftBox>
        </SoftBox>
        {/* </SoftBox> */}
      </Drawer>
    </>
  );
};

export default MobileNavbar;
