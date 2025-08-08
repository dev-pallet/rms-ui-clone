import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import sideNavUpdate from '../components/sidenavupdate';

function HrmsMaster() {
  sideNavUpdate();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const allWidgets = [
    // {
    //   name: 'Organization',
    //   icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20auto%20awesome.png',
    //   desc: 'Define and manage your organizational structure, including hierarchies, departments, and teams, for seamless operations.',
    //   adittional: '',
    //   path: '',
    // },
    {
      name: 'Department',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20code%20branch%20(1).png',
      desc: 'Organize and track departments to enhance reporting and operational efficiency.',
      adittional: '17 active departments',
      path: '/hrms-department',
    },
    {
      name: 'Designation',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20fingerprint%20(1).png',
      desc: 'Define and manage employee designations across your organization effectively.',
      adittional: '523 designations',
      path: '/hrms-designation',
    },
    // {
    //   name: 'Leaves',
    //   icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20real%20estate%20agent%20(1).png',
    //   desc: 'Plan, track, and manage employee leave policies seamlessly.',
    //   adittional: '',
    //   path: '/hrms-leave',
    // },
    {
      name: 'Holiday',
      icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20system%20security%20update%20good%20(1).png',
      desc: 'Set and manage organizational holiday calendars efficiently.',
      adittional: '12 holidays defined',
      path: '/hrms-holiday',
    },
    // {
    //   name: 'Performance',
    //   icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20cloud%20upload%20(1).png',
    //   desc: 'Monitor and evaluate employee performance with detailed metrics and insights.',
    //   adittional: 'Last updated recently',
    //   path: '/hrms-performance',
    // },
    // {
    //   name: 'Payroll Settings',
    //   icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20cloud%20upload%20(1).png',
    //   desc: 'Configure payroll policies, salary structures, and manage employee pay details.',
    //   adittional: 'Last updated recently',
    //   path: 'payroll',
    // },
    // {
    //   name: 'Shifts',
    //   icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20currency%20rupee%20(1).png',
    //   desc: 'Efficiently plan and manage employee shifts across all departments.',
    //   adittional: 'Last updated recently',
    //   path: 'shifts',
    // },
    // {
    //   name: 'Policies/Documentations',
    //   icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20outdoor%20grill%20(1).png',
    //   desc: 'Centralize organizational policies and key documentation for easy access.',
    //   adittional: '132 policies stored',
    //   path: 'policies-documentations',
    // },
    // {
    //   name: 'Templates',
    //   icon: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/share.png',
    //   desc: 'Create, upload, and manage templates for consistent documentation.',
    //   adittional: 'Last updated recently',
    //   path: 'templates',
    // },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="products-main-new-page-box">
        <Typography className="products-main-page-title">Product Master</Typography>
        <SoftBox className="products-main-widgets-box">
          <Grid container spacing={3}>
            {allWidgets?.map((item, idx) => {
              return (
                <Grid item lg={4} sm={12} md={12} xs={12} key={idx}>
                  <div className="products-main-widget-div" onClick={() => handleNavigation(item?.path)}>
                    <div className="products-main-widget-top">
                      <img src={item?.icon} className="products-main-widget-icon" alt={item?.name} />
                      <h2 className="products-main-widget-title">{item?.name}</h2>
                    </div>
                    <div>
                      <h3 className="products-main-widget-desc">{item?.desc}</h3>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
}

export default HrmsMaster;
