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
import ProductCell from 'layouts/ecommerce/overview/components/ProductCell';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const dataTableData = {
  columns: [
    {Header: <Checkbox {...label} />,accessor:'checkbox',width:'3%'},
    { Header: 'Product', accessor: 'product', width: '20%' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Inventory', accessor: 'inventory', align: 'center' },
    { Header: 'Category', accessor: 'category', align: 'center' },
    { Header: 'Vendor', accessor: 'vendor', align: 'center' },

  ],

  rows: [
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Sugar"/>,
      status: <DefaultCell>Active</DefaultCell>,
      inventory: <DefaultCell>120 Kgs in stock</DefaultCell>,
      category: <DefaultCell>Food grain & pulses</DefaultCell>,
      vendor:<DefaultCell>ABC Sugar Mills</DefaultCell>,
    },
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Ponni rice"/>,
      status: <DefaultCell>Active</DefaultCell>,
      inventory: <DefaultCell>20 Kgs in stock</DefaultCell>,
      category: <DefaultCell>Food grain & pulses</DefaultCell>,
      vendor:<DefaultCell>IJK Rice Mills</DefaultCell>,
    },
    {
      checkbox: <Checkbox {...label}/>,
      product: <ProductCell image={''} name="Urud Dal"/>,
      status: <DefaultCell>Active</DefaultCell>,
      inventory: <DefaultCell>10 Kgs in stock</DefaultCell>,
      category: <DefaultCell>Food grain & pulses</DefaultCell>,
      vendor:<DefaultCell>XYZ market</DefaultCell>,
    },
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Moong Dal"/>,
      status: <DefaultCell>Active</DefaultCell>,
      inventory: <DefaultCell>25 Kgs in stock</DefaultCell>,
      category: <DefaultCell>Food grain & pulses</DefaultCell>,
      vendor:<DefaultCell>XYZ market</DefaultCell>,
    },
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Alice Vinget"/>,
      status: <DefaultCell>Active</DefaultCell>,
      inventory: <DefaultCell>37 Kgs in stock</DefaultCell>,
      category: <DefaultCell>Food grain & pulses</DefaultCell>,
      vendor:<DefaultCell>XYZ market</DefaultCell>,
    },
  ],
};

export default dataTableData;
