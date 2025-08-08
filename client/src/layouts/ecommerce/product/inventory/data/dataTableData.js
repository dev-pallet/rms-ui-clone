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
    { Header: 'SKU', accessor: 'sku' },
    { Header: 'When sold out', accessor: 'whensoldout', align: 'center' },
    { Header: 'Incoming', accessor: 'incoming', align: 'center' },
    { Header: 'Available', accessor: 'available', align: 'center' },
    { Header: 'Edit quantity availbale', accessor: 'editquantityavailable', align: 'center' },

  ],

  rows: [
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>SG1234</DefaultCell>,
      whensoldout: <DefaultCell>Stop selling</DefaultCell>,
      incoming: <DefaultCell>0 Kgs</DefaultCell>,
      available:<DefaultCell>25 Kgs</DefaultCell>,
      editquantityavailable:<DefaultCell>0</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>SG1237</DefaultCell>,
      whensoldout: <DefaultCell>Stop selling</DefaultCell>,
      incoming: <DefaultCell>200 Kgs</DefaultCell>,
      available:<DefaultCell>210 Kgs</DefaultCell>,
      editquantityavailable:<DefaultCell>0</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>SG1259</DefaultCell>,
      whensoldout: <DefaultCell>Stop selling</DefaultCell>,
      incoming: <DefaultCell>0 Kgs</DefaultCell>,
      available:<DefaultCell>30 Kgs</DefaultCell>,
      editquantityavailable:<DefaultCell>0</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>SG4234</DefaultCell>,
      whensoldout: <DefaultCell>Stop selling</DefaultCell>,
      incoming: <DefaultCell>0 Kgs</DefaultCell>,
      available:<DefaultCell>10 Kgs</DefaultCell>,
      editquantityavailable:<DefaultCell>0</DefaultCell>,
      
    },
    {
      checkbox: <Checkbox {...label}/>, 
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>SG1734</DefaultCell>,
      whensoldout: <DefaultCell>Stop selling</DefaultCell>,
      incoming: <DefaultCell>100 Kgs</DefaultCell>,
      available:<DefaultCell>25 Kgs</DefaultCell>,
      editquantityavailable:<DefaultCell>0</DefaultCell>,
      
    },
  ],
};

export default dataTableData;
