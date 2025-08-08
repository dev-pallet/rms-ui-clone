import DataTable from 'examples/Tables/DataTable'; 
import SoftBox from 'components/SoftBox';
import dataTableData from 'layouts/ecommerce/product/all-products/components/archived/data/dataTableData';
export const Archived = () =>{
  return (
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