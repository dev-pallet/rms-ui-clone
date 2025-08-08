import Allorders from '../sales/all-orders';
import Appnamecard from './Appnamecard';
import CouponNewDashboard from './CouponSettings/CouponNewDashboard';
import InstalledApps from './InstalledApp';
import Loyalitysettings from './LoyalitySettings/Loyalitysettingspage';
import PosNewDashboard from './Pos/PosNewDashboard';
import SalesChannelApps from './SalesChannelApps';
import Settingspage from './Settingpages';

export function AllreadyInstalledApps(data, reloadInstalledApps, setReloadInstalledApps) {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  if (Array.isArray(data) && data.length >= 0 && data !== undefined) {
    data?.map((name) => {
      if (name === 'Pallet push') {
        const app = {
          name: name,
          key: name,
          route: '/marketing/pallet-push',
          component: <Settingspage />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ ||
            permissions?.WMS_Marketing?.READ ||
            permissions?.VMS_Marketing?.READ ||
            permissions?.HO_Marketing?.READ,
        };
        // InstalledApps.push(app);
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
            permissions?.VMS_SalesChannel?.READ ||
            permissions?.HO_Marketing?.READ,
        };
        const appExistsInSalesChannel = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInSalesChannel) {
          SalesChannelApps.push(app);
        }
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
            permissions?.VMS_SalesChannel?.READ ||
            permissions?.HO_Marketing?.READ,
        };
        const appExistsInSalesChannel = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInSalesChannel) {
          SalesChannelApps.push(app);
        }
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
            permissions?.RETAIL_Marketing?.READ ||
            permissions?.WMS_Marketing?.READ ||
            permissions?.VMS_Marketing?.READ ||
            permissions?.HO_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        const appExistsInInstalledApps = InstalledApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          InstalledApps.push(app);
        }
      }
      //  else if (name === 'Tally') {
      //   const app = {
      //     name: 'Tally',
      //     key: 'tally',
      //     route: `/app/Tally`,
      //     component: (
      //       <Appnamecard
      //         name={'Tally'}
      //         description={"Extend sales through SwiggyMart's online marketplace."}
      //         reloadInstalledApps={reloadInstalledApps}
      //         setReloadInstalledApps={setReloadInstalledApps}
      //       />
      //     ),
      //     layout: 'dashboard',
      //     read:
      //       permissions?.RETAIL_Reports?.READ ||
      //       permissions?.WMS_Reports?.READ ||
      //       permissions?.VMS_Reports?.READ ||
      //       permissions?.HO_Reports?.READ,
      //     Description:
      //       'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      //   };
      // }
      else if (name === 'Loyalty program') {
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
        const appExistsInInstalledApps = InstalledApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          InstalledApps.push(app);
        }
      } else if (name === 'Swiggy') {
        const app = {
          name: name,
          key: name,
          route: '/app/Swiggy',
          component: (
            <Appnamecard name={'Swiggy'} description={'Extend sales through SwiggyMart\'s online marketplace.'} />
          ),
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        const appExistsInInstalledApps = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          SalesChannelApps.push(app);
        }
      } else if (name === 'Amazon') {
        const app = {
          name: name,
          key: name,
          route: '/app/Amazon',
          component: (
            <Appnamecard name={'Amazon'} description={'Enhance sales by listing products on Amazon Pantry.'} />
          ),
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        const appExistsInInstalledApps = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          SalesChannelApps.push(app);
        }
      } else if (name === 'Flipkart') {
        const app = {
          name: name,
          key: name,
          route: '/app/Flipkart',
          component: (
            <Appnamecard name={'Flipkart'} description={'Boost sales by selling products on the Flipkart platform.'} />
          ),
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        const appExistsInInstalledApps = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          SalesChannelApps.push(app);
        }
      } else if (name === 'Zomato') {
        const app = {
          name: name,
          key: name,
          route: '/app/Zomato',
          component: (
            <Appnamecard name={'Zomato'} description={'Tap into Zomato\'s customer base for increased sales.'} />
          ),
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        const appExistsInInstalledApps = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          SalesChannelApps.push(app);
        }
      } else if (name === 'Dunzo') {
        const app = {
          name: name,
          key: name,
          route: '/app/Dunzo',
          component: (
            <Appnamecard name={'Dunzo'} description={'Tap into the delivery services of Dunzo for seamless sales.'} />
          ),
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        const appExistsInInstalledApps = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          SalesChannelApps.push(app);
        }
      } else if (name === 'BlinkIt') {
        const app = {
          name: name,
          key: name,
          route: '/app/BlinkIt',
          component: (
            <Appnamecard name={'BlinkIt'} description={'Utilize BlinkIt to boost sales and reach new customers.'} />
          ),
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        const appExistsInInstalledApps = SalesChannelApps.some((existingApp) => existingApp.name === app.name);

        if (!appExistsInInstalledApps) {
          SalesChannelApps.push(app);
        }
      } else if (name === 'Zoho Books') {
        const app = {
          name: name,
          key: name,
          route: '/app/Zoho_Books',
          component: (
            <Appnamecard
              name={'Zoho Books'}
              description={'Manage accounting and financial processes with Zohobooks.'}
            />
          ),
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

          Description:
            'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
        };
        // const appExistsInInstalledApps = InstalledApps.some((existingApp) => existingApp.name === app.name);

        // if (!appExistsInInstalledApps) {
        //   InstalledApps.push(app);
        // }
      } else if (name === 'Stock Transfer' || name === 'Auto Replenishment') {
        return;
      } 
 
      // else {
      //   const app = {
      //     name: name,
      //     key: name,
      //     route: `/marketing/pallet-push`,
      //     component: <Settingspage />,
      //     layout: 'dashboard',
      //     read:
      //       permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,

      //     Description:
      //       'Connect your Google analytics account to receive all website visitors and conversion data to your account.',
      //   };

      //   const appExistsInInstalledApps = InstalledApps.some((existingApp) => existingApp.name === app.name);

      //   if (!appExistsInInstalledApps) {
      //     InstalledApps.push(app);
      //   }
      // }
    });
  }
}
