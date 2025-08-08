import '../../knowledge-base.css';
import { Box, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';
import { filterBlog } from '../../../../../config/Services';
import CustomCard from '../../../apps-integration/Notification/CustomComponents/CustomCard';
import { isSmallScreen } from '../../../Common/CommonFunction';

const KnowledgeCategory = () => {
  const isMobileDevice = isSmallScreen();
  sideNavUpdate();
  const { title, category } = useParams();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [allLists, setAllLists] = useState([]);
  const uniqueSubCategories = new Set();

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleTabSelection = (item) => {
    navigate(`/setting-help-and-support/${title}/${category}/${item}`);
  };

  const listOfStarting = [
    { id: 1, subCategory: 'Introducing Pallet Retail OS', desc: 'mkdnh jahdfijs sbndivfbsid bdivfgsgv nuibdsui' },
    { id: 2, subCategory: 'Setting up Pallet Retail OS', desc: 'mkdnh jahdfijs sbndivfbsid bdivfgsgv nuibdsui' },
  ];

  const listOfSettingUp = [{ id: 1, subCategory: 'Products', desc: 'mkdnh jahdfijs sbndivfbsid bdivfgsgv nuibdsui' }];

  useEffect(() => {
    if (title === 'Knowledge-Base' || title === 'Announcement') {
      const payload = {
        listedOn: [title === 'Knowledge-Base' ? 'RMS' : 'Announcement'],
        category: [category],
      };
      filterBlog(payload).then((res) => {
        res?.data?.data?.data?.data.forEach((el) => {
          uniqueSubCategories.add(el.subCategory);
        });
        setAllLists([...uniqueSubCategories]);
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
                className="cursor-pointer"
                variant="h6"
                onClick={() => navigate('/setting-help-and-support')}
              >
                Support home
              </SoftTypography>
              <KeyboardArrowRightIcon className="left-icon-fruits" />
              <SoftTypography color="info" variant="h6" className="cursor-pointer" 
                onClick={() => navigate(`/setting-help-and-support/${title}`)}
              >
                {title}
              </SoftTypography>
              <KeyboardArrowRightIcon className="left-icon-fruits" />
              <SoftTypography color="disabled" variant="h6">
                {category}
              </SoftTypography>
            </SoftBox>
          ) : (
            <div className="purchase-details-datagrid">
            <div className="pinsghts-title-main-container">
              <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">{title}</span>
            </div>
            </div>
          )}
          {!isMobileDevice ? (
            <SoftBox className="knowledge-main">
              <SoftTypography className="knowledge-main-head">{category}</SoftTypography>
              <SoftTypography className="knowledge-main-sub-head">
                Explore How-To's and learn best practices from our knowledge base
              </SoftTypography>
            </SoftBox>
          ) : (
            <div className="purchase-details-datagrid">
            <div className="pinsghts-title-main-container">
              <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">
                Explore How-To's and learn best practices from our knowledge base
              </span>
            </div>
            </div>
          )}

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

export default KnowledgeCategory;
