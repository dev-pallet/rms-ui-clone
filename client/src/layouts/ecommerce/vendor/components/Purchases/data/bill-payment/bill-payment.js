import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../../../../Common/NewDataGridStyle';
import { getVendorPurchasePaymentMade } from '../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import Spinner from 'components/Spinner/index';
import { noDatagif } from '../../../../../Common/CommonFunction';
export const BillPayment = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [loader, setLoader] = useState(false);
  const [errorTableData, setErrorTableData] = useState(false);

  const columns = [
    {
      field: 'createdOn',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 120,
    },
    {
      field: 'id',
      headerName: 'Payment ID',
      width: 150,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'purchaseOrderNo',
      headerName: 'P.O Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 220,
    },
    {
      field: 'paymentmethod',
      headerName: 'Payment method',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 140,
    },
    {
      field: 'vendorname',
      headerName: 'Vendor Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 120,
    },
    {
      field: 'billnumber',
      headerName: 'Bill Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 180,
    },

    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 140,
    },
    {
      field: 'edit',
      headerName: 'EXPORT',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 90,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <SoftButton>View</SoftButton>;
      },
    },
  ];

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];
  useEffect(() => {
    setLoader(true);

    getVendorPurchasePaymentMade(vendorId)
      .then((res) => {
        dataArr = res.data.data;
        dataRow.push(
          dataArr?.poPaymentMadeList?.map((row) => ({
            createdOn: row.createdOn ? row.createdOn : '-----',
            id: row.paymentId ? row.paymentId : '-----',
            purchaseOrderNo: row.poNumber ? row.poNumber : '-----',
            paymentmethod: row.paymentMethod ? row.paymentMethod : '-----',
            vendorname: row.vendorName ? row.vendorName : '-----',
            billnumber: row.billNumber ? row.billNumber : '-----',
            amount: row.paidAmount ? row.paidAmount : '-----',
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
    const poNum = rows.row.purchaseOrderNo;
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
