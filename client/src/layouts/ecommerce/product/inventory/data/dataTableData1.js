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
import Checkbox from '@mui/material/Checkbox';
import DefaultCell from 'layouts/ecommerce/overview/components/DefaultCell';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const dataTableData1 = {
  columns: [
    {Header: <Checkbox {...label} />,accessor:'checkbox',width:'3%'},
    { Header: 'Date', accessor: 'date', width: '20%' },
    { Header: 'SKU ID', accessor: 'skuid' },
    { Header: 'Batch Id', accessor:'batchid'},
    { Header: 'Quantity', accessor: 'quantity', align: 'center' },
    { Header: 'Reason', accessor: 'reason', align: 'center' },
    { Header: 'Adjusted Location', accessor: 'adjustment', align: 'center' },
 

  ],

  rows: [
    {
      checkbox: <Checkbox {...label}/>, 
      date :<DefaultCell>16/12/22</DefaultCell>,
      skuid: <DefaultCell>SG123</DefaultCell>,
      batchid:<DefaultCell>1</DefaultCell>,
      quantity: <DefaultCell>10 Kg</DefaultCell>,
      reason: <DefaultCell>Pending</DefaultCell>,
      adjustment:<DefaultCell>Center</DefaultCell>,
   
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      date :<DefaultCell>16/12/22</DefaultCell>,
      skuid: <DefaultCell>SG123</DefaultCell>,
      batchid:<DefaultCell>1</DefaultCell>,
      quantity: <DefaultCell>10 Kg</DefaultCell>,
      reason: <DefaultCell>Pending</DefaultCell>,
      adjustment:<DefaultCell>Center</DefaultCell>,
     
        
    },
    {
      checkbox: <Checkbox {...label}/>, 
      date :<DefaultCell>16/12/22</DefaultCell>,
      skuid: <DefaultCell>SG123</DefaultCell>,
      batchid:<DefaultCell>1</DefaultCell>,
      quantity: <DefaultCell>10 Kg</DefaultCell>,
      reason: <DefaultCell>Pending</DefaultCell>,
      adjustment:<DefaultCell>Center</DefaultCell>,
     
        
    },
    {
      checkbox: <Checkbox {...label}/>, 
      date :<DefaultCell>16/12/22</DefaultCell>,
      skuid: <DefaultCell>SG123</DefaultCell>,
      batchid:<DefaultCell>1</DefaultCell>,
      quantity: <DefaultCell>10 Kg</DefaultCell>,
      reason: <DefaultCell>Pending</DefaultCell>,
      adjustment:<DefaultCell>Center</DefaultCell>,
     
        
    },
    {
      checkbox: <Checkbox {...label}/>, 
      date :<DefaultCell>16/12/22</DefaultCell>,
      skuid: <DefaultCell>SG123</DefaultCell>,
      batchid:<DefaultCell>1</DefaultCell>,
      quantity: <DefaultCell>10 Kg</DefaultCell>,
      reason: <DefaultCell>Pending</DefaultCell>,
      adjustment:<DefaultCell>Center</DefaultCell>,
     
        
    },
  ],
};

export default dataTableData1;
