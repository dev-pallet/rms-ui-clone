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
import DefaultCell from 'layouts/ecommerce/product/all-products/components/product-details/components/DefaultCell';

const dataTableData = {
  columns: [
    { Header: 'date', accessor: 'date', width: '20%' },
    { Header: 'Batch no', accessor: 'batchno', width: '15%' },
    { Header: 'Previous price', accessor: 'previousprice', align: 'center' ,width: '15%' },
    { Header: 'New price', accessor: 'newprice', align: 'center', width: '25%' },
    { Header: 'Revisied By', accessor: 'revisiedby', align: 'center' },
  ],

  rows: [
    {
      date: <DefaultCell>16/06/2022</DefaultCell>,
      batchno: <DefaultCell>12221</DefaultCell>,
      previousprice: <DefaultCell>$440</DefaultCell>,
      newprice: <DefaultCell>$450</DefaultCell>,
      revisiedby:<DefaultCell>Santosh</DefaultCell>,
    },
    {
    
      date: <DefaultCell>16/06/2022</DefaultCell>,
      batchno: <DefaultCell>12221</DefaultCell>,
      previousprice: <DefaultCell>$440</DefaultCell>,
      newprice: <DefaultCell>$450</DefaultCell>,
      price: <DefaultCell>$99.99</DefaultCell>,
      revisiedby:<DefaultCell>Santosh</DefaultCell>,
      
    },
    {
      date: <DefaultCell>16/06/2022</DefaultCell>,
      batchno: <DefaultCell>12221</DefaultCell>,
      previousprice: <DefaultCell>$440</DefaultCell>,
      newprice: <DefaultCell>$450</DefaultCell>,
      price: <DefaultCell>$129.00</DefaultCell>,
      revisiedby:<DefaultCell>Santosh</DefaultCell>,
      
    },
    {
      date: <DefaultCell>16/06/2022</DefaultCell>,
      batchno: <DefaultCell>12221</DefaultCell>,
      previousprice: <DefaultCell>$440</DefaultCell>,
      newprice: <DefaultCell>$450</DefaultCell>,
      price: <DefaultCell>$59.99</DefaultCell>,
      revisiedby:<DefaultCell>Santosh</DefaultCell>,
    },
  ],
};

export default dataTableData;
