import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import { ImgsViewer } from 'react-images-viewer';

export const Test = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true}/>
      <SoftBox>
        <img
          style={{
            margin: '0',    
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, 50%)',
          }}
          src="https://media.istockphoto.com/id/1356466745/vector/vector-illustration-coming-soon-banner-with-clock-sign.jpg?s=612x612&w=0&k=20&c=B3zjuvyrKLWPXmadC1TptchLH6et9P9-Nrr76Pia8Lo="
        />
      </SoftBox>
    </DashboardLayout>
  );
};
