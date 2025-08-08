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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const dataTableData = {
  columns: [
    { Header: 'Payment Date', accessor: 'payment_date', width: '10%' },
    { Header: 'Paymnet Mode', accessor: 'payment_mode' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Balance', accessor: 'balance' },
    { Header: 'Attachments', accessor: 'attachments' },
  ],

  rows: [
    {

      payment_date: <DefaultCell>22 Nov 2022</DefaultCell>,
      payment_mode: <DefaultCell>Cheque</DefaultCell>,
      amount: <DefaultCell>₹ 23000</DefaultCell>,
      balance: <DefaultCell>₹ 34000</DefaultCell>,
      attachments:<DefaultCell> <a className="timelineitem-purchase"  href="https://drive.google.com/file/d/1yJKt1CL3bUE8jOt9ye0j6UmSGmzGtjlV/view?usp=share_link" target="_blank" rel="noreferrer">
      view
      </a></DefaultCell> ,

    },
    {

      payment_date: <DefaultCell>22 Nov 2022</DefaultCell>,
      payment_mode: <DefaultCell>Cheque</DefaultCell>,
      amount: <DefaultCell>₹ 23000</DefaultCell>,
      balance: <DefaultCell>₹ 34000</DefaultCell>,
      attachment:<DefaultCell>-</DefaultCell> ,

    },,

  ],
};

export default dataTableData;
