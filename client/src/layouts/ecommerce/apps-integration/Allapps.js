import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { AppBar, Card, Grid, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftInput from '../../../components/SoftInput';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from '../../../components/SoftTypography';
import { filterAddonsApi } from '../../../config/Services';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';

const Allapps = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [AppData, SetAppData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resultApp = localStorage.getItem('Apps');
  const resultArray = resultApp?.split(',');
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState('MONTHLY');
  const handleButtonClick = (componentName) => {
    setValue(componentName);
  };
  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });

  const isMobile = window.innerWidth <= 768;

  // console.log(value);

  useEffect(() => {
    const billingCycle = value;
    // apps_integerationData()
    filterAddonsApi(billingCycle)
      .then((res) => {
        SetAppData(res?.data?.data?.data);
      })
      .catch((err) => {});
  }, [value]);

  const appDataArray = Array.isArray(AppData) ? AppData : [];


  const result = appDataArray
    .filter((e) => e.addonId !== null)
    .map((e) => {
      return {
        name: e.packageName ?? '',
        urlName: e.packageName ? e.packageName.replace(/\s+/g, '_') : '',
        category: e.category ? e.category.split(',').map((category) => category.trim()) : [],
        shortdescription: e.shortDescription ?? '',
        chargeable: e?.chargeable,
        description:
          'A mobile app that helps you efficiently manage and track inventory in your warehouse. It allows you to easily push pallets to their designated locations and keep a record of stock movements.',
        img: e.logoUrl ?? '',
      };
    });


  const handleCardClick = (appName, appDescription) => {
    navigate(`/app/${appName}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredAppnames = result?.filter((app) => {
    const appNameMatches = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatches =
      selectedCategory === 'All' ||
      (app.category && app.category.some((category) => selectedCategory.includes(category)));
    return appNameMatches && categoryMatches;
  });


  const optiondata = [
    { value: 'All', label: 'All' },
    { value: 'Sales Channel', label: 'Sales Channel' },
    { value: 'Pallet', label: 'Pallet' },
    { value: 'Accounting and Finance', label: 'Accounting and Finance' },
    { value: 'Payments', label: 'Payments' },
    { value: 'Pallet Hyperlocal', label: 'Pallet Hyperlocal' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Google Merchant Center', label: 'Google Merchant Center' },
  ];

  const onCategoryChange = (event) => {
    setSelectedCategory(event.value);
  };
  const installedTagStyle = {
    backgroundColor: '#4fab35',
    borderRadius: '4px',
    padding: '2px 4px',
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    float: 'right',
  };
  const chargableTagStyle = {
    backgroundColor: '#edeef0',
    borderRadius: '6px',
    padding: '2px 4px',
    width: '70px',
    textAlign: 'center',
    // color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    float: 'right',
  };

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
      <DashboardNavbar
        Appsearch={
          <div style={{ marginRight: '20px' }}>
            <SoftInput
              placeholder="Search Apps"
              icon={{ component: 'search', direction: 'left' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        }
      />

      <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '15px' }}>
        <SoftBox
        // initial={{ opacity: 0, y: 0, x: -50 }}
        // whileInView={{ opacity: 1, y: 0, x: 10 }}
        // transition={{ duration: 0.5 }}
        >
          <SoftBox className="heading">App Market</SoftBox>
          <p style={{ color: 'rgb(110, 118, 128)', fontSize: '1rem' }}>
            Explore {result?.length} apps in App Marketplace.
          </p>
        </SoftBox>

        <SoftBox style={{ maxWidth: '16rem', marginTop: '10px', marginLeft: 'auto' }}>
          <SoftSelect
            options={optiondata}
            placeholder="Category"
            onChange={onCategoryChange}
            menuPortalTarget={document.body}
          />
        </SoftBox>
      </SoftBox>

      <Grid item xs={12} md={6} lg={5} style={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }}>
        <AppBar
          position="static"
          style={{ backgroundColor: '#e4eaf0', width: isMobile ? '100%' : '40%', borderRadius: '5px' }}
        >
          <Tabs
            orientation={tabsOrientation}
            value={tabValue}
            onChange={handleSetTabValue}
            sx={{ background: 'transparent' }}
          >
            <Tab label="Monthly" onClick={() => handleButtonClick('MONTHLY')} />
            <Tab label="ANNUAL" onClick={() => handleButtonClick('ANNUAL')} />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid container spacing={2} style={{ padding: '30px' }}>
        {filteredAppnames?.map((e, i) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={i}>
            <div
            // initial={{ opacity: 0, y: 0, scale: 0.95 }}
            // whileInView={{ opacity: 1, y: 0, scale: 1 }}
            // transition={{ duration: 0.2 }}
            >
              <Card elevation={6} className="app-card" onClick={() => handleCardClick(e.name, e.description)}>
                <div>
                  <img src={e.img} height={40} style={{ marginRight: '15px' }} />
                  {resultArray?.includes(e.name) ? <span style={installedTagStyle}>Installed</span> : null}
                  <SoftBox style={{ fontSize: '1.1rem', fontWeight: '500', color: '#2b2928', marginTop: '2px' }}>
                    {e.name}
                    <div style={{ display: 'flex', marginLeft: '4rem', marginTop: '-5px' }}>
                      {e?.cardinfo?.map((item) => (
                        <SoftTypography
                          style={{
                            backgroundColor: '#edf0f2',
                            borderRadius: '7px',
                            width: 'fit-content',
                            height: 'fit-content',
                            marginRight: '1rem',
                            paddingRight: '0.3rem',
                            paddingLeft: '0.4rem',
                          }}
                        >
                          {item}
                        </SoftTypography>
                      ))}
                    </div>
                  </SoftBox>
                </div>
                <p style={{ paddingTop: '15px', paddingBottom: '25px' }}>{e.shortdescription}</p>

                <SoftBox style={{ display: 'flex' }}>
                  <SoftTypography style={chargableTagStyle}>
                    {e?.chargeable ? (
                      <>
                        <MonetizationOnIcon /> PAID
                      </>
                    ) : (
                      'FREE'
                    )}
                  </SoftTypography>{' '}
                  {/* <SoftBox style={{ marginLeft: 'auto', display: 'flex' }}>
                <p style={{ fontSize: '15px', color: 'rgb(253, 177, 12)' }}>
                  <StarIcon />{' '}
                </p>
                <SoftTypography>4</SoftTypography>
              </SoftBox> */}
                </SoftBox>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>

      <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {result?.length === 0 && <SoftTypography> No Apps available</SoftTypography>}
      </SoftBox>
    </DashboardLayout>
  );
};

export default Allapps;
