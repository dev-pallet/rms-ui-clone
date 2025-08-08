import '../../vendor/components/addvendor/addvendor.css';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LocAddressDetail from './adress-info';
import LocBasicDetail from './basic-info';
import LocContactDetail from './contact-info';
import SoftBox from '../../../../components/SoftBox';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import breakpoints from '../../../../assets/theme/base/breakpoints';

const LocDetailTab = () => {
  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  });

  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener('resize', handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 0) {
      setStatus({
        tab1: true,
        tab2: false,
        tab3: false,
      });
    } else if (newValue == 1) {
      setStatus({
        tab1: false,
        tab2: true,
        tab3: false,
      });
    } else {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: true,
      });
    }
  };

  const handleTab = (val) => {
    if (val == 1) {
      setTabValue(val);
      setStatus({
        tab1: false,
        tab2: true,
        tab3: false,
      });
    }
    if (val == 2) {
      setTabValue(val);
      setStatus({
        tab1: false,
        tab2: false,
        tab3: true,
      });
    }
    if (localStorage.getItem('add-vendor-product')) {
      localStorage.removeItem('add-vendor-product');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('add-vendor-product') || localStorage.getItem('vendorIdForProductPortfolioFromSku')) {
      handleTab(1);
    }

  }, []);
    
  return (
    <>
      <SoftBox
        className="bg-url"
        display="flex"
        justifyContent="flex-start"
        position="relative"
        minHeight="6.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${'https://i.postimg.cc/hvjSRvvW/pngtree-simple-light-blue-background-image-396574.jpg'})`,
        }}
      />
      <Card
        sx={{
          backdropFilter: 'saturate(200%) blur(30px)',
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: 'relative',
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center" >
          <Grid item xs={12} md={6} lg={6}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: 'transparent' }}
                className="tabs-box"
              >
                <Tab sx={{ width: '350px', fontSize: '16px' }} label="Basic Details" />
                <Tab sx={{ width: '350px', fontSize: '16px' }} label="Contact Details" />
                <Tab sx={{ width: '350px', fontSize: '16px' }} label="Address Details"/>     
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
      <SoftBox className="add-vendor-tab">
        {status.tab1 ? <LocBasicDetail handleTab={handleTab}></LocBasicDetail> : null}
        {status.tab2 ? <LocContactDetail handleTab={handleTab}></LocContactDetail> : null}
        {status.tab3 ? <LocAddressDetail handleTab={handleTab}></LocAddressDetail> : null}
      </SoftBox>
    </>
  );
};

export default LocDetailTab;
