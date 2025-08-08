import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import CustomCard from '../apps-integration/Notification/CustomComponents/CustomCard';
import { isSmallScreen } from '../Common/CommonFunction';
import './knowledge-base.css';

const SettingHelpSupport = () => {
  const isMobileDevice = isSmallScreen();
  sideNavUpdate();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleTabSelection = (item) => {
    const title = item?.title;
    if (title === 'Raise Ticket') {
      navigate(`/setting-help-and-support/raise-ticket/project`);
    } else {
      navigate(`/setting-help-and-support/${title}`);
    }
  };

  const listofFeatures = [
    { id: 1, title: 'Raise Ticket', desc: 'Submit a ticket for support or to report issues.' },
    { id: 2, title: 'Knowledge-Base', desc: 'Find helpful articles and FAQs to assist you.' },
    { id: 3, title: 'Announcement', desc: 'Stay updated with the latest updates, and important information.' },
  ];

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <Box mt={2}>
        <SoftBox py={1}>
          {isMobileDevice ? (
            <div className="purchase-details-datagrid">
              <div className="pinsghts-title-main-container">
                <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">
                  Welcome! How can we help?
                  <br />
                  Whether you need a hand with Pallet products or with something else, we are here to help!
                </span>
              </div>
            </div>
          ) : (
            <SoftBox className="knowledge-main">
              <SoftTypography className="knowledge-main-head">Welcome! How can we help?</SoftTypography>
              <SoftTypography className="knowledge-main-sub-head">
                Whether you need a hand with Pallet products or with something else, we are here to help!
              </SoftTypography>
            </SoftBox>
          )}

          <Grid container spacing={2} padding="10px" mt={2}>
            {listofFeatures.slice(0, showAll ? listofFeatures.length : 5).map((ele) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={ele.id} onClick={() => handleTabSelection(ele)}>
                  <CustomCard className="cardname-category knowledge-main-card">
                    <SoftBox className="knowledge-sub-card">
                      <SoftTypography className="knowledge-card-title">{ele.title}</SoftTypography>
                      <SoftTypography className="knowledge-card-desc">{ele.desc}</SoftTypography>
                    </SoftBox>
                  </CustomCard>
                </Grid>
              );
            })}
          </Grid>
          {listofFeatures.length > 5 && (
            <SoftBox style={{ float: 'right' }}>
              <SoftButton onClick={handleToggleShowAll} variant="outlined" color="primary">
                {showAll ? 'Show Less' : 'View More'}
              </SoftButton>
            </SoftBox>
          )}
        </SoftBox>
      </Box>
    </DashboardLayout>
  );
};

export default SettingHelpSupport;
