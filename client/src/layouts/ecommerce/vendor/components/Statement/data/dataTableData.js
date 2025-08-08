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
    { Header: 'Date', accessor: 'date', width: '15%' ,align: 'left'},
    { Header: 'Bill No ', accessor: 'description',align: 'left' },
    { Header: 'Bill Value ', accessor: 'billValue',align: 'left' },
    { Header: 'Credit', accessor: 'credit', align: 'left' },
    { Header: 'Debit', accessor: 'debit', align: 'left' },

  ],

  rows: [
   
    
    {
      date: <DefaultCell>Coming Soon</DefaultCell>,
      description: <DefaultCell>Coming Soon</DefaultCell>,
      billValue: <DefaultCell>Coming Soon</DefaultCell>,
      credit: <DefaultCell>Coming Soon</DefaultCell>,
      debit: <DefaultCell>Coming Soon</DefaultCell>,   
    },
    {
    
    }
    //    {
    //     date: <DefaultCell>25-09-2022</DefaultCell>,
    //     description: <DefaultCell>Order #10231</DefaultCell>,
    //     billValue: <DefaultCell>-</DefaultCell>,
    //     credit: <DefaultCell>10000</DefaultCell>,
    //    debit: <DefaultCell>-</DefaultCell>,   
    //  },
    //  {
    //   date: <DefaultCell>25-09-2022</DefaultCell>,
    //   description: <DefaultCell>Order #10231</DefaultCell>,
    //   billValue: <DefaultCell>-</DefaultCell>,
    //   credit: <DefaultCell>21000</DefaultCell>,
    //  debit: <DefaultCell>-</DefaultCell>,   
    // },
    // {
    //   date: <DefaultCell>25-09-2022</DefaultCell>,
    //   description: <DefaultCell>Order #10231</DefaultCell>,
    //   billValue: <DefaultCell>-</DefaultCell>,
    //   credit: <DefaultCell>-</DefaultCell>,
    //  debit: <DefaultCell>30000</DefaultCell>,   
    // },
    // {
    //   date: <DefaultCell>25-09-2022</DefaultCell>,
    //   description: <DefaultCell>Order #10231</DefaultCell>,
    //   billValue: <DefaultCell>-</DefaultCell>,
    //   credit: <DefaultCell>-</DefaultCell>,
    //  debit: <DefaultCell>15000</DefaultCell>,   
    // },
  ],
};

export default dataTableData;
