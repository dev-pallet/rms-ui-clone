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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const dataTableData = {
  columns: [

    {Header: 'Sr. No.', accessor: 'sr_no', align: 'left' },
    {Header:'Description of the gooods to be supplied',accessor:'des',align:'left',width:'300px'},
    {Header:'Quantity Ordered',accessor:'quantityOrdered',align:'left'},
 

  ],

  rows: [
    {
      sr_no:<DefaultCell>1</DefaultCell>,
      des:<DefaultCell>Sugar</DefaultCell>,
      quantityOrdered:<DefaultCell>100 Kg</DefaultCell>,
    },
    {
      sr_no:<DefaultCell>2</DefaultCell>,
      des:<DefaultCell>Sugar</DefaultCell>,
      quantityOrdered:<DefaultCell>100 Kg</DefaultCell>,
 
    },
    {
      sr_no:<DefaultCell>3</DefaultCell>,
      des:<DefaultCell>Sugar</DefaultCell>,
      quantityOrdered:<DefaultCell>100 Kg</DefaultCell>,

    },
    {
      sr_no:<DefaultCell>4</DefaultCell>,
      des:<DefaultCell>Sugar</DefaultCell>,
      quantityOrdered:<DefaultCell>100 Kg</DefaultCell>,

    },
    {
      sr_no:<DefaultCell>5</DefaultCell>,
      des:<DefaultCell>Sugar</DefaultCell>,
      quantityOrdered:<DefaultCell>100 Kg</DefaultCell>,

    },
    {
      sr_no:<DefaultCell>6</DefaultCell>,
      des:<DefaultCell>Sugar</DefaultCell>,
      quantityOrdered:<DefaultCell>100 Kg</DefaultCell>,

    },
    {
      sr_no:<DefaultCell>7</DefaultCell>,
      des:<DefaultCell>Sugar</DefaultCell>,
      quantityOrdered:<DefaultCell>100 Kg</DefaultCell>,
  
    },
  ],
};

export default dataTableData;
