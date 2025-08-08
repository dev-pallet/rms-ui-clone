import { Box, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../../../Common/NewDataGridStyle';
import { getVendorTopItems } from '../../../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';

const VendorDetailsTopItems = () => {
  const [topPurchasedItems, setTopPurchasedItems] = useState([]);
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const columns = [
    {
      field: 'itemName',
      headerName: 'Item name',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'totalPurchase',
      headerName: 'Total purchase',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'totalSales',
      headerName: 'Total sales',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'unitSold',
      headerName: 'Units Sold',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'grossMargin',
      headerName: 'Gross margin',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  useEffect(() => {
    getVendorTopItems(vendorId)
      .then((res) => {
        const responseData = res?.data?.data;
        setTopPurchasedItems(responseData?.vendorPurchaseItemList || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '15px', marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SoftTypography fontWeight="bold" fontSize="14px" mb={0.5}>
          Top items
        </SoftTypography>
        {/* <>
        <ModeEditIcon className="cursorPointer" onClick={() => setDisableBrandEdit(!disableBrandEdit)} />{' '}
      </> */}
      </div>
      <Card className="vendorTablestyle">
        <Box>
          <DataGrid
            sx={dataGridStyles.header}
            rows={topPurchasedItems || []}
            columns={columns}
            getRowId={(row) => row?.itemNo}
            pageSize={10}
            paginationMode="client"
            // pagination
            hideFooter
            // rowCount={parseInt(markDownpg || 0)}
            autoHeight
            disableSelectionOnClick
            onRowClick={(row) => navigate(row?.itemNo)}
          />
        </Box>
      </Card>
    </div>
  );
};

export default VendorDetailsTopItems;
