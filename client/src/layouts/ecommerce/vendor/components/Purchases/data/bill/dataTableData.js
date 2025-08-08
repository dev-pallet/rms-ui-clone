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
    
    { Header: 'Date', accessor: 'date', align: 'center' },
    { Header: 'Bill#', accessor: 'bill',align: 'center' },
    { Header: 'Reference#', accessor: 'reference', align: 'center' },
    { Header: 'Vendor Name', accessor: 'vendor_name', align: 'center' },
    { Header: 'Amount', accessor: 'amount', align: 'center' },
    { Header: 'Balance Due', accessor: 'balance_due', align: 'center' },
    { Header: 'Status', accessor: 'status', align: 'center' },
  ],


  rows: [
    { 
      date: <DefaultCell>23 Nov 2021</DefaultCell>,
      bill: <DefaultCell>Bill-0</DefaultCell>,
      reference: <DefaultCell>91122</DefaultCell>,
      vendor_name: <DefaultCell>Overseas Vendor</DefaultCell>,
      amount:<DefaultCell>₹ 924.00390</DefaultCell>,
      balance_due:<DefaultCell>₹ 872.0039</DefaultCell>,
      status:<DefaultCell>Draft</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2021</DefaultCell>,
      bill: <DefaultCell>Bill-0</DefaultCell>,
      reference: <DefaultCell>91122</DefaultCell>,
      vendor_name: <DefaultCell>Overseas Vendor</DefaultCell>,
      amount:<DefaultCell>₹ 924.00390</DefaultCell>,
      balance_due:<DefaultCell>₹ 872.0039</DefaultCell>,
      status:<DefaultCell>Draft</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2021</DefaultCell>,
      bill: <DefaultCell>Bill-0</DefaultCell>,
      reference: <DefaultCell>91122</DefaultCell>,
      vendor_name: <DefaultCell>Overseas Vendor</DefaultCell>,
      amount:<DefaultCell>₹ 924.00390</DefaultCell>,
      balance_due:<DefaultCell>₹ 872.0039</DefaultCell>,
      status:<DefaultCell>Draft</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2021</DefaultCell>,
      bill: <DefaultCell>Bill-0</DefaultCell>,
      reference: <DefaultCell>91122</DefaultCell>,
      vendor_name: <DefaultCell>Overseas Vendor</DefaultCell>,
      amount:<DefaultCell>₹ 924.00390</DefaultCell>,
      balance_due:<DefaultCell>₹ 872.0039</DefaultCell>,
      status:<DefaultCell>Draft</DefaultCell>,
    },
    { 
      date: <DefaultCell>23 Nov 2021</DefaultCell>,
      bill: <DefaultCell>Bill-0</DefaultCell>,
      reference: <DefaultCell>91122</DefaultCell>,
      vendor_name: <DefaultCell>Overseas Vendor</DefaultCell>,
      amount:<DefaultCell>₹ 924.00390</DefaultCell>,
      balance_due:<DefaultCell>₹ 872.0039</DefaultCell>,
      status:<DefaultCell>Draft</DefaultCell>,
    },
  ],
};

export default dataTableData;
