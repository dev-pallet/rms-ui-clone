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

// @mui material components
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import './Orderinfo.css';
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';

// Images
const orderImage =
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80';

function OrderInfo() {
  return (

    <>
      <Grid container spacing={3}>
        <Grid item xs={12} xl={12} p={1}>
          <table>
            <thead>
              <tr>
                <th className="th-text">Item</th>
                <th className="th-text">Rate</th>
                <th className="th-text">Quantity</th>
                <th className="th-text">Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="td-text"> <SoftAvatar mt={5} variant="rounded" size="xl" src={orderImage} alt="" /><SoftBox>Gold Glass</SoftBox></td>
                <td>781.00</td>
                <td>93820</td>
                <td>78945.00</td>
              </tr>     
            </tbody>

          </table>
        </Grid>
      </Grid>
   
        
    </>  
  );
}

export default OrderInfo;
