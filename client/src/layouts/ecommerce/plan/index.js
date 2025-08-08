import './plan.css';
import { Grid } from '@mui/material';
import {Link} from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';


const Plan = () =>{
  sideNavUpdate();

  return(
    <DashboardLayout>
      <DashboardNavbar/>
    

      <SoftBox className="plan-detils-box">
        <SoftTypography className="plan-details-text">Plan details</SoftTypography>
        <SoftTypography className="plan-manage-text">Manage or change your Shopify plan. View our <b className="terms-text"> terms of service</b> and <b className="terms-text">privacy policy.</b> </SoftTypography>
      </SoftBox>


      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="plan-main-box">

            <SoftBox className="plan-inner-main-box">
              <SoftTypography className="plan-details-text-I">Trial</SoftTypography>
              <SoftTypography className="plan-manage-text">You are in a trial store.</SoftTypography>
            </SoftBox>

            <SoftBox className="plan-inner-main-box">
              <SoftTypography className="plan-details-text-I">NEXT BILLING DATE</SoftTypography>
              <SoftTypography className="plan-manage-text">Your trial has 2 days remaining</SoftTypography>
            </SoftBox>

            <SoftBox className="plan-inner-main-box">
              <SoftTypography className="plan-details-text-I">PAYMENT METHOD</SoftTypography>
              <SoftTypography className="plan-manage-text">No payment method added</SoftTypography>

              <Link to="/setting/billing">
                <SoftTypography className="update-text">Update payment method</SoftTypography></Link>
            </SoftBox>

            <SoftBox className="plan-inner-main-box-II">
              <SoftButton className="deactive-button">Deactivate trail</SoftButton>
              <SoftButton className="choose-button">Choose plan</SoftButton>
            </SoftBox>
          </SoftBox>
        </Grid>
      </Grid>

    </DashboardLayout>
  );
};

export default Plan;