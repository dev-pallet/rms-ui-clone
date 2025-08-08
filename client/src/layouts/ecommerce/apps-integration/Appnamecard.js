import './Appnamecard.css';
import {
  AppsInstall,
  UninstallApps,
  activateAddons,
  activateSubscriptionForPricingPlans,
  apps_integerationData,
  fetchInstalledApps,
  fetchTallyConfig,
  filterTallyConfiguredData,
} from '../../../config/Services';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { getInstalledApps, getRecommendedApps, setInstalledApps } from '../../../datamanagement/recommendedAppSlice';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import InstalledApps from './InstalledApp';
import Loyalitysettings from './LoyalitySettings/Loyalitysettingspage';
import Modal from '@mui/material/Modal';
import MuiAlert from '@mui/material/Alert';
import PosNewDashboard from './Pos/PosNewDashboard';
import React from 'react';
import SalesChannelApps from './SalesChannelApps';
import Settingspage from './Settingpages';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import StarIcon from '@mui/icons-material/Star';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import breakpoints from 'assets/theme/base/breakpoints';

import { textFormatter } from '../Common/CommonFunction';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import Allorders from '../sales/all-orders';
import CouponNewDashboard from './CouponSettings/CouponNewDashboard';
import Filter from '../Common/Filter';
import RemoveIcon from '@mui/icons-material/Remove';
import SettingsIcon from '@mui/icons-material/Settings';
import Spinner from '../../../components/Spinner';
import Swal from 'sweetalert2';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SyncLogTable from './Tally/components/SyncLog';
import Tally from './Tally';
import useAllRoutes from '../../../hooks/useAllRoutes';
import useRazorpay from 'react-razorpay';

