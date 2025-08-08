import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, InputLabel, Tooltip } from '@mui/material';
import SoftTypography from '../../../../components/SoftTypography';
import { dataGridStyles } from '../../Common/NewDataGridStyle';

const ManufactureAssortment = () => {
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(3); // Adjust based on your data
  const manufactureData = [

  ];
  
  const columns = [
    {
      field: 'manufactureName',
      headerName: 'Manufacture name',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'totalProducts',
      headerName: 'Total products',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Tooltip title="View products" placement="right">
            <SoftTypography
              sx={{
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
              // onClick={() => handleOpen(params.row)} // Pass the row data to handleOpen
            >
              {params?.row?.totalProducts}
            </SoftTypography>
          </Tooltip>
        );
      },
    },
    {
      field: 'totalVariants',
      headerName: 'Total variants',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'vendorAvailability',
      headerName: 'Vendor availability',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  return (
    <div style={{ padding: '15px' }}>
      {/* Add any additional UI elements here */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
          rows={manufactureData}
          columns={columns}
          pageSize={pageSize}
          checkboxSelection
          pagination
          paginationMode="server"
          rowCount={rowCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default ManufactureAssortment;