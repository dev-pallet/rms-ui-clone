import './templates.css';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import TransactionalTemplates from './TransactionalTemplates';

const CampaignTemplates = () => {
  const [selectedTab, setSelectedTab] = useState('Marketing');
  const navigate = useNavigate();


  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox style={{ display: 'flex', gap: '50px' }}>
          <Typography
            onClick={() => setSelectedTab('Marketing')}
            className={selectedTab === 'Marketing' ? 'tab-template-selected' : 'tab-template'}
          >
            Marketing
          </Typography>
          <Typography
            onClick={() => setSelectedTab('Transactional')}
            className={selectedTab === 'Transactional' ? 'tab-template-selected' : 'tab-template'}
          >
            Transactional
          </Typography>
        </SoftBox>

        {selectedTab === 'Marketing' && (
          <SoftBox style={{ display: 'flex', justifyContent: 'center' }}>
            <SoftBox className="campaign-template-main-dashboard">
              <div className="campaign-template-single-box">
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/1.png" />
                  <Typography className="campaign-template-box-header">Whatsapp</Typography>
                  <Typography className="campaign-template-box-desc">
                    Use our whatsapp builder to create a campaign in minutes.
                  </Typography>
                  <SoftButton className="vendor-second-btn" onClick={() => navigate('/campaigns/whatsapp/templates')}>
                    Create Whatsapp
                  </SoftButton>
                </div>
              </div>
              <div className="campaign-template-single-box">
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/4.png" />
                  <Typography className="campaign-template-box-header">Push Notifications</Typography>
                  <Typography className="campaign-template-box-desc">
                    Craft engaging push campaigns effortlessly with our intuitive builder.
                  </Typography>
                  <SoftButton className="vendor-second-btn" onClick={() => navigate('/campaigns/templates/list/push')}>
                    Create Push
                  </SoftButton>
                </div>
              </div>
              <div className="campaign-template-single-box">
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/3.png" />
                  <Typography className="campaign-template-box-header">SMS</Typography>
                  <Typography className="campaign-template-box-desc">
                    Craft SMS campaigns in minutes with our user-friendly builder!
                  </Typography>
                  <SoftButton className="vendor-second-btn">Create SMS</SoftButton>
                </div>
              </div>
              <div className="campaign-template-single-box">
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/2.png" />
                  <Typography className="campaign-template-box-header">Email</Typography>
                  <Typography className="campaign-template-box-desc">
                    Effortlessly create campaigns with our Email builder – quick and easy!
                  </Typography>
                  <SoftButton className="vendor-second-btn">Create Email</SoftButton>
                </div>
              </div>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'Transactional' && <TransactionalTemplates />}
      </DashboardLayout>
    </div>
  );
};

export default CampaignTemplates;
