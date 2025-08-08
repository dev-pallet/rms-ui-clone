import './barcode.css';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTable from 'examples/Tables/DataTable';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import dataTableData from 'layouts/ecommerce/product/barcode/data/dataTableData';
export const Barcode=()=>{
  return(
    <DashboardLayout>
      <DashboardNavbar/>
      <SoftBox>
        
                

        <SoftBox className="barcode-table-shadow">
          <SoftBox>
            <SoftBox>
              <SoftBox className="barcode-filter-bar">
                <SoftBox className="barcode-add-list">
                  <SoftInput className="filter-soft-input-box"
                    placeholder="Filter Purchases"
                    icon={{ component: 'search', direction: 'left' }}
                  />
                </SoftBox>
                <SoftBox>
                  <SoftButton className="barcode-filter-bar-btn">Browse</SoftButton>
                  <SoftButton className="barcode-page-create-btn">Create</SoftButton>
                </SoftBox>
              </SoftBox>
            </SoftBox>

            <SoftBox py={1}>
              <DataTable
                table={dataTableData}
                entriesPerPage={false}
                showTotalEntries={false}
                isSorted={false}
       
              />
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </SoftBox>  
    </DashboardLayout>
  );
   
        
};