import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import rowdata from './Fleetmanagmentdata';

const Fleetmangment = () => {
  const [rowdatas, setRowdata] = useState(rowdata);
  const navigate = useNavigate();
  const onNew = () => {
    navigate('/addfleetmanagment');
  };
  useEffect(() => {
    setRowdata(rowdata);
  }, [rowdata]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card style={{padding:'20px'}}>
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography style={{fontSize:'1rem'}}>Fleetmangment</SoftTypography>
          <SoftButton variant="gradient" onClick={onNew} className="vendor-add-btn">
            <AddIcon />
          NEW
          </SoftButton>
        </SoftBox>
        <DataTable
          table={{
            columns: [
              { Header: 'S.NO', accessor: 's.no', width: '5%' },
              { Header: 'Vehicle', accessor: 'vehicle', width: '25%' },
              { Header: 'Capacity', accessor: 'capacity', width: '20%'  },
              { Header: 'Make', accessor: 'make', width: '12%' },
              { Header: 'Body type', accessor: 'bodytype', width: '12%' },
              { Header: 'Company', accessor: 'company', width: '12%' },
            ],
            rows: rowdatas,
          }}
        />
      </Card>

      
    </DashboardLayout>
  );
};

export default Fleetmangment;
