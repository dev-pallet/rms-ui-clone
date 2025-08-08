import './index.css';
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../../components/SoftInput';

export const ProductsTable = (params) => {
  const {
    rows,
    reportList,
    isLoadingReportList,
    pageNo,
    setPageNo,
    pageSize,
    searchText,
    setSearchText,
    debounceSearch,
  } = params;

  const columns = [
    {
      field: 'product_name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 200,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'barcode',
      headerName: 'Barcode',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'exp',
      headerName: 'Expiry Date',
      flex: 1,
      minWidth: 90,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'inventory_count',
      headerName: 'Inventory Count',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'stock_count',
      headerName: 'Stock Count',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (!params.value ? 'N/A' : params.value),
    },
    {
      field: 'variance',
      headerName: 'Variance',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <strong>{params.row.inventory_count - params.row.stock_count}</strong>,
    },
    {
      field: 'verfied',
      headerName: 'Verified',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <SoftBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {params.row.verified ? (
            <DoneIcon color="success" fontSize="medium" />
          ) : (
            <CloseIcon color="error" fontSize="medium" />
          )}
        </SoftBox>
      ),
    },
    {
      field: 'approved',
      headerName: 'Approved',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <SoftBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {params.row.approved ? (
            <DoneIcon color="success" fontSize="medium" />
          ) : (
            <CloseIcon color="error" fontSize="medium" />
          )}
        </SoftBox>
      ),
    },
  ];

  return (
    <SoftBox>
      <SoftBox className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container">
        <Grid container spacing={2} className="all-products-filter" alignItems={'center'}>
          <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
            <Box className="all-products-filter-product">
              <SoftInput
                className="all-products-filter-soft-input-box"
                placeholder="Search Barcode"
                icon={{ component: 'search', direction: 'left' }}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  debounceSearch(e.target.value);
                }}
              />
            </Box>
          </Grid>
          <Grid item lg={6.5} md={6.5} sm={6} xs={12} justifyContent={'right'}>
            <Box display={'flex'} justifyContent={'right'}>
              <div className="stock-dashboard-table-count">{reportList?.totalResult} Products</div>
            </Box>
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox
        sx={{
          width: '100%',
        }}
        className="dat-grid-table-box"
      >
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row?.id}
          rowCount={parseInt(reportList?.totalResult) || 0}
          loading={isLoadingReportList}
          pagination
          paginationMode="server"
          autoHeight
          page={pageNo - 1 || 0}
          pageSize={pageSize}
          rowsPerPageOptions={[pageSize]}
          onPageChange={(newPage) => {
            setPageNo(newPage + 1);
          }}
          disableSelectionOnClick
        />
      </SoftBox>
    </SoftBox>
  );
};
