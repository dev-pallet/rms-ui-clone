import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';

import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';
import {  getBlogs } from '../../../../../config/Services';
import '../../knowledge-base.css';
import { isSmallScreen } from '../../../Common/CommonFunction';
const KnowledgeArticle = () => {
 const isMobileDevice = isSmallScreen();
  sideNavUpdate();
  const { title, category, subCategory, articleId } = useParams();
  const [id, setId] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    getBlogs(articleId)
      .then((res) => {
        setHtmlContent(atob(res?.data?.data?.data?.docsData.html_file));
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
      });
  }, [articleId]);

  const benefits = [
    {
      id: '1',
      point:
        'Automate self-service across channels and deliver instant resolutions with AI-powered capabilities like natural language understanding, intent detection, and sentiment detection.',
    },
    {
      id: '2',
      point:
        'Enhance team productivity with intelligent agent assistance and empower agents to provide contextual support more effectively.',
    },
    {
      id: '3',
      point: 'Enable your team to easily collaborate and share information with powerful ticketing capabilities',
    },
    { id: '4', point: 'Make data-driven decisions using proactive insights and recommendations, powered by AI.' },
  ];
  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {!isMobileDevice ? (
        <Box mt={2}>
          <SoftBox py={1}>
            <div className="knowledge-base-container">
              <div className="knowledge-base-card " dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </SoftBox>
        </Box>
      ) : (
        //  <div className="knowledge-base-card " dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <Box>
          <SoftBox>
            <div className="knowledge-base-container-mobile">
              <div className="knowledge-base-card " dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </SoftBox>
        </Box>
      )}
    </DashboardLayout>
  );
};

export default KnowledgeArticle;
