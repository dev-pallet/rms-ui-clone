import './Posapp.css';
import { Card, InputLabel } from '@mui/material';
import { getPosConfigurations, updatePosConfiguration } from '../../../../config/Services';
import { isSmallScreen } from '../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import React from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';

const Possettings = () => {
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const [timeoutValue, setTimeoutValue] = useState(0);
  const orgId = localStorage.getItem('orgId');
  const [retailConfigurationId, setRetailConfigurationId] = useState('');
  const user_details = localStorage.getItem('user_details');
  const updatedBy = user_details && JSON.parse(user_details).uidx;
  const updatedByname = localStorage.getItem('user_name');
  const onCard = () => {
    navigate('/pos/addposmachines/pos');
  };

  const onAddstaf = () => {
    navigate('/pos/Addstaffpos');
  };

  useEffect(() => {
    getPosConfigurations(orgId)
      .then((resp) => {
        setTimeoutValue(Number(resp?.data?.data?.configuration?.idleTimeout) / 60000);
        setRetailConfigurationId(resp?.data?.data?.configuration?.retailConfigurationId);
      })
      .catch((err) => {
        showSnackbar('Something went wrong. Please try again !', 'error');
      });
  }, []);

  const handleSave = () => {
    const payload = {
      configId: retailConfigurationId,
      idleTimeout: timeoutValue * 60 * 1000,
      updatedByName: updatedByname,
      updatedBy,
    };
    updatePosConfiguration(payload)
      .then((res) => {
        showSnackbar('Updated successfully', 'success');
        navigate('/sales_channels/pos');
      })
      .catch((err) => {
        showSnackbar('Something went wrong. Please try again !', 'error');
      });
  };

  const handleCancel = () => {
    navigate('/sales_channels/pos');
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}

      {!isMobileDevice && (
        <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '500', color: '#4b524d', marginLeft: '25px' }}>
          POS Settings
        </SoftTypography>
      )}

      <SoftBox style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Card
          style={{
            display: 'flex',
            margin: isMobileDevice ? '20px 0 0 0' : '20px',
            height: '140px',
            width: isMobileDevice ? '100%' : '230px',
            backgroundColor: '#4b84c9',
            padding: '18px',
          }}
          onClick={onCard}
        >
          <div variant="gradient" color="info" style={{ justifyContent: 'flex-start', flexDirection: 'column' }}>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>POS Licenses/ Terminal</SoftTypography>

            <SoftTypography style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>4 </SoftTypography>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>Premium plan </SoftTypography>
          </div>
        </Card>

        <Card
          style={{
            display: 'flex',
            margin: isMobileDevice ? '20px 0 0 0' : '20px',
            height: '140px',
            width: isMobileDevice ? '100%' : '230px',
            backgroundColor: '#4b84c9',
            padding: '18px',
          }}
          onClick={onCard}
        >
          <div variant="gradient" color="info" style={{ justifyContent: 'flex-start', flexDirection: 'column' }}>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>Mobile POS Licenses</SoftTypography>

            <SoftTypography style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>4 </SoftTypography>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>Premium plan </SoftTypography>
          </div>
        </Card>

        <Card
          style={{
            display: 'flex',
            margin: isMobileDevice ? '20px 0 0 0' : '20px',
            height: '140px',
            width: isMobileDevice ? '100%' : '230px',
            backgroundColor: '#4b84c9',
            padding: '18px',
          }}
          onClick={onAddstaf}
        >
          <div variant="gradient" color="info" style={{ justifyContent: 'flex-start', flexDirection: 'column' }}>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>POS users</SoftTypography>

            <SoftTypography style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>13</SoftTypography>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>Premium plan </SoftTypography>
          </div>
        </Card>
      </SoftBox>
      <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '500', color: '#4b524d', marginLeft: '25px' }}>
        General Settings
      </SoftTypography>
      <ul style={{ marginTop: '1rem' }}>
        <li>
          <SoftBox mb={1} ml={0.5} className="custom-idle-input-container">
            <InputLabel style={{ fontSize: '1.1rem', fontWeight: '500', color: '#4b524d', marginLeft: '25px' }}>
              Custom Idle Timeout (mins)
            </InputLabel>
            <SoftInput
              type="number"
              className="custom-idle-input"
              onChange={(e) => setTimeoutValue(e.target.value)}
              value={timeoutValue}
            />
          </SoftBox>
        </li>
      </ul>

      <SoftBox className="pos-general-setting-btn">
        <SoftButton sx={{ marginRight: '1rem' }} variant="gradient" color="error" onClick={() => handleCancel()}>
          Cancel
        </SoftButton>
        <SoftButton variant="gradient" color="info" onClick={() => handleSave()}>
          Save
        </SoftButton>
      </SoftBox>
    </DashboardLayout>
  );
};

export default Possettings;
