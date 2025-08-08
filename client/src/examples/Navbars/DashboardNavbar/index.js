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

import { useState, useEffect } from 'react';
import './dash.css';
// react-router components
import { useLocation, Link } from 'react-router-dom';

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

import Swal from 'sweetalert2';

// @mui core components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Icon from '@mui/material/Icon';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftInput from 'components/SoftInput';

// Soft UI Dashboard PRO React example components
import NotificationItem from 'examples/Items/NotificationItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WidgetsIcon from '@mui/icons-material/Widgets';
import CampaignIcon from '@mui/icons-material/Campaign';

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from 'examples/Navbars/DashboardNavbar/styles';

// Soft UI Dashboard PRO React context
import { useSoftUIController, setTransparentNavbar, setMiniSidenav, setOpenConfigurator } from 'context';

// Images
import logoSpotify from 'assets/images/small-logos/logo-spotify.svg';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Logout from '@mui/icons-material/Logout';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import { Box, Tooltip, Typography, tooltipClasses, useMediaQuery, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import {
  filterBlog,
  getCartDetails,
  getLocDetailByLongAndLat,
  userLogOut,
  userLogOutV2,
} from '../../../config/Services';
import { Badge } from '@mui/material';
import { isMotionValue } from 'framer-motion';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SoftButton from '../../../components/SoftButton';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { clearCookie, getReadNotifications } from '../../../layouts/ecommerce/Common/CommonFunction';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import {
  getAllUnreadNotification,
  getLastFetched,
  getUnreadNotificationsList,
  setLastFetched,
  setUnReadNotification,
  setUnReadNotificationsList,
} from '../../../datamanagement/Filters/notificationSlice';
import { useSelector } from 'react-redux';
import NotificationsListHeader from './NotificationList';
function DashboardNavbar({ absolute, light, isMini, Appsearch, addToCart, prevLink, widgetSelection }) {
  const [navbarType, setNavbarType] = useState();
  const [isAppSearchBar, setIsAppSearchBar] = useState(false);
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [selectedIcon, setSelectedIcon] = useState('');

  //material ui media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType('sticky');
    } else {
      setNavbarType('static');
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener('scroll', handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    if (Appsearch) {
      setIsAppSearchBar(true);
    } else {
      setIsAppSearchBar(false);
    }
  }, [Appsearch]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => {
    setOpenConfigurator(dispatch, !openConfigurator);
  };
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleProf = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <MenuItem onClick={handleProfile}>Coming Soon</MenuItem>
    </Menu>
  );

  const renderProf = () => (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <PersonPinIcon fontSize="small" />
        </ListItemIcon>{' '}
        Profile
      </MenuItem>
      {/* <MenuItem onClick={handleLocation}>
      <ListItemIcon>
          <LocationOnIcon fontSize="small" />
        </ListItemIcon> Locations
      </MenuItem> */}
      <MenuItem onClick={handleOrganisations}>
        <ListItemIcon>
          <BusinessIcon fontSize="small" />
        </ListItemIcon>{' '}
        Organization
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLocation = () => {
    handleClose();
    navigate('/organization/locations');
  };

  //hadnling logout with platform details
  //logout functionlaity

  const logoutPopup = (payload) => {
    const newSwal = Swal.mixin({
      // customClass: {
      //   confirmButton: 'button button-success',
      //   cancelButton: 'button button-error',
      // },
      buttonsStyling: false,
    });
    newSwal
      .fire({
        title: 'Are you sure you want to logout?',
        icon: 'info',
        confirmButtonText: 'Logout',
        showCancelButton: true,
        reverseButtons: true,
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn', // Added custom class for title
        },
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
                customClass: {
                  title: 'custom-swal-title',
                  confirmButton: 'logout-success-btn',
                },
              }).then(() => {
                localStorage.clear();
                clearCookie('access_token');
                clearCookie('refresh_token');
                navigate('/');
              });
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UnAuthorized Token' || err?.response?.data?.code === 401) {
                Swal.fire({
                  icon: 'success',
                  title: 'Successfully Logged out',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                  customClass: {
                    title: 'custom-swal-title',
                    confirmButton: 'logout-success-btn',
                  },
                }).then(() => {
                  localStorage.clear();
                  clearCookie('access_token');
                  clearCookie('refresh_token');
                  navigate('/');
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Unable to Logout',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                  customClass: {
                    title: 'custom-swal-title',
                    confirmButton: 'logout-success-btn',
                  },
                });
              }
            });
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
  const handleOrganisations = () => {
    handleClose();
    navigate('/AllOrg_loc');
  };
  const cartID = localStorage.getItem('cartId-MP');
  const [cartProducts, setCartProducts] = useState([]);
  const [subtotal, setSubtotal] = useState('');

  const cartProductsLength = localStorage.getItem('CartLength');
  const shouldFetchCartDetails = !cartProductsLength;

  useEffect(() => {
    if (shouldFetchCartDetails && cartID !== null) {
      getCartDetails(cartID)
        .then((res) => {
          setCartProducts(res?.data?.data?.cartProducts);
          setSubtotal(res?.data?.data?.billing?.totalCartValue);

          localStorage.setItem('CartLength', res?.data?.data?.cartProducts?.length || 0);
        })
        .catch((error) => {});
    }
  }, [addToCart, shouldFetchCartDetails]);

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

  const isProduction = process.env.NODE_ENV === 'production';

  // for notification
  const reduxDispatch = useDispatch();
  const unreadCount = useSelector(getAllUnreadNotification);
  const unReadNotificationsList = useSelector(getUnreadNotificationsList);
  const lastFetched = useSelector(getLastFetched);

  const handleNotificationRead = (notificationId) => {
    const updatedNotificationsList = unReadNotificationsList.filter(
      (notification) => notification.id !== notificationId,
    );
    reduxDispatch(setUnReadNotificationsList(updatedNotificationsList));
    reduxDispatch(setUnReadNotification(updatedNotificationsList.length));
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const now = new Date().getTime();
        const fifteenMinutesAgo = now - 15 * 60 * 1000;

        // Skip fetching if the data was recently fetched
        if (lastFetched && lastFetched > fifteenMinutesAgo) {
          return;
        }

        // iso date time format
        // const isoDateTimeNow = dayjs().toISOString();

        // convert date to epoch time
        const getEpoch = (date) => new Date(date).getTime();
        // Calculate current and future epoch dates
        const epochCurrentDate = getEpoch(dayjs().format('YYYY-MM-DD'));

        // Prepare the payload
        const payload = {
          page: 1,
          pageSize: 20,
          listedOn: ['Announcement'],
          startExpiry: epochCurrentDate,
          createdDateSort: 'DESC',
        };

        // Retrieve read notifications from cookies or local storage
        const readNotifications = getReadNotifications();

        // Fetch notifications from API
        const response = await filterBlog(payload);

        // Handle API error response
        if (response?.data?.data?.es) {
          showSnackbar('Something went wrong', 'error');
          return;
        }

        // Total notifications and filtering unread notifications
        const totalNotifications = response?.data?.data?.data?.totalResults || 0;
        const unreadNotifications = response?.data?.data?.data?.data?.filter(
          (notification) => !readNotifications?.includes(notification?.id),
        );

        reduxDispatch(setUnReadNotification(unreadNotifications?.length));
        reduxDispatch(setUnReadNotificationsList(unreadNotifications));
        reduxDispatch(setLastFetched(now));
      } catch (err) {
        showSnackbar('Something went wrong', 'error');
      }
    };

    // // Fetch notifications when the component mounts
    fetchNotifications();
    // Run fetchNotifications every 15 minutes (900,000 ms)
    const intervalId = setInterval(fetchNotifications, 900000);

    return () => clearInterval(intervalId);
  }, [reduxDispatch, lastFetched]);

  return (
    <AppBar
      position={absolute ? 'absolute' : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, isAppSearchBar })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme, { isAppSearchBar, isMobile })}>
        <SoftBox color="inherit" mb={{ xs: 0, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Icon fontSize="medium" sx={navbarDesktopMenu} onClick={handleMiniSidenav} style={{ marginRight: '1.8em' }}>
            {miniSidenav ? 'menu_open' : 'menu'}
          </Icon>
          {/* go back link  */}

          {/* <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} /> */}
          {/* <SoftTypography>{route[route.length - 1]}</SoftTypography> */}
          <IconButton size="small" color="inherit" sx={navbarMobileMenu} onClick={handleMiniSidenav}>
            <Icon className={light ? 'text-white' : 'text-dark'}>{miniSidenav ? 'menu_open' : 'menu'}</Icon>
          </IconButton>
          {prevLink && (
            // <Link to={prevLink}>
            <SoftButton
              // className="overall-backbutton"
              variant="backButton"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosIcon />
              Back
            </SoftButton>
            // </Link>
          )}
        </SoftBox>
        {isMini ? null : (
          <SoftBox
            sx={(theme) => ({
              ...navbarRow(theme, { isMini }),
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: isMobile ? 'flex-start' : 'unset',
              gap: isMobile ? '0px' : '15px',
              // width: '0%'
            })}
          >
            {/* Search-bar */}

            {Appsearch ? Appsearch : null}

            {/* icons-bar */}
            <SoftBox
              color={light ? 'white' : 'inherit'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <IconButton
                size="large"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton> */}
              {widgetSelection && (
                <LightTooltip title="Customize Widgets">
                  <Link to="/widgets">
                    <IconButton
                      size="medium"
                      color="inherit"
                      sx={navbarIconButton}
                      // onClick={handleConfiguratorOpen}
                    >
                      <WidgetsIcon className="carty-icon">Widget Selection</WidgetsIcon>
                    </IconButton>
                  </Link>
                </LightTooltip>
              )}

              <LightTooltip
                // title="Coming soon"
                title="Wallet"
              >
                <Link to="/wallet">
                  <IconButton size="medium" color="inherit" sx={navbarIconButton} onClick={handleConfiguratorOpen}>
                    <AccountBalanceWalletIcon
                      onClick={() => setSelectedIcon('wallet')}
                      className={selectedIcon === 'wallet' ? 'carty-icon-selected' : 'carty-icon'}
                    >
                      Wallet
                    </AccountBalanceWalletIcon>
                  </IconButton>
                </Link>
              </LightTooltip>

              <LightTooltip title="Cart">
                <Badge
                  badgeContent={
                    cartProductsLength
                      ? cartProductsLength === 'undefined'
                        ? 0
                        : cartProductsLength
                      : cartProducts?.length || 0
                  }
                  color="secondary"
                >
                  <Link to="/cart">
                    <IconButton size="medium" color="inherit" sx={navbarIconButton}>
                      <ShoppingCartIcon
                        className={selectedIcon === 'cart' ? 'carty-icon-selected' : 'carty-icon'}
                        onClick={() => setSelectedIcon('cart')}
                      >
                        Cart
                      </ShoppingCartIcon>
                    </IconButton>
                  </Link>
                </Badge>
              </LightTooltip>

              <LightTooltip title="Notification">
                <Link to="/notifications">
                  <Badge
                    badgeContent={unreadCount}
                    variant="solid"
                    sx={{ '.MuiBadge-badge': { backgroundColor: '#FD5361', color: '#ffffff', marginRight: '5px' } }}
                  >
                    <IconButton size="medium" color="inherit" sx={navbarIconButton}>
                      <NotificationsIcon onClick={() => setSelectedIcon('notifications')}>
                        Notifications
                      </NotificationsIcon>
                    </IconButton>
                  </Badge>
                </Link>
              </LightTooltip>

              <IconButton color="inherit" sx={navbarIconButton} size="medium" onClick={handleProf}>
                <AccountCircleIcon
                  onClick={() => setSelectedIcon('profile')}
                  className={selectedIcon === 'profile' ? 'carty-icon-selected' : 'carty-icon'}
                >
                  account_circle
                </AccountCircleIcon>
              </IconButton>
              {renderProf()}
            </SoftBox>
            {/* 
            <SoftBox color={light ? 'white' : 'inherit'}>
              <IconButton size="small" color="inherit" sx={navbarMobileMenu} onClick={handleMiniSidenav}></IconButton>
              {renderMenu()}
            </SoftBox> */}
          </SoftBox>
        )}
      </Toolbar>
      <SoftTypography fontSize="14px" className="content-right">
        <NotificationsListHeader
          unReadNotificationsList={unReadNotificationsList}
          onNotificationRead={handleNotificationRead}
        />
      </SoftTypography>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
