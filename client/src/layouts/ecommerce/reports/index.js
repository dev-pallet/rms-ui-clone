import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MarketingBussinessReports from './components/MarketingBussinessReports';
import OperatorEffectivenessReport from './components/OperatorEffectiveness/OperatorEffectivenessReport';
import PosReports from './components/PosReports';
import ProfitmarginCustomers from './components/ProfitmarginCustomers';
import ReportHeader from './reportsadd/components/report-header';
import SalesAcquisition from './components/SalesAcquisition';

export const Reports = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ReportHeader />
      <SalesAcquisition />
      <ProfitmarginCustomers />
      <PosReports />
      {/* <FinancesMarketing /> */}
      <OperatorEffectivenessReport />
      <MarketingBussinessReports />
      <br />
    </DashboardLayout>
  );
};
