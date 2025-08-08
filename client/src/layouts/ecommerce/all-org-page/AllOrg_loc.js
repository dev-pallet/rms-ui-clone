import './all-org.css';
import { AppBar, Box, IconButton, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../../../examples/LayoutContainers/PageLayout';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import breakpoints from 'assets/theme/base/breakpoints';
// import LocationPage from './LocationPage';
// import Dashboardpage from './Dashboardpage';
import { palletLogo } from '../Common/CommonFunction';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import StoreIcon from '@mui/icons-material/Store';
// import HeadOffice from './HeadOffice';
// import HeadOfficeSellers from './HeadOfficeSellers';
import { isSmallScreen } from '../Common/CommonFunction';
import BottomNavbar from '../../../examples/Navbars/BottomNavbarMob';
import DashboardSkeleton from './components/Dashboard-Skeleton';
import LocationSkeleton from './components/Location-Skeleton';
import SoftBox from '../../../components/SoftBox';

const OrgLocationPage = lazy(() => import('./OrgLocationPage'));
const Dashboardpage = lazy(() => import('./Dashboardpage'));
const HeadOffice = lazy(() => import('./HeadOffice'));
const HeadOfficeSellers = lazy(() => import('./HeadOfficeSellers'));

const AllOrg_loc = () => {
  const navigate = useNavigate();
  // const isMobileDevice = window.innerWidth <= 768;
  const isMobileDevice = isSmallScreen();
  const location = useLocation();
  const [value, setValue] = useState();
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isHoAdmin, setIsHoAdmin] = useState(false);
  const user_roles = localStorage.getItem('user_roles');
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [status, setStatus] = useState({
    tab1: false,
    tab2: true,
    tab3: false,
    tab4: false,
  });

  //   const [mobileTabButtons, setMobileTabButtons] = useState([
  //   {
  //     id: 0,
  //     buttonName: 'Dashboard',
  //     buttonTabValue: 0,
  //     buttonIcon: <DashboardIcon />,
  //     isActive: true,
  //     toShow: true,
  //   },
  //   { id: 0, buttonName: 'Locations', buttonTabValue: 1, buttonIcon: <FmdGoodIcon />, isActive: false, toShow: true },
  //   {
  //     id: 0,
  //     buttonName: 'Head Office',
  //     buttonTabValue: 3,
  //     buttonIcon: <BusinessIcon />,
  //     isActive: false,
  //     toShow: false,
  //   },
  //   {
  //     id: 0,
  //     buttonName: 'Sellers',
  //     buttonTabValue: 4,
  //     buttonIcon: <StoreIcon />,
  //     isActive: false,
  //     toShow: false,
  //   },
  // ]);

  // const updateMobileTabs = (tabName) => {
  //   const updatedTab = mobileTabButtons.map((buttonDiv) => {
  //     if (buttonDiv.buttonName === tabName) {
  //       buttonDiv.isActive = true;
  //     } else {
  //       buttonDiv.isActive = false;
  //     }
  //     if((isSuperAdmin || isHoAdmin) && buttonDiv.buttonName === 'Dashboard'){
  //       buttonDiv.toShow = true
  //     }else if(isHoAdmin && (buttonDiv.buttonName === 'Head Office' || buttonDiv.buttonName === 'Sellers')){
  //       buttonDiv.toShow = true
  //     }else if (buttonDiv.buttonName !== 'Locations'){
  //       buttonDiv.toShow = false
  //     }

  //     return buttonDiv;
  //   });

  //   return updatedTab
  // }

  useEffect(() => {
    // if (location.state !== null) {
    //retreving tabValue in mobile
    // const redirectedTabValue = location.state.tabValue;
    // const redirectedTabName = location.state.tabName;
    // const updatedTab = updateMobileTabs(redirectedTabName)
    // setMobileTabButtons(updatedTab);
    // setValue(redirectedTabName);
    // handleSetTabValue({}, redirectedTabValue);
    // } else {
    let newValue = isMobileDevice ? 'Locations' : isSuperAdmin || isHoAdmin ? 'Dashboard' : 'Locations';
    // const updatedTab = updateMobileTabs(newValue)
    // setMobileTabButtons(updatedTab);
    let tabValue = 0;
    if (isMobileDevice) {
      if (location.state !== null) {
        if (location.state.tab === 'tab_1') {
          setStatus({
            tab1: true,
            tab2: false,
            tab3: false,
            tab4: false,
          });
          tabValue = 0;
          newValue = 'Dashboard';
        } else {
          setStatus({
            tab1: false,
            tab2: true,
            tab3: false,
            tab4: false,
          });
          newValue = 'Locations';
          tabValue = 1;
        }
      }
    }
    setValue(newValue);
    handleSetTabValue({}, tabValue);
    // }
  }, [isSuperAdmin, isHoAdmin, location]);

  // localStorage.setItem('AppAccountId', 'AO00001');
  localStorage.setItem('isHeadOffice', false);

  //scrolling
  // useEffect(() => {
  //   if (location.pathname.includes('/AllOrg_loc')) {
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [location.pathname]);

  useEffect(() => {
    if (user_roles?.includes('SUPER_ADMIN')) {
      setIsSuperAdmin(true);
    }
    if (user_roles?.includes('HO_ADMIN')) {
      setIsHoAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (isMobileDevice) {
      if (location.state !== null) {
        if (location.state.tab === 'tab_1') {
          setStatus({
            tab1: true,
            tab2: false,
            tab3: false,
            tab4: false,
          });
          setTabValue(0);
          setValue('Dashboard');
        } else {
          setStatus({
            tab1: false,
            tab2: true,
            tab3: false,
            tab4: false,
          });
          setTabValue(1);
          setValue('Locations');
        }
      }
    }
  }, [location]);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }
    window.addEventListener('resize', handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 0) {
      setStatus({
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
      });
    } else if (newValue == 1) {
      setStatus({
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false,
      });
    } else if (newValue == 2) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
      });
    } else if (newValue == 3) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
      });
    }
  };

  const handleButtonClick = (componentName) => {
    setValue(componentName);
  };

  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const handleScroll = () => {
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  const contextType = localStorage.getItem('contextType');
  const onHomepage = () => {
    if (contextType) {
      navigate('/');
    }
  };

  const selectedcomponent =
    value === 'Locations' ? (
      <Suspense
        fallback={
          <SoftBox p={1}>
            <LocationSkeleton />
          </SoftBox>
        }
      >
        <OrgLocationPage />
      </Suspense>
    ) : value === 'Dashboard' ? (
      <Suspense fallback={isMobileDevice ? <DashboardSkeleton /> : <p>Loading...</p>}>
        <Dashboardpage orgId={orgId} />
      </Suspense>
    ) : value === 'Head Office' ? (
      <Suspense fallback={<p>Loading...</p>}>
        <HeadOffice />
      </Suspense>
    ) : (
      value === 'Sellers' && (
        <Suspense fallback={<p>Loading...</p>}>
          <HeadOfficeSellers />
        </Suspense>
      )
    );

  // const mobileTabChangeHandler = (buttonValue, buttonName) => {
  //   const updatedTab = mobileTabButtons.map((buttonDiv) => {
  //     if (buttonDiv.buttonName === buttonName) {
  //       buttonDiv.isActive = true;
  //     } else {
  //       buttonDiv.isActive = false;
  //     }

  //     return buttonDiv;
  //   });
  //   setMobileTabButtons(updatedTab);
  //   setValue(buttonName);
  //   handleSetTabValue({}, buttonValue);
  // };

  return (
    <PageLayout sx={{ height: 'auto', overflow: 'hidden' }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar variant="contained" className="main-appbar" sx={{ backgroundColor: '#0562FB' }}>
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={onHomepage}>
              <img src={palletLogo} style={{ height: '25px', margin: '10px' }} />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          </Toolbar>
        </AppBar>
      </Box>
      {/* xs={12} md={6} lg={5} */}
      {!isMobileDevice && (
        <SoftBox className="tabs-appbar-main-div">
          <SoftBox
            // position="static"
            className={isMobileDevice ? 'mobile-tas-appbar' : 'tabs-appbar'}
          >
            {!isMobileDevice && (
              <Tabs
                value={tabValue}
                orientation={tabsOrientation}
                onChange={handleSetTabValue}
                aria-label="icon position tabs example"
                className="loc-tabs"
                sx={{ background: 'transparent' }}
              >
                {(isSuperAdmin || isHoAdmin) && (
                  <Tab icon={<DashboardIcon />} label="Dashboard" onClick={() => handleButtonClick('Dashboard')} />
                )}
                <Tab
                  icon={<FmdGoodIcon />}
                  iconPosition="start"
                  label="Locations"
                  onClick={() => handleButtonClick('Locations')}
                />
                {isHoAdmin && [
                  <Tab
                    icon={<BusinessIcon />}
                    iconPosition="start"
                    label="Head Office"
                    onClick={() => handleButtonClick('Head Office')}
                  />,
                  <Tab
                    icon={<StoreIcon />}
                    iconPosition="start"
                    label="Sellers"
                    onClick={() => handleButtonClick('Sellers')}
                  />,
                ]}
              </Tabs>
            )}
          </SoftBox>
        </SoftBox>
      )}
      {/* {isMobileDevice && <SoftBox className="mobile-tab-chip-main-div">
        <SoftBox className="mobile-tab-chip-div">
          <Stack direction="row" spacing={1} className="chip-stack-dashboard">
            {mobileTabButtons.map((button) => (
              <>
                {button.toShow && (
                  <Chip
                    icon={button.buttonIcon}
                    label={button.buttonName}
                    variant={button.isActive ? '' : 'outlined'}
                    onClick={() => mobileTabChangeHandler(button.buttonTabValue, button.buttonName)}
                    sx={{width: !isSuperAdmin || !isHoAdmin ?  '100%' : 'auto',flex:1}}
                  />
                )}
              </>
            ))}
          </Stack>
        </SoftBox>
      </SoftBox>} */}
      <SoftBox>{selectedcomponent}</SoftBox>
      <button id="floatBtn" className={isVisible ? 'show' : 'hide'} onClick={scrollToTop}>
        ↑
      </button>
      {isMobileDevice && !!contextType && <BottomNavbar />}
    </PageLayout>
  );
};

export default AllOrg_loc;
