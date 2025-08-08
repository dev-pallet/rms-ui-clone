import ContactlessOutlinedIcon from '@mui/icons-material/ContactlessOutlined';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import PaytmIcon from 'assets/icons/paytm.png';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInstalledApps } from '../datamanagement/recommendedAppSlice';
import Appnamecard from '../layouts/ecommerce/apps-integration/Appnamecard';
import PaytmDashboard from '../layouts/ecommerce/Pallet-pay/PaytmDashboard';
import routes from '../routes';

const useAllRoutes = () => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const installedApps = useSelector(getInstalledApps);
  const [allRoutes, setAllRoutes] = useState(routes);

  const handleGetRoutes = () => {
    const isPinePresent = allRoutes?.some((item) => item.name === 'Pinelabs');
    if (!isPinePresent && installedApps?.includes('Pinelabs')) {
      const route = {
        ...(permissions?.RETAIL_Reports?.READ ||
        permissions?.WMS_Reports?.READ ||
        permissions?.VMS_Reports?.READ ||
        permissions?.HO_Reports?.READ
          ? {
              type: 'collapse',
              name: 'Pinelabs',
              key: 'pineLabs',
              icon: <ContactlessOutlinedIcon />,
              route: '/pallet-pay/pinelabs',
              component: <PaytmDashboard vendorId={'PINELABS'} />,
              noCollapse: true,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Reports?.READ ||
                permissions?.WMS_Reports?.READ ||
                permissions?.VMS_Reports?.READ ||
                permissions?.HO_Reports?.READ,
            }
          : null),
      };
      const reportsIndex = routes?.findIndex((item) => item?.name === 'Reports');
      if (reportsIndex >= 0) {
        setAllRoutes((prevRoutes) => {
          const data = [...prevRoutes];
          data.splice(reportsIndex, 0, route);
          return data;
        });
      }
    } else if (isPinePresent && !installedApps?.includes('Pinelabs')) {
      const newRoutes = allRoutes.filter((route) => route.name !== 'Pinelabs');
      setAllRoutes(newRoutes);
    }
    const isPayTMPresent = allRoutes.some((item) => item.name == 'PayTM');
    if (!isPayTMPresent && installedApps?.includes('PayTM')) {
      const route = {
        ...(permissions?.RETAIL_Reports?.READ ||
        permissions?.WMS_Reports?.READ ||
        permissions?.VMS_Reports?.READ ||
        permissions?.HO_Reports?.READ
          ? {
              type: 'collapse',
              name: 'PayTM',
              key: 'payTM',
              icon: <img src={PaytmIcon} alt="PaytmIcon" style={{ height: '25px', width: 'auto' }} />,
              route: '/pallet-pay/paytm',
              component: <PaytmDashboard vendorId={'PAYTM'} />,
              noCollapse: true,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Reports?.READ ||
                permissions?.WMS_Reports?.READ ||
                permissions?.VMS_Reports?.READ ||
                permissions?.HO_Reports?.READ,
            }
          : null),
      };
      const reportsIndex = allRoutes?.findIndex((item) => item?.name === 'Reports');
      if (reportsIndex >= 0) {
        setAllRoutes((prevRoutes) => {
          const data = [...prevRoutes];
          data.splice(reportsIndex, 0, route);
          return data;
        });
      }
    } else if (isPayTMPresent && !installedApps?.includes('PayTM')) {
      const newRoutes = allRoutes.filter((route) => route.name !== 'PayTM');
      setAllRoutes(newRoutes);
    }

    const isTallyPresent = allRoutes.some((item) => item.name == 'Tally');
    if (!isTallyPresent && installedApps?.includes('Tally')) {
      const route = {
        ...(permissions?.RETAIL_Reports?.READ ||
        permissions?.WMS_Reports?.READ ||
        permissions?.VMS_Reports?.READ ||
        permissions?.HO_Reports?.READ
          ? {
              type: 'collapse',
              name: 'Tally',
              key: 'tally',
              icon: <ImportExportIcon />,
              route: '/app/Tally',
              component: (
                <Appnamecard name={'Tally'} description={"Extend sales through SwiggyMart's online marketplace."} />
              ),
              noCollapse: true,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Reports?.READ ||
                permissions?.WMS_Reports?.READ ||
                permissions?.VMS_Reports?.READ ||
                permissions?.HO_Reports?.READ,
            }
          : null),
      };
      const reportsIndex = allRoutes?.findIndex((item) => item?.name === 'Reports');
      if (reportsIndex >= 0) {
        setAllRoutes((prevRoutes) => {
          const data = [...prevRoutes];
          data.splice(reportsIndex, 0, route);
          return data;
        });
      }
    } else if (isTallyPresent && !installedApps?.includes('Tally')) {
      const newRoutes = allRoutes.filter((route) => route.name !== 'Tally');
      setAllRoutes(newRoutes);
    }
  };

  useEffect(() => {
    handleGetRoutes();
  }, [installedApps]);

  return {
    allRoutes,
  };
};

export default useAllRoutes;
