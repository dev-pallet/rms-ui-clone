import '@asseinfo/react-kanban/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
// import MobilePreview from './MobilePreview';
// import { Box, Modal } from '@mui/material';
// import EnterpriseModal from '../../../../components/EnterpriseModal';
import { Box, InputLabel } from '@mui/material';
import { useState } from 'react';
import ModifyContent from './ModifyContent';
import SoftSelect from '../../../../components/SoftSelect';
const labelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };
const EcommerceB2Cui = () => {
  const navigate = useNavigate();
  const contextType = localStorage.getItem('contextType');
  const [selectedPage, setSelectedPage] = useState({ value: 'HOME', label: 'Home' });
  const [selectedApp, setSelectedApp] = useState({ value: 'B2C', label: 'B2C App' });

  const [columnData, setColumnData] = useState([
    {
      id: 1,
      title: 'Components',
      cards: [
        {
          id: 1,
          title: 'Banner',
          description: 'Banner to display',
        },
        {
          id: 2,
          title: 'Tags',
          description: 'Select tags',
        },
        {
          id: 3,
          title: 'Brand',
          description: 'Select brands',
        },
        {
          id: 4,
          title: 'Categories',
          description: 'Select Categories to display',
        },
      ],
    },
  ]);
  const board = {
    columns: columnData,
  };

  const onComponentChange = (_card, source, destination) => {
    setColumnData(_card);
  };
  const handleNew = () => {
    navigate('/pallet-hyperlocal/customize');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card>
        <div
          className="search-bar-filter-container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <SoftTypography style={{ color: 'white', fontSize: '1rem' }}>
            <strong>Customize B2C</strong>
          </SoftTypography>
          <SoftButton variant="solidWhiteBackground" onClick={handleNew}>
            + New
          </SoftButton>
        </div>

        <Box style={{ padding: '20px' }}>
          <SoftTypography className="contentInfo-style">
            Personalize your mobile homepage preview by rearranging components with a quick drag and drop
          </SoftTypography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: '10px',
              width: '58%',
              gap: '20px',
            }}
          >
            <div style={{ width: '100%' }}>
              {' '}
              <InputLabel required sx={labelStyle}>
                Select App
              </InputLabel>
              <SoftSelect
                size="small"
                style={{ width: '100%' }}
                options={[
                  { value: 'B2C', label: 'B2C app' },
                  { value: 'B2B', label: 'B2B app' },
                ]}
                value={selectedApp}
                onChange={(e) => setSelectedApp(e)}
              ></SoftSelect>
            </div>
            <div style={{ width: '100%' }}>
              <InputLabel required sx={labelStyle}>
                Select page
              </InputLabel>
              <SoftSelect
                size="small"
                style={{ width: '100%' }}
                options={[
                  { value: 'HOME', label: 'Home' },
                  { value: 'DASHBOARD', label: 'Dashboard' },
                  { value: 'CART', label: 'Cart' },
                  { value: 'WALLET', label: 'Wallet' },
                ]}
                value={selectedPage}
                onChange={(e) => setSelectedPage(e)}
              ></SoftSelect>
            </div>
          </div>
          <ModifyContent selectedPage={selectedPage} selectedApp={selectedApp} />
        </Box>
      </Card>

      <br />
    </DashboardLayout>
  );
};

export default EcommerceB2Cui;
