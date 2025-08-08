


import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import ReportCardsParent from './components/report-cards-parent';
import ReportHeader from './components/report-header';


export const Reports = () => {
  return (
    <DashboardLayout >
      <DashboardNavbar />
      <ReportHeader />
      <ReportCardsParent />
    </DashboardLayout>
  );
};

// <SoftBox
//                 component="img"
//                 src={reportImg}
//                 alt="report"
//                 width="100%"
//                 height="100%"
//             />
