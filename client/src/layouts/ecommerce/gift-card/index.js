import './gift.css';
import { Grid } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';



const Gift = () =>{
  //update setting navbar
  sideNavUpdate();
   

  return(
    <DashboardLayout>
      <DashboardNavbar/>
      <SoftBox className="gift-box">
                
        <SoftButton className="save-button-I">Save</SoftButton>
      </SoftBox>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="auto-div">
            <SoftTypography className="gift-text-I">Auto-expiration</SoftTypography>
            <SoftTypography className="gift-text-II">Set your gift cards to expire a certain amount of time after they’ve been purchased.</SoftTypography>
          </SoftBox>
        </Grid>

        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="expire-div">
            <input type="radio"/>
            <span className="gif-text">Gift cards never expire</span>
            <br/>
            <input type="radio"/>
            <span className="gif-text">Gift cards expire</span><br/>

            <SoftBox className="half-box">
              <SoftInput placeholder="5"/>
              <SoftInput placeholder="Year"/>
            </SoftBox>
            <SoftTypography className="gif-text">Countries have different laws for gift card expiry dates. Check the laws for your country before changing this date.</SoftTypography>
          </SoftBox>
        </Grid>

        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="auto-div">
            <SoftTypography className="gift-text-I">Apple Wallet</SoftTypography>
            <SoftTypography className="gift-text-II">Give your customers a digital gift card to use online or in your retail stores.
              <b className="learn-text">Learn more about Apple Wallet Passes.</b>
            </SoftTypography>
          </SoftBox>
        </Grid>

                
      </Grid>

           


    </DashboardLayout>
  );
};

export default Gift;