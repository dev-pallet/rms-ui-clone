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
import RefundsCell from 'layouts/ecommerce/overview/components/RefundsCell';


import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const dataTableData = {
  columns: [
    {Header: <Checkbox {...label} />,accessor:'checkbox',width:'3%'},
    { Header: 'Business name', accessor: 'business_name', width: '20%' },
    { Header: 'Orders', accessor: 'orders' },
    { Header: 'Total spent', accessor: 'total_spent', align: 'center' },
    { Header: 'Avg order value', accessor: 'avg_order_value', align: 'center' },
    { Header: 'Amount', accessor: 'amount', align: 'center' },
  ],

  rows: [
    {
      checkbox: <Checkbox {...label}/>,
      business_name:<DefaultCell>Jhon Doe</DefaultCell> ,
      orders: <DefaultCell>20</DefaultCell>,
      total_spent: <DefaultCell>$9.500</DefaultCell>,
      refunds: (
        <RefundsCell
          value={13}
          icon={{ color: 'success', name: 'keyboard_arrow_up' }}
          tooltip="Refund rate is lower with 97% than other products"
        />
      ),
      avg_order_value: <DefaultCell>$130.992</DefaultCell>,
      amount:<DefaultCell>$130.992</DefaultCell>,
    },
   
    //   <td>abc</td>
    //   <td>abc</td>
    //   <td>abc</td>
    //
    {
      checkbox: <Checkbox {...label} />,
      business_name: <DefaultCell>Jhon Doe</DefaultCell>,
      orders: <DefaultCell>50</DefaultCell>,
      total_spent: <DefaultCell>$4.200</DefaultCell>,
      refunds: <RefundsCell value={40} icon={{ color: 'error', name: 'keyboard_arrow_down' }} />,
      avg_order_value: <DefaultCell>$130.992</DefaultCell>,
      amount:<DefaultCell>$130.992</DefaultCell>,

    },
    {
      checkbox: <Checkbox {...label} />,
      business_name: <DefaultCell>Jhon Doe</DefaultCell>,
      orders: <DefaultCell>13</DefaultCell>,
      total_spent: <DefaultCell>$9.430</DefaultCell>,
      refunds: <RefundsCell value={54} icon={{ color: 'success', name: 'keyboard_arrow_up' }} />,
      avg_order_value: <DefaultCell>$130.992</DefaultCell>,
      amount:<DefaultCell>$130.992</DefaultCell>,
    },
    {
      checkbox: <Checkbox {...label} />,
      business_name: <DefaultCell>Jhon Doe</DefaultCell>,
      orders: <DefaultCell>34</DefaultCell>,
      total_spent: <DefaultCell>$7.364</DefaultCell>,
      refunds: <RefundsCell value={5} icon={{ color: 'error', name: 'keyboard_arrow_down' }} />,
      avg_order_value: <DefaultCell>$130.992</DefaultCell>,
      amount:<DefaultCell>$130.992</DefaultCell>,
    },
    {
      checkbox: <Checkbox {...label} />,
      business_name: <DefaultCell>Jhon Doe</DefaultCell>,
      orders: <DefaultCell>25</DefaultCell>,
      total_spent:<DefaultCell>$20.531</DefaultCell>,
      refunds: (
        <RefundsCell
          value={121}
          icon={{ color: 'success', name: 'keyboard_arrow_up' }}
          tooltip="Refund rate is higher with 70% than other products"
        />
      ),
      avg_order_value: <DefaultCell>$130.992</DefaultCell>,
      amount:<DefaultCell>$130.992</DefaultCell>,
    },
  ],
};

export default dataTableData;
