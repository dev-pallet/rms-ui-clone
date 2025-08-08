import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import DataTable from '../../../examples/Tables/DataTable';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import deliverydata from './DeliveryaAgentsdata';

const DeliveryAgents = () => {
  const navigate = useNavigate();
  const [newData , setNewData] = useState(deliverydata);
  useEffect(() => {
    setNewData(deliverydata);
  }, [deliverydata]); 
  const onNew = () => {
    navigate('/adddeliveryAgent');
  };
  return (
    <DashboardLayout>

      <DashboardNavbar />
      <Card style={{padding:'30px'}} >
    
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography style={{fontSize:'1rem'}}>Delivery Agents</SoftTypography>
          <SoftButton  onClick={onNew} variant={buttonStyles.primaryVariant} className="contained-softbutton vendor-add-btn">
            <AddIcon />
          NEW
          </SoftButton>
        </SoftBox>
        <DataTable
          table={{
            columns: [
              { Header: 'S.NO', accessor: 's.no', width: '5%' },
              { Header: 'Name', accessor: 'name', width: '20%' },
              { Header: 'Mobile Number', accessor: 'mobilenumber', width: '25%' },
              { Header: 'Driving Licence', accessor: 'drivinglicence', width: '20%'  },
              { Header: 'Email', accessor: 'email', width: '30%' },
              { Header: 'Allot Vehicle', accessor: 'allotvehicle', width: '12%' },
              { Header: 'Location', accessor: 'location', width: '12%' },
            ],
            rows: newData,
          }}
        />
      </Card>
    </DashboardLayout>
  );
};

export default DeliveryAgents;