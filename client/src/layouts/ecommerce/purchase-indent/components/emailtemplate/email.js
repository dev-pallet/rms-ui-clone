import './indentemail.css';
import * as React from 'react';
import {useState } from 'react';
import Card from '@mui/material/Card';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import DownloadIcon from '@mui/icons-material/Download';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import MuiAlert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import dataTableData from './dataTableData';
import logo from 'assets/images/PALLET icon.png';


export const IndentEmailTemplate = () => {

  // const {id}= useParams()

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = React.useState(false);
  const [vertical, setVertical] = React.useState('bottom');
  const [horizontal, setHorizontal] = React.useState('center');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const [exdate,setExdate] = useState('');
  const [assignedTo,setAssignedTo] = useState('');
  const [shippingmethod,setShippingMethod] = useState('');
  const [shippingterms,setShippingTerms] = useState('');



  // useEffect(()=>{
  //   purchaseIndentpreviewpage(id).then((res)=>{
  //     setExdate(res.data.expectedDeliveryDate)
  //     setAssignedTo(res.data.assignedTo)
  //     setShippingMethod(res.data.shippingMethod)
  //     setShippingTerms(res.data.shippingTerms)
  //   })
  // },[])




  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="email-send-btn">

        <SoftBox className="email-inner-box" onClick={handleClick}>
          <DownloadIcon className="email-send-icon" />
          <SoftTypography className="email-send-inner-content" variant="h6">PDF</SoftTypography>
        </SoftBox>


        <SoftBox className="email-inner-box" onClick={handleClick}>
          <SoftTypography className="email-send-inner-content" variant="h6">Send</SoftTypography>
          <SendIcon className="email-send-icon" />
        </SoftBox>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            This is a success message!
          </Alert>
        </Snackbar>
      </SoftBox>
      <SoftBox className="email-temp-main-box">
        <SoftBox className='profile-box-pi'>
          <SoftBox className="user-profile-pic-box">
            <h1 className="user-value-text">E</h1>
          </SoftBox>
          <SoftBox className="user-address-profile-box">
            <p className="address-pi-text">Evernest Wholesale Supply India Private Limited</p>
            <p className="gst-text-pi">GST : 33AAHCE0913E1Z8</p>
          </SoftBox>

          
        </SoftBox>

        

        <SoftBox mt={1} mb={1} display="flex" justifyContent="center">
          <SoftTypography className="purchase-indent-text-line" variant="h4">Purchase Indent</SoftTypography>
        </SoftBox>


        <SoftBox className="email-template-box">
          <SoftBox className="email-temp-inner-box">
            <SoftBox className="email-temp-first-row">
              
              <Card className="email-inner-left1">
                <SoftTypography className="temp-font-color">Indent No: -----</SoftTypography>
                <SoftTypography className="temp-font-color">Expected Date: -----</SoftTypography>
                <SoftTypography className="temp-font-color">Assigned To : -----</SoftTypography> 
                <SoftTypography className="temp-font-color">Shipping Method : -----</SoftTypography>
                <SoftTypography className="temp-font-color">Shipping Terms : -----</SoftTypography>
              </Card>

              <Card className="email-temp-mar-right">
                <SoftBox p={2}>
                  <SoftTypography className="temp-font-color">Delivery Site Address:</SoftTypography>
                  <SoftTypography className="temp-font-color">EVERNEST Wholesale Supply India Pvt Ltd,</SoftTypography>
                  <SoftTypography className="temp-font-color"># 310, Sundaram Spinning Mills, Salem Main Road,</SoftTypography>
                  <SoftTypography className="temp-font-color">Behind Indian Overseas Bank, Komarapalayam,</SoftTypography>
                  <SoftTypography className="temp-font-color">Namakkal District, Tamilnadu - 638183</SoftTypography>
                  <SoftTypography className="temp-font-color">GSTIN: 33AAHCE0913E1Z8</SoftTypography>
                </SoftBox>
              </Card>


            </SoftBox>
            <SoftBox mt={1}>

              <SoftBox py={1}  className="data-flex-table">
                <SoftTypography className="email-mid-para">We would  like to place purchase order for the following materials:</SoftTypography>
                <DataTable
                  table={dataTableData}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  isSorted={false}
                 
                />
              </SoftBox>
            </SoftBox>

            <Card sx={{ marginTop: '20px' }}>
              {/* <SoftBox display="flex" justifyContent="space-between" p={2}>
                <SoftTypography className="temp-font-color extra-bold">2 Lakh twenty five thousand only.</SoftTypography>
                <SoftBox className="email-temp-flex-box">
                <SoftTypography className="temp-font-color extra-bold">Net Total(INR)</SoftTypography>
                <SoftTypography className="temp-font-color extra-bold">₹ 225000</SoftTypography>
                </SoftBox>
              </SoftBox> */}
            </Card>
            {/* <SoftBox display="flex" mt={2} mb={2}>
              <Card className="email-temp-mar-right">
                <SoftBox p={2}>
                  <SoftTypography className="temp-font-color1 extra-bold">Delivery Site Address:</SoftTypography>
                  <SoftTypography className="temp-font-color1">EVERNEST Wholesale Supply India Pvt Ltd,</SoftTypography>
                  <SoftTypography className="temp-font-color1"># 310, Sundaram Spinning Mills, Salem Main Road,</SoftTypography>
                  <SoftTypography className="temp-font-color1">Behind Indian Overseas Bank, Komarapalayam,</SoftTypography>
                  <SoftTypography className="temp-font-color1">Namakkal District, Tamilnadu - 638183</SoftTypography>
                  <SoftTypography className="temp-font-color1">GSTIN: 33AAHCE0913E1Z8</SoftTypography>
                </SoftBox>
              </Card>
              <Card className="email-temp-mar-right">
                <SoftBox p={2}>
                  <SoftTypography className="temp-font-color1 extra-bold">Billing Address:</SoftTypography>
                  <SoftTypography className="temp-font-color1">EVERNEST Wholesale Supply India Pvt Ltd,</SoftTypography>
                  <SoftTypography className="temp-font-color1">No.13B, First floor, Apex Colony,</SoftTypography>
                  <SoftTypography className="temp-font-color1">Pallipalayam Road, Komarapalayam,</SoftTypography>
                  <SoftTypography className="temp-font-color1">Namakkal District, Tamilnadu - 638183</SoftTypography>
                  <SoftTypography className="temp-font-color1">GSTIN: 33AAHCE0913E1Z8</SoftTypography>
                </SoftBox>
              </Card>
              <Card>
              <SoftBox p={2}>
                <SoftTypography className="temp-font-color1 extra-bold">Payment Terms with Bank Details if any:</SoftTypography>
                <SoftTypography className="temp-font-color1">1. 100% advance made along with P.O</SoftTypography>
                <SoftTypography className="temp-font-color1 extra-bold">Bank Details:-</SoftTypography>
                <SoftTypography className="temp-font-color1">A/c. Name: Shri Kumaran Agency</SoftTypography>
                <SoftTypography className="temp-font-color1">Bank Name: State Bank of India</SoftTypography>
                <SoftTypography className="temp-font-color1">Branch Name: G H Road, Erode</SoftTypography>
                <SoftTypography className="temp-font-color1">A/c. No & Type: 33680055438 - CA</SoftTypography>
                <SoftTypography className="temp-font-color1">IFSC: SBIN0011057</SoftTypography>
              </SoftBox>
            </Card>
            </SoftBox> */}
            {/* <SoftBox mt={2} mb={2}>
            <Card>
              <SoftBox p={2}>
            <SoftTypography className="temp-font-color1">Warranty : 1 Year service warranty from the date of Invoice</SoftTypography>
            <SoftTypography className="temp-font-color1">Other any terms : Materials will be delivered within 2 to 3 days’ time from date of payment.</SoftTypography>
              </SoftBox>
           </Card>
           </SoftBox> */}
          </SoftBox>
        </SoftBox >
        {/* <SoftTypography className="email-template-img" component="img" src={footer} /> */}

        <SoftBox className="pi-footer-box">
          <SoftBox className="pi-footer-email-box">
            <SoftBox className="mail-box-pi">
              <MailIcon/>
            </SoftBox>
            <SoftBox className="website-pi-box">
              <p className="website-text">hello@myorigin.com</p>
              <p className="website-text-I">www.myorigin.com</p>
            </SoftBox>
          </SoftBox>

          <SoftBox className="pi-footer-address-box">

            <SoftBox className="mail-box-pi">
              <LocationOnIcon/>
            </SoftBox>
            <SoftBox className="website-pi-box">
              <p className="website-text">Level 4 ,No 3, Narayani Acrade, ITPL main road</p>
              <p className="website-text-I">Kundalahalli, Bengaluru, Karnataka 560037</p>
            </SoftBox>
          </SoftBox>
        </SoftBox>

        <SoftBox className="bottom-logo-box-footer">
          <SoftBox className="bottom-logo-box-footer-img">
            <img src={logo} alt="" className="footer-img-bottom"/>
          </SoftBox>
          <p className="website-text-I">Powered by Pallet</p>
        </SoftBox>

      </SoftBox>
    </DashboardLayout>
  );
};