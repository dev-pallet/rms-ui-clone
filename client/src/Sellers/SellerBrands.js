import { AppBar, Card, Grid, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import breakpoints from '../assets/theme/base/breakpoints';
import SoftBox from '../components/SoftBox';
import SoftTypography from '../components/SoftTypography';
import DashboardLayout from '../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../examples/Navbars/DashboardNavbar';
import BrandMarketing from './brandComponents/BrandMarketing';
import BrandOwning from './brandComponents/BrandOwning';

const SellerBrands = () => {
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);
  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });
  const brandName = JSON.parse(localStorage?.getItem('BrandMarketing'));
  const noData = (
    <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src="https://www.simsnd.in/assets/admin/no_data_found.png"
        alt="no data found"
        style={{
          minWidth: '150px',
          maxWidth: '350px',
          borderRadius: '15px',
        }}
      />
    </Card>
  );
  const navigate = useNavigate();

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
    } else {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ marginBottom: '15px' }}>
        <div
          className="search-bar-filter-container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <SoftTypography style={{ color: 'white', fontSize: '1rem' }}>Brands</SoftTypography>

          {/* <SoftSelect
            insideHeader={true}
            menuPortalTarget={document.body}
            id="status"
            placeholder="Select brand type"
            options={options}
            isOptionDisabled={(option) => option.isDisabled}
            onChange={(option) => setBrandType(option)}
          ></SoftSelect> */}
        </div>
      </Card>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} style={{ marginLeft: '0px !important' }}>
          <AppBar position="static">
            <Tabs
              orientation={tabsOrientation}
              value={tabValue}
              onChange={handleSetTabValue}
              sx={{ backgroundColor: 'lightgray' }}
              className="tabs-box"
            >
              <Tab
                sx={{ width: '100%', fontSize: '13px' }}
                // label="✅ Brand Owning Company"
                label={brandName?.length > 0 ? '✅ Brand Owning Company' : 'Brand Owning Company'}
              />
              <Tab
                sx={{ width: '100%', fontSize: '13px' }}
                label={brandName?.length > 0 ? 'Brand Marketing Company' : '🚫 Brand Marketing Company'}
                disabled={brandName?.length < 1}
              />
              <Tab sx={{ width: '100%', fontSize: '13px' }} label="Brand" />
              <Tab sx={{ width: '100%', fontSize: '13px' }} label="Sub-Brand" />
            </Tabs>
          </AppBar>
        </Grid>
      </Grid>

      <SoftBox className="add-vendor-tab">
        {status.tab1 ? <BrandOwning /> : null}
        {status.tab2 ? <BrandMarketing /> : null}
        {status.tab3 ? noData : null}
        {status.tab4 ? noData : null}
      </SoftBox>
    </DashboardLayout>
  );
};

export default SellerBrands;
