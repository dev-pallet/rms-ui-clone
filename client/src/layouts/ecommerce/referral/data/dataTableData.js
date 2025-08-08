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
import ProductCell from 'layouts/ecommerce/overview/components/ProductCell';
import RefundsCell from 'layouts/ecommerce/overview/components/RefundsCell';

const dataTableData = {
  columns: [
    { Header: 'user', accessor: 'user', width: '40%' },
    { Header: 'value', accessor: 'value' },
    { Header: 'profit', accessor: 'profit', align: 'center' },
    { Header: 'refunds', accessor: 'refunds', align: 'center' },
  ],

  rows: [
    {
      user: <ProductCell image={''} name="Alice Vinget" orders={8.232} />,
      value: <DefaultCell>$130.992</DefaultCell>,
      profit: <DefaultCell>$9.500</DefaultCell>,
      refunds: (
        <RefundsCell
          value={13}
          icon={{ color: 'success', name: 'keyboard_arrow_up' }}
          tooltip="Refund rate is lower with 97% than other products"
        />
      ),
    },
    {
      user: <ProductCell image={''} name="John Alura" orders={12.821} />,
      value: <DefaultCell>$80.250</DefaultCell>,
      profit: <DefaultCell>$4.200</DefaultCell>,
      refunds: <RefundsCell value={40} icon={{ color: 'error', name: 'keyboard_arrow_down' }} />,
    },
    {
      user: <ProductCell image={''} name="Andrew Sian" orders={2.421} />,
      value: <DefaultCell>$40.600</DefaultCell>,
      profit: <DefaultCell>$9.430</DefaultCell>,
      refunds: <RefundsCell value={54} icon={{ color: 'success', name: 'keyboard_arrow_up' }} />,
    },
    {
      user: <ProductCell image={''} name="Luca Willaim" orders={5.921} />,
      value: <DefaultCell>$91.300</DefaultCell>,
      profit: <DefaultCell>$7.364</DefaultCell>,
      refunds: <RefundsCell value={5} icon={{ color: 'error', name: 'keyboard_arrow_down' }} />,
    },
    {
      user: <ProductCell image={''} name="Richel Manuel" orders={921} />,
      value: <DefaultCell>$140.925</DefaultCell>,
      profit: <DefaultCell>$20.531</DefaultCell>,
      refunds: (
        <RefundsCell
          value={121}
          icon={{ color: 'success', name: 'keyboard_arrow_up' }}
          tooltip="Refund rate is higher with 70% than other products"
        />
      ),
    },
  ],
};

export default dataTableData;
