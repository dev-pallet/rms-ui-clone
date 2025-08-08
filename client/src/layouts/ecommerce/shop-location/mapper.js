import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import LocDetailTab from './retail/loc-Detail-Tab';
import ShoplocationWMS from '.';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

const MapperLocDetail = () => {
  sideNavUpdate();
  const contextType = localStorage.getItem('contextType');
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {contextType === 'WMS'
        ?<ShoplocationWMS />
        : contextType === 'RETAIL'
          ?<LocDetailTab />
          :null
      }
    </DashboardLayout>
  );
};

export default MapperLocDetail;
