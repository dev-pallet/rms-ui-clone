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
import { useLocation, NavLink, useNavigate } from 'react-router-dom';

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

// @mui material components
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Icon from '@mui/material/Icon';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React example components
import SidenavCollapse from 'examples/Sidenav/SidenavCollapse';
import SidenavList from 'examples/Sidenav/SidenavList';
import SidenavItem from 'examples/Sidenav/SidenavItem';
import SidenavCard from 'examples/Sidenav/SidenavCard';

// Custom styles for the Sidenav
import SidenavRoot from 'examples/Sidenav/SidenavRoot';
import sidenavLogoLabel from 'examples/Sidenav/styles/sidenav';

// Soft UI Dashboard PRO React context
import { useSoftUIController, setMiniSidenav } from 'context';
import { styled, useMediaQuery } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { resetCommonReduxState } from '../../datamanagement/Filters/commonFilterSlice';
import { useDispatch } from 'react-redux';

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const reduxDispatch = useDispatch();
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openNestedCollapse, setOpenNestedCollapse] = useState(false);
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const collapseName = pathname.split('/').slice(1)[0];
  const itemName = pathname.split('/').slice(1)[1];
  // const isMobile = useMediaQuery('(max-width: 1200px');
  const locName = localStorage.getItem('locName');
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const hoAdminValue = localStorage.getItem('isHeadOffice');
  const [isHoAdmin, setIsHoAdmin] = useState(false);
  const headOfficeImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5NVoNKSuXJBytwKCY0bmwxfgTGB38FqJaNDFoCLY&s';

  useEffect(() => {
    if (hoAdminValue === 'true') {
      setIsHoAdmin(true);
    } else {
      setIsHoAdmin(false);
    }
  }, []);

  const closeSidenav = () => {
    setMiniSidenav(dispatch, true);
    // document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener('resize', handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleMiniSidenav);
  }, [dispatch, location]);

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

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse) => {
    const template = collapse.map(({ name, route, key, href }) =>
      href ? (
        <Link key={key} href={href} target="_blank" rel="noreferrer" sx={{ textDecoration: 'none' }}>
          <SidenavItem name={name} nested />
        </Link>
      ) : (
        <NavLink to={route} key={key} sx={{ textDecoration: 'none' }}>
          <SidenavItem name={name} active={route === pathname} nested />
        </NavLink>
      ),
    );

    return template;
  };

  // Render the all the collpases from the routes.js
  const renderCollapse = (collapses) =>
    collapses?.map(({ name, collapse, route, read, href, key }) => {
      let returnValue;
      // console.log("key" , key)
      if (read === true) {
        if (collapse) {
          returnValue = (
            <SidenavItem
              key={key}
              name={name}
              active={key === itemName}
              open={openNestedCollapse === name}
              onClick={() => {
                if (route) {
                  navigate(route);
                }
                openNestedCollapse === name ? setOpenNestedCollapse(false) : setOpenNestedCollapse(name);
              }}
            >
              {renderNestedCollapse(collapse)}
            </SidenavItem>
          );
        } else {
          returnValue = href ? (
            <Link href={href} key={key} target="_blank" rel="noreferrer" sx={{ textDecoration: 'none' }}>
              <SidenavItem name={name} active={key === itemName} />
            </Link>
          ) : (
            <NavLink to={route} key={key} sx={{ textDecoration: 'none' }} onClick={() => reduxDispatch(resetCommonReduxState())}>
              <SidenavItem name={name} active={key === itemName} />
            </NavLink>
          );
        }
      } else {
        returnValue = null;
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, collapse, noCollapse, key, href, route, read, write }) => {
      let returnValue;
      if (read === true) {
        if (type === 'collapse') {
          if (href) {
            returnValue = (
              <Link href={href} key={key} target="_blank" rel="noreferrer" sx={{ textDecoration: 'none' }}>
                <SidenavCollapse name={name} icon={icon} active={key === collapseName} noCollapse={noCollapse} />
              </Link>
            );
          } else if (noCollapse) {
            returnValue = (
              <NavLink to={route} key={key}>
                <SidenavCollapse name={name} icon={icon} noCollapse={noCollapse} active={key === collapseName}>
                  {collapse ? renderCollapse(collapse) : null}
                </SidenavCollapse>
              </NavLink>
            );
          } else {
            returnValue = (
              <SidenavCollapse
                key={key}
                name={name}
                icon={icon}
                active={key === collapseName}
                open={openCollapse === key}
                // onClick={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}
                onClick={() => {
                  if (route) {
                    navigate(route);
                  }
                  openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key);
                }}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            );
          }
        } else if (type === 'divider') {
          returnValue = <Divider key={key} />;
        }
      } else {
        returnValue = null;
      }

      return returnValue;
    },
  );

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <SoftBox pt={3} pb={1} px={4} textAlign="center">
        <SoftBox
          display={{ xs: 'block', xl: 'none' }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: 'pointer' }}
        >
          <SoftTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: 'bold' }}>close</Icon>
          </SoftTypography>
        </SoftBox>
        <SoftBox
          component={NavLink}
          to="/AllOrg_loc"
          // display="flex"
          alignItems="center"
          height="56.3px"
          overflow="hidden !important"
        >
          {brand && (
            <SoftBox
              component="img"
              src={isHoAdmin ? headOfficeImage : brand}
              alt=""
              sx={{
                bgcolor: 'transperent',
                borderRadius: 2,
                height: '80px',
                width: '80px',
                objectFit: 'contain',
              }}
            />
          )}
          <SoftBox
            // width={!brandName && "100%"}
            width="100%"
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            {/* <LightTooltip title={brandName} placement="bottom-end">
              <SoftTypography component="h2" variant="h5" fontWeight="medium">
                {brandName}
              </SoftTypography>
            </LightTooltip> */}
            {locName && (
              <LightTooltip title={locName === 'undefined' ? orgId : locName} placement="bottom-end">
                <SoftTypography
                  style={{
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'initial',
                    backgroundColor: 'honeydew',
                    borderRadius: '8px',
                    margin: '5px',
                  }}
                  fontWeight="medium"
                >
                  <LocationOnIcon style={{ marginLeft: '-20px', marginRight: '5px', fontSize: 'medium' }} />
                  {locName === 'undefined' ? orgId : locName}
                </SoftTypography>
              </LightTooltip>
            )}
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <Divider />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: 'info',
  brand: '',
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
