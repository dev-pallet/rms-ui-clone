import SoftBox from 'components/SoftBox';
import DataTable from 'examples/Tables/DataTable';
import dataTableData from 'layouts/ecommerce/overview/data/dataTableData';
import { useNavigate } from 'react-router-dom';
import styles from './Customer.module.css';
export const Customer = () => {
  const dummy = ['The Godfather', 'Pulp Fiction'];
  const navigate = useNavigate();
  const addCustomer = () => {
    navigate('customer/addcustomer');
  };
  return (
    <SoftBox>
      <SoftBox></SoftBox>
      <SoftBox py={1} className={styles.Container}>
        <DataTable table={dataTableData} entriesPerPage={false} showTotalEntries={false} isSorted={false} noEndBorder />
      </SoftBox>
    </SoftBox>
  );
};
