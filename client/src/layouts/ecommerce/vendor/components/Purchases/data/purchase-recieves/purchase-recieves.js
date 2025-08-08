import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SoftBox from 'components/SoftBox';

import { dataGridStyles } from '../../../../../Common/NewDataGridStyle';
import { getVendorPurchaseRefund } from '../../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { noDatagif } from '../../../../../Common/CommonFunction';
export const PurchaseRecieves = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [errorTableData, setErrorTableData] = useState(false);
  const [refundTableData, setRefundTableData] = useState([]);

  const columns = [
    {
      field: 'refundId',
      headerName: 'Refund ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 220,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'poNumber',
      headerName: 'PO Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'vendorName',
      headerName: 'Vendor',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'refundDate',
      headerName: 'Refund Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 210,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'refundAmount',
      headerName: 'Refund Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 210,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'refundMethod',
      headerName: 'Refund Method',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 210,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const handleNavigation = (rows) => {
    const poNum = rows.row.poNumber;
    navigate(`/purchase/purchase-orders/details/${poNum}`);
  };

  useEffect(() => {
    setLoader(true);
    getVendorPurchaseRefund(vendorId)
      .then((response) => {
        const data = response.data.data.refundList;
        const refundData = data.map((row) => ({
          refundId: row.refundId !== null ? row.refundId : '---',
          poNumber: row.poNumber !== null ? row.poNumber : '---',
          vendorName: row.vendorName !== null ? row.vendorName : '---',
          refundDate: row.refundDate !== null ? row.refundDate : '---',
          refundAmount: row.refundAmount !== null ? row.refundAmount : '---',
          refundMethod: row.refundMethod !== null ? row.refundMethod : '---',
        }));
        setRefundTableData(refundData);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setErrorTableData(true);
      });
  }, []);

  return (
    <SoftBox py={1}>
      <SoftBox className="softbox-box-shadow">
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
              rows={refundTableData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // checkboxSelection
              disableSelectionOnClick
              onCellClick={(rows) => handleNavigation(rows)}
              getRowId={(row) => row.refundId}
            />
          )}
        </Box>
      </SoftBox>
    </SoftBox>
  );
};
