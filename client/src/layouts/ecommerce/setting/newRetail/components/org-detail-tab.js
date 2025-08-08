import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import OrgAddressInfo from './address-info';
import OrgBasicInfo from './basic-info';
import OrgContactInfo from './contact-info';
import SoftBox from '../../../../../components/SoftBox';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import breakpoints from '../../../../../assets/theme/base/breakpoints';

const OrgDetailTab = () => {
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
  };

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
          backgroundImage: `url(${'https://png.pngtree.com/background/20210712/original/pngtree-blue-abstract-background-picture-image_1170267.jpg'})`,
          // https://i.postimg.cc/hvjSRvvW/pngtree-simple-light-blue-background-image-396574.jpg        
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
        <Grid container spacing={3} alignItems="center">
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
                <Tab sx={{ width: '350px', fontSize: '16px' }} label="Address Details" />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
      <SoftBox className="add-vendor-tab">
        {status.tab1 ? <OrgBasicInfo handleTab={handleTab}></OrgBasicInfo> : null}
        {status.tab2 ? <OrgContactInfo handleTab={handleTab}></OrgContactInfo> : null}
        {status.tab3 ? <OrgAddressInfo handleTab={handleTab}></OrgAddressInfo> : null}
      </SoftBox>
    </>
  );
};

export default OrgDetailTab;
