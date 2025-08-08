import { Reports } from '../reports';
const permissions = JSON.parse(localStorage.getItem('permissions'));

const ReportsInstalledApps = [
  {
    name: 'Reports',
    key: 'reports',
    route: '/reports',
    component: <Reports />,
    layout: 'dashboard',
    read: permissions?.RETAIL_Marketing?.READ || permissions?.WMS_Marketing?.READ || permissions?.VMS_Marketing?.READ,
  },
];

export default ReportsInstalledApps;
