import './index.css';
import { Box } from '@mui/material';
import BottomNavbar from '../../../../examples/Navbars/BottomNavbarMob';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import OrderDisplayBoard from './orderDisplay';
import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../components/SoftBox';
import breakpoints from 'assets/theme/base/breakpoints';

const isMobile = window.innerWidth < breakpoints.values.sm;

const OrderDisplaySystem = () => {
  // const [value, setValue] = useState(0);
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  return (
    <DashboardLayout>
      {!isMobile && <DashboardNavbar prevLink={true} />}
      {/* {isMobile && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'ODS'} />
        </SoftBox>
      )} */}
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <Box className="ods-container" sx={{ marginTop: isMobile && '20px' }}>
        <Box className="ods-board-container">
          <OrderDisplayBoard
            setTimelineerror={setTimelineerror}
            setAlertmessage={setAlertmessage}
            handleopensnack={handleopensnack}
          />
        </Box>
        {/* <Box
          style={{
            display: isMobile ? 'none' : 'block',
            position: 'fixed',
            bottom: 0,
            width: '80%',
            // left: 0,
            // right: 2,
            borderRadius: '10px !important',
            backgroundColor: '#fff !important',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
        >
          <BottomNavigation
            showLabels
            // value={value}
            // onChange={(event, newValue) => {
            //   setValue(newValue);
            // }}
          >
            <BottomNavigationAction label="Sridhar" icon={<PersonIcon color="success" />} />
            <BottomNavigationAction label="Ashok" icon={<PersonIcon color="info" />} />
            <BottomNavigationAction label="Zeeshan" icon={<PersonIcon color="warning" />} />
            <BottomNavigationAction label="Chandramukhi" icon={<PersonIcon color="error" />} />
            <BottomNavigationAction label="Anthony" icon={<PersonIcon color="error" />} />
            <SoftBox style={{ alignItems: 'center', padding: '5px' }}>
              <SoftButton className="vendor-add-btn"> Pause Online Order</SoftButton>
            </SoftBox>
          </BottomNavigation>
        </Box> */}
      </Box>
      {/* {isMobile && <BottomNavbar />} */}
    </DashboardLayout>
  );
};

export default OrderDisplaySystem;
