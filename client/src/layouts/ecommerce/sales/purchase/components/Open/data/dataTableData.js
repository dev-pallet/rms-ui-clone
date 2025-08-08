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
    { Header: 'DATE', accessor: 'date', width: '10%' },
    { Header: 'Sales order', accessor: 'salesorder' },
    { Header: 'Reference', accessor: 'reference', align: 'center' },
    { Header: 'Customer name', accessor: 'customername', align: 'center' },
    { Header: 'Status', accessor: 'status', align: 'center' },
    { Header: 'Invoiced', accessor: 'invoiced', align: 'center' },
    { Header: 'Payment', accessor: 'payment', align: 'center' },
    { Header: 'Shipped', accessor: 'shipped', align: 'center' },
    { Header: 'Amount', accessor: 'amount', align: 'center' },
  ],

  rows: [
    {
      date: <DefaultCell>#1001</DefaultCell>,
      salesorder: <DefaultCell>Jhon Doe</DefaultCell>,
      reference: <DefaultCell>₹ 842.6</DefaultCell>,
      customername: <DefaultCell>UnPaid (COD)</DefaultCell>,
      status: <DefaultCell>Fulfilled</DefaultCell>,
      invoiced: <DefaultCell>13</DefaultCell>,
      payment: <DefaultCell>Home delivery</DefaultCell>,
      shipped: <DefaultCell>Home delivery</DefaultCell>,
      amount: <DefaultCell>Home delivery</DefaultCell>,

    },
    {
      date: <DefaultCell>#1001</DefaultCell>,
      salesorder: <DefaultCell>Jhon Doe</DefaultCell>,
      reference: <DefaultCell>₹ 804.6</DefaultCell>,
      customername: <DefaultCell>Paid (COD)</DefaultCell>,
      status: <DefaultCell>UnFulfilled</DefaultCell>,
      invoiced: <DefaultCell>7</DefaultCell>,
      payment: <DefaultCell>Home delivery</DefaultCell>,
      shipped: <DefaultCell>Home delivery</DefaultCell>,
      amount: <DefaultCell>Home delivery</DefaultCell>,
    },
    {
      date: <DefaultCell>#1001</DefaultCell>,
      salesorder: <DefaultCell>Jhon Doe</DefaultCell>,
      reference: <DefaultCell>₹ 742.6</DefaultCell>,
      customername: <DefaultCell>Paid (COD)</DefaultCell>,
      status: <DefaultCell>Fulfilled</DefaultCell>,
      invoiced: <DefaultCell>2</DefaultCell>,
      payment: <DefaultCell>Home delivery</DefaultCell>,
      shipped: <DefaultCell>Home delivery</DefaultCell>,
      amount: <DefaultCell>Home delivery</DefaultCell>,
    },
    {
      date: <DefaultCell>#1001</DefaultCell>,
      salesorder: <DefaultCell>Jhon Doe</DefaultCell>,
      reference: <DefaultCell>₹ 645.6</DefaultCell>,
      customername: <DefaultCell>Paid (COD)</DefaultCell>,
      status: <DefaultCell>Fulfilled</DefaultCell>,
      invoiced: <DefaultCell>13</DefaultCell>,
      payment: <DefaultCell>Home delivery</DefaultCell>,
      shipped: <DefaultCell>Home delivery</DefaultCell>,
      amount: <DefaultCell>Home delivery</DefaultCell>,
    },
    {
      date: <DefaultCell>#1001</DefaultCell>,
      salesorder: <DefaultCell>Jhon Doe</DefaultCell>,
      reference: <DefaultCell>₹ 842.6</DefaultCell>,
      customername: <DefaultCell>Paid (COD)</DefaultCell>,
      status: <DefaultCell>Fulfilled</DefaultCell>,
      invoiced: <DefaultCell>13</DefaultCell>,
      payment: <DefaultCell>Home delivery</DefaultCell>,
      shipped: <DefaultCell>Home delivery</DefaultCell>,
      amount: <DefaultCell>Home delivery</DefaultCell>,
    },
  ],
};

export default dataTableData;
