import { Card, Paper } from '@mui/material';
import { allPaymentMachines } from '../../../config/Services';
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import Typography from '@mui/material/Typography';


const PalletPaySettings = () => {
  const navigate = useNavigate();
  const contextType = localStorage.getItem('contextType');

  const onPaymentmachine = () => {
    navigate('/pallet-pay/paymentmachine');
  };

  const onMdrdetails = () => {
    navigate('/pallet-pay/MDRdetails');
  };

  const handleEzetap = (vendorId) => {
    navigate(`/palletpay/vendor/settings/${vendorId}`);
  };
  const selfStyledSection = (
    <Paper
      style={{ backgroundColor: '#EFEFEF', padding: '10px', border: '1px black', margin: '10px', width: '50vw' }}
      onClick={() => handleEzetap('self')}
    >
      {/* Your content for the self-styled section */}
      <SoftTypography style={{ color: '#414241', fontSize: '0.9rem' }}>Self</SoftTypography>
    </Paper>
  );

  const paletteStyledSection = (
    <Paper
      style={{ backgroundColor: '#EFEFEF', padding: '10px', margin: '10px', width: '50vw' }}
      onClick={() => handleEzetap('pallet')}
    >
      {/* Your content for the self-styled section */}
      <SoftTypography style={{ color: '#414241', fontSize: '0.9rem', border: '1px black' }}>
        Provided by Pallet
      </SoftTypography>
    </Paper>
  );

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [activeCount, SetActiveCount] = useState(0);
  useEffect(() => {
    const payload = {
      orgId: orgId,
      locId: locId,
    };
    allPaymentMachines(payload)
      .then((res) => {
        if (res?.data?.data?.data.machineId !== null) {
          const data = res?.data?.data?.data?.length;
          SetActiveCount(data);
        }
      })
      .catch((err) => {});
  }, []);

  const handlePaymentMode = () => {
    navigate('/pallet-pay/payment-mode');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '500', color: '#4b524d', marginLeft: '25px' }}>
        Pallet Pay Settings
      </SoftTypography>

      <SoftBox style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Card
          style={{
            display: 'flex',
            margin: '20px',
            height: '140px',
            width: '230px',
            backgroundColor: '#4b84c9',
            padding: '18px',
          }}
          onClick={onPaymentmachine}
        >
          <div variant="gradient" color="info" style={{ justifyContent: 'flex-start', flexDirection: 'column' }}>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>Payment Machines</SoftTypography>

            <SoftTypography style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
              {activeCount}{' '}
            </SoftTypography>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>Rental Plan: 500/month </SoftTypography>
          </div>
        </Card>
        <Card
          style={{
            display: 'flex',
            margin: '20px',
            height: '140px',
            width: '230px',
            backgroundColor: '#4b84c9',
            padding: '18px',
            cursor: 'pointer',
          }}
          onClick={onMdrdetails}
        >
          <div variant="gradient" color="info" style={{ justifyContent: 'flex-start', flexDirection: 'column' }}>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>MDR Details</SoftTypography>

            <SoftTypography style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Fixed Plans
            </SoftTypography>
            <SoftTypography style={{ color: 'white', fontSize: '0.9rem' }}>TC onstore/ customer </SoftTypography>
          </div>
        </Card>

        {/* <Card
          style={{
            margin: '20px',
            height: '140px',
            width: '230px',
            backgroundColor: '#4b84c9',
            padding: '18px',
            cursor:"pointer"
          }}
          onClick={handlePaymentMode}
        >
          <div
            variant="gradient"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100% ',
            }}
          >
            <SoftTypography style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Payment Mode
            </SoftTypography>
          </div>
        </Card> */}

        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '20px' }}>
          <Accordion style={{ width: '73vw' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography style={{ color: '#414241', fontSize: '0.9rem' }}>Ezetap Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {selfStyledSection}
                {/* {paletteStyledSection} */}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        {/* <Card
              style={{
                display: 'flex',
                margin: '20px',
                height: '60px',
                width: '100%',
                padding: '18px',
              }}
              onClick={handleEzetap}
            >
             
              <div variant="gradient"  style={{ justifyContent: 'flex-start', flexDirection: 'column' }}>
                <SoftTypography style={{ color: '#414241', fontSize: '0.9rem'}}>
                 Ezetap Settings
                </SoftTypography>

              </div>
            </Card> */}
        {/* <Card
              style={{
                display: 'flex',
                margin: '20px',
                height: '60px',
                width: '100%',
                padding: '18px',
                
              }}
            >
             
              <div variant="gradient"  style={{ justifyContent: 'flex-start', flexDirection: 'column' }}>
                <SoftTypography style={{ color: '#414241', fontSize: '0.9rem'}}>
                 Pinelabs Settings
                </SoftTypography>
              </div>
            </Card> */}
      </SoftBox>
    </DashboardLayout>
  );
};

export default PalletPaySettings;
