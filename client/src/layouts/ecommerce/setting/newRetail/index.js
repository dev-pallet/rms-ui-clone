import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import OrgDetailTab from './components/org-detail-tab';
import React from 'react';
import sideNavUpdate from '../../../../components/Utility/sidenavupdate';

const MapperOrganization = () => {
  sideNavUpdate();
  const contextType = localStorage.getItem('contextType');
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {contextType === 'RETAIL' ? <OrgDetailTab /> : null}
    </DashboardLayout>
  );
};

export default MapperOrganization;
