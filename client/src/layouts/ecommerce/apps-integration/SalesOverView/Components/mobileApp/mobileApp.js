import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import { noDatagif } from '../../../../Common/CommonFunction';

const MobileApp = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box className="search-bar-filter-and-table-container">
        <Box className="search-bar-filter-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography
            style={{
              fontSize: '0.8em',
              marginInline: '10px',
              marginTop: '10px',
              color: '#ffffff',
              fontWeight: '500',
            }}
          >
            Mobile App
          </SoftTypography>
          <SoftButton onClick={() => navigate('/sales_channels/ods')}>ODS</SoftButton>
        </Box>
        <SoftBox className="No-data-text-box">
          <SoftBox className="src-imgg-data">
            <img className="src-dummy-img" src={noDatagif} />
          </SoftBox>

          <h3 className="no-data-text-I">NO DATA FOUND</h3>
        </SoftBox>
      </Box>
    </DashboardLayout>
  );
};

export default MobileApp;
