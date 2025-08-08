import MobileNavbar from '../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import React from 'react';
import SoftBox from '../../../components/SoftBox';

const MobileDashBoard = () => {
  return (
    <SoftBox sx={{padding: '10px',margin: '10px', backgroundColor:'#0562fb',borderRadius: '10px'}}>
      <MobileNavbar title={'DashBoard'} />
    </SoftBox>
  );
};

export default MobileDashBoard;