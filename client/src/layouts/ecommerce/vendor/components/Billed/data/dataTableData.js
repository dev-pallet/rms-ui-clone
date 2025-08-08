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
import '../../../vendor.css';
import { Checkbox } from '@mui/material';
import DefaultCell from 'layouts/ecommerce/overview/components/DefaultCell';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
// Images

const dataTableData = {
  columns: [
    {Header:<Checkbox className="vendor-table-checkbox"/>,accessor:'vendor_checkbox',width:'5%'},
    {Header:'',accessor:'star',width:'5%'},
    { Header: 'Vendor ID', accessor: 'vendor_id', width: '15%' },
    { Header: 'Vendor name', accessor: 'vendor_name' },
    { Header: 'Location', accessor: 'location', align: 'center' },
    { Header: 'GST number', accessor: 'gst_number', align: 'center' },
    { Header: 'Payable', accessor: 'payable', align: 'center' },
    { Header: 'Due date', accessor: 'due_date', align: 'center' },
  ],


  rows: [
    { 
      vendor_checkbox:<Checkbox className="vendor-table-checkbox"/>,
      start:<StarBorderIcon/>,
      vendor_id: <DefaultCell>#PO321</DefaultCell>,
      vendor_name: <DefaultCell>Evernest direct</DefaultCell>,
      location: <DefaultCell>Chennai</DefaultCell>,
      gst_number: <DefaultCell>FS77356739GHT</DefaultCell>,
      payable:<DefaultCell>₹ 32100</DefaultCell>,
      due_date:<DefaultCell>21 days</DefaultCell>,
    },
    {
      vendor_checkbox:<Checkbox className="vendor-table-checkbox"/>,
      start:<StarBorderIcon/>,
      vendor_id: <DefaultCell>#PO421</DefaultCell>,
      vendor_name: <DefaultCell>TKP Enterpise</DefaultCell>,
      location: <DefaultCell>Erode</DefaultCell>,
      gst_number: <DefaultCell>FS77356739GHT</DefaultCell>,
      payable:<DefaultCell>₹ 32100</DefaultCell>,
      due_date:<DefaultCell>21 days</DefaultCell>,
    },
    {
      vendor_checkbox:<Checkbox className="vendor-table-checkbox"/>,
      start:<StarBorderIcon/>,
      vendor_id: <DefaultCell>#PO321</DefaultCell>,
      vendor_name: <DefaultCell>Evernest direct</DefaultCell>,
      location: <DefaultCell>Chennai</DefaultCell>,
      gst_number: <DefaultCell>FS77356739GHT</DefaultCell>,
      payable:<DefaultCell>₹ 32100</DefaultCell>,
      due_date:<DefaultCell>21 days</DefaultCell>,
    },
  ],
};

export default dataTableData;