const Appnamecard = ({ name, description, reloadInstalledApps, setReloadInstalledApps }) => {
  const {allRoutes}=useAllRoutes();
  const dispatchEvent = useDispatch();
  const allApps = useSelector(getInstalledApps);

  const showSnackbar = useSnackbar();
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));
  const isEnterprise = localStorage.getItem('isEnterprise');

  const Razorpay = useRazorpay();
  const node_env = process.env.MY_ENV;

  const [enterpriseCheck, setEnterpriseCheck] = useState(false);
  const [syncLogLoader, setSyncLogLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [manualSync, setManualSync] = useState(false);
  const [openTallySyncOptionsModal, setOpenTallySyncOptionsModal] = useState(false);
  const [configuredTally, setConfiguredTally] = useState(false);
  const [reload, setReload] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openTally, setOpenTally] = useState(false);
  const [addonLoader, setAddonLoader] = useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [showMore, setShowMore] = useState(false);
  const [addon, SetAddOn] = useState();
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const { AddonId } = useParams();
  const [appDetails, setAppDetails] = useState({
    imgurl: addon?.logoUrl,
    overview: addon?.overview,
    features: addon?.description?.split('.'),
    shortDescription: addon?.shortDescription,
  });

  const [appData, setAppData] = useState([]);
  const [availableApps, setAvailableApps] = useState([]);

  useEffect(() => {
    const data = appData?.map((item) => item?.packageName);
    setAvailableApps(data || []);
  }, [appData]);

  const [totalInstalled, setTotalInstalled] = useState([]);
  const [handleClick, setHandleClick] = useState('');
  6;
  const [openAddonModal, setOpenAddonModal] = useState(false);
  const [addonQty, setAddonQty] = useState(1);

  const [openUninstallModal, setOpenUninstallModal] = useState(false);

  const user = localStorage.getItem('user_name');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const AccountId = localStorage.getItem('AppAccountId');
  const orgId = localStorage.getItem('orgId');

  const handleCloseTallyOptionsModal = () => {
    setOpenTallySyncOptionsModal(false);
    setManualSync(false);
  };

  const handleOfllineTally = () => {
    // console.log('trigger');
    setOpenTally(true);
    setOpenTallySyncOptionsModal(false);
  };

  useEffect(() => {
    const pricingPageTabExist = localStorage.getItem('pricingPageTabVal');
    if (pricingPageTabExist !== null) {
      localStorage.removeItem('pricingPageTabVal');
    }
  }, []);

  useEffect(() => {
    apps_integerationData()
      .then((res) => {
        setAppData(res?.data?.data?.data);
        getAddonByPackageName(AddonId || name);
      })
      .catch((err) => {});

    const AccountId = localStorage.getItem('AppAccountId');

    const fetchPayload = {
      accountId: AccountId,
    };
    fetchInstalledApps(fetchPayload)
      .then((res) => {
        setTotalInstalled(res?.data?.data?.data);
      })
      .catch((err) => {});
  }, [handleClick]);

  useEffect(() => {
    const AccountId = localStorage.getItem('AppAccountId');

    const fetchPayload = {
      accountId: AccountId,
    };
    fetchInstalledApps(fetchPayload)
      .then((res) => {
        setTotalInstalled(res?.data?.data?.data);
      })
      .catch((err) => {});
  }, [reload]);

  useEffect(() => {
    getAddonByPackageName(AddonId || name);
  }, [appData]);

  // console.log('recomendedAppData', appData);
  // console.log('toalInsatalled', totalInstalled);
  // console.log('AppDetails', appDetails);
  // console.log('addon', addon);

  function getAddonByPackageName(name) {
    if (!appData || appData.length === 0) {
      return undefined;
    }

    for (const addons of appData) {
      if (addons.packageName === name) {
        SetAddOn(addons);
        setAppDetails({
          imgurl: addons?.logoUrl,
          overview: addons?.overview,
          features: addons?.description?.split('.'),
          shortDescription: addons?.shortDescription,
        });
      }
    }

    return null;
  }

  const featuresToShow = showMore ? appDetails?.features : appDetails?.features?.slice(0, 3);
  // appDetails.features.slice(0, 3);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('description');
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);
  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const recomendedAppData = useSelector(getRecommendedApps);
  // console.log('addon', addon);

  // recomendedAppData.map((app) =>{

  // });
  const openedApp = recomendedAppData.find((app) => app.name === name);
  let recommendedApps = [];

  if (openedApp) {
    const openedAppCategory = openedApp.category;
    recommendedApps = recomendedAppData.filter(
      (app) => app.name !== name && openedAppCategory?.some((category) => app.category?.includes(category)),
    );
  }

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }
    window.addEventListener('resize', handleTabsOrientation);
    handleTabsOrientation();
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

  const handleClose = () => {
    setOpen(false);
    navigate('/apps_integration');
  };

  const handleCardClick = (appName, appDescription) => {
    // //
    // setSelectedApp(appName);
    // //
    // setSelectedAppDescription(appDescription);
    // setOpen(true);
    //
    navigate(`/app/${appName}`);
  };
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const isInstalled = Array.isArray(totalInstalled) && totalInstalled.some((app) => app?.addonId === addon?.addonId);

  // useEffect(() => {
  //   if (isInstalled) {
  //     if (name == 'Tally') {
  //       const isTallyPresent = routes.some((item) => item.name == 'Tally');
  //       if (!isTallyPresent) {
  //         const route = {
  //           ...(permissions?.RETAIL_Reports?.READ ||
  //           permissions?.WMS_Reports?.READ ||
  //           permissions?.VMS_Reports?.READ ||
  //           permissions?.HO_Reports?.READ
  //             ? {
  //                 type: 'collapse',
  //                 name: 'Tally',
  //                 key: 'tally',
  //                 icon: <ImportExportIcon />,
  //                 route: '/app/Tally',
  //                 component: (
  //                   <Appnamecard name={'Tally'} description={"Extend sales through SwiggyMart's online marketplace."} />
  //                 ),
  //                 noCollapse: true,
  //                 layout: 'dashboard',
  //                 read:
  //                   permissions?.RETAIL_Reports?.READ ||
  //                   permissions?.WMS_Reports?.READ ||
  //                   permissions?.VMS_Reports?.READ ||
  //                   permissions?.HO_Reports?.READ,
  //               }
  //             : null),
  //         };
  //         const reportsIndex = routes?.findIndex((item) => item?.name == 'Reports');
  //         if (reportsIndex > 0) {
  //           routes.splice(reportsIndex, 0, route);
  //           return;
  //         }
  //       }
  //     }
  //   }
  // }, [isInstalled]);

  // useEffect(() => {
  //   const AccountId = localStorage.getItem('AppAccountId');

  //   const fetchPayload = {
  //     "accountId": AccountId
  //   }
  //       fetchInstalledApps(fetchPayload)
  //       .then((res) => {
  //         console.log(res?.data?.data)
  //       })
  //       .catch((err) => {});
  // }, []);

  const handleConfirm = () => {
    if (addon.chargeable == true) {
      handleCheckoutTransactions();
    } else {
      handleInstallAddonWithoutTransactions();
    }
  };

  const handleCloseAddonModal = () => {
    setOpenAddonModal(false);
  };

  const handleCloseUninstallModal = () => {
    setOpenUninstallModal(false);
  };

  const startInstall = () => {
    setOpenAddonModal(false);
    setAddonLoader(true);
    setHandleClick('install');
    if (!availableApps.includes(name)) {
      return availableApps;
    }
    const data =  [...allApps];
    data.push(name);
    dispatchEvent(setInstalledApps(data));
    handleopensnack();
    setAlertmessage('Installing ....');
    setTimelineerror('success');

    if (name === 'Pallet push') {
      const app = {
        name: name,
        key: name,
        route: '/marketing/pallet-push',
        component: <Settingspage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
      return;
    } else if (name === 'Pallet POS') {
      const app = {
        name: 'POS',
        key: 'pos',
        route: '/sales_channels/pos',
        component: <PosNewDashboard />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_SalesChannel?.READ ||
          permissions?.WMS_SalesChannel?.READ ||
          permissions?.VMS_SalesChannel?.READ,
      };
      setAddonLoader(false);
      // InstalledApps.unshift(app);
      SalesChannelApps.push(app);
      return;
    } else if (name === 'Mobile App') {
      const app = {
        name: 'Mobile App',
        key: 'mobile_app',
        route: '/sales_channels/mobile_app',
        component: <Allorders mobileApp={true}/>,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_SalesChannel?.READ ||
          permissions?.WMS_SalesChannel?.READ ||
          permissions?.VMS_SalesChannel?.READ,
      };
      setAddonLoader(false);
      SalesChannelApps.unshift(app);
      return;
    }

    if (name === 'Coupons') {
      const app = {
        name: name,
        key: name,
        route: '/marketing/Coupons',
        component: <CouponNewDashboard />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

        Description:
          'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
      return;
      // InstalledApps.push(app);
    } else if (name === 'Loyalty program') {
      const app = {
        name: name,
        key: 'loyaltysettings',
        route: '/marketing/loyaltysettings',
        component: <Loyalitysettings />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

        Description:
          'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
      return;
    } else if (name === 'Swiggy') {
      const app = {
        name: name,
        key: name,
        route: '/loyaltysettings',
        component: <Settingspage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

        Description:
          'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
    } else if (name === 'Amazon') {
      const app = {
        name: name,
        key: name,
        route: '/loyaltysettings',
        component: <Settingspage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

        Description:
          'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
    } else if (name === 'Flipkart') {
      const app = {
        name: name,
        key: name,
        route: '/loyaltysettings',
        component: <Settingspage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

        Description:
          'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
    } else if (name === 'Zomato') {
      const app = {
        name: name,
        key: name,
        route: '/loyaltysettings',
        component: <Settingspage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

        Description:
          'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
    } else if (name === 'Dunzo') {
      const app = {
        name: name,
        key: name,
        route: '/loyaltysettings',
        component: <Settingspage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

        Description:
          'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      };
      setAddonLoader(false);
      InstalledApps.unshift(app);
    } else if (name === 'Stock Transfer' || name === 'Auto Replenishment') {
      return;
    }

    if (!InstalledApps.length) {
      localStorage.setItem('InstalledApps', JSON.stringify(InstalledApps));
      //
    }
    setAddonLoader(false);
  };

  const handleCheckoutTransactions = () => {
    const payload = {
      accountId: AccountId,
      addonId: addon?.addonId,
      status: 'CREATED',
      createdBy: createdById,
      createdByName: user,
      quantity: addonQty,
      currency: 'INR',
      orgId: orgId,
    };
    setLoader(true);
    setAddonLoader(true);
    AppsInstall(payload)
      .then((res) => {
        // console.log('responseAddon', res);
        setLoader(false);
        setAddonLoader(false);
        setOpenAddonModal(false);
      
        const response =  res?.data?.data;
         
        if(response.es == 0){
          const result = res.data.data.data;
          const razorOrderId = result.razorPayGatewayOrderId;
          const razorSubsId = result.razorPaySubscriptionId;
          const referenceId = result.referenceId;
  
          try {
            const options = {
              key:
                node_env === 'development'
                  ? 'rzp_test_zrmNXMjpy3NDog'
                  : node_env === 'stage'
                    ? 'rzp_test_zrmNXMjpy3NDog'
                    : 'rzp_live_sixmo4R7913AMb',
              amount: (parseInt(addon.netPrice) * 100).toString(),
              subscription_id: razorSubsId,
              name: 'Pallet', //your business name
              description: 'Test Transaction',
              image: '/your_logo.jpg',
              order_id: razorOrderId,
              handler: async (resp) => {
                // console.log('razorPaySuccess', resp);
                setOpenAddonModal(false);
                try {
                  if (result.entityType === 'ADDON') {
                    const payload = {
                      referenceId: referenceId,
                    };
                    setAddonLoader(true);
                    const acvtiveResponse = await activateAddons(payload);
  
                    // console.log('activedPlan', acvtiveResponse);
  
                    if (resp?.razorpay_payment_id) {
                      setReload(!reload);
                      setReloadInstalledApps(Boolean(!reloadInstalledApps));
                      startInstall();
                    }
                  }
                  if (result.entityType === 'SUBSCRIPTION') {
                    const payload = {
                      razorPaySubscriptionId: razorSubsId,
                      referenceId: referenceId,
                    };
                    setAddonLoader(true);
                    const acvtiveResponse = await activateSubscriptionForPricingPlans(payload);
  
                    if (resp?.razorpay_payment_id) {
                      startInstall();
                    }
                  }
                } catch (e) {
                  // console.log('error', e);
                }
              },
              // prefill: {
              //   name: 'Gaurav Kumar',
              //   email: 'gaurav.kumar@example.com',
              //   contact: '+919876543210',
              // },
              // notes: {
              //   note_key_1: 'Tea. Earl Grey. Hot',
              //   note_key_2: 'Make it so.',
              // },
              notes: {
                address: 'Razorpay Corporate Office',
              },
              theme: {
                color: '#0562FB',
              },
            };
  
            // console.log('optionsRazorPayment', options);
            const rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (responseFailed) {
              Swal.fire({
                icon: 'error',
                title: 'Payment failed please try again.',
                showConfirmButton: true,
                confirmButtonText: 'Retry',
              }).then(() => {
                navigate('/Allapps');
              });
            });
            rzp1.open();
          } catch (e) {}

        }
        if(response.es == 1){
          setAddonLoader(false);
          showSnackbar(response?.message,'error');
        }

      })
      .catch((err) => {
        setAddonLoader(false);
        showSnackbar('Please try again', 'error');
      });
  };

  const handleInstallAddonWithoutTransactions = () => {
    const payload = {
      accountId: AccountId,
      addonId: addon?.addonId,
      status: 'CREATED',
      createdBy: createdById,
      createdByName: user,
      quantity: addonQty,
      currency: 'INR',
      orgId: orgId,
    };

    setLoader(true);
    setAddonLoader(true);
    AppsInstall(payload)
      .then((res) => {

        const response = res?.data?.data;

        if(response.es == 0){
          if (addon.packageName === 'Tally') {
            setManualSync(false);
            setOpenTallySyncOptionsModal(true);
          }
  
          // window.location.reload();
          startInstall();
          setLoader(false);
          setAddonLoader(false);
          setReload(!reload);
          setReloadInstalledApps(Boolean(!reloadInstalledApps));
        }
        if(response.es == 1){
          setAddonLoader(false);
          showSnackbar(response?.message,'error');
        }
      })
      .catch((err) => {
        setAddonLoader(false);
        showSnackbar('Please try again', 'error');
      });
  };

  const handleInstall = () => {
    const enterpriseSubscriptionCheck = isEnterprise == 'true' ? true : false;

    const routeNames = [
      'Pallet Delhivery',
      'Tally',
      'Zoho Books',
      'Amazon',
      'Flipkart',
      'Zomato',
      'Dunzo',
      'Swiggy',
      'Blinkit',
    ];

    if (enterpriseSubscriptionCheck) {
      if (routeNames.includes(name)) {
        setEnterpriseCheck(true);
        return;
      }
    }

    // if (enterpriseSubscriptionCheck) {
    if (!availableApps.includes(addon.packageName)) {
      return;
    }

    if (addon.chargeable == true) {
      if (addon.quantityModifiable === true) {
        setOpenAddonModal(true);
      }
      if (addon.quantityModifiable === false) {
        handleCheckoutTransactions();
      }
    }

    if (addon.chargeable == false) {
      if (addon.quantityModifiable === true) {
        setOpenAddonModal(true);
      }
      if (addon.quantityModifiable === false) {
        handleInstallAddonWithoutTransactions();
      }
    }
    if (addon.quantityModifiable === true) {
      setOpenAddonModal(true);
    }
    // }
    // else {
    //   setEnterpriseCheck(true);
    // }
  };

  const startUninstall = () => {
    setAddonLoader(true);
    const enterpriseSubscriptionCheck = isEnterprise == 'true' ? true : false;
    if (!enterpriseSubscriptionCheck) {
      setOpenUninstallModal(false);

      const addonIdToFind = addon?.addonId;

      const foundAddon = totalInstalled.find((addons) => addons?.addonId === addonIdToFind);
      const user_details = localStorage.getItem('user_details');
      const createdById = JSON.parse(user_details).uidx;
      const uninstallPayload = {
        accountAddonId: foundAddon?.accountAddonId,
        deletedBy: createdById,
      };

      UninstallApps(uninstallPayload)
        .then((res) => {
          const filteredInstalledApps =  allApps.filter((appName)=>appName !== name);
          localStorage.setItem('Apps', filteredInstalledApps);
          dispatchEvent(setInstalledApps(filteredInstalledApps));

          if (name === 'Pallet POS' || name === 'Mobile App') {
            const findIndex = SalesChannelApps.findIndex((item) => item.name == name);
            // console.log('findIndex', findIndex);
            SalesChannelApps.splice(findIndex, 1);
          }else {
            const findIndex = InstalledApps.findIndex((item) => item.name == name);
            // console.log('findIndex', findIndex);
            InstalledApps.splice(findIndex, 1);
          }
          setAddonLoader(false);

          setReload(!reload);
          setReloadInstalledApps(Boolean(!reloadInstalledApps));
        })
        .catch((err) => {      setAddonLoader(false);
        });
      setHandleClick('uninstall');
    } else {
      setEnterpriseCheck(true);
    }
  };

  const handleUninstall = () => {
    // Swal.fire({
    //   icon: 'warning',
    //   title: 'Are you sure want to unsubscribe.',
    //   showConfirmButton: true,
    //   confirmButtonText: 'Yes',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   cancelButtonText: 'NO',
    // }).then(() => {
    //   startUninstall();
    // });

    if (addon?.chargeable == true) {
      setOpenUninstallModal(true);
    } else {
      startUninstall();
    }
  };

  // console.log("addon",addon)

  const handleConfirmUnistall = () => {
    startUninstall();
  };

  const handleButtonClick = (componentName) => {
    setValue(componentName);
  };

  const prevApps = localStorage.getItem('InstalledApps');
  const appdata = JSON.parse(prevApps);

  const renderComponent = () => {
    switch (value) {
      case 'description':
        return <Description />;
      case 'keyFeatures':
        return <KeyFeatures />;
      case 'instructions':
        return <Instructions />;
      default:
        return null;
    }
  };

  const locId = localStorage.getItem('locId');
  const [alreadyConfigured, setAlreadyConfigured] = useState(false);

  useEffect(() => {
    fetchTallyConfig(orgId, locId).then((res) => {
      // console.log('alreadyConfigured', res);
      if (res?.data?.data?.es === 1) {
        setAlreadyConfigured(false);
      } else if (res?.data?.data?.es === 0) {
        setAlreadyConfigured(true);
      }
    });
  }, []);

  // tally filter apis for configured data
  const [filterSyncData, setFilterSyncData] = useState([]);

  const covertDateAndTime = (date) => {
    const isoDate = new Date(date);

    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const formattedDate = isoDate.toLocaleString('en-US', options);
    return formattedDate;
  };

  const getTallyConfiguredData = async () => {
    const filterObject = {
      page: pageState.page - 1,
      size: pageState.pageSize,
      // sortBy: null,
      // sortOrder: null,
      orgId: orgId,
      locId: [locId],
      // status: [],
      // syncType: null,
      importType: ['VENDOR'],
      syncedTimeFrom: null,
      syncedTimeTo: null,
    };
    try {
      setSyncLogLoader(true);
      const result = await filterTallyConfiguredData(filterObject);
      // console.log('configuredData', result);
      let syncLogData = result.data.data.syncLogList;
      if (syncLogData.length > 0 && result.data.data.es == 0) {
        syncLogData = syncLogData.map((row) => ({
          id: row?.id !== null ? row?.id : '---',
          syncedOn: row?.syncedOn !== null ? covertDateAndTime(row?.syncedOn) : '---',
          type: row?.type !== null ? textFormatter(row?.type) : '---',
          status: row?.status !== null ? textFormatter(row?.status) : '---',
          importType: row?.importType !== null ? textFormatter(row?.importType) : '--',
          created: row?.created !== null ? row?.created : '---',
          altered: row?.altered !== null ? row?.altered : '---',
          deleted: row?.deleted !== null ? row?.deleted : '---',
          combined: row?.combined !== null ? row?.combined : '---',
          ignored: row?.ignored !== null ? row?.ignored : '---',
          errors: row?.errors !== null ? row?.errors : '---',
          syncTimeFrom: row?.syncTimeFrom !== null ? covertDateAndTime(row?.syncTimeFrom) : '---',
          syncTimeTo: row?.syncTimeTo !== null ? covertDateAndTime(row?.syncTimeTo) : '---',
        }));
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: syncLogData || [],
          total: result.data.data.count,
        }));
      } else {
        setSyncLogLoader(false);
        setErrorComing(true);
      }
      setSyncLogLoader(false);
    } catch (err) {
      setSyncLogLoader(false);
      setErrorComing(true);
    }
  };

  useEffect(() => {
    if (alreadyConfigured == true) {
      getTallyConfiguredData();
    }
  }, [alreadyConfigured, pageState.page, pageState.pageSize]);

  const formatDateTime = (dateTimeString) => {
    const formattedDate = new Date(dateTimeString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const formattedTime = new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  const Description = () => {
    return (
      <>
        {name === 'Tally' && isInstalled && alreadyConfigured ? (
          <SoftBox
            className="search-bar-filter-and-table-container"
            sx={{
              overflowX: 'auto',
            }}
          >
            <SoftBox className="search-bar-filter-container">
              <Grid container spacing={2} justifyContent={'space-between'}>
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}></Grid>
                <Grid item>
                  <Box className="layout-table-right-header">
                    <Filter />
                  </Box>
                </Grid>
              </Grid>
            </SoftBox>
            <SyncLogTable
              errorComing={errorComing}
              syncLogLoader={syncLogLoader}
              pageState={pageState}
              setPageState={setPageState}
            />
          </SoftBox>
        ) : (
          <Grid container spacing={3}>
            {appDetails?.overview ? (
              <Grid item xs={12} sm={12} md={12} lg={8} xl={12}>
                {/* <img
    src="http://partners.tyootr.com/Images/apps/quickbooks.jpg"
    alt=""
    style={{ width: '100%', height: 'auto' }}
  /> */}

                <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                  <SoftTypography>Overview</SoftTypography>
                  <SoftTypography style={{ fontSize: '14px' }}>{appDetails?.overview}</SoftTypography>
                </Grid>
                <br />
                <SoftBox>
                  <SoftTypography>Features</SoftTypography>
                  <SoftBox>
                    {/* <SoftTypography style={{ fontSize: '14px' }}>{appDetails?.features}</SoftTypography> */}

                    <ul style={{ marginLeft: '20px' }}>
                      {(featuresToShow || []).map((list, index) => (
                        <li key={index} style={{ fontSize: '14px' }}>
                          {list}
                        </li>
                      ))}
                    </ul>
                    {!showMore ? (
                      <p
                        style={{ fontSize: '13px', color: 'blue', cursor: 'pointer', float: 'right' }}
                        onClick={toggleShowMore}
                      >
                        Read More
                      </p>
                    ) : (
                      <p
                        style={{ fontSize: '13px', color: 'blue', cursor: 'pointer', float: 'right' }}
                        onClick={toggleShowMore}
                      >
                        Read Less
                      </p>
                    )}
                  </SoftBox>
                </SoftBox>

                <br />
              </Grid>
            ) : (
              <div className="typewriter">
                <div className="slide">
                  <i></i>
                </div>
                <div className="paper"></div>
                <div className="keyboard"></div>
              </div>
            )}

            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h6">{description}</Typography>
        </Grid> */}
            {/* <SoftBox>
        <SoftTypography style={{display:""}}>More Apps ...</SoftTypography>
        
        </SoftBox> */}
            {recommendedApps.length > 0 ? (
              <SoftTypography style={{ paddingLeft: '30px' }}>Similar Apps </SoftTypography>
            ) : null}
            <Grid container spacing={2} style={{ padding: '30px' }}>
              {recommendedApps.length > 0
                ? recommendedApps.map((e, i) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={i}>
                    <Card
                      elevation={6}
                      className="app-card"
                      onClick={() => handleCardClick(e.urlName, e.description)}
                    >
                      <div>
                        <img src={e.img} height={40} style={{ marginRight: '15px' }} />

                        <SoftBox style={{ fontSize: '1.2rem', fontWeight: '500', color: '#2b2928' }}>
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
                        <SoftTypography>Paid/Free to Install</SoftTypography>
                        <SoftBox style={{ marginLeft: 'auto', display: 'flex' }}>
                          <p style={{ fontSize: '15px', color: 'rgb(253, 177, 12)' }}>
                            <StarIcon />{' '}
                          </p>
                          <SoftTypography>4</SoftTypography>
                        </SoftBox>
                      </SoftBox>
                    </Card>
                  </Grid>
                ))
                : null}
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  const KeyFeatures = () => {
    return (
      <SoftBox>
        <SoftTypography style={{ fontSize: '1rem' }}>How to get started</SoftTypography>
        <br />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />

        <br />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </SoftBox>
    );
  };

  const Instructions = () => {
    return (
      <Typography variant="h6">
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </Typography>
    );
  };

  const [statusString, setStatusString] = useState('');
  // const determineStatusString = () => {
  //   // if (totalInstalled?.find((app) => app?.addonId === addon?.addonId)) {
  //   //   return 'Unsubscribe';
  //   // } else if (availableApps?.includes(name)) {
  //   //   return 'Install';
  //   // } else {
  //   //   return 'Coming Soon';
  //   // }
  // };

  // useEffect(() => {
  //   const newStatusString = determineStatusString();
  //   setStatusString(newStatusString);
  // }, [totalInstalled, addon, availableApps, name]);

  const handleIncrementAddonQty = () => {
    setAddonQty((prev) => prev + 1);
  };

  const handleDecrementAddonQty = () => {
    if (addonQty <= 1) {
      setAddonQty(1);
    } else {
      setAddonQty((prev) => prev - 1);
    }
  };

  const handleManualSync = () => {
    setManualSync(true);
    setOpenTallySyncOptionsModal(true);
  };

  const handleOfflineTallyManualSync = () => {
    navigate('/tally/manual-sync');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Card style={{ padding: '40px' }}>
        <Grid container spacing={2}>
          <Grid item>
            {appDetails?.imgurl ? (
              <img style={{ width: '100px', marginRight: '20px' }} src={appDetails?.imgurl} />
            ) : (
              <div className="loader"></div>
            )}
          </Grid>
          <Grid item lg={8} xl={8}>
            <SoftTypography> {AddonId || name}</SoftTypography>
            <SoftTypography variant="h6">{appDetails?.shortDescription}</SoftTypography>
            <Grid container>
              {/* <p style={{ fontSize: 'large', color: 'rgb(253, 177, 12)' }}>
                <StarIcon />
              </p> */}
              <SoftTypography style={{ fontSize: '15px' }}>
                {/* 4.0 <span style={{ color: 'gray' }}>(15 reviews)</span>
                <span
                  style={{ display: 'inline-block', borderLeft: '1px solid #ccc', height: '10px', margin: '0 10px' }}
                ></span> */}
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}> Free To Install</span>
              </SoftTypography>
            </Grid>
          </Grid>
          <Grid item style={{ display: 'flex', height: '40px' }}>
            <SoftButton
              color={isInstalled ? 'info' : availableApps.includes(addon?.packageName) ? 'info' : 'secondary'}
              variant="gradient"
              onClick={isInstalled ? handleUninstall : handleInstall}
              style={{ marginLeft: '20px', height: '40px' }}
              className="installbtn"
            >
              {addonLoader ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                <>
                  {isInstalled ? 'Unsubscribe' : availableApps.includes(addon?.packageName) ? 'Install' : 'Coming Soon'}
                  {statusString}
                </>
              )}
            </SoftButton>

            {/* <SoftButton
              variant="gradient"
              color="info"
              style={{ height: '10px', marginLeft: '30px' }}
              className="showdisbtn"
            >
              Get Support <img height="20px" src="https://static.thenounproject.com/png/787610-200.png" />
            </SoftButton> */}
          </Grid>
        </Grid>

        {name === 'Tally' && isInstalled ? (
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            style={
              alreadyConfigured
                ? { display: 'flex', justifyContent: 'space-between', marginTop: '2rem', flexWrap: 'wrap' }
                : {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '2rem',
                  flexWrap: 'wrap',
                }
            }
          >
            {alreadyConfigured && (
              <AppBar
                position="static"
                style={{
                  backgroundColor: '#e4eaf0',
                  width: window.innerWidth <= 650 ? '100%' : '60%',
                  borderRadius: '5px',
                }}
              >
                {' '}
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  sx={{ background: 'transparent' }}
                >
                  <Tab label="Sync History Data For Configured Tally" />
                </Tabs>
              </AppBar>
            )}

            {alreadyConfigured ? (
              <SoftButton className="manual-sync" onClick={handleManualSync}>
                <SyncAltIcon sx={{ marginRight: '0.5rem' }} />
                Manual Sync
              </SoftButton>
            ) : null}
            {!alreadyConfigured ? (
              <SoftButton className="manual-sync" onClick={() => setOpenTally(true)}>
                <SettingsIcon sx={{ marginRight: '0.5rem' }} />
                Configure
              </SoftButton>
            ) : null}
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
          >
            <AppBar
              position="static"
              style={{
                backgroundColor: '#e4eaf0',
                width: window.innerWidth <= 650 ? '100%' : '60%',
                borderRadius: '5px',
              }}
            >
              {' '}
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: 'transparent' }}
              >
                <Tab label="About" onClick={() => handleButtonClick('description')} />
                <Tab label="Instruction" onClick={() => handleButtonClick('keyFeatures')} />
                <Tab label="Pricing" onClick={() => handleButtonClick('instructions')} />
              </Tabs>
            </AppBar>

            <div></div>
          </Grid>
        )}

        <hr />

        <Grid item xs={12} sm={8} md={8} lg={8} mt={2} p={2}>
          {status.tab1 ? <Typography variant="h5"></Typography> : null}
          {status.tab2 ? <Typography variant="h5"></Typography> : null}
          {status.tab3 ? <Typography variant="h5"></Typography> : null}

          {renderComponent()}
        </Grid>
        {/* <div style={{ marginTop: '2rem' }}>
          <SoftButton variant="gradient" color="info" onClick={handleInstall}>
            Install
          </SoftButton>
          <SoftButton style={{ marginLeft: '15px' }} onClick={handleClose}>
            Close
          </SoftButton>
        </div> */}

        <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
            {alertmessage}
          </Alert>
        </Snackbar>
      </Card>
      <Modal
        open={openAddonModal}
        onClose={handleCloseAddonModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '50vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '1rem',
          }}
        >
          <Box className="increment-decrement-addon">
            <SoftTypography
              sx={{
                marginTop: '2rem',
                fontSize: '1rem !important',
              }}
            >
              Please add no. of {addon?.packageName} you want
            </SoftTypography>
            <Box
              sx={{
                marginTop: '3rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <RemoveIcon onClick={handleDecrementAddonQty} />
              <SoftTypography>{addonQty}</SoftTypography>
              <AddIcon onClick={handleIncrementAddonQty} />
            </Box>
            <Box
              sx={{
                marginTop: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {loader ? (
                <Spinner />
              ) : (
                <SoftButton
                  onClick={handleConfirm}
                  sx={{
                    backgroundColor: '#0562FB',
                    color: 'white !important',
                    '&:hover': {
                      color: 'black !important',
                    },
                  }}
                >
                  Confirm
                </SoftButton>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openUninstallModal}
        onClose={handleCloseUninstallModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '30vw',
            height: '50vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '1rem',
          }}
        >
          <Box className="caution">
            <SoftTypography
              className="caution-description"
              sx={{
                color: 'red',
              }}
            >
              {/* Caution: */}
              Warning:
            </SoftTypography>
            <SoftTypography
              className="caution-description"
              sx={{
                fontSize: '16px !important',
                lineHeight: '22.85px !important',
                color: '#7c7c7c !important',
              }}
            >
              Dear user refund will not be initiated, are you still want to uninstall your <b>{addon?.packageName}</b>.
              And your subscription will not be renewed after the expiry of your current subscription.
            </SoftTypography>
          </Box>
          <Box className="cancel-save-unintstall">
            <SoftButton onClick={handleCloseUninstallModal}>Cancel</SoftButton>
            <Button
              variant="outlined"
              style={{
                // backgroundColor: '#0562FB',
                color: '#0562FB',
                padding: '7px',
                margin: '10px',
              }}
              onClick={handleConfirmUnistall}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openTallySyncOptionsModal}
        onClose={handleCloseTallyOptionsModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '50vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '1rem',
          }}
        >
          <Box className="tally-options-details">
            <SoftButton
              className="tally-offline"
              onClick={manualSync == false ? handleOfllineTally : handleOfflineTallyManualSync}
            >
              Offline
            </SoftButton>
            <SoftButton className="tally-cloud" disabled={true}>
              Cloud
            </SoftButton>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={enterpriseCheck}
        onClose={() => setEnterpriseCheck(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '50vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '1rem',
            position: 'relative',
          }}
        >
          <Box className="enterprise-not-access">
            <SoftTypography className="billing-details-not-allowed-content">
              You don't have access to this.
            </SoftTypography>
            <SoftTypography className="billing-details-not-allowed-content">
              Please contact your Head office for further details.
            </SoftTypography>
            <SoftButton className="enterprise-not-access-btn" onClick={() => setEnterpriseCheck(false)}>
              Close
            </SoftButton>
          </Box>
        </Box>
      </Modal>
      {/* 
      {openTally && (
        <TallyFormService
          openTally={openTally}
          setOpenTally={setOpenTally}
          alreadyConfigured={alreadyConfigured}
          setAlreadyConfigured={setAlreadyConfigured}
        />
      )} */}
      {openTally && <Tally setOpenTally={setOpenTally} setAlreadyConfigured={setAlreadyConfigured} />}
    </DashboardLayout>
  );
};

export default Appnamecard;
