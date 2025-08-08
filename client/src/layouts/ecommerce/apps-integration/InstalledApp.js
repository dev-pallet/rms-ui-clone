import CampaignPage from './Notification/CampaignPage';
import CampaignTemplates from './Notification/CampaignTemplates/CampaignTemplates';
import ContactPage from './Notification/ContactList/ContactPage';
import MarketingOverview from './Marketing/Overview';
import Notificationsettings from './Notification/Notificationsettings';
import OfferAndPromoList from '../offers-promo';
import Settingspage from './Settingpages';
import WhatsappBusOverview from './WhatsappBusiness/WhatsappBusOverview';

const permission = localStorage.getItem('permissions');
const permissions = permission ? JSON.parse(permission) : null;
const features = localStorage.getItem('featureSettings');
const featureSettings = features ? JSON.parse(features) : null;

const isEnterprise = localStorage.getItem('isEnterprise');

const InstalledAlldApps = [
  {
    name: 'Overview',
    key: 'overview',
    route: '/marketing/overview',
    component: <MarketingOverview />,
    layout: 'dashboard',
    read: permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
  },
  {
    name: 'Pallet push',
    key: 'pallet-push',
    route: '/marketing/pallet-push',
    component: <Settingspage />,
    layout: 'dashboard',
    read: permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
  },
  isEnterprise == 'true' && featureSettings?.['CAMPAIGN'] == 'TRUE'
    ? {
      name: 'Campaigns',
      key: 'campaigns',
      route: '/marketing/campaigns',
      component: <CampaignPage />,
      layout: 'dashboard',
      read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
    }
    : isEnterprise == 'false' && featureSettings?.['CAMPAIGN'] == 'TRUE'
      ? {
        name: 'Campaigns',
        key: 'campaigns',
        route: '/marketing/campaigns',
        component: <CampaignPage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
      }
      : null,
  isEnterprise == 'true' && featureSettings?.['OFFERS_AND_PROMOTION'] == 'TRUE'
    ? {
      name: 'Offers & Promotions',
      key: 'offers-promotions',
      route: '/marketting/offers-promotions',
      component: <OfferAndPromoList />,
      layout: 'dashboard',
      read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
    }
    : isEnterprise == 'false' && featureSettings?.['OFFERS_AND_PROMOTION'] == 'TRUE'
      ? {
        name: 'Offers & Promotions',
        key: 'offers-promotions',
        route: '/marketting/offers-promotions',
        component: <OfferAndPromoList />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
      }
      : null,
  isEnterprise == 'true' && featureSettings?.['AUDIENCE'] == 'TRUE'
    ? {
      name: 'Audience',
      key: 'contacts',
      route: '/marketing/contacts',
      component: <ContactPage />,
      layout: 'dashboard',
      read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
    }
    : isEnterprise == 'false' && featureSettings?.['AUDIENCE'] == 'TRUE'
      ? {
        name: 'Audience',
        key: 'contacts',
        route: '/marketing/contacts',
        component: <ContactPage />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
      }
      : null,
  isEnterprise == 'true' && featureSettings?.['TEMPLATES'] == 'TRUE'
    ? {
      name: 'Templates',
      key: 'templates',
      route: '/marketing/templates',
      component: <CampaignTemplates />,
      layout: 'dashboard',
      read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
    }
    : isEnterprise == 'false' && featureSettings?.['TEMPLATES'] == 'TRUE'
      ? {
        name: 'Templates',
        key: 'templates',
        route: '/marketing/templates',
        component: <CampaignTemplates />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
      }
      : null,
  isEnterprise == 'true' && featureSettings?.['WHATSAPP_COMMERCE'] == 'TRUE'
    ? {
      name: 'Whatsapp Commerce',
      key: 'whatsapp-commerce',
      route: '/marketing/whatsapp-commerce',
      component: <WhatsappBusOverview />,
      layout: 'dashboard',
      read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
    }
    : isEnterprise == 'false' && featureSettings?.['WHATSAPP_COMMERCE'] == 'TRUE'
      ? {
        name: 'Whatsapp Commerce',
        key: 'whatsapp-commerce',
        route: '/marketing/whatsapp-commerce',
        component: <WhatsappBusOverview />,
        layout: 'dashboard',
        read:
          permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
      }
      : null,
  {
    name: 'Settings',
    key: 'settings',
    route: '/marketing/settings',
    component: <Notificationsettings />,
    layout: 'dashboard',
    read: permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
  },
];

// localStorage.setItem('InstalledApps', JSON.stringify(InstalledApps));
// const storedApps = localStorage.getItem('InstalledApps');
// if (storedApps) {
//   const parsedApps = JSON.parse(storedApps);
//   InstalledApps.push(parsedApps);
// }

const InstalledApps = InstalledAlldApps.filter((item) => item !== null);

export default InstalledApps;
