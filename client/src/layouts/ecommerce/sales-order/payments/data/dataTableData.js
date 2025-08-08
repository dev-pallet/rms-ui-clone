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
    { Header: 'Order', accessor: 'order', width: '10%' },
    { Header: 'Customer', accessor: 'customer' },
    { Header: 'Date', accessor: 'date', align: 'center' },
    { Header: 'Total', accessor: 'total', align: 'center' },
    { Header: 'Payment Status', accessor: 'payment_status', align: 'center' },
    { Header: 'Fulfilment Status', accessor: 'fulfilment_status', align: 'center' },
    { Header: 'Items', accessor: 'items', align: 'center' },
    { Header: 'Delivery methods', accessor: 'delivery_methods', align: 'center' },
  ],

  rows: [
    {
      order: <DefaultCell>#1001</DefaultCell>,
      customer: <DefaultCell>Jhon Doe</DefaultCell>,
      date: <DefaultCell>Today at 8:23 pm</DefaultCell>,
      total: <DefaultCell>₹ 842.6</DefaultCell>,
      payment_status: <DefaultCell>Paid (COD)</DefaultCell>,
      fulfilment_status: <DefaultCell>Fulfilled</DefaultCell>,
      items: <DefaultCell>13</DefaultCell>,
      delivery_methods: <DefaultCell>Home delivery</DefaultCell>,
    },
    {
      order: <DefaultCell>#1001</DefaultCell>,
      customer: <DefaultCell>Jhon Doe</DefaultCell>,
      date: <DefaultCell>Today at 6:23 pm</DefaultCell>,
      total: <DefaultCell>₹ 804.6</DefaultCell>,
      payment_status: <DefaultCell>Paid (COD)</DefaultCell>,
      fulfilment_status: <DefaultCell>UnFulfilled</DefaultCell>,
      items: <DefaultCell>7</DefaultCell>,
      delivery_methods: <DefaultCell>Home delivery</DefaultCell>,
    },
    {
      order: <DefaultCell>#1001</DefaultCell>,
      customer: <DefaultCell>Jhon Doe</DefaultCell>,
      date: <DefaultCell>Today at 3:09 pm</DefaultCell>,
      total: <DefaultCell>₹ 742.6</DefaultCell>,
      payment_status: <DefaultCell>Paid (COD)</DefaultCell>,
      fulfilment_status: <DefaultCell>Fulfilled</DefaultCell>,
      items: <DefaultCell>2</DefaultCell>,
      delivery_methods: <DefaultCell>Home delivery</DefaultCell>,
    },
    {
      order: <DefaultCell>#1001</DefaultCell>,
      customer: <DefaultCell>Jhon Doe</DefaultCell>,
      date: <DefaultCell>Today at 8:23 pm</DefaultCell>,
      total: <DefaultCell>₹ 645.6</DefaultCell>,
      payment_status: <DefaultCell>Paid (COD)</DefaultCell>,
      fulfilment_status: <DefaultCell>Fulfilled</DefaultCell>,
      items: <DefaultCell>13</DefaultCell>,
      delivery_methods: <DefaultCell>Home delivery</DefaultCell>,
    },
    {
      order: <DefaultCell>#1001</DefaultCell>,
      customer: <DefaultCell>Jhon Doe</DefaultCell>,
      date: <DefaultCell>Today at 8:23 pm</DefaultCell>,
      total: <DefaultCell>₹ 842.6</DefaultCell>,
      payment_status: <DefaultCell>Paid (COD)</DefaultCell>,
      fulfilment_status: <DefaultCell>Fulfilled</DefaultCell>,
      items: <DefaultCell>13</DefaultCell>,
      delivery_methods: <DefaultCell>Home delivery</DefaultCell>,
    },
  ],
};

export default dataTableData;
