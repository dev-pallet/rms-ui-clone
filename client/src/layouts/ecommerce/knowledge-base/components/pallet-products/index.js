import '../../knowledge-base.css';
import { Box, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CustomCard from '../../../apps-integration/Notification/CustomComponents/CustomCard';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';
import { filterBlog } from '../../../../../config/Services';
import { isSmallScreen } from '../../../Common/CommonFunction';

const KnowledgeProducts = () => {
  const isMobileDevice = isSmallScreen();
  sideNavUpdate();
  const { title } = useParams();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [allLists, setAllLists] = useState([]);
  const uniqueCategories = new Set();

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleTabSelection = (item) => {
    navigate(`/setting-help-and-support/${title}/${item}`);
  };

  const listofRetailOS = [
    { id: 1, category: 'Getting started', desc: 'mkdnh jahdfijs sbndivfbsid bdivfgsgv nuibdsui' },
    { id: 2, category: 'Setting up your store', desc: 'mkdnh jahdfijs sbndivfbsid bdivfgsgv nuibdsui' },
  ];

  useEffect(() => {
    if (title === 'Knowledge-Base' || title === 'Announcement') {
      const payload = {
        listedOn: [title === 'Knowledge-Base' ? 'RMS' : 'Announcement'],
      };

      filterBlog(payload).then((res) => {
        res?.data?.data?.data?.data.forEach((el) => {
          uniqueCategories.add(el.category);
        });

        setAllLists([...uniqueCategories]);
      });
    }
  }, []);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <Box mt={2}>
        <SoftBox py={1}>
          {!isMobileDevice ? (
            <SoftBox className="knowledge-selection">
              <SoftTypography
                color="info"
                style={{ cursor: 'pointer' }}
                variant="h6"
                onClick={() => navigate('/setting-help-and-support')}
              >
                Support home
              </SoftTypography>
              <KeyboardArrowRightIcon className="left-icon-fruits" />
              <SoftTypography color="disabled" variant="h6">
                {title}
              </SoftTypography>
            </SoftBox>
          ) : (
            <div className="purchase-details-datagrid">
              <div className="pinsghts-title-main-container">
                <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">{title}</span>
              </div>
            </div>
          )}
          <SoftBox className="knowledge-main">
            <SoftTypography className="knowledge-main-head">{title}</SoftTypography>
            {!isMobileDevice ? (
              <SoftTypography className="knowledge-main-sub-head">
                {title === 'Announcement'
                  ? "Explore Latest Announcement's and updates"
                  : "Explore How-To's and learn best practices from our knowledge base"}
              </SoftTypography>
            ) : title === 'Announcement' ? (
              <SoftTypography className="knowledge-main-sub-head">
                Explore Latest Announcement's and updates
              </SoftTypography>
            ) : (
              <div className="purchase-details-datagrid">
                <div className="pinsghts-title-main-container">
                  <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">
                    Explore How-To's and learn best practices from our knowledge base
                  </span>
                </div>
              </div>
            )}
          </SoftBox>

          <Grid container spacing={2} padding="10px" margin="auto" mt={2}>
            {allLists.slice(0, showAll ? allLists.length : 5).map((ele) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={ele.id} onClick={() => handleTabSelection(ele)}>
                  <CustomCard className="cardname-category knowledge-main-card">
                    <SoftBox className="knowledge-sub-card">
                      <SoftTypography className="knowledge-card-title">{ele}</SoftTypography>
                    </SoftBox>
                  </CustomCard>
                </Grid>
              );
            })}
          </Grid>
          {allLists.length > 5 && (
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

export default KnowledgeProducts;
