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
// Images

const dataTableData = {
  columns: [
    
    { Header: 'Date', accessor: 'date',align: 'center' },
    { Header: 'Payment#', accessor: 'payment',lign: 'center' },
    { Header: 'Reference#', accessor: 'reference', align: 'center' },
    { Header: 'Payment Mode', accessor: 'payment_mode', align: 'center' },
    { Header: 'Amount Paid', accessor: 'amount_paid', align: 'center' },
    { Header: 'Unused Amount', accessor: 'unused_amount', align: 'center' },
  ],


  rows: [
    { 
      date: <DefaultCell>23 Nov 2022</DefaultCell>,
      payment: <DefaultCell>Done</DefaultCell>,
      reference: <DefaultCell>ORIGIN12</DefaultCell>,
      payment_mode: <DefaultCell>Credit</DefaultCell>,
      amount_paid:<DefaultCell>₹ 32100</DefaultCell>,
      unused_amount:<DefaultCell>₹ 300</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2022</DefaultCell>,
      payment: <DefaultCell>Done</DefaultCell>,
      reference: <DefaultCell>ORIGIN12</DefaultCell>,
      payment_mode: <DefaultCell>Credit</DefaultCell>,
      amount_paid:<DefaultCell>₹ 32100</DefaultCell>,
      unused_amount:<DefaultCell>₹ 300</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2022</DefaultCell>,
      payment: <DefaultCell>Done</DefaultCell>,
      reference: <DefaultCell>ORIGIN12</DefaultCell>,
      payment_mode: <DefaultCell>Credit</DefaultCell>,
      amount_paid:<DefaultCell>₹ 32100</DefaultCell>,
      unused_amount:<DefaultCell>₹ 300</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2022</DefaultCell>,
      payment: <DefaultCell>Done</DefaultCell>,
      reference: <DefaultCell>ORIGIN12</DefaultCell>,
      payment_mode: <DefaultCell>Credit</DefaultCell>,
      amount_paid:<DefaultCell>₹ 32100</DefaultCell>,
      unused_amount:<DefaultCell>₹ 300</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2022</DefaultCell>,
      payment: <DefaultCell>Done</DefaultCell>,
      reference: <DefaultCell>ORIGIN12</DefaultCell>,
      payment_mode: <DefaultCell>Credit</DefaultCell>,
      amount_paid:<DefaultCell>₹ 32100</DefaultCell>,
      unused_amount:<DefaultCell>₹ 300</DefaultCell>,
    },
  ],
};

export default dataTableData;
