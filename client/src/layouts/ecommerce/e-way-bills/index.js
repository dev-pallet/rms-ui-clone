import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import ewayImg from 'assets/images/e-way-bills.png';
export const E_wayBills=()=>{
  return(
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox
        component="img"
        src={ewayImg}
        alt=""
        width="100%"
        height="100%"
      />

    </DashboardLayout>
  );
};