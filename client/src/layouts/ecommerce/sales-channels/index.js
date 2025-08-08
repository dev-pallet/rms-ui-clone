import './sales-channels.css';
import { Grid } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';


const Saleschannel = () =>{
  sideNavUpdate();
    
  return(
    <DashboardLayout>
      <DashboardNavbar/>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={4}>
          <SoftBox className="sales-channel-inner-cont">
            <SoftTypography className="cate-gory">Direct</SoftTypography>
            <SoftTypography className="categ-ories">Sell products physically at your warehouse using our in-built invoicing app.</SoftTypography>
          </SoftBox>
        </Grid>

        <Grid item xs={12} md={12} xl={4}>
          <SoftBox className="sales-channel-inner-cont">
            <SoftTypography className="cate-gory">Merchant app</SoftTypography>
            <SoftTypography className="categ-ories">List your products on the merchant app and let your customers order from the comfort of their home. </SoftTypography>
          </SoftBox>
        </Grid>

        <Grid item xs={12} md={12} xl={4}>
          <SoftBox className="sales-channel-inner-cont">
            <SoftTypography className="cate-gory">Google Merchant Center</SoftTypography>
            <SoftTypography className="categ-ories">List your products on Google Merchant Center (GMC) for free. Sync your products in no time and enhance your visibility.</SoftTypography>
          </SoftBox>
        </Grid>

      </Grid>
           
    </DashboardLayout>
  );
};

export default Saleschannel;