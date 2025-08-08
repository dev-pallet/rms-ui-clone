import { fetchingSideBarApps } from './AlreadyInstalledApp';
import { AccountController, apps_integerationData, fetchAccoutidbyOrg, fetchInstalledApps } from './config/Services';
import { useEffect, useState } from 'react';

export function AccountIdCreation() {
  const [installedPackageNames, setInstalledPackageNames] = useState([]);
  const fullName = localStorage.getItem('user_name');
  const nameArray = fullName && fullName.split(' ');
  const firstName = nameArray && nameArray[0];
  const lastName = nameArray && nameArray[nameArray.length - 1];
  const user_details = localStorage.getItem('user_details');
  const createdById = user_details && JSON.parse(user_details).uidx;
  const payload = {
    firstName: firstName,
    lastName: lastName,
    createdBy: createdById,
    createdByName: fullName,
  };

  const AccountId = localStorage.getItem('AppAccountId');

  const orgId = localStorage.getItem('orgId');
  fetchAccoutidbyOrg(orgId)
    .then((res) => {
      const accId = res?.data?.data?.data?.responses[0]?.accountId;
      localStorage.setItem('AppAccountId', res?.data?.data?.data?.responses[0]?.accountId);
      // appdata
      apps_integerationData(orgId)
        .then((res) => {
          const addonData = res?.data?.data?.data;
          // installedappsdata
          fetchInstalledApps(accId)
            .then((res) => {
              const installedAppData = res?.data?.data?.data;

              const installedPackageNames = installedAppData
                .map(installed => addonData.find(addon => addon.addonId === installed.addonId))
                .filter(matchingAddon => matchingAddon !== undefined)
                .map(matchingAddon => matchingAddon.packageName);

              setInstalledPackageNames(installedPackageNames); // Update the state here
            })
            .catch((err) => {
              
            });
        })
        .catch((err) => {
          
        });
    })
    .catch((err) => {
     
    });
}

