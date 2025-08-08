import './index.css';
import { Card, Grid } from '@mui/material';
import { useState } from 'react';
import AdjustIcon from '@mui/icons-material/Adjust';
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };


export const PosRules = () => {
  const [cancelOrder,setCancelOrder] = useState(false);
  const [adjustOrder,setAdjustOrder] = useState(false);

  const handleCancelOrderRules=()=>{
    setCancelOrder(!cancelOrder);
  };

  const handleAjustOrderRules=()=>{
    setAdjustOrder(!adjustOrder);
  };
        
  return(
    <DashboardLayout>
      <DashboardNavbar/>
      <SoftBox>
        <SoftTypography variant="h3">POS Rules</SoftTypography>
        <Grid mt={5} container spacing={3}>
          <Grid item xs={12} md={6} xl={6}>   
            <Card className="pos-order-rules" onClick={()=>handleCancelOrderRules()}>
              <SoftTypography variant="h5">Cancel Order rules</SoftTypography>
              <CancelIcon/>
            </Card>
            { cancelOrder ? <Card className="rules-main-box">
              <SoftBox className="cancel-activate-box">
                <SoftTypography  variant="h5" sx={{fontSize:'17px', fontWeight:'bold'}}>Activate Order Cancellation</SoftTypography>
                <Switch {...label} /><br />
              </SoftBox>
              <SoftBox mt={3} className="cancel-activate-box">
                <SoftTypography  variant="h5" sx={{fontSize:'17px', fontWeight:'bold'}}>Refund days limit</SoftTypography>
                <input className="input-rule-box" type="number"/><br />
              </SoftBox>
              <SoftBox mt={3} className="cancel-activate-box">
                <SoftTypography  variant="h5" sx={{fontSize:'17px', fontWeight:'bold'}}>Manager intrusion allowed</SoftTypography>
                <input className="input-check-rule-box" type="checkbox"/><br />
              </SoftBox>
            </Card>:null}
          </Grid>
    
          <Grid item xs={12} md={6} xl={6}>   
            <Card className="pos-order-rules" onClick={()=>handleAjustOrderRules()}>
              <SoftTypography variant="h5">Adjust Order rules</SoftTypography>
              <AdjustIcon/>
            </Card>
            { adjustOrder ? <Card className="rules-main-box">
              <SoftBox className="cancel-activate-box">
                <SoftTypography  variant="h5" sx={{fontSize:'17px', fontWeight:'bold'}}>Activate Order Adjusting</SoftTypography>
                <Switch {...label} /><br />
              </SoftBox>
              <SoftBox mt={3} className="cancel-activate-box">
                <SoftTypography  variant="h5" sx={{fontSize:'17px', fontWeight:'bold'}}>Refund days limit</SoftTypography>
                <input className="input-rule-box" type="number"/><br />
              </SoftBox>
              <SoftBox mt={3} className="cancel-activate-box">
                <SoftTypography  variant="h5" sx={{fontSize:'17px', fontWeight:'bold'}}>Manager intrusion allowed</SoftTypography>
                <input className="input-check-rule-box" type="checkbox"/><br />
              </SoftBox>
            </Card>:null}
          </Grid>
        </Grid>
           
      </SoftBox>
    </DashboardLayout>
  );
};
