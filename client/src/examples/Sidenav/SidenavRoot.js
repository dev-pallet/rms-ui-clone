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

// @mui material components
import { useMediaQuery, useTheme } from '@material-ui/core';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, miniSidenav } = ownerState;

  const sidebarWidth = 250;
  const { white, transparent } = palette;
  const { xxl } = boxShadows;
  const { pxToRem } = functions;

  const newtheme = useTheme();
  const isMobile = useMediaQuery(newtheme.breakpoints.down('md'));

  // styles for the sidenav when miniSidenav={false}
  const drawerOpenStyles = () => ({
    transform: 'translateX(0)',
    transition: transitions.create('transform', {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up('xl')]: {
      backgroundColor: transparentSidenav ? white.main : white.main,
      boxShadow: transparentSidenav ? 'none' : xxl,
      marginBottom: transparentSidenav ? 0 : 'inherit',
      left: '0',
      height: 'calc(100vh-1rem) !important',
      width: sidebarWidth,
      transform: 'translateX(0)',
      transition: transitions.create(['width', 'background-color'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // styles for the sidenav when miniSidenav={true}
  const drawerCloseStyles = () => ({
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create('transform', {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up('xl')]: {
      backgroundColor: transparentSidenav ? white.main : white.main,
      boxShadow: transparentSidenav ? 'none' : xxl,
      marginBottom: transparentSidenav ? 0 : 'inherit',
      left: '0',
      width: pxToRem(96),
      height: 'calc(100vh-1rem) !important',
      overflowX: 'hidden',
      transform: 'translateX(0)',
      transition: transitions.create(['width', 'background-color'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    '& .MuiDrawer-paper': {
      boxShadow: xxl,
      border: 'none',
      height: isMobile ? '95%' : 'calc(100vh-2rem)',
      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});
