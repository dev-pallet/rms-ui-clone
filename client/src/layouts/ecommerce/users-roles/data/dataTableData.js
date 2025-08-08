/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Overview page components
import DefaultCell from 'layouts/ecommerce/overview/components/DefaultCell';

// Images


const dataTableData = {
  columns: [
    { Header: 'Name', accessor: 'Name', width: '20%' },
    { Header: 'Email', accessor: 'Email' },
    { Header: 'Mobile', accessor: 'Mobile', align: 'center' },
    { Header: 'Role', accessor: 'Role', align: 'center' },
    { Header: 'Last login', accessor: 'Last_login', align: 'center' },
  ],

  rows: [
    {
      Name: <DefaultCell>Jhon Doe</DefaultCell>,
      Email: <DefaultCell>Jane@twinleaves.co</DefaultCell>,
      Mobile: <DefaultCell>78455524569</DefaultCell>,
      Role: <DefaultCell>Admin</DefaultCell>,
      Last_login:<DefaultCell>2 days ago</DefaultCell> ,
      
    },
    {
      
      Name: <DefaultCell>Jhon Doe</DefaultCell>,
      Email: <DefaultCell>Jane@twinleaves.co</DefaultCell>,
      Mobile: <DefaultCell>78455524569</DefaultCell>,
      Role: <DefaultCell>Sales</DefaultCell>,
      Last_login:<DefaultCell>1 days ago</DefaultCell> ,
 
    },
    {
  
      Name: <DefaultCell>Jhon Doe</DefaultCell>,
      Email: <DefaultCell>Jane@twinleaves.co</DefaultCell>,
      Mobile: <DefaultCell>78455524569</DefaultCell>,
      Role: <DefaultCell>Admin</DefaultCell>,
      Last_login:<DefaultCell>4 days ago </DefaultCell> ,

    },
    {
    
      Name: <DefaultCell>Jhon Doe</DefaultCell>,
      Email: <DefaultCell>Jane@twinleaves.co</DefaultCell>,
      Mobile: <DefaultCell>78455524569</DefaultCell>,
      Role: <DefaultCell>Inventory</DefaultCell>,
      Last_login:<DefaultCell>43 min</DefaultCell> ,
  
    },
    {
   
      Name: <DefaultCell>Jhon Doe</DefaultCell>,
      Email: <DefaultCell>Jane@twinleaves.co</DefaultCell>,
      Mobile:<DefaultCell>78455524569</DefaultCell>,
      Role: <DefaultCell>Sales</DefaultCell>,
      Last_login:<DefaultCell>5 days ago</DefaultCell> ,
    },
  ],
};

export default dataTableData;
