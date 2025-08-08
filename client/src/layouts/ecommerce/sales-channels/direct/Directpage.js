import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';

const Directpage = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'  , height:'80vh'}}>
        <SoftBox style={{display:'flex' , flexDirection:'column' , alignItems:'center' , gap:'15px'}}>

          <SoftTypography>
        No sales orders created yet
          </SoftTypography>
          <SoftButton color="info" onClick={() => navigate('/sales/all-orders/new')} style={{textTransform:'none' }}>
        Create your first one
          </SoftButton>
        </SoftBox>
      </Card>
    </DashboardLayout>
  );
};

export default Directpage;