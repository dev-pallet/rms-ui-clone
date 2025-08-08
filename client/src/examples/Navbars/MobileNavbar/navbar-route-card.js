import React, { memo } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { CircularProgress, Stack, Typography } from '@mui/material';
import SoftBox from '../../../components/SoftBox';

const NavbarRouteCards = memo(
  ({ route, routes, handleOpen, navigation, index, pathname, logoutLoader, expandedRoute }) => {
    return (
      <Accordion
        key={route?.label}
        className="nav-tab-main-wrapper"
        expanded={!!route?.subMenu?.length && expandedRoute === route?.label}
        onClick={() => handleOpen(route?.label)}
        sx={{ borderBottom: index < routes?.length - 1 && '1px solid #c1c1c157' }}
      >
        <AccordionSummary className="sidenav-mob-nav-tab" expandIcon={!!route?.subMenu?.length && <ExpandMoreIcon />}>
          <SoftBox className="sidenav-mob-tab-info">
            <div
              className="nav-icon-div"
              style={{
                border: pathname?.split('/').includes(route?.key) ? '2px solid #0562FB' : '0px solid',
              }}
            >
              {route?.icon}
            </div>
            <Typography className="nav-icon-label">{route?.label}</Typography>
          </SoftBox>
          {/* <SoftBox>
        <KeyboardArrowRightIcon />
      </SoftBox> */}
          {route?.label === 'Log Out' && logoutLoader && <CircularProgress className="cp-lg" />}
        </AccordionSummary>
        <AccordionDetails className="accordion-details-mob">
          {route.subMenu.filter((menu)=>!!menu?.label).map((submenu) => (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap="25px"
              className="submenu-nav-tabs"
              onClick={() => navigation(submenu?.route, {state: {tabValue: submenu?.tabValue,tabName:submenu?.label}})}
              key={submenu?.route}
            >
              {/* <FiberManualRecordIcon
                sx={{ height: 10, width: 10, color: pathname === submenu?.route ? '#0562fb' : '#344767d7' }}
              /> */}
              <Typography
                className="submenu-label"
                sx={{color: pathname === submenu?.route ? '#0562fb !important' :  '#344767d7 !important'}}
              >
                {submenu?.label}
              </Typography>
              <SoftBox className="side-line"></SoftBox>
            </Stack>
          ))}
        </AccordionDetails>
        {/* {index < routes.length - 1 && <hr style={{ opacity: 0.3, width: '90%' }} />} */}
      </Accordion>
    );
  },
);

export default NavbarRouteCards;
