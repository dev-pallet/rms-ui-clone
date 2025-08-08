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


// Images



const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const dataTableData = {
  columns: [
    { Header: <Checkbox {...label} />,accessor:'checkbox',width:'3%'},
    { Header: 'Request No', accessor: 'requestno', width: '20%' },
    { Header: 'Inward No', accessor: 'inwardnumber' },
    { Header: 'Quantity', accessor: 'quantity', align: 'center' },
    { Header: 'Status', accessor: 'status', align: 'center' },

  ],

  rows: [
    {
      checkbox: <Checkbox {...label}/>, 
      requestno: <DefaultCell>123</DefaultCell>,
      inwardnumber: <DefaultCell>SG1694</DefaultCell>,
      quantity: <DefaultCell>Evernest</DefaultCell>,
      status:<DefaultCell>open</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      requestno: <DefaultCell>123</DefaultCell>,
      inwardnumber: <DefaultCell>SG1237</DefaultCell>,
      quantity: <DefaultCell>Evernest</DefaultCell>,
      status:<DefaultCell>closed</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      requestno: <DefaultCell>123</DefaultCell>,
      inwardnumber: <DefaultCell>SG1259</DefaultCell>,
      quantity: <DefaultCell>Evernest</DefaultCell>,
      status:<DefaultCell>open</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      requestno: <DefaultCell>123</DefaultCell>,
      inwardnumber: <DefaultCell>SG4234</DefaultCell>,
      quantity: <DefaultCell>Evernest</DefaultCell>,
      status:<DefaultCell>pending</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      requestno: <DefaultCell>123</DefaultCell>,
      inwardnumber: <DefaultCell>SG1734</DefaultCell>,
      quantity: <DefaultCell>Evernest</DefaultCell>,
      status:<DefaultCell>closed</DefaultCell>,
      
    },
  ],
};

export default dataTableData;
