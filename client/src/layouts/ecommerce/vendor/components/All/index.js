import DataTable from 'examples/Tables/DataTable';
import SoftBox from 'components/SoftBox';
import dataTableData from 'layouts/ecommerce/vendor/components/All/data/dataTableData';
export const All=()=>{
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