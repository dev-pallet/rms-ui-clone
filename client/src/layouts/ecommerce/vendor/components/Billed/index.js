import DataTable from 'examples/Tables/DataTable';
import SoftBox from 'components/SoftBox';
import dataTableData from 'layouts/ecommerce/vendor/components/Billed/data/dataTableData';
export const Billed=()=>{
  return(
   
    <SoftBox py={1}>
      <DataTable
        table={dataTableData}
        entriesPerPage={false}
        showTotalEntries={false}
        isSorted={false}
               
      />
    </SoftBox>
  );
};