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
import CloseIcon from '@mui/icons-material/Close';
import DefaultCell from 'layouts/ecommerce/overview/components/DefaultCell';
import ProductCell from 'layouts/ecommerce/overview/components/ProductCell';
import SoftInput from 'components/SoftInput';
import SoftTypograpgy from 'components/SoftTypography';

const dataTableData = {
  columns: [
    { Header: 'Product', accessor: 'product', width: '25%' },
    { Header: 'SKU', accessor: 'sku' },
    { Header: 'Quantity', accessor: 'quantity', align: 'center' },
    { Header: '', accessor: 'barcode', align: 'center'},
    {Header: '', accessor:'closebtn'}
  ],

  rows: [
    {
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>Active</DefaultCell>,
      quantity: <SoftInput type="number"></SoftInput>,
      barcode: <SoftTypograpgy variant="Link">Barcode</SoftTypograpgy>, 
      closebtn:<CloseIcon/>

    },
    {
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>Active</DefaultCell>,
      quantity: <SoftInput type="number"></SoftInput>,
      barcode: <SoftTypograpgy variant="Link">Barcode</SoftTypograpgy>, 
      closebtn:<CloseIcon/>

    },
    {
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>Active</DefaultCell>,
      quantity: <SoftInput type="number"></SoftInput>,
      barcode: <SoftTypograpgy variant="Link">Barcode</SoftTypograpgy>, 
      closebtn:<CloseIcon/>

    },
    {
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>Active</DefaultCell>,
      quantity: <SoftInput type="number"></SoftInput>,
      barcode: <SoftTypograpgy variant="Link">Barcode</SoftTypograpgy>, 
      closebtn:<CloseIcon/>

    },
    {
      product: <ProductCell image={''} name="Sugar"/>,
      sku: <DefaultCell>Active</DefaultCell>,
      quantity: <SoftInput type="number"></SoftInput>,
      barcode: <SoftTypograpgy variant="Link">Barcode</SoftTypograpgy>, 
      closebtn:<CloseIcon/>

    },
  ],
};

export default dataTableData;
