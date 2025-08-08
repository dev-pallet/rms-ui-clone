import './category-form.css';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';


const Categoryform = ()=>{
  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <SoftBox className="category-form-main-box">
        <SoftTypography>Page</SoftTypography>
      </SoftBox>
    </DashboardLayout>
  );
};

export default Categoryform;
