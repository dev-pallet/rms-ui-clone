import ActionCell from '../products/products-list/components/ActionCell';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import InstalledApps from './InstalledApp';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';

const Showinstalledapp = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const prevApps = localStorage.getItem('InstalledApps');
    const appdata = JSON.parse(prevApps);
    if (appdata && appdata.length > 0) {
      const updatedData = appdata.map((e) => {
        return {
          name: e.name,
          Description: e.Description,
          action: <ActionCell />,
        };
      });
      setData(updatedData);
    }
  }, [InstalledApps]);
  
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftTypography>Installed Apps</SoftTypography>
      <SoftBox style={{margin:'20px'}}>
        <DataTable 
          table={{
            columns: [
              { Header: 'App Name', accessor: 'name', width: '25%' },
              { Header: 'Description', accessor: 'Description', width: '200px' },
              { Header: 'Actions', accessor: 'action'  },
        
            ],
            rows: data
          }}
        />
      </SoftBox>
    </DashboardLayout>
  );
};

export default Showinstalledapp;