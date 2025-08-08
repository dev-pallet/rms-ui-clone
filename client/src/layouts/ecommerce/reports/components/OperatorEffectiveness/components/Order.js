import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import React, { useEffect, useState } from 'react';
import ReportDetailCard from './ReportDetailCard';
import SoftBox from '../../../../../../components/SoftBox';

const Order = ({ id, pageState, setPageState }) => {
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);

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
      
    ];

    if (id === 'ORDER_RECEIPT_REPRINT') {
      newColumns.push({
        field: 'amount',
        headerName: 'Amount',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      });
    }

    if (id === 'ORDER_RECEIPT_REPRINT') {
      newColumns.push({
        field: 'orderId',
        headerName: 'Order Id',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      });
    }

    if (id === 'ORDER_EDITED') {
      newColumns.push({
        field: 'newOrderId',
        headerName: 'New Order Id',
        minWidth: 80,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        flex: 1,
      });
    }

    if (id === 'ORDER_EDITED') {
      newColumns.push({
        field: 'approvedBy',
        headerName: 'Approved By',
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
        eventId: rowdata?.eventId,
      };

      if (id === 'ORDER_RECEIPT_REPRINT') {
        rowData.amount = rowdata?.meta?.amount !== null ? `₹${rowdata?.meta?.amount}` : 'NA';
        rowData.orderId = rowdata?.meta?.orderId || 'NA';
      }

      if (id === 'ORDER_EDITED') {
        rowData.newOrderId = rowdata?.meta?.newOrderId || 'NA';
        rowData.approvedBy = rowdata?.meta?.approvedByName || 'NA';
      }

      return rowData;
    });

    setRowData(data || []);
  }, [id, pageState.datRows]);

  const isMobileDevice = isSmallScreen();

  const formatName = (name) => {
    const newName = name.replaceAll('_', ' ');
    return newName;
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

export default Order;
