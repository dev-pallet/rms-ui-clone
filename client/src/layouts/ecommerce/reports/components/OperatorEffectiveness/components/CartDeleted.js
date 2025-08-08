import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { isSmallScreen, productIdByBarcode, textFormatter } from '../../../../Common/CommonFunction';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ReportDetailCard from './ReportDetailCard';
import SoftBox from '../../../../../../components/SoftBox';

const CartDeleted = ({ id, pageState, setPageState }) => {
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const newColumns = [
      {
        field: 'sessionId',
        headerName: 'Session Id',
        minWidth: 60,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      },
      {
        field: 'licenseId',
        headerName: 'License Id',
        minWidth: 60,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      },
      {
        field: 'dayId',
        headerName: 'Day Id',
        minWidth: 40,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      },
      {
        field: 'role',
        headerName: 'Role',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      },
      {
        field: 'cashierName',
        headerName: 'Cashier Name',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      },
      {
        field: 'cartId',
        headerName: 'Cart Id',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      },
    ];

    if (id === 'CART_ITEM_REMOVED') {
      newColumns.push({
        field: 'itemBarcode',
        headerName: 'Item Barcode',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      });
    }

    if (id === 'CART_HOLD') {
      newColumns.push({
        field: 'amount',
        headerName: 'Cart Amount',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      });
    }

    if (id === 'CART_DELETED') {
      newColumns.push({
        field: 'amount',
        headerName: 'Cart Amount',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      });
    }

    setColumns(newColumns);
  }, [id]);

  useEffect(() => {
    const data = pageState.datRows?.map((rowdata) => {
      const rowData = {
        sessionId: rowdata?.sessionId || 'NA',
        licenseId: rowdata?.licenseId || 'NA',
        dayId: rowdata?.dayId || 'NA',
        role: textFormatter(rowdata?.role) || 'NA',
        cashierName: 'NA',
        cartId: rowdata?.meta?.cartId || 'NA',
        eventId: rowdata?.eventId,
      };

      if (id === 'CART_ITEM_REMOVED') {
        rowData.itemBarcode = rowdata?.meta?.itemId || 'NA';
      }

      if (id === 'CART_HOLD') {
        rowData.amount = rowdata?.meta?.cartAmount !== undefined ? `₹${rowdata?.meta?.cartAmount}` : 'NA';
      }

      if (id === 'CART_DELETED') {
        rowData.amount = rowdata?.meta?.amount !== null ? `₹${rowdata?.meta?.amount}` : 'NA';
      }

      return rowData;
    });

    setRowData(data);
  }, [pageState.datRows, id]);

  const isMobileDevice = isSmallScreen();

  const formatName = (name) => {
    const newName = name.replaceAll('_', ' ');
    return newName;
  };

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <div>
      {!isMobileDevice && (
        <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
          <DataGrid
            rows={rowData ? rowData : []}
            columns={columns}
            pagination
            getRowId={(row) => row.eventId}
            paginationMode="server"
            rowCount={pageState.total}
            page={pageState.page - 1}
            pageSize={pageState.pageSize}
            onPageChange={(newPage) => {
              setPageState((old) => ({ ...old, page: newPage + 1 }));
            }}
            onCellClick={(params) => {
              // Check if the clicked column index is less than 4 (first 4 columns)
              if (params.field === 'itemBarcode' && params.row.itemBarcode !== 'NA') {
                handleProductNavigation(params?.row?.itemBarcode);
              }
            }}
          />
        </Box>
      )}
      {isMobileDevice && rowData.length > 0 && (
        <SoftBox sx={{ height: '100% !important', marginBottom: '10px' }}>
          <Typography fontSize="16px" fontWeight={700}>
            {formatName(id)} Details
          </Typography>
          {rowData.map((row) => (
            <ReportDetailCard data={row} id={id} />
          ))}
        </SoftBox>
      )}
    </div>
  );
};

export default CartDeleted;
