import './users-roles.css';
import { useEffect, useState } from 'react';
import ActiveUserroles from './activeUser';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import UserRolesTab from './userRolesTab';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

const Userroles = () => {
  sideNavUpdate();
  const [authorization, setAuthorization] = useState(false);
  const userRole = JSON.parse(localStorage.getItem('user_roles'));

  useEffect(() => {
    if (userRole.includes('SUPER_ADMIN')) {
      setAuthorization(true);
    } else {
      setAuthorization(false);
    }
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {authorization
        ?<UserRolesTab />
        :<ActiveUserroles />
      }
    </DashboardLayout>
  );
};

export default Userroles;

