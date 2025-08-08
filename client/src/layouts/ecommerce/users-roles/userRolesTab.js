import '../vendor/components/addvendor/addvendor.css';
import { useEffect, useState } from 'react';
import ActiveUserroles from './activeUser';
import Addstaff from '../add-staff';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import DeactiveUserroles from './deactiveUser';
import Grid from '@mui/material/Grid';
import SoftBox from '../../../components/SoftBox';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import UserRolesFilter from './Filter/userRolesFilter';
import breakpoints from '../../../assets/theme/base/breakpoints';

export default function UserRolesTab () {
  const [onClear, setOnClear] =useState(false);
  const [isApplied,setIsApplied]=useState(false);
  const [selectedUserRoles,setSelectedUserRoles] = useState([]);

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
    if (val == 0) {
      setTabValue(val);
      setStatus({
        tab1: true,
        tab2: false,
        tab3: false,
      });
    }
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
        bgColor="info"
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
        <Grid container spacing={3} alignItems="center" >
          <Grid item xs={12} md={6} lg={6}>
            <AppBar position="static" className='content-space-between'>
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: 'transparent'}}
                className="tabs-box"
              >
                <Tab sx={{ width: '250px', fontSize: '16px' }} label="Active Users" />
                <Tab sx={{ width: '250px', fontSize: '16px' }} label="Deactive Users" />   
                <Tab sx={{ width: '250px', fontSize: '16px' }} label="Add User" />   
              </Tabs>
            </AppBar>
          </Grid>
          {status.tab1  && 
                <Grid item xs={12} md={6} lg={6}> 
                  <SoftBox sx={{float:'right'}}>
                    <UserRolesFilter 
                      selectedUserRoles={selectedUserRoles}
                      setSelectedUserRoles={setSelectedUserRoles}
                      setIsApplied={setIsApplied}
                      // filterObject={filterObject} // payload
                      setOnClear={setOnClear} // update the clear status when clear is clicked in filter
                      // fn 
                    />
                  </SoftBox>
                </Grid>
          }
        </Grid>
      </Card>
      <SoftBox className="add-vendor-tab">
        <SoftBox>

          {status.tab1 ? <ActiveUserroles handleTab={handleTab} isApplied={isApplied} setIsApplied={setIsApplied} onClear={onClear} setOnClear={setOnClear} selectedUserRoles={selectedUserRoles}></ActiveUserroles> : null}
          {status.tab2 ? <DeactiveUserroles handleTab={handleTab}></DeactiveUserroles> : null}
          {status.tab3 ? <Addstaff handleTab={handleTab}></Addstaff> : null}
        </SoftBox>
      </SoftBox>
    </>
  );
}
