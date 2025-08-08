import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import SoftBox from 'components/SoftBox';


export const PurchaseDetailsPage=()=>{
  return(
    <DashboardLayout>
      <DashboardNavbar/> 
      <SoftBox>
        <Grid container spacing={1}>
          <Grid item xs={12} xl={4}>
            <Timeline/>
          </Grid>

          <Grid item xs={12} xl={8}>
            <OrderDetailspage/>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
       
  );
};