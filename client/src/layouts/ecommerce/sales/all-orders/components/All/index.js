import DataTable from 'examples/Tables/DataTable'; 
import SoftBox from 'components/SoftBox';
import dataTableData from 'layouts/ecommerce/sales/all-orders/components/All/data/dataTableData';
const All = () =>{
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

export default All;