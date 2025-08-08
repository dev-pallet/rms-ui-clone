import { useEffect, useState } from 'react';
import { AllreadyInstalledApps } from './layouts/ecommerce/apps-integration/AllreadyInstalledApps';
import { apps_integerationData, fetchInstalledApps } from './config/Services';
import { useDispatch } from 'react-redux';
import { setInstalledApps } from './datamanagement/recommendedAppSlice';

export function fetchingSideBarApps(accountId) {
  const [totalInstalled, setTotalInstalled] = useState([]);
  const [appData, setAppData] = useState([]);
  // localStorage.setItem('AppAccountId', "AO00001");
  const AccountId = localStorage.getItem('AppAccountId');
  const dispatchEvent = useDispatch()


  if (AccountId !== null) {
    useEffect(() => {
      let isMounted = true;

      const fetchInstalledApps1 = async (fetchPayload) => {
        try {
          const res = await fetchInstalledApps(fetchPayload);
          if (isMounted) {
            setTotalInstalled(res?.data?.data?.data);
          }
        } catch (err) {}
      };

      const apps_integerationData1 = async () => {
        try {
          const res = await apps_integerationData();
          if (isMounted) {
            setAppData(res?.data?.data?.data);
          }
        } catch (err) {}
      };

      apps_integerationData1();
      const fetchPayload = {
        accountId: accountId,
      };
      fetchInstalledApps1(fetchPayload);

      return () => {
        isMounted = false;
      };
    }, []);

    //   function findMatchingPackageNames(TotalInstalledArray, appData) {
    //     const matchingPackageNames = [];
    //     TotalInstalledArray?.forEach((installedAddon) => {
    //       const matchingAddon = appData?.find((addon) => addon?.addonId === installedAddon?.addonId);

    //       if (matchingAddon) {
    //         matchingPackageNames?.push(matchingAddon?.packageName);
    //       }
    //     });
    //     return matchingPackageNames;
    //   }

    function findMatchingPackageNames(TotalInstalledArray, appData) {
      const matchingPackageNames = [];
      if (appData?.addonId !== null) {
        const installedAddons = Array.isArray(TotalInstalledArray)
          ? TotalInstalledArray
          : Object.values(TotalInstalledArray || {});
        installedAddons.forEach((installedAddon) => {
          const matchingAddon = appData?.find((addon) => addon?.addonId === installedAddon?.addonId);

          if (matchingAddon) {
            matchingPackageNames.push(matchingAddon.packageName);
          }
        });

        return matchingPackageNames;
      }
    }
    const result = findMatchingPackageNames(totalInstalled, appData);

    localStorage.setItem('Apps', result);
    dispatchEvent(setInstalledApps(result))

    useEffect(() => {
      AllreadyInstalledApps(result);
    }, [result]);
  }
}
