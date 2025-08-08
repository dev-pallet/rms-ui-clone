import * as React from 'react';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
// import TestProducts from './TestProducts.json';
// import TestDistributionData from './TestDistributionData.json';
import SoftButton from '../../../../components/SoftButton';
const labelContent = (e) => e.category;
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const firstSeries = [123, 276, 310, 212, 240, 156, 98];
const secondSeries = [165, 210, 287, 144, 190, 167, 212];
const thirdSeries = [56, 140, 195, 46, 123, 78, 95];

const TestComponent = () => {
  const container = React.useRef(null);
  const pdfExportComponent = React.useRef(null);
  const exportPDFWithMethod = () => {
    const element = container.current || document.body;
    savePDF(element, {
      paperSize: 'auto',
      margin: 40,
      fileName: `Report for ${new Date().getFullYear()}`,
    });
  };
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <div className="example-config">
          <SoftButton
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={exportPDFWithComponent}
          >
            Export with component
          </SoftButton>
          &nbsp;
          <SoftButton
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={exportPDFWithMethod}
          >
            Export with method
          </SoftButton>
        </div>
        <div className="border rounded p-2">
          <PDFExport
            ref={pdfExportComponent}
            paperSize="auto"
            margin={40}
            fileName={`Report for ${new Date().getFullYear()}`}
            author="KendoReact Team"
          >
            <div ref={container}>
              <h3 className="text-center">Monthly report</h3>
              <hr className="k-hr" />
            


            </div>
          </PDFExport>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestComponent;
