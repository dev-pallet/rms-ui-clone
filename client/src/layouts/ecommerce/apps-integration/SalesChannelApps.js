import Directpage from '../sales-channels/direct/Directpage';
import Others from './SalesOverView/Components/Others';
import SalesOverViewDashboard from './SalesOverView/SalesOverViewDashboard';
const permissions = JSON.parse(localStorage.getItem('permissions'));

// {
//   name: 'Overview',
//   key: 'overview',
//   route: '/sales_channels/overview',
//   component: null,
//   layout: 'dashboard',
//   read: permissions?.HO_Sales_Channel?.READ,
// },
// {
//   name: 'Overview',
//   key: 'overview',
//   route: '/sales_channels/overview',
//   component: null,
//   layout: 'dashboard',
//   read: permissions?.HO_Sales_Channel?.READ,
// },
// {
//   name: 'Overview',
//   key: 'overview',
//   route: '/sales_channels/overview',
//   component: null,
//   layout: 'dashboard',
//   read: permissions?.HO_Sales_Channel?.READ,
// },
// {
//   name: 'Mobile App',
//   key: 'overview',
//   route: '/sales_channels/overview',
//   component: null,
//   layout: 'dashboard',
//   read: permissions?.HO_Sales_Channel?.READ,
// },
// {
//   name: 'Whatsapp',
//   key: 'whatsapp',
//   route: '/sales_channels/whatsapp',
//   component: null,
//   layout: 'dashboard',
//   read: permissions?.HO_Sales_Channel?.READ,
// },
// {
//   name: 'Others',
//   key: 'others',
//   route: '/sales_channels/others',
//   component: null,
//   layout: 'dashboard',
//   read: permissions?.HO_Sales_Channel?.READ,
// },

const SalesChannelApps = [
  {
    name: 'Overview',
    key: 'overview',
    route: '/sales_channels/overview',
    component: <SalesOverViewDashboard />,
    layout: 'dashboard',
    read:permissions?.RETAIL_SalesChannel?.READ || permissions?.WMS_SalesChannel?.READ || permissions?.VMS_SalesChannel?.READ || permissions?.HO_Sales_Channel?.READ, 
  },
  {
    name: 'Direct',
    key: 'direct',
    route: '/sales_channels/direct',
    component: <Directpage />,
    layout: 'dashboard',
    read:permissions?.RETAIL_SalesChannel?.READ || permissions?.WMS_SalesChannel?.READ || permissions?.VMS_SalesChannel?.READ || permissions?.HO_Sales_Channel?.READ, 
  },
  // {
  //   name: 'ODS',
  //   key: 'ods',
  //   route: '/sales_channels/ods',
  //   component: <OrderDisplaySystem />,
  //   layout: 'dashboard',
  //   read:permissions?.RETAIL_SalesChannel?.READ || permissions?.WMS_SalesChannel?.READ || permissions?.VMS_SalesChannel?.READ, 
  // },
  // {
  //   name: 'Mobile App',
  //   key: 'mobile_app',
  //   route: '/sales_channels/mobile_app',
  //   component: <MobileApp />,
  //   layout: 'dashboard',
  //   read:permissions?.RETAIL_SalesChannel?.READ || permissions?.WMS_SalesChannel?.READ || permissions?.VMS_SalesChannel?.READ || permissions?.HO_Sales_Channel?.READ, 
  // },
  {
    name: 'Whatsapp',
    key: 'whats_app',
    route: '/sales_channels/whats_app',
    component: null,
    layout: 'dashboard',
    read: permissions?.HO_Sales_Channel?.READ, 
  },
  {
    name: 'Others',
    key: 'others',
    route: '/sales_channels/others',
    component: <Others />,
    layout: 'dashboard',
    read:permissions?.RETAIL_SalesChannel?.READ || permissions?.WMS_SalesChannel?.READ || permissions?.VMS_SalesChannel?.READ || permissions?.HO_Sales_Channel?.READ, 
  },
  {
    name: 'Settings',
    key: 'settings',
    route: '/sales_channels/settings',
    component: null,
    layout: 'dashboard',
    read: permissions?.HO_Sales_Channel?.READ, 
  },
];
  
export default SalesChannelApps;
  