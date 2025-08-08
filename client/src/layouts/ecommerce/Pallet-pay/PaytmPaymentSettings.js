import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { buttonStyles } from '../Common/buttonColor';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import FormField from '../apps-integration/Pos/components/formfield';
import React, { useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const PaytmPaymentSettings = () => {
  const [vendorDetails, setVendorDetails] = useState();
  const [machineId, setMachineId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [merchantKey, setMerchantKey] = useState('');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');


  const handleInputChange = (index, value) => {
    setVendorDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index].columnValue = value;
      return updatedDetails;
    });
  };



  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/pallet-pay/paytm');
  };
  const onSave = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const data = {paytmMid : machineId , channelId : channelId , merchantKey : merchantKey}; 
    const payload = {
      'createdBy': uidx,
      'createdByName': userName,
      'entityType': 'ORGANIZATION',
      'entityValue': orgId,
      'meta': data,
      'provider': 'PAYTM',
      'type': 'EDC_MACHINE'
    };
    navigate('/pallet-pay/paytm');
  };

  

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Paper>
        <SoftBox style={{ display: 'flex' }}>
          <img
            style={{ width: '130px', height: '60px', objectFit: 'contain' }}
            src="https://download.logo.wine/logo/Paytm/Paytm-Logo.wine.png"
            alt=""
          />{' '}
          <span>
            <SoftTypography style={{ fontSize: '1.2rem', padding: '20px', fontWeight: 'bold' }}>
              {/* Settings */}
            </SoftTypography>
          </span>
        </SoftBox>
      </Paper>

      <Paper style={{ marginTop: '20px', padding: '20px', paddingBottom: '60px' }}>
        <Typography variant="h6" style={{ fontSize: '1.1rem' }}>
          Paytm Settings
        </Typography>

        <Grid container spacing={2}>
 
          <Grid item xs={12} sm={6}>
            <FormField
              label="Machine Id"
              placeholder="Enter Machine Id"
              fullWidth
              value={machineId}
              margin="normal"
              variant="outlined"
              onChange={(e) => setMachineId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="Channel Id"
              placeholder="Enter Channel Id"
              fullWidth
              value={channelId}
              margin="normal"
              variant="outlined"
              onChange={(e) => setChannelId(e.target.value)}

            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              label="Merchant key"
              placeholder="Enter Merchant Key"
              fullWidth
              value={merchantKey}
              margin="normal"
              variant="outlined"
              onChange={(e) => setMerchantKey(e.target.value)}

            />
          </Grid>
        </Grid>
      </Paper>
      <SoftBox style={{ float: 'right', marginBottom: '25px', marginTop: '15px' }}>
        <SoftButton variant={buttonStyles.secondaryVariant} className="outlined-softbutton" onClick={handleCancel}>
          Cancel
        </SoftButton>
        <SoftButton
          variant={buttonStyles.primaryVariant}
          className="contained-softbutton"
          onClick={onSave}
          style={{ marginLeft: '20px' }}
        >
          Save
        </SoftButton>
      </SoftBox>
    </DashboardLayout>
  );
};

export default PaytmPaymentSettings;
