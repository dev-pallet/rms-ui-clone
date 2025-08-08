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

const dataTableData = {
  columns: [
    { Header: <Checkbox {...label} />,accessor:'checkbox',width:'3%'},
    { Header: 'Inward Id', accessor: 'inwardid', width: '20%' },
    { Header: 'PO Number', accessor: 'ponumber' },
    { Header: 'Vendor Name', accessor: 'vendorname', align: 'center' },
    { Header: 'Date', accessor: 'date', align: 'center' },
    { Header: 'Status', accessor: 'status', align: 'center' },

  ],

  rows: [
    {
      checkbox: <Checkbox {...label}/>, 
      inwardid: <DefaultCell>123</DefaultCell>,
      ponumber: <DefaultCell>SG1234</DefaultCell>,
      vendorname: <DefaultCell>Evernest</DefaultCell>,
      date: <DefaultCell>16/05/2022</DefaultCell>,
      status:<DefaultCell>open</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      inwardid: <DefaultCell>123</DefaultCell>,
      ponumber: <DefaultCell>SG1237</DefaultCell>,
      vendorname: <DefaultCell>Evernest</DefaultCell>,
      date: <DefaultCell>14/03/2021</DefaultCell>,
      status:<DefaultCell>closed</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      inwardid: <DefaultCell>123</DefaultCell>,
      ponumber: <DefaultCell>SG1259</DefaultCell>,
      vendorname: <DefaultCell>Evernest</DefaultCell>,
      date: <DefaultCell>18/07/2022</DefaultCell>,
      status:<DefaultCell>open</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      inwardid: <DefaultCell>123</DefaultCell>,
      ponumber: <DefaultCell>SG4234</DefaultCell>,
      vendorname: <DefaultCell>Evernest</DefaultCell>,
      date: <DefaultCell>19/05/2022</DefaultCell>,
      status:<DefaultCell>pending</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      inwardid: <DefaultCell>123</DefaultCell>,
      ponumber: <DefaultCell>SG1734</DefaultCell>,
      vendorname: <DefaultCell>Evernest</DefaultCell>,
      date: <DefaultCell>11/11/2022</DefaultCell>,
      status:<DefaultCell>closed</DefaultCell>,
      
    },
  ],
};

export default dataTableData;
