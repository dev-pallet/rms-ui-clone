import './integration.css';
import { Grid } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';



const Integration = () =>{
  sideNavUpdate();
    
  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={4}>
          <SoftBox className="integration-inner-cont">
            <SoftTypography className="cate-gory">Vendor Payments</SoftTypography>
            <SoftTypography className="categ-ories">Connect your bank account to make all vendor payments</SoftTypography>
          </SoftBox>
        </Grid>
        <Grid item xs={12} md={12} xl={4}>
          <SoftBox className="integration-inner-cont">
            <SoftTypography className="cate-gory">Shipping</SoftTypography>
            <SoftTypography className="categ-ories">Connect a shipping vendor of your choice to deliver products to your doorstep</SoftTypography>
          </SoftBox>
        </Grid>
        <Grid item xs={12} md={12} xl={4}>
          <SoftBox className="integration-inner-cont">
            <SoftTypography className="cate-gory">Accounting</SoftTypography>
            <SoftTypography className="categ-ories">Go paperless! Streamline your business accounts and stay up to date on your tax liability by integrating with your Books.</SoftTypography>
          </SoftBox>
        </Grid>
        <Grid item xs={12} md={12} xl={4}>
          <SoftBox className="integration-inner-cont">
            <SoftTypography className="cate-gory">Other apps</SoftTypography>
            <SoftTypography className="categ-ories">Integrate your warehouse with other apps to increase productivity</SoftTypography>
          </SoftBox>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Integration;