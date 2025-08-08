import './CatalogDetails.css';
import { Box, Typography } from '@mui/material';
import { checkWhatsappBusinessConnect } from '../../../../../config/Services';
import CatalogProducts from './CatalogProducts';
import CatalogTemplates from './CatalogTemplates';
import CatalogWorkflow from './CatalogWorkflow';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';

const WhatsappCatalogDetails = () => {
  const [selectedTab, setSelectedTab] = useState('Products');
  const [catalogDetail, setCatalogDetails] = useState();

  const handleImageError = (event) => {
    event.target.src = 'https://i.imgur.com/dL4ScuP.png';
  };

  const getStoreCatalogDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    try {
      checkWhatsappBusinessConnect(orgId, locId)
        .then((res) => {
          if (res?.data?.data?.status === 'ONBOARDING_REQUESTED') {
            setCatalogDetails(res?.data?.data?.catalogId);
          }
        })
        .catch((err) => {
          if (err?.message) {
            showSnackbar('Please onboard the Store', 'success');
          }
        });
    } catch (error) {
      showSnackbar('Please onboard the Store', 'error');
    }
  };

  useEffect(() => {
    getStoreCatalogDetails();
  }, []);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="coupons-details-header">
          <div className="details-main-header" style={{ alignItems: 'center' }}>
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/1.png"
              className="details-main-header-img"
              onError={handleImageError}
            />
            <div>
              <Typography className="details-main-header-typo">Catalog Id: {catalogDetail}</Typography>
            </div>
          </div>
        </SoftBox>
        <SoftBox className="catalog-details-tab-selection-box">
          <div
            onClick={() => setSelectedTab('Products')}
            className={selectedTab === 'Products' ? 'catalog-details-selected-tab' : 'catalog-details-unselected-tab'}
          >
            <Typography fontSize="18px" fontWeight={700}>
              Products
            </Typography>
          </div>
          <div
            onClick={() => setSelectedTab('Workflow')}
            className={selectedTab === 'Workflow' ? 'catalog-details-selected-tab' : 'catalog-details-unselected-tab'}
          >
            <Typography fontSize="18px" fontWeight={700}>
              Work flow
            </Typography>
          </div>
          <div
            onClick={() => setSelectedTab('Templates')}
            className={selectedTab === 'Templates' ? 'catalog-details-selected-tab' : 'catalog-details-unselected-tab'}
          >
            <Typography fontSize="18px" fontWeight={700}>
              Templates
            </Typography>
          </div>
        </SoftBox>
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          {selectedTab === 'Products' ? (
            <CatalogProducts />
          ) : selectedTab === 'Workflow' ? (
            <CatalogWorkflow />
          ) : selectedTab === 'Templates' ? (
            <CatalogTemplates />
          ) : null}
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default WhatsappCatalogDetails;
