import DataTable from 'examples/Tables/DataTable'; 
import SoftBox from 'components/SoftBox';
import dataTableData from 'layouts/ecommerce/sales/payment-received/components/All/data/dataTableData';
export const Open = () =>{
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