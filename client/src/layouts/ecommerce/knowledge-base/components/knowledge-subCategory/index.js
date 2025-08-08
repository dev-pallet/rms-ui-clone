import '../../knowledge-base.css';
import { Box } from '@mui/material';
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
import { isSmallScreen } from '../../../Common/CommonFunction';

const KnowledgeSubCategory = () => {
  const isMobileDevice = isSmallScreen();
  sideNavUpdate();
  const { title, category, subCategory } = useParams();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [allLists, setAllLists] = useState([]);

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleTabSelection = (item) => {
    const articleId = item?.id;
    navigate(`/setting-help-and-support/${title}/${category}/${subCategory}/${articleId}`);
  };
  useEffect(() => {
    const payload = {
      listedOn: [title === 'Knowledge-Base' ? 'RMS' : 'Announcement'],
      category: [category],
      subCategory: [subCategory],
    };

    filterBlog(payload).then((res) => {
      setAllLists(res?.data?.data?.data?.data);
    });
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
              <SoftTypography
                color="info"
                variant="h6"
                className="cursor-pointer"
                onClick={() => navigate(`/setting-help-and-support/${title}`)}
              >
                {title}
              </SoftTypography>
              <KeyboardArrowRightIcon className="left-icon-fruits" />
              <SoftTypography color="info" variant="h6" className="cursor-pointer"
                onClick={() => navigate(`/setting-help-and-support/${title}/${category}`)}
              >
                {category}
              </SoftTypography>
              <KeyboardArrowRightIcon className="left-icon-fruits" />
              <SoftTypography color="disabled" variant="h6">
                {subCategory}
              </SoftTypography>
            </SoftBox>
          ) : (
            <>
            <div className="purchase-details-datagrid">
              <div className="pinsghts-title-main-container">
                <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">{title}</span>
              </div>
              <div className="pinsghts-title-main-container">
                <span className="purch-det-heading-title pinsights-title purchase-heading-ros-app">{category}</span>
              </div>
              </div>
            </>
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

          <SoftBox className="knowledge-main-list">
            {allLists.slice(0, showAll ? allLists.length : 5).map((ele) => {
              return (
                <SoftBox className="knowledge-selection" onClick={() => handleTabSelection(ele)}>
                  <SoftTypography className="knowledge-card-desc-list">
                    <TextSnippetIcon color="disabled" />{' '}
                  </SoftTypography>
                  <SoftTypography className="knowledge-card-desc-list">{ele.title}</SoftTypography>
                </SoftBox>
              );
            })}
          </SoftBox>
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

export default KnowledgeSubCategory;
