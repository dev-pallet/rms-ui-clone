import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../../../../Common/NewDataGridStyle';
import { dateFormatter, noDatagif } from '../../../../../Common/CommonFunction';
import { getVendorPurchaseBills } from '../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import SoftBox from 'components/SoftBox';
import Spinner from 'components/Spinner/index';

export const Bill = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [errorTableData, setErrorTableData] = useState(false);

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 140,
    },

    {
      field: 'id',
      headerName: 'Bill Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 180,
    },

    {
      field: 'referencenumber',
      headerName: 'Reference Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 150,
    },

    {
      field: 'vendorname',
      headerName: 'Vendor Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 130,
    },

    {
      field: 'poNumber',
      headerName: 'PO Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 130,
    },

    {
      field: 'status',
      headerName: 'Status',
      type: 'number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 130,
    },

    {
      field: 'duedate',
      headerName: 'Due Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 130,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      width: 130,
    },
    {
      field: 'balancedue',
      headerName: 'Balance Due',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 130,
    },
  ];

  const { vendorId } = useParams();

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];
  useEffect(() => {
    setLoader(true);
    getVendorPurchaseBills(vendorId)
      .then((res) => {
        dataArr = res.data.data;
        dataRow.push(
          dataArr?.purchaseOrderBillList?.map((row) => ({
            date: row.createdOn ? row.createdOn : '-----',
            id: row.billNumber ? row.billNumber : '-----',
            referencenumber: row.referenceNumber ? row.referenceNumber : '-----',
            vendorname: row.tenantName ? row.tenantName : '-----',
            poNumber: row.poNumber ? row.poNumber : '-----',
            status: row.status ? row.status : '-----',
            duedate: row.dueDate ? dateFormatter(row.dueDate) : '-----',
            amount: row.totalAmount ? row.totalAmount : '-----',
            balancedue: row.balance ? row.balance : '-----',
          })),
        );
        setTableRows(dataRow[0]);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        setErrorTableData(true);
      });
  }, []);

  const handleNavigation = (rows) => {
    const poNum = rows.row.poNumber;
    navigate(`/purchase/purchase-orders/details/${poNum}`);
  };

  return (
    <SoftBox py={1}>
      {loader && <Spinner />}
      {!loader && (
        <Box sx={{ height: 400, width: '100%' }}>
          {errorTableData ? (
            <SoftBox className="No-data-text-box">
              <SoftBox className="src-imgg-data">
                <img className="src-dummy-img" src={noDatagif} />
              </SoftBox>

              <h3 className="no-data-text-I">NO DATA FOUND</h3>
            </SoftBox>
          ) : (
            <DataGrid
              sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
              rows={datRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // checkboxSelection
              disableSelectionOnClick
              onCellClick={(rows) => handleNavigation(rows)}
            />
          )}
        </Box>
      )}
    </SoftBox>
  );
};
