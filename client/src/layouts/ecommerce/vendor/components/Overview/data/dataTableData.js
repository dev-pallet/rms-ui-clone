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

// Images
import blackChair from 'assets/images/ecommerce/black-chair.jpeg';
import nikeV22 from 'assets/images/ecommerce/blue-shoe.jpeg';
import tripKit from 'assets/images/ecommerce/photo-tools.jpeg';
import wirelessCharger from 'assets/images/ecommerce/bang-sound.jpeg';

const dataTableData = {
  columns: [
    { Header: 'product', accessor: 'product', width: '40%' },
    { Header: 'quantity', accessor: 'quantity' ,width: '12%' },
    { Header: 'value', accessor: 'value' ,width: '12%' },
    { Header: 'sold', accessor: 'sold' ,width: '12%' },
    { Header: 'profit', accessor: 'profit' ,width: '12%' },
    { Header: 'returns', accessor: 'returns' ,width: '12%' },
  ],

  rows: [
    {
      product: <ProductCell image={nikeV22} name="Nike v22 Running" orders={8.232} />,
      quantity: <DefaultCell>1</DefaultCell>,
      value: <DefaultCell>₹ 9500</DefaultCell>,
      sold:<DefaultCell>23000</DefaultCell>,
      profit:<DefaultCell>₹ 45000</DefaultCell>,
      returns:<DefaultCell>32</DefaultCell>,
    },
    {
      product: <ProductCell image={tripKit} name="Nike v22 Running" orders={8.232} />,
      quantity: <DefaultCell>5</DefaultCell>,
      value: <DefaultCell>₹ 9500</DefaultCell>,
      sold:<DefaultCell>23000</DefaultCell>,
      profit:<DefaultCell>₹ 45000</DefaultCell>,
      returns:<DefaultCell>32</DefaultCell>,
    },
    {
      product: <ProductCell image={wirelessCharger} name="Nike v22 Running" orders={8.232} />,
      quantity: <DefaultCell>12</DefaultCell>,
      value: <DefaultCell>₹ 9500</DefaultCell>,
      sold:<DefaultCell>23000</DefaultCell>,
      profit:<DefaultCell>₹ 45000</DefaultCell>,
      returns:<DefaultCell>32</DefaultCell>,
    },
    {
      product: <ProductCell image={blackChair} name="Nike v22 Running" orders={8.232} />,
      quantity: <DefaultCell>67</DefaultCell>,
      value: <DefaultCell>₹ 9500</DefaultCell>,
      sold:<DefaultCell>23000</DefaultCell>,
      profit:<DefaultCell>₹ 45000</DefaultCell>,
      returns:<DefaultCell>32</DefaultCell>,
    },
  ],
};

export default dataTableData;
